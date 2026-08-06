// Cloudflare Pages Function for /api/ask.
//
// Backend: proxies to the Supabase Edge Function `ask`, which holds the RAG
// database (kb_chunks/kb_specs, pgvector) for this portal - see
// RAG-GO-LIVE.md. The Cloudflare-native worker
// (worker/api/ask.js, Workers AI + Vectorize) is kept as an alternative
// backend for later: set env.VECTORIZE_INDEX in the Pages project's
// bindings to switch this endpoint over to it instead.
import cfWorker from '../../worker/api/ask.js';

const SUPABASE_URL = 'https://wlyamhlpowmmavmonbrq.supabase.co';
// Publishable anon key - safe to ship client-/edge-side; the `ask` function
// only ever reads from it with the service-role key server-side.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndseWFtaGxwb3dtbWF2bW9uYnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMDQ3NjIsImV4cCI6MjA5ODg4MDc2Mn0.KQLHwPPt3TQCGxR_x854f_3ShGAVGVNJF79svtGdxR4';

const DISCLAIMER = "AI-generated answer. Composed by an automated system from publicly available manufacturer databooks, TRA and AS4457 material and Jewell Tyres' trading experience - it can be incomplete, out of date or wrong, and citations do not guarantee accuracy. It is the opinion of an independent trader, offered as general technical reference - not professional or engineering advice, and not a recommendation you should act on without checking. Verify every figure - especially pressures, loads, fitment, mixing and repair decisions - against current OEM/manufacturer documentation and qualified inspection before acting. To the maximum extent permitted by law, Jewell Tyres accepts no liability for reliance on this answer; nothing here excludes rights that cannot be excluded under the Australian Consumer Law.";

export const onRequest = async (context) => {
  const { request, env } = context;

  // If Cloudflare Vectorize is bound, prefer the native worker path.
  if (env.VECTORIZE_INDEX) {
    return cfWorker.fetch(request, env, context);
  }

  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders() });
  }

  try {
    const body = await request.text();
    const upstream = await fetch(`${SUPABASE_URL}/functions/v1/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body,
    });
    const text = await upstream.text();
    let outText = text;
    try {
      const obj = JSON.parse(text);
      if (obj && typeof obj === 'object' && !Array.isArray(obj) && (!obj.disclaimer || !String(obj.disclaimer).trim())) {
        obj.disclaimer = DISCLAIMER;
        outText = JSON.stringify(obj);
      }
    } catch (_) { /* non-JSON upstream - leave as-is */ }
    return new Response(outText, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders() },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      lede: 'The portal is currently unavailable.',
      body: '<p>Try again in a moment. For urgent technical questions, call David Jewell direct on <strong><a href="tel:+61419358439">0419 358 439</a></strong>.</p>',
      sources: [], citations: [], escalation: true, error: String(err), disclaimer: DISCLAIMER,
    }), { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://otrearthmovertyres.com',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}
