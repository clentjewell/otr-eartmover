"""Track B: chunk narrative text by semantic section, embed, and index for
hybrid (vector + keyword) retrieval. Numeric specification tables are handled
by Track A and deliberately not embedded for generative answering."""
from __future__ import annotations

import re

from . import config, db, embeddings
from .providers import SIZE_RE

HEADING_RE = re.compile(r"^([A-Z0-9][A-Z0-9 .,'&/\-]{3,70})$")


def _tok(text: str) -> int:
    return max(1, int(len(text) * config.TOKENS_PER_CHAR))


def _looks_like_table(line: str) -> bool:
    """Skip dense numeric/table lines - those belong to Track A."""
    if SIZE_RE.search(line):
        return True
    digits = sum(c.isdigit() for c in line)
    return len(line) > 0 and digits / max(1, len(line)) > 0.35


def chunk_page(text: str) -> list[tuple[str, str]]:
    """Yield (section_title, chunk_text) for one page's prose."""
    section = "General"
    paras: list[str] = []
    buf: list[str] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            if buf:
                paras.append(" ".join(buf))
                buf = []
            continue
        h = HEADING_RE.match(line)
        if h and len(line.split()) <= 9:
            if buf:
                paras.append(" ".join(buf))
                buf = []
            paras.append("\x00" + line)  # section marker
            continue
        if _looks_like_table(line):
            continue
        buf.append(line)
    if buf:
        paras.append(" ".join(buf))

    chunks: list[tuple[str, str]] = []
    cur: list[str] = []
    cur_tokens = 0
    for p in paras:
        if p.startswith("\x00"):
            if cur:
                chunks.append((section, " ".join(cur)))
                cur, cur_tokens = [], 0
            section = p[1:]
            continue
        if len(p) < 30:
            continue
        cur.append(p)
        cur_tokens += _tok(p)
        if cur_tokens >= config.CHUNK_MAX_TOKENS:
            chunks.append((section, " ".join(cur)))
            # carry overlap
            overlap, otok = [], 0
            for q in reversed(cur):
                overlap.insert(0, q)
                otok += _tok(q)
                if otok >= config.CHUNK_OVERLAP_TOKENS:
                    break
            cur, cur_tokens = overlap, otok
    if cur and cur_tokens >= config.CHUNK_MIN_TOKENS // 2:
        chunks.append((section, " ".join(cur)))
    return chunks


def persist(conn, file_id, page, text, page_meta) -> int:
    chunks = chunk_page(text)
    if not chunks:
        return 0
    vectors = embeddings.embed_texts([c[1] for c in chunks])
    for (section, body), vec in zip(chunks, vectors):
        db.insert_chunk(
            conn, file_id, page,
            page_meta.get("manufacturer"), page_meta.get("edition_year"),
            page_meta.get("source_file"), section, body, _tok(body),
            embeddings.to_blob(vec),
        )
    conn.commit()
    return len(chunks)
