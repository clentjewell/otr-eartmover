#!/usr/bin/env bash
#
# OTR Earthmover Tyre — RAG go-live (extractive mode; NO external LLM key needed).
# Creates the Vectorize index and ingests the corpus embeddings.
#
# A ready-to-ingest corpus (tyre_rag/index/prose_chunks.jsonl) is COMMITTED to
# the repo — built from the AS4457/WorkSafe source PDFs, the Jewell knowledge
# base, the site's reference content, and the tyre guide. So the minimum
# requirements are just Node + wrangler + Cloudflare auth:
#     wrangler login                       # easiest, or:
#     export CLOUDFLARE_API_TOKEN=...       # token w/ Workers AI + Vectorize (+D1 optional)
#     export CLOUDFLARE_ACCOUNT_ID=...      # dashboard right sidebar
#
#     ./deploy-rag.sh
#
# Optional: with python3 available, the script first syncs the manufacturer
# databooks (Google Drive, ~400 MB) and rebuilds the corpus to include them.
# If that fails (offline, no python), it falls back to the committed corpus.
#
# After this script: add the runtime bindings in the Cloudflare dashboard
# (Workers & Pages -> otr-earthmover-tyre -> Settings -> Functions/Bindings):
#     AI (Workers AI)  ·  VECTORIZE_INDEX -> otr-corpus
#     (optional) D1 SPECS -> otr-specs  ·  (optional secret) ANTHROPIC_API_KEY
# Then redeploy the Pages project. The Ask page switches from demo to live automatically.

set -euo pipefail
cd "$(dirname "$0")"   # repo root

command -v wrangler >/dev/null 2>&1 || { echo "ERROR: install wrangler first  -> npm install -g wrangler"; exit 1; }
: "${CLOUDFLARE_ACCOUNT_ID:?ERROR: export CLOUDFLARE_ACCOUNT_ID (and authenticate via 'wrangler login' or CLOUDFLARE_API_TOKEN)}"

echo "==> 1/3  Corpus (committed corpus works out of the box; databooks optional)"
if command -v python3 >/dev/null 2>&1; then
  ( python3 -m pip install -q -r tyre_rag/requirements.txt \
    && python3 -m tyre_rag.scripts.sync_sources \
    && python3 -m tyre_rag.scripts.build_corpus_jsonl ) \
    || echo "    (databook sync/build failed — continuing with the committed corpus)"
else
  echo "    (python3 not found — using the committed corpus: first-party sources only)"
fi
[ -s tyre_rag/index/prose_chunks.jsonl ] || { echo "ERROR: tyre_rag/index/prose_chunks.jsonl missing"; exit 1; }

echo "==> 2/3  Create the Vectorize index (idempotent)"
wrangler vectorize create otr-corpus --dimensions=768 --metric=cosine \
  || echo "    (otr-corpus may already exist — continuing)"

echo "==> 3/3  Embed + upsert the corpus into Vectorize"
node scripts/rag-ingest.js

cat <<'DONE'

==> CLI steps complete.

Final manual step (one-time, Cloudflare dashboard):
  Workers & Pages -> otr-earthmover-tyre -> Settings -> Functions -> Bindings
    - Workers AI binding named:  AI
    - Vectorize binding named:   VECTORIZE_INDEX   -> index: otr-corpus
    - (optional) D1 binding:     SPECS             -> otr-specs   (verified numeric specs)
    - (optional) secret:         ANTHROPIC_API_KEY (adds a generated summary; omit for extractive)
  Then "Retry deployment" (or push any commit).

Verify:  curl -s https://otrearthmovertyre.com/api/ask -H 'content-type: application/json' \
            -d '{"q":"What is a TRA E-4 service code?"}' | head
DONE
