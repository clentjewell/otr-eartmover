/**
 * OTR Earthmover Tyre, Knowledge Portal RAG worker.
 *
 * Endpoint: POST /api/ask
 * Body: { q: string, conversationId?: string }
 *
 * Pipeline:
 *   1. Embed the user query using Workers AI (bge-base-en-v1.5)
 *   2. Query Vectorize index for top-K similar chunks
 *   3. Compose a system prompt with retrieved context + Jewell voice rules
 *   4. Stream a Claude completion (claude-sonnet-4-5 default)
 *   5. Append citations + disclaimer to the response
 *
 * Cloudflare bindings required (configured in wrangler.toml):
 *   - VECTORIZE_INDEX: a Vectorize binding to the 'otr-corpus' index
 *   - AI: Workers AI binding for embeddings
 *   - ANTHROPIC_API_KEY: secret, set via `wrangler secret put`
 *
 * Status: scaffolded. Not yet deployed. Awaiting:
 *   - Corpus ingestion (./scripts/rag-ingest.js)
 *   - Vectorize index creation (./scripts/create-index.sh)
 *   - ANTHROPIC_API_KEY secret set
 */

const SYSTEM_PROMPT_PATH = './system-prompt.md';

const DISCLAIMER = `

---
*AI-generated answer from the OTR Earthmover Tyre Knowledge Portal, composed from publicly available manufacturer databooks, AS4457 material and 50 years of independent OTR trading. It can be incomplete, out of date or wrong, and citations do not guarantee accuracy. It is the opinion of an independent trader, offered as general technical reference, not engineering advice, and not a recommendation to act on without checking. Verify every figure, especially pressures, loads, fitment, mixing and repair decisions, against current OEM specifications and qualified inspection before acting. To the maximum extent permitted by law, Jewell Tyres accepts no liability for reliance on this answer; nothing here excludes rights that cannot be excluded under the Australian Consumer Law.*`;

const FALLBACK_RESPONSE = {
  lede: 'The portal is currently unavailable.',
  body: '<p>Try again in a moment. For urgent technical questions, call David Jewell direct on <strong><a href="tel:+61419358439">0419 358 439</a></strong>, 50 years of independent OTR trading, straight answers.</p>',
  sources: [],
  citations: []
};

// Verified public source links. Maps a retrieved source (databook filename or
// human name) to its canonical public PDF. Verified, edition-checked only,
// keep in sync with tyre_rag/scripts/sources_public_urls.csv (verified=yes).
const SOURCE_LINKS = [
  [/bridgestone[-\s]*(otr|earthmover)/i, 'https://commercial.bridgestone.com/content/dam/bcs-sites/bridgestone-ex/products/Databooks/Archive/Bridgestone-OTR-Databook-2018-09-06-2018.pdf'],
  [/michelin[-\s]*(otr|earthmover)/i, 'https://www.michelinb2b.com/wps/b2bcontent/OHT/EMDataBook_Global_E.pdf'],
  [/goodyear[-\s]*otr/i, 'https://www.goodyearotr.com/resources/engineering-data'],
  [/bkt[-\s]*(industrial|otr)/i, 'https://otrtires.com/wp-content/uploads/24-BKT-Industrial-catalogue.pdf'],
  [/titan[-\s]*otr/i, 'https://www.titan-intl.com/-/media/Vol-11-OTR-Tires-Databook-01032024-LOWRES.pdf'],
  [/triangle[-\s]*otr/i, 'https://www.triangletyre.es/ftp/OTR%202020.pdf'],
  [/double[-\s]*coin/i, 'https://www.doublecointires.com/wp-content/uploads/Double-Coin-OTR-Data-Book.pdf'],
  [/techking/i, 'https://www.nortire.lt/files/pdf_files/Techking-OTR-Technical-Book-V17.0.pdf'],
  [/mrf[-\s]*otr/i, 'https://www.mrftyres.com/downloads/offtheroadtyre.pdf'],
  [/carlisle/i, 'https://www.carlislebrandtires.com/wp-content/uploads/2019/04/2019_Carlisle_Brand_Catalog.pdf'],
  [/yokohama/i, 'https://www.y-yokohama.com/global/product/tire/pdf/tires/catalogue/OR_HB02.pdf'],
  // Standards/reference bodies (paid publications) -> authoritative source page.
  [/tire[-\s]*and[-\s]*rim|\btra\b/i, 'https://www.us-tra.org/publications/'],
  [/as[-\s]?4457/i, 'https://store.standards.org.au/product/as-4457-2-2008'],
  // First-party site pages ingested into the corpus.
  [/reference\.html/i, 'https://otrearthmovertyres.com/reference.html'],
  [/tyres\.html/i, 'https://otrearthmovertyres.com/tyres.html'],
  // First-party trading experience -> the trading entity.
  [/jewell/i, 'https://jewelltyres.com.au'],
  // Generic OEM-spec references -> our full databook directory.
  [/\boem\b/i, 'https://otrearthmovertyres.com/resources.html'],
];

// Catch-all so every cited source is clickable: the OTR databook directory.
const SOURCE_FALLBACK = 'https://otrearthmovertyres.com/resources.html';

function sourceUrl(s) {
  if (!s) return SOURCE_FALLBACK;
  for (const [re, u] of SOURCE_LINKS) { if (re.test(s)) return u; }
  return SOURCE_FALLBACK;
}

// Minimal HTML escape for verbatim databook text shown in extractive mode.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Is a retrieved chunk readable prose (worth quoting on the page), or a table
// fragment / column-header debris from a databook spec page? Tuned against the
// live corpus: table headers repeat column names (low lexical diversity) and
// carry almost no function words; spec rows are digit-dense.
function isProseExcerpt(t) {
  const words = t.trim().split(/\s+/);
  if (words.length < 12) return false;
  const digits = (t.match(/\d/g) || []).length;
  if (digits / t.length > 0.22) return false;
  const norm = words.map(w => w.toLowerCase().replace(/[^a-z0-9./-]/g, ''));
  if (new Set(norm).size / words.length < 0.5) return false;
  const fn = norm.filter(w => /^(the|and|of|to|a|is|are|for|with|in|on|be|or|it|that|as|at|by|this|from|not|when|should)$/.test(w)).length;
  if (fn / words.length < 0.06) return false;
  // Prose is mostly lowercase words; table headers are Title Case / ALL CAPS.
  const lower = words.filter(w => /^[a-z]/.test(w)).length;
  return lower / words.length >= 0.5;
}

// --- Track A: numeric specifications are served by exact lookup, never an LLM.
const SIZE_RE = /\b(\d{1,2}\.\d{2}R\d{2}|\d{2}\/\d{2}R\d{2}|\d{2}\.\dR\d{2}|\d{1,2}\.\d{2}-\d{2})\b/;
const TRA_RE = /\b([ELG]-\d[A-Z]?)\b/;
const VALUE_HINT = /\b(rim|inflation|pressure|kpa|psi|load|tkph|tmph|section width|overall diameter|width|diameter)\b/i;

// A specific size means a spec lookup. A bare TRA code is a spec lookup only when
// paired with a value word ("rim for E-4"); "what is E-4" stays explanatory.
function isSpecLookup(q) {
  return SIZE_RE.test(q) || (TRA_RE.test(q) && VALUE_HINT.test(q));
}

// Pricing and commercial questions are David's, not the portal's. Checked
// BEFORE Track A so "how much does a 40.00R57 cost?" declines rather than
// dumping that size's spec records.
// "how much" is only commercial when followed by is/are/does/for etc.,
// "how much tread depth…" stays a technical question.
const PRICING_RE = /\b(price|prices|pricing|cost|costs|quote|quotation)\b|\bhow much (is|are|do|does|for|would|will)\b|\$|\bAUD\b/i;

function pricingAnswer(query) {
  return {
    lede: 'The portal doesn’t do pricing, that’s a phone call.',
    body: '<p>OTR tyre prices move with brand, condition (new, unused surplus, secondhand), quantity, location and freight, a figure published here would be wrong the week after it was written. For a real number on the tyre you’re after, call David Jewell direct on <strong><a href="tel:+61419358439">0419 358 439</a></strong>, or start a buy enquiry at <a href="https://jewelltyres.com.au/buy-tyres.html">jewelltyres.com.au</a>, 50 years of trading, straight answers.</p>',
    sources: [], citations: [], escalation: true, disclaimer: DISCLAIMER
  };
}

async function lookupSpecs(db, size, tra) {
  const normSize = size ? size.replace(/\s+/g, '').toUpperCase() : null;
  const normTra = tra ? tra.toUpperCase() : null;
  if (normSize) {
    const res = await db.prepare(
      "SELECT * FROM specs WHERE servable=1 AND REPLACE(UPPER(size_designation),' ','')=? ORDER BY edition_year DESC"
    ).bind(normSize).all();
    if (res.results && res.results.length) return res.results;
  }
  if (normTra) {
    const res = await db.prepare(
      "SELECT * FROM specs WHERE servable=1 AND UPPER(tra_code)=? ORDER BY edition_year DESC"
    ).bind(normTra).all();
    if (res.results && res.results.length) return res.results;
  }
  return [];
}

const SPEC_TH = 'style="text-align:left;padding:0.45rem 1rem 0.45rem 0;font-weight:400;color:var(--otr-steel-light);white-space:nowrap;border-bottom:1px solid var(--otr-rule);width:40%;"';
const SPEC_TD = 'style="text-align:left;padding:0.45rem 0;color:var(--otr-bone);font-family:var(--otr-mono);border-bottom:1px solid var(--otr-rule);"';

function formatSpecRows(rows) {
  const FIELDS = [['tra_code', 'TRA code'], ['rating', 'rating'], ['load_index', 'load index'],
    ['rim_recommendation', 'recommended rim'], ['section_width_mm', 'section width (mm)'],
    ['overall_diameter_mm', 'overall diameter (mm)'], ['inflation_pressure_kpa', 'inflation pressure (kPa)'],
    ['tkph_tmph', 'TKPH/TMPH'], ['application', 'application']];
  const sources = [];
  let body = '';
  rows.forEach((r, i) => {
    const head = `${r.size_designation}${r.tra_code ? ' ' + r.tra_code : ''}, ${r.manufacturer || 'Unknown'} ${r.edition_year || 'n.d.'} databook, p.${r.page ?? 'n.a.'}`;
    const trs = FIELDS.filter(([k]) => r[k] !== null && r[k] !== undefined && r[k] !== '')
      .map(([k, label]) => `<tr><th ${SPEC_TH}>${label}</th><td ${SPEC_TD}>${esc(String(r[k]))}</td></tr>`).join('');
    body += `<p style="margin:1.25rem 0 0.5rem;"><strong>${esc(head)}</strong></p>`
      + `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.92rem;">${trs}</table></div>`;
    let url = sourceUrl(r.source_file || r.manufacturer || '');
    if (url && r.page && /\.pdf$/i.test(url)) url += `#page=${r.page}`;
    sources.push({
      num: String(i + 1).padStart(2, '0'),
      text: `${r.manufacturer || 'Unknown'} ${r.edition_year || ''} databook, p.${r.page ?? 'n.a.'}`,
      url, crop: r.source_crop_path || null
    });
  });
  const what = rows[0]?.size_designation || rows[0]?.tra_code || 'that spec';
  const lede = `${rows.length === 1 ? 'One signed-off record' : rows.length + ' signed-off records'} for ${what}, reproduced verbatim from the databook, never generated.`;
  return { lede, body, sources, citations: [], escalation: false, disclaimer: DISCLAIMER, abstained: false };
}

async function numericAnswer(query, env) {
  // Served only from verified, signed-off Track A records (D1). Never generated.
  if (env.SPECS) {
    try {
      const size = (query.match(SIZE_RE) || [])[0];
      const tra = (query.match(TRA_RE) || [])[0];
      const rows = await lookupSpecs(env.SPECS, size, tra);
      if (rows.length) return formatSpecRows(rows);
    } catch (e) { /* fall through to abstain */ }
  }
  // Not held (or the verified store isn't wired yet): abstain. Never estimate.
  return {
    lede: 'That figure is not in the verified, signed-off dataset, so it is not reproduced here.',
    body: '<p>Specification values, load, rim, inflation, TKPH, are served only from manufacturer databooks that have been dual-pass verified and signed off, never generated. This value is not in that set. Confirm against the current manufacturer specification, or call David Jewell direct on <strong><a href="tel:+61419358439">0419 358 439</a></strong>. It is never estimated.</p>',
    sources: [], citations: [], escalation: true, disclaimer: DISCLAIMER, abstained: true
  };
}

// --- General-knowledge fallback. Used ONLY when the verified corpus returns
// nothing relevant. Clearly labelled as not-from-databooks, never states a
// numeric specification, and escalates to David. Prefers Workers AI (no external
// key); uses Anthropic only if a key is present.
const GENERAL_SYSTEM = `You are the Knowledge Portal for OTR Earthmover Tyre, maintained by Jewell Tyres, independent OTR tyre specialists since 1975. The verified databook corpus did NOT contain material for this question, so you are answering from general off-the-road tyre knowledge.

RULES:
- Australian English. Plain, tyre-buyer to tyre-buyer. Direct. 2-4 short paragraphs.
- This answer is NOT from the verified databooks, do not present any claim as sourced or quoted.
- NEVER state a specific numeric specification: load rating/index, rim width, inflation pressure, section width, overall diameter, or a TKPH/TMPH figure. If one is needed, say it must be read from the manufacturer databook and do not estimate it.
- Do not declare a single brand/model "the best", frame options and trade-offs by application.
- For pricing, contracts, or fleet-specific decisions, decline and point to David Jewell.
- Return only HTML paragraphs (<p>…</p>). No headings, no markdown, no emoji.`;

async function generalAnswer(query, env) {
  let text = '';
  try {
    if (env.AI) {
      const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: GENERAL_SYSTEM },
          { role: 'user', content: query }
        ],
        max_tokens: 700
      });
      text = (r && (r.response || (r.result && r.result.response))) || '';
    }
  } catch (e) { /* fall through to Anthropic or null */ }

  if (!text && env.ANTHROPIC_API_KEY) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-5-20250929', max_tokens: 800, system: GENERAL_SYSTEM, messages: [{ role: 'user', content: query }] })
      });
      if (res.ok) { const j = await res.json(); text = j.content?.[0]?.text || ''; }
    } catch (e) { /* fall through to null */ }
  }

  if (!text.trim()) return null; // no LLM available, caller keeps the honest "not in sources"

  const bodyHtml = /<p[\s>]/i.test(text)
    ? text
    : '<p>' + esc(text).trim().replace(/\n{2,}/g, '</p><p>').replace(/\n/g, ' ') + '</p>';
  const note = '<p style="margin:0 0 1rem;padding:0.6rem 0.9rem;border-left:3px solid var(--otr-steel-light);background:rgba(61,90,108,0.15);font-size:0.85rem;color:var(--otr-fog);">Not found in our verified databooks, this is general guidance, not a sourced specification. Confirm specifics against the manufacturer databook or call David.</p>';
  return {
    lede: "Not in the verified databooks, here's general OTR guidance.",
    body: note + bodyHtml,
    sources: [], excerpts: [], citations: [],
    escalation: true, disclaimer: DISCLAIMER, mode: 'general'
  };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/api/ask') {
      return new Response('Not Found', { status: 404 });
    }

    try {
      const body = await request.json();
      const query = (body.q || '').trim();

      if (!query) {
        return jsonResponse({ error: 'Query required' }, 400);
      }

      if (query.length > 500) {
        return jsonResponse({ error: 'Query too long (500 char max)' }, 400);
      }

      // Pricing/commercial intent outranks everything, decline and hand to
      // David, even when the question names a size the spec store holds.
      if (PRICING_RE.test(query)) {
        return jsonResponse({ q: query, ...pricingAnswer(query) });
      }

      // Track A: a numeric specification question is answered by exact lookup
      // (verbatim + crop) or it abstains. It never reaches the language model.
      if (isSpecLookup(query)) {
        const ans = await numericAnswer(query, env);
        return jsonResponse({ q: query, ...ans });
      }

      // 1. Embed the query
      const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: [query]
      });
      const vector = embedding.data[0];

      // 2. Query Vectorize for top 8 chunks
      const matches = await env.VECTORIZE_INDEX.query(vector, {
        topK: 8,
        returnMetadata: 'all'
      });

      if (!matches.matches || matches.matches.length === 0) {
        const g = await generalAnswer(query, env);
        if (g) return jsonResponse({ q: query, ...g });
        return jsonResponse({
          ...FALLBACK_RESPONSE,
          lede: "I don't have that in my sources.",
          body: '<p>The Knowledge Portal couldn\'t find relevant material for that question. Try rephrasing, be specific about the machine, the size, or the TRA code if known. Or, for high-stakes questions, call David Jewell direct on <strong><a href="tel:+61419358439">0419 358 439</a></strong>.</p>',
          disclaimer: DISCLAIMER
        });
      }

      // Filter by score threshold (0.65 cosine similarity minimum)
      const validMatches = matches.matches.filter(m => m.score >= 0.65);

      if (validMatches.length === 0) {
        const g = await generalAnswer(query, env);
        if (g) return jsonResponse({ q: query, ...g });
        return jsonResponse({
          ...FALLBACK_RESPONSE,
          lede: "I don't have a confident answer for that.",
          body: '<p>The Knowledge Portal found some material but nothing closely matching your question. Could be the question is outside this corpus (pricing, commercial info, real-time supply), or could be a phrasing issue. Try a more specific question, machine + size + code, or call David Jewell direct.</p>',
          disclaimer: DISCLAIMER
        });
      }

      // Build citations + verbatim excerpts up front. These are the actual
      // retrieved passages, so they change with every question and deep-link to
      // the exact databook page.
      const buildUrl = (m) => {
        const page = m.metadata.page;
        let url = sourceUrl(m.metadata.source);
        if (url && page && /\.pdf$/i.test(url)) url += `#page=${page}`;
        return url;
      };
      const sources = validMatches.map((m, i) => {
        const page = m.metadata.page;
        const text = m.metadata.source
          + (m.metadata.section ? `, ${m.metadata.section}` : '')
          + (page ? `, p.${page}` : '');
        return { num: String(i + 1).padStart(2, '0'), text, url: buildUrl(m) };
      });
      // Prefer readable prose over table fragments for the on-page verbatim
      // quotes (retrieval and LLM context are NOT filtered, display only).
      // Generative mode shows prose-only (an empty quote section beats four
      // blocks of column-header debris); extractive mode falls back to raw
      // matches because there the excerpts ARE the answer.
      const mkExcerpts = (arr) => arr.slice(0, 4).map((m, i) => ({
        num: String(i + 1).padStart(2, '0'),
        source: m.metadata.source + (m.metadata.page ? `, p.${m.metadata.page}` : ''),
        text: (m.metadata.text || '').trim().slice(0, 600),
        url: buildUrl(m)
      }));
      let excerpts = mkExcerpts(validMatches.filter(m => isProseExcerpt(m.metadata.text || '')));

      // Extractive mode (default, no Anthropic key needed): the answer IS the
      // databooks' verbatim passages. Zero generation means zero hallucination
      // and ~zero per-query cost; sources change with every question.
      if (!env.ANTHROPIC_API_KEY) {
        if (!excerpts.length) excerpts = mkExcerpts(validMatches);
        const body = excerpts
          .map(x => `<p><strong>[${x.num}]</strong> ${esc(x.text)}…</p>`)
          .join('');
        return jsonResponse({
          q: query,
          lede: 'Straight from the databooks, the passages most relevant to your question:',
          body,
          sources,
          excerpts,
          citations: excerpts.map(x => x.num),
          disclaimer: DISCLAIMER,
          escalation: false
        });
      }

      // Generative mode (Anthropic key present): a readable summary composed
      // strictly from the retrieved context, shown above the verbatim extracts.
      const context = validMatches.map((m, i) =>
        `[Source ${i + 1}: ${m.metadata.source}, ${m.metadata.section || 'general'}]\n${m.metadata.text}`
      ).join('\n\n---\n\n');
      const systemPrompt = await getSystemPrompt(env);
      const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1500,
          system: systemPrompt + '\n\n## RETRIEVED CONTEXT\n\n' + context,
          messages: [{ role: 'user', content: query }]
        })
      });

      if (!claudeResponse.ok) {
        const errText = await claudeResponse.text();
        console.error('Claude API error:', errText);
        return jsonResponse({ ...FALLBACK_RESPONSE, disclaimer: DISCLAIMER }, 502);
      }

      const claudeData = await claudeResponse.json();
      const responseText = claudeData.content[0].text;
      const parsed = parseClaudeResponse(responseText, validMatches);

      return jsonResponse({
        q: query,
        lede: parsed.lede,
        body: parsed.body,
        sources,
        excerpts,
        citations: parsed.citations,
        related: parsed.related,
        disclaimer: DISCLAIMER,
        escalation: shouldEscalate(query, parsed)
      });

    } catch (err) {
      console.error('Worker error:', err);
      return jsonResponse({ ...FALLBACK_RESPONSE, disclaimer: DISCLAIMER, error: err.message }, 500);
    }
  }
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': 'https://otrearthmovertyres.com'
    }
  });
}

async function getSystemPrompt(env) {
  // In production, system prompt could be cached in KV or stored as a module asset.
  // For scaffolding, returning a stub. Replace with actual prompt content from system-prompt.md.
  return `You are the Knowledge Portal for OTR Earthmover Tyre, an independent technical reference site maintained by Jewell Tyres, Australia's independent specialist in big tyres since 1975.

VOICE RULES:
- Plain-spoken. Tyre buyer to tyre buyer.
- Direct: state the answer first, qualify after.
- No marketing-speak. No "premium solutions", "industry-leading", "world-class".
- Specific facts over generic claims.
- Australian English: tyres, civilised, organised, behaviour, programme, kerb.
- Smart quotes, en dashes, no emoji.

ANSWER FORMAT:
Output EXACTLY this structure and nothing else, no markdown code fences, no preamble, no JSON, no text before ===LEDE=== or after ===END===:

===LEDE===
one-sentence headline answer, stated confidently, plain text, no leading label or heading
===BODY===
3-6 short paragraphs as HTML <p>/<ul> markup, inline citations like [1], [2] referring to the numbered retrieved sources
===RELATED===
up to 3 short follow-up questions a reader would naturally ask next, one per line, plain text, each answerable from OTR tyre reference material
===END===

GROUNDING RULES:
- Every factual claim cites a retrieved source by number [n]. A claim with no
  supporting passage in the retrieved context must be omitted entirely.
- Each retrieved source is headed with its databook and page (e.g. "p.42").
  Cite to that level so the reader can verify on the exact page.
- If retrieved context is thin: say so. "I don't have that in my sources" beats
  hallucination. Do not pad with general knowledge.
- For opinion/judgement: attribute to "Jewell Tyres trading experience" and own
  it as opinion.
- For pricing, commercial data, or fleet-specific decisions: decline and
  redirect to David Jewell direct.

NEVER:
- Output a numeric specification VALUE, load rating, rim width, inflation
  pressure, section width, overall diameter, or a TKPH figure. Those are served
  separately by verified exact lookup. If asked for one, say it must be read
  from the named databook/OEM, and do not state or estimate the number.
- Recommend a specific tyre brand without caveats matching the application.
- Give engineering advice that bypasses OEM specifications or AS4457.
- Invent TRA codes, load indices, or specifications not in the retrieved context.`;
}

function parseClaudeResponse(text, matches) {
  // Strip any markdown code fence Claude wraps the answer in despite instructions.
  const cleaned = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();

  let lede, body, related = [];
  const sentinel = cleaned.match(/===\s*LEDE\s*===\s*([\s\S]*?)\s*===\s*BODY\s*===\s*([\s\S]*?)(?:===\s*RELATED\s*===\s*([\s\S]*?))?\s*(?:===\s*END\s*===|$)/i);
  if (sentinel) {
    lede = sentinel[1].trim();
    body = sentinel[2].trim();
    related = (sentinel[3] || '').split('\n')
      .map(s => s.replace(/^[-*•\d.)\s]+/, '').trim())
      .filter(s => s.length > 8 && s.length < 120)
      .slice(0, 3);
  } else {
    // Sentinel markers not used (or a JSON reply from an older prompt cache),
    // avoid leaking raw markdown/labels/JSON syntax into the rendered answer.
    try {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      const parsed = JSON.parse(cleaned.slice(start, end + 1));
      lede = parsed.lede;
      body = parsed.body_html;
    } catch (e) {
      const sentences = cleaned.split(/(?<=[.!?])\s+/);
      lede = (sentences[0] || cleaned.slice(0, 200)).replace(/^#+\s*\S+\s*/, '').replace(/^\*+\s*[A-Z]+:\*+\s*/i, '');
      body = '<p>' + sentences.slice(1).join(' ').replace(/\*+\s*[A-Z]+:\*+/gi, '').trim() + '</p>';
    }
  }
  body = (body || '').replace(/\[(\d+)\]/g, '<sup>[$1]</sup>');

  // Extract cited source numbers
  const citationsRegex = /\[(\d+)\]/g;
  const citations = [...new Set([...(lede + body).matchAll(citationsRegex)].map(m => parseInt(m[1])))];

  return { lede, body, citations, related };
}

function shouldEscalate(query, parsed) {
  // Escalate to David direct for high-stakes commercial decisions.
  const escalationTriggers = [
    /price|cost|quote|how much|\$/i,
    /which brand should/i,
    /contract|terms|commercial/i,
    /buy.*now|need.*urgent/i
  ];
  return escalationTriggers.some(rx => rx.test(query));
}
