// Discover, documents 01 to 20.
//
// Same taxonomy as the Adam Hall pack. Content is read from the otr-eartmover
// repository, Brand Identity v1 (August 2026), the Market Notes and the Jewell
// Tyres website build brief. Anything the repository does not evidence is
// marked as an inference or as not available, never filled in.

const R = '<em>[Read from the repository.]</em>';
const INF = (s) => `<em>[Inferred. ${s}]</em>`;
const NA = (s) => `<em>[NOT AVAILABLE. ${s}]</em>`;

export const DISCOVER = [
{ id:'audience-teardown', n:1, title:'Audience Teardown', sec:[
 ['How to read this document', `
  <p>otrearthmovertyres.com is a reference platform, not a shop. It publishes off-the-road tyre knowledge free and manufacturer-agnostic, and routes commercial enquiries to Jewell Tyres, the trading business that has operated from Wodonga since 1974. So the audience question is not "who will buy from this site". Nothing is sold on it. The question is "who reads a cross-brand OTR reference, and does reading it end in a call to David".</p>
  <p>The audience below is the audience the build brief targets. It is not an audience observed using the site, because the repository holds no analytics, no enquiry log and no traffic data. Treat every segment as a stated target until CQ01 closes. See <a class="xref" href="#customer-segments"><code>customer-segments</code></a> for the split, <a class="xref" href="#funnel-review"><code>funnel-review</code></a> for what is measured today, which is nothing.</p>`],
 ['Market at a glance', `
  <h4>Three main markets</h4>
  <p><strong>1. Mine procurement and the contractors around them.</strong> The build brief names BHP, Rio Tinto, Fortescue, Glencore, Anglo American and South32, plus contractors including CIMIC/Thiess, John Holland and BMD. This is where the money in OTR sits: the largest sizes, radial construction, mining application. Credence Research puts Western Australia as the largest state market on Pilbara iron ore, then Queensland on coal, then New South Wales.</p>
  <p><strong>2. Civil, agricultural, forestry and industrial fleets.</strong> Construction fleets, ag and forestry operators, ports and material handling. Smaller unit values, broader size range, and the long tail of work around the mining core.</p>
  <p><strong>3. Independent fitters and dealers.</strong> Local tyre retailers who treat the site as their OTR back office. Named in the brief as Bridgestone Select, Bob Jane, Beaurepaires and Tyrepower. This is the segment with the least access to cross-brand data of its own, and the clearest fit for a free reference. ${INF('Not validated. No usage data exists.')}</p>
  <h4>Market awareness</h4>
  <p>Buyers are highly aware of the problem, which is that specifications live inside single-brand databooks behind PDF downloads and nothing reads across makers. They are largely unaware that an independent cross-brand reference exists. The site states this premise itself on the About page: every databook is manufacturer-aligned, none are searchable across brands, none tell you what the tyre next door does in the same application.</p>
  <h4>Growing or shrinking</h4>
  <p>Growing slowly and structurally. Credence Research sizes the Australian off-the-road tyre market at about AUD 208 million in 2023, reaching about AUD 317 million by 2032, a compound annual growth rate of 4.78% from 2025 to 2032. Converted from USD at an indicative AUD 1 = USD 0.65. That is a mature mining-anchored market that tracks production tonnes rather than hype, which suits a reference platform: demand for the answers is steady and repeat.</p>`],
 ['Define your niche', `
  <h4>Target audience</h4>
  <p>Technical decision-makers and the people who advise them: fleet engineers, maintenance planners, procurement officers, and the fitters who put the tyre on. Australia and New Zealand, weighted to the Pilbara and Queensland coal. The brand manual frames the reader as "a fitter who is busy", and the voice rules are written to that reader.</p>
  <h4>Problem they need solved</h4>
  <p>A buyer needs to know what fits, what it is rated to, what the standard requires, and whether a mid-tier alternative is credible. Today that means downloading several manufacturer PDFs, none of which reference each other, and none of which will comment on a competitor. The cross-brand comparison does not exist in public.</p>
  <h4>Current behaviour</h4>
  <p>Ring the supplier rep, download the databook, or ask a colleague. Increasingly, ask a chatbot, which will answer from whatever it can find and cite whoever published it.</p>
  <h4>Unique approach</h4>
  <p>An independent trader who has traded all the brands publishes what none of the makers will publish about each other. The site is free, ad-free, carries no placement money, and states its one commercial tie plainly.</p>
  <h4>Why now</h4>
  <p>Because the discovery moment is moving to answer engines. The repository shows this is already the strategy: robots.txt explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended and CCBot, llms.txt is maintained, and substantive pages carry Key facts blocks and FAQPage JSON-LD. The platform is built to be quoted.</p>`],
 ['Persona targeting', `
  <article>
   <h4>Persona 1. The maintenance planner</h4>
   <p>Runs the tyre programme on a mine site or for a contractor. Needs TKPH headroom, fitment confirmation and mixing rules that will survive an audit against AS4457:2019.</p>
   <p><strong>Pain points.</strong> Single-brand data, slow rep responses, and no neutral view on whether a mid-tier pattern will hold the cycle.</p>
   <p><strong>Dream state.</strong> One page that reads across makers and says plainly what the trade actually does.</p>
   <p><strong>Where to find them.</strong> Search, and increasingly an AI assistant. ${INF('Channel mix unconfirmed, pending CQ01.')}</p>
  </article>
  <article>
   <h4>Persona 2. The procurement officer</h4>
   <p>Buying on price, lead time and availability, and needs to know whether the cheaper option is a real option.</p>
   <p><strong>Pain points.</strong> Opaque pricing, long lead times, and no independent basis for a tier-one versus mid-tier decision.</p>
   <p><strong>Dream state.</strong> A defensible answer, and a trader who will take the call when the spec is settled.</p>
  </article>
  <article>
   <h4>Persona 3. The independent fitter</h4>
   <p>Serving smaller fleets without an OEM account manager. Uses the site as a back office.</p>
   <p><strong>Pain points.</strong> No access to cross-brand data, and no one to ask.</p>
   <p><strong>Dream state.</strong> A reference desk that is free and stays current.</p>
  </article>`],
 ['What this document cannot tell you', `
  <p>${NA('No customer research, interviews, survey or traffic data exists anywhere in the repository. The segments above are the build brief\'s targets, not observed users. CQ01 and CQ02 close this.')}</p>`]
]},

{ id:'customer-segments', n:2, title:'Customer Segments', sec:[
 ['Segmentation basis', `
  <p>The repository supports segmentation on two axes it can actually evidence: application, because the tyre guide and the reference are organised by service code and machine, and geography, because the market data splits that way. It does not support behavioural or value-based segmentation, because no usage or enquiry data exists.</p>`],
 ['Segments', `
  <h4>Segment A. Mining, large haul</h4>
  <p>Rigid haul trucks and production loaders. Sizes from roughly 45/65R45 up to 59/80R63. TRA E-4 and L-5 service codes. Highest unit value, tightest allocation, longest lead times. Market Note 07 identifies mining haul as the fastest-growing part of the market, and Note 08 sizes Pilbara demand specifically.</p>
  <h4>Segment B. Mining and quarry, support fleet</h4>
  <p>Graders, dozers, water carts, service vehicles, quarry loaders. Broader size range, more mid-tier brand acceptance, more frequent replacement decisions.</p>
  <h4>Segment C. Civil construction and infrastructure</h4>
  <p>Earthmoving contractors and civil fleets. Named in the brief as Lendlease, John Holland and Fulton Hogan. Price-sensitive, and the segment where the tier-one versus mid-tier question is asked most often.</p>
  <h4>Segment D. Agriculture, forestry and industrial</h4>
  <p>Tractors, harvesters, skidders, forwarders, forklifts and port equipment. Present in the Jewell Tyres catalogue and in the brand list, and lighter in the OTR reference content, which is weighted to earthmoving and mining.</p>
  <h4>Segment E. Independent fitters and dealers</h4>
  <p>Not an end user. A reseller and adviser who uses the reference on someone else's behalf, and a plausible multiplier for citations and word of mouth.</p>`],
 ['Priority read', `
  <p>On the evidence available, Segment A carries the value and Segment E carries the reach. The reference content is already weighted to A, and the free cross-brand model is worth most to E, which has no other source. ${INF('A commercial priority cannot be set from the repository, because no enquiry or revenue attribution exists. CQ01 sets it.')}</p>`],
 ['Geography', `
  <p>Western Australia first on Pilbara iron ore, Queensland second on coal, New South Wales third, with South Australia and Victoria making up the balance. Source: Credence Research, Australia Off-the-Road Tire Market, cited in Market Note 04. New Zealand is named in the trading footprint on the About page but carries no dedicated content on the site.</p>`]
]},

{ id:'customer-pain-points', n:3, title:'Customer Pain Points', sec:[
 ['Ranked pain', `
  <p><strong>1. The data is single-brand and gated.</strong> Every maker publishes its own databook, behind a download, with no cross-reference. Stated as the site's founding premise on the About page.</p>
  <p><strong>2. Nobody neutral will comment on fit.</strong> A rep will recommend their own brand. The trade read, which is what actually fails in a Pilbara summer and which mid-tier patterns are worth the money, is not published anywhere.</p>
  <p><strong>3. Availability, not price, decides the outcome.</strong> Market Note 04 makes the point directly: a market can grow at a tidy 4.78% and still leave a non-contract buyer waiting eight to fourteen weeks for a specific size. Aggregate value says nothing about whether your tyre is on a shelf.</p>
  <p><strong>4. The cost is hard to justify upward.</strong> Credence Research cites mining dump-truck tyres from roughly AUD 8,000 to over AUD 30,000 each, with the largest around AUD 69,000. Buyers outside mining find that number difficult until it is set against downtime.</p>
  <p><strong>5. Compliance risk sits on the buyer.</strong> Mixing, repair and scrapping decisions carry AS4457:2019 obligations and state-level requirements. Getting it wrong is a safety and legal exposure, and the guidance is scattered.</p>`],
 ['Evidence', `
  <p>Pains 1 and 2 are stated by the site itself. Pains 3 and 4 are drawn from Market Notes 01, 02, 03 and 04, all sourced and attributed. Pain 5 is evidenced by the reference content built to answer it: the mixing rules section, the AS4457:2019 summary, the failure-mode set and the WorkSafe WA guideline held in the corpus.</p>
  <p>${NA('No pain point here is evidenced by a customer saying it. The ranking is a trade read, not research. CQ03 asks buyers directly.')}</p>`]
]},

{ id:'buying-triggers-barriers', n:4, title:'Buying Triggers &amp; Barriers', sec:[
 ['Triggers', `
  <p><strong>Wear-out and scheduled replacement.</strong> The predictable one. Planned, budgeted, and the moment a specification is confirmed.</p>
  <p><strong>Unplanned failure.</strong> A cut, a burst, a separation. Urgent, and the moment lead time matters more than price.</p>
  <p><strong>Fleet change.</strong> A new machine, a new pit, a ramp-up. Market Note 09 covers fleet turnover and the Fortescue electric fleet switch as a demand event.</p>
  <p><strong>Cycle or duty change.</strong> Longer haul, hotter ambient, heavier loads. The moment a TKPH figure gets recalculated, which is what the calculator on the site is for.</p>
  <p><strong>Compliance event.</strong> An audit, an incident, a new standard. Sends people to AS4457 and mixing rules.</p>`],
 ['Barriers', `
  <p><strong>Allocation.</strong> Tier-one capacity is constrained and contract customers come first. Market Note 01 argues the market is structurally inefficient for exactly this reason.</p>
  <p><strong>Trust in mid-tier.</strong> The saving is real and the risk feels unquantified. Market Note 02 is written specifically to give buyers an honest read on that decision.</p>
  <p><strong>Internal approval.</strong> A tyre at AUD 30,000 or more needs a business case, and the case is downtime avoided rather than unit price.</p>
  <p><strong>Incumbency.</strong> An existing supplier relationship, a national account, or a tyre management contract. Market Note 14 covers Bridgestone buying Otraco's OTR tyre management business, which tightens that lock.</p>`],
 ['What the platform can move', `
  <p>The site cannot move allocation or approval. It can move the trust barrier, because that is an information problem, and it is the one barrier an independent cross-brand reference is uniquely placed to address. That is the argument for weighting content toward tier comparison and application fit rather than raw specification, which the databooks already cover.</p>`]
]},

{ id:'jobs-to-be-done', n:5, title:'Jobs To Be Done', sec:[
 ['Functional jobs', `
  <p><em>When my machine needs tyres, help me confirm what fits and what it is rated to, so I can raise a requisition that will not be questioned.</em></p>
  <p><em>When I am comparing options, help me understand whether the cheaper brand is a real option for my duty cycle, so I am not gambling on downtime to save on purchase price.</em></p>
  <p><em>When I am planning a programme, help me calculate whether the tyre's capacity holds the cycle, so I do not specify something that will run hot.</em></p>
  <p><em>When an auditor asks, help me point at the standard, so the decision is defensible.</em></p>`],
 ['Emotional and social jobs', `
  <p><em>Help me not look uninformed in front of a supplier rep who knows their own product better than I do.</em></p>
  <p><em>Help me make a call I can defend to a maintenance superintendent who will remember it if the tyre fails early.</em></p>`],
 ['The job the platform is actually hired for', `
  <p>Reading across the four, the underlying job is defensibility. Buyers are not short of specification. They are short of an independent basis for a decision they will have to justify. That is what a manufacturer databook structurally cannot provide, and it is the job this platform is uniquely positioned to do.</p>
  <p>It also sets the boundary the brand manual draws. The platform describes and specifies. It does not recommend. When the reader wants the judgement call, the platform hands them to a trader.</p>`]
]},

{ id:'competitor-analysis', n:6, title:'Competitor Analysis', sec:[
 ['A note on what is missing', `
  <p>The repository analyses tyre <em>brands</em> exhaustively and competing <em>information sources</em> not at all. brands.html tiers 19 manufacturers with country of origin, founding year and notable patterns. There is no document anywhere in the repository that names a competing reference site, a rival independent trader, or a competitor for the reader's attention. That is the single largest gap in Discover.</p>
  <p>${NA('No competitor set for the reference platform exists. What follows is constructed from the evidence available and must be confirmed at CQ07.')}</p>`],
 ['The competitor set, as constructed', `
  <table class="doc-t">
   <thead><tr><th>Who</th><th>Their claim</th><th>Their weakness</th><th>Our response</th></tr></thead>
   <tbody>
    <tr><td><strong>Manufacturer databooks</strong><br>19 brands</td><td>Authoritative specification data, straight from the maker</td><td>Single-brand, PDF-gated, not searchable across makers, will never comment on a rival</td><td>Cross-brand, searchable, free, and willing to compare</td></tr>
    <tr><td><strong>Tier-one service portals</strong><br>Bridgestone Mining Solutions, Michelin Earthmover</td><td>Data plus full tyre management</td><td>Aligned to one maker. Consolidating further: Bridgestone acquired Otraco</td><td>Independent of every maker, and says so in a published statement</td></tr>
    <tr><td><strong>Answer engines</strong></td><td>Instant answers to any question</td><td>No OTR corpus and no trade judgement of their own. They will cite somebody</td><td>Be the source they cite. This is the whole GEO stack</td></tr>
    <tr><td><strong>Standards bodies</strong><br>TRA, ETRTO, Standards Australia</td><td>The authority itself</td><td>Paywalled, dense, and written for specialists rather than fitters</td><td>Plain Australian, free, and explains the term the first time it appears</td></tr>
    <tr><td><strong>Other independent traders</strong></td><td>Relationships and stock</td><td>Not identified anywhere in the repository</td><td>Gap, not an answer</td></tr>
   </tbody>
  </table>`],
 ['The competitive dynamic that matters', `
  <p>Supply and service are both consolidating around the manufacturers. Yokohama acquired Goodyear's OTR business for USD 905 million, completed February 2025, and has also taken Trelleborg and Alliance. Bridgestone bought Otraco. Market Notes 12, 13 and 14 track this. Every one of those moves reduces the number of independent voices in the category, which makes an independent reference more valuable, not less, provided it stays genuinely independent and is seen to be.</p>`]
]},

{ id:'category-positioning', n:7, title:'Category Positioning', sec:[
 ['The category as it stands', `
  <p>There is no established category called "independent OTR reference platform". The adjacent categories are manufacturer technical publishing, tyre management services, and trade supply. The platform sits in a gap between them: it publishes like a manufacturer, is independent like a standards body, and is funded by a trader.</p>`],
 ['Category entry points', `
  <p>The moments a buyer enters the category are specification, comparison, calculation and compliance. The site is built against all four: the tyre guide and TRA matrix for specification, brands and Market Notes for comparison, the calculators for calculation, and the AS4457 and mixing material for compliance.</p>`],
 ['The position claimed', `
  <p>From the brand manual, stated as the positioning: <strong>Jewell Tyres trades the tyres. otrearthmovertyres.com teaches the trade.</strong> Two brands, one family, two jobs.</p>
  <p>The essence line, already carried in the live site title and footer, is <strong>Reference. Plainly written.</strong> Four words, no adjectives, and it describes exactly what the platform does.</p>`],
 ['Why the position is defensible', `
  <p>Three reasons, in descending order of durability. First, no manufacturer can occupy it, because a maker cannot credibly compare itself to rivals. Second, no standards body will occupy it, because plain-language application guidance is outside their remit. Third, a competitor trader could occupy it but would have to publish 50 years of trade judgement for free, which is a real cost with a deferred return.</p>
  <p>The vulnerability is that the position depends on being seen as independent while being funded by a trader. The manual's answer is to publish the independence statement rather than imply it, keep no products for sale on the platform, and take no placement money.</p>`]
]},

{ id:'market-gaps', n:8, title:'Market Gaps', sec:[
 ['Gaps the platform already addresses', `
  <p><strong>Cross-brand comparison.</strong> Nineteen brands in one directory with a tier read. No maker publishes this.</p>
  <p><strong>Plain-language standards.</strong> AS4457:2019 summarised, mixing rules stated, 40-term glossary, 8 failure modes.</p>
  <p><strong>Australian market data.</strong> Fourteen Market Notes with figures attributed at the point of use. Little of this is written up for this market anywhere else.</p>`],
 ['Gaps the platform has left open', `
  <p><strong>The catalogue.</strong> 26 tyre records live in data/tyres.json against a stated 600 or more. The gap between what the site claims and what it holds is itself a credibility risk.</p>
  <p><strong>The calculators.</strong> One of seven live. TKPH is built; six are marked coming soon.</p>
  <p><strong>The programmatic surface.</strong> Four sample pages across sizes, machines and TRA codes, where the model implies hundreds.</p>
  <p><strong>Specialist service codes.</strong> The brand manual's own TRA matrix mockup notes ML mobile crane, G-4 grader and IND industrial codes as still in build.</p>`],
 ['The gap nobody is filling', `
  <p>Second-life and disposal. Tyre Stewardship Australia material is named as one of the six source families behind the corpus, and the OTR used-tyre analysis is in the knowledge base, but the site carries no substantial content on retreading, second-life applications or end-of-life obligations. Given every operator faces it and the regulation is state-level and confusing, this is the clearest unclaimed content gap in the category.</p>`]
]},

{ id:'differentiation-opportunities', n:9, title:'Differentiation Opportunities', sec:[
 ['What only this platform has', `
  <p><strong>The trade read.</strong> Fifty years of buying, selling, fitting and inspecting. This is the one input a competitor cannot acquire and a manufacturer cannot publish.</p>
  <p><strong>The corpus.</strong> Six named source families: manufacturer databooks across 19 brands, the TRA Year Book, AS4457:2019, OEM fitment guides from seven machine makers, Tyre Stewardship Australia material, and the trading experience.</p>
  <p><strong>A working answer engine over that corpus.</strong> The Knowledge Portal retrieves and cites, and serves verified numbers by exact lookup or abstains. Very few reference sites in any category have this, and none in Australian OTR.</p>`],
 ['Ranked opportunities', `
  <p><strong>1. Answer the questions a databook cannot.</strong> Application fit, tier economics, what fails and why. Highest differentiation, lowest substitutability.</p>
  <p><strong>2. Publish the disposal and second-life reference.</strong> Unclaimed, universally needed, and already inside the corpus sources.</p>
  <p><strong>3. Make the abstention visible.</strong> A reference tool that says "I do not hold that, here is who to ask" builds more trust than one that always answers. It is already built. It is not yet a stated feature.</p>
  <p><strong>4. Keep the market notes running.</strong> Fourteen notes is a real body of sourced editorial and the most quotable material on the site.</p>`],
 ['What not to differentiate on', `
  <p>Not raw specification volume. The databooks will always hold more, and a race to reproduce them is a race the platform loses while adding no judgement. Not price, because the platform does not quote. Not breadth of brand, because 19 is already effectively the market.</p>`]
]},

{ id:'offer-worksheet', n:10, title:'Offer Worksheet', sec:[
 ['The offer, stated plainly', `
  <p>Free, unrestricted access to a cross-brand off-the-road tyre reference: tyre guide, TRA service-code matrix, tyre naming, mixing rules, a 40-term glossary, 8 failure modes, the AS4457:2019 summary, calculators, 14 sourced market notes, and an Ask portal that answers from the databook corpus with citations. No paywall, no registration, no advertising.</p>`],
 ['What the reader gives up', `
  <p>Nothing. There is no gate, no form and no email capture anywhere in the flow. The brand manual is explicit about this in the reference-to-quote-to-trade sequence: search and use are ungated, and the only ask is "talk to a trader" when the reader wants a price or a tyre.</p>`],
 ['What Jewell gets', `
  <p>Authority, and the enquiry that follows it. The commercial model is indirect: the platform earns the right to be the source, and the trading business takes the call. The manual states the boundary that protects both, which is that reference never sells and commercial never pretends to be reference, with two addresses to make it visible.</p>`],
 ['Offer strength and weakness', `
  <p><strong>Strength.</strong> Free and genuinely useful is a strong offer in a category where the alternative is a gated PDF. Nothing is being asked of the reader, so there is no friction to overcome.</p>
  <p><strong>Weakness.</strong> An offer with no exchange also has no measurement. Because nothing is captured, the platform cannot tell who read it, what they needed, or whether the reading led anywhere. That is not a content problem, it is an instrumentation problem, and it is the single biggest weakness in the model as built.</p>`]
]},

{ id:'product-service-review', n:11, title:'Product / Service Review', sec:[
 ['Inventory, as counted', `
  <table class="doc-t">
   <thead><tr><th>Component</th><th>State</th><th>Counted</th></tr></thead>
   <tbody>
    <tr><td>Reference site</td><td>Live</td><td>14 top-level pages</td></tr>
    <tr><td>Tyre guide</td><td>Sample stage</td><td>26 records, against a stated 600+</td></tr>
    <tr><td>Brand directory</td><td>Live</td><td>19 brands, tiered 5 / 10 / 4</td></tr>
    <tr><td>Technical reference</td><td>Live</td><td>TRA matrix, naming, mixing, 40-term glossary, 8 failure modes, AS4457:2019</td></tr>
    <tr><td>Calculators</td><td>Part built</td><td>1 of 7 live. TKPH built, six marked coming soon</td></tr>
    <tr><td>Market Notes</td><td>Live</td><td>14 notes, February to July 2026</td></tr>
    <tr><td>Programmatic SEO</td><td>Sample stage</td><td>4 pages: 2 sizes, 1 machine, 1 TRA code</td></tr>
    <tr><td>Knowledge Portal</td><td>Live in production</td><td>Two-track answering, citations, abstention</td></tr>
    <tr><td>Corpus pipeline</td><td>Built, trial only</td><td>172 first-party chunks committed</td></tr>
   </tbody>
  </table>`],
 ['Quality read', `
  <p>The reference content is the strongest component: it is complete, it is written to the voice rules, and it answers real questions. The Knowledge Portal is the most defensible, because it is hard to copy. The tyre guide is the weakest, not because the 26 records are poor but because the site advertises 600 or more, and an unmet promise on a reference platform costs more credibility than a smaller promise kept.</p>`],
 ['The gap between claim and holding', `
  <p>This is worth stating as a finding rather than a note. index.html claims 600 or more tyre records "being rolled out" and seven calculators, of which one exists. A platform whose entire proposition is accuracy should not carry unmet numbers on its own home page. Either the catalogue is filled or the claim comes down. This is CQ04 and CQ12.</p>`]
]},

{ id:'pricing-packaging-notes', n:12, title:'Pricing / Packaging Notes', sec:[
 ['There is no price', `
  <p>The platform charges nothing and sells nothing. It carries no advertising and takes no placement money for editorial coverage, which is stated as a core value. There is no packaging to review because there is no product to package.</p>`],
 ['Pricing appears twice, and neither is the platform', `
  <p><strong>As editorial.</strong> Market Note 04 cites Credence Research on mining dump-truck tyres running from roughly AUD 8,000 to over AUD 30,000 each, with the largest around AUD 69,000. Reported and attributed, not quoted.</p>
  <p><strong>As a hard boundary.</strong> The Knowledge Portal declines pricing questions outright. The worker checks for pricing intent before it attempts a specification lookup, so "how much does a 40.00R57 cost" declines rather than answers. Pricing is opaque, relationship-driven and not in the corpus, and it escalates to David.</p>`],
 ['The commercial question this raises', `
  <p>If the platform never prices and never sells, its entire commercial return is the enquiry it hands to Jewell Tyres, and that handover is currently untracked. The cost of running the platform is also not recorded anywhere in the repository: no hosting figure, no per-query cost, no content cost. ${NA('Cost to run and revenue attributed are both unknown. CQ20 asks what this actually costs.')}</p>`]
]},

{ id:'sales-process-review', n:13, title:'Sales Process Review', sec:[
 ['The process as designed', `
  <p>The brand manual sets it out in four steps. <strong>Search:</strong> a procurement officer searches a size and lands on a machine page or the TRA matrix, with no gate, no form and no pitch. <strong>Use:</strong> they run the TKPH calculator, check inspection cadence, read the week's note. The platform earns trust by being useful, repeatedly. <strong>Ask:</strong> when they need a price or a tyre, one route, "talk to a trader", with the handover stated plainly. <strong>Trade:</strong> the quote, the deal and the invoice are Jewell Tyres, and the branding follows.</p>`],
 ['The process as built', `
  <p>Steps one and two are built and live. Step three exists but is thin: the escalation is a name and a phone number, David Jewell on 0419 358 439, surfaced in the Ask portal when a question is declined or commercial. Step four happens entirely off the platform and off the record.</p>`],
 ['Where it breaks', `
  <p>The handover is the weak joint. Nothing logs that an escalation happened, nothing tags an enquiry as originating from the reference site, and nothing closes the loop back to what the reader was asking about. So the platform cannot learn from its own best signal, which is the question a buyer asked immediately before they picked up the phone.</p>
  <p>The brand manual's quotation mockup shows the fix already conceived: an "Enquiry source: OTR earthmovertyres.com, Talk to a trader" line on the quotation document. That is a manual attribution rather than a tracked one, but it is a start and it costs nothing.</p>`],
 ['Recommendation', `
  <p>Instrument the handover before anything else in the funnel. It is the cheapest measurement available, it converts the portal into a content brief written by buyers, and without it Deploy has nothing to report. This is CQ09 and CQ17.</p>`]
]},

{ id:'funnel-review', n:14, title:'Funnel Review', sec:[
 ['The funnel', `
  <table class="doc-t">
   <thead><tr><th>Stage</th><th>Mechanism</th><th>Measured</th></tr></thead>
   <tbody>
    <tr><td>Reach</td><td>Answer engines, organic search, programmatic pages</td><td>No</td></tr>
    <tr><td>Read</td><td>Reference, Market Notes, calculators</td><td>No</td></tr>
    <tr><td>Ask</td><td>Knowledge Portal question</td><td>No</td></tr>
    <tr><td>Escalate</td><td>Declined or commercial question routed to David</td><td>No</td></tr>
    <tr><td>Trade</td><td>Quote and invoice, Jewell Tyres</td><td>Outside the platform</td></tr>
   </tbody>
  </table>`],
 ['The finding', `
  <p>Every stage of the funnel is unmeasured. legal.html states that basic anonymous analytics are collected, page views, referrer and country-level location, which Cloudflare Pages provides server-side without a tag. Nothing in the repository reads, reports or acts on that data, and nothing measures the stages that matter: citations earned, questions asked, escalations made.</p>
  <p>This is the constraint the whole engagement turns on. The site was built to be cited, and there is no way to tell whether it ever has been.</p>`],
 ['What to instrument, in order', `
  <p><strong>1. Portal questions and abstention rate.</strong> Already flowing through a worker. Logging is a small change and yields the best content brief available.</p>
  <p><strong>2. Escalations to David.</strong> Count and subject. Converts an untracked handover into a measurable one.</p>
  <p><strong>3. Answer-engine citations.</strong> Harder, and the one the strategy is actually aimed at. Periodic sampling of the major engines on known corpus questions would give a baseline where none exists.</p>
  <p><strong>4. Enquiry attribution.</strong> A single field on the quotation document, as the brand manual already sketches.</p>`]
]},

{ id:'success-definition', n:15, title:'Success Definition', sec:[
 ['There is no definition', `
  <p>${NA('Nothing in the repository states what success looks like for this platform. No target, no threshold, no measure. This is the most consequential gap in Discover, because without it Gate 3 cannot be signed against anything.')}</p>`],
 ['The candidates', `
  <p><strong>Citation.</strong> The site is quoted by answer engines when buyers ask OTR questions. This is what the GEO stack in the repository is built for, and what the brand manual's purpose statement implies.</p>
  <p><strong>Enquiry.</strong> Qualified enquiries reach Jewell Tyres that would not otherwise have arrived. This is what the sister-brand architecture is built for.</p>
  <p><strong>Standing.</strong> The platform is recognised as the reference by people in the trade, whether or not it is directly attributable.</p>
  <p><strong>Asset value.</strong> The platform is saleable. The brand manual is explicit that this is the horizon: build the national independent technical reference and sell it within 36 months, with the identity, editorial standards and endorsement all surviving a change of owner.</p>`],
 ['The read', `
  <p>These are not alternatives, they are a sequence. Citation produces enquiry, enquiry and standing produce asset value, and asset value is the stated 36-month goal. Which means the leading indicator to instrument is citation, and the lagging indicator that matters commercially is attributed enquiry.</p>
  <p>Everything in Deploy hangs on Clent and David settling this. It is CQ06 and it should be answered first.</p>`]
]},

{ id:'objectives-key-results', n:16, title:'Objectives &amp; Key Results', sec:[
 ['A caveat before the numbers', `
  <p>No baseline exists for any measure below, so no target can be set responsibly. What follows is the structure the OKRs should take once Phase A produces baselines. Every target is deliberately left open rather than invented.</p>`],
 ['Objective 1. Know whether the platform works', `
  <p><strong>KR1.</strong> Portal questions and abstention rate logged and reported monthly. Baseline: none. Target: to set.</p>
  <p><strong>KR2.</strong> Escalations to David counted, with subject. Baseline: none. Target: to set.</p>
  <p><strong>KR3.</strong> A repeatable citation check across the major answer engines on a fixed question set. Baseline: none. Target: to set.</p>`],
 ['Objective 2. Close the gap between claim and holding', `
  <p><strong>KR4.</strong> Tyre records live, against the 600 or more the site advertises. Baseline: 26.</p>
  <p><strong>KR5.</strong> Calculators live. Baseline: 1 of 7.</p>
  <p><strong>KR6.</strong> Programmatic pages live. Baseline: 4.</p>
  <p><strong>KR7.</strong> Verified specification records signed off and servable. Baseline: 0 in the local trial, which ran without extraction keys by design.</p>`],
 ['Objective 3. Turn reading into trade', `
  <p><strong>KR8.</strong> Enquiries attributed to the reference platform. Baseline: none.</p>
  <p><strong>KR9.</strong> Market Notes published at a sustainable cadence. Baseline: 14 notes to July 2026.</p>`]
]},

{ id:'discover-summary', n:17, title:'Discover Summary', sec:[
 ['What Discover found', `
  <p>The platform is real, built and running, and it occupies a genuine gap: every manufacturer databook is single-brand and gated, no neutral party publishes cross-brand application judgement, and the discovery moment is moving to answer engines that will cite whoever publishes. otrearthmovertyres.com is built precisely for that shift, with llms.txt, an explicit crawler welcome, structured data and a live retrieval portal over a real corpus.</p>`],
 ['What Discover could not find', `
  <p>Three things, and all three are the same kind of thing.</p>
  <p><strong>Who the readers are.</strong> The audiences are the build brief's targets. No research, no interviews, no traffic data.</p>
  <p><strong>Who the competition is.</strong> Nineteen tyre brands are analysed in depth. No competing information source is named anywhere.</p>
  <p><strong>What success looks like.</strong> No stated measure, threshold or target exists.</p>`],
 ['The read', `
  <p>The constraint is not the idea, the content quality or the technology. It is that a platform built to be cited has no way of telling whether it is being cited, and a platform built to feed a trading business has no way of telling whether it is feeding it. Everything else in this engagement is downstream of fixing that.</p>`],
 ['Gate 1 status', `
  <p>Read, not signed. The CORE is evidenced from the repository as agreed, and every claim traces to a file. Gate 1 closes when CQ01 to CQ10 are answered with Clent and David and the three gaps above are filled.</p>`]
]},

{ id:'priority-problems', n:18, title:'Priority Problems To Solve', sec:[
 ['Ranked', `
  <p><strong>01. Nothing is measured.</strong> No citation tracking, no question logging, no enquiry attribution. Consequence: no decision in Design or Deploy can be evidence-based, and Gate 3 cannot be signed. Fix: Phase A, and before anything else.</p>
  <p><strong>02. Success is undefined.</strong> Consequence: even with measurement, there is nothing to measure against. Fix: CQ06, in the CORE session.</p>
  <p><strong>03. The site claims more than it holds.</strong> 26 records against 600 or more, one calculator of seven, four programmatic samples. Consequence: a credibility risk on a platform whose proposition is accuracy. Fix: fill the catalogue or lower the claim.</p>
  <p><strong>04. The handover is untracked.</strong> Consequence: the strongest available signal, the question asked immediately before a buyer rings, is discarded. Fix: log escalations.</p>
  <p><strong>05. The editorial stance is contradicted.</strong> Brand Identity v1 makes the platform a trusted clinician that never offers an opinion. CLAUDE.md and the live Ask portal are built on the opposite, an OPINION label on every evaluative answer. Consequence: the platform's voice is currently governed by two incompatible rules. Fix: decide which, then align the system prompt, the portal labelling and the house rules.</p>
  <p><strong>06. Key-person dependency.</strong> Content, corpus sign-off and publication all sit with one or two people. Consequence: the asset stalls if either steps away, which matters more given a 36-month sale horizon. Fix: CQ22.</p>`]
]},

{ id:'recommended-next-moves', n:19, title:'Recommended Next Moves', sec:[
 ['Before anything else', `
  <ol class="doc-ol">
   <li><strong>Run the CORE session with Clent and David.</strong> Twenty-two questions, ten of them Discover. Settle CQ06, what counts as this platform working, first, because everything downstream is measured against it.</li>
   <li><strong>Resolve the opinion contradiction.</strong> Brand Identity v1 versus CLAUDE.md and the live portal. This is a governance decision, it is cheap to make and expensive to leave open, and it changes what the portal is permitted to say.</li>
   <li><strong>Fix the repository contradictions.</strong> Seven found while reading, all verifiable, listed on the Deploy sheet. Several are visible to a reader or a crawler today.</li>
  </ol>`],
 ['Then, in Phase A', `
  <ol class="doc-ol">
   <li><strong>Log portal questions and abstention rate.</strong> Smallest change, largest information return.</li>
   <li><strong>Log escalations to David.</strong> Count and subject.</li>
   <li><strong>Establish a citation baseline.</strong> A fixed question set, run periodically against the major answer engines.</li>
   <li><strong>Add enquiry source to the quotation document.</strong> Already sketched in the brand manual. Costs nothing.</li>
  </ol>`],
 ['Deliberately not yet', `
  <p>Do not fill the catalogue, build the six calculators, or expand the programmatic surface until measurement exists. More content with no measurement produces more of something nobody can evaluate. The sequence is instrument, then fill, then convert.</p>`]
]},

{ id:'discovery-dataset', n:20, title:'Discovery Dataset', sec:[
 ['Counted from the repository, August 2026', `
  <table class="doc-t">
   <thead><tr><th>Measure</th><th>Value</th><th>Source</th></tr></thead>
   <tbody>
    <tr><td>Brands covered</td><td>19 (tier 1: 5, tier 2: 10, tier 3: 4)</td><td>brands.html</td></tr>
    <tr><td>Tyre records live</td><td>26</td><td>data/tyres.json</td></tr>
    <tr><td>Tyre records claimed</td><td>600+</td><td>index.html</td></tr>
    <tr><td>Rim range</td><td>24 inch to 63 inch</td><td>index.html, about.html</td></tr>
    <tr><td>Calculators live</td><td>1 of 7</td><td>calculators.html</td></tr>
    <tr><td>Market Notes</td><td>14</td><td>market-notes.html</td></tr>
    <tr><td>Top-level pages</td><td>14</td><td>repository root</td></tr>
    <tr><td>Programmatic SEO pages</td><td>4</td><td>sizes/, machines/, tra/</td></tr>
    <tr><td>Sitemap URLs</td><td>17</td><td>sitemap.xml</td></tr>
    <tr><td>First-party corpus chunks</td><td>172</td><td>data/corpus.jsonl</td></tr>
    <tr><td>Glossary terms</td><td>40</td><td>reference.html</td></tr>
    <tr><td>Failure modes</td><td>8</td><td>reference.html</td></tr>
    <tr><td>Eval queries written</td><td>15, across 3 tiers</td><td>worker/eval-queries.md</td></tr>
    <tr><td>Review queue rows</td><td>5, all needs-review</td><td>tyre_rag/REVIEW_QUEUE.csv</td></tr>
    <tr><td>Servable spec records, local trial</td><td>0</td><td>tyre_rag/MORNING_REPORT.md</td></tr>
    <tr><td>Founded</td><td>1974, David Jewell, Wodonga VIC</td><td>about.html</td></tr>
   </tbody>
  </table>`],
 ['Third-party figures, attributed', `
  <table class="doc-t">
   <thead><tr><th>Measure</th><th>Value</th><th>Source</th></tr></thead>
   <tbody>
    <tr><td>AU OTR market, 2023</td><td>about AUD 208 million</td><td>Credence Research</td></tr>
    <tr><td>AU OTR market, 2032 projection</td><td>about AUD 317 million</td><td>Credence Research</td></tr>
    <tr><td>CAGR 2025 to 2032</td><td>4.78%</td><td>Credence Research</td></tr>
    <tr><td>Largest state market</td><td>Western Australia, then Queensland, then NSW</td><td>Credence Research</td></tr>
    <tr><td>Mining tyre unit cost</td><td>about AUD 8,000 to over AUD 30,000, largest about AUD 69,000</td><td>Credence Research</td></tr>
    <tr><td>Yokohama acquisition of Goodyear OTR</td><td>USD 905 million, completed Feb 2025</td><td>Jewell Tyres knowledge base</td></tr>
   </tbody>
  </table>
  <p class="doc-note">USD figures converted at an indicative AUD 1 = USD 0.65 and rounded, as market-notes.html does. These are third-party figures cited and interpreted, not Jewell data.</p>`],
 ['Not available', `
  <p>Traffic, sessions, referrers by source, answer-engine citations, portal questions asked, abstention rate, escalations to David, enquiries attributed, cost to run, revenue influenced. None of these exist in any form in the repository.</p>`]
]},
];
