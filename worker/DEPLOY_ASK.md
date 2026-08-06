# Switching on the Ask portal (live RAG answers)

The Ask page already calls `POST /api/ask` and falls back to the demo set when
the worker isn't reachable. To make it answer for real from the databooks, do
the following on your Cloudflare account. Only two things are required: the
corpus ingested and the worker deployed.

**Recommended (cheapest, zero hallucination): extractive mode.** If you do NOT
set an Anthropic key, the worker answers by returning the databooks' **verbatim
passages** with page-deep-linked sources. No language model runs, so there is no
generation cost and nothing can be mis-stated — the answer is the book's own
words, and the sources change with every question. The only cost is Cloudflare
Workers AI embeddings (fractions of a cent) plus Vectorize.

**Optional upgrade: generative summary.** Set `ANTHROPIC_API_KEY` (step 3) and
the worker adds a readable summary composed strictly from the same retrieved
passages, shown above the verbatim extracts. This adds a per-query LLM cost and
a small paraphrase surface (mitigated by the grounding rules + the verbatim
extracts shown beneath).

## 1. Build the corpus (no API keys needed for this step)

The `tyre_rag` pipeline extracts the databook prose; we export it to JSONL for
ingest. Track B (explanatory text) needs no vision/LLM keys — the databooks
have text layers.

```bash
cd tyre_rag
python3 -m pip install -r requirements.txt
python -m tyre_rag.scripts.sync_sources           # stage the OTR/Ag databooks
python -m tyre_rag.scripts.build_corpus_jsonl      # text-only chunk -> tyre_rag/index/prose_chunks.jsonl
```

(Fast path, no rasterising. ~6,600 chunks from 33 databooks. Three image-only
books — AS4457 summary, MRF-OTR-2023, Triangle-OTR-2020 — yield no text and
need OCR later.)

The API is served as a **Cloudflare Pages Function** (`functions/api/ask.js`),
so it deploys with the site through the existing GitHub -> Pages build and
answers same-origin at `/api/ask`. You do not deploy a separate Worker.

## 2. Create the Vectorize index and ingest

```bash
export CLOUDFLARE_ACCOUNT_ID=...        # your account id
export CLOUDFLARE_API_TOKEN=...         # token with Vectorize + Workers AI

# bge-base-en-v1.5 outputs 768-dim vectors (matches wrangler.toml)
wrangler vectorize create otr-corpus --dimensions=768 --metric=cosine

cd otr-earthmover-tyre
node scripts/rag-ingest.js               # reads the JSONL, embeds, upserts
```

`rag-ingest.js` prefers `tyre_rag/index/prose_chunks.jsonl`. Each chunk keeps
`metadata.source` = the databook filename, so the worker resolves it to the
verified public PDF link in the citation.

## 3. Bind the index to the Pages project (one-time, in the dashboard)

The Pages Function needs the bindings at runtime. In the Cloudflare dashboard:
**Workers & Pages -> otr-earthmover-tyre -> Settings -> Functions -> Bindings**, add:

- **Workers AI** binding named `AI`
- **Vectorize** binding named `VECTORIZE_INDEX` -> index `otr-corpus`
- (optional) **D1** binding `SPECS` -> `otr-specs` for verified numeric specs
- (optional secret) `ANTHROPIC_API_KEY` for the generated summary

Then redeploy the Pages project (any push, or "Retry deployment"). No Anthropic
key = extractive mode (verbatim passages, cheapest, zero hallucination). With a
key, a grounded summary is added above the verbatim extracts.

The Function (`functions/api/ask.js` -> `worker/api/ask.js`): embeds the
question with Workers AI, queries `otr-corpus` (top-8, cosine ≥ 0.65), and
**returns the matching databook passages verbatim** with page-deep-linked
sources. If nothing relevant is retrieved it says so and points to David — it
never invents.

## 4. Verify

- Open `/ask`, ask "What is a TRA E-4 service code?" — it should answer from the
  corpus with linked sources, not the demo canned text.
- Run the eval set in `worker/eval-queries.md` (target ≥10/15 Tier 1+2 pass).
- Remove the "DEMO MODE" banner in `ask.html` once you've confirmed live answers.

## How the worker keeps answers accurate (two tracks)

- **Numeric questions** (a size like `40.00R57`, or a TRA code + a value word
  like "rim for E-4") are routed to **Track A**: exact lookup of verified,
  signed-off figures, reproduced **verbatim** — or it **abstains** and points to
  the OEM. The language model is never in this path. Until the D1 spec store is
  wired (Phase 2 below), these questions abstain safely.
- **Explanatory questions** are answered by **Track B** RAG: composed only from
  retrieved databook passages, each citation deep-linked to the exact page
  (`…/databook.pdf#page=N`). The prompt forbids stating any numeric spec value
  and forbids claims not supported by a retrieved passage.

## Phase 2 — wire the verified numeric specs (needs the extraction run)

1. In `tyre_rag`, run the dual-pass extraction with vision keys, work the review
   queue, sign off, and `--commit` so `spec_records.servable=1` is populated.
2. Create the D1 store and load the signed-off rows:
   ```bash
   wrangler d1 create otr-specs
   wrangler d1 execute otr-specs --file=./worker/specs-schema.sql
   # export servable spec_records -> insert into the specs table (servable=1)
   ```
3. Uncomment the `[[d1_databases]]` binding in `wrangler.toml` (with the
   database_id), then `wrangler deploy`. Numeric questions now return verbatim
   verified figures with the source crop; otherwise they keep abstaining.

## Notes

- Re-run the corpus steps whenever the databook set changes; ingest is
  idempotent per chunk id. Page deep-links require the page-bearing export
  (`export_chunks_jsonl` includes it).
- Confirm the production domain in `worker/api/ask.js` CORS header and the
  `wrangler.toml` route both match (otrearthmovertyres.com).
