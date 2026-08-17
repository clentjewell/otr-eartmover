// The four 3D Process sheets: 3D on a page, Discover, Design, Deploy.

export function packPage() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>otrearthmovertyres.com &middot; 3D Process on a page</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{
    margin:0;
    /* Brand Identity v1, Aug 2026 - black ground, one high-vis orange */
    --sop-black:#0B0B0B;          /* ground, 60%. never pure #000 */
    --sop-s1:#151515;             /* surface 01: cards, tiles, table headers */
    --sop-s2:#1C1C1C;             /* surface 02: panels raised above s1 */
    --sop-hair:#2C2C2C;           /* all rules and borders. 1px, never heavier */
    --sop-white:#FFFFFF;          /* type, 30% */
    --sop-body:#9A9A9A;           /* body copy on dark */
    --sop-meta:#6E6E6E;           /* captions and metadata */
    --sop-orange:#FB8C1F;         /* brand accent, 10%. from the logo artwork */
    --sop-amber:#FEC013;          /* Jewell safety amber: endorsement only */
    --sop-fail:#FF8A80;
    --sop-pass:#4FBF6A;
    /* Type: one heavy grotesque, one mono, no third face */
    --sop-font-display:'Archivo','Helvetica Neue',system-ui,Helvetica,Arial,sans-serif;
    --sop-font-label:'Archivo','Helvetica Neue',system-ui,Helvetica,Arial,sans-serif;
    --sop-font-body:'Archivo','Helvetica Neue',system-ui,Helvetica,Arial,sans-serif;
    --sop-font-mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;
    --sop-radius:0;
    background:var(--sop-black);
    color:var(--sop-white);
    font-family:var(--sop-font-body);
    -webkit-font-smoothing:antialiased;
  }
  p,h1,h2,h3,h4,ul,ol,li{margin:0;padding:0}
  ul,ol{list-style:none}
  button{font:inherit;color:inherit;cursor:pointer}
  table{border-collapse:collapse}

  /* ================= PACK BAR ================= */
  .sop-bar{background:var(--sop-black);border-bottom:1px solid var(--sop-hair);position:sticky;top:0;z-index:20}
  .sop-bar-inner{max-width:1760px;margin-inline:auto;padding:11px clamp(14px,3vw,28px);
    display:flex;align-items:center;gap:12px 18px;flex-wrap:wrap}
  .sop-wordmark{display:inline-flex;align-items:baseline;gap:9px;white-space:nowrap}
  .sop-wordmark b{font-family:var(--sop-font-display);font-weight:800;font-size:15px;
    letter-spacing:-0.02em;color:var(--sop-white);text-transform:lowercase}
  .sop-wordmark b u{text-decoration:none;color:var(--sop-orange)}
  .sop-wordmark i{font-style:normal;font-family:var(--sop-font-label);font-size:8.5px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--sop-meta);border-left:1px solid var(--sop-hair);padding-left:9px;margin-left:9px}
  .sop-wordmark i em{font-style:normal;display:block;color:var(--sop-amber);font-size:10px;letter-spacing:.12em}
  .sop-wordmark span{font-family:var(--sop-font-label);font-size:11px;font-weight:500;color:var(--sop-meta)}
  .sop-pills{display:flex;flex-wrap:wrap;gap:6px;margin-inline:auto}
  .sop-pill{display:inline-flex;flex-direction:column;gap:1px;padding:6px 13px;
    border:1px solid var(--sop-hair);border-radius:999px;background:var(--sop-white);
    line-height:1.15;text-align:left;transition:border-color .2s ease,background-color .2s ease}
  .sop-pill-l{font-family:var(--sop-font-display);font-size:12.5px;font-weight:600;color:var(--sop-white)}
  .sop-pill-s{font-family:var(--sop-font-label);font-size:9px;font-weight:500;
    letter-spacing:.06em;text-transform:uppercase;color:var(--sop-meta)}
  .sop-pill:hover{border-color:rgba(191,110,27,.55);background:rgba(191,110,27,.06)}
  .sop-pill.is-current{border-color:var(--sop-orange);background:rgba(191,110,27,.1)}
  .sop-pill.is-current .sop-pill-l{color:var(--sop-orange)}
  .sop-print{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;padding:9px 15px;
    border:1px solid var(--sop-s2);border-radius:999px;background:var(--sop-s2);color:#fff;
    font-family:var(--sop-font-display);font-size:12.5px;font-weight:600}
  .sop-print span{font-family:var(--sop-font-mono);font-size:10px;opacity:.8;letter-spacing:.03em}
  .sop-print:hover{background:#000}

  /* ================= STAGE + SHEET ================= */
  .sop-stage{max-width:1760px;margin-inline:auto;
    padding:clamp(20px,3vw,40px) clamp(14px,3vw,28px) clamp(40px,6vw,72px);
    display:flex;flex-direction:column;gap:clamp(20px,3vw,36px)}
  .sop-sheet{scroll-margin-top:72px;background:var(--sop-s1);border:1px solid var(--sop-hair);
    border-radius:var(--sop-radius);box-shadow:none;
    width:100%;max-width:1720px;margin-inline:auto;padding:clamp(18px,2.4vw,34px);
    container-type:inline-size}

  /* ---- head / foot ---- */
  .sop-head{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;
    gap:10px 20px;padding-bottom:14px;margin-bottom:18px;border-bottom:2px solid var(--sop-white)}
  .sop-head-l{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
  .sop-mark{font-family:var(--sop-font-display);font-weight:800;font-size:13px;letter-spacing:-0.02em;
    text-transform:lowercase;color:var(--sop-white)}
  .sop-mark u{text-decoration:none;color:var(--sop-orange)}
  .sop-title{font-family:var(--sop-font-display);font-size:clamp(20px,2.3vw,30px);font-weight:700;
    letter-spacing:-0.025em;line-height:1.05}
  .sop-title em{font-style:normal;font-weight:500;text-transform:none;letter-spacing:-0.01em;color:var(--sop-meta)}
  .sop-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;justify-content:flex-end}
  .sop-tag{font-family:var(--sop-font-mono);font-size:10.5px;font-weight:500;letter-spacing:.06em;
    text-transform:uppercase;color:var(--sop-meta);background:var(--sop-s1);border:1px solid var(--sop-hair);
    border-radius:999px;padding:4px 11px;white-space:nowrap}
  .sop-tag.is-accent{color:var(--sop-orange);border-color:rgba(191,110,27,.45);background:rgba(191,110,27,.08)}
  .sop-mx{display:inline-flex;flex-direction:column;gap:1px;padding:2px 0 2px 13px;
    border-left:1px solid var(--sop-hair);white-space:nowrap;text-align:left}
  .sop-mx small{font-family:var(--sop-font-label);font-size:8px;font-weight:600;letter-spacing:.22em;
    text-transform:uppercase;color:var(--sop-meta)}
  .sop-mx b{font-family:var(--sop-font-label);font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--sop-amber)}

  .sop-foot{margin-top:20px;padding-top:14px;border-top:1px solid var(--sop-hair);
    display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:12px 24px;
    font-family:var(--sop-font-label);font-size:11px;font-weight:500;color:var(--sop-meta)}
  .sop-sign{display:flex;gap:24px;flex-wrap:wrap}
  .sop-sign span{display:inline-flex;min-width:150px;text-transform:uppercase;letter-spacing:.07em;
    font-size:10px;border-bottom:1px solid rgba(255,255,255,.3);padding-bottom:14px}
  .sop-foot-c{text-align:center;flex:1 1 auto}
  .sop-foot-r{text-transform:uppercase;letter-spacing:.07em;font-size:10px}

  /* ---- lede + labels ---- */
  .sop-lede{font-size:14px;line-height:1.65;color:rgba(255,255,255,.84);max-width:80ch;margin-bottom:20px}
  .sop-label{font-family:var(--sop-font-label);font-size:11px;font-weight:600;letter-spacing:.28em;
    text-transform:uppercase;color:var(--sop-orange);margin:4px 0 10px}

  /* ---- grid + cells ---- */
  .sop-block{margin-bottom:20px}
  .sop-cols{display:grid;gap:12px;grid-template-columns:1fr}
  @container (min-width:620px){
    .sop-cols.c2{grid-template-columns:repeat(2,1fr)}
    .sop-cols.c3{grid-template-columns:repeat(2,1fr)}
    .sop-cols.c4{grid-template-columns:repeat(2,1fr)}
  }
  @container (min-width:1000px){
    .sop-cols.c3{grid-template-columns:repeat(3,1fr)}
    .sop-cols.c4{grid-template-columns:repeat(4,1fr)}
  }
  .sop-cell{border:1px solid var(--sop-hair);border-top:2px solid var(--sop-orange);
    border-radius:0;background:rgba(191,110,27,.025);padding:14px 16px 16px}
  .sop-k{font-family:var(--sop-font-label);font-size:11px;font-weight:600;letter-spacing:.28em;
    text-transform:uppercase;color:var(--sop-orange);margin-bottom:8px}
  .sop-k.is-light{color:var(--sop-amber)}
  .sop-body{font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.86);margin-bottom:8px}
  .sop-body:last-child{margin-bottom:0}
  .sop-body.is-lead{font-size:15px;line-height:1.42;font-weight:500;color:var(--sop-white)}
  .sop-body strong{color:var(--sop-white);font-weight:600}
  .sop-status{display:inline-block;font-family:var(--sop-font-mono);font-size:10px;font-weight:400;
    color:var(--sop-meta);background:var(--sop-s1);border:1px solid var(--sop-hair);border-radius:999px;
    padding:3px 9px;margin-bottom:9px}
  .sop-note{font-family:var(--sop-font-label);font-size:10.5px;color:var(--sop-meta);margin-top:8px}

  /* chips */
  .sop-chips{display:flex;flex-wrap:wrap;gap:6px}
  .sop-chip{font-size:11px;font-weight:500;color:rgba(255,255,255,.82);background:rgba(191,110,27,.08);
    border:1px solid rgba(191,110,27,.22);border-radius:999px;padding:4px 11px}
  .sop-chip.is-arrow{background:rgba(191,110,27,.15);color:var(--sop-orange);border-color:rgba(191,110,27,.4)}

  /* CORE banner + drop-caps */
  .sop-core-banner{background:var(--sop-s2);color:#fff;border-radius:0;padding:9px 15px;
    margin-bottom:12px;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
  .sop-core-banner b{font-family:var(--sop-font-mono);font-size:11px;font-weight:500;letter-spacing:.08em;
    text-transform:uppercase;color:var(--sop-orange)}
  .sop-core-banner span{font-size:11.5px;color:rgba(255,255,255,.78)}
  .sop-core{display:flex;flex-direction:column}
  .sop-core-name{font-family:var(--sop-font-display);font-size:13px;font-weight:700;letter-spacing:.03em;
    text-transform:uppercase;color:var(--sop-white);margin-bottom:8px;display:flex;align-items:center}
  .sop-dropcap{font-family:var(--sop-font-display);font-size:30px;font-weight:700;line-height:.8;
    letter-spacing:-0.02em;color:var(--sop-orange);margin-right:3px}
  .sop-core-chip{margin-top:auto;align-self:flex-start;font-family:var(--sop-font-label);font-size:10px;
    font-weight:500;color:var(--sop-meta);border:1px solid var(--sop-hair);border-radius:0;padding:4px 8px}

  /* four-step flow */
  .sop-flow-col{border:1px solid var(--sop-hair);border-radius:0;padding:12px 14px 14px;background:var(--sop-s1)}
  .sop-flow-col.is-live{border-color:var(--sop-orange);background:rgba(191,110,27,.05)}
  .sop-flow-n{font-family:var(--sop-font-mono);font-size:10px;letter-spacing:.1em;color:rgba(191,110,27,.75)}
  .sop-flow-name{font-family:var(--sop-font-display);font-size:13px;font-weight:700;letter-spacing:.02em;
    text-transform:uppercase;color:var(--sop-white);margin:4px 0 6px}
  .sop-flow-name mark{background:var(--sop-orange);color:#fff;font-size:8.5px;font-family:var(--sop-font-label);
    font-weight:600;letter-spacing:.05em;padding:1px 6px;border-radius:999px;margin-left:6px;vertical-align:middle}
  .sop-flow-d{font-size:11.5px;line-height:1.45;color:rgba(255,255,255,.78)}

  /* funnel */
  .sop-funnel .sop-fcol{border:1px solid var(--sop-hair);border-radius:0;overflow:hidden;background:var(--sop-s1)}
  .sop-fcol-h{background:var(--sop-s2);color:#fff;font-family:var(--sop-font-label);font-size:10.5px;
    font-weight:600;letter-spacing:.09em;text-transform:uppercase;text-align:center;padding:7px 8px}
  .sop-fcol-d{font-size:11.5px;line-height:1.5;color:rgba(255,255,255,.8);padding:10px 12px 12px}

  .sop-engine-line{font-size:14px;font-weight:500;line-height:1.5;color:var(--sop-white);margin-bottom:14px;max-width:72ch}

  /* stat tiles */
  .sop-tiles{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
  .sop-tiles.is-tight{grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:8px}
  .sop-tile{border:1px solid var(--sop-hair);border-radius:0;background:var(--sop-s1);padding:12px 13px 13px}
  .sop-tile-l{font-family:var(--sop-font-body);font-size:11.5px;font-weight:600;color:var(--sop-white);
    margin-bottom:6px;line-height:1.3}
  .sop-tile-v{font-family:var(--sop-font-display);font-size:24px;font-weight:700;letter-spacing:-0.02em;
    color:var(--sop-orange);margin-bottom:5px;line-height:1}
  .sop-tile-v.is-pending{font-family:var(--sop-font-label);font-size:11px;font-weight:600;letter-spacing:.06em;
    text-transform:uppercase;color:var(--sop-meta)}
  .sop-tile-src{font-family:var(--sop-font-mono);font-size:9.5px;line-height:1.45;color:rgba(255,255,255,.6)}

  /* bullets, lists */
  .sop-bullets{display:grid;gap:6px}
  .sop-bullets li{font-size:12px;line-height:1.45;color:rgba(255,255,255,.82);padding-left:13px;position:relative}
  .sop-bullets li::before{content:"";position:absolute;left:0;top:6px;width:4px;height:4px;border-radius:50%;
    background:var(--sop-orange)}
  .sop-bullets strong{color:var(--sop-white);font-weight:600}
  .sop-bullets.is-light li{color:rgba(255,255,255,.84)}
  .sop-bullets.is-light li::before{background:var(--sop-amber)}
  .sop-bullets.is-light strong{color:#fff}

  .sop-deflist{display:grid;gap:7px;margin-bottom:10px}
  .sop-deflist li{font-size:12px;line-height:1.45;color:rgba(255,255,255,.8)}
  .sop-deflist strong{color:var(--sop-white);font-weight:600}

  .sop-next90{counter-reset:n;display:grid;gap:8px}
  .sop-next90 li{font-size:12px;line-height:1.45;color:rgba(255,255,255,.84);padding-left:22px;position:relative}
  .sop-next90 li::before{counter-increment:n;content:counter(n,decimal-leading-zero);position:absolute;left:0;top:0;
    font-family:var(--sop-font-mono);font-size:10px;font-weight:600;color:var(--sop-orange)}
  .sop-owner{display:block;font-family:var(--sop-font-label);font-size:10.5px;color:var(--sop-meta);margin-top:2px}

  .sop-killers{counter-reset:k;display:grid;gap:8px}
  .sop-killers li{font-size:12px;line-height:1.45;color:rgba(255,255,255,.84);padding-left:22px;position:relative}
  .sop-killers li::before{counter-increment:k;content:counter(k);position:absolute;left:0;top:1px;width:15px;height:15px;
    border-radius:50%;background:var(--sop-orange);color:#fff;font-family:var(--sop-font-mono);font-size:9px;
    display:grid;place-items:center}
  .sop-killers strong{color:var(--sop-white);font-weight:600;margin-right:3px}

  /* READY checklist */
  .sop-ready{display:grid;gap:9px}
  .sop-ready li{font-size:12px;line-height:1.4;color:rgba(255,255,255,.82);padding-left:22px;position:relative}
  .sop-ready strong{color:var(--sop-white);font-weight:600}
  .sop-ready .sop-status{margin:4px 0 0}
  .sop-ready-box{position:absolute;left:0;top:1px;width:13px;height:13px;border:1.5px solid var(--sop-orange);border-radius:0}

  /* personas */
  .sop-personas{display:grid;gap:8px}
  .sop-persona{border:1px solid var(--sop-hair);border-radius:0;padding:8px 10px;background:var(--sop-s1)}
  .sop-persona-n{font-family:var(--sop-font-display);font-size:12px;font-weight:700;color:var(--sop-white);margin-bottom:4px}
  .sop-persona-l{font-size:11px;line-height:1.4;color:rgba(255,255,255,.76);margin-bottom:4px}
  .sop-persona .sop-status{margin:0}

  /* mini table */
  .sop-table-wrap{overflow-x:auto}
  .sop-mini-t{width:100%;font-size:10.5px;font-family:var(--sop-font-body)}
  .sop-mini-t th{background:var(--sop-s2);color:#fff;font-family:var(--sop-font-label);font-size:9px;
    letter-spacing:.05em;text-transform:uppercase;font-weight:600;text-align:left;padding:6px 8px}
  .sop-mini-t td{border:1px solid var(--sop-hair);padding:6px 8px;color:rgba(255,255,255,.82);
    line-height:1.35;vertical-align:top}
  .sop-mini-t td strong{color:var(--sop-white);font-weight:600}

  /* dark gate cards */
  .sop-cell.is-dark{background:var(--sop-s2);border-color:transparent;border-top-color:var(--sop-amber);
    display:flex;flex-direction:column}
  .is-dark .sop-status{color:rgba(255,255,255,.72);background:transparent;border-color:rgba(255,255,255,.22)}
  .sop-gate-verdict{font-family:var(--sop-font-display);font-size:15px;font-weight:700;color:#fff;
    margin-bottom:8px;letter-spacing:-0.01em}
  .sop-gate-line{font-size:11px;line-height:1.42;color:rgba(255,255,255,.8);margin-bottom:6px}
  .sop-gate-line span{display:block;font-family:var(--sop-font-label);font-size:9px;font-weight:600;
    letter-spacing:.06em;text-transform:uppercase;color:var(--sop-amber);margin-bottom:1px}

  /* gates row (cross-links) */
  .sop-gates .sop-gate{display:flex;gap:11px;align-items:flex-start;text-align:left;width:100%;
    background:transparent;border:0;padding:0}
  .sop-gate-n{font-family:var(--sop-font-display);font-size:26px;font-weight:700;line-height:1;color:rgba(191,110,27,.5)}
  .sop-gate-body{display:flex;flex-direction:column;gap:3px}
  .sop-gate-name{font-family:var(--sop-font-display);font-size:12px;font-weight:700;letter-spacing:.03em;
    text-transform:uppercase;color:var(--sop-white)}
  .sop-gate-name em{font-style:normal;font-weight:400;color:var(--sop-orange)}
  .sop-gate-status{font-size:11.5px;line-height:1.42;color:rgba(255,255,255,.74)}
  .sop-gates .sop-gate:hover .sop-gate-name{color:var(--sop-orange)}

  /* strap */
  .sop-strap{border-left:3px solid var(--sop-orange);padding:4px 0 4px 16px}
  .sop-strap-k{font-family:var(--sop-font-label);font-size:11px;font-weight:600;letter-spacing:.11em;
    text-transform:uppercase;color:var(--sop-orange);margin-bottom:6px}
  .sop-strap-h{font-family:var(--sop-font-display);font-size:clamp(16px,1.9vw,22px);font-weight:600;
    line-height:1.28;letter-spacing:-0.015em;color:var(--sop-white);margin-bottom:8px}
  .sop-strap-sub{font-size:12.5px;line-height:1.5;color:var(--sop-meta)}

  /* swatches */
  .sop-swatches{display:flex;gap:8px;flex-wrap:wrap}
  .sop-swatch{display:flex;flex-direction:column;gap:4px;flex:1 1 60px}
  .sop-swatch-chip{height:30px;border-radius:0;border:1px solid var(--sop-hair)}
  .sop-swatch-l{font-family:var(--sop-font-label);font-size:8.5px;letter-spacing:.03em;text-transform:uppercase;
    color:var(--sop-meta);line-height:1.3}

  /* do / dont */
  .sop-dodont{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
  .sop-dd-k{font-family:var(--sop-font-label);font-size:10px;font-weight:600;letter-spacing:.08em;
    text-transform:uppercase;margin-bottom:5px}
  .sop-dd-k.is-do{color:var(--sop-orange)}
  .sop-dd-k.is-dont{color:rgba(255,255,255,.5)}

  /* band */
  .sop-band{background:var(--sop-s2);border-radius:0;padding:16px 18px}
  .sop-band-head{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:12px}
  .sop-band-verdict{font-family:var(--sop-font-display);font-size:16px;font-weight:700;color:#fff;letter-spacing:-0.01em}
  .sop-band-cols{display:grid;gap:16px;grid-template-columns:1fr}
  .sop-band-k{font-family:var(--sop-font-mono);font-size:10.5px;font-weight:500;letter-spacing:.08em;
    text-transform:uppercase;color:var(--sop-amber);margin-bottom:7px}
  @container (min-width:700px){.sop-band-cols{grid-template-columns:repeat(3,1fr)}}

  /* channels */
  .sop-channels{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(190px,1fr))}
  .sop-chan{border:1px solid var(--sop-hair);border-top:3px solid var(--sop-orange);border-radius:0;
    padding:10px 12px 12px;background:var(--sop-s1);display:flex;flex-direction:column}
  .sop-chan-k{font-family:var(--sop-font-mono);font-size:11px;font-weight:500;letter-spacing:.06em;
    text-transform:uppercase;color:var(--sop-white);margin-bottom:6px}
  .sop-chan-d{font-size:11.5px;line-height:1.4;color:rgba(255,255,255,.78);margin-bottom:10px}
  .sop-chan-kpi{margin:auto 0 0;font-family:var(--sop-font-label);font-size:10.5px;color:var(--sop-orange);
    border-top:1px solid var(--sop-hair);padding-top:7px}

  /* reveal */
  .sop-sheet[data-reveal]{opacity:0;transform:translateY(14px);transition:opacity .5s ease,transform .5s ease}
  .sop-sheet.is-in{opacity:1;transform:none}
  @media (prefers-reduced-motion:reduce){
    html{scroll-behavior:auto}
    .sop-sheet[data-reveal]{opacity:1;transform:none;transition:none}
  }

  /* ================= PRINT ================= */
  @page{size:A4 landscape;margin:8mm}
  @media print{
    .sop-bar{display:none !important}
    body{background:var(--sop-s1)}
    .sop-stage{max-width:none;padding:0;gap:0}
    .sop-sheet{box-shadow:none;border:1px solid #ddd;border-radius:0;max-width:none;margin:0;
      opacity:1 !important;transform:none !important;page-break-after:always;break-after:page}
    .sop-sheet:last-child{page-break-after:auto;break-after:auto}
    .sop-sheet,.sop-cell,.sop-chan,.sop-tile,.sop-fcol,.sop-flow-col,.sop-persona,.sop-band{break-inside:avoid}
    .sop-cols.c3{grid-template-columns:repeat(3,1fr) !important}
    .sop-cols.c4{grid-template-columns:repeat(4,1fr) !important}
    .sop-band-cols{grid-template-columns:repeat(3,1fr) !important}
  }
</style>
</head>
<body>

<!-- ================= PACK BAR ================= -->
<div class="sop-bar">
  <div class="sop-bar-inner">
    <span class="sop-wordmark"><b>otr earthmovertyres.com<u>.</u></b><i>Powered by<em>Jewell Tyres</em></i><span>3D Process on a Page</span></span>
    <nav class="sop-pills" aria-label="Pack sheets">
      <button type="button" class="sop-pill" data-target="sop-process"><span class="sop-pill-l">3D on a page</span><span class="sop-pill-s">The engagement</span></button>
      <button type="button" class="sop-pill" data-target="sop-discover"><span class="sop-pill-l">Discover</span><span class="sop-pill-s">Gate 1 &middot; read from source</span></button>
      <button type="button" class="sop-pill" data-target="sop-design"><span class="sop-pill-l">Design</span><span class="sop-pill-s">Gate 2 &middot; built</span></button>
      <button type="button" class="sop-pill" data-target="sop-deploy"><span class="sop-pill-l">Deploy</span><span class="sop-pill-s">Gate 3 &middot; part deployed</span></button>
    </nav>
    <button type="button" class="sop-print" data-sop-print>Print / Save PDF <span>(4 sheets)</span></button>
  </div>
</div>

<div class="sop-stage">

<!-- ============================ SHEET 1 &middot; THE 3D PROCESS ============================ -->
<section id="sop-process" class="sop-sheet" data-reveal>
  <header class="sop-head">
    <div class="sop-head-l">
      <span class="sop-mark">otr earthmovertyres.com<u>.</u></span>
      <h2 class="sop-title">The 3D Process <em>&middot; on a page</em></h2>
    </div>
    <div class="sop-meta">
      <span class="sop-tag is-accent">Read v01</span>
      <span class="sop-tag">From repository &middot; Aug 2026</span>
      <span class="sop-mx"><small>Powered by</small><b>Jewell Tyres</b></span>
    </div>
  </header>

  <p class="sop-lede">This is the whole otrearthmovertyres.com build on four printable sheets, in the same shape as the rest of the 3D Process work. One difference is worth stating up front. There was no discovery session for this one. The CORE was read out of the <strong>otr-eartmover</strong> repository, front end and backend, because the material was already there. Everything on these sheets is traceable to a file. Where the repository does not answer a CORE question, the sheet says so instead of filling the gap.</p>

  <!-- belief / position / constraint -->
  <div class="sop-cols c3 sop-block">
    <div class="sop-cell">
      <p class="sop-k">The belief</p>
      <span class="sop-status">Read from source</span>
      <p class="sop-body is-lead">otrearthmovertyres.com is an authority play, not a catalogue. The product being published is 50 years of trading judgement, given away free so that buyers and answer engines treat Jewell as the source.</p>
      <p class="sop-body">The site sells nothing. Its job is to be the reference a buyer reads before they buy, and the page a chatbot quotes when someone asks what fits a 992K.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-k">The position</p>
      <span class="sop-status">Read from source &middot; to confirm</span>
      <p class="sop-body">The independent, cross-brand OTR reference for Australia and New Zealand. Every manufacturer databook is single-brand, PDF-gated and not searchable across makers. This one reads across 19 brands and adds what the trade actually does.</p>
      <p class="sop-body">Independent means independent of manufacturers, not disinterested. Jewell trades the tyres, and the site says so.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-k">The constraint</p>
      <span class="sop-status">Read from source</span>
      <p class="sop-body">The frame is built and the content is thin. 26 tyre records live against a stated 600+ rollout, one of seven calculators, four programmatic SEO samples.</p>
      <p class="sop-body">The bigger constraint is measurement. Nothing in the repository records whether an answer engine has ever cited the site, which is the one outcome the whole strategy is aimed at.</p>
    </div>
  </div>

  <!-- four-step flow -->
  <p class="sop-label">Discover. Design. Deploy. Deepen.</p>
  <div class="sop-cols c4 sop-block">
    <div class="sop-flow-col"><span class="sop-flow-n">01</span><p class="sop-flow-name">Discover <mark>Read</mark></p><p class="sop-flow-d">CORE extracted from the repository rather than a session. Customers, Offering, Rivals and Expression all have evidence. Three gaps are named, not filled.</p></div>
    <div class="sop-flow-col is-live"><span class="sop-flow-n">02</span><p class="sop-flow-name">Design <mark>Built</mark></p><p class="sop-flow-d">The system exists and runs: the reference site, the Knowledge Portal, the two-track answer model and the corpus pipeline.</p></div>
    <div class="sop-flow-col is-live"><span class="sop-flow-n">03</span><p class="sop-flow-name">Deploy <mark>Part</mark></p><p class="sop-flow-d">Site and portal are live on Cloudflare. The corpus rollout, the calculators and the pSEO surface are sample-stage. No measurement in place.</p></div>
    <div class="sop-flow-col"><span class="sop-flow-n">04</span><p class="sop-flow-name">Deepen</p><p class="sop-flow-d">The loop exists in the pipeline, review queue in, new databooks out. It is not yet fed by what buyers actually ask. Not entered.</p></div>
  </div>

  <!-- CORE banner + drop-caps -->
  <div class="sop-core-banner"><b>The CORE</b><span>Customers &middot; Offering &middot; Rivals &middot; Expression: the shape of the business the 22 questions hang off.</span></div>
  <div class="sop-cols c4 sop-block">
    <div class="sop-cell sop-core">
      <p class="sop-core-name"><span class="sop-dropcap">C</span>ustomers</p>
      <p class="sop-body">Mine procurement (BHP, Rio, Fortescue, Glencore, Anglo American, South32 and contractors), civil fleets, ag and forestry, industrial fleets, and independent fitters using the site as their OTR back office. Australia and New Zealand, weighted to the Pilbara and Queensland coal.</p>
      <span class="sop-core-chip">Named in the brief, not researched</span>
    </div>
    <div class="sop-cell sop-core">
      <p class="sop-core-name"><span class="sop-dropcap">O</span>ffering</p>
      <p class="sop-body">A free, ad-free technical reference: tyre guide, TRA service-code matrix, mixing rules, glossary, failure modes, AS4457:2019 summary, calculators, 14 sourced market notes, and an Ask portal that answers from the databook corpus with citations.</p>
      <span class="sop-core-chip">Free reference, commercial tie declared</span>
    </div>
    <div class="sop-cell sop-core">
      <p class="sop-core-name"><span class="sop-dropcap">R</span>ivals</p>
      <p class="sop-body">The real rival is the manufacturer databook: authoritative, single-brand, behind a PDF, not cross-referenced. Behind that, tier-one supplier portals, and the answer engines themselves, which will cite somebody whether or not it is us.</p>
      <span class="sop-core-chip">No trader competitor named in repo</span>
    </div>
    <div class="sop-cell sop-core">
      <p class="sop-core-name"><span class="sop-dropcap">E</span>xpression</p>
      <p class="sop-body">Black ground and one high-vis orange, Archivo with IBM Plex Mono, Jewell amber reserved for the endorsement. The register is the trusted clinician: define, specify, cite the standard, and refer the judgement call to a trader rather than making it.</p>
      <span class="sop-core-chip">Reference. Plainly written.</span>
    </div>
  </div>

  <!-- the plan -->
  <p class="sop-label">The plan: earn the citation before chasing the traffic</p>
  <div class="sop-cols c3 sop-block sop-funnel">
    <div class="sop-fcol"><p class="sop-fcol-h">Phase A &middot; Instrument it</p><p class="sop-fcol-d">Put measurement on the one thing the strategy is aimed at. Exit test: we can say how many enquiries and how many answer-engine citations the site produced last month, from data rather than impression.</p></div>
    <div class="sop-fcol"><p class="sop-fcol-h">Phase B &middot; Fill the corpus</p><p class="sop-fcol-d">Close the gap between what the site claims and what it holds. Exit test: the tyre guide, the calculators and the pSEO surface match the numbers already published on the site, or the published numbers change.</p></div>
    <div class="sop-fcol"><p class="sop-fcol-h">Phase C &middot; Convert it</p><p class="sop-fcol-d">Turn reference traffic into trade enquiries for Jewell Tyres. Exit test: enquiries arriving through the OTR site are tracked, attributed and worth more than the cost of running it.</p></div>
  </div>

  <!-- decision + north star -->
  <div class="sop-cols c2 sop-block">
    <div class="sop-cell">
      <p class="sop-k">The decision</p>
      <p class="sop-body">Close the 22 CORE questions with Clent and David. Ten close Discover, six shape Design, six shape Deploy. They are written from the gaps the repository actually has, not from a template. The first one that matters: what counts as this site working.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-k">The north star</p>
      <p class="sop-body">Be the source. When a fleet engineer, a procurement officer or a chatbot needs an OTR answer in Australia, the answer comes from here and is attributed here. That is the asset, and it compounds in a way that a catalogue does not.</p>
    </div>
  </div>

  <!-- engine -->
  <p class="sop-label" style="margin-top:20px">Automated retrieval, human judgement</p>
  <p class="sop-engine-line">The portal does the retrieval. The trade keeps the judgement, and the numbers never come from a language model.</p>
  <div class="sop-cols c2 sop-block">
    <div class="sop-cell">
      <p class="sop-k">What the system does</p>
      <ul class="sop-bullets">
        <li>Embeds and retrieves from the databook corpus, then answers strictly from what it retrieved, with citations</li>
        <li>Serves verified numeric specs by exact lookup from signed-off records, verbatim</li>
        <li>Labels general guidance clearly when the corpus holds nothing, and never states a spec in that mode</li>
      </ul>
    </div>
    <div class="sop-cell">
      <p class="sop-k">What stays human</p>
      <ul class="sop-bullets">
        <li>The number. Specs are looked up or abstained on, never generated</li>
        <li>Price, and any fleet-specific call. Both decline and escalate to David direct</li>
        <li>The trade read: what actually fails in a Pilbara summer, and which mid-tier patterns earn their place</li>
      </ul>
    </div>
  </div>

  <!-- the numbers -->
  <p class="sop-label">The numbers <em style="font-style:normal;text-transform:none;letter-spacing:0;font-weight:400">(counted from the repository, August 2026)</em></p>
  <div class="sop-tiles sop-block">
    <div class="sop-tile"><p class="sop-tile-l">Brands covered</p><p class="sop-tile-v">19</p><p class="sop-tile-src">Tier 1 five, tier 2 ten, tier 3 four, per brands.html</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Tyre records live</p><p class="sop-tile-v">26</p><p class="sop-tile-src">In data/tyres.json, against a stated 600+ rollout</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Corpus chunks</p><p class="sop-tile-v">172</p><p class="sop-tile-src">First-party prose corpus, committed in the repo</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Calculators live</p><p class="sop-tile-v">1 of 7</p><p class="sop-tile-src">TKPH live, six marked coming soon</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Market notes</p><p class="sop-tile-v">14</p><p class="sop-tile-src">Sourced editorial, Feb to Jul 2026</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Programmatic SEO</p><p class="sop-tile-v">4</p><p class="sop-tile-src">Two sizes, one machine, one TRA code. Samples</p></div>
    <div class="sop-tile"><p class="sop-tile-l">AU OTR market</p><p class="sop-tile-v">$208m</p><p class="sop-tile-src">AUD, 2023, Credence Research, converted at AUD 1 = USD 0.65</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Citations earned</p><p class="sop-tile-v is-pending">Not measured</p><p class="sop-tile-src">No answer-engine tracking anywhere in the repo</p></div>
  </div>

  <!-- gates row -->
  <div class="sop-cols c3 sop-block sop-gates">
    <button type="button" class="sop-gate" data-target="sop-discover">
      <span class="sop-gate-n">01</span>
      <span class="sop-gate-body"><span class="sop-gate-name">Discover <em>&middot; Gate 1</em></span><span class="sop-gate-status">Read, not signed. The CORE is evidenced from the repository. Gate 1 closes when CQ01 to CQ10 are answered by Clent and David, and the three named gaps are filled.</span></span>
    </button>
    <button type="button" class="sop-gate" data-target="sop-design">
      <span class="sop-gate-n">02</span>
      <span class="sop-gate-body"><span class="sop-gate-name">Design <em>&middot; Gate 2</em></span><span class="sop-gate-status">Built and running, never reviewed. The system was designed and shipped before the CORE was written down. Gate 2 is a check back, not a first draft.</span></span>
    </button>
    <button type="button" class="sop-gate" data-target="sop-deploy">
      <span class="sop-gate-n">03</span>
      <span class="sop-gate-body"><span class="sop-gate-name">Deploy <em>&middot; Gate 3</em></span><span class="sop-gate-status">Partly deployed. Site and portal live, corpus and tooling at sample stage, no measurement. Gate 3 needs a definition of working before it can be signed.</span></span>
    </button>
  </div>

  <footer class="sop-foot">
    <div class="sop-sign"><span>Prepared by: Jewell Projects</span><span>Approved by</span><span>Date: Aug 2026 (Read v01)</span></div>
    <span class="sop-foot-c">The working single-page view of otrearthmovertyres.com's 3D Process.</span>
    <span class="sop-foot-r">otr earthmovertyres.com &middot; powered by Jewell Tyres</span>
  </footer>
</section>

<!-- ============================ SHEET 2 &middot; DISCOVER ============================ -->
<section id="sop-discover" class="sop-sheet" data-reveal>
  <header class="sop-head">
    <div class="sop-head-l">
      <span class="sop-mark">otr earthmovertyres.com<u>.</u></span>
      <h2 class="sop-title">Discover <em>&middot; on a page</em></h2>
    </div>
    <div class="sop-meta">
      <span class="sop-tag is-accent">Gate 1 &middot; read from source</span>
      <span class="sop-tag">Read v01 &middot; Aug 2026</span>
      <span class="sop-mx"><small>Powered by</small><b>Jewell Tyres</b></span>
    </div>
  </header>

  <!-- belief / ready -->
  <div class="sop-cols c2 sop-block">
    <div class="sop-cell">
      <p class="sop-k">The belief</p>
      <span class="sop-status">Read from source</span>
      <p class="sop-body is-lead">The knowledge is the asset. Jewell Tyres has spent 50 years collating manufacturer material to do its own trading job, and otrearthmovertyres.com publishes that working knowledge free, searchable and cross-brand.</p>
      <p class="sop-body">Founded by David Jewell in 1974 in Wodonga, Victoria, trading off-the-road tyres into mining, civil, ag, forestry and industrial fleets across Australia and New Zealand. The site's own words: the reference we wish had existed when we started.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Are you READY?</p>
      <ul class="sop-ready">
        <li><span class="sop-ready-box" aria-hidden="true"></span><strong>Resources:</strong> The build exists. Corpus rollout, market notes and review sign-off all sit with one or two people. <span class="sop-status">Open</span></li>
        <li><span class="sop-ready-box" aria-hidden="true"></span><strong>Executive buy-in:</strong> David is the named authority and the escalation endpoint on every declined answer. No record in the repo that he has reviewed the reference content. <span class="sop-status">Open</span></li>
        <li><span class="sop-ready-box" aria-hidden="true"></span><strong>Alignment:</strong> Clear and written down. Be the source that answer engines cite, using what only Jewell has. <span class="sop-status">Set</span></li>
        <li><span class="sop-ready-box" aria-hidden="true"></span><strong>Deadline:</strong> No dates in the repository beyond build dates. <span class="sop-status">Open</span></li>
        <li><span class="sop-ready-box" aria-hidden="true"></span><strong>Yes-criteria:</strong> Not defined anywhere. There is no stated measure of the site working. <span class="sop-status">Open</span></li>
      </ul>
    </div>
  </div>

  <!-- killer questions -->
  <p class="sop-label">The killer questions &middot; Discover (CQ01 to CQ10)</p>
  <div class="sop-cols c2 sop-block">
    <ol class="sop-killers">
      <li><strong>The buyer:</strong> Of the five audiences named in the build brief, which ones actually enquire today, and in what share?</li>
      <li><strong>The enquiry:</strong> What does an enquiry that came through the OTR site look like when it lands, and how is it different from one that comes to Jewell direct?</li>
      <li><strong>The question:</strong> What do buyers actually ask you, in their words, and how many of those does the portal already answer well?</li>
      <li><strong>The 600:</strong> The site says 600+ tyre records are rolling out and 26 are live. Where does the rest of that catalogue come from, and who enters it?</li>
      <li><strong>The databooks:</strong> Which of the 19 brands do we hold current, rights-clear databooks for, and which are stale?</li>
    </ol>
    <ol class="sop-killers" style="counter-reset:k 5">
      <li><strong>Working:</strong> What would prove this site works? An enquiry, a citation in a chatbot answer, or a name recognised on a call?</li>
      <li><strong>Rivals:</strong> Who else does an OTR buyer check before they call us, and is it a website, a rep, or a distributor?</li>
      <li><strong>The moat:</strong> Which parts of the reference could only come from Jewell, and which could anyone copy out of a databook?</li>
      <li><strong>Escalation:</strong> When the portal hands a question to David, what happens next, and is it recorded anywhere?</li>
      <li><strong>The line:</strong> What must the site never say, even when a buyer asks directly?</li>
    </ol>
  </div>

  <!-- CORE row -->
  <div class="sop-core-banner"><b>The CORE</b><span>The four questions Gate 1 has to answer. Evidence below is from the repository, front end and backend.</span></div>
  <div class="sop-cols c4 sop-block">
    <div class="sop-cell">
      <p class="sop-core-name"><span class="sop-dropcap">C</span>ustomers</p>
      <div class="sop-personas">
        <div class="sop-persona"><p class="sop-persona-n">Mine procurement</p><p class="sop-persona-l">BHP, Rio, Fortescue, Glencore, Anglo American, South32, plus contractors. WA iron ore first, Queensland coal second.</p><span class="sop-status">Named in brief &middot; not researched</span></div>
        <div class="sop-persona"><p class="sop-persona-n">Civil, ag, forestry, industrial fleets</p><p class="sop-persona-l">Construction fleets, agricultural and forestry operators, ports and material handling.</p><span class="sop-status">Named in brief</span></div>
        <div class="sop-persona"><p class="sop-persona-n">Independent fitters and dealers</p><p class="sop-persona-l">Local tyre retailers treating the site as their OTR back office. The clearest fit for a free cross-brand reference.</p><span class="sop-status">Named in brief</span></div>
      </div>
      <p class="sop-note">Gap: no customer research, interviews or traffic data exist in the repository. These are the audiences the brief targets, not audiences observed using the site.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-core-name"><span class="sop-dropcap">O</span>ffering</p>
      <span class="sop-status">Built &middot; verifiable</span>
      <p class="sop-body">Free and ad-free. Tyre guide across 19 brands and 24 inch to 63 inch rims. Reference: TRA service codes, tyre naming, mixing rules, a 40-term glossary, 8 failure modes, AS4457:2019. Calculators. 14 market notes. The Ask portal.</p>
      <div class="sop-chips"><span class="sop-chip is-arrow">Cross-brand</span><span class="sop-chip is-arrow">Free, no ads</span><span class="sop-chip is-arrow">Cited sources</span></div>
      <p class="sop-note">The only commercial tie is Jewell Tyres, which trades the tyres referenced. The site states this itself.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-core-name"><span class="sop-dropcap">R</span>ivals</p>
      <div class="sop-table-wrap">
        <table class="sop-mini-t">
          <thead><tr><th>Who</th><th>Their claim</th><th>Their weakness</th><th>Our response</th></tr></thead>
          <tbody>
            <tr><td><strong>Manufacturer databooks</strong></td><td>Authoritative spec data</td><td>Single-brand, PDF-gated, not searchable across makers</td><td>Cross-brand, searchable, free</td></tr>
            <tr><td><strong>Tier-one portals</strong></td><td>Data plus full service</td><td>Aligned to one maker, and consolidating (Bridgestone bought Otraco)</td><td>Independent of every maker</td></tr>
            <tr><td><strong>Answer engines</strong></td><td>Instant answers</td><td>No OTR corpus and no trade judgement of their own</td><td>Be the source they quote</td></tr>
            <tr><td><strong>Other traders</strong></td><td>Relationships</td><td>Not identified anywhere in the repository</td><td>Gap, not an answer</td></tr>
          </tbody>
        </table>
      </div>
      <p class="sop-note">Gap: the repository analyses tyre brands thoroughly and competing information sources not at all.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-core-name"><span class="sop-dropcap">E</span>xpression</p>
      <span class="sop-status">Brand Identity v1</span>
      <p class="sop-body">Brand Identity v1 (August 2026) sets it: black #0B0B0B ground at 60%, white type at 30%, one orange #FB8C1F at 10%, hairline rules at 1px, Archivo with IBM Plex Mono. Jewell amber #FEC013 is reserved for the endorsement so it does brand work in both directions. Voice is the trusted clinician: describe and specify, never recommend.</p>
      <div class="sop-chips"><span class="sop-chip">Opinion, not advice</span><span class="sop-chip">Sibling to Jewell Tyres</span><span class="sop-chip">Written for crawlers too</span></div>
    </div>
  </div>

  <!-- position / evidence / gate 1 -->
  <div class="sop-cols c3 sop-block">
    <div class="sop-cell">
      <p class="sop-k">The position</p>
      <span class="sop-status">Read from source &middot; to confirm</span>
      <p class="sop-body">The independent cross-brand OTR reference for Australia and New Zealand, published by a trader who has been in the market since 1974. The opportunity is a genuine information gap. The constraint is depth of content and absence of measurement, not the idea.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Evidence</p>
      <ul class="sop-bullets">
        <li>The premise is stated on the site itself: every databook is manufacturer-aligned, PDF-gated, not cross-referenced, and none tell you what the tyre next door does in the same application.</li>
        <li>Six named source families behind the corpus: databooks across 19 brands, the TRA Year Book, AS4457:2019, OEM fitment guides from seven machine makers, Tyre Stewardship Australia material, and 50 years of trading.</li>
        <li>Australia's OTR tyre market at about AUD 208 million in 2023 heading to about AUD 317 million by 2032, 4.78% CAGR, WA largest. Credence Research, cited and converted, not our data.</li>
        <li>The intent to be cited is explicit and technical: llms.txt maintained, robots.txt explicitly allowing GPTBot, ClaudeBot, PerplexityBot and the rest, Key facts blocks and FAQPage JSON-LD on substantive pages.</li>
      </ul>
    </div>
    <div class="sop-cell is-dark">
      <p class="sop-k is-light">Gate 1 decision</p>
      <p class="sop-gate-verdict">READ, NOT SIGNED</p>
      <p class="sop-gate-line"><span>Where it stands</span>CORE extracted from the repository instead of a discovery session, as agreed. Every claim on these sheets traces to a file. Nothing is asserted that the repository does not support.</p>
      <p class="sop-gate-line"><span>Still open</span>Three real gaps: no customer research, no analysis of competing information sources, and no definition of what success looks like. All 22 CQs unanswered.</p>
      <p class="sop-gate-line"><span>Required before Design signs</span>Answer CQ01 to CQ10 with Clent and David, and settle CQ06 first. Until working is defined, Deploy cannot be measured.</p>
    </div>
  </div>

  <footer class="sop-foot">
    <div class="sop-sign"><span>Prepared by: Jewell Projects</span><span>Approved by</span><span>Date: Aug 2026 (Read v01)</span></div>
    <span class="sop-foot-c">Discover &middot; Gate 1, read from source, pending sign-off.</span>
    <span class="sop-foot-r">otr earthmovertyres.com &middot; powered by Jewell Tyres</span>
  </footer>
</section>

<!-- ============================ SHEET 3 &middot; DESIGN ============================ -->
<section id="sop-design" class="sop-sheet" data-reveal>
  <header class="sop-head">
    <div class="sop-head-l">
      <span class="sop-mark">otr earthmovertyres.com<u>.</u></span>
      <h2 class="sop-title">Design <em>&middot; on a page</em></h2>
    </div>
    <div class="sop-meta">
      <span class="sop-tag is-accent">Gate 2 &middot; built, not reviewed</span>
      <span class="sop-tag">Read v01 &middot; Aug 2026</span>
      <span class="sop-mx"><small>Powered by</small><b>Jewell Tyres</b></span>
    </div>
  </header>

  <!-- strategy on a line -->
  <div class="sop-strap sop-block">
    <p class="sop-strap-k">Strategy on a line</p>
    <span class="sop-status">Built and running &middot; never reviewed against the CORE</span>
    <p class="sop-strap-h">Publish the trade knowledge that manufacturers cannot publish about each other, in the format an answer engine can quote, and let the citation do the selling.</p>
    <p class="sop-strap-sub">Every databook belongs to one maker. An independent trader who has traded all of them can say what none of them will, and that is the only content here a competitor cannot copy. The system was designed and shipped before this was written down. What follows is the design read back out of the build.</p>
  </div>

  <!-- brand / customer / model -->
  <div class="sop-cols c3 sop-block">
    <div class="sop-cell">
      <p class="sop-k">Brand</p>
      <span class="sop-status">Brand Identity v1 &middot; Aug 2026</span>
      <ul class="sop-deflist">
        <li><strong>Essence:</strong> A databook with a search bar, published by someone with no brand to defend.</li>
        <li><strong>Register:</strong> Reference-led and restrained. Calmer and more clinical than the Jewell Tyres site, which stays the warmer heritage brand.</li>
        <li><strong>Voice:</strong> Plain-spoken, trader to buyer. Answer first, qualify after. Australian English, no marketing-speak, no em dashes.</li>
      </ul>
      <div class="sop-swatches" style="margin-top:10px">
        <div class="sop-swatch"><span class="sop-swatch-chip" style="background:#0B0B0B"></span><span class="sop-swatch-l">Black 0B0B0B &middot; 60%</span></div>
        <div class="sop-swatch"><span class="sop-swatch-chip" style="background:#FFFFFF"></span><span class="sop-swatch-l">White &middot; 30%</span></div>
        <div class="sop-swatch"><span class="sop-swatch-chip" style="background:#FB8C1F"></span><span class="sop-swatch-l">Orange FB8C1F &middot; 10%</span></div>
        <div class="sop-swatch"><span class="sop-swatch-chip" style="background:#FEC013"></span><span class="sop-swatch-l">Amber FEC013 &middot; endorsement only</span></div>
        <div class="sop-swatch"><span class="sop-swatch-chip" style="background:#151515"></span><span class="sop-swatch-l">Surface 01</span></div>
        <div class="sop-swatch"><span class="sop-swatch-chip" style="background:#2C2C2C"></span><span class="sop-swatch-l">Hairline</span></div>
      </div>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Customer</p>
      <span class="sop-status">Assumed &middot; to validate</span>
      <div class="sop-personas">
        <div class="sop-persona"><p class="sop-persona-n">Designed for</p><p class="sop-persona-l">The buyer who does not know Jewell. The site's stated job is to let them learn before they buy, then funnel a qualified enquiry to Jewell Tyres.</p></div>
        <div class="sop-persona"><p class="sop-persona-n">Best-served today</p><p class="sop-persona-l">Independent fitters and smaller fleets, who get most from a free cross-brand reference and have no OEM account manager.</p></div>
        <div class="sop-persona"><p class="sop-persona-n">Key insight</p><p class="sop-persona-l">The buyer's real question is rarely a spec. It is which of these is the right call for my machine, in my conditions, and no databook answers that.</p></div>
      </div>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Business model</p>
      <span class="sop-status">Read from source &middot; to confirm</span>
      <ul class="sop-bullets">
        <li>Growth lever: authority, not advertising. The site carries no ads and sells nothing directly. It exists to make Jewell the obvious call.</li>
        <li>Sibling architecture: OTR is the technical authority, Jewell Tyres is the heritage trading brand and the operational home. One entity, one lead destination.</li>
        <li>Primary risk: publishing a number that is wrong. The design answer is that numbers are looked up, never generated, and abstention is the default.</li>
      </ul>
    </div>
  </div>

  <!-- messaging / platform / success -->
  <div class="sop-cols c3 sop-block">
    <div class="sop-cell">
      <p class="sop-k">Messaging</p>
      <span class="sop-status">Set &middot; enforced in the system prompt</span>
      <div class="sop-dodont">
        <div>
          <p class="sop-dd-k is-do">Do</p>
          <ul class="sop-bullets"><li>State the answer first, then the caveats.</li><li>Name specifics: pattern, size, TRA code, compound.</li><li>Say "I don't have that in my sources" when the corpus is thin.</li></ul>
        </div>
        <div>
          <p class="sop-dd-k is-dont">Don't</p>
          <ul class="sop-bullets"><li>Recommend a brand without application caveats.</li><li>Quote a price, ever. Decline and escalate.</li><li>Use industry-leading, world-class, cutting-edge, leverage.</li></ul>
        </div>
      </div>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Platform</p>
      <span class="sop-status">Built &middot; running</span>
      <ul class="sop-deflist">
        <li><strong>Site:</strong> Static pages on Cloudflare Pages. 14 top-level pages plus four programmatic SEO samples across sizes, machines and TRA codes.</li>
        <li><strong>Portal:</strong> ask.html to a Pages Function, which prefers the Cloudflare worker (Workers AI embeddings, Vectorize corpus, D1 for verified specs) and falls back to a Supabase edge function holding the same contract.</li>
        <li><strong>Pipeline:</strong> Databook PDFs into a Python extraction and chunking pipeline, out through a Node ingest script into Vectorize, with a CSV review queue as the human gate.</li>
      </ul>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Success measures</p>
      <div class="sop-tiles is-tight">
        <div class="sop-tile"><p class="sop-tile-v">19</p><p class="sop-tile-src">brands covered, hold and keep current</p></div>
        <div class="sop-tile"><p class="sop-tile-v">26</p><p class="sop-tile-src">tyre records live, against 600+ stated</p></div>
        <div class="sop-tile"><p class="sop-tile-v">1 of 7</p><p class="sop-tile-src">calculators live, six still to build</p></div>
        <div class="sop-tile"><p class="sop-tile-v is-pending">To set</p><p class="sop-tile-src">answer-engine citations, the stated goal</p></div>
        <div class="sop-tile"><p class="sop-tile-v is-pending">To set</p><p class="sop-tile-src">enquiries attributed to the OTR site</p></div>
        <div class="sop-tile"><p class="sop-tile-v is-pending">To set</p><p class="sop-tile-src">portal questions asked, and abstention rate</p></div>
      </div>
    </div>
  </div>

  <!-- design CORE questions -->
  <p class="sop-label">The CORE questions &middot; Design (CQ11 to CQ16)</p>
  <div class="sop-block">
    <ol class="sop-killers">
      <li><strong>Naming:</strong> Does otrearthmovertyres.com stay a separate brand, or converge on Jewell Tyres once it has authority of its own?</li>
      <li><strong>Depth or breadth:</strong> Finish the 600 record catalogue, or go deeper on fewer sizes with trade commentary a databook cannot match?</li>
      <li><strong>The calculators:</strong> Which of the six unbuilt calculators still earn their place, and which were an idea that has not survived contact?</li>
      <li><strong>Sign-off:</strong> What is the procedure for signing off a verified spec before it can be served, and who signs it?</li>
      <li><strong>Opinion:</strong> How far can the OPINION voice go before it becomes advice we carry liability for?</li>
      <li><strong>The portal's job:</strong> Is Ask a lead capture tool, a citation magnet, or a service to existing customers? It is currently built as all three.</li>
    </ol>
  </div>

  <!-- gate 2 band -->
  <div class="sop-band sop-block">
    <div class="sop-band-head">
      <p class="sop-k is-light">Gate 2 status</p>
      <p class="sop-band-verdict">Built and running, never reviewed</p>
    </div>
    <div class="sop-band-cols">
      <div>
        <p class="sop-band-k">Designed and shipped</p>
        <ul class="sop-bullets is-light"><li>Independent cross-brand reference over a manufacturer-aligned one.</li><li>Two-track answering: verified numbers looked up, prose retrieved and cited.</li><li>Answer-engine readiness treated as a first-class design requirement, not an afterthought.</li></ul>
      </div>
      <div>
        <p class="sop-band-k">Deploy inherits</p>
        <ul class="sop-bullets is-light"><li>A live site and a live portal on Cloudflare, with a Supabase fallback backend.</li><li>A corpus pipeline with a human review gate that has not yet run on real databooks locally.</li><li>A voice and liability frame that is documented and enforced in code.</li></ul>
      </div>
      <div>
        <p class="sop-band-k">Open decisions</p>
        <ul class="sop-bullets is-light"><li>CQ12 depth versus breadth, which decides what the next 12 months of content is.</li><li>CQ14 spec sign-off, which is what stands between the pipeline and served numbers.</li><li>CQ16 the portal's job, which decides what to measure in Deploy.</li></ul>
      </div>
    </div>
  </div>

  <footer class="sop-foot">
    <div class="sop-sign"><span>Prepared by: Jewell Projects</span><span>Approved by</span><span>Date: Aug 2026 (Read v01)</span></div>
    <span class="sop-foot-c">Design &middot; Gate 2, built and running, pending review.</span>
    <span class="sop-foot-r">otr earthmovertyres.com &middot; powered by Jewell Tyres</span>
  </footer>
</section>

<!-- ============================ SHEET 4 &middot; DEPLOY ============================ -->
<section id="sop-deploy" class="sop-sheet" data-reveal>
  <header class="sop-head">
    <div class="sop-head-l">
      <span class="sop-mark">otr earthmovertyres.com<u>.</u></span>
      <h2 class="sop-title">Deploy <em>&middot; on a page</em></h2>
    </div>
    <div class="sop-meta">
      <span class="sop-tag is-accent">Gate 3 &middot; partly deployed</span>
      <span class="sop-tag">Read v01 &middot; Aug 2026</span>
      <span class="sop-mx"><small>Powered by</small><b>Jewell Tyres</b></span>
    </div>
  </header>

  <!-- activation / cadence -->
  <div class="sop-cols c2 sop-block">
    <div class="sop-cell">
      <p class="sop-k">Activation at a glance</p>
      <p class="sop-body">Unlike the rest of the 3D Process work, Deploy here has already partly happened. The site is live on Cloudflare Pages, the Knowledge Portal answers from the real corpus in production, and the fallback backend is in place. What has not happened is the part that tells anyone whether it is working.</p>
      <ul class="sop-bullets"><li>Live: the reference site, the Ask portal, both answer backends.</li><li>Sample stage: the tyre catalogue, six calculators, the programmatic SEO surface.</li><li>Absent: any measurement of citations, enquiries or portal usage.</li></ul>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Cadence</p>
      <p class="sop-body">Three phases, no dates. Timing gets set with Clent and David once they have seen this sheet. Each phase has an exit test that must be met before the next starts.</p>
      <p class="sop-body"><strong>Sequence:</strong> Phase A instrument it, then Phase B fill the corpus, then Phase C convert it. Findings feed Deepen, which is the review queue and the next round of databook ingestion.</p>
      <p class="sop-note">Phase A comes first deliberately. Filling the corpus without measurement means more content and still no idea whether any of it lands.</p>
    </div>
  </div>

  <!-- launch sequence -->
  <p class="sop-label">Launch sequence &middot; objectives and exit tests</p>
  <div class="sop-cols c3 sop-block">
    <div class="sop-cell">
      <p class="sop-k">Phase A &middot; Instrument it</p>
      <p class="sop-body"><strong>Objective:</strong> know whether the strategy is working before spending more on it.</p>
      <p class="sop-body"><strong>Moves:</strong> track portal questions and abstention rate, log escalations to David, and set up a way to check whether the major answer engines cite the site.</p>
      <p class="sop-body"><strong>Exit test:</strong> we can state last month's citations, enquiries and portal questions from data, not impression.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Phase B &middot; Fill the corpus</p>
      <p class="sop-body"><strong>Objective:</strong> close the gap between what the site claims and what it holds.</p>
      <p class="sop-body"><strong>Moves:</strong> run the extraction pipeline on real databooks with extraction keys set, work the review queue to signed-off records, extend the tyre guide and the pSEO surface, decide the fate of the six unbuilt calculators.</p>
      <p class="sop-body"><strong>Exit test:</strong> the published figures on the site match what the site actually holds, or the published figures change.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Phase C &middot; Convert it</p>
      <p class="sop-body"><strong>Objective:</strong> turn reference readers into trade enquiries for Jewell Tyres.</p>
      <p class="sop-body"><strong>Moves:</strong> make the path from a portal answer to a conversation with David explicit and tracked, and tune the reference toward the questions that precede a purchase.</p>
      <p class="sop-body"><strong>Exit test:</strong> enquiries arriving through the OTR site are attributed and worth more than the cost of running it.</p>
    </div>
  </div>

  <!-- channels -->
  <p class="sop-label">Channel plan &middot; the site is the channel</p>
  <div class="sop-channels sop-block">
    <div class="sop-chan"><p class="sop-chan-k">Answer engines (lead)</p><p class="sop-chan-d">The declared primary channel. robots.txt explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot and the rest, and llms.txt tells them what the site is.</p><p class="sop-chan-kpi">Leads the mix &middot; unmeasured</p></div>
    <div class="sop-chan"><p class="sop-chan-k">Organic search</p><p class="sop-chan-d">Question-shaped headings, Key facts blocks, FAQPage and Organization JSON-LD, and a programmatic surface across sizes, machines and TRA codes.</p><p class="sop-chan-kpi">Four sample pages built</p></div>
    <div class="sop-chan"><p class="sop-chan-k">The Knowledge Portal</p><p class="sop-chan-d">The site's own answer surface, and the reason a buyer stays. Also the escalation path: declined questions go to David by name and number.</p><p class="sop-chan-kpi">Live in production</p></div>
    <div class="sop-chan"><p class="sop-chan-k">Market Notes</p><p class="sop-chan-d">Sourced editorial with figures attributed at the point of use. The material most likely to be quoted, because it holds numbers nobody else has written up for this market.</p><p class="sop-chan-kpi">14 notes published</p></div>
    <div class="sop-chan"><p class="sop-chan-k">Jewell Tyres</p><p class="sop-chan-d">The sibling site and the destination. OTR carries the authority, Jewell carries the trade relationship and the operational tooling.</p><p class="sop-chan-kpi">Funnel destination</p></div>
    <div class="sop-chan"><p class="sop-chan-k">David direct</p><p class="sop-chan-d">The human endpoint. Every pricing question, every fleet-specific call and every abstention lands here by design.</p><p class="sop-chan-kpi">Untracked today</p></div>
  </div>
  <p class="sop-note" style="margin-bottom:20px">No paid channel appears anywhere in the repository, and none is assumed here. CQ20 sets what is actually being spent.</p>

  <!-- automation triage -->
  <p class="sop-label">Automation triage &middot; never automate the number</p>
  <div class="sop-cols c3 sop-block">
    <div class="sop-cell">
      <p class="sop-k">Automate</p>
      <p class="sop-body">Retrieval, chunking, embedding, and prose answers composed strictly from retrieved context with citations. General guidance when the corpus holds nothing, clearly labelled as such.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Never automate</p>
      <p class="sop-body">The number. Load, rim, inflation and TKPH are served by exact lookup from signed-off records or abstained on. A language model is never in the path when a figure is returned. Pricing is declined outright.</p>
    </div>
    <div class="sop-cell">
      <p class="sop-k">High-control</p>
      <p class="sop-body">Mixing, repair and scrapping decisions, and anything AS4457 touches. The portal can point at the rule. It says to confirm against current OEM data and qualified inspection before acting, every time.</p>
    </div>
  </div>

  <!-- measurement -->
  <p class="sop-label">Measurement <em style="font-style:normal;text-transform:none;letter-spacing:0;font-weight:400">(baselines to establish, not results)</em></p>
  <div class="sop-tiles sop-block">
    <div class="sop-tile"><p class="sop-tile-l">Answer-engine citations</p><p class="sop-tile-v is-pending">To capture</p><p class="sop-tile-src">the stated goal of the whole GEO stack, currently unmeasured</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Enquiries via OTR</p><p class="sop-tile-v is-pending">To capture</p><p class="sop-tile-src">no attribution between the site and Jewell enquiries</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Portal questions</p><p class="sop-tile-v is-pending">To capture</p><p class="sop-tile-src">what buyers ask is the best content brief available</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Abstention rate</p><p class="sop-tile-v is-pending">To capture</p><p class="sop-tile-src">how often the corpus fails to answer, and on what</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Corpus coverage</p><p class="sop-tile-v">172</p><p class="sop-tile-src">first-party prose chunks committed, production index larger</p></div>
    <div class="sop-tile"><p class="sop-tile-l">Eval pass rate</p><p class="sop-tile-v">15</p><p class="sop-tile-src">queries written across three tiers, no scored run recorded</p></div>
  </div>

  <!-- deploy CORE questions -->
  <p class="sop-label">The CORE questions &middot; Deploy (CQ17 to CQ22)</p>
  <div class="sop-block">
    <ol class="sop-killers">
      <li><strong>Measurement:</strong> What gets instrumented first, given nothing is tracked today?</li>
      <li><strong>Corpus cadence:</strong> Who re-ingests when a manufacturer publishes a new databook, and how often does that need to happen?</li>
      <li><strong>Two backends:</strong> Does Cloudflare stay primary with Supabase as the fallback, or does one get retired to halve the maintenance?</li>
      <li><strong>Spend:</strong> What is this actually costing to run, and what does a portal query cost at volume?</li>
      <li><strong>Publication rhythm:</strong> Market Notes is 14 notes deep. What is the sustainable rate, and who writes them?</li>
      <li><strong>The handover:</strong> If Clent stops working on this tomorrow, what breaks first, and who picks it up?</li>
    </ol>
  </div>

  <!-- risks / next moves / gate 3 -->
  <div class="sop-cols c3 sop-block">
    <div class="sop-cell">
      <p class="sop-k">Risks and mitigations</p>
      <ul class="sop-bullets">
        <li>A wrong number reaches a buyer. Mitigation is already designed in: specs are looked up or abstained on, never generated, and every answer carries the verify-against-OEM disclaimer.</li>
        <li>The site's published figures overstate what it holds. Mitigation: Phase B closes the gap, or the figures come down.</li>
        <li>Effort compounds with nothing to show. Mitigation: Phase A precedes Phase B deliberately.</li>
        <li>Key-person dependency on content and sign-off. Mitigation: CQ22, answered before it is tested by circumstance.</li>
      </ul>
    </div>
    <div class="sop-cell">
      <p class="sop-k">Next moves</p>
      <ol class="sop-next90">
        <li>Run the CORE session with Clent and David. Settle CQ06 first, because it defines everything Phase A measures.<span class="sop-owner">Jewell &middot; next sitting</span></li>
        <li>Fix the repository inconsistencies listed at the foot of this sheet before they reach a buyer.<span class="sop-owner">Jewell</span></li>
        <li>Set Phase A scope and its exit test, then instrument.<span class="sop-owner">Jewell &middot; Clent</span></li>
      </ol>
      <p class="sop-note">Found while reading the repository, all verifiable: wrangler.toml still routes on an old domain variant that CLAUDE.md says was swept out; the D1 SPECS binding is commented out in config while RAG-GO-LIVE.md records it live in production; index.html still badges the portal DEMO MODE though it is live; the worker system prompt says since 1975 while the site says 1974, and permits en dashes that the house rules ban. Sixth, Brand Identity v1 adopts Archivo on a black #0B0B0B ground with orange #FB8C1F, while css/main.css still ships Helvetica Neue on graphite with amber #BF6E1B, so the built site does not match its current brand book. Seventh, and the one worth deciding first: Brand Identity v1 makes the reference platform a trusted clinician that never offers an opinion, while CLAUDE.md and the live Ask portal are built on the opposite, an OPINION label on every evaluative answer.</p>
    </div>
    <div class="sop-cell is-dark">
      <p class="sop-k is-light">Gate 3 status</p>
      <p class="sop-gate-verdict">Partly deployed</p>
      <p class="sop-gate-line"><span>Where it stands</span>Site and portal live in production. Corpus, calculators and programmatic surface at sample stage. The local extraction trial ran without extraction keys, so it produced no servable records, by design.</p>
      <p class="sop-gate-line"><span>Gates on</span>Phase A exit test met before Phase B spending; verified specs signed off before they are served; every abstention rule held as the corpus grows.</p>
      <p class="sop-gate-line"><span>Next</span>The CORE session, then define working, then instrument. Gate 3 cannot be signed against an undefined outcome.</p>
    </div>
  </div>

  <footer class="sop-foot">
    <div class="sop-sign"><span>Prepared by: Jewell Projects</span><span>Approved by</span><span>Date: Aug 2026 (Read v01)</span></div>
    <span class="sop-foot-c">Deploy &middot; Gate 3, partly deployed, pending definition of done.</span>
    <span class="sop-foot-r">otr earthmovertyres.com &middot; powered by Jewell Tyres</span>
  </footer>
</section>

</div>

<script>
(function(){
  function init(){
    var pills=Array.prototype.slice.call(document.querySelectorAll('.sop-pill[data-target]'));
    var sheets=Array.prototype.slice.call(document.querySelectorAll('.sop-sheet[id]'));

    function scrollToId(id){
      var el=document.getElementById(id);
      if(el){el.scrollIntoView({behavior:'smooth',block:'start'});}
    }

    pills.forEach(function(p){
      p.addEventListener('click',function(){scrollToId(p.getAttribute('data-target'));});
    });

    document.querySelectorAll('.sop-gate[data-target]').forEach(function(g){
      g.addEventListener('click',function(){scrollToId(g.getAttribute('data-target'));});
    });

    document.querySelectorAll('[data-sop-print]').forEach(function(b){
      b.addEventListener('click',function(){window.print();});
    });

    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if('IntersectionObserver' in window){
      var setCurrent=function(id){
        pills.forEach(function(p){p.classList.toggle('is-current',p.getAttribute('data-target')===id);});
      };
      var navIo=new IntersectionObserver(function(entries){
        entries.filter(function(e){return e.isIntersecting;})
          .sort(function(a,b){return a.boundingClientRect.top-b.boundingClientRect.top;})
          .forEach(function(e){setCurrent(e.target.id);});
      },{rootMargin:'-100px 0px -55% 0px',threshold:0});
      sheets.forEach(function(s){navIo.observe(s);});

      if(!reduce){
        var revIo=new IntersectionObserver(function(entries){
          entries.forEach(function(e){
            if(e.isIntersecting){e.target.classList.add('is-in');revIo.unobserve(e.target);}
          });
        },{rootMargin:'0px 0px -8% 0px',threshold:0.05});
        sheets.forEach(function(s){revIo.observe(s);});
      }else{
        sheets.forEach(function(s){s.classList.add('is-in');});
      }
    }else{
      sheets.forEach(function(s){s.classList.add('is-in');});
    }
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
</script>
</body>
</html>`;
}
