-- kb_match_chunks: strong-match arm for machine models, tyre sizes and TRA codes.
-- Applied live to project wlyamhlpowmmavmonbrq on 2026-07-16.
--
-- Problem: the matcher was hybrid (vector UNION keyword) but the final result was
-- re-ranked purely by vector distance, and the ask edge function then dropped any
-- chunk below similarity 0.78. So exact machine-name matches (e.g. the tyres.html
-- chunks that say "fitted to: CAT 992K") were pulled in by the keyword arm and then
-- discarded by the vector-only gate. On top of that the edge function passes the whole
-- natural-language question as query_text, and websearch_to_tsquery ANDs every word,
-- so long questions matched nothing lexically. Net effect: a query like
-- "Best tyre for CAT 992K in iron ore" abstained even though we hold the 45/65R45 L-5
-- pairing for that machine.
--
-- Fix: add a "strong" arm that extracts digit-bearing tokens from the query (machine
-- models like 992K, sizes like 45/65R45, TRA codes like L-5, but NOT bare numbers or
-- years) and exact-substring-matches them against chunk content. Those matches get a
-- similarity floor (0.99) so they always lead the context and survive the edge
-- function's top-K slice. Queries with no such token are pure-vector as before, so
-- ordinary conceptual questions are unchanged (verified: "what does the TRA code mean"
-- still answers from reference.html, not machine-forced).
--
-- Rollback: the previous definition ordered by "c.embedding <=> query_embedding" and
-- returned "1 - (c.embedding <=> query_embedding)" as similarity with only vec+kw arms.

create or replace function public.kb_match_chunks(
  query_embedding vector,
  query_text text default ''::text,
  match_count integer default 20)
returns table(id text, source text, section text, page integer, chunk_position integer, content text, similarity double precision)
language sql
stable
set search_path to 'public', 'extensions'
as $function$
  with toks as (
    -- high-signal tokens: contain a digit AND (a letter or a slash), so machine
    -- models / tyre sizes / TRA codes qualify but bare numbers and years do not.
    select array_agg(distinct m[1]) as arr
    from regexp_matches(coalesce(query_text, ''), '([A-Za-z0-9][A-Za-z0-9/.-]*[0-9][A-Za-z0-9/.-]*)', 'g') m
    where length(m[1]) >= 2
      and ((m[1] ~ '[A-Za-z]' and m[1] ~ '[0-9]') or m[1] ~ '/')
  ),
  vec as (
    select c.id
    from public.kb_chunks c
    where c.embedding is not null
    order by c.embedding <=> query_embedding
    limit match_count
  ),
  kw as (
    select c.id
    from public.kb_chunks c
    where query_text <> ''
      and c.fts @@ websearch_to_tsquery('english', query_text)
    order by ts_rank_cd(c.fts, websearch_to_tsquery('english', query_text)) desc
    limit match_count
  ),
  strong as (
    select c.id
    from public.kb_chunks c, toks
    where toks.arr is not null
      and exists (select 1 from unnest(toks.arr) t where c.content ilike '%' || t || '%')
    limit match_count
  )
  select
    c.id, c.source, c.section, c.page, c.chunk_position, c.content,
    case when c.id in (select id from strong)
         then greatest(1 - (c.embedding <=> query_embedding), 0.99)
         else 1 - (c.embedding <=> query_embedding)
    end as similarity
  from public.kb_chunks c
  where c.embedding is not null
    and c.id in (select id from vec union select id from kw union select id from strong)
  order by similarity desc
  limit match_count * 2
$function$;
