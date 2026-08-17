// Design, documents 21 to 41.
// Business and measurement, customer, brand, platform and channel strategy.

export const DESIGN_A = [
{ id:'business-plan', n:21, title:'Business Plan', sec:[
 ['The business this plan is for', `
  <p>otrearthmovertyres.com is a publishing asset owned by a trading business. It earns nothing directly. It exists to make Jewell Tyres the obvious call when an Australian or New Zealand operator needs off-the-road tyres, and, per Brand Identity v1, to become a saleable asset in its own right within 36 months.</p>
  <p>That second purpose changes the plan materially. A marketing site is built to convert. An asset built to sell must also hold value independently of its current owner, which is why the manual insists the identity, editorial standards and voice survive a change of ownership, and why the endorsement is designed as a removable layer.</p>`],
 ['Revenue model', `
  <p><strong>Direct:</strong> none. No advertising, no placement money, no paid access, no products sold. All four are stated commitments, not omissions.</p>
  <p><strong>Indirect:</strong> trade margin at Jewell Tyres on enquiries the platform influences. Currently unmeasured.</p>
  <p><strong>Terminal:</strong> sale of the platform inside 36 months.</p>`],
 ['Cost base', `
  <p>Cloudflare Pages and Workers hosting, Workers AI and Vectorize usage, a Supabase project, an Anthropic API key for generative answers, domain registrations including defensive variants, and the labour to write the corpus, the Market Notes and the reference. <em>[No cost figure appears anywhere in the repository. CQ20.]</em></p>`],
 ['The economics that decide it', `
  <p>The platform is worth running if the enquiries it influences carry more margin than it costs, or if the asset appreciates toward a sale price that justifies the build. Neither can currently be evaluated, because neither the influenced enquiry nor the cost is recorded. The business plan is therefore not a forecast, it is a case for instrumentation.</p>`],
 ['Risks to the plan', `
  <p>Key-person dependency on content and sign-off. Supply-side consolidation reducing the number of independent voices, which raises the platform's value but also raises the chance a manufacturer builds something similar. A wrong published number damaging the credibility the whole asset rests on, which is the risk the two-track answer model exists to manage.</p>`]
]},

{ id:'strategic-priorities', n:22, title:'Strategic Priorities', sec:[
 ['Three, in order', `
  <p><strong>1. Instrument before building.</strong> Nothing is measured. Until it is, every further decision is taste. This is first not because it is the most valuable work but because it is the precondition for valuing any other work.</p>
  <p><strong>2. Close the gap between claim and holding.</strong> The site advertises 600 or more tyre records and seven calculators. It has 26 and one. On a platform whose proposition is accuracy, that gap is a credibility liability, and it is fixable in either direction.</p>
  <p><strong>3. Deepen where a databook cannot follow.</strong> Application judgement, tier economics, failure analysis, disposal and second life. This is the only content a competitor cannot copy and a manufacturer cannot publish.</p>`],
 ['What is deliberately not a priority', `
  <p>Breadth of specification. The databooks will always hold more, and reproducing them adds volume without adding judgement. Paid acquisition, because nothing in the repository suggests any paid channel has ever run and there is no measurement to spend against. Social presence, because the audience is not there in a professional buying context and the effort is better spent on the corpus.</p>`],
 ['The single decision underneath all three', `
  <p>Depth or breadth. Finish the 600-record catalogue, or go deeper on fewer sizes with trade commentary. The evidence points to depth, because breadth competes with the databooks on their own ground while depth competes where they cannot go. But this is Clent's call, and it sets the next twelve months of content. CQ12.</p>`]
]},

{ id:'growth-roadmap', n:23, title:'Growth Roadmap', sec:[
 ['Three phases, no dates', `
  <p>Timing is set with Clent and David once they have seen this. Each phase has an exit test that must be met before the next starts.</p>`],
 ['Phase A. Instrument it', `
  <p><strong>Objective:</strong> know whether the strategy is working before spending more on it.</p>
  <p><strong>Moves:</strong> log portal questions and abstention rate; log escalations to David with subject; establish a citation baseline on a fixed question set; add an enquiry-source line to the quotation document; resolve the seven repository contradictions.</p>
  <p><strong>Exit test:</strong> last month's citations, questions and escalations can be stated from data rather than impression.</p>`],
 ['Phase B. Fill the corpus', `
  <p><strong>Objective:</strong> close the gap between what the platform claims and what it holds.</p>
  <p><strong>Moves:</strong> run the extraction pipeline on real databooks with extraction keys set; work the review queue to signed-off servable records; extend the tyre guide and the programmatic surface; decide the fate of the six unbuilt calculators; publish the disposal and second-life reference that nobody else has claimed.</p>
  <p><strong>Exit test:</strong> the published figures match what the site holds, or the published figures change.</p>`],
 ['Phase C. Convert it', `
  <p><strong>Objective:</strong> turn reference readers into trade enquiries.</p>
  <p><strong>Moves:</strong> make the path from a portal answer to a conversation with David explicit and tracked; tune the reference toward the questions that precede a purchase, using the question log from Phase A as the brief.</p>
  <p><strong>Exit test:</strong> enquiries arriving through the platform are attributed and worth more than the cost of running it.</p>`],
 ['Then Deepen', `
  <p>The loop already exists in the pipeline: new databooks in, review queue, re-ingest. What it does not yet have is the buyer's question as an input. Phase A supplies that, which is what turns a publishing schedule into an intelligence loop.</p>`]
]},

{ id:'measurement-plan', n:24, title:'Measurement Plan', sec:[
 ['Principle', `
  <p>Measure the outcome the platform was built for, not the metrics that are easy to collect. The platform was built to be cited and to produce enquiry. Page views are not the point and would flatter the result.</p>`],
 ['The measures', `
  <table class="doc-t">
   <thead><tr><th>Measure</th><th>Why it matters</th><th>Baseline</th></tr></thead>
   <tbody>
    <tr><td>Answer-engine citations</td><td>The stated goal of the entire GEO stack</td><td>None</td></tr>
    <tr><td>Portal questions asked</td><td>The best content brief available, written by buyers</td><td>None</td></tr>
    <tr><td>Abstention rate</td><td>Where the corpus fails, and on what</td><td>None</td></tr>
    <tr><td>Escalations to David</td><td>The commercial signal, and the handover's health</td><td>None</td></tr>
    <tr><td>Enquiries attributed</td><td>Whether reading ends in trade</td><td>None</td></tr>
    <tr><td>Corpus coverage</td><td>Whether the promise is being kept</td><td>172 chunks, 26 records</td></tr>
    <tr><td>Eval pass rate</td><td>Whether answers are still good as the corpus grows</td><td>15 queries written, no scored run recorded</td></tr>
   </tbody>
  </table>`],
 ['Citation measurement, concretely', `
  <p>There is no vendor product for this that the repository uses. The practical method is a fixed question set, the 15 eval queries are a ready-made starting point, run at a regular interval against the major answer engines, recording whether the platform is cited and on which question. That is a manual baseline, which is better than the current position of no baseline at all.</p>`],
 ['Reporting', `
  <p>One page, monthly. Citations, questions, abstentions, escalations, corpus counts. If a measure has not moved, say so. The house rule against restating the intro applies to reporting too.</p>`]
]},

{ id:'customer-profile', n:25, title:'Customer Profile', sec:[
 ['Primary profile', `
  <p>A technical buyer or adviser on an Australian or New Zealand earthmoving, mining, civil, agricultural or industrial fleet. Reads on a phone in a dim cab or a workshop as often as at a desk, which is why the brand manual insists on a credible dark mode and treats it as a first-class citizen rather than an option.</p>`],
 ['What they know', `
  <p>More about their machines and their site than about the tyre market. They know the size on the sidewall. They may not know what the service code implies, what the load and inflation table permits, or whether a mid-tier pattern has ever run in their application.</p>`],
 ['What they need from the platform', `
  <p>An answer that is specific, cited, and honest about what it does not cover. The system prompt encodes exactly this: answer first, qualify after, cite every factual claim, and say "I do not have that in my sources" rather than hallucinate.</p>`],
 ['What will lose them', `
  <p>A wrong number. A recommendation that reads as a sales pitch. Marketing language. The banned-phrase list in the system prompt exists because a single "industry-leading" undoes the reference positioning the whole platform depends on.</p>`],
 ['Status', `
  <p><em>[This profile is constructed from the build brief, the system prompt and the reference content. No customer research exists. CQ01 to CQ03.]</em></p>`]
]},

{ id:'customer-journey', n:26, title:'Customer Journey', sec:[
 ['The journey as designed', `
  <table class="doc-t">
   <thead><tr><th>Stage</th><th>Trigger</th><th>What they do</th><th>What the platform provides</th></tr></thead>
   <tbody>
    <tr><td>Problem</td><td>Wear, failure, fleet change, audit</td><td>Needs a specification or a decision</td><td>Nothing yet. They do not know the site exists</td></tr>
    <tr><td>Search</td><td>A size, a machine, a code, a rule</td><td>Searches, or asks an assistant</td><td>Programmatic pages, TRA matrix, FAQ, llms.txt and structured data so the answer engine can lift it</td></tr>
    <tr><td>Land</td><td>Arrives on a leaf page</td><td>Scans for the figure</td><td>Key facts near the top, mono spec strip, no gate</td></tr>
    <tr><td>Use</td><td>Needs to go deeper</td><td>Runs a calculator, checks mixing, reads a note</td><td>TKPH calculator, AS4457 summary, Market Notes</td></tr>
    <tr><td>Ask</td><td>The page does not cover it</td><td>Asks the portal</td><td>Retrieval with citations, verified specs by lookup, or abstention</td></tr>
    <tr><td>Escalate</td><td>Wants a price or a judgement call</td><td>Rings David</td><td>Name and number, stated plainly</td></tr>
    <tr><td>Trade</td><td>Buys</td><td>Deals with Jewell Tyres</td><td>Nothing. The platform steps back</td></tr>
   </tbody>
  </table>`],
 ['Where the journey is strongest', `
  <p>Land and Use. The reference content is complete and well organised, and the portal genuinely answers.</p>`],
 ['Where it is weakest', `
  <p>Search, because the programmatic surface that should catch long-tail queries is four sample pages. And Escalate, because the handover is a phone number with nothing recorded on either side of it.</p>`]
]},

{ id:'messaging-by-stage', n:27, title:'Messaging by Stage', sec:[
 ['Search and land', `
  <p>Lead with the answer, not the brand. A reader arriving on a size page wants the figure, not a welcome. The house Key facts block does this correctly: short, self-contained, liftable statements with the numbers in them.</p>
  <p>Working line, already in use: <strong>Specs, sizes and codes for off-the-road tyres.</strong></p>`],
 ['Use', `
  <p>Explain the term the first time it appears. Name the source: databook, TRA, AS4457, or working trade data. Metric first, imperial in brackets. This is the clinician register, and it is the platform's default.</p>`],
 ['Ask', `
  <p>The portal states the answer, cites it, and marks its own limits. Where it does not hold a number, it says so and hands over. That abstention is a message in itself, and a stronger trust signal than an answer would be.</p>`],
 ['Escalate', `
  <p>One line, one route, no chase. From the manual: <em>"Want a recommendation for the job? Talk to a trader."</em> This is a handover, not a pitch. The advice and the opinion that follow belong to whoever takes the enquiry.</p>`],
 ['What is never said, at any stage', `
  <p>No "leading", "world-class" or "solutions". No manufacturer favoured without field data behind it. No estimate dressed as a fact, and no fact dressed as an opinion. No exclamation marks, no emoji, no corporate abstraction. And on reference pages, no recommendation on fit for purpose.</p>`]
]},

{ id:'conversion-pathway', n:28, title:'Conversion Pathway', sec:[
 ['The single conversion', `
  <p>There is one, and it is a phone call to David Jewell. No form, no cart, no quote engine, no lead magnet. The manual is explicit that one clear route to a trader is enough and that chasing is prohibited.</p>`],
 ['Why the pathway is deliberately narrow', `
  <p>Because a reference platform that starts converting stops being a reference. The rule that protects both brands is that reference never sells and commercial never pretends to be reference, made visible by two addresses: an editorial address for the platform and the trading address for Jewell Tyres.</p>`],
 ['The weakness in the pathway', `
  <p>A pathway with one step and no instrumentation cannot be improved. Nothing records how often the escalation is offered, how often it is taken, or what question preceded it. Fixing that does not require widening the pathway, and it should not: the fix is logging, not more calls to action.</p>`],
 ['One safe improvement', `
  <p>Carry the enquiry source onto the quotation document, as the manual's own mockup shows. It attributes the trade to the platform without putting a single extra ask in front of the reader.</p>`]
]},

{ id:'brand-strategy', n:29, title:'Brand Strategy', sec:[
 ['Purpose, mission, vision', `
  <p><strong>Purpose.</strong> Take the knowledge that runs the OTR trade and put it on the open web, in plain Australian.</p>
  <p><strong>Mission.</strong> Be the reference desk operators actually keep open on the workshop screen.</p>
  <p><strong>Vision.</strong> Build the national independent technical reference for the OTR category, and sell it within 36 months.</p>`],
 ['Essence and positioning', `
  <p><strong>Essence.</strong> Reference. Plainly written.</p>
  <p><strong>Positioning.</strong> Jewell Tyres trades the tyres. otrearthmovertyres.com teaches the trade.</p>`],
 ['Values', `
  <p><strong>Independence.</strong> Manufacturer-agnostic. Nothing sold on the site, no placement money for editorial coverage.</p>
  <p><strong>Accuracy.</strong> Sourced from databooks, TRA reference, Australian Standards and fifty years of working trade data. Corrections batched weekly.</p>
  <p><strong>Plain English.</strong> Written for operators and buyers, not specialists. If a term needs explaining, it gets explained.</p>
  <p><strong>No paywalls.</strong> Free, unrestricted. Reference belongs on the open web.</p>`],
 ['The strategic idea', `
  <p>Publish the trade knowledge that manufacturers cannot publish about each other, in the format an answer engine can quote, and let the citation do the selling. Every databook belongs to one maker. An independent trader who has traded all of them can say what none of them will, and that is the only content here a competitor cannot copy.</p>`],
 ['Built to survive a sale', `
  <p>The wordmark, the dark editorial system and the trusted-clinician voice hold regardless of who owns the trading business behind it. The "Powered by Jewell Tyres" lockup is the only element that changes if the platform changes hands. This is a brand strategy with an exit built into it.</p>`]
]},

{ id:'positioning', n:30, title:'Positioning', sec:[
 ['Statement', `
  <p>For technical buyers and advisers on Australian and New Zealand earthmoving and mining fleets, otrearthmovertyres.com is the independent cross-brand reference for off-the-road tyres, because every manufacturer databook is single-brand and gated and no neutral party publishes what the trade actually does.</p>`],
 ['The proof', `
  <p>Nineteen brands in one directory. Six named source families behind the corpus. Fifty years of trading since 1974. No advertising, no placement money, nothing sold on the platform. An answer engine over the corpus that abstains rather than guesses.</p>`],
 ['The frame of reference', `
  <p>Not "a tyre website". The reader is comparing this to a databook, a rep and a chatbot. Against a databook it wins on breadth and judgement. Against a rep it wins on independence. Against a generic chatbot it wins on corpus and citation, and it is also the thing feeding that chatbot.</p>`],
 ['What the position forbids', `
  <p>Selling on reference pages. Favouring a manufacturer without field data. Making the fit-for-purpose call. Each of these would collapse the position into that of any supplier site, and the position is the asset.</p>`]
]},

{ id:'messaging-offer-architecture', n:31, title:'Messaging &amp; Offer Architecture', sec:[
 ['Message hierarchy', `
  <p><strong>Level 1, the brand line.</strong> Reference. Plainly written.</p>
  <p><strong>Level 2, the positioning pair.</strong> Jewell Tyres trades the tyres. otrearthmovertyres.com teaches the trade.</p>
  <p><strong>Level 3, the proof.</strong> Nineteen brands. Databooks, TRA, AS4457, OEM fitment guides, Tyre Stewardship material, and fifty years of trading. Free, no paywalls, no placement money.</p>
  <p><strong>Level 4, the page promise.</strong> Specs, sizes and codes for off-the-road tyres.</p>`],
 ['Supporting lines already in use', `
  <p><em>Built from dirt up.</em> Homepage. <em>Plain Australian. Kept current.</em> Standing pair.</p>
  <p><em>50 years. No BS.</em> belongs to the parent trading and investor story and is deliberately not used on the reference platform, where the register is editorial rather than sales.</p>`],
 ['Offer architecture', `
  <p>One offer, four doors: specification, comparison, calculation and compliance. Each door is free and ungated, and each ends in the same single ask, which is a call to a trader when the reader wants a price or a judgement.</p>`],
 ['The before and after', `
  <p><strong>Before.</strong> "Our industry-leading team of tyre professionals leverages decades of unparalleled expertise to deliver world-class, tailored OTR tyre solutions." Thirty-eight words, no facts.</p>
  <p><strong>After.</strong> "We have traded big tyres for fifty years. Here is what fits a 777D, what it should cost you per hour, and who to ring." Twenty-three words, three facts, one next step.</p>`]
]},

{ id:'brand-guidelines', n:32, title:'Brand Guidelines', sec:[
 ['Colour', `
  <p>Near-black ground, white type, one warm high-vis accent, at 60 / 30 / 10.</p>
  <table class="doc-t">
   <thead><tr><th>Token</th><th>Hex</th><th>Use</th></tr></thead>
   <tbody>
    <tr><td>Black</td><td>#0B0B0B</td><td>The ground. Never pure #000000</td></tr>
    <tr><td>White</td><td>#FFFFFF</td><td>Headlines and primary type on dark</td></tr>
    <tr><td>Brand Orange</td><td>#FB8C1F</td><td>The accent. Sampled from the logo artwork</td></tr>
    <tr><td>Safety Amber</td><td>#FEC013</td><td>Reserved: endorsement and the 50 Years marker only</td></tr>
    <tr><td>Surface 01 / 02</td><td>#151515 / #1C1C1C</td><td>Cards and tiles, then panels above them</td></tr>
    <tr><td>Hairline</td><td>#2C2C2C</td><td>All rules and borders. 1px, never heavier</td></tr>
    <tr><td>Neutral greys</td><td>#9A9A9A / #6E6E6E</td><td>Body on dark, then non-essential labels at 16px and above</td></tr>
   </tbody>
  </table>`],
 ['Where the accent is permitted', `
  <p>Eyebrows and section labels, rules and tick marks, one word or figure inside a headline, the wordmark full stop, key data and calculator results, single-word statuses, and one primary link or button per view.</p>
  <p>Not in body copy, not across large filled areas, not in gradients, not more than one emphasis in a sentence, not behind photography. If two things on a page are accented, one of them is wrong.</p>`],
 ['Accessibility, measured', `
  <p>Orange on black is 8.3:1 and passes AA and AAA for body text. Black on orange is the same 8.3:1. Orange on white is 2.4:1 and fails, so on light surfaces the accent is a graphic device only, never a text colour. White on black is 18.9:1. Grey #9A9A9A on black is 7.3:1, the floor for secondary text.</p>`],
 ['Type', `
  <p>Archivo for everything that reads as language, IBM Plex Mono for everything that reads as data. Both open-licensed, so the whole system transfers with the business at no cost, which was the deciding factor over Helvetica Neue against a 36-month exit.</p>
  <p>Display: 800, uppercase, 0.92 leading, minus 0.03em tracking. Eyebrow: 600, uppercase, 0.28em tracking, 11px, accent. Subheading: 700, sentence case, 1.2 leading, 26px. Body: 400, 16 to 17px, 1.7 leading, #9A9A9A on dark. Caption and spec: mono, 11 to 13px, tabular figures.</p>
  <p>One grotesque, one mono, no third typeface. If something needs to feel technical it goes in the mono. If it needs to feel loud it gets bigger and heavier, not a different font.</p>`],
 ['Open item', `
  <p>css/main.css still ships Helvetica Neue on graphite with amber #BF6E1B. The built site does not match its own current brand book. Listed as a repository contradiction.</p>`]
]},

{ id:'copy-deck', n:33, title:'Brand Copy Workbook', sec:[
 ['The one rule', `
  <p>Write like a tyre engineer explaining something to a fitter who is busy. Short sentences. Real words. If a term needs explaining, explain it, and do not tell the reader what to buy.</p>`],
 ['Four registers, one voice', `
  <p><strong>Reference pages.</strong> Definitive and flat. Present tense, no hedging, no adjectives. Define the term, say where it is used, cite the standard. Never imply a recommendation the data does not support. Example: "TRA E-4 deep rock service: deepest standard tread depth, applications include slow rigid truck haul and severe service."</p>
  <p><strong>Market Notes.</strong> Reporting, not commentary theatre. What moved, by how much, and what it means for a buyer. Name the source.</p>
  <p><strong>Quote enquiries.</strong> Not this platform's register. A handover: reference points to a trader, then steps back.</p>
  <p><strong>Investor material.</strong> The most forward of the four and still evidence-first. Lead with the number you can defend, pre-flag the risks.</p>`],
 ['Do', `
  <p>Say the thing in the fewest words that stay accurate. Use the trade's own words: casing, bead, shotrock, cycle, allocation. Explain a term the first time it appears. Name the source. Say what is not known yet, and when it is coming. Australian spelling, metric first with imperial in brackets.</p>`],
 ['Do not', `
  <p>Sell on reference pages. Favour a manufacturer without field data. Dress an estimate as a fact, or a fact as an opinion. Use exclamation marks, emoji or corporate abstraction. Recommend or offer an opinion on fit for purpose. Chase.</p>`],
 ['Spelling, tyre or tire', `
  <p>Tyre is the default across the entire platform and all Australian standards references. Tire is used only in a US-localised view of body copy or when quoting a North American manufacturer verbatim. One spelling per page, never mixed. The domain, the wordmark and the legal entity name never change for any market. When quoting a source directly, reproduce its spelling as printed.</p>`]
]},

{ id:'logo-brief', n:34, title:'Logo Brief', sec:[
 ['The mark', `
  <p>A tyre-tread magnifying glass, the "look closer" mark, with an orange lens, locked to a two-line lowercase wordmark with a full stop. Rounded geometric letterforms, tight leading, all lowercase. The icon and the full stop are #FB8C1F.</p>
  <p>The logo is a fixed, confirmed asset. It is not redesigned. What is briefed is how it is used.</p>`],
 ['What each part carries', `
  <p><strong>Search and solve.</strong> The magnifier represents finding the right solution. <strong>Built tough.</strong> The badge frame adds strength and presence. <strong>Strong foundation.</strong> The solid bar anchors the brand and carries the domain. <strong>Powered by Jewell Tyres.</strong> The tread motif signals reliability and the partnership.</p>`],
 ['Lockups', `
  <p><strong>Horizontal.</strong> The supplied master. Site headers, signage bands, email signatures, document covers. The default in almost every application.</p>
  <p><strong>Stacked.</strong> Roundel centred above the wordmark, for square and narrow formats. A Gate 1 deliverable.</p>
  <p><strong>Icon or monogram.</strong> Decided: none is created. The magnifying glass alone reads as a generic search glyph and would weaken the mark. The full lockup is used whole at every size.</p>
  <p><strong>Reverse on black.</strong> The default state, because the brand lives on dark surfaces. White wordmark, orange roundel and full stop.</p>
  <p><strong>Positive on white.</strong> Light surfaces only: printed commercial documents, quotes, invoices, letterhead.</p>
  <p><strong>Never on orange.</strong> The roundel disappears into the field. Use a black or white panel behind it, or nothing.</p>`],
 ['Mechanics', `
  <p><strong>Clear space:</strong> one lens diameter on all sides, held at every size, with no reduced-clearance exception below 200px. <strong>Minimum size:</strong> 160px wide on screen, 32mm in print, with the tread outline as the limiting element. Below the floor, use the horizontal wordmark alone.</p>`],
 ['Incorrect usage', `
  <p>Do not set the wordmark in capitals or drop the full stop. Do not recolour the roundel or fill its concentric outline. Do not stretch, condense, outline, emboss or shadow. Do not place it over busy photography without a solid or graded panel. Do not combine it with the Jewell tread mark as a single glyph. Any case not covered defaults to do not.</p>`],
 ['Outstanding', `
  <p>Vector masters in SVG, EPS and PDF across primary, horizontal, stacked, icon-only and reverse, drawn from the supplied artwork without redesign. The supplied master file is an SVG wrapper around a raster, so a true vector rebuild is still required. The wordmark typeface and the exact orange value are to be verified.</p>`]
]},

{ id:'website-strategy', n:35, title:'Website Strategy', sec:[
 ['The site is the product', `
  <p>Unlike a brochure site supporting a business, here the site <em>is</em> the asset being built and eventually sold. Every strategic decision follows from that: it must be useful without a salesperson, credible without a manufacturer's name on it, and transferable without its current owner.</p>`],
 ['Architecture as built', `
  <p>Static pages on Cloudflare Pages, repo root as project root, Pages Functions in repo-root functions/. Fourteen top-level pages plus programmatic directories for sizes, machines and TRA codes. Assets carry a version cache-bust, bumped site-wide when CSS or JS changes.</p>`],
 ['The three surfaces', `
  <p><strong>Reference surface.</strong> Hand-written, high-judgement, slow to produce, hard to copy. The technical reference and the Market Notes.</p>
  <p><strong>Programmatic surface.</strong> Templated per size, machine and code. Cheap to produce at volume, and the natural catcher of long-tail search. Currently four samples.</p>
  <p><strong>Answer surface.</strong> The Knowledge Portal. Answers what no page anticipated, and logs what buyers actually want, once logging exists.</p>`],
 ['Priorities', `
  <p>The programmatic surface is the largest unrealised opportunity, because it is the cheapest way to be present at the moment of search and it is already templated. The answer surface is the most defensible. The reference surface is the most valuable per page and the slowest to grow, so it should be spent on what only Jewell knows.</p>`]
]},

{ id:'sitemap', n:36, title:'Sitemap', sec:[
 ['As built', `
  <table class="doc-t">
   <thead><tr><th>Path</th><th>Purpose</th></tr></thead>
   <tbody>
    <tr><td>/</td><td>What the site is and how to use it</td></tr>
    <tr><td>/ask.html</td><td>The Knowledge Portal</td></tr>
    <tr><td>/tyres.html</td><td>Tyre guide: brands, patterns, sizes, codes</td></tr>
    <tr><td>/reference.html</td><td>TRA matrix, naming, mixing, glossary, failure modes, AS4457</td></tr>
    <tr><td>/calculators.html</td><td>TKPH live, six more planned</td></tr>
    <tr><td>/brands.html</td><td>19 brands, tiered</td></tr>
    <tr><td>/market-notes.html</td><td>14 sourced notes</td></tr>
    <tr><td>/faq.html</td><td>Common questions, mirrored in FAQPage JSON-LD</td></tr>
    <tr><td>/resources.html</td><td>Outbound standards, databooks, industry references</td></tr>
    <tr><td>/about.html</td><td>Who Jewell Tyres is, and the six source families</td></tr>
    <tr><td>/contact.html</td><td>David Jewell, direct</td></tr>
    <tr><td>/legal.html</td><td>Disclaimers and terms</td></tr>
    <tr><td>/sizes/, /machines/, /tra/</td><td>Programmatic leaves. Four samples</td></tr>
   </tbody>
  </table>
  <p class="doc-note">sitemap.xml carries 17 URLs. robots.txt disallows /404.html and /api/, and explicitly allows the major AI crawlers.</p>`],
 ['What the sitemap implies but does not have', `
  <p>The programmatic directories are the growth surface and hold four pages. A complete build would carry a leaf per common size, per common machine and per service code, each cross-linked to the others, which is the structure the four samples already demonstrate.</p>`],
 ['Not in the sitemap, deliberately', `
  <p>This 3D Process pack. It is private, noindex, served by its own worker, and never linked from the site.</p>`]
]},

{ id:'page-strategy', n:37, title:'Page Strategy', sec:[
 ['The standard leaf', `
  <p>Every substantive page carries the same skeleton: a question-shaped heading, a Key facts block near the top with the figures in short self-contained statements an answer engine can lift verbatim, the prose body with sources named at the point of use, a Common questions block mirrored by FAQPage JSON-LD, and the opinion or reference notice with its sources.</p>`],
 ['Why the Key facts block is first', `
  <p>Because the reader scanning for a figure and the crawler extracting a claim want the same thing, and neither will read to the bottom. This is the single highest-leverage convention on the site.</p>`],
 ['Page types', `
  <p><strong>Size leaf.</strong> The size, its codes, fitments, comparable sizes and what it is typically used on. <strong>Machine leaf.</strong> The machine, standard fitment, alternatives, and the application read. <strong>Code leaf.</strong> The service code, its family, depth, and typical applications. <strong>Reference section.</strong> Standards and rules. <strong>Market Note.</strong> Sourced editorial with a Key facts block and a sources and method block.</p>`],
 ['The rule that keeps them honest', `
  <p>Facts and figures are not copyright, their expression is. Take the numbers, attribute them at the point of use and in a sources block, and write all prose here. Never copy or lightly reword a source's sentences.</p>`]
]},

{ id:'seo-strategy', n:38, title:'SEO Strategy', sec:[
 ['The shift this strategy is built on', `
  <p>Conventional SEO optimises for a ranked list of links. This platform optimises for being the source quoted inside an answer. The repository treats that as the primary channel, not an experiment.</p>`],
 ['What is already in place', `
  <p>robots.txt explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended and CCBot. llms.txt at the site root describes what the site is, who operates it, the region and currency, the key pages, and how answer engines should attribute figures. Key facts blocks, question-shaped headings, and Organization, Article and FAQPage structured data.</p>`],
 ['The keyword model', `
  <p>Not head terms. The value is in the specific: a size, a machine, a code, a rule. "45/65R45 fitment", "what does TRA E-4 mean", "can I mix brands on the same axle", "TKPH for 59/80R63". These are exactly the queries the programmatic surface is templated for, and exactly the questions the eval set uses.</p>`],
 ['The gap', `
  <p>Four programmatic pages against a model that implies hundreds. This is the clearest instance in the whole engagement of a strategy that is correctly designed and under-executed.</p>`],
 ['Measurement', `
  <p>Rankings are the wrong measure here. The measure is citation: does an answer engine, asked one of these questions, quote this site. Currently unmeasured.</p>`]
]},

{ id:'social-strategy', n:39, title:'Social Strategy', sec:[
 ['The position', `
  <p>There is no social presence for otrearthmovertyres.com anywhere in the repository, and on the evidence there should not be one yet.</p>`],
 ['Why', `
  <p>The audience is a technical buyer in a professional context. They arrive by search or by assistant when they have a specific question, not by scrolling. Effort spent on a posting cadence is effort not spent on the corpus, and the corpus is what earns citations.</p>`],
 ['The exception worth considering', `
  <p>Market Notes are the one genuinely shareable asset, and the manual's own application mockup shows them as a weekly email rather than a social post. Distribution by email to a trade list is a better fit than a feed, and it is measurable.</p>`],
 ['If it is ever built', `
  <p>Whatever is done must stay in the clinician register. A reference platform that starts posting opinion in a feed has changed what it is. That risk is why this is deliberately deferred rather than staged.</p>`]
]},

{ id:'content-strategy', n:40, title:'Content Strategy', sec:[
 ['The content the platform is made of', `
  <p><strong>Reference.</strong> Standards, codes, rules, glossary, failure modes. Written once, corrected as standards move.</p>
  <p><strong>Specification.</strong> The tyre guide and the programmatic leaves. Extracted, verified, signed off.</p>
  <p><strong>Editorial.</strong> Market Notes. Sourced, attributed, published on a cadence.</p>
  <p><strong>Tooling.</strong> Calculators. Built once, maintained.</p>`],
 ['The pipeline behind it', `
  <p>Source PDFs into a Python extraction and chunking pipeline, dual-pass extraction with cell-by-cell diffing, validation gates on every numeric field, source crops stored as ground truth, then a CSV review queue for human sign-off, then a Node ingest into Vectorize. A record is servable only when it is high confidence, passes every gate, is signed off, and the run was committed.</p>`],
 ['Cadence', `
  <p>Fourteen Market Notes between February and July 2026. That is roughly two a month at peak, produced alongside everything else. <em>[No stated sustainable cadence and no named author beyond Clent. CQ21.]</em></p>`],
 ['The content brief nobody has read yet', `
  <p>The portal's question log is the best editorial brief available: it is buyers, in their own words, telling the platform what it failed to answer. It is not being captured. Once it is, content priority stops being a judgement call.</p>`],
 ['The unclaimed subject', `
  <p>Disposal, retreading and second life. Named in the source families, absent from the site, faced by every operator, and regulated at state level. The clearest content opportunity in the category.</p>`]
]},

{ id:'marketing-plan', n:41, title:'In-Market Activation Plan', sec:[
 ['What activation means here', `
  <p>Not campaigns. The platform is activated by being present at the moment a question is asked, and the surfaces that do that are search, answer engines and the portal itself. Activation is a publishing and instrumentation programme, not a media plan.</p>`],
 ['The activation set', `
  <p><strong>Answer engines.</strong> The declared lead. Already technically enabled, currently unmeasured.</p>
  <p><strong>Organic search.</strong> Programmatic leaves plus reference depth.</p>
  <p><strong>The Knowledge Portal.</strong> Both a surface and a sensor.</p>
  <p><strong>Market Notes.</strong> The quotable material, and the reason to come back.</p>
  <p><strong>Jewell Tyres.</strong> The sibling site and the destination.</p>
  <p><strong>David direct.</strong> The human endpoint on every declined answer.</p>`],
 ['Sequence', `
  <p>Phase A instruments the surfaces that already exist. Phase B fills them. Phase C makes the handover explicit and tracked. No new channel is opened until the existing ones can be evaluated.</p>`],
 ['No paid activity is assumed', `
  <p>No paid channel appears anywhere in the repository and none is assumed here. CQ20 establishes what is actually being spent, if anything, before any budget is proposed.</p>`]
]},
];
