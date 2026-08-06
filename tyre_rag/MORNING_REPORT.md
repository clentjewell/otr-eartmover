# Morning report — OTR tyre-data ingestion

Generated: 2026-05-31T12:39:32
Run mode: **CANDIDATES ONLY (no numbers published)**
Extraction mode: **no-model-fallback**

> WARNING: no extraction-provider key was set. Track A ran the deterministic no-model heuristic, which never produces a servable record — every spec row is forced to the review queue. This run proves the pipeline end to end; it does not produce verified specs. Set EXTRACT_PROVIDER_A_KEY / EXTRACT_PROVIDER_B_KEY and supply real databooks in sources/ for a genuine Track A run.

> NOTE: no EMBED_PROVIDER_KEY set — Track B used fallback hashed embeddings (retrieval plumbing only, weaker semantics).

## Counts

| metric | value |
|---|---|
| files processed | 2 |
| files skipped (unchanged) | 1 |
| pages | 103 |
| candidate spec rows (per-pass) | 10 |
| merged spec records | 5 |
| high-confidence records | 0 |
| needs review | 5 |
| servable (signed off + committed) | 0 |
| prose chunks | 72 |
| dual-pass agreement rate | 0.0% |
| estimated cost | $0.0000 |

## Self-test — gold-standard Q&A

5/5 passed.

| # | expect | result | pass | query |
|---|---|---|---|---|
| 1 | answer | grounded | PASS | Explain the AS4457 earthmoving tyre standard in plain English. |
| 2 | answer | grounded | PASS | What are the key safety requirements for handling and inflating earthmover tyres? |
| 3 | abstain | abstained | PASS | What is the recommended inflation pressure for a 40.00R57? |
| 4 | abstain | abstained | PASS | What rim is recommended for 27.00R49? |
| 5 | abstain | abstained | PASS | What is the rim recommendation for size 99.99R99 code G-9? |

## Sampling audit (high-confidence spot-check)

No high-confidence records to sample (expected in no-model-fallback mode).

## Review these first — safety-critical fields

Records where inflation, load, or rim is in dispute or failed a gate:

None flagged on safety-critical fields.

Full review queue: `REVIEW_QUEUE.csv` (5 rows).
