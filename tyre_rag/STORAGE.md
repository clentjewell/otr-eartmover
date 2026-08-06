# Safe storage for the tech databooks — Cloudflare R2

The databooks are the **provenance** for safety-critical figures, so "safe"
means durable, integrity-checked, access-controlled, immutable, and traceable
back to the exact source — not secret (they are publicly available manufacturer
catalogues).

## Why R2

- Same stack as the portal (Cloudflare Pages + Workers + Vectorize), one bill,
  one access model.
- S3-compatible object storage, no egress fees; ~400 MB costs cents/month.
- Private by default; served to the portal only through the Worker, so the
  original manufacturer table image can be shown beside a figure.
- The git repo stays code-only; 400 MB of PDFs live in R2, not in version
  control.

## Layout

```
jewell-tyre-data/                 (R2 bucket)
├── databooks/{brand}/{title}.pdf  authoritative source PDFs
├── crops/{file}/{crop}.png        source-table crops (written by the pipeline)
└── _manifest.csv                  title, size, sha256 - the provenance index
```

## Integrity chain

`served figure → source crop → source PDF (by sha256)`. Every staged file's
SHA-256 is recorded in `scripts/sources_checksums.csv`; the upload script
re-hashes each file and refuses to upload anything whose hash has drifted, then
writes the verified `_manifest.csv` into the bucket alongside the PDFs.

## Durability / immutability (set these on the bucket)

- Enable **object versioning** so a databook cannot be silently overwritten.
- Consider an **R2 lifecycle / retention** policy for write-once behaviour on
  the `databooks/` prefix.
- Keep the Google Drive folder as the human-facing working copy and an
  independent off-platform backup. Two stores, never one.

## Standing it up

```bash
# 1. Stage the files locally (public-link sync; a few need manual fetch)
python -m tyre_rag.scripts.sync_sources

# 2. Create the bucket (once) and upload, with integrity checks
wrangler r2 bucket create jewell-tyre-data
python -m tyre_rag.scripts.upload_to_r2 --bucket jewell-tyre-data --dry-run   # preview
python -m tyre_rag.scripts.upload_to_r2 --bucket jewell-tyre-data             # upload (real R2)
```

Requires the Cloudflare `wrangler` CLI and `wrangler login` with R2 enabled on
the account. No credentials are stored in the repo. The R2 binding for the
Worker is declared in `wrangler.toml` (binding `TYRE_DATA`).

## Note on this environment

The actual upload must run where you have wrangler + R2 credentials. This build
environment has neither, so the upload is prepared and dry-run-verified here but
not executed. The 31 synced databooks are staged in `sources/` (gitignored).
