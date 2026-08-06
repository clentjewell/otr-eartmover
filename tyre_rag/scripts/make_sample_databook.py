"""Generate a CLEARLY SYNTHETIC sample databook PDF for pipeline validation.

This file exists only to exercise Track A (dual-pass extraction, validation
gates, source crops, review queue) end to end without a vision model or any
real manufacturer data. The 'manufacturer' is SAMPLE and the figures are
invented. Nothing here can ever be served: no row is signed off, so the commit
step will not promote it. Do not treat any value in this file as real.
"""
from pathlib import Path

import fitz

OUT = Path(__file__).resolve().parent.parent / "sources" / "SAMPLE-OTR-Databook-SYNTHETIC-2099.pdf"

ROWS = [
    "27.00R49 E-4 2-star 19.50/2.5 768mm 2415 700kPa TKPH 540 Haulage",
    "40.00R57 E-4 2-star 29.00/6.0 1185mm 3576 600kPa TKPH 480 Haulage",
    "26.5R25 L-5 1-star 22.00/3.0 726mm 1750 350kPa Loader",
    "29.5R29 L-5 1-star 25.00/3.5 845mm 2090 100kPa Loader",   # psi-like swap
    "50/80R57 E-4 2-star 33.00/6.0 1480mm 3950 650kPa TKPH 510 Haulage",
]


def main():
    doc = fitz.open()
    page = doc.new_page()
    y = 60
    page.insert_text((50, y), "SYNTHETIC SAMPLE DATABOOK — NOT REAL MANUFACTURER DATA",
                     fontsize=13, fontname="helv")
    y += 24
    page.insert_text((50, y), "Manufacturer: SAMPLE   Edition: 2099   For pipeline validation only",
                     fontsize=10, fontname="helv")
    y += 30
    header = "Size        TRA  Rating Rim        SecW   OD    Inflation  TKPH    Application"
    page.insert_text((50, y), header, fontsize=9, fontname="cour")
    y += 18
    for row in ROWS:
        page.insert_text((50, y), row, fontsize=9, fontname="cour")
        y += 18
    y += 20
    page.insert_text((50, y),
                     "Note: figures are invented and must never be published.",
                     fontsize=9, fontname="helv")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)
    doc.close()
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
