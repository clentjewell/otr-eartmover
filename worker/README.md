# Knowledge Portal RAG worker

The `/api/ask` endpoint on otrearthmovertyres.com is a Cloudflare Worker that powers the Knowledge Portal. Pipeline:

1. Receive `POST /api/ask` with `{ q: string }`
2. Embed the query via Cloudflare Workers AI (`@cf/baai/bge-base-en-v1.5`)
3. Query Vectorize index `otr-corpus` for top 8 similar chunks (cosine ≥0.65)
4. Compose retrieved context + system prompt
5. Call Anthropic Claude (`claude-sonnet-4-5-20250929`) for grounded completion
6. Parse response into lede + body + citations
7. Append disclaimer; flag escalation if commercial-decision query

---

## Files in this directory

| File | Purpose |
|---|---|
| `api/ask.js` | The worker handler. Cloudflare entrypoint. |
| `system-prompt.md` | Voice, grounding, and hard-boundary rules for Claude. |
| `eval-queries.md` | 15 test queries (Tier 1 / 2 / 3) for post-ingestion eval. |
| `README.md` | This file. |

See also at repo root:
- `wrangler.toml` (in `../`) — Cloudflare config with AI + Vectorize bindings
- `scripts/rag-ingest.js` (in `../scripts/`) — chunks and uploads source docs
- `../.env.local.example` — env var template

---

## Operator setup steps

### 1. Local environment

```bash
cd <repo-root>
cp .env.local.example .env.local
# Edit .env.local — add CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, ANTHROPIC_API_KEY
npm install -g wrangler   # if not already installed
wrangler login
```

### 2. Create the Vectorize index (one-off)

```bash
wrangler vectorize create otr-corpus --dimensions=768 --metric=cosine
```

### 3. Set the Anthropic secret in production

```bash
wrangler secret put ANTHROPIC_API_KEY
# Paste API key when prompted.
```

### 4. Ingest the corpus

```bash
node scripts/rag-ingest.js
```

The ingest script reads from `./rag-sources/` at the repo root. Currently expects:
- `JEWELL-TYRES-KNOWLEDGE-BASE.md` (downloaded — 18KB)
- `WorkSafe-WA-Earthmover-Tyre-Safety-Guideline.pdf` (downloaded — 1.5MB; requires `pdf-parse`)
- `AS4457-Earthmoving-Tyre-Standard-Summary.pdf` (downloaded — 2.85MB; requires `pdf-parse`)

**PDF parsing.** The current ingest script logs a warning and skips PDFs. To enable PDF ingestion:

```bash
npm install pdf-parse
```

Then in `rag-ingest.js`, replace the warning block in `readFileAsText()` with:
```js
if (/\.pdf$/i.test(filePath)) {
  const pdfParse = (await import('pdf-parse')).default;
  const buf = await fs.readFile(filePath);
  const data = await pdfParse(buf);
  return data.text;
}
```

### 5. Deploy the worker

```bash
wrangler deploy
```

### 6. Run eval

See `eval-queries.md`. Run each query through `https://otrearthmovertyres.com/api/ask`. Score Pass / Marginal / Fail. Target ≥10/15 Tier 1+2 Pass and ≥4/5 Tier 3 Pass.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `502 Bad Gateway` on `/api/ask` | ANTHROPIC_API_KEY not set as worker secret | Re-run `wrangler secret put ANTHROPIC_API_KEY` |
| "I don't have that in my sources" for known-answer queries | Vectorize index empty or threshold too high | Confirm ingestion completed; lower threshold from 0.65 to 0.55 in `api/ask.js` |
| Worker times out (>30s) | Claude response too large or retrieval slow | Reduce `max_tokens` from 1500 to 800; reduce `topK` from 8 to 5 |
| Wrong citations | Chunking too coarse | Reduce CHUNK_SIZE from 800 to 500 in `rag-ingest.js`, re-ingest |
| Marketing-speak in answers | System prompt not strict enough | Tighten the "VOICE RULES" section in `system-prompt.md`, redeploy |

---

## Demo mode (no API key)

`ask.html` includes 5 pre-canned responses for when production RAG is not yet deployed. These remain functional regardless of API status. Verify the demo mode by visiting `/ask.html` and trying any of the suggested questions.
