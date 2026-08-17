// The 3D Process summary walkthrough for otrearthmovertyres.com.
//
// Built the way the Adam Hall summary is built: sticky sidebar contents, a
// welcome landing, a Start here band, ten numbered pages with prev/next, and an
// inline viewer so linked content opens in place instead of a new tab.
//
// Every figure is counted from the otr-eartmover repository or attributed to
// its source at the point of use.

import { markStyles, otrLogo, poweredByJewell } from './marks.js';

export function summaryPage() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>otrearthmovertyres.com &middot; 3D Process Summary</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Brand Identity v1, Aug 2026. Black ground, one high-vis orange, 60/30/10 */
  --black:   #0B0B0B;   /* ground, 60%. never pure #000 */
  --s1:      #151515;   /* surface 01: cards, tiles, table headers */
  --s2:      #1C1C1C;   /* surface 02: panels raised above s1 */
  --hair:    #2C2C2C;   /* all rules and borders. 1px, never heavier */
  --white:   #FFFFFF;   /* type, 30% */
  --body:    #9A9A9A;   /* body copy on dark */
  --meta:    #9A9A9A;   /* small secondary text, 7.3:1 on black */
  --meta-lg: #6E6E6E;   /* non-essential labels, 16px and above only */
  --orange:  #FB8C1F;   /* brand accent, 10%. sampled from the logo */
  --amber:   #FEC013;   /* Jewell safety amber: endorsement only */
  --fail:    #FF8A80;
  --pass:    #4FBF6A;
  --ease:    cubic-bezier(0.16, 1, 0.3, 1);
}

html { scroll-behavior: smooth; }
body {
  font-family: 'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background: var(--black);
  color: var(--white);
  -webkit-font-smoothing: antialiased;
  font-size: 16px; line-height: 1.6;
}

/* ── SCROLL PROGRESS ── */
.progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0; background: var(--orange); z-index: 400; }

/* ── LAYOUT ── */
.layout { display: flex; align-items: flex-start; max-width: 1320px; margin: 0 auto; }

/* ── SIDEBAR ── */
.sidebar {
  position: sticky; top: 18px; align-self: flex-start;
  flex: 0 0 250px; width: 250px;
  max-height: calc(100vh - 36px); overflow-y: auto;
  margin: 18px 0 18px 18px; padding: 22px 16px;
  background: var(--s1); border: 1px solid var(--hair); border-radius:0;
  box-shadow: none;
}
.brand { display: block; margin: 2px 8px 0; text-decoration: none; color: var(--white); }
.jt-endorse { display: inline-flex; align-items: center; gap: 9px; margin: 12px 8px 0; padding-top: 12px;
  border-top: 1px solid var(--hair); white-space: nowrap; }
.jt-type { display: flex; flex-direction: column; gap: 1px; text-align: left; }
.jt-type small { font-size: 8px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--meta); }
.jt-type b { font-size: 11px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #FFFFFF; }
.brand-sub { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--meta); margin: 14px 8px 16px; }
.navtoggle { display: none; }
.nav { display: flex; flex-direction: column; gap: 1px; }
.nav-link {
  display: flex; gap: 10px; align-items: baseline; text-decoration: none; color: var(--meta);
  font-size: 13.5px; line-height: 1.3; padding: 8px 10px; border-radius:0;
  border-left: 2px solid transparent;
}
.nav-link .nav-num { font-variant-numeric: tabular-nums; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 10.5px; color: #A8A69E; min-width: 16px; }
.nav-link:hover { color: var(--white); background: var(--s2); }
.nav-link.active { color: var(--white); background: rgba(251,140,31,0.09); border-left-color: var(--orange); font-weight: 600; }
.nav-link.active .nav-num { color: var(--orange); }
.nav-link.nav-edge { color: var(--white); font-weight: 600; }
.nav-sep { height: 1px; background: var(--hair); margin: 12px 8px; }
.nav-phase { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 9.5px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--orange); margin: 14px 10px 6px; }

/* ── CONTENT ── */
.content { flex: 1 1 auto; min-width: 0; padding: 34px clamp(28px, 5vw, 70px) 80px; max-width: 1060px; }
.welcome, .page { scroll-margin-top: 24px; }
.page { margin-top: 56px; }

.page-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 30px; }
.page-chip { font-size: 11px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--orange); }
.page-count { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.06em; color: var(--meta); }

/* ── TYPE ── */
.eyebrow { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--orange); margin-bottom: 22px; }
.eyebrow.light { color: var(--meta); }
.eyebrow.amber { color: var(--orange); }

.h-hero { font-size: clamp(38px, 6vw, 72px); font-weight: 800; text-transform: uppercase; line-height: 0.92; letter-spacing: -0.03em; }
.h-section { font-size: clamp(24px, 3.4vw, 40px); font-weight: 800; text-transform: uppercase; line-height: 0.98; letter-spacing: -0.03em; max-width: 20ch; }
.h-section.light { color: var(--black); }
.light { color: var(--black); }

.lead { font-size: clamp(16px, 1.5vw, 19px); font-weight: 400; line-height: 1.7; color: var(--meta); max-width: 660px; }
.body { font-size: clamp(15px, 1.2vw, 17px); font-weight: 400; line-height: 1.7; color: var(--body); max-width: 720px; }
.body.light { color: var(--body); }
.body.grey { color: var(--meta); }
.note { font-size: 13px; line-height: 1.65; color: var(--meta); }
.note.light { color: var(--meta); }

.mt12{margin-top:12px}.mt20{margin-top:20px}.mt28{margin-top:28px}.mt40{margin-top:40px}.mt56{margin-top:56px}

.rule { height: 1px; background: var(--hair); width: 100%; }
.rule.dark { background: var(--hair); }

.cols-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 4vw, 56px); align-items: start; }
.cols-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(20px, 3vw, 38px); align-items: start; }
.col-label { font-size: 15px; font-weight: 600; margin-bottom: 12px; line-height: 1.35; }
.col-label.light { color: var(--black); }
.col-body { font-size: 15px; font-weight: 400; line-height: 1.7; color: var(--meta); }
.col-body.dim { color: var(--body); }

/* ── ROW LIST ── */
.row { display: flex; gap: clamp(20px, 4vw, 48px); padding: 22px 0; border-bottom: 1px solid var(--hair); }
.row:first-child { border-top: 1px solid var(--hair); }
.row-k { font-size: 17px; font-weight: 600; min-width: 250px; flex-shrink: 0; line-height: 1.4; }
.row-v { font-size: 15px; font-weight: 400; color: var(--meta); line-height: 1.65; }

/* ── NUMBERED GAP ITEMS ── */
.gap-item { padding: 26px 0; border-bottom: 1px solid var(--hair); font-size: clamp(18px, 2vw, 26px); font-weight: 400; line-height: 1.4; letter-spacing: -0.015em; }
.gap-item:first-child { border-top: 1px solid var(--hair); }
.gap-item .idx { color: var(--orange); font-weight: 600; margin-right: 18px; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 0.8em; }
.gap-item .sub { display: block; font-size: 15px; color: var(--meta); margin-top: 10px; max-width: 680px; }

/* ── STATUS PILLS ── */
.pill { display: inline-flex; align-items: center; gap: 7px; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; white-space: nowrap; }
.pill.done { color: var(--orange); border: 1px solid rgba(251,140,31,0.4); background: rgba(251,140,31,0.07); }
.pill.part { color: var(--meta); border: 1px solid rgba(61,90,108,0.4); background: rgba(61,90,108,0.07); }
.pill.none { color: var(--meta); border: 1px solid var(--hair); background: var(--s1); }
.pill .dot { width: 7px; height: 7px; border-radius: 999px; background: currentColor; }

/* ── 3D PROCESS DIAGRAM ── */
.method { padding: 8px 0 6px; }
.method-lockup { display: flex; align-items: center; gap: 12px; margin: 6px 0 44px; }
.method-lockup .ml-j { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; }
.method-lockup .ml-x { color: #A8A69E; font-size: 15px; font-weight: 300; }
.msteps { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.mline { position: absolute; top: 19px; left: 7%; right: 7%; height: 2px; background: var(--s2); overflow: hidden; border-radius:0; }
.mline-fill { display: block; height: 100%; width: 0; background: var(--orange); transition: width 1.5s cubic-bezier(.16,1,.3,1) .25s; }
.method.run .mline-fill { width: 100%; }
.mstep { position: relative; opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s cubic-bezier(.16,1,.3,1); }
.method.run .mstep { opacity: 1; transform: none; }
.method.run .mstep[data-i="2"] { transition-delay: .32s; }
.method.run .mstep[data-i="3"] { transition-delay: .62s; }
.mdot { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: var(--s2); color: var(--white); font-weight: 600; font-size: 12.5px; font-family: 'IBM Plex Mono', ui-monospace, monospace; position: relative; z-index: 2; }
.method.run .mdot::after { content: ""; position: absolute; inset: -5px; border-radius: 50%; border: 2px solid var(--orange); opacity: 0; animation: mpulse 2.6s ease-out infinite; }
.method.run .mstep[data-i="2"] .mdot::after { animation-delay: .5s; }
.method.run .mstep[data-i="3"] .mdot::after { animation-delay: 1s; }
@keyframes mpulse { 0% { transform: scale(.85); opacity: .55; } 100% { transform: scale(1.6); opacity: 0; } }
.mc { margin-top: 18px; }
.mgate { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--orange); }
.mc h3 { font-size: 24px; font-weight: 600; letter-spacing: 0; margin: 5px 0 8px; }
.mc p { font-size: 13.5px; line-height: 1.55; color: var(--meta); font-weight: 400; }
.method-loop { margin-top: 36px; font-size: 12.5px; color: #8a857d; display: flex; align-items: center; gap: 9px; }
.method-loop::before { content: ""; width: 18px; height: 2px; background: var(--orange); border-radius:0; flex-shrink: 0; }

/* ── LINK ROWS ── */
.linkrow { display: flex; align-items: center; gap: clamp(16px, 3vw, 40px); padding: 24px 4px; border-bottom: 1px solid var(--hair); text-decoration: none; color: var(--white); transition: padding-left 0.3s var(--ease); }
.linkrow:first-child { border-top: 1px solid var(--hair); }
.linkrow:hover { padding-left: 14px; }
.linkrow .lr-k { font-size: clamp(17px, 2vw, 22px); font-weight: 600; flex: 1 1 auto; line-height: 1.35; letter-spacing: -0.015em; }
.linkrow .lr-v { font-size: 14px; color: var(--meta); flex: 1 1 300px; line-height: 1.6; }
.linkrow .lr-go { font-size: 20px; color: var(--orange); flex-shrink: 0; }

/* ── DARK PANEL ── */
.darkwrap { background: var(--s1); color: var(--white); border-radius:0; padding: clamp(28px, 4vw, 52px); }
.darkwrap .h-section { color: var(--black); }

/* ── PORTAL CONSOLE MOCK ── */
.pc { border-radius:0; overflow: hidden; border: 1px solid rgba(245,244,240,0.12); background: var(--graphite-dp); box-shadow: none; }
.pc-bar { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #11181F; border-bottom: 1px solid rgba(245,244,240,0.08); }
.pc-bar .tl { width: 11px; height: 11px; border-radius: 999px; background: rgba(245,244,240,0.22); }
.pc-bar .url { margin-left: 14px; font-size: 11.5px; color: var(--meta); font-family: 'IBM Plex Mono', ui-monospace, monospace; }
.pc-main { padding: 22px 24px 24px; }
.pc-eyebrow { font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--orange); font-family: 'IBM Plex Mono', ui-monospace, monospace; }
.pc-q { color: var(--white); font-size: 18px; font-weight: 600; margin-top: 10px; letter-spacing: -0.02em; }
.pc-ask { margin-top: 16px; display: flex; gap: 10px; align-items: center; border: 1px solid rgba(245,244,240,0.16); border-radius:0; padding: 11px 14px; }
.pc-ask span { flex: 1 1 auto; color: var(--meta); font-size: 13.5px; }
.pc-ask b { background: var(--orange); color: var(--black); font-size: 12px; font-weight: 600; padding: 6px 13px; border-radius:0; }
.pc-answer { margin-top: 18px; border-top: 1px solid rgba(245,244,240,0.1); padding-top: 16px; }
.pc-label { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.18em; color: var(--orange); text-transform: uppercase; }
.pc-lede { color: var(--white); font-size: 14.5px; line-height: 1.55; margin-top: 9px; font-weight: 500; }
.pc-body { color: rgba(245,244,240,0.72); font-size: 12.5px; line-height: 1.6; margin-top: 9px; }
.pc-cite { display: inline-flex; align-items: center; justify-content: center; min-width: 15px; height: 15px; padding: 0 3px; border-radius:0; background: rgba(74,107,124,0.28); color: var(--orange); font-size: 9.5px; font-family: 'IBM Plex Mono', ui-monospace, monospace; vertical-align: 1px; margin: 0 1px; }
.pc-sources { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 6px; }
.pc-src { font-size: 10.5px; color: rgba(245,244,240,0.55); border: 1px solid rgba(245,244,240,0.14); border-radius:0; padding: 4px 9px; }
.pc-disc { margin-top: 14px; font-size: 10.5px; line-height: 1.5; color: var(--body); border-left: 2px solid rgba(251,140,31,0.5); padding-left: 11px; }

/* spec table mock */
.pc-spec { margin-top: 14px; width: 100%; border-collapse: collapse; font-size: 12px; }
.pc-spec th { text-align: left; padding: 6px 12px 6px 0; font-weight: 400; color: var(--meta); border-bottom: 1px solid rgba(245,244,240,0.1); width: 42%; }
.pc-spec td { text-align: left; padding: 6px 0; color: var(--orange); font-family: 'IBM Plex Mono', ui-monospace, monospace; border-bottom: 1px solid rgba(245,244,240,0.1); }

/* ── CALLOUT ── */
.callout { border-left: 2px solid var(--orange); padding: 6px 0 6px 22px; }

/* ── OVERVIEW CARDS ── */
.ov-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.ov-card { display: flex; gap: 14px; align-items: baseline; text-decoration: none; color: var(--white); border: 1px solid var(--hair); border-radius:0; padding: 16px 18px; transition: border-color .2s, transform .2s var(--ease); background: var(--s1); }
.ov-card:hover { border-color: var(--orange); transform: translateY(-2px); }
.ov-card .n { font-size: 12px; font-weight: 600; color: var(--orange); font-family: 'IBM Plex Mono', ui-monospace, monospace; }
.ov-card .t { font-size: 15px; font-weight: 500; line-height: 1.35; }

/* ── PAGE NAV ── */
.page-nav { display: flex; gap: 12px; margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--hair); }
.page-nav.dark { border-color: var(--hair); }
.pn-btn { flex: 1; display: flex; flex-direction: column; gap: 3px; text-decoration: none; border: 1px solid var(--hair); border-radius:0; padding: 14px 18px; transition: border-color .15s, transform .18s var(--ease); }
.pn-btn:hover { border-color: var(--orange); transform: translateY(-2px); }
.pn-btn.next { text-align: right; align-items: flex-end; }
.pn-btn span { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--meta); }
.pn-btn strong { font-size: 15px; font-weight: 600; color: var(--white); }

/* ── START HERE ── */
.starthere { border-bottom: 1px solid var(--hair); padding: 4px 0 40px; margin-bottom: 8px; }
.stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat { border: 1px solid var(--hair); border-radius:0; padding: 18px 16px; background: var(--s1); }
.stat-n { display: block; font-size: clamp(26px, 3vw, 38px); font-weight: 700; color: var(--orange); letter-spacing: -0.03em; line-height: 1; }
.stat-l { display: block; font-size: 12.5px; color: var(--meta); margin-top: 8px; line-height: 1.35; }
.cta-row { display: flex; flex-wrap: wrap; gap: 12px; }
.cta { display: inline-flex; align-items: center; gap: 8px; font-size: 14.5px; font-weight: 600; text-decoration: none;
  padding: 13px 20px; border-radius:0; border: 1px solid var(--hair); color: var(--white); background: var(--s1);
  transition: border-color .15s, transform .18s var(--ease), opacity .15s; cursor: pointer; font-family: inherit; }
.cta:hover { border-color: var(--orange); transform: translateY(-2px); }
.cta-primary { background: var(--orange); border-color: var(--orange); color: var(--black); font-weight: 600; }
.cta-primary:hover { background: #FFA24D; border-color: #FFA24D; transform: translateY(-2px); }
.cta-ghost { border-color: transparent; color: var(--orange); padding-left: 6px; padding-right: 6px; }

/* ── REVEAL ── */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity .9s var(--ease), transform .9s var(--ease); }
.reveal.in { opacity: 1; transform: none; }
.stagger > * { opacity: 0; transform: translateY(24px); transition: opacity .8s var(--ease), transform .8s var(--ease); }
.stagger.in > * { opacity: 1; transform: none; }
.stagger.in > *:nth-child(1){transition-delay:.04s}.stagger.in > *:nth-child(2){transition-delay:.12s}
.stagger.in > *:nth-child(3){transition-delay:.20s}.stagger.in > *:nth-child(4){transition-delay:.28s}
.stagger.in > *:nth-child(5){transition-delay:.36s}.stagger.in > *:nth-child(6){transition-delay:.44s}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal, .stagger > * { opacity: 1 !important; transform: none !important; transition: none !important; }
  .mstep { opacity: 1 !important; transform: none !important; transition: none; }
  .mline-fill { transition: none; } .method.run .mdot::after { animation: none; }
}

/* ── INLINE VIEWER ── */
#viewer { display: none; flex: 1 1 auto; min-width: 0; flex-direction: column;
  position: sticky; top: 18px; height: calc(100vh - 36px);
  margin: 18px 18px 18px 0; background: var(--s1); border: 1px solid var(--hair);
  border-radius:0; overflow: hidden; box-shadow: none; }
html.viewing .content { display: none; }
html.viewing #viewer { display: flex; }
html.viewing .progress-bar { display: none; }
html.viewing .sidebar .nav, html.viewing .sidebar .navtoggle { display: none; }
html.viewing .layout { max-width: none; }
html.viewing .sidebar { background: transparent; border: 0; box-shadow: none; }
html.viewing #viewer { position: fixed; top: 0; right: 0; bottom: 0; left: auto;
  width: var(--viewer-w, 74vw); height: 100vh; margin: 0; border: 0;
  border-left: 1px solid var(--hair); border-radius: 0;
  box-shadow: none; }
.viewer-split { display: none; }
html.viewing .viewer-split { display: block; position: absolute; left: 0; top: 0; bottom: 0;
  width: 12px; margin-left: -6px; cursor: col-resize; z-index: 6; touch-action: none; }
.viewer-split::after { content: ""; position: absolute; left: 5px; top: 50%; transform: translateY(-50%);
  width: 3px; height: 46px; border-radius:0; background: var(--hair); transition: background .15s, height .15s; }
.viewer-split:hover::after, .viewer-split.dragging::after { background: var(--orange); height: 72px; }
.viewer-bar { display: flex; align-items: center; gap: 12px; flex-shrink: 0;
  padding: 11px 14px; border-bottom: 1px solid var(--hair); background: var(--black); }
.viewer-back { display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
  border: 1px solid var(--hair); background: var(--s1); color: var(--white);
  font-family: inherit; font-size: 13.5px; font-weight: 600;
  padding: 8px 14px; border-radius:0; transition: border-color .15s, color .15s, background .15s; }
.viewer-back:hover { border-color: var(--orange); color: var(--black); background: var(--s1); }
.viewer-title { font-size: 13.5px; font-weight: 600; color: var(--white);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.viewer-spacer { flex: 1 1 auto; }
.viewer-newtab { font-size: 12px; color: var(--meta); text-decoration: none;
  white-space: nowrap; border: 1px solid var(--hair); border-radius:0; padding: 8px 12px; }
.viewer-newtab:hover { color: var(--orange); border-color: var(--orange); }
.viewer-frame { flex: 1 1 auto; width: 100%; border: 0; background: var(--s1); }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .layout { flex-direction: column; }
  .sidebar { position: static; width: auto; max-height: none; flex-basis: auto; margin: 14px 14px 0; }
  .navtoggle { display: block; width: 100%; text-align: left; background: none; border: 0; font: inherit; cursor: pointer; padding: 6px 8px; color: var(--meta); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
  .nav.collapsed { display: none; }
  .content { padding: 26px 22px 70px; max-width: none; }
  .cols-2, .cols-3 { grid-template-columns: 1fr; gap: 26px; }
  .row { flex-direction: column; gap: 8px; } .row-k { min-width: 0; }
  .linkrow { flex-wrap: wrap; gap: 10px; } .linkrow .lr-v { flex-basis: 100%; }
  .msteps { grid-template-columns: 1fr; gap: 26px; } .mline { display: none; }
  .ov-grid { grid-template-columns: 1fr; }
  .page { margin-top: 40px; }
  html.viewing #viewer { width: 100vw; left: 0; border-left: 0; }
  html.viewing .viewer-split { display: none; }
  #viewer { position: static; height: calc(100vh - 90px); margin: 14px; }
  .viewer-title { display: none; }
}
@media (max-width: 640px) { .stat-row { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) {
  body { font-size: 15px; }
  .content { padding: 22px 18px 64px; }
  .sidebar { margin: 12px 12px 0; padding: 16px 12px; }
  .page-head { flex-direction: column; align-items: flex-start; gap: 6px; margin-bottom: 24px; }
  .h-hero { font-size: clamp(34px, 11vw, 52px); }
  .h-section { font-size: clamp(25px, 8vw, 36px); }
  .lead, .body { max-width: none; }
  .mt40 { margin-top: 30px; } .mt56 { margin-top: 38px; }
  .darkwrap { padding: 22px 18px; border-radius:0; }
  .row { padding: 18px 0; } .row-k { font-size: 16px; }
  .linkrow { padding: 20px 2px; } .linkrow:hover { padding-left: 2px; }
  .linkrow .lr-k { font-size: 18px; }
  .gap-item { font-size: 19px; }
  .mdot { width: 36px; height: 36px; }
  .pn-btn { padding: 12px 15px; }
}
  ${markStyles()}
</style>
</head>
<body>

<div class="progress-bar" id="prog"></div>

<div class="layout">

  <!-- ── SIDEBAR NAV ── -->
  <aside class="sidebar">
    <a class="brand" href="#top">${otrLogo({ width: 202 })}</a>
    ${poweredByJewell({ height: 28 })}
    <p class="brand-sub">3D Process</p>
    <button class="navtoggle" id="navtoggle" type="button" aria-expanded="true">Contents</button>
    <nav class="nav" id="nav">
      <a class="nav-link nav-edge" href="#top"><span class="nav-num">&middot;</span><span>Welcome</span></a>
      <a class="nav-link nav-edge" href="#starthere"><span class="nav-num">&#9733;</span><span>Start here</span></a>
      <p class="nav-phase">Summary on a page</p>
      <a class="nav-link sop-nav" href="#sop-process"><span class="nav-num">&middot;</span><span>3D Process</span></a>
      <a class="nav-link sop-nav" href="#sop-discover"><span class="nav-num">&middot;</span><span>Discover on a page</span></a>
      <a class="nav-link sop-nav" href="#sop-design"><span class="nav-num">&middot;</span><span>Design on a page</span></a>
      <a class="nav-link sop-nav" href="#sop-deploy"><span class="nav-num">&middot;</span><span>Deploy on a page</span></a>
      <div class="nav-sep"></div>
      <a class="nav-link" href="#note"><span class="nav-num">01</span><span>A note up front</span></a>
      <a class="nav-link" href="#whatsinside"><span class="nav-num">02</span><span>What this is</span></a>
      <a class="nav-link" href="#process"><span class="nav-num">03</span><span>The 3D Process</span></a>
      <a class="nav-link" href="#onapage"><span class="nav-num">04</span><span>The 3D Process, on a page</span></a>
      <a class="nav-link" href="#delivered"><span class="nav-num">05</span><span>What's in the set</span></a>
      <a class="nav-link" href="#notdone"><span class="nav-num">06</span><span>What is not built</span></a>
      <a class="nav-link" href="#access"><span class="nav-num">07</span><span>Access and links</span></a>
      <a class="nav-link" href="#portal"><span class="nav-num">08</span><span>The Knowledge Portal</span></a>
      <a class="nav-link" href="#ask"><span class="nav-num">09</span><span>Ask it anything</span></a>
      <a class="nav-link" href="#next"><span class="nav-num">10</span><span>Next steps</span></a>
      <div class="nav-sep"></div>
      <a class="nav-link nav-edge" href="/pack" data-view data-title="The four 3D Process sheets"><span class="nav-num">&rarr;</span><span>Open the four sheets</span></a>
    </nav>
  </aside>

  <!-- ── CONTENT ── -->
  <main class="content">

    <!-- ── WELCOME ── -->
    <section class="welcome" id="top">
      <div class="eyebrow reveal">Jewell &middot; Prepared for Clent Jewell</div>
      <h1 class="h-hero reveal" style="transition-delay:.06s">Your 3D Process.<br>Read from the build.</h1>
      <p class="lead mt28 reveal" style="transition-delay:.14s">The Discover, Design and Deploy set for otrearthmovertyres.com, on four sheets. There was no discovery session for this one. The CORE was read out of the repository, front end and backend, because the material was already there.</p>
      <div class="rule mt40 reveal"></div>
      <p class="eyebrow mt40 reveal" style="margin-bottom:18px;">Inside this summary</p>
      <div class="ov-grid stagger">
        <a class="ov-card" href="#starthere"><span class="n">&#9733;</span><span class="t">Start here &middot; the 60-second version</span></a>
        <a class="ov-card" href="#note"><span class="n">01</span><span class="t">A note up front</span></a>
        <a class="ov-card" href="#whatsinside"><span class="n">02</span><span class="t">What this is</span></a>
        <a class="ov-card" href="#process"><span class="n">03</span><span class="t">The 3D Process</span></a>
        <a class="ov-card" href="#onapage"><span class="n">04</span><span class="t">The 3D Process, on a page</span></a>
        <a class="ov-card" href="#delivered"><span class="n">05</span><span class="t">What's in the set</span></a>
        <a class="ov-card" href="#notdone"><span class="n">06</span><span class="t">What is not built</span></a>
        <a class="ov-card" href="#access"><span class="n">07</span><span class="t">Access and links</span></a>
        <a class="ov-card" href="#portal"><span class="n">08</span><span class="t">The Knowledge Portal</span></a>
        <a class="ov-card" href="#ask"><span class="n">09</span><span class="t">Ask it anything</span></a>
      </div>
    </section>

    <!-- ── START HERE ── -->
    <section class="starthere" id="starthere">
      <span class="eyebrow amber reveal">Start here &middot; if you read nothing else</span>
      <h2 class="h-section reveal">Fifty years of answers, finally written down.</h2>
      <p class="lead mt20 reveal">The site is built and it works. Two things are missing: most of the content it promises, and any way of telling whether it is being read.</p>

      <div class="stat-row mt40 stagger">
        <div class="stat"><span class="stat-n">19</span><span class="stat-l">brands covered</span></div>
        <div class="stat"><span class="stat-n">26</span><span class="stat-l">tyre records live, of a stated 600+</span></div>
        <div class="stat"><span class="stat-n">14</span><span class="stat-l">market notes published</span></div>
        <div class="stat"><span class="stat-n">0</span><span class="stat-l">citations measured, so far</span></div>
      </div>
      <p class="note mt20 reveal">Counted from the repository, August 2026.</p>

      <div class="callout mt40 reveal">
        <p class="body" style="margin:0;"><strong>The one next step:</strong> run the CORE session and settle what counts as this site working, then instrument it. Everything else in Deploy depends on that answer. <a href="#next" style="color:var(--orange);font-weight:600;text-decoration:none;">See the plan &#8599;</a></p>
      </div>

      <div class="cta-row mt40 stagger">
        <a class="cta cta-primary" href="/pack" data-view data-title="The four 3D Process sheets">Open the four sheets &#8599;</a>
        <a class="cta" href="https://otrearthmovertyres.com" data-view data-title="otrearthmovertyres.com">See the live site &#8599;</a>
        <a class="cta cta-ghost" href="#note">Start the walkthrough &#8595;</a>
      </div>
    </section>

    <!-- ── 01 A NOTE UP FRONT ── -->
    <article class="page" id="note">
      <div class="page-head"><span class="page-chip">A note up front</span><span class="page-count">01 / 10</span></div>
      <h2 class="h-section reveal">Read from the build, held honest.</h2>
      <div class="rule mt40 reveal"></div>
      <p class="body mt40 reveal">Clent, this one runs backwards compared to the rest of the 3D Process work. Normally CORE comes out of a discovery session and the build follows. Here the build already existed, so the CORE was extracted from it: the site, the copy, the data, the RAG corpus, the Knowledge Portal, the Cloudflare and Supabase backends, the scripts and the documentation.</p>
      <p class="body mt20 reveal">A note on status. Everything on the sheets traces to a file in the repository. Nothing has been invented to make the set look complete. Where the repository does not answer a CORE question, the sheet names the gap instead of filling it, and there are three of those.</p>
      <p class="body mt20 reveal">The same standard as always: nothing is asserted as fact that the evidence does not carry. Where the work is thin or the numbers do not match what the site claims, the page says so.</p>
      <p class="note mt28 reveal">Yours, Clent.</p>
      <nav class="page-nav">
        <a class="pn-btn prev" href="#top"><span>Previous</span><strong>Welcome</strong></a>
        <a class="pn-btn next" href="#whatsinside"><span>Next</span><strong>What this is</strong></a>
      </nav>
    </article>

    <!-- ── 02 WHAT THIS IS ── -->
    <article class="page" id="whatsinside">
      <div class="page-head"><span class="page-chip">What you are looking at</span><span class="page-count">02 / 10</span></div>
      <h2 class="h-section reveal">Discover to Deploy, on four sheets.</h2>
      <div class="cols-2 mt40 stagger">
        <div>
          <div class="col-label">The whole build on four printable sheets.</div>
          <div class="col-body">3D on a page, then Discover, Design and Deploy. Each sheet is standalone, print-ready, and carries its own gate status. The set is the record while the process runs.</div>
        </div>
        <div>
          <div class="col-label">Scaffolding, built to be updated.</div>
          <div class="col-body">The structure is the lasting asset. As the CORE questions close and the corpus fills, the sheets update around them without starting over.</div>
        </div>
      </div>
      <div class="callout mt56 reveal">
        <p class="body" style="margin:0;">This is Read v01. Not pre-validation drafts, but a read of a system that was designed and shipped before the strategy behind it was written down. The 22 CORE questions are the validation pass.</p>
      </div>
      <p class="note mt28 reveal">Answer the CORE questions, and the set is refreshed to match.</p>
      <nav class="page-nav">
        <a class="pn-btn prev" href="#note"><span>Previous</span><strong>A note up front</strong></a>
        <a class="pn-btn next" href="#process"><span>Next</span><strong>The 3D Process</strong></a>
      </nav>
    </article>

    <!-- ── 03 THE 3D PROCESS ── -->
    <article class="page" id="process">
      <div class="page-head"><span class="page-chip">The method behind the work</span><span class="page-count">03 / 10</span></div>
      <h2 class="h-section reveal">The 3D Process.</h2>
      <p class="body mt28 reveal">Three disciplined phases, three decision gates. The 3D Process is the Jewell method for building a brand and its go-to-market on evidence rather than opinion. Each phase ends at a gate, a point to review, align and approve before the next one starts. The work compounds in one direction instead of looping.</p>

      <div class="method mt56" id="method">
        <div class="method-lockup">
          <span class="ml-j">Jewell</span>
          <span class="ml-x">&middot;</span>
          <span style="font-size:15px;font-weight:600;letter-spacing:-0.01em;">3D Process</span>
        </div>
        <div class="msteps">
          <div class="mline"><span class="mline-fill"></span></div>
          <div class="mstep" data-i="1"><span class="mdot">01</span><div class="mc"><span class="mgate">Checkpoint 1 &middot; Gate 1</span><h3>Discover</h3><p>Find the opportunity. The CORE, the evidence and the market truth, reviewed at Gate 1.</p></div></div>
          <div class="mstep" data-i="2"><span class="mdot">02</span><div class="mc"><span class="mgate">Checkpoint 2 &middot; Gate 2</span><h3>Design</h3><p>Design the system. Brand, customer, business model, messaging and platform, locked at Gate 2.</p></div></div>
          <div class="mstep" data-i="3"><span class="mdot">03</span><div class="mc"><span class="mgate">Checkpoint 3 &middot; Gate 3</span><h3>Deploy</h3><p>Take it to market. The launch sequence, channels and measurement, approved at Gate 3.</p></div></div>
        </div>
        <p class="method-loop">Then Deepen: what is deployed feeds back into discovery, an ongoing loop that compounds.</p>
      </div>

      <div class="callout mt56 reveal">
        <p class="body" style="margin:0;">On this engagement the phases are not in their usual state. Discover is read rather than run, Design is already built and never reviewed, and Deploy is partly live with no measurement. The gates are still the gates.</p>
      </div>

      <nav class="page-nav">
        <a class="pn-btn prev" href="#whatsinside"><span>Previous</span><strong>What this is</strong></a>
        <a class="pn-btn next" href="#onapage"><span>Next</span><strong>The 3D Process, on a page</strong></a>
      </nav>
    </article>

    <!-- ── 04 ON A PAGE ── -->
    <article class="page" id="onapage">
      <div class="page-head"><span class="page-chip">The whole engagement on one page</span><span class="page-count">04 / 10</span></div>
      <h2 class="h-section reveal">The 3D Process, on a page.</h2>
      <p class="body mt28 reveal">Four sheets is the right depth to work from. It is not what gets read on a Tuesday. So here is the whole thing in six lines, the belief, the position, the numbers, the constraint, the plan, the decision.</p>
      <div class="mt40 stagger">
        <div class="row">
          <div class="row-k">The belief</div>
          <div class="row-v">Jewell Tyres trades the tyres. otrearthmovertyres.com teaches the trade. Fifty years of answers get published free, so that buyers and answer engines come here for them.</div>
        </div>
        <div class="row">
          <div class="row-k">The position</div>
          <div class="row-v">The independent, cross-brand OTR reference for Australia and New Zealand. Every manufacturer databook is single-brand, PDF-gated and not searchable across makers.</div>
        </div>
        <div class="row">
          <div class="row-k">The numbers</div>
          <div class="row-v">19 brands, 26 tyre records live against a stated 600+, 172 corpus chunks, 14 market notes, one of seven calculators, four programmatic SEO samples. All counted from the repository.</div>
        </div>
        <div class="row">
          <div class="row-k">The constraint</div>
          <div class="row-v">The frame is built and the content is thin. Nothing records whether an answer engine has ever cited the site, and being cited is the whole point of it.</div>
        </div>
        <div class="row">
          <div class="row-k">The plan</div>
          <div class="row-v">Instrument it, then fill the corpus, then convert it. Measurement first, deliberately, because more content with no measurement teaches nothing.</div>
        </div>
        <div class="row">
          <div class="row-k">The decision</div>
          <div class="row-v">Close the 22 CORE questions with Clent and David. The first that matters: what counts as this site working.</div>
        </div>
      </div>
      <div class="mt56 stagger">
        <a class="linkrow" href="/pack#sop-process" data-view data-title="3D on a page">
          <span class="lr-k">3D on a page</span>
          <span class="lr-v">The whole build, one sheet, at the top of the pack.</span>
          <span class="lr-go">&rarr;</span>
        </a>
        <a class="linkrow" href="/pack#sop-discover" data-view data-title="Discover, on a page">
          <span class="lr-k">Discover, on a page</span>
          <span class="lr-v">Gate 1. The belief, the CORE of the business, and the ten Discover questions.</span>
          <span class="lr-go">&rarr;</span>
        </a>
        <a class="linkrow" href="/pack#sop-design" data-view data-title="Design, on a page">
          <span class="lr-k">Design, on a page</span>
          <span class="lr-v">Gate 2. Brand, customer, business model, messaging and platform, as built.</span>
          <span class="lr-go">&rarr;</span>
        </a>
        <a class="linkrow" href="/pack#sop-deploy" data-view data-title="Deploy, on a page">
          <span class="lr-k">Deploy, on a page</span>
          <span class="lr-v">Gate 3. Three phases with exit tests, the channel plan and the automation triage.</span>
          <span class="lr-go">&rarr;</span>
        </a>
      </div>
      <div class="callout mt56 reveal">
        <p class="body" style="margin:0;"><strong>CORE</strong>, Customers, Offering, Rivals, Expression, is the shape of the business. The 22 questions hang off it: ten for Discover, six for Design, six for Deploy. Every one is still open.</p>
      </div>
      <nav class="page-nav">
        <a class="pn-btn prev" href="#process"><span>Previous</span><strong>The 3D Process</strong></a>
        <a class="pn-btn next" href="#delivered"><span>Next</span><strong>What's in the set</strong></a>
      </nav>
    </article>

    <!-- ── 05 WHAT'S IN THE SET ── -->
    <article class="page" id="delivered">
      <div class="page-head"><span class="page-chip">Built &middot; and running</span><span class="page-count">05 / 10</span></div>
      <h2 class="h-section reveal">What is actually built.</h2>
      <div class="mt40 stagger">
        <div class="row">
          <div class="row-k">The reference site <span class="pill done" style="margin-left:8px;"><span class="dot"></span>Live</span></div>
          <div class="row-v">14 pages on Cloudflare Pages. Tyre guide, TRA service-code matrix, tyre naming, mixing rules, a 40-term glossary, 8 failure modes and the AS4457:2019 summary. Free and ad-free.</div>
        </div>
        <div class="row">
          <div class="row-k">The Knowledge Portal <span class="pill done" style="margin-left:8px;"><span class="dot"></span>Live</span></div>
          <div class="row-v">Ask answers from the databook corpus with citations. Verified numbers are looked up from signed-off records or abstained on, never generated. Pricing and fleet-specific calls escalate to David.</div>
        </div>
        <div class="row">
          <div class="row-k">Market Notes <span class="pill done" style="margin-left:8px;"><span class="dot"></span>14 notes</span></div>
          <div class="row-v">Sourced editorial from February to July 2026, on market structure, tier economics, Pilbara supply, market size, autonomous haulage and industry consolidation. Figures attributed at the point of use.</div>
        </div>
        <div class="row">
          <div class="row-k">The corpus pipeline <span class="pill part" style="margin-left:8px;"><span class="dot"></span>Built, trial only</span></div>
          <div class="row-v">Python extraction and chunking into a Node ingest script and Vectorize, with dual-pass extraction, validation gates, source crops and a CSV review queue. The local trial ran without extraction keys, so it produced no servable records by design.</div>
        </div>
        <div class="row">
          <div class="row-k">The GEO stack <span class="pill done" style="margin-left:8px;"><span class="dot"></span>Live</span></div>
          <div class="row-v">llms.txt, robots.txt explicitly welcoming the major AI crawlers, Key facts blocks, question-shaped headings, and FAQPage and Organization JSON-LD across substantive pages.</div>
        </div>
        <div class="row">
          <div class="row-k">Tyre guide and tooling <span class="pill part" style="margin-left:8px;"><span class="dot"></span>Sample stage</span></div>
          <div class="row-v">26 tyre records against a stated 600+ rollout, one of seven calculators live, four programmatic SEO sample pages across sizes, machines and TRA codes.</div>
        </div>
      </div>
      <nav class="page-nav">
        <a class="pn-btn prev" href="#onapage"><span>Previous</span><strong>The 3D Process, on a page</strong></a>
        <a class="pn-btn next" href="#notdone"><span>Next</span><strong>What is not built</strong></a>
      </nav>
    </article>

    <!-- ── 06 WHAT IS NOT BUILT ── -->
    <article class="page" id="notdone">
      <div class="page-head"><span class="page-chip">In the interest of being straight</span><span class="page-count">06 / 10</span></div>
      <h2 class="h-section reveal">What is not built.</h2>
      <div class="mt40 stagger">
        <div class="gap-item"><span class="idx">01</span>Measurement.<span class="sub">Nothing tracks citations, enquiries or portal questions. The site was built to be cited and there is no way to tell whether it has been.</span></div>
        <div class="gap-item"><span class="idx">02</span>The catalogue.<span class="sub">26 tyre records live against a stated 600+. Six of seven calculators are marked coming soon. The programmatic SEO surface is four sample pages.</span></div>
        <div class="gap-item"><span class="idx">03</span>A real Track A run.<span class="sub">The extraction pipeline works, but the local trial ran in no-model fallback on a synthetic sample databook: 0 servable records, 5 in the review queue, 0% dual-pass agreement.</span></div>
        <div class="gap-item"><span class="idx">04</span>The answers.<span class="sub">None of the 22 CORE questions has been answered. Three of them are gaps the repository simply cannot fill: who the customers actually are, who the competing information sources are, and what success looks like.</span></div>
      </div>
      <p class="note mt28 reveal">The first three are stage boundaries. The fourth is the next move.</p>
      <nav class="page-nav">
        <a class="pn-btn prev" href="#delivered"><span>Previous</span><strong>What's in the set</strong></a>
        <a class="pn-btn next" href="#access"><span>Next</span><strong>Access and links</strong></a>
      </nav>
    </article>

    <!-- ── 07 ACCESS ── -->
    <article class="page" id="access">
      <div class="page-head"><span class="page-chip">Access</span><span class="page-count">07 / 10</span></div>
      <h2 class="h-section reveal">Four sheets. One password.</h2>
      <p class="body mt28 reveal">Each link opens right here inside the summary, with the sidebar kept in place. No new tabs. Every view has an "Open in new tab" option if you want a full window.</p>
      <div class="mt40 stagger">
        <a class="linkrow" href="/pack" data-view data-title="The four 3D Process sheets">
          <span class="lr-k">The four sheets</span>
          <span class="lr-v">3D on a page, Discover, Design and Deploy. Print or Save PDF from the bar at the top.</span>
          <span class="lr-go">&rarr;</span>
        </a>
        <a class="linkrow" href="https://otrearthmovertyres.com" data-view data-title="otrearthmovertyres.com">
          <span class="lr-k">The live site</span>
          <span class="lr-v">The reference itself: tyre guide, reference, calculators, market notes.</span>
          <span class="lr-go">&rarr;</span>
        </a>
        <a class="linkrow" href="https://otrearthmovertyres.com/ask.html" data-view data-title="The Knowledge Portal">
          <span class="lr-k">The Knowledge Portal</span>
          <span class="lr-v">Ask a technical OTR question and see the two-track answer model working.</span>
          <span class="lr-go">&rarr;</span>
        </a>
        <a class="linkrow" href="https://github.com/clentjewell/otr-eartmover" data-view data-title="The repository">
          <span class="lr-k">The repository</span>
          <span class="lr-v">The source everything on these sheets was read from, front end and backend.</span>
          <span class="lr-go">&rarr;</span>
        </a>
      </div>
      <p class="note mt28 reveal">The pack resolves within this same private site. If you open it in a fresh browser you will be asked for the password again.</p>
      <nav class="page-nav">
        <a class="pn-btn prev" href="#notdone"><span>Previous</span><strong>What is not built</strong></a>
        <a class="pn-btn next" href="#portal"><span>Next</span><strong>The Knowledge Portal</strong></a>
      </nav>
    </article>

    <!-- ── 08 THE KNOWLEDGE PORTAL ── -->
    <article class="page" id="portal">
      <div class="page-head"><span class="page-chip">The engine room</span><span class="page-count">08 / 10</span></div>
      <h2 class="h-section reveal">The Knowledge Portal.</h2>
      <p class="body mt28 reveal" style="max-width:680px;">The part of this build that competitors cannot copy quickly. A question goes to a Pages Function, which prefers the Cloudflare worker (Workers AI for embeddings, Vectorize for the corpus, D1 for verified specs) and falls back to a Supabase edge function holding the same contract. It is live in production today.</p>

      <div class="darkwrap mt40 reveal">
        <p class="eyebrow light" style="margin-bottom:20px;">A question through the portal</p>
        <div class="pc">
          <div class="pc-bar">
            <span class="tl"></span><span class="tl"></span><span class="tl"></span>
            <span class="url">otrearthmovertyres.com/ask.html</span>
          </div>
          <div class="pc-main">
            <p class="pc-eyebrow">Ask the Portal</p>
            <p class="pc-q">What is the recommended rim and inflation for 26.5R25?</p>
            <div class="pc-ask"><span>Ask a technical OTR tyre question</span><b>Ask &rarr;</b></div>
            <div class="pc-answer">
              <span class="pc-label">/ Verified spec</span>
              <p class="pc-lede">Served by exact lookup from a signed-off record, verbatim, with a language model never in the path.</p>
              <table class="pc-spec">
                <tr><th>TRA code</th><td>L-3</td></tr>
                <tr><th>Recommended rim</th><td>from the signed-off record</td></tr>
                <tr><th>Inflation</th><td>from the signed-off record</td></tr>
              </table>
              <p class="pc-body">If the record is not held, the portal abstains and escalates to David rather than generating a figure. That is the whole safety model in one behaviour.</p>
              <p class="pc-disc">Reference only, and it may be superseded. Confirm against current OEM data and qualified inspection before acting.</p>
            </div>
          </div>
        </div>
        <p class="note light" style="margin-top:14px;">A representation of the live portal. The two-track design and the abstention rule are as built.</p>
      </div>

      <div class="cols-3 mt40 stagger">
        <div>
          <div class="col-label">Two tracks that never cross</div>
          <div class="col-body">Verified numbers are looked up from signed-off records. Prose is retrieved and answered with citations. A spec question is never answered from prose.</div>
        </div>
        <div>
          <div class="col-label">Abstention by default</div>
          <div class="col-body">A record is servable only when it is high confidence, passes every validation gate, is signed off, and the run was committed. Everything else stays in the review queue.</div>
        </div>
        <div>
          <div class="col-label">Redundant by design</div>
          <div class="col-body">Two independent backends hold the same contract, so the portal keeps answering if the Cloudflare bindings are ever removed.</div>
        </div>
      </div>

      <nav class="page-nav">
        <a class="pn-btn prev" href="#access"><span>Previous</span><strong>Access and links</strong></a>
        <a class="pn-btn next" href="#ask"><span>Next</span><strong>Ask it anything</strong></a>
      </nav>
    </article>

    <!-- ── 09 ASK IT ANYTHING ── -->
    <article class="page" id="ask">
      <div class="page-head"><span class="page-chip">The trade read</span><span class="page-count">09 / 10</span></div>
      <h2 class="h-section reveal">Ask it anything.</h2>
      <p class="body mt28 reveal" style="max-width:660px;">Any databook holds the spec. What a databook will not tell you is which tyre to put on a 992K in the Pilbara, and that is the question buyers actually arrive with.</p>
      <div class="darkwrap mt40 reveal">
        <div class="cols-2" style="gap:clamp(32px,4vw,56px); align-items:start;">
          <div>
            <p class="body light" style="margin:0;">The answer below is the tone calibration example written into the system prompt in the repository. It is what a good answer is supposed to look like: specific, caveated, and honest that the choice depends on cycle, ambient and price tolerance rather than on which brand is best in the abstract.</p>
            <div class="rule dark mt28"></div>
            <p class="note light mt20" style="margin:0;">One source of truth. Every evaluative answer carries the OPINION label, and every answer carries the verify-against-OEM disclaimer.</p>
          </div>
          <div>
            <div class="pc">
              <div class="pc-main" style="padding:18px 20px 20px;">
                <p class="pc-eyebrow">Question</p>
                <p class="pc-q" style="font-size:15.5px;">What's the best tyre for a CAT 992K in iron ore?</p>
                <div class="pc-answer" style="margin-top:14px;">
                  <span class="pc-label">/ Opinion</span>
                  <p class="pc-lede">For a CAT 992K running iron ore in the Pilbara, the practical answer is a heat-resistant L-5 tyre in 45/65R45<span class="pc-cite">1</span><span class="pc-cite">2</span>.</p>
                  <p class="pc-body">Bridgestone VRDP is the long-running default and the broadest fitment history<span class="pc-cite">3</span>. Michelin XLD D2 L-5 and Goodyear RL-5L are credible tier-one alternatives<span class="pc-cite">4</span>. Yokohama RL5K+ usually delivers at better cost with comparable life<span class="pc-cite">5</span>.</p>
                  <p class="pc-body">The choice between them depends on cycle length, ambient temperature and price tolerance, not on which brand is best in the abstract.</p>
                  <div class="pc-sources">
                    <span class="pc-src">Manufacturer databooks</span>
                    <span class="pc-src">TRA Year Book</span>
                    <span class="pc-src">Jewell trading experience</span>
                  </div>
                </div>
              </div>
            </div>
            <p class="note light" style="margin-top:12px; text-align:center;">The documented example answer from worker/system-prompt.md.</p>
          </div>
        </div>
      </div>
      <nav class="page-nav">
        <a class="pn-btn prev" href="#portal"><span>Previous</span><strong>The Knowledge Portal</strong></a>
        <a class="pn-btn next" href="#next"><span>Next</span><strong>Next steps</strong></a>
      </nav>
    </article>

    <!-- ── 10 NEXT STEPS ── -->
    <article class="page" id="next">
      <div class="page-head"><span class="page-chip">Next steps</span><span class="page-count">10 / 10</span></div>
      <h2 class="h-section reveal">Three phases. Instrument, fill, convert.</h2>
      <p class="body mt28 reveal">The build is done and it runs. The next step is not more content. It is finding out whether the content already published is doing the job it was published to do, and that takes one session and some instrumentation.</p>

      <p class="eyebrow amber mt40 reveal" style="margin-bottom:2px;">Phase A &middot; Instrument it</p>
      <p class="note reveal" style="margin-top:0;">First &middot; before anything else is built</p>
      <div class="mt28 stagger">
        <div class="row"><div class="row-k">The CORE session</div><div class="row-v">Answer the 22 questions with Clent and David, starting with what counts as this site working. <strong style="color:var(--white);">A definition of done that Deploy can be measured against.</strong></div></div>
        <div class="row"><div class="row-k">Citation tracking</div><div class="row-v">A way to check whether the major answer engines quote the site, and on which questions. <strong style="color:var(--white);">Evidence that the GEO stack works, or does not.</strong></div></div>
        <div class="row"><div class="row-k">Portal logging</div><div class="row-v">Log questions asked, the abstention rate, and every escalation to David. <strong style="color:var(--white);">The best content brief available, written by buyers.</strong></div></div>
        <div class="row"><div class="row-k">Repository fixes</div><div class="row-v">Five contradictions found while reading, listed on the Deploy sheet. <strong style="color:var(--white);">Fixed before a buyer or a crawler finds them.</strong></div></div>
      </div>

      <p class="eyebrow amber mt40 reveal" style="margin-bottom:2px;">Phase B &middot; Fill the corpus</p>
      <p class="body reveal" style="margin-top:0;">Run the extraction pipeline on real databooks with keys set, work the review queue to signed-off records, extend the tyre guide and the programmatic surface, and decide the fate of the six unbuilt calculators. Exit test: the published figures match what the site actually holds, or the published figures change.</p>

      <p class="eyebrow amber mt40 reveal" style="margin-bottom:2px;">Phase C &middot; Convert it</p>
      <p class="body reveal" style="margin-top:0;">Make the path from a portal answer to a conversation with David explicit and tracked. Exit test: enquiries arriving through the site are attributed and worth more than the cost of running it.</p>

      <div class="mt40 stagger">
        <a class="linkrow" href="/pack#sop-deploy" data-view data-title="Deploy, on a page">
          <span class="lr-k">The Deploy sheet in full</span>
          <span class="lr-v">Every phase above with its exit test, the channel plan, the automation triage, and the five repository contradictions.</span>
          <span class="lr-go">&rarr;</span>
        </a>
      </div>
      <p class="note mt28 reveal">No dates attached to any of it. Timing gets set with you.</p>

      <div class="rule mt56 reveal"></div>
      <h2 class="h-hero mt40 reveal" style="font-size:clamp(44px,9vw,104px);">Be the source.</h2>
      <p class="body grey mt28 reveal">Clent Jewell &nbsp;&middot;&nbsp; <a href="mailto:clent@jewellprojects.com" style="color:var(--orange); text-decoration:none;">clent@jewellprojects.com</a></p>

      <nav class="page-nav">
        <a class="pn-btn prev" href="#ask"><span>Previous</span><strong>Ask it anything</strong></a>
        <a class="pn-btn next" href="#top"><span>Next</span><strong>Back to Welcome</strong></a>
      </nav>
    </article>

  </main>

  <section id="viewer" aria-label="Linked content">
    <div class="viewer-split" id="viewer-split" title="Drag to resize" aria-hidden="true"></div>
    <div class="viewer-bar">
      <button type="button" class="viewer-back" id="viewer-back"><span>&larr;</span> Back to summary</button>
      <span class="viewer-title" id="viewer-title"></span>
      <span class="viewer-spacer"></span>
      <a class="viewer-newtab" id="viewer-newtab" href="#" target="_blank" rel="noopener noreferrer">Open in new tab &#8599;</a>
    </div>
    <iframe class="viewer-frame" id="viewer-frame" title="Linked content"></iframe>
  </section>
</div>

<script>
(function(){
  var de = document.documentElement;

  var links = [].slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
  var sections = [].slice.call(document.querySelectorAll('.welcome, .page, .starthere'));

  function setActive(id){
    links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href').slice(1) === id); });
  }
  function spy(){
    var line = window.innerHeight * 0.35;
    var current = sections.length ? (sections[0].id || 'top') : 'top';
    for(var i = 0; i < sections.length; i++){
      if(sections[i].getBoundingClientRect().top <= line){ current = sections[i].id || 'top'; }
    }
    setActive(current);
  }

  var prog = document.getElementById('prog');
  function onScroll(){
    var max = de.scrollHeight - de.clientHeight;
    prog.style.width = (max > 0 ? (de.scrollTop / max) * 100 : 0) + '%';
    spy();
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Mobile contents toggle
  var toggle = document.getElementById('navtoggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function(){
      var collapsed = nav.classList.toggle('collapsed');
      toggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  // Reveal on scroll
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var revealables = [].slice.call(document.querySelectorAll('.reveal, .stagger'));
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    revealables.forEach(function(el){ io.observe(el); });

    var method = document.getElementById('method');
    if (method) {
      var mio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if (e.isIntersecting) { method.classList.add('run'); mio.unobserve(e.target); } });
      }, { threshold: 0.25 });
      mio.observe(method);
    }
  } else {
    revealables.forEach(function(el){ el.classList.add('in'); });
    var m = document.getElementById('method'); if (m) m.classList.add('run');
  }

  // Inline viewer: linked content opens in place, sidebar stays put.
  var frame = document.getElementById('viewer-frame');
  var vTitle = document.getElementById('viewer-title');
  var vNewtab = document.getElementById('viewer-newtab');
  var vBack = document.getElementById('viewer-back');

  function openViewer(href, title){
    frame.setAttribute('src', href);
    vTitle.textContent = title || '';
    vNewtab.setAttribute('href', href);
    de.classList.add('viewing');
    window.scrollTo(0, 0);
  }
  function closeViewer(){
    de.classList.remove('viewing');
    frame.setAttribute('src', 'about:blank');
  }

  document.querySelectorAll('[data-view]').forEach(function(a){
    a.addEventListener('click', function(ev){
      ev.preventDefault();
      openViewer(a.getAttribute('href'), a.getAttribute('data-title') || a.textContent.trim());
    });
  });
  vBack.addEventListener('click', closeViewer);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && de.classList.contains('viewing')) closeViewer();
  });

  // Drag to resize the viewer
  var split = document.getElementById('viewer-split');
  if (split) {
    var dragging = false;
    split.addEventListener('pointerdown', function(e){
      dragging = true; split.classList.add('dragging'); split.setPointerCapture(e.pointerId);
    });
    split.addEventListener('pointermove', function(e){
      if (!dragging) return;
      var w = Math.min(Math.max(window.innerWidth - e.clientX, 420), window.innerWidth - 120);
      de.style.setProperty('--viewer-w', w + 'px');
    });
    split.addEventListener('pointerup', function(e){
      dragging = false; split.classList.remove('dragging'); split.releasePointerCapture(e.pointerId);
    });
  }
})();
</script>
</body>
</html>`;
}
