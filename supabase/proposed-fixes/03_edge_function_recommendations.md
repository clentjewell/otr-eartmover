# Proposed edge-function & front-end changes (companion to SUPABASE_DB_REVIEW.md)

These are code recommendations, not applied. The `ask` edge function source is
committed at `supabase/functions/ask/index.ts` but is at
one revision behind deployed v11 on project `wlyamhlpowmmavmonbrq`
(the committed copy lacks v11's em-dash backstop, `deDash`; prose-only
excerpts and the comparative-question exclusion are already committed).
Fix C1 — syncing deployed v11 back into the repo — should happen
first, so the changes below go through review against the real code.

## 1. Track A lookup (fix H1)

- Normalise both sides: query `kb_specs` on `tyre_size_norm` (added by fix pack 1)
  with `upper(size.replace(/\s+/g, ""))` — today whitespace/case variants in the
  DB (965 rows) can never match.
- Widen `SIZE_RE` to the families actually in the table, e.g. add:
  - `\d{1,2}(\.\d{1,2})?-\d{1,2}(\.\d)?` — "10-16.5", "17.5-25"
  - `\d{1,2}\s*[xX]\s*\d{1,2}(\.\d)?` — "10 x 16.5"
  - `\d{2,3}/\d{2,3}\s*[RD]\s*\d{1,2}(\.\d)?` — "280/75R22.5", "46/90R57"
  Keep COMPARE_RE exclusion as-is.
- Raise `LIMIT 10` awareness: after fix-pack-1 dedupe this matters less, but sort
  deterministically (`order by brand, pattern`) so the table is stable between asks.

## 2. Verification honesty (fix C2)

Until a human review workflow exists, change the Track A suggestion copy from
"dual-pass verified and signed off" to wording that matches reality, e.g.:

> "Transcribed by automated extraction from the cited databook edition and
> spot-checked, not generated. Confirm against the current manufacturer
> specification before you act."

If/when human review starts, `verified_at`/`verified_by` become meaningful and
the original copy can return. Do not ship copy the data can't back.

## 3. Retrieval (fix H2)

- Switch the RPC to `kb_match_chunks_rrf` (fix pack 2), passing a `brand_hint`
  extracted from the question (match against the distinct `kb_specs.brand` list,
  case-insensitive; longest match wins).
- Keep the existing 0.80 lede-confidence and 0.78 excerpt gates on `similarity`,
  but additionally accept chunks with `kw_rank <= 3` (strong keyword hits) into
  the context even when their cosine similarity is below the excerpt gate —
  they're exactly the pattern-code matches the vector model under-rates.
- Log `top_source` per answer already happens; also log the top similarity and
  whether the top chunk was vector- or keyword-recalled, so threshold tuning has
  data.

## 4. Corpus (fix H3)

- Re-ingest: `Yokohama-ATG-Full-Catalogue-2025.pdf`, `Michelin-Truck-Tyre-DataBook-21st.pdf`
  (0 chunks each) and the twelve ≤4-chunk databooks (Bridgestone-2018: 3,
  Techking: 3, MRF: 3, Linglong: 2, Bridgestone-Truck-2023: 2, …). A 200-page
  databook at 3 chunks is not represented, it's a placeholder.
- Rebalance: one WorkSafe PDF is 23% of all chunks; it will dominate
  safety-adjacent retrievals. That's arguably fine (it's authoritative) but be
  deliberate about it.
- Prune the 16 chunks under 200 chars (header debris) on next re-ingest.

## 5. Front-end (fixes F1–F4) — `ask.html`

(The page already has a 30s abort timeout, one retry, an honest unreachable
state, and related-question chips — these are the remaining gaps.)

- Sanitise `lede`/`answer`/`suggestion` HTML before `innerHTML` (allowlist
  `p ul li strong em sup a[href^="https:"] table tr th td div`), and escape
  `x.source` where it's interpolated inside a link (ask.html:424).
- Distinguish HTTP errors from network blips: surface the server's `error`
  message (e.g. the 400 query-too-long) instead of "a brief network blip",
  and mirror the 500-char query cap client-side.
- When a canned prefab answer is served on the failure path, label it as an
  offline reference answer.
- Add a thumbs up/down widget writing to `kb_feedback` **through the edge
  function** (service role) — direct PostgREST inserts fail by design
  (RLS deny-all), which is correct. Down-votes become the human review queue
  that makes the "verified" claim (fix 2) real over time.

## 6. Ops (fixes C1, F5, M5)

- Sync deployed `ask` v11 → `supabase/functions/ask/index.ts`
  so the repo copy is the source of truth; remove or explicitly gate the
  `VECTORIZE_INDEX` auto-switch in `functions/api/ask.js`; retire
  `worker/api/ask.js` or move it to `attic/`.
- Rewrite `RAG-GO-LIVE.md`'s status section (it still says Vectorize/D1 are
  bound and live; commit e8d02ca unbound them — Supabase is the live path) and
  reconcile `DEPLOY_CHECKLIST.md` with `worker/DEPLOY_ASK.md`.
- Sweep remaining `otrearthmovertyre.com` vs `otrearthmover.com` domain drift
  (robots.txt, sitemap.xml, wrangler.toml, CORS header).
- After applying fix packs, re-run the Supabase advisors (security + performance)
  and confirm the duplicate-index WARN and permissive-policy WARN clear.
