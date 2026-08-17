// Brand marks, drawn inline so the pack carries no external requests.
//
// Both are reproductions of the supplied artwork, in the reverse-on-black state
// the brand manual sets as default ("white wordmark, orange roundel and full
// stop"). They are not the Gate 1 vector masters: those are still to be drawn
// from the original artwork, and the wordmark here is set in Archivo rather
// than the original outlined letterforms, which are not supplied as a font.
//
// Rules honoured from the manual, section 03:
//   - full lockup used whole at every size, no cropped icon
//   - never set in capitals, never without the full stop
//   - clear space of one lens diameter on all sides
//   - minimum 160px wide on screen

const ORANGE = '#FB8C1F';
const AMBER = '#FEC013';

// The OTR earthmovertyres.com lockup: badge frame, magnifier O, domain bar.
export function otrLogo({ width = 200, id = 'otr' } = {}) {
  return `<svg class="otr-logo" viewBox="0 0 480 300" width="${width}" role="img"
     aria-label="OTR earthmovertyres.com" focusable="false">
  <title>OTR earthmovertyres.com</title>
  <g fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linejoin="round">
    <path d="M52 96 L96 52 H384 L428 96 V204 L384 248 H96 L52 204 Z"/>
  </g>
  <g stroke="#FFFFFF" fill="none">
    <circle cx="139" cy="120" r="47" stroke-width="21"/>
    <path d="M107 154 L79 182" stroke-width="26" stroke-linecap="round"/>
  </g>
  <g stroke="${ORANGE}" fill="none" stroke-linecap="round">
    <path d="M112 133 A31 31 0 0 1 131 90" stroke-width="10"/>
    <circle cx="116" cy="146" r="5" stroke="none" fill="${ORANGE}"/>
  </g>
  <text x="196" y="163" fill="#FFFFFF" font-family="Archivo, 'Helvetica Neue', sans-serif"
        font-size="118" font-weight="800" letter-spacing="-4">TR</text>
  <rect x="150" y="180" width="254" height="48" rx="13" fill="#151515" stroke="#2C2C2C" stroke-width="1.5"/>
  <text x="164" y="213" font-family="Archivo, 'Helvetica Neue', sans-serif"
        font-size="27" font-weight="700" textLength="226" lengthAdjust="spacing">
    <tspan fill="#FFFFFF">earthmovertyres</tspan><tspan fill="${ORANGE}">.com</tspan>
  </text>
</svg>`;
}

// The Jewell Tyres tread mark. Endorsement use only, in Jewell safety amber.
export function jewellTread({ height = 30 } = {}) {
  const rows = [0, 16, 32, 48]
    .map((y) => `<path d="M1 ${y} H17 L29 ${y + 6} L17 ${y + 12} H1 L13 ${y + 6} Z"/>`)
    .join('');
  return `<svg class="jt-tread" viewBox="0 0 30 60" height="${height}" role="img"
     aria-label="Jewell Tyres" focusable="false"><g fill="${AMBER}">${rows}</g></svg>`;
}

// The full endorsement lockup: tread mark left, type right. Never leads, never
// outsizes the OTR wordmark, one per surface.
export function poweredByJewell({ height = 30, className = 'jt-endorse' } = {}) {
  return `<span class="${className}">${jewellTread({ height })}<span class="jt-type"><small>Powered by</small><b>Jewell Tyres</b></span></span>`;
}
