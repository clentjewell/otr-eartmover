# OTR Earthmover Tyre

Static site + Knowledge Portal backend for [otrearthmovertyres.com](https://otrearthmovertyres.com).

Split out from the combined `clentjewell/jewelltyres` repo into its own
dedicated repo. Jewell Tyres (`jewelltyres.com.au`) remains in
`clentjewell/jewelltyres`.

## Structure

```
index.html, about.html, ask.html, ...   Site pages (static HTML)
css/, js/, public/                      Assets
sizes/, machines/, tra/, tyres/         Programmatic SEO pages
functions/api/                          Cloudflare Pages Functions (/api/*)
worker/                                 Cloudflare Worker for the Knowledge
                                         Portal RAG endpoint (/api/ask)
supabase/                               Supabase edge function + migrations
                                         (fallback RAG backend)
tyre_rag/                               Python pipeline: PDF extraction,
                                         chunking, corpus build
rag-sources/                            Source PDFs/docs for the RAG corpus
scripts/rag-ingest.js                   Node script: embeds + upserts the
                                         corpus into Cloudflare Vectorize
wrangler.toml                           Cloudflare Worker config
```

## Deploy

- **Pages:** `npx wrangler pages deploy . --project-name otr-earthmover-tyre --branch main`
- **Knowledge Portal worker:** `wrangler deploy` (uses `wrangler.toml`)
- **RAG go-live / re-ingest:** `./deploy-rag.sh` — see `RAG-GO-LIVE.md` for
  current production status and `worker/README.md` for the full operator
  runbook.

## Docs

- `RAG-GO-LIVE.md` — current production status of the Ask portal
- `worker/README.md` — Knowledge Portal worker setup, deploy, troubleshooting
- `worker/DEPLOY_ASK.md`, `worker/eval-queries.md` — deploy + eval detail
- `MARKET_NOTES_TEMPLATE.md`, `MARKET_NOTES_BACKLOG.md` — Market Notes
  editorial pattern and source backlog
- `tyre_rag/README.md`, `tyre_rag/STORAGE.md` — RAG corpus pipeline detail
- `CLAUDE.md` — house rules for content, voice, and repo conventions

See `CLAUDE.md` for a known cross-repo coupling that needs resolving on the
`jewelltyres` side after this split.
