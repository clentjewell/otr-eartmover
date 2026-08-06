# Knowledge Portal — RAG evaluation queries

15 queries to run against the deployed `/api/ask` endpoint after ingestion. Scored: Pass / Marginal / Fail.

**Pass criteria:**
- Relevant chunks retrieved (top-K includes correct sources)
- Answer is grounded in retrieved context (no hallucination)
- Citations included and accurate
- Voice matches the system prompt (plain-spoken, AU English, no marketing-speak)
- Appropriate disclaimer appended
- For Tier 3 queries: declines gracefully with redirect to David direct

---

## Tier 1 — Should retrieve and answer well

These have direct factual answers in the corpus (TRA codebook, AS4457 summary, manufacturer databooks, knowledge base).

| # | Query | Expected behaviour |
|---|---|---|
| 1 | What is the TRA service code E-4? | Define E-4 (extra-deep tread haul truck tyre). Cite TRA Year Book and AS4457. Mention common sizes (40.00R57, 33.00R51). |
| 2 | Compare TKPH ratings for Bridgestone VRPS and Goodyear RM-4A+ in 50/65R51. | Cite both databooks. If specific TKPH numbers not in corpus, decline and explain methodology. |
| 3 | What size tyres does a Caterpillar 992K use? | 45/65R45 L-5 standard fitment. Cite CAT specifications + Jewell trading experience. |
| 4 | Explain AS4457 in plain English. | Summary of the Australian Standard, what it covers, where it applies. Cite AS4457 summary doc. |
| 5 | What does the L-5S service code mean? | Smooth extra-deep tread for underground loaders. Cite TRA and AS4457. |

## Tier 2 — Should retrieve with caveats

These are opinion-flavoured but answerable. Must distinguish fact from Jewell trading view.

| # | Query | Expected behaviour |
|---|---|---|
| 6 | Which tyre brand is best for haul trucks in the Pilbara? | Open with "depends on" — cycle, ambient, compound. Name Bridgestone, Michelin, Goodyear, Yokohama as credible tier-one. Cite as Jewell trading view, not absolute. Recommend talking to David for fleet-specific call. |
| 7 | How do I calculate the heat capacity for a loader tyre? | Walk through WCF (Work Capacity Factor). Reference manufacturer databook methodology. Link to calculators page. |
| 8 | What's the difference between a procurement model and a dispersal model? | Procurement = sourcing tyres for buyers. Dispersal = moving surplus stock from sellers. Cite knowledge base. |
| 9 | Can I mix Bridgestone and Michelin on the same machine? | YES if same construction, size, load index, speed, TRA code on same axle. Cite AS4457 mixing rules. |
| 10 | What are the EPA disposal requirements for OTR tyres in QLD? | Cite TSA and state regulation. If specific QLD detail not in corpus, decline gracefully. |

## Tier 3 — Should decline gracefully

These should refuse to answer (with reasoning) or redirect to David direct.

| # | Query | Expected behaviour |
|---|---|---|
| 11 | What's the current spot price for a 40.00R57 Bridgestone VRPS? | Decline. Pricing is opaque, relationship-driven, not in corpus. Redirect to David direct on 0419 358 439. |
| 12 | Who is Jewell Tyres' biggest customer? | Decline. Commercially sensitive. Not in corpus. |
| 13 | Should I buy new or used tyres for my fleet? | Redirect — depends on application, budget, downtime tolerance, fleet position. Lay out the factors but refuse to make the call. |
| 14 | What tyres should I buy for my dump truck? | Ask back — what model, what size, what application, what cycle? Insufficient context for an answer. |
| 15 | Tell me about Stoneway Heavy Industries tyres. | Decline. Brand not in corpus. Suggest user verify the spelling or try a known brand from the brand directory. |

---

## Eval procedure

1. Run each query through `POST https://otrearthmovertyres.com/api/ask` with body `{"q": "<query>"}`.
2. For each response, record in `BUILD_LOG.md` under "RAG eval":
   - Query text
   - Top retrieved chunks (count, sources, scores) — if logged in worker
   - Generated lede + body (full text)
   - Citations included (count, accuracy spot-check)
   - Pass / Marginal / Fail rating with one-line reasoning
3. **Target:** ≥10/15 Tier 1+2 queries Pass, ≥4/5 Tier 3 queries Pass (decline gracefully).
4. If overall <70% pass rate: tune chunking (size, overlap), retrieval threshold (`0.65` default), or system prompt before re-running.

---

## Operator quick-test (no full eval)

For a fast sanity check, run query #3 ("What size tyres does a Caterpillar 992K use?"). Should return ~4 lines with citation footnotes and disclaimer. If this looks right, the pipeline is healthy.
