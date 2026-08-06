"""Sync OTR/Ag databooks from the Tyre Tech Data Drive into sources/.

Reads scripts/sources_manifest.csv and downloads each file flagged sync=yes
directly from Google Drive's public-link endpoint to tyre_rag/sources/. The
files are shared "anyone with link - reader", so no auth or MCP is needed; this
works in any session. Idempotent: skips files already present at the expected
size. Verifies the %PDF magic so a Drive virus-scan interstitial (which can
appear for very large files) is reported rather than silently saved.

Usage:
  python -m tyre_rag.scripts.sync_sources                 # default: otr + ag
  python -m tyre_rag.scripts.sync_sources --categories otr,ag,construction,mining,specialty,multi
  python -m tyre_rag.scripts.sync_sources --all           # every row, including truck
  python -m tyre_rag.scripts.sync_sources --list          # show the plan, download nothing
"""
from __future__ import annotations

import argparse
import csv
import sys
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
MANIFEST = HERE / "sources_manifest.csv"
SOURCES = HERE.parent / "sources"
DEFAULT_CATS = {"otr", "ag", "construction", "mining", "specialty", "multi"}

URL = "https://drive.usercontent.google.com/download?id={id}&export=download&confirm=t"


def rows():
    with open(MANIFEST, newline="", encoding="utf-8") as fh:
        yield from csv.DictReader(fh)


def selected(args):
    cats = None if args.all else (
        set(c.strip() for c in args.categories.split(",")) if args.categories
        else DEFAULT_CATS)
    for r in rows():
        if args.all or (r["sync"].strip().lower() == "yes" and r["category"] in cats):
            yield r


def download(r) -> tuple[bool, str]:
    SOURCES.mkdir(parents=True, exist_ok=True)
    dest = SOURCES / r["title"]
    expect = int(r["size_bytes"])
    if dest.exists() and abs(dest.stat().st_size - expect) < 1024:
        return True, "skip (present)"
    tmp = dest.with_suffix(dest.suffix + ".part")
    req = urllib.request.Request(URL.format(id=r["file_id"]),
                                 headers={"User-Agent": "tyre-rag-sync/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=300) as resp, open(tmp, "wb") as out:
            head = resp.read(5)
            if head[:4] != b"%PDF":
                tmp.unlink(missing_ok=True)
                return False, "not a PDF (Drive interstitial or not public) - download manually"
            out.write(head)
            while chunk := resp.read(1 << 16):
                out.write(chunk)
    except Exception as exc:
        tmp.unlink(missing_ok=True)
        return False, f"error: {exc}"
    got = tmp.stat().st_size
    tmp.rename(dest)
    note = "ok" if abs(got - expect) < expect * 0.02 else f"ok (size {got} vs manifest {expect})"
    return True, note


def main(argv=None):
    ap = argparse.ArgumentParser(description="Sync OTR/Ag databooks to sources/")
    ap.add_argument("--categories", help="comma-separated categories (default: otr,ag,...)")
    ap.add_argument("--all", action="store_true", help="download every row, including truck")
    ap.add_argument("--list", action="store_true", help="print the plan, download nothing")
    args = ap.parse_args(argv)

    plan = list(selected(args))
    total_mb = sum(int(r["size_bytes"]) for r in plan) / 1e6
    print(f"{len(plan)} file(s), ~{total_mb:.0f} MB -> {SOURCES}")
    if args.list:
        for r in plan:
            print(f"  [{r['category']:>12}] {r['title']}  ({int(r['size_bytes'])/1e6:.1f} MB)")
        return 0

    ok = fail = 0
    for r in plan:
        success, note = download(r)
        print(f"  {'OK  ' if success else 'FAIL'} {r['title']}: {note}")
        ok += success
        fail += not success
    print(f"\nDone: {ok} ok, {fail} failed.")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
