"""The mandatory output contract. Every served answer carries source
attribution, the standing disclaimer, and the site-level notice. British/
Australian English; smart quotes and en dashes; no icons or emoji."""
from __future__ import annotations

SITE_NOTICE = (
    "Technical data on this site is reproduced from publicly available "
    "manufacturer databooks and is provided for general reference only. It is "
    "not a substitute for current manufacturer specifications or professional "
    "advice. Always consult the original equipment manufacturer before making "
    "fitment, loading, or inflation decisions. To the maximum extent permitted "
    "by law, Jewell Tyres Pty Ltd accepts no liability for reliance on this "
    "information; nothing here excludes rights that cannot be excluded under "
    "the Australian Consumer Law."
)


GENERATIVE_DISCLAIMER = (
    "AI-generated answer, composed by an automated system from manufacturer "
    "databooks, TRA and AS4457 material and Jewell Tyres' trading experience. "
    "It can be incomplete, out of date or wrong, and citations do not guarantee "
    "accuracy. This is general technical reference, not professional or "
    "engineering advice — verify every figure, especially pressures, loads, "
    "fitment, mixing and repair decisions, against current OEM/manufacturer "
    "documentation and qualified inspection before acting. To the maximum "
    "extent permitted by law, Jewell Tyres Pty Ltd accepts no liability for "
    "reliance on this answer; nothing here excludes rights that cannot be "
    "excluded under the Australian Consumer Law."
)


def disclaimer(manufacturer: str | None, edition_year, page) -> str:
    manu = manufacturer or "the manufacturer"
    year = edition_year if edition_year else "n.d."
    pg = page if page is not None else "n.a."
    return (
        f"Specification reproduced for reference from the {manu} {year} "
        f"databook, page {pg}. Confirm against the current manufacturer "
        f"specification before any fitment, loading, or inflation decision — "
        f"specifications change between editions. Consult {manu} or an "
        f"authorised dealer for application-specific advice."
    )


def attribution(manufacturer: str | None, edition_year, page) -> str:
    return (
        f"{manufacturer or 'Unknown manufacturer'} — "
        f"{edition_year or 'n.d.'} databook, page {page if page is not None else 'n.a.'}"
    )


ABSTAIN = (
    "That value is not held in the verified, signed-off dataset, so it is not "
    "reproduced here. Consult the original equipment manufacturer or an "
    "authorised dealer for this figure. It is never estimated."
)
