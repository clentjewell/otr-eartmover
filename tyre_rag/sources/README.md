# sources/

Manufacturer OTR/Ag databooks live here for a run. They are not committed
(large, publicly available at source). The only committed file is
`SAMPLE-OTR-Databook-SYNTHETIC-2099.pdf` (invented figures, demo only — can
never be served).

## Syncing from the Tyre Tech Data Drive

The databooks are catalogued in `../scripts/sources_manifest.csv` (brand,
title, Drive file id, size, category). Sync the OTR + Ag set with:

    python -m tyre_rag.scripts.sync_sources            # default: otr + ag (+construction/mining/specialty/multi)
    python -m tyre_rag.scripts.sync_sources --list     # show the plan, download nothing
    python -m tyre_rag.scripts.sync_sources --all      # everything, including truck

This pulls files directly from Google Drive's public-link endpoint — no auth or
MCP needed, so it works in any session.

### Two download channels

Most files are shared "anyone with link" and download cleanly via the script.
A minority return a Google "confirm" interstitial (or redirect) instead of the
PDF; the script detects this (checks the `%PDF` magic) and reports them as
FAIL rather than saving a bad file. For those stragglers, fetch via the Google
Drive integration (`download_file_content` by file id from the manifest) or
download manually from the Drive folder, and drop the PDF in here. The pipeline
then handles whatever PDFs are present — nothing is hard-coded to a file set.

Regenerate the synthetic sample with:

    python -m tyre_rag.scripts.make_sample_databook
