-- ============================================================
-- PROPOSED FIX PACK 2 — honest hybrid retrieval (NOT APPLIED)
-- Companion to SUPABASE_DB_REVIEW.md finding H2.
--
-- Problem with the current kb_match_chunks: FTS hits only widen
-- the candidate set; ranking AND the 0.80 abstain gate are pure
-- vector similarity. A keyword-exact match (pattern code "CB761")
-- with a middling embedding can never outrank a semantically-close
-- chunk from the wrong brand — which is exactly the recorded
-- failure ("Westlake CB761…" answered from the Bridgestone book).
--
-- This replacement:
--   • ranks by Reciprocal Rank Fusion of vector + FTS rankings
--   • still returns cosine `similarity` so the edge function's
--     existing 0.80/0.78 gates keep working unchanged
--   • adds `rrf_score` and `kw_rank` so the edge function CAN
--     (optionally) trust strong keyword hits that the vector
--     gate alone would discard
--   • optional brand_filter: pass the brand named in the question
--     (matched against kb_specs.brand list) to boost that brand's
--     chunks to the top without excluding the rest.
-- Deploy alongside an edge-function change that passes brand and
-- reads rrf ordering — see 03_edge_function_recommendations.md.
-- ============================================================

create or replace function public.kb_match_chunks_rrf(
  query_embedding vector,
  query_text text default ''::text,
  match_count int default 8,
  brand_hint text default ''::text,   -- e.g. 'Westlake'; '' = no hint
  rrf_k int default 50
)
returns table (
  id text, source text, section text, page int, chunk_position int,
  content text, similarity double precision,
  rrf_score double precision, vec_rank int, kw_rank int
)
language sql stable
set search_path to 'public', 'extensions'
as $$
  with vec as (
    select c.id,
           row_number() over (order by c.embedding <=> query_embedding) as r
    from public.kb_chunks c
    where c.embedding is not null
    order by c.embedding <=> query_embedding
    limit greatest(match_count * 4, 30)
  ),
  kw as (
    select c.id,
           row_number() over (
             order by ts_rank_cd(c.fts, websearch_to_tsquery('english', query_text)) desc
           ) as r
    from public.kb_chunks c
    where query_text <> ''
      and c.fts @@ websearch_to_tsquery('english', query_text)
    limit greatest(match_count * 4, 30)
  ),
  fused as (
    select coalesce(v.id, k.id) as id,
           coalesce(1.0 / (rrf_k + v.r), 0) + coalesce(1.0 / (rrf_k + k.r), 0) as score,
           v.r as vec_rank, k.r as kw_rank
    from vec v
    full outer join kw k using (id)
  )
  select
    c.id, c.source, c.section, c.page, c.chunk_position, c.content,
    1 - (c.embedding <=> query_embedding) as similarity,
    -- gentle brand boost: chunks whose source mentions the hinted brand
    -- rank first among comparable scores, others are not excluded
    f.score * case
      when brand_hint <> '' and c.source ilike '%' || brand_hint || '%' then 1.5
      else 1.0
    end as rrf_score,
    f.vec_rank, f.kw_rank
  from fused f
  join public.kb_chunks c on c.id = f.id
  where c.embedding is not null
  order by rrf_score desc
  limit match_count
$$;

grant execute on function public.kb_match_chunks_rrf(vector, text, int, text, int)
  to service_role;
revoke execute on function public.kb_match_chunks_rrf(vector, text, int, text, int)
  from anon, authenticated, public;

-- Keep the old kb_match_chunks until the edge function has switched,
-- then drop it:
-- drop function if exists public.kb_match_chunks(vector, text, integer);
