# OTR Knowledge Portal — status

**The Ask page is live.** Verified against the deployed production stack:
Cloudflare Vectorize + Workers AI + D1 (`SPECS`) + `ANTHROPIC_API_KEY` are all
bound and populated — the portal answers from real manufacturer databooks
(Titan, Alliance, Westlake, CEAT, Techking, and more) in generative mode, with
verified numeric specs served from D1, and citations on every generative
answer. No further Cloudflare setup is required.

A parallel, independent RAG backend also exists on Supabase (project
`jewelltyres`, org `Jewell Org`) — see § Supabase backend below — and
`functions/api/ask.js` automatically prefers Cloudflare Vectorize when it's
bound (as it is now), falling back to Supabase only if that binding is ever
removed.

## What "live" means, concretely

- `POST /api/ask` on both Pages projects (`jewelltyres`, `otr-earthmover-tyre`)
  answers from the real corpus, not the demo set.
- `ask.html`'s suggestion chips and free-text box both call the live API
  first, falling back to the hardcoded demo answers only if the API is
  unreachable — no more "Demo mode" banner.
- Numeric spec questions (e.g. "recommended rim and inflation for 26.5R25")
  are served from D1 signed-off records verbatim, or abstain and escalate to
  David — never generated.
- Out-of-corpus questions get a clearly labelled general-guidance fallback via
  Workers AI/Claude, never a fabricated spec.

## A bug found and fixed while verifying

Generative-mode answers were leaking raw formatting (`# ANSWER`, `**LEDE:**`,
stray ` ```json ` fences) into the rendered answer, because the system prompt
asked Claude for a JSON object and the parser used `JSON.parse` — which broke
whenever the model wrapped the reply in a code fence or the HTML body
contained literal quotes that weren't escaped correctly. Fixed by switching
to plain sentinel markers (`===LEDE===` / `===BODY===` / `===END===`) that
don't require JSON escaping at all, with JSON and sentence-split as further
fallbacks. See `worker/api/ask.js` → `parseClaudeResponse`.

## Local corpus / testing

A first-party corpus is committed at `tyre_rag/index/prose_chunks.jsonl`
(172 chunks: WorkSafe WA guideline, Jewell Tyres knowledge base, the site's
technical reference, and the tyre guide) — this is what backs the Supabase
fallback and was used to test the worker end-to-end with stubbed bindings
before verifying against production. It's not what production actually
answers from (production's Vectorize index has real manufacturer databooks),
but it's useful for local testing or as a base to extend the Supabase side.

To add more manufacturer databooks to the *Supabase* corpus:
```bash
python3 -m pip install -r tyre_rag/requirements.txt
python3 -m tyre_rag.scripts.sync_sources          # downloads the databook PDFs
python3 -m tyre_rag.scripts.build_corpus_jsonl    # rebuilds prose_chunks.jsonl
cp tyre_rag/index/prose_chunks.jsonl data/corpus.jsonl
# then call the kb-ingest Supabase edge function with {"action":"load","url":"<site>/data/corpus.jsonl"}
# followed by {"action":"embed"} (self-continues until fully embedded)
```
Note: `rag-sources/AS4457-Earthmoving-Tyre-Standard-Summary.pdf` is a scanned
image PDF (no text layer) so it isn't ingested as-is — the AS4457 content in
the first-party corpus comes from the site's reference page instead.

To add more to the *Cloudflare* corpus (the one actually serving production),
use `scripts/rag-ingest.js` against the `otr-corpus`
Vectorize index as before — that part of the pipeline is unchanged.

## Supabase backend (fallback / redundancy)

Project `wlyamhlpowmmavmonbrq` ("jewelltyres", org "Jewell Org"):
- `kb_chunks` (pgvector, 384-dim, `gte-small` via the edge runtime) holds the
  172-chunk first-party corpus, fully embedded, with an HNSW cosine index.
- `kb_specs` holds verified numeric specs (empty — add signed-off rows here
  if you want Track A answers on this backend).
- Edge functions: `ask` (same contract/rules as `worker/api/ask.js`:
  extractive by default, generative if `ANTHROPIC_API_KEY` is set as a
  function secret, general fallback, Track A abstain), `kb-ingest` (load the
  corpus from a URL + embed it), `kb-match_chunks`/`kb_lookup_specs` (RPCs).
- Thresholds tuned against the live corpus: on-topic matches score
  0.86–0.94 (gte-small cosine), the highest off-topic probe scored 0.77 —
  `CONFIDENT_TOP=0.80`, `EXCERPT_MIN=0.78`.

This exists so the Ask page keeps working even if the Cloudflare bindings are
ever removed or the account changes — `functions/api/ask.js` checks
`env.VECTORIZE_INDEX` and proxies to Supabase automatically when it's absent.

## Modes recap

| Mode | Needs | Cost | Behaviour |
|---|---|---|---|
| **Extractive** | Workers AI + Vectorize (no key) | ~free | Returns corpus passages **verbatim** with deep-linked sources. Zero hallucination. |
| **Generative** (live in production) | + `ANTHROPIC_API_KEY` | per-query LLM | Plain-language summary composed strictly from retrieved passages, with citations. |
| **Numeric specs** (live in production) | D1 `SPECS` | — | Exact lookup of load/rim/inflation/TKPH from signed-off records; **never** generated — abstains if not held. |
| **General fallback** (live in production) | Workers AI `AI` (or `ANTHROPIC_API_KEY`) | tiny | When the corpus returns nothing relevant, general OTR guidance, clearly labelled "not from our verified databooks." Never states a numeric spec; escalates to David. |
