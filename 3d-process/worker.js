// otrearthmovertyres.com - 3D Process
//
// A standalone, password-gated Cloudflare Worker serving the 3D Process output
// for otrearthmovertyres.com, built the way the Adam Hall pack is built:
//
//   /       the summary walkthrough (sidebar contents, ten numbered pages,
//           inline viewer)
//   /pack   the four printable sheets (3D on a page, Discover, Design, Deploy)
//
// Deployed separately from the Knowledge Portal worker. See README.md for
// deploy and password rotation.

import { packPage } from './sheets.js';
import { summaryPage } from './summary.js';

const DEFAULT_PASSWORD = 'otr2026';
const COOKIE_NAME = 'otr3d';

const SECURITY_HEADERS = {
  'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet',
  'x-content-type-options': 'nosniff',
  'cache-control': 'no-store',
  'referrer-policy': 'no-referrer',
};

async function tokenFor(password) {
  const data = new TextEncoder().encode('otr-3d-process:' + password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

function html(body, status = 200, extra = {}) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=UTF-8', ...SECURITY_HEADERS, ...extra },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const password = (env && env.SITE_PASSWORD) || DEFAULT_PASSWORD;
    const expected = await tokenFor(password);

    if (url.pathname === '/__auth') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405, headers: SECURITY_HEADERS });
      }
      const form = await request.formData();
      const supplied = String(form.get('password') || '');
      let next = String(form.get('next') || '/');
      // Same-origin paths only, so the gate can never be used as an open redirect.
      if (!next.startsWith('/') || next.startsWith('//')) next = '/';
      if (supplied !== password) {
        return html(gatePage(next, true), 401);
      }
      return new Response(null, {
        status: 303,
        headers: {
          location: next,
          'set-cookie': `${COOKIE_NAME}=${expected}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
          ...SECURITY_HEADERS,
        },
      });
    }

    if (readCookie(request, COOKIE_NAME) !== expected) {
      return html(gatePage(url.pathname + url.search, false), 401);
    }

    if (url.pathname === '/pack' || url.pathname === '/sheets') {
      return html(packPage());
    }
    return html(summaryPage());
  },
};

/* ─────────────────────────── PASSWORD GATE ─────────────────────────── */

function gatePage(next, failed) {
  const nextAttr = next.replace(/"/g, '&quot;');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>otrearthmovertyres.com &middot; 3D Process</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;color:#F5F4F0;
    font-family:'Inter','Helvetica Neue',system-ui,Helvetica,Arial,sans-serif;
    background:radial-gradient(1100px 640px at 18% 0%,rgba(191,110,27,.18),transparent 62%),
      linear-gradient(155deg,#060A0E 0%,#0F1419 55%,#060A0E 100%)}
  .card{width:100%;max-width:392px;text-align:center}
  .wm{font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;margin:0 0 26px;color:#F5F4F0}
  .wm i{font-style:normal;color:#BF6E1B}
  h1{font-weight:700;margin:0 0 6px;font-size:28px;letter-spacing:-0.025em}
  p.sub{opacity:.72;margin:0 0 22px;font-size:14.5px}
  p.err{background:rgba(191,110,27,.16);border:1px solid rgba(191,110,27,.55);
    border-radius:5px;padding:10px 12px;margin:0 0 14px;font-size:14px}
  form{display:flex;flex-direction:column;gap:12px}
  input{padding:13px 14px;border-radius:6px;border:1px solid rgba(245,244,240,.26);
    background:rgba(245,244,240,.08);color:#F5F4F0;font-size:16px;font-family:inherit}
  input:focus{outline:none;border-color:#BF6E1B}
  button{padding:13px 14px;border-radius:6px;border:0;background:#BF6E1B;color:#0F1419;
    font-family:inherit;font-size:15px;font-weight:600;cursor:pointer}
  button:hover{background:#E08428}
  p.foot{margin:26px 0 0;font-family:'IBM Plex Mono',ui-monospace,monospace;
    font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;opacity:.45}
</style>
</head>
<body>
  <main class="card">
    <p class="wm">OTR<i>earthmovertyres.com</i></p>
    <h1>3D Process</h1>
    <p class="sub">Prepared for Clent Jewell.</p>
    ${failed ? '<p class="err">That password did not match. Try again.</p>' : ''}
    <form method="POST" action="/__auth">
      <input type="hidden" name="next" value="${nextAttr}">
      <input type="password" name="password" placeholder="Password" autofocus
             autocomplete="current-password" aria-label="Password" required>
      <button type="submit">View the pack</button>
    </form>
    <p class="foot">Jewell &middot; 3D Process</p>
  </main>
</body>
</html>`;
}
