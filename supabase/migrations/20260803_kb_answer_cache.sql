-- Answer cache for the ask edge function. Applied live to project
-- wlyamhlpowmmavmonbrq on 2026-08-04 (AEST).
--
-- Why: the Ask page keeps the question in the URL, so a refresh re-asks it,
-- and the model regenerated a differently-worded answer each time. Clent
-- flagged that the answer changed on refresh. Pinning temperature to 0 is not
-- an option (the model rejects it; the call fails and the portal degrades to
-- the extractive fallback, verified live). So determinism comes from a cache:
-- the first ask generates and stores the response; any repeat of the same
-- question (same prior context) within 7 days serves the stored answer,
-- byte-identical and in under a second instead of 15-35s.
--
-- The cache key is the normalised question plus the normalised prior question
-- ("q||prior"), so follow-ups with different context cache separately. Reads
-- filter on created_at within 7 days; stale rows are simply superseded by
-- upsert when re-asked. Only the generative and general paths cache (pricing
-- and spec lookups are already deterministic and instant).
--
-- Rollback: drop table public.kb_answer_cache; and redeploy the previous
-- edge function version (the code degrades gracefully either way, a missing
-- table just means cache misses).

create table if not exists public.kb_answer_cache (
  key text primary key,
  question text,
  response jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.kb_answer_cache enable row level security;
-- No policies: only the service role (the edge function) reads or writes.
