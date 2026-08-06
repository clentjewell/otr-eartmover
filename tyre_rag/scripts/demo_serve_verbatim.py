"""Demonstrate the served-figure contract for the eventual real run.

Track A in no-model fallback never produces a servable record (by design), so
this script injects ONE verified, signed-off, servable record inside a
transaction, shows exactly what a user would receive (verbatim figure, citation,
source crop, disclaimer, site notice), then rolls back. Nothing is persisted.
"""
from tyre_rag.pipeline import db
from tyre_rag.serve import query

DEMO = {
    "manufacturer": "SAMPLE", "edition_year": 2099,
    "source_file": "SAMPLE-OTR-Databook-SYNTHETIC-2099.pdf",
    "size_designation": "27.00R49", "tra_code": "E-4", "rating": "2-star",
    "load_index": None, "rim_recommendation": "19.50/2.5",
    "section_width_mm": 768.0, "overall_diameter_mm": 2415.0,
    "inflation_pressure_kpa": 700.0, "tkph_tmph": 540.0, "application": "Haulage",
    "raw_cell_context": "27.00R49 E-4 2-star 19.50/2.5 768mm 2415 700kPa TKPH 540 Haulage",
    "source_crop_path": "crops/sample-otr-databook-synthetic-2099/p0001-27.00R49.png",
}


def main():
    conn = db.connect()
    db.init_db(conn)
    db.insert_record(conn, "demo", 1, "27.00R49|E-4", DEMO,
                     confidence="high", needs_review=0, flags=[], disagreements={},
                     signed_off=1, servable=1)
    res = query.answer(conn, "What is the inflation pressure and rim for 27.00R49 E-4?")
    print("[", res["kind"], "]\n")
    print(res["answer"])
    for d in res["disclaimers"]:
        print("\nDisclaimer:", d)
    print("\nSite notice:", res["site_notice"])
    conn.rollback()   # nothing persisted
    print("\n(rolled back - committed state unchanged; still abstain-by-default)")


if __name__ == "__main__":
    main()
