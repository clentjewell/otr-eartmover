"""Unattended orchestrator for the accuracy-first tyre-data pipeline.

  python -m tyre_rag.pipeline.run --single sources/FILE.pdf   # dry run, one file
  python -m tyre_rag.pipeline.run --all                       # candidates + queue
  python -m tyre_rag.pipeline.run --all --commit              # finalise servable set

Without --commit the run produces verified candidates, a review queue, and a
morning report only. It never publishes numbers. The run is idempotent and
resumable (per-file, per-page checkpoints) and honours a hard cost ceiling.
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import sys
import traceback
from pathlib import Path

import fitz

from . import config, db, extract, prose, providers, rasterise, selftest

SAFETY_FIELDS = ["inflation_pressure_kpa", "load_index", "rim_recommendation"]


class CostExceeded(Exception):
    pass


def discover_sources(single: str | None) -> list[Path]:
    if single:
        p = Path(single)
        if not p.is_absolute():
            p = config.ROOT / single if (config.ROOT / single).exists() else Path.cwd() / single
        return [p] if p.exists() else []
    return sorted(config.SOURCES.glob("*.pdf"))


def ingest_file(conn, path: Path, stats: dict) -> None:
    file_id = rasterise.file_id_for(path)
    sha = rasterise.sha256_of(path)
    if db.file_unchanged(conn, file_id, sha):
        print(f"  {path.name}: unchanged, skipping (resumable)")
        stats["skipped_files"] += 1
        return
    rasterise.register_file(file_id, path)
    manufacturer, year = rasterise.guess_manufacturer_edition(path)

    doc = fitz.open(path)
    db.upsert_file(conn, file_id, path, sha, manufacturer, year, doc.page_count)
    db.set_file_status(conn, file_id, "processing")
    page_meta = {"manufacturer": manufacturer, "edition_year": year,
                 "source_file": path.name}

    for i in range(doc.page_count):
        page_no = i + 1
        if db.page_done(conn, file_id, page_no):
            continue
        if stats["cost"] >= config.MAX_COST_USD:
            raise CostExceeded(f"cost ceiling ${config.MAX_COST_USD:.2f} reached")

        page = doc[i]
        img_path, words_path = rasterise.rasterise_page(page, file_id, page_no)
        words_payload = json.loads(Path(words_path).read_text(encoding="utf-8"))
        db.clear_page_records(conn, file_id, page_no)

        # Track A - dual-pass extraction + verification
        pass_a = providers.extract_specs(file_id, page_no, img_path, words_payload, page_meta, "A")
        pass_b = providers.extract_specs(file_id, page_no, img_path, words_payload, page_meta, "B")
        if config.PROVIDER_A_KEY or config.PROVIDER_B_KEY:
            stats["cost"] += 2 * config.COST_PER_PAGE_PASS

        single_provider = config.provider_mode() == "single-provider"
        no_model = config.provider_mode() == "no-model-fallback"
        n_rows, agreed = extract.persist(conn, file_id, page_no, pass_a, pass_b,
                                         single_provider, no_model)
        stats["rows"] += n_rows
        stats["agreed_rows"] += agreed

        # Track B - prose retrieval index
        n_chunks = prose.persist(conn, file_id, page_no, words_payload.get("text", ""), page_meta)
        if config.EMBED_KEY:
            stats["cost"] += n_chunks * config.COST_PER_EMBED

        db.record_page(conn, file_id, page_no, img_path, words_path, "done")
        if page_no % 10 == 0 or n_rows:
            print(f"    {path.name} p{page_no}: {n_rows} spec rows, {n_chunks} prose chunks")
    doc.close()
    db.set_file_status(conn, file_id, "done")
    stats["processed_files"] += 1


# --- Sign-off and commit ---------------------------------------------------
def apply_signoff(conn) -> int:
    if not config.SIGNOFF.exists():
        return 0
    keys = set()
    with open(config.SIGNOFF, newline="", encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            raw_size = (row.get("size_designation") or "").strip()
            if not raw_size or raw_size.startswith("#"):
                continue
            size = raw_size.replace(" ", "").upper()
            tra = (row.get("tra_code") or "").upper()
            keys.add(f"{size}|{tra}")
    if not keys:
        return 0
    n = 0
    for k in keys:
        cur = conn.execute("UPDATE spec_records SET signed_off=1 WHERE row_key=?", (k,))
        n += cur.rowcount
    conn.commit()
    return n


def commit_servable(conn) -> int:
    cur = conn.execute(
        "UPDATE spec_records SET servable=1 "
        "WHERE confidence='high' AND needs_review=0 AND signed_off=1")
    conn.commit()
    return cur.rowcount


# --- Review queue ----------------------------------------------------------
def _candidate_values(conn, file_id, page, row_key, pass_id):
    r = conn.execute(
        "SELECT * FROM spec_candidates WHERE file_id=? AND page=? AND row_key=? "
        "AND pass_id=? LIMIT 1", (file_id, page, row_key, pass_id)).fetchone()
    if not r:
        return ""
    parts = []
    for f in extract.COMPARE_FIELDS:
        if r[f] is not None and r[f] != "":
            parts.append(f"{f}={r[f]}")
    return "; ".join(parts)


def write_review_queue(conn) -> int:
    rows = conn.execute(
        "SELECT * FROM spec_records WHERE needs_review=1 ORDER BY page").fetchall()

    def priority(r):
        flags = json.loads(r["validation_flags"] or "[]")
        dis = json.loads(r["disagreements"] or "{}")
        touched = set(dis.keys()) | {f for f in SAFETY_FIELDS
                                     if any(f in fl for fl in flags)}
        return 0 if touched & set(SAFETY_FIELDS) else 1

    rows = sorted(rows, key=priority)
    with open(config.REVIEW_QUEUE, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["priority", "source_file", "page", "size_designation", "tra_code",
                    "confidence", "failed_gates", "disagreements",
                    "pass_A_values", "pass_B_values", "source_crop_path"])
        for r in rows:
            flags = json.loads(r["validation_flags"] or "[]")
            dis = json.loads(r["disagreements"] or "{}")
            pr = "SAFETY-CRITICAL" if priority(r) == 0 else "standard"
            w.writerow([
                pr, r["source_file"], r["page"], r["size_designation"],
                r["tra_code"] or "", r["confidence"],
                " | ".join(flags),
                "; ".join(f"{k}: A={v[0]!r} B={v[1]!r}" for k, v in dis.items()),
                _candidate_values(conn, r["file_id"], r["page"], r["row_key"], "A"),
                _candidate_values(conn, r["file_id"], r["page"], r["row_key"], "B"),
                r["source_crop_path"] or "",
            ])
    return len(rows)


# --- Morning report --------------------------------------------------------
def write_morning_report(conn, stats, committed, gold, audit, errors):
    c = db.counts(conn)
    mode = config.provider_mode()
    agreement = (stats["agreed_rows"] / stats["rows"] * 100) if stats["rows"] else 0.0
    review_rows = conn.execute(
        "SELECT source_file, page, size_designation, tra_code, validation_flags, "
        "disagreements FROM spec_records WHERE needs_review=1").fetchall()

    def is_safety(r):
        flags = json.loads(r["validation_flags"] or "[]")
        dis = json.loads(r["disagreements"] or "{}")
        return bool(set(dis) & set(SAFETY_FIELDS)) or any(
            sf in fl for fl in flags for sf in SAFETY_FIELDS)

    safety_first = [r for r in review_rows if is_safety(r)]

    L = []
    L.append("# Morning report — OTR tyre-data ingestion")
    L.append("")
    L.append(f"Generated: {dt.datetime.now().isoformat(timespec='seconds')}")
    L.append(f"Run mode: **{'COMMITTED (served set finalised)' if committed else 'CANDIDATES ONLY (no numbers published)'}**")
    L.append(f"Extraction mode: **{mode}**")
    if mode == "single-provider":
        L.append("")
        L.append("> WARNING: single-provider mode. The two passes share one model; "
                 "cross-checking is weaker than true dual-provider. Treat high-confidence "
                 "rows with extra scrutiny in the spot-check.")
    if mode == "no-model-fallback":
        L.append("")
        L.append("> WARNING: no extraction-provider key was set. Track A ran the "
                 "deterministic no-model heuristic, which never produces a servable "
                 "record — every spec row is forced to the review queue. This run "
                 "proves the pipeline end to end; it does not produce verified specs. "
                 "Set EXTRACT_PROVIDER_A_KEY / EXTRACT_PROVIDER_B_KEY and supply real "
                 "databooks in sources/ for a genuine Track A run.")
    if config.EMBED_KEY is None:
        L.append("")
        L.append("> NOTE: no EMBED_PROVIDER_KEY set — Track B used fallback hashed "
                 "embeddings (retrieval plumbing only, weaker semantics).")
    L.append("")
    L.append("## Counts")
    L.append("")
    L.append(f"| metric | value |\n|---|---|")
    L.append(f"| files processed | {stats['processed_files']} |")
    L.append(f"| files skipped (unchanged) | {stats['skipped_files']} |")
    L.append(f"| pages | {c['pages']} |")
    L.append(f"| candidate spec rows (per-pass) | {c['candidates']} |")
    L.append(f"| merged spec records | {c['records']} |")
    L.append(f"| high-confidence records | {c['high_confidence']} |")
    L.append(f"| needs review | {c['needs_review']} |")
    L.append(f"| servable (signed off + committed) | {c['servable']} |")
    L.append(f"| prose chunks | {c['prose_chunks']} |")
    L.append(f"| dual-pass agreement rate | {agreement:.1f}% |")
    L.append(f"| estimated cost | ${stats['cost']:.4f} |")
    L.append("")
    L.append("## Self-test — gold-standard Q&A")
    L.append("")
    if gold:
        passed = sum(1 for g in gold if g["pass"])
        L.append(f"{passed}/{len(gold)} passed.")
        L.append("")
        L.append("| # | expect | result | pass | query |\n|---|---|---|---|---|")
        for i, g in enumerate(gold, 1):
            res = "abstained" if g["abstained"] else ("grounded" if g["grounded"] else "no-answer")
            L.append(f"| {i} | {g['expect']} | {res} | {'PASS' if g['pass'] else 'FAIL'} | {g['q']} |")
    else:
        L.append("No gold-standard Q&A file found (scripts/gold_qa.json).")
    L.append("")
    L.append("## Sampling audit (high-confidence spot-check)")
    L.append("")
    if audit:
        L.append(f"Random sample of {len(audit)} high-confidence records for human spot-check:")
        L.append("")
        for a in audit:
            L.append(f"- {a['size_designation']} {a['tra_code'] or ''} "
                     f"({a['source_file']} p{a['page']}) — inflation "
                     f"{a['inflation_pressure_kpa']} kPa, rim {a['rim_recommendation']}, "
                     f"crop: {a['source_crop_path']}")
    else:
        L.append("No high-confidence records to sample (expected in no-model-fallback mode).")
    L.append("")
    L.append("## Review these first — safety-critical fields")
    L.append("")
    L.append("Records where inflation, load, or rim is in dispute or failed a gate:")
    L.append("")
    if safety_first:
        for r in safety_first[:50]:
            L.append(f"- {r['size_designation']} {r['tra_code'] or ''} "
                     f"({r['source_file']} p{r['page']})")
    else:
        L.append("None flagged on safety-critical fields.")
    L.append("")
    L.append(f"Full review queue: `REVIEW_QUEUE.csv` ({c['needs_review']} rows).")
    L.append("")
    if errors:
        L.append("## Errors")
        L.append("")
        for e in errors:
            L.append(f"- {e}")
        L.append("")
    config.MORNING_REPORT.write_text("\n".join(L), encoding="utf-8")


# --- Entry point -----------------------------------------------------------
def main(argv=None):
    ap = argparse.ArgumentParser(description="Accuracy-first OTR tyre-data pipeline")
    ap.add_argument("--single", help="process a single file (dry run)")
    ap.add_argument("--all", action="store_true", help="process every file in sources/")
    ap.add_argument("--commit", action="store_true",
                    help="finalise the served dataset (promote signed-off high-confidence records)")
    ap.add_argument("--sample-size", type=int, default=10)
    args = ap.parse_args(argv)

    if not args.single and not args.all:
        ap.error("specify --single FILE or --all")

    conn = db.connect()
    db.init_db(conn)
    stats = {"rows": 0, "agreed_rows": 0, "cost": 0.0,
             "processed_files": 0, "skipped_files": 0}
    errors = []

    sources = discover_sources(args.single)
    if not sources:
        print("No source PDFs found. Place databooks in sources/ and retry.")
        return 2
    print(f"Mode: {config.provider_mode()} | files: {len(sources)} | "
          f"commit: {args.commit}")

    for path in sources:
        print(f"Ingesting {path.name} ...")
        try:
            ingest_file(conn, path, stats)
        except CostExceeded as e:
            errors.append(str(e))
            print(f"  PAUSED: {e}")
            break
        except Exception as e:
            errors.append(f"{path.name}: {e}")
            traceback.print_exc()

    signed = apply_signoff(conn)
    committed = False
    if args.commit:
        promoted = commit_servable(conn)
        committed = True
        print(f"Signed off {signed} record(s); promoted {promoted} to servable.")
    elif signed:
        print(f"Signed off {signed} record(s) (not committed — re-run with --commit).")

    review_n = write_review_queue(conn)
    gold = selftest.run_gold_qa(conn)
    audit = selftest.sampling_audit(conn, args.sample_size)
    write_morning_report(conn, stats, committed, gold, audit, errors)

    print(f"\nReview queue: {review_n} rows -> {config.REVIEW_QUEUE.name}")
    print(f"Morning report -> {config.MORNING_REPORT.name}")
    c = db.counts(conn)
    print(f"Records: {c['records']} | high-confidence: {c['high_confidence']} | "
          f"needs-review: {c['needs_review']} | servable: {c['servable']} | "
          f"prose chunks: {c['prose_chunks']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
