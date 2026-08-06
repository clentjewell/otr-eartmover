"""Central configuration for the accuracy-first tyre-data pipeline.

All paths are local and self-contained so the trial run ports cleanly to
Cloudflare (D1/Vectorize/R2) and Airtable later. Nothing here reaches the
network unless a provider key is present in the environment.
"""
from __future__ import annotations

import os
from pathlib import Path

# --- Paths -----------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent          # tyre-rag/
SOURCES = ROOT / "sources"
EXTRACTED = ROOT / "extracted"
CROPS = ROOT / "crops"
INDEX = ROOT / "index"
SCRIPTS = ROOT / "scripts"
DB_PATH = INDEX / "tyre_rag.db"
REVIEW_QUEUE = ROOT / "REVIEW_QUEUE.csv"
MORNING_REPORT = ROOT / "MORNING_REPORT.md"
SIGNOFF = SCRIPTS / "signoff.csv"
GOLD_QA = SCRIPTS / "gold_qa.json"

for _d in (SOURCES, EXTRACTED, CROPS, INDEX, SCRIPTS):
    _d.mkdir(parents=True, exist_ok=True)

# --- Rasterising -----------------------------------------------------------
RASTER_DPI = int(os.getenv("RASTER_DPI", "200"))
CROP_DPI = int(os.getenv("CROP_DPI", "220"))

# --- Extraction providers (two independent vision-capable models) ----------
# Track A runs two independent passes. If only one provider key is present the
# pipeline runs two passes on it with different settings and flags the run as
# single-provider (weaker). If no key is present it falls back to a no-model
# deterministic heuristic extractor, which never produces a servable record.
PROVIDER_A_KEY = os.getenv("EXTRACT_PROVIDER_A_KEY")
PROVIDER_A_VENDOR = os.getenv("EXTRACT_PROVIDER_A_VENDOR", "anthropic")
PROVIDER_A_MODEL = os.getenv("EXTRACT_PROVIDER_A_MODEL", "claude-opus-4-8")

PROVIDER_B_KEY = os.getenv("EXTRACT_PROVIDER_B_KEY")
PROVIDER_B_VENDOR = os.getenv("EXTRACT_PROVIDER_B_VENDOR", "openai")
PROVIDER_B_MODEL = os.getenv("EXTRACT_PROVIDER_B_MODEL", "gpt-4o")

# --- Embeddings (Track B) --------------------------------------------------
EMBED_KEY = os.getenv("EMBED_PROVIDER_KEY")
EMBED_VENDOR = os.getenv("EMBED_PROVIDER_VENDOR", "openai")
EMBED_MODEL = os.getenv("EMBED_PROVIDER_MODEL", "text-embedding-3-small")
EMBED_DIM_FALLBACK = 256

# --- Cost ceiling ----------------------------------------------------------
MAX_COST_USD = float(os.getenv("MAX_COST_USD", "20"))
COST_PER_PAGE_PASS = float(os.getenv("COST_PER_PAGE_PASS", "0.02"))   # per pass, per page
COST_PER_EMBED = float(os.getenv("COST_PER_EMBED", "0.00002"))        # per chunk

# --- Validation gates (physically plausible OTR bounds) --------------------
# Inclusive (low, high). Anything outside flags needs_review regardless of A/B
# agreement. Bounds are deliberately wide; the point is to catch the dangerous
# class of error (unit swaps, transposed digits), not to second-guess the OEM.
BOUNDS = {
    "section_width_mm": (200.0, 2300.0),
    "overall_diameter_mm": (700.0, 4600.0),
    "inflation_pressure_kpa": (100.0, 1100.0),
    "tkph_tmph": (10.0, 3000.0),
}
# A pressure presented as kPa but below this is suspiciously psi-like
# (the classic, dangerous kPa/psi confusion). 100 psi = 689 kPa.
PSI_LIKE_KPA_MAX = 160.0

# --- Prose chunking (Track B) ---------------------------------------------
CHUNK_MIN_TOKENS = 400
CHUNK_MAX_TOKENS = 800
CHUNK_OVERLAP_TOKENS = 80
TOKENS_PER_CHAR = 0.25   # rough token estimate: ~4 chars per token


def provider_mode() -> str:
    """Describe the available extraction capability for the morning report."""
    if PROVIDER_A_KEY and PROVIDER_B_KEY:
        return "dual-provider"
    if PROVIDER_A_KEY or PROVIDER_B_KEY:
        return "single-provider"
    return "no-model-fallback"
