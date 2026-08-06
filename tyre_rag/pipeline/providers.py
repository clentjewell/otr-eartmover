"""Track A extraction providers.

Two independent passes feed the verifier. Three execution modes:

  dual-provider     : provider A and provider B (different vendors/models).
  single-provider   : one key present, two passes with different settings
                      (flagged weaker in the report).
  no-model-fallback : no key present. A deterministic text-layer heuristic runs
                      two passes (strict + loose). This NEVER yields a servable
                      record - every row is forced to needs_review - but it
                      proves the full pipeline end to end offline.

A language model is used here only to *ingest* candidates. It is never in the
path when a number is later served to a user.
"""
from __future__ import annotations

import base64
import json
import os
import re
import urllib.request

from . import config

# --- Patterns --------------------------------------------------------------
# OTR size designations: 27.00R49, 40.00R57, 45/65R45, 26.5R25, 18.00-25, 14.00-24
SIZE_RE = re.compile(
    r"\b("
    r"\d{1,2}\.\d{2}R\d{2}"        # 27.00R49
    r"|\d{2}/\d{2}R\d{2}"          # 45/65R45
    r"|\d{2}\.\d R\d{2}"           # 26.5 R25 (spaced)
    r"|\d{2}\.\dR\d{2}"            # 26.5R25
    r"|\d{1,2}\.\d{2}-\d{2}"       # 18.00-25
    r")\b"
)
TRA_RE = re.compile(r"\b([ELG]-\d[A-Z]?)\b")     # E-4, L-5, L-5S, G-1
NUM_RE = re.compile(r"\d+(?:\.\d+)?")


def extract_specs(file_id, page_no, image_path, words_payload, page_meta, pass_id):
    """Return a list of spec-candidate dicts for one page from one pass."""
    vendor, key, model = _pass_config(pass_id)
    if key:
        try:
            return _vision_extract(image_path, page_meta, vendor, key, model, pass_id)
        except Exception as exc:
            print(f"    {pass_id} vision provider failed ({exc}); using fallback")
    return _fallback_extract(file_id, page_no, words_payload, page_meta, pass_id)


def _pass_config(pass_id):
    if pass_id == "A":
        return config.PROVIDER_A_VENDOR, config.PROVIDER_A_KEY, config.PROVIDER_A_MODEL
    # Pass B uses provider B if present, else provider A with different settings.
    if config.PROVIDER_B_KEY:
        return config.PROVIDER_B_VENDOR, config.PROVIDER_B_KEY, config.PROVIDER_B_MODEL
    return config.PROVIDER_A_VENDOR, config.PROVIDER_A_KEY, config.PROVIDER_A_MODEL


# --- Real vision extraction ------------------------------------------------
EXTRACT_PROMPT = """You are transcribing a printed off-the-road tyre databook \
specification table. Extract EVERY data row you can read in the table on this \
page. Transcribe digits exactly as printed - do not infer, round, convert \
units, or fill gaps. If a cell is blank or unreadable, use null.

Return ONLY a JSON array. Each element:
{"size_designation": str, "tra_code": str|null, "rating": str|null,
 "load_index": str|null, "rim_recommendation": str|null,
 "section_width_mm": number|null, "overall_diameter_mm": number|null,
 "inflation_pressure_kpa": number|null, "tkph_tmph": number|null,
 "application": str|null, "raw_cell_context": str}
raw_cell_context must be the verbatim text of the source row. If the page has \
no specification table, return []."""


def _vision_extract(image_path, page_meta, vendor, key, model, pass_id):
    with open(image_path, "rb") as fh:
        b64 = base64.standard_b64encode(fh.read()).decode()
    # Pass B nudged to a different reading strategy to make the two passes
    # genuinely independent even in single-provider mode.
    extra = "" if pass_id == "A" else \
        "\nRead column by column, then reconcile into rows. Be conservative."
    prompt = EXTRACT_PROMPT + extra

    if vendor == "anthropic":
        body = {
            "model": model, "max_tokens": 4096,
            "messages": [{"role": "user", "content": [
                {"type": "image", "source": {"type": "base64",
                 "media_type": "image/png", "data": b64}},
                {"type": "text", "text": prompt},
            ]}],
        }
        base = os.getenv("ANTHROPIC_BASE_URL", "https://api.anthropic.com").rstrip("/")
        req = urllib.request.Request(
            base + "/v1/messages",
            data=json.dumps(body).encode(),
            headers={"x-api-key": key, "anthropic-version": "2023-06-01",
                     "content-type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=120) as r:
            payload = json.loads(r.read())
        text = "".join(b.get("text", "") for b in payload.get("content", []))
    elif vendor == "openai":
        body = {
            "model": model,
            "messages": [{"role": "user", "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url":
                 {"url": f"data:image/png;base64,{b64}"}},
            ]}],
        }
        req = urllib.request.Request(
            "https://api.openai.com/v1/chat/completions",
            data=json.dumps(body).encode(),
            headers={"Authorization": f"Bearer {key}",
                     "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=120) as r:
            payload = json.loads(r.read())
        text = payload["choices"][0]["message"]["content"]
    else:
        raise NotImplementedError(f"vendor {vendor} not wired")

    rows = _parse_json_array(text)
    return [_decorate(r, page_meta) for r in rows if r.get("size_designation")]


def _parse_json_array(text: str) -> list[dict]:
    m = re.search(r"\[.*\]", text, re.S)
    if not m:
        return []
    try:
        data = json.loads(m.group(0))
        return data if isinstance(data, list) else []
    except Exception:
        return []


# --- No-model fallback heuristic -------------------------------------------
def _fallback_extract(file_id, page_no, words_payload, page_meta, pass_id):
    from . import rasterise
    text = words_payload.get("text", "")
    words = words_payload.get("words", [])
    records = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        sm = SIZE_RE.search(line)
        if not sm:
            continue
        size = sm.group(1)
        tm = TRA_RE.search(line)
        rec = {
            "size_designation": size,
            "tra_code": tm.group(1) if tm else None,
            "rating": None, "load_index": None, "rim_recommendation": None,
            "section_width_mm": None, "overall_diameter_mm": None,
            "inflation_pressure_kpa": None, "tkph_tmph": None,
            "application": None,
            "raw_cell_context": line[:300],
        }
        # Labelled units are safe to read in both passes.
        _grab_labelled(line, rec)
        if pass_id != "A":
            # Loose pass also guesses bare numbers positionally. This will often
            # disagree with the strict pass, which correctly drives review.
            _grab_positional(line, size, rec)
        rec = _decorate(rec, page_meta)
        bbox = _word_bbox(words, size)
        if bbox:
            rec["source_crop_path"] = rasterise.crop_region(
                file_id, page_no, _row_band(bbox, words_payload), tag=size)
        records.append(rec)
    return records


def _grab_labelled(line, rec):
    m = re.search(r"(\d+(?:\.\d+)?)\s*kpa", line, re.I)
    if m:
        rec["inflation_pressure_kpa"] = float(m.group(1))
    m = re.search(r"(\d+(?:\.\d+)?)\s*mm", line, re.I)
    if m:
        rec["section_width_mm"] = float(m.group(1))
    m = re.search(r"tkph[^\d]*(\d+(?:\.\d+)?)", line, re.I)
    if m:
        rec["tkph_tmph"] = float(m.group(1))


def _grab_positional(line, size, rec):
    """Guess bare numbers by consuming them left-to-right in column order
    (section width, overall diameter, inflation, TKPH). Deliberately naive -
    this only runs in no-model fallback and exists to drive A/B disagreement."""
    tail = line.split(size, 1)[-1]
    nums = [float(n) for n in NUM_RE.findall(tail)]
    order = [
        ("section_width_mm", 200, 2300),
        ("overall_diameter_mm", 700, 4600),
        ("inflation_pressure_kpa", 100, 1100),
        ("tkph_tmph", 50, 3000),
    ]
    ptr = 0
    for field, lo, hi in order:
        for i in range(ptr, len(nums)):
            if lo <= nums[i] <= hi:
                if rec.get(field) is None:
                    rec[field] = nums[i]
                ptr = i + 1
                break


def _word_bbox(words, size):
    target = size.replace(" ", "")
    for w in words:
        if w["text"].replace(" ", "") == target or target in w["text"]:
            return w["bbox"]
    return None


def _row_band(bbox, words_payload):
    """Expand a word bbox to the full page width and a row-height band."""
    rect = words_payload.get("page_rect", [0, 0, 600, 800])
    x0, _, x1, _ = rect
    _, y0, _, y1 = bbox
    pad = (y1 - y0) * 1.4 + 4
    return [x0 + 2, y0 - pad, x1 - 2, y1 + pad]


def _decorate(rec, page_meta):
    rec.setdefault("source_crop_path", None)
    rec["manufacturer"] = rec.get("manufacturer") or page_meta.get("manufacturer")
    rec["edition_year"] = rec.get("edition_year") or page_meta.get("edition_year")
    rec["source_file"] = page_meta.get("source_file")
    for k in ("section_width_mm", "overall_diameter_mm",
              "inflation_pressure_kpa", "tkph_tmph"):
        v = rec.get(k)
        if isinstance(v, str):
            try:
                rec[k] = float(re.sub(r"[^\d.]", "", v)) if v.strip() else None
            except ValueError:
                rec[k] = None
    return rec
