-- ============================================================
-- PROPOSED FIX PACK 1 — kb hygiene (NOT APPLIED)
-- Companion to SUPABASE_DB_REVIEW.md. Review each section and
-- apply via supabase MCP apply_migration / SQL editor once the
-- team signs off. Sections are independent; apply in order.
-- Project: wlyamhlpowmmavmonbrq
-- ============================================================

-- ------------------------------------------------------------
-- §1  Track A reachability (review H1)
--     Normalised size column + index. The edge function should
--     query:  WHERE tyre_size_norm = upper(regexp_replace(q_size,'\s+','','g'))
-- ------------------------------------------------------------
alter table public.kb_specs
  add column if not exists tyre_size_norm text
  generated always as (upper(regexp_replace(tyre_size, '\s+', '', 'g'))) stored;

create index if not exists kb_specs_size_norm_idx
  on public.kb_specs (tyre_size_norm);

-- ------------------------------------------------------------
-- §2  Dedupe the 111 exact-duplicate rows (review M2), then
--     block re-entry. Keeps the lowest id of each duplicate set.
-- ------------------------------------------------------------
delete from public.kb_specs a
using public.kb_specs b
where a.id > b.id
  and a.brand = b.brand
  and a.pattern       is not distinct from b.pattern
  and a.tyre_size     =               b.tyre_size
  and a.tra_code      is not distinct from b.tra_code
  and a.star_rating   is not distinct from b.star_rating
  and a.load_rating   is not distinct from b.load_rating
  and a.rim           is not distinct from b.rim
  and a.inflation_kpa is not distinct from b.inflation_kpa
  and a.tkph          is not distinct from b.tkph;

-- Uniqueness guard (unique index treats NULLs as distinct, so use
-- coalesced expression index to catch the real-world duplicate shape):
create unique index if not exists kb_specs_dedupe_idx
  on public.kb_specs (
    brand,
    coalesce(pattern, ''),
    tyre_size,
    coalesce(tra_code, ''),
    coalesce(star_rating, ''),
    coalesce(load_rating, ''),
    coalesce(rim, ''),
    coalesce(inflation_kpa, -1),
    coalesce(tkph, -1)
  );

-- ------------------------------------------------------------
-- §3  Quarantine impossible values + sanity constraints (review C2)
--     3 rows today: id 7191 (12300 kPa), ids 5870/5905 (1300 kPa).
--     Un-verify rather than delete, so they surface in a review queue.
-- ------------------------------------------------------------
update public.kb_specs
set verified_at = null,
    notes = coalesce(notes || ' | ', '') || 'QUARANTINED ' || now()::date
            || ': inflation_kpa=' || inflation_kpa || ' outside plausible range'
where inflation_kpa <= 0 or inflation_kpa > 1200;

alter table public.kb_specs
  add constraint kb_specs_kpa_range
  check (inflation_kpa is null or (inflation_kpa > 0 and inflation_kpa <= 1200))
  not valid;          -- validate after quarantine:
-- alter table public.kb_specs validate constraint kb_specs_kpa_range;

alter table public.kb_specs
  add constraint kb_specs_tkph_positive
  check (tkph is null or tkph > 0)
  not valid;

-- ------------------------------------------------------------
-- §4  Drop the duplicate HNSW index on kb_chunks (review M1,
--     Supabase advisor WARN). Keep kb_chunks_embedding_hnsw.
-- ------------------------------------------------------------
drop index if exists public.kb_chunks_embedding_idx;

-- Legacy unused vector index on the retired pipeline (advisor INFO):
-- (only if §6 archive/drop is NOT taken yet)
-- drop index if exists public.chunks_embedding_idx;

-- ------------------------------------------------------------
-- §5  Revoke over-broad client grants (review M3). RLS already
--     denies row access, this is defence in depth. Keep the one
--     deliberate write path: enquiries INSERT for anon.
-- ------------------------------------------------------------
revoke insert, update, delete, truncate, references, trigger
  on all tables in schema public from anon, authenticated;
grant insert on public.enquiries to anon;
-- Note: a plain PostgREST insert (Prefer: return=minimal) needs only INSERT.
-- RLS has no SELECT policy on enquiries, so anon can't read rows back either
-- way; don't add SELECT grants unless the client switches to
-- return=representation AND a SELECT policy is deliberately added.

-- ------------------------------------------------------------
-- §6  Retire the legacy RAG pipeline (review M5) — after
--     confirming nothing external calls match_chunks/ingest-url.
--     Step 1: archive (cheap, reversible)
-- ------------------------------------------------------------
-- alter table public.documents   rename to zz_retired_documents;
-- alter table public.chunks      rename to zz_retired_chunks;
-- alter table public.ingest_jobs rename to zz_retired_ingest_jobs;
-- drop function if exists public.match_chunks(vector, integer, double precision);
--
-- Step 2 (later, once confident): drop the zz_ tables and the
-- ingest-url edge function from the dashboard.

-- Mark the stuck ingest job so state stops lying (review H3):
update public.ingest_jobs
set status = 'failed',
    error  = coalesce(error, 'stalled at p' || pages_done || '/' || total_pages
             || '; resumer cron disabled; marked failed by 2026-07-13 review')
where status = 'running'
  and updated_at < now() - interval '1 day';

-- Corpus reconciliation check (run any time; expect zero rows):
-- select s.id, s.title from public.kb_sources s
-- where not exists (select 1 from public.kb_chunks c where c.source = s.title);

-- ------------------------------------------------------------
-- §7  Secret hygiene (review H4) — the resumer cron is disabled
--     and its function embeds a static x-ingest-key + anon JWT.
--     ROTATE the x-ingest-key secret on the ingest-url function
--     first, then remove the leaking definition:
-- ------------------------------------------------------------
-- drop function if exists public.resume_stalled_ingests();
-- If the resumer is still wanted, recreate it reading the key from
-- Vault:  select decrypted_secret from vault.decrypted_secrets
--         where name = 'ingest_key'
-- and store the key there instead of in the function body.
