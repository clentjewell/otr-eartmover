"""Rasterise PDF pages to high-resolution images, and capture the text layer
plus per-word bounding boxes (used for source crops and prose chunking)."""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

import fitz  # PyMuPDF

from . import config


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for block in iter(lambda: fh.read(1 << 16), b""):
            h.update(block)
    return h.hexdigest()


def file_id_for(path: Path) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "-", path.stem).strip("-").lower()


def guess_manufacturer_edition(path: Path) -> tuple[str | None, int | None]:
    """Best-effort metadata from the filename; verified later by extraction."""
    name = path.stem
    year = None
    m = re.search(r"(19|20)\d{2}", name)
    if m:
        year = int(m.group(0))
    known = ["goodyear", "michelin", "bridgestone", "yokohama", "bkt",
             "aeolus", "belshina", "triangle", "techking", "worksafe", "as4457"]
    manu = None
    low = name.lower()
    for k in known:
        if k in low:
            manu = k.upper() if len(k) <= 5 else k.capitalize()
            break
    return manu, year


def rasterise_page(page: "fitz.Page", file_id: str, page_no: int) -> tuple[Path, Path]:
    """Render one page to PNG and dump its word boxes to JSON."""
    img_dir = config.EXTRACTED / file_id / "pages"
    img_dir.mkdir(parents=True, exist_ok=True)
    img_path = img_dir / f"p{page_no:04d}.png"
    if not img_path.exists():
        pix = page.get_pixmap(dpi=config.RASTER_DPI)
        pix.save(img_path)

    words_path = img_dir / f"p{page_no:04d}.words.json"
    if not words_path.exists():
        # (x0, y0, x1, y1, "word", block, line, word_no)
        words = page.get_text("words")
        payload = {
            "page_rect": list(page.rect),
            "words": [
                {"text": w[4], "bbox": [w[0], w[1], w[2], w[3]]}
                for w in words
            ],
            "text": page.get_text("text"),
        }
        words_path.write_text(json.dumps(payload), encoding="utf-8")
    return img_path, words_path


def crop_region(file_id: str, page_no: int, bbox: list[float], tag: str) -> str | None:
    """Render an image crop of a source table region. bbox in PDF points."""
    pdf_path = _open_files.get(file_id)
    if not pdf_path:
        return None
    crop_dir = config.CROPS / file_id
    crop_dir.mkdir(parents=True, exist_ok=True)
    safe = re.sub(r"[^A-Za-z0-9._-]+", "-", tag).strip("-")[:60]
    out = crop_dir / f"p{page_no:04d}-{safe}.png"
    if out.exists():
        return str(out.relative_to(config.ROOT))
    try:
        doc = fitz.open(pdf_path)
        page = doc[page_no - 1]
        rect = fitz.Rect(*bbox) & page.rect
        if rect.is_empty:
            return None
        pix = page.get_pixmap(dpi=config.CROP_DPI, clip=rect)
        pix.save(out)
        doc.close()
        return str(out.relative_to(config.ROOT))
    except Exception:
        return None


_open_files: dict[str, Path] = {}


def register_file(file_id: str, path: Path) -> None:
    _open_files[file_id] = path
