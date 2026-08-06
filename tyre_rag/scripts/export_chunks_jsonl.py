"""Export Track B prose chunks to JSONL for the OTR portal's Vectorize ingest.

The portal worker answers explanatory questions from a Vectorize index. Rather
than re-implement PDF extraction in Node, we reuse this pipeline's tested
extractor: run the pipeline over the databooks, then export the prose chunks
here. The Node ingest (scripts/rag-ingest.js) reads this
file, embeds each chunk with Workers AI, and upserts to the 'otr-corpus' index.

Each line: {"id", "text", "source", "section"}. `source` is the databook
filename so the worker's source->public-URL map resolves to a real citation.

Usage:
  python -m tyre_rag.pipeline.run --all          # populate prose_chunks
  python -m tyre_rag.scripts.export_chunks_jsonl  # -> tyre_rag/index/prose_chunks.jsonl
"""
from __future__ import annotations

import json

from tyre_rag.pipeline import config, db


def main():
    conn = db.connect()
    db.init_db(conn)
    rows = conn.execute(
        "SELECT id, source_file, page, section_title, text FROM prose_chunks"
    ).fetchall()
    out = config.INDEX / "prose_chunks.jsonl"
    with open(out, "w", encoding="utf-8") as fh:
        for r in rows:
            fh.write(json.dumps({
                "id": f"{r['source_file']}-{r['id']}",
                "text": r["text"],
                "source": r["source_file"],
                "page": r["page"],
                "section": r["section_title"] or "general",
            }) + "\n")
    print(f"wrote {len(rows)} chunks -> {out}")
    if not rows:
        print("No prose chunks. Run `python -m tyre_rag.pipeline.run --all` first.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
