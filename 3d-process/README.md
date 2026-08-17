# otrearthmovertyres.com - 3D Process pack

The 3D Process output for otrearthmovertyres.com, built the way the Adam Hall
pack is built, in two layers:

| Route | What it is |
|---|---|
| `/` | The summary walkthrough. Sticky sidebar contents, welcome landing, Start here band, ten numbered pages with prev/next, and an inline viewer so links open in place. |
| `/pack` | The four printable sheets: 3D on a page, Discover, Design, Deploy. |

Same structure and artifact set as the Adam Hall pack, in the OTR palette,
populated from this repository.

## Files

| File | Purpose |
|---|---|
| `worker.js` | Routing and the password gate. |
| `summary.js` | The summary walkthrough. |
| `sheets.js` | The four sheets. |

It is a private pack, not a site page. It is not in `sitemap.xml`, it is not
crawlable, and it is served by its own worker so it never touches the
Knowledge Portal stack.

## Deploy

Two deploy targets, both built from the same modules so they cannot drift.

### Cloudflare Pages (current)

```bash
node 3d-process/build-pages.mjs
cd 3d-process/pages && npx wrangler pages deploy public --project-name otr-3d-process --branch main
```

Live at **https://otr-3d-process.pages.dev**. The build writes `public/index.html`
(summary), `public/pack.html` (the four sheets), `public/_headers`, and
`functions/_middleware.js`, which is the password gate. Build output is
generated and git-ignored; edit the modules, not the output.

### Cloudflare Worker (alternative)

```bash
npx wrangler deploy -c 3d-process/wrangler.toml
```

## Password

The gate reads `SITE_PASSWORD`, falling back to `otr2026` if the secret is not
set. Set a real one before sharing the link:

```bash
# Pages
cd 3d-process/pages && npx wrangler pages secret put SITE_PASSWORD --project-name otr-3d-process

# Worker
npx wrangler secret put SITE_PASSWORD -c 3d-process/wrangler.toml
```

To rotate, run the same command again with a new value and redeploy. Existing
cookies stop working immediately, because the cookie holds a hash of the
current password.

## What is on each sheet

| Sheet | Content |
|---|---|
| 1. The 3D Process | Belief, position, constraint. Discover to Deepen flow with status. The CORE. The plan. Decision and north star. What is automated and what stays human. The numbers. Gate summaries. |
| 2. Discover | Belief, READY checklist, CQ01 to CQ10, the CORE in full with evidence, position, evidence list, Gate 1 decision. |
| 3. Design | Strategy on a line. Brand, customer, business model. Messaging, platform, success measures. CQ11 to CQ16. Gate 2 band. |
| 4. Deploy | Activation and cadence. Three-phase launch sequence with exit tests. Channel plan. Automation triage. Measurement. CQ17 to CQ22. Risks, next moves, Gate 3. |

Print or Save PDF from the bar gives the four sheets, each starting on a new
page, set to A4 landscape.

A note on print scale, because it is easy to be surprised by it. These are dense
working sheets, so at 100% each one runs across two or three physical pages.
That is how the reference packs behave too, measured at the same width. For one
physical page per sheet, set Scale to Fit in the browser print dialog. The
`page-break-after` rule means a sheet never runs into the next one either way.

## Brand

Built to **Brand Identity Version 1 (August 2026)**, the current manual, which
supersedes DS09 v02:

- Black `#0B0B0B` ground at 60%, white type at 30%, one high-vis orange
  `#FB8C1F` at 10%. Surfaces `#151515` and `#1C1C1C`, hairlines `#2C2C2C` at
  1px and never heavier.
- Jewell safety amber `#FEC013` appears only on the "Powered by Jewell Tyres"
  endorsement, per the reserved-use rule.
- Archivo for language, IBM Plex Mono for data. One grotesque, one mono, no
  third typeface.
- Wordmark set lowercase with the full stop in orange, never in capitals.
  Endorsement is type-only, sits behind a hairline, and never leads.
- Hard edges. No rounded corners, no drop shadows, no floating cards.

## How the CORE was sourced

There was no discovery session for OTR. The CORE (Customers, Offering, Rivals,
Expression) was extracted from this repository, front end and backend, on the
instruction that the material was already here. Principal sources:

| CORE element | Read from |
|---|---|
| Customers | `JP_JewellTyres_WebsiteBuildBrief_v03.md` section 1.5 (jewelltyres repo), `llms.txt`, `faq.html`, `worker/eval-queries.md` |
| Offering | `index.html`, `about.html`, `reference.html`, `calculators.html`, `brands.html`, `market-notes.html`, `ask.html`, `data/tyres.json` |
| Rivals | `about.html` premise section, `brands.html` tier classification, Market Notes 01, 02, 12, 13, 14, `rag-sources/JEWELL-TYRES-KNOWLEDGE-BASE.md` |
| Expression | `CLAUDE.md`, `css/main.css`, `worker/system-prompt.md`, `llms.txt`, `robots.txt`, `legal.html` |
| Backend and status | `RAG-GO-LIVE.md`, `worker/README.md`, `worker/api/ask.js`, `functions/api/ask.js`, `supabase/functions/ask/index.ts`, `tyre_rag/README.md`, `tyre_rag/MORNING_REPORT.md`, `tyre_rag/REVIEW_QUEUE.csv`, `scripts/rag-ingest.js`, `wrangler.toml` |

Three CORE gaps are named on the sheets rather than filled, because the
repository does not answer them: no customer research or traffic data, no
analysis of competing information sources, and no definition of what success
looks like.

## Figures

Every figure on the sheets is either counted from this repository or attributed
to its source at the point of use. Market-size figures are Credence Research,
converted from USD at an indicative AUD 1 = USD 0.65 as `market-notes.html`
does. Nothing is estimated.
