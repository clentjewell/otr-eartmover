"""Ad-hoc query CLI:  python -m tyre_rag.serve.cli "what rim for 27.00R49?"
(Run from the tyre-rag parent directory, or use scripts/ask.py.)"""
from __future__ import annotations

import sys

from ..pipeline import db
from . import query


def main(argv=None):
    argv = argv or sys.argv[1:]
    if not argv:
        print('usage: ask "<question>"')
        return 1
    question = " ".join(argv)
    conn = db.connect()
    db.init_db(conn)
    res = query.answer(conn, question)
    print(f"Q: {question}\n")
    print(f"[{res['kind']}{' / abstained' if res.get('abstained') else ''}]\n")
    print(res["answer"])
    if res.get("citations"):
        print("\nCitations:")
        for c in res["citations"]:
            print(f"  {c}")
    for d in res.get("disclaimers", []):
        print(f"\nDisclaimer: {d}")
    if res.get("generative_disclaimer"):
        print(f"\nAI-generated answer disclaimer: {res['generative_disclaimer']}")
    print(f"\nSite notice: {res['site_notice']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
