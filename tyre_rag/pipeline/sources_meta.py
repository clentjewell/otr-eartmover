"""Verified public source URLs for citations.

Reads scripts/sources_public_urls.csv and exposes the canonical public PDF URL
for a databook ONLY when a human has marked it verified=yes. Unverified
candidates are never surfaced to users - the citation falls back to plain text.
This keeps the provenance chain honest: a link goes live only after sign-off.
"""
from __future__ import annotations

import csv

from . import config

PUBLIC_URLS = config.SCRIPTS / "sources_public_urls.csv"
_cache: dict[str, str] | None = None


def _load() -> dict[str, str]:
    global _cache
    if _cache is None:
        _cache = {}
        if PUBLIC_URLS.exists():
            with open(PUBLIC_URLS, newline="", encoding="utf-8") as fh:
                for r in csv.DictReader(fh):
                    url = (r.get("candidate_public_url") or "").strip()
                    if url and (r.get("verified") or "").strip().lower() == "yes":
                        _cache[(r.get("title") or "").strip()] = url
    return _cache


def public_url_for(source_file: str | None) -> str | None:
    if not source_file:
        return None
    return _load().get(source_file)


def reset_cache() -> None:
    global _cache
    _cache = None
