/* OTR Earthmover Tyre, shared layout injection.
   Auto-detects subfolder depth so layout works from root or /tyres/, /sizes/, /machines/, /tra/. */

(function() {
  const here = window.location.pathname;
  const inSubfolder = /\/(tyres|machines|sizes|tra)\//.test(here);
  const P = inSubfolder ? '../' : '';

  function isActive(href) {
    const cleanHere = here.replace(/^.*\//, '').replace(/\.html$/, '') || 'index';
    const cleanHref = href.replace(/^.*\//, '').replace(/\.html$/, '') || 'index';
    return cleanHere === cleanHref ? ' class="is-active"' : '';
  }

  const header = `
    <header class="site-header">
      <div class="container">
        <div class="site-header__main">
          <a href="${P}index.html" class="site-header__logo" aria-label="OTR Earthmover Tyre home">
            <img class="site-header__logo-img site-header__logo-img--light" src="${P}public/img/otr-logo-light.png" alt="OTR Earthmover Tyre" width="184" height="46">
            <img class="site-header__logo-img site-header__logo-img--dark" src="${P}public/img/otr-logo-dark.png" alt="" aria-hidden="true" width="184" height="46">
          </a>
          <nav class="site-nav" aria-label="Primary">
            <a href="${P}index.html"${isActive('index.html')}>Home</a>
            <a href="${P}ask.html"${isActive('ask.html')}>Ask</a>
            <a href="${P}tyres.html"${isActive('tyres.html')}>Tyre Guide</a>
            <a href="${P}calculators.html"${isActive('calculators.html')}>Calculators</a>
            <a href="${P}reference.html"${isActive('reference.html')}>Reference</a>
            <a href="${P}faq.html"${isActive('faq.html')}>FAQ</a>
            <a href="${P}resources.html"${isActive('resources.html')}>Resources</a>
            <a href="${P}market-notes.html"${isActive('market-notes.html')}>Market Notes</a>
            <a href="${P}news.html"${isActive('news.html')}>News</a>
          </nav>
          <a href="${P}contact.html" class="btn btn--small site-header__cta">Contact</a>
          <button class="mobile-toggle" aria-label="Open menu" onclick="document.querySelector('.mobile-menu').classList.toggle('is-open')">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <nav class="mobile-menu" aria-label="Mobile">
        <div class="container">
          <a href="${P}index.html">Home</a>
          <a href="${P}ask.html">Ask the Portal</a>
          <a href="${P}tyres.html">Tyre Guide</a>
          <a href="${P}calculators.html">Calculators</a>
          <a href="${P}reference.html">Reference</a>
          <a href="${P}faq.html">FAQ</a>
          <a href="${P}resources.html">Resources</a>
          <a href="${P}market-notes.html">Market Notes</a>
          <a href="${P}news.html">News</a>
          <a href="${P}about.html">About</a>
          <a href="${P}contact.html">Contact</a>
          <a href="https://jewelltyres.com.au">Jewell Tyres® ↗</a>
        </div>
      </nav>
    </header>
  `;

  const footer = `
    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__main">
          <div class="site-footer__col">
            <a href="${P}index.html" class="site-footer__brand" aria-label="OTR Earthmover Tyre home"><img class="site-footer__brand-img" src="${P}public/img/otr-logo-light.png" alt="OTR Earthmover Tyre" width="208" height="52"></a>
            <p style="color: var(--otr-fog); font-size: 0.92rem; max-width: 320px; margin-top: 1rem;">
              The independent technical reference for off-the-road earthmover tyres. Free to use. Maintained by Jewell Tyres.
            </p>
            <div class="site-footer__endorse">◆ POWERED BY JEWELL TYRES</div>
          </div>
          <div class="site-footer__col">
            <h4>Reference</h4>
            <ul>
              <li><a href="${P}tyres.html">Tyre Guide</a></li>
              <li><a href="${P}reference.html">TRA Codes</a></li>
              <li><a href="${P}reference.html#glossary">Glossary</a></li>
              <li><a href="${P}reference.html#mixing">Mixing Rules</a></li>
              <li><a href="${P}calculators.html">Calculators</a></li>
            </ul>
          </div>
          <div class="site-footer__col">
            <h4>Editorial</h4>
            <ul>
              <li><a href="${P}market-notes.html">Market Notes</a></li>
              <li><a href="${P}news.html">Daily Intelligence</a></li>
              <li><a href="${P}ask.html">Ask the Portal</a></li>
            </ul>
          </div>
          <div class="site-footer__col">
            <h4>Trading</h4>
            <ul>
              <li><a href="https://jewelltyres.com.au">Jewell Tyres® ↗</a></li>
              <li><a href="https://jewelltyres.com.au/buy-tyres.html">Buy tyres ↗</a></li>
              <li><a href="https://jewelltyres.com.au/sell-tyres.html">Sell tyres ↗</a></li>
              <li><a href="tel:+61419358439">David: +61 (0)419358439</a></li>
            </ul>
          </div>
        </div>
        <div class="container" style="padding-block: var(--s-3); border-top: 1px solid var(--otr-rule); font-size: 0.82rem; line-height: 1.55; color: var(--otr-fog); max-width: 900px;">
          General technical reference and independent opinion only, not engineering advice. This site is maintained by Jewell Tyres, an independent trader, not a tyre engineer or manufacturer. Specifications, fitments, pressures, load ratings and calculator results are indicative and can be out of date; confirm against current manufacturer data, AS4457:2019 and qualified inspection before any fitment, loading, inflation or operating decision. To the maximum extent permitted by law, Jewell Tyres accepts no liability for reliance on this information; nothing here excludes rights that cannot be excluded under the Australian Consumer Law. See <a href="${P}legal.html">Legal</a>.
        </div>
        <div class="container site-footer__legal">
          <span>© ${new Date().getFullYear()} OTREARTHMOVERTYRES.COM · Maintained by Jewell Tyres</span>
          <span><a href="${P}about.html">About</a> · <a href="${P}contact.html">Contact</a> · <a href="${P}legal.html">Legal</a></span>
        </div>
        <div class="container" style="padding-block: var(--s-3); border-top: 1px solid var(--otr-rule); font-family: var(--otr-mono); font-size: 0.68rem; letter-spacing: 0.08em; color: var(--otr-steel-light); text-transform: uppercase;">
          JEWELL TYRES® is a registered trade mark of Jewell Tyres. OTREARTHMOVERTYRES.COM operates as an independent technical reference site maintained by Jewell Tyres.
        </div>
      </div>
    </footer>
  `;

  const h = document.getElementById('site-header-placeholder');
  if (h) h.outerHTML = header;
  const f = document.getElementById('site-footer-placeholder');
  if (f) f.outerHTML = footer;

  // Favicon, injected here so every page gets it without touching 18 heads.
  // Dark tile, yellow tyre ring, matches the brand chrome.
  if (!document.querySelector('link[rel="icon"]')) {
    const fav = document.createElement('link');
    fav.rel = 'icon';
    fav.type = 'image/svg+xml';
    fav.href = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" rx="12" fill="#111111"/>' +
      '<circle cx="32" cy="32" r="18" fill="none" stroke="#F5B301" stroke-width="7"/>' +
      '<circle cx="32" cy="32" r="6" fill="#F5B301"/></svg>'
    );
    document.head.appendChild(fav);
  }

  /* Transparent, adaptive header.
     - Publishes the live header height as --header-h (the hero pulls up under it).
     - Samples the background directly behind the header and flips text colour:
       light text on dark sections, dark text on light sections.
     - Adds a frosted tint once the page is scrolled so text stays legible.
     Active/current nav links remain the amber accent in both modes. */
  (function initAdaptiveHeader() {
    const headerEl = document.querySelector('.site-header');
    if (!headerEl) return;
    const root = document.documentElement;
    let ticking = false;
    let lastY = window.scrollY;

    function luminanceOf(color) {
      const m = color && color.match(/[\d.]+/g);
      if (!m || m.length < 3) return null;
      const alpha = m.length >= 4 ? parseFloat(m[3]) : 1;
      if (alpha < 0.25) return null; // too transparent to judge
      return (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
    }

    function update() {
      ticking = false;
      const hgt = headerEl.offsetHeight;
      const y = window.scrollY;
      root.style.setProperty('--header-h', hgt + 'px');
      headerEl.classList.toggle('is-scrolled', y > 8);

      // Hide on scroll-down (past the header), reveal on scroll-up. Always show
      // near the top, and never hide while the mobile menu is open.
      const menuOpen = document.querySelector('.mobile-menu.is-open');
      if (y <= hgt || menuOpen) {
        headerEl.classList.remove('is-hidden');
      } else if (y > lastY + 4) {
        headerEl.classList.add('is-hidden');
      } else if (y < lastY - 4) {
        headerEl.classList.remove('is-hidden');
      }
      lastY = y;

      headerEl.style.pointerEvents = 'none';
      let node = document.elementFromPoint(Math.round(window.innerWidth / 2), hgt + 4);
      headerEl.style.pointerEvents = '';

      let lum = null;
      while (node && node !== document.documentElement) {
        const l = luminanceOf(getComputedStyle(node).backgroundColor);
        if (l !== null) { lum = l; break; }
        node = node.parentElement;
      }
      if (lum === null) lum = luminanceOf(getComputedStyle(document.body).backgroundColor) || 0;
      headerEl.classList.toggle('is-light', lum > 0.6);
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* Material-style click ripple on the portal controls and primary buttons. */
  (function initRipples() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.addEventListener('click', function (e) {
      const el = e.target.closest('.portal__btn, .portal__suggestion, .btn');
      if (!el) return;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.style.overflow = 'hidden';
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size / 2) + 'px';
      span.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(span);
      setTimeout(function () { span.remove(); }, 600);
    }, true);
  })();

  /* Background video autoplay (Ask / portal pages). Muted-as-property + retries
     + an interaction fallback if the browser blocks autoplay. */
  (function initBgVideo() {
    /* index.html drives its own .hero__video (with a play button); elsewhere we
       handle .hero__video and .portal__video here. */
    var onIndex = /(^|\/)(index\.html)?$/.test(location.pathname);
    var sel = onIndex ? 'video.portal__video' : 'video.portal__video, video.hero__video';
    var vids = document.querySelectorAll(sel);
    if (!vids.length) return;
    vids.forEach(function (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute('muted', '');
      function startOnInteraction() {
        var resume = function () {
          v.play().catch(function () {});
          ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach(function (ev) {
            window.removeEventListener(ev, resume);
          });
        };
        ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach(function (ev) {
          window.addEventListener(ev, resume, { passive: true });
        });
      }
      function tryPlay() {
        var p = v.play();
        if (p && p.catch) p.catch(startOnInteraction);
      }
      v.addEventListener('loadeddata', tryPlay);
      v.addEventListener('canplay', tryPlay);
      if (v.readyState >= 2) tryPlay();
      tryPlay();
    });
  })();

  /* Scroll reveal, fade/translate elements marked [data-reveal] into view. */
  (function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();
})();
