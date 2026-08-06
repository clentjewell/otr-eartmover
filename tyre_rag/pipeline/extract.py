"""Track A verifier: diff the two passes cell by cell, classify confidence,
apply validation gates, and decide servability. Abstain by default."""
from __future__ import annotations

import re

from . import config, db, validate

COMPARE_FIELDS = [
    "tra_code", "rating", "load_index", "rim_recommendation",
    "section_width_mm", "overall_diameter_mm", "inflation_pressure_kpa",
    "tkph_tmph", "application",
]


def row_key(rec: dict) -> str:
    size = re.sub(r"\s+", "", (rec.get("size_designation") or "")).upper()
    tra = (rec.get("tra_code") or "").upper()
    return f"{size}|{tra}"


def _norm(field: str, val):
    if val is None:
        return None
    if field in db.NUMERIC_FIELDS:
        try:
            return round(float(val), 2)
        except (TypeError, ValueError):
            return None
    return re.sub(r"\s+", " ", str(val)).strip().upper() or None


def reconcile(pass_a: list[dict], pass_b: list[dict], single_provider: bool,
              no_model: bool):
    """Merge two passes into verified-candidate records.

    Returns list of (merged_rec, confidence, needs_review, flags, disagreements).
    """
    by_key_a = {row_key(r): r for r in pass_a}
    by_key_b = {row_key(r): r for r in pass_b}
    all_keys = list(dict.fromkeys(list(by_key_a) + list(by_key_b)))

    out = []
    for key in all_keys:
        a = by_key_a.get(key)
        b = by_key_b.get(key)
        merged = dict(a or b)            # base identity fields
        disagreements: dict[str, list] = {}
        agree_all = True

        for field in COMPARE_FIELDS:
            av = _norm(field, a.get(field)) if a else None
            bv = _norm(field, b.get(field)) if b else None
            if a is None or b is None:
                # Row seen by only one pass: keep the value but it is not agreed.
                agree_all = False
                merged[field] = (a or b).get(field)
                if (a or b).get(field) is not None:
                    disagreements[field] = [av, bv]
                continue
            if av == bv:
                merged[field] = a.get(field)
            else:
                agree_all = False
                merged[field] = a.get(field) if av is not None else b.get(field)
                disagreements[field] = [av, bv]

        # Prefer whichever pass found a crop.
        merged["source_crop_path"] = (
            (a or {}).get("source_crop_path") or (b or {}).get("source_crop_path"))

        flags = validate.validate_record(merged)
        seen_by_both = a is not None and b is not None

        # Confidence and abstention -------------------------------------------
        if no_model:
            # The heuristic fallback never asserts high confidence.
            confidence = "low"
            needs_review = True
        elif agree_all and seen_by_both and not flags:
            confidence = "high"
            needs_review = False
        else:
            confidence = "low"
            needs_review = True

        if flags:
            needs_review = True
            if confidence == "high":
                confidence = "low"

        out.append((merged, confidence, needs_review, flags, disagreements,
                    single_provider))
    return out


def persist(conn, file_id, page, pass_a, pass_b, single_provider, no_model):
    for r in pass_a:
        db.insert_candidate(conn, file_id, page, "A", row_key(r), r)
    for r in pass_b:
        db.insert_candidate(conn, file_id, page, "B", row_key(r), r)

    results = reconcile(pass_a, pass_b, single_provider, no_model)
    for merged, confidence, needs_review, flags, disagreements, _sp in results:
        db.insert_record(conn, file_id, page, row_key(merged), merged,
                         confidence, needs_review, flags, disagreements)
    conn.commit()
    agreed = sum(1 for r in results if not r[2])
    return len(results), agreed
