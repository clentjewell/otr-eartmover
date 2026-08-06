"""Self-test and measured accuracy: counts, gold-standard Q&A, sampling audit."""
from __future__ import annotations

import json
import random

from . import config, db
from ..serve import query


def run_gold_qa(conn) -> list[dict]:
    if not config.GOLD_QA.exists():
        return []
    items = json.loads(config.GOLD_QA.read_text(encoding="utf-8"))
    results = []
    for item in items:
        res = query.answer(conn, item["q"])
        expect = item.get("expect", "answer")  # answer | abstain
        if expect == "abstain":
            ok = res.get("abstained") or not res.get("grounded")
        else:
            ok = res.get("grounded", False)
        results.append({
            "q": item["q"], "expect": expect,
            "kind": res["kind"], "grounded": res.get("grounded"),
            "abstained": res.get("abstained", False),
            "pass": bool(ok),
            "citation": (res.get("citations") or [None])[0],
        })
    return results


def sampling_audit(conn, sample_size: int = 10) -> list[dict]:
    """Spot-check sample of high-confidence records, emitted with their crops."""
    rows = conn.execute(
        "SELECT * FROM spec_records WHERE confidence='high'").fetchall()
    if not rows:
        return []
    sample = random.sample(rows, min(sample_size, len(rows)))
    return [{
        "size_designation": r["size_designation"],
        "tra_code": r["tra_code"],
        "source_file": r["source_file"],
        "page": r["page"],
        "source_crop_path": r["source_crop_path"],
        "inflation_pressure_kpa": r["inflation_pressure_kpa"],
        "rim_recommendation": r["rim_recommendation"],
        "load_index": r["load_index"],
    } for r in sample]
