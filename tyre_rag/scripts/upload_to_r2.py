"""Upload the staged databooks to a Cloudflare R2 bucket (the authoritative,
durable store), with integrity checks.

Storage layout in the bucket:
  databooks/{brand-slug}/{title}.pdf   the source PDFs
  _manifest.csv                        title, size, sha256 (provenance index)
  (crops/{file}/{crop}.png             written later by the pipeline)

Uses the Cloudflare wrangler CLI, so it runs wherever you are logged in to
Cloudflare (wrangler login) with R2 enabled. It does not need any key baked in.

Usage:
  wrangler r2 bucket create jewell-tyre-data           # once
  python -m tyre_rag.scripts.upload_to_r2 --bucket jewell-tyre-data --dry-run
  python -m tyre_rag.scripts.upload_to_r2 --bucket jewell-tyre-data
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import re
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCES = HERE.parent / "sources"
MANIFEST = HERE / "sources_manifest.csv"
CHECKSUMS = HERE / "sources_checksums.csv"


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def load_manifest():
    with open(MANIFEST, newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for b in iter(lambda: fh.read(1 << 16), b""):
            h.update(b)
    return h.hexdigest()


def known_checksums() -> dict[str, str]:
    if not CHECKSUMS.exists():
        return {}
    with open(CHECKSUMS, newline="", encoding="utf-8") as fh:
        return {r["title"]: r["sha256"] for r in csv.DictReader(fh)}


def put(bucket, key, path, content_type, remote, dry):
    cmd = ["wrangler", "r2", "object", "put", f"{bucket}/{key}",
           f"--file={path}", f"--content-type={content_type}"]
    if remote:
        cmd.append("--remote")
    if dry:
        print("  DRY:", " ".join(cmd))
        return True
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"  FAIL {key}: {res.stderr.strip().splitlines()[-1] if res.stderr else 'error'}")
        return False
    return True


def main(argv=None):
    ap = argparse.ArgumentParser(description="Upload databooks to Cloudflare R2")
    ap.add_argument("--bucket", required=True)
    ap.add_argument("--all", action="store_true", help="include rows flagged sync=no (e.g. truck)")
    ap.add_argument("--local", action="store_true", help="use wrangler local store, not real R2")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    if not shutil.which("wrangler") and not args.dry_run:
        print("wrangler not found. Install it (npm i -g wrangler) and `wrangler login`, "
              "or re-run with --dry-run to preview the commands.")
        return 2

    remote = not args.local
    checks = known_checksums()
    rows = load_manifest()
    by_title = {r["title"]: r for r in rows}

    # Build the provenance manifest for files actually present, verifying hashes.
    present = sorted(p for p in SOURCES.glob("*.pdf") if "SYNTHETIC" not in p.name)
    verified_manifest = SOURCES.parent / "scripts" / "_r2_manifest.csv"
    ok = fail = 0
    with open(verified_manifest, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["key", "title", "brand", "category", "size_bytes", "sha256"])
        for path in present:
            meta = by_title.get(path.name, {"brand": "Unknown", "category": "uncategorised", "sync": "yes"})
            if not args.all and meta.get("sync", "yes").lower() == "no":
                continue
            digest = sha256_of(path)
            if path.name in checks and checks[path.name] != digest:
                print(f"  WARN {path.name}: sha256 differs from recorded checksum - skipping")
                fail += 1
                continue
            key = f"databooks/{slug(meta['brand'])}/{path.name}"
            w.writerow([key, path.name, meta["brand"], meta.get("category", ""),
                        path.stat().st_size, digest])
            if put(args.bucket, key, path, "application/pdf", remote, args.dry_run):
                print(f"  OK  {key}")
                ok += 1
            else:
                fail += 1

    # Upload the provenance manifest itself.
    put(args.bucket, "_manifest.csv", verified_manifest, "text/csv", remote, args.dry_run)
    print(f"\nUploaded {ok} file(s), {fail} failed/skipped. Manifest: {verified_manifest.name}")
    print(f"Bucket layout: {args.bucket}/databooks/<brand>/<title>.pdf  +  _manifest.csv")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
