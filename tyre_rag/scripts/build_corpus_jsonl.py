"""Build the Vectorize corpus JSONL from every available knowledge source.

Text-only (no rasterising), so it's fast and needs no keys. Sources, in order:

  1. Manufacturer databooks in tyre_rag/sources/*.pdf (synced via sync_sources;
     skipped silently if none are present yet).
  2. First-party PDFs in rag-sources/ (AS4457 summary, WorkSafe guideline).
  3. rag-sources/*.md - the curated Jewell Tyres knowledge base.
  4. The OTR site's own reference content (reference.html) - TRA codes,
     naming, mixing rules, glossary, failure modes, AS4457 summary.
  5. The tyre guide records (data/tyres.json) - brand,
     pattern, size designation, applications. Numeric spec VALUES (rim width
     etc.) are deliberately excluded: those are served by Track A only.

Each JSONL line carries provenance (source + page/section) for the portal
worker's citations.

  python -m tyre_rag.scripts.build_corpus_jsonl   # -> tyre_rag/index/prose_chunks.jsonl
"""
from __future__ import annotations

import json
import re
from html.parser import HTMLParser

import fitz

from tyre_rag.pipeline import config, prose

REPO = config.ROOT.parent
RAG_SOURCES = REPO / "rag-sources"
SITE = REPO / "otr-earthmover-tyre"
SITE_PAGES = ["reference.html"]
TYRES_JSON = SITE / "data" / "tyres.json"

# Keep chunks comfortably inside the embedder's window (~512 tokens).
MAX_CHUNK_CHARS = 1800


def _split_long(text: str) -> list[str]:
    """Split a section into <= MAX_CHUNK_CHARS pieces on sentence boundaries."""
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= MAX_CHUNK_CHARS:
        return [text] if text else []
    out, cur = [], ""
    for sent in re.split(r"(?<=[.!?])\s+", text):
        if cur and len(cur) + len(sent) + 1 > MAX_CHUNK_CHARS:
            out.append(cur)
            cur = sent
        else:
            cur = f"{cur} {sent}".strip()
    if cur:
        out.append(cur)
    return out


class _Emitter:
    def __init__(self, fh):
        self.fh = fh
        self.n = 0

    def emit(self, text: str, source: str, section: str, page=None):
        text = text.strip()
        if len(text) < 60:
            return
        self.fh.write(json.dumps({
            "id": f"{source}-{self.n}",
            "text": text,
            "source": source,
            "page": page,
            "section": section,
        }) + "\n")
        self.n += 1


def add_pdf(em: _Emitter, pdf) -> int:
    doc = fitz.open(pdf)
    pages = 0
    for i in range(doc.page_count):
        text = doc[i].get_text("text")
        if not text.strip():
            continue
        chunks = prose.chunk_page(text)
        if chunks:
            pages += 1
        for section, body in chunks:
            for piece in _split_long(body):
                em.emit(piece, pdf.name, section, page=i + 1)
    doc.close()
    return pages


def add_markdown(em: _Emitter, path):
    section = "General"
    buf: list[str] = []

    def flush():
        for piece in _split_long(" ".join(buf)):
            em.emit(piece, path.name, section)
        buf.clear()

    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        m = re.match(r"^#{1,3}\s+(.*)", line)
        if m:
            flush()
            section = re.sub(r"[*_`#]", "", m.group(1)).strip()
            continue
        line = re.sub(r"[*_`]", "", line)
        line = re.sub(r"^\s*[-•]\s*", "", line)
        if line:
            buf.append(line)
        elif buf and len(" ".join(buf)) > MAX_CHUNK_CHARS:
            flush()
    flush()


class _SectionText(HTMLParser):
    """Extract visible text from a site page, sectioned by h2/h3 headings."""
    SKIP = {"script", "style", "nav", "header", "footer", "head", "title"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.sections: list[tuple[str, list[str]]] = [("General", [])]
        self._skip_depth = 0
        self._heading: str | None = None

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self._skip_depth += 1
        elif tag in ("h2", "h3") and not self._skip_depth:
            self._heading = ""

    def handle_endtag(self, tag):
        if tag in self.SKIP and self._skip_depth:
            self._skip_depth -= 1
        elif tag in ("h2", "h3") and self._heading is not None:
            title = re.sub(r"\s+", " ", self._heading).strip().lstrip("/ ")
            if title:
                self.sections.append((title, []))
            self._heading = None

    def handle_data(self, data):
        if self._skip_depth:
            return
        if self._heading is not None:
            self._heading += data
        else:
            text = data.strip()
            if text:
                self.sections[-1][1].append(text)


def add_site_page(em: _Emitter, path):
    parser = _SectionText()
    parser.feed(path.read_text(encoding="utf-8"))
    source = f"otrearthmovertyre.com/{path.name}"
    for section, texts in parser.sections:
        for piece in _split_long(" ".join(texts)):
            em.emit(piece, source, section)


def add_tyre_guide(em: _Emitter, path):
    data = json.loads(path.read_text(encoding="utf-8"))
    for t in data.get("tyres", []):
        parts = [f"{t.get('brand', '')} {t.get('model', '')} — size {t.get('size', '')}"]
        if t.get("tra_code"):
            parts.append(f"TRA service code {t['tra_code']}")
        if t.get("construction"):
            parts.append(f"{t['construction']} construction")
        if t.get("compound"):
            parts.append(f"{t['compound']} compound")
        if t.get("application"):
            parts.append("applications: " + ", ".join(t["application"]))
        if t.get("compatible_machines"):
            parts.append("fitted to: " + ", ".join(t["compatible_machines"]))
        if t.get("description"):
            parts.append(t["description"])
        # Numeric spec values (rim width etc.) intentionally omitted - Track A only.
        em.emit(". ".join(p.strip().rstrip(".") for p in parts if p.strip()) + ".",
                "otrearthmovertyre.com/tyres.html",
                f"Tyre Guide — {t.get('brand', '')} {t.get('model', '')}")


def main():
    out = config.INDEX / "prose_chunks.jsonl"
    with open(out, "w", encoding="utf-8") as fh:
        em = _Emitter(fh)

        databooks = sorted(p for p in config.SOURCES.glob("*.pdf") if "SYNTHETIC" not in p.name)
        for pdf in databooks:
            pages = add_pdf(em, pdf)
            print(f"  {pdf.name}: {pages} text pages")
        if not databooks:
            print("  (no manufacturer databooks in tyre_rag/sources/ - run sync_sources to add them)")

        for pdf in sorted(RAG_SOURCES.glob("*.pdf")):
            pages = add_pdf(em, pdf)
            print(f"  rag-sources/{pdf.name}: {pages} text pages")

        for md in sorted(RAG_SOURCES.glob("*.md")):
            before = em.n
            add_markdown(em, md)
            print(f"  rag-sources/{md.name}: {em.n - before} chunks")

        for page in SITE_PAGES:
            path = SITE / page
            if path.exists():
                before = em.n
                add_site_page(em, path)
                print(f"  {page}: {em.n - before} chunks")

        if TYRES_JSON.exists():
            before = em.n
            add_tyre_guide(em, TYRES_JSON)
            print(f"  data/tyres.json: {em.n - before} tyre records")

        n = em.n
    print(f"\nwrote {n} chunks -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
