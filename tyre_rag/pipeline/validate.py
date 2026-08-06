"""Validation gates. Any failed gate forces needs_review, regardless of whether
the two extraction passes agreed. This is the second line of defence against
the dangerous error classes: unit swaps, transposed digits, impossible geometry.
"""
from __future__ import annotations

from . import config


def validate_record(rec: dict) -> list[str]:
    """Return a list of human-readable validation flags. Empty list = clean."""
    flags: list[str] = []

    # --- Units sanity: the classic, dangerous kPa/psi confusion --------------
    kpa = rec.get("inflation_pressure_kpa")
    if kpa is not None:
        if kpa < config.PSI_LIKE_KPA_MAX:
            flags.append(
                f"inflation {kpa:g} kPa is suspiciously low - possible psi value "
                f"mislabelled as kPa (100 psi = 689 kPa)"
            )

    # --- Range checks against physically plausible OTR bounds ----------------
    for field, (lo, hi) in config.BOUNDS.items():
        val = rec.get(field)
        if val is None:
            continue
        if val < lo or val > hi:
            flags.append(f"{field} {val:g} outside plausible OTR range [{lo:g}, {hi:g}]")

    # --- Cross-field plausibility: geometry must hang together ---------------
    od = rec.get("overall_diameter_mm")
    sw = rec.get("section_width_mm")
    rim = _rim_diameter_mm(rec)

    if od is not None and rim is not None and od <= rim:
        flags.append(
            f"overall diameter {od:g} mm not greater than rim diameter "
            f"{rim:g} mm - impossible geometry"
        )
    if od is not None and rim is not None:
        # Two sidewalls cannot exceed the over-rim height by an implausible margin.
        sidewall_pair = od - rim
        if sidewall_pair <= 0 or sidewall_pair > od:
            flags.append("sidewall height implausible relative to overall diameter")
    if od is not None and sw is not None and sw >= od:
        flags.append(
            f"section width {sw:g} mm not less than overall diameter {od:g} mm"
        )
    return flags


def _rim_diameter_mm(rec: dict) -> float | None:
    """Derive nominal rim diameter (mm) from the size designation, e.g. R49 -> 49in."""
    size = (rec.get("size_designation") or "")
    import re
    m = re.search(r"[Rx\-](\d{2})\b", size)
    if not m:
        return None
    inches = int(m.group(1))
    if not (10 <= inches <= 63):
        return None
    return inches * 25.4
