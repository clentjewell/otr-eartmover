# Sourced Market Note — template & rules

How to turn a third-party market report (or any external data source) into a
Jewell Tyres **Market Note** that ranks well, reads well, benefits us, and stays
firmly on the right side of copyright.

Worked example live in `market-notes.html` → **Note 04** (built from Credence
Research's *Australia Off-the-Road Tire Market*). Copy that block and adapt.

---

## The one rule that keeps us safe

**Facts and figures aren't copyright — the expression of them is.**

- A market-size number, a CAGR, a regional share, a price range = a *fact*. We
  may state it.
- The report's sentences, phrasing, charts, tables and structure = *their
  expression*. We never reproduce it.

So: **take the numbers, attribute them, write everything else ourselves.** Never
paste a sentence from the source. Never rebuild their chart. Never present their
data as ours — always name the source at the point of use ("Credence Research
puts…", "on Credence Research's segmentation…") and again in the Sources block.

If in doubt, state fewer figures and add more of our own commentary. Our
commentary is the asset; their number is just the peg.

---

## House rules (see repo root CLAUDE.md — apply every time)

- **No em dashes (—) or en dashes (–). Anywhere.** Commas, full stops, brackets,
  or (between digits) hyphens. This is the biggest "obvious AI writing" tell.
- **Currency AUD.** Convert third-party USD at an indicative rate (state it, e.g.
  "AUD 1 = USD 0.65", round), keep the USD original in brackets or the sources
  note, and label the AUD as an indicative conversion. Never relabel USD as AUD.
- **Structure:** a "Key facts" summary panel at the VERY TOP (answer-engine
  liftable), then the article, then the opinion notice + Sources block at the
  BOTTOM.
- Avatar: use the monogram `author-block__avatar--mono` (no photo asset needed).

## Voice & framing (non-negotiable, matches the rest of the site)

- Plain-spoken, trader-to-buyer. Australian English (tyres, organised).
- **Opinion, not advice.** Everything evaluative is Jewell Tyres' opinion as an
  independent trader — not financial, procurement or engineering advice. Reuse
  the editorial-notice block. This is the same posture as the whole OTR site.
- Third-party figures are **"indicative estimates"**, always attributed, never
  endorsed by us. Say so in the notice and again in Sources & method.
- Add value the report can't: the *trade read*. A report gives the number; we
  give what it means for a buyer on the ground (availability, allocation, lead
  time, the trader channel). That contrast is the whole point of the piece.

---

## SEO / AI-answer richness checklist

Each note should earn the search/answer-engine traffic:

- [ ] **Question-shaped H2 title** targeting a real query ("How big is Australia's
      off-the-road tyre market?"). 
- [ ] **Descriptive `<h3>` subheads** that read as sub-questions/answers.
- [ ] **Stat callout** near the top (the reusable 4-tile grid) — scannable, and
      the figures the answer engines lift.
- [ ] **A "Common questions" block** in the prose, mirrored by **FAQPage
      JSON-LD** in `<head>` (Google/AI FAQ surface). Keep the answer text in the
      schema paraphrased and attributed — same copyright rule applies.
- [ ] **BlogPosting JSON-LD** entry added to the page's `blogPost` array, with a
      `citation` field naming the source.
- [ ] Update the page `<meta name="description">` + og/twitter to mention the new
      angle (keywords: *Australia OTR tyre market size*, *earthmover tyre*,
      *mining tyre demand*, state names, year, CAGR).
- [ ] Cross-link to 1–2 sibling notes (internal links help both readers and SEO).

---

## Build steps

1. **Pick a source** from [`MARKET_NOTES_BACKLOG.md`](./MARKET_NOTES_BACKLOG.md)
   (the source pipeline — ranked, with figures and note angles). Confirm the
   figures are still on the public page (not paywalled). Note the access date.
2. **Extract only discrete facts** — market size + year, CAGR + window, segment
   splits, regional shares, price ranges. Write them down with units.
3. **Add the BlogPosting** entry to the `blogPost` array (bump the note number,
   set `datePublished`, add `citation`).
4. **Add / extend the FAQPage** JSON-LD with 2–3 Q&As built from the figures.
5. **Add a note card** to `.note-list` (meta tag, question title, dek, byline).
6. **Add the article** `<section class="section theme-light" id="note-NN">`
   using the skeleton below.
7. **Fill the Sources & method block** — attribute, link (`rel="noopener
   nofollow"`), fair-dealing line.
8. **Update page meta description** with the new keywords.
9. **Proof for copyright**: read every sentence — is any of it the source's
   wording? Is every figure attributed at point of use? Only ship when yes/yes.
10. Mark the backlog row **Done** with the note number.

---

## Reusable HTML blocks

### Key facts panel (put at the very top, right after the dek — answer-engine liftable)
```html
<div style="margin: var(--s-5) 0 var(--s-6); padding: var(--s-5); background: rgba(191,110,27,0.06); border: 1px solid rgba(15,20,25,0.10); border-radius: 12px;">
  <div style="font-family: var(--otr-mono); font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--otr-amber-deep); margin-bottom: var(--s-3);">/ Key facts</div>
  <ul style="padding-left: var(--s-5); margin: 0; color: var(--otr-steel);">
    <li style="margin-bottom: 0.55rem; line-height: 1.6;">Direct, self-contained fact with the figure and its attribution.</li>
    <!-- 3 to 5 one-line facts. Each must stand alone if quoted by a chatbot. -->
  </ul>
</div>
```

### Monogram avatar (no photo file needed)
```html
<div class="author-block__avatar author-block__avatar--mono" aria-hidden="true">DJ</div>
```

### Stat callout (4 tiles)
```html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--s-3); margin: var(--s-6) 0;">
  <div style="padding: var(--s-4); background: rgba(191,110,27,0.06); border-radius: 12px; border: 1px solid rgba(15,20,25,0.08);">
    <div style="font-family: var(--otr-display); font-size: 1.9rem; font-weight: 700; color: var(--otr-graphite); line-height: 1;">VALUE</div>
    <div style="font-family: var(--otr-mono); font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--otr-steel); margin-top: 0.5rem;">LABEL</div>
  </div>
  <!-- repeat 3 more tiles -->
</div>
<p class="mono" style="font-size: 0.72rem; color: var(--otr-steel); margin-top: -0.5rem;">Source: <SOURCE>. Figures rounded.</p>
```

### Editorial notice (attributed-data variant)
```html
<p class="mono" style="font-size: 0.78rem; line-height: 1.6; color: var(--otr-steel-light); border-left: 3px solid var(--otr-steel-light); background: rgba(61,90,108,0.12); padding: 0.9rem 1.1rem; margin-bottom: var(--s-5);">
  Opinion and analysis based on Jewell Tyres' independent trading experience. The figures below are third-party estimates published by <SOURCE>, an independent research firm — attributed where they appear, and not verified, endorsed or produced by Jewell Tyres. This is not financial, investment, procurement or engineering advice. Estimates are indicative only; confirm against your own data before relying on them.
</p>
```

### Sources & method block
```html
<div style="margin-top: var(--s-7); padding: var(--s-5); background: rgba(0,0,0,0.04); border: 1px solid rgba(15,20,25,0.10); border-radius: 12px;">
  <div style="font-family: var(--otr-mono); font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--otr-amber-deep); margin-bottom: var(--s-3);">/ Sources &amp; method</div>
  <p style="font-size: 0.92rem; line-height: 1.6; color: var(--otr-steel); margin-bottom: var(--s-3);">Figures are drawn from the publicly published summary of <SOURCE + REPORT>, and are attributed to that source throughout. We reproduce discrete facts and figures only — the analysis, framing and commentary are Jewell Tyres' own.</p>
  <ul style="padding-left: var(--s-5); margin: 0;">
    <li style="font-size: 0.92rem; line-height: 1.6; color: var(--otr-steel); margin-bottom: 0.4rem;"><SOURCE> — <a href="<URL>" target="_blank" rel="noopener nofollow" style="color: var(--otr-amber-deep); border-bottom-color: rgba(191,110,27,0.4);">domain</a> (accessed <MONTH YEAR>).</li>
  </ul>
  <p style="font-size: 0.82rem; line-height: 1.55; color: var(--otr-steel); margin: var(--s-3) 0 0;">Third-party figures are cited under fair dealing for reporting and commentary. Rights in the underlying report remain with its publisher. Where an estimate is disputed or superseded by a later edition, the source prevails over our summary.</p>
</div>
```

---

## Do / Don't

| Do | Don't |
|---|---|
| State the figure, name the source at that spot | Present a third-party number as our own finding |
| Paraphrase in our own words | Copy or lightly reword their sentences |
| Frame our read as opinion | Frame anything as professional/engineering advice |
| Link the source (`nofollow`) | Deep-link to or rehost a paywalled/report PDF |
| Round figures and say "indicative" | Imply false precision or that we verified their data |
| Add the trade read they can't | Pad length with filler to hit a word count |
