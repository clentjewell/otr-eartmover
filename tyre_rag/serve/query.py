"""Serving layer.

Two strictly separated paths:

  Numeric  -> exact/fuzzy lookup against signed-off, servable Track A records.
              Figures are returned verbatim with citation, crop, and disclaimer.
              A language model is never in this path. If the figure is not in the
              signed-off set, the system abstains and points to the OEM.

  Prose    -> hybrid (vector + keyword) retrieval over Track B, answered only
              from retrieved context, with citation and disclaimer. If the
              context does not contain the answer, it says so.
"""
from __future__ import annotations

import re

import numpy as np

from ..pipeline import db, embeddings, sources_meta
from ..pipeline.providers import SIZE_RE, TRA_RE
from . import contract

NUMERIC_HINTS = re.compile(
    r"\b(rim|inflation|pressure|kpa|psi|load|index|tkph|tmph|section width|"
    r"overall diameter|width|diameter|ply|rating)\b", re.I)

FIELD_LABELS = {
    "tra_code": "TRA code",
    "rating": "rating",
    "load_index": "load index",
    "rim_recommendation": "recommended rim",
    "section_width_mm": "section width (mm)",
    "overall_diameter_mm": "overall diameter (mm)",
    "inflation_pressure_kpa": "inflation pressure (kPa)",
    "tkph_tmph": "TKPH/TMPH",
    "application": "application",
}


def classify(question: str) -> str:
    if SIZE_RE.search(question) or TRA_RE.search(question) or NUMERIC_HINTS.search(question):
        return "numeric"
    return "prose"


def answer(conn, question: str, top_k: int = 4) -> dict:
    # A specific size designation or TRA code means a spec lookup. These are
    # served only from signed-off Track A records; if the figure is not held,
    # we abstain - we never answer a specific spec question from prose.
    if SIZE_RE.search(question) or TRA_RE.search(question):
        result = _answer_numeric(conn, question)
        return result if result else _abstain(question)
    # Otherwise it is an explanatory or methodology question -> Track B prose.
    return _answer_prose(conn, question, top_k)


def _answer_numeric(conn, question):
    size_m = SIZE_RE.search(question)
    tra_m = TRA_RE.search(question)
    rows = []
    if size_m:
        norm = re.sub(r"\s+", "", size_m.group(1)).upper()
        rows = conn.execute(
            """SELECT * FROM spec_records
               WHERE servable=1
                 AND REPLACE(UPPER(size_designation),' ','')=?
               ORDER BY edition_year DESC""",
            (norm,),
        ).fetchall()
    if not rows and tra_m:
        rows = conn.execute(
            """SELECT * FROM spec_records
               WHERE servable=1 AND UPPER(tra_code)=?
               ORDER BY edition_year DESC""",
            (tra_m.group(1).upper(),),
        ).fetchall()
    if not rows:
        return None

    lines = [f"Holding {len(rows)} signed-off record(s); newest edition first."]
    citations, crops, disclaimers, urls = [], [], [], []
    for r in rows:
        lines.append("")
        lines.append(f"{r['size_designation']}"
                     f"{(' ' + r['tra_code']) if r['tra_code'] else ''} — "
                     f"{contract.attribution(r['manufacturer'], r['edition_year'], r['page'])}")
        for field, label in FIELD_LABELS.items():
            val = r[field]
            if val is not None and val != "":
                lines.append(f"  {label}: {val}")
        if r["source_crop_path"]:
            crops.append(r["source_crop_path"])
            lines.append(f"  source crop: {r['source_crop_path']}")
        url = sources_meta.public_url_for(r["source_file"])
        if url:
            urls.append(url)
            lines.append(f"  source PDF: {url}")
        citations.append(contract.attribution(r["manufacturer"], r["edition_year"], r["page"]))
        disclaimers.append(contract.disclaimer(r["manufacturer"], r["edition_year"], r["page"]))

    return {
        "kind": "numeric", "grounded": True, "abstained": False,
        "answer": "\n".join(lines),
        "citations": citations, "crops": crops, "source_urls": urls,
        "disclaimers": list(dict.fromkeys(disclaimers)),
        "site_notice": contract.SITE_NOTICE,
    }


def _hybrid_retrieve(conn, question, top_k):
    chunks = conn.execute(
        "SELECT id, page, manufacturer, edition_year, source_file, section_title, "
        "text, embedding FROM prose_chunks").fetchall()
    if not chunks:
        return []
    qvec = embeddings.embed_texts([question])[0]
    vscores = {}
    for c in chunks:
        vscores[c["id"]] = embeddings.cosine(qvec, embeddings.from_blob(c["embedding"]))

    # keyword scores via FTS
    kscores = {}
    terms = re.findall(r"[A-Za-z0-9]+", question)
    if terms:
        match = " OR ".join(f'"{t}"' for t in terms)
        try:
            for row in conn.execute(
                "SELECT rowid, bm25(prose_fts) AS s FROM prose_fts "
                "WHERE prose_fts MATCH ? ORDER BY s LIMIT 50", (match,)):
                # bm25 lower is better -> invert
                kscores[row["rowid"]] = 1.0 / (1.0 + max(0.0, row["s"]))
        except Exception:
            pass

    def norm(d):
        if not d:
            return {}
        hi = max(d.values()) or 1.0
        return {k: v / hi for k, v in d.items()}

    vN, kN = norm(vscores), norm(kscores)
    combined = {}
    for cid in set(vN) | set(kN):
        combined[cid] = 0.6 * vN.get(cid, 0.0) + 0.4 * kN.get(cid, 0.0)
    ranked = sorted(combined.items(), key=lambda x: x[1], reverse=True)[:top_k]
    by_id = {c["id"]: c for c in chunks}
    return [(by_id[cid], score) for cid, score in ranked]


def _answer_prose(conn, question, top_k):
    hits = _hybrid_retrieve(conn, question, top_k)
    grounded = bool(hits) and hits[0][1] > 0.15
    citations, body = [], []
    if not grounded:
        return {
            "kind": "prose", "grounded": False, "abstained": False,
            "answer": "I don't have that in my sources. "
                      "Consult the OEM or an authorised dealer.",
            "citations": [], "crops": [],
            "disclaimers": [], "site_notice": contract.SITE_NOTICE,
        }
    urls = []
    for i, (c, score) in enumerate(hits, 1):
        cite = contract.attribution(c["manufacturer"], c["edition_year"], c["page"])
        url = sources_meta.public_url_for(c["source_file"])
        suffix = f" — {url}" if url else ""
        if url:
            urls.append(url)
        citations.append(f"[{i}] {cite} — {c['section_title']}{suffix}")
        body.append(f"[{i}] {c['text']}")
    # Trial serve layer is extractive (no LLM in the loop). In production the
    # constrained RAG model composes prose from exactly these passages.
    answer_text = ("Answer assembled strictly from retrieved context "
                   "(extractive trial mode):\n\n" + "\n\n".join(body))
    disc = list(dict.fromkeys(
        contract.disclaimer(c["manufacturer"], c["edition_year"], c["page"])
        for c, _ in hits))
    return {
        "kind": "prose", "grounded": True, "abstained": False,
        "answer": answer_text, "citations": citations, "crops": [],
        "source_urls": urls, "disclaimers": disc, "site_notice": contract.SITE_NOTICE,
        "generative_disclaimer": contract.GENERATIVE_DISCLAIMER,
    }


def _abstain(question):
    return {
        "kind": "numeric", "grounded": False, "abstained": True,
        "answer": contract.ABSTAIN, "citations": [], "crops": [],
        "disclaimers": [], "site_notice": contract.SITE_NOTICE,
    }
