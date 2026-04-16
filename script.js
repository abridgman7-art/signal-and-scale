/* =========================================================
   Signal & Scale — interactivity
   ========================================================= */

/* ---------- Mobile nav toggle ---------- */
(function () {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.setAttribute('data-open', String(!open));
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('data-open', 'false');
    })
  );
})();

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Scroll reveal ---------- */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
})();

/* ---------- Animated stat counters ---------- */
(function () {
  const nums = document.querySelectorAll('.stat__num[data-count]');
  if (!nums.length || !('IntersectionObserver' in window)) return;
  const fmt = (n, decimals) => (decimals ? n.toFixed(decimals) : Math.round(n).toString());
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt(end * eased, decimals) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = fmt(end, decimals) + suffix;
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach((n) => io.observe(n));
})();

/* ---------- Services tabs ---------- */
(function () {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabs.length) return;

  function activate(id) {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === id)));
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === id));
  }
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const arr = Array.from(tabs);
      const i = arr.indexOf(tab);
      const next = arr[(i + (e.key === 'ArrowDown' ? 1 : -1) + arr.length) % arr.length];
      next.focus(); next.click();
    });
  });
})();

/* ---------- Growth calculator ---------- */
(function () {
  const visitors = document.getElementById('visitors');
  const conv     = document.getElementById('conv');
  const value    = document.getElementById('value');
  const industry = document.getElementById('industry');
  if (!visitors) return;

  const vOut = document.getElementById('visitors-val');
  const cOut = document.getElementById('conv-val');
  const pOut = document.getElementById('value-val');
  const iOut = document.getElementById('industry-val');

  const revNow    = document.getElementById('rev-now');
  const revNew    = document.getElementById('rev-new');
  const revAnnual = document.getElementById('rev-annual');
  const revBar    = document.getElementById('rev-bar');

  // Industry-specific lift factors (traffic lift, conversion lift)
  const LIFTS = {
    ecom:   { t: 1.40, c: 1.60, lever: 'AI-generated creative &amp; automated bid management for paid social & Google.' },
    saas:   { t: 1.35, c: 1.75, lever: 'Lifecycle email flows and landing-page CRO for demo requests.' },
    local:  { t: 1.50, c: 1.55, lever: 'Local SEO, reviews engine, and Google Business Profile optimization.' },
    agency: { t: 1.30, c: 1.70, lever: 'Thought-leadership content engine plus cold outbound automation.' },
    other:  { t: 1.40, c: 1.60, lever: 'Cross-channel AI playbook tuned to your funnel' }
  };

  const FOCUS = {
    ecom:   'Paid media + CRO on top PDPs',
    saas:   'ICP-matched content + lifecycle nurture',
    local:  'Local SEO + review velocity',
    agency: 'Authority content + outbound automation',
    other:  'Audit-driven 90-day plan'
  };

  const currency = (n) => {
    if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return '$' + Math.round(n / 1_000).toLocaleString() + 'k';
    return '$' + Math.round(n).toLocaleString();
  };
  const commas = (n) => Number(n).toLocaleString();

  function setFill(el) {
    const min = Number(el.min), max = Number(el.max), v = Number(el.value);
    const pct = ((v - min) / (max - min)) * 100;
    el.style.setProperty('--fill', pct + '%');
  }

  function update() {
    setFill(visitors); setFill(conv); setFill(value);

    const v = Number(visitors.value);
    const c = Number(conv.value);
    const p = Number(value.value);
    const ind = industry.value;
    const L = LIFTS[ind] || LIFTS.other;

    vOut.textContent = commas(v);
    cOut.textContent = c.toFixed(1) + '%';
    pOut.textContent = currency(p);
    iOut.textContent = industry.options[industry.selectedIndex].text;

    const now = v * (c / 100) * p;                          // monthly revenue today
    const projected = (v * L.t) * ((c / 100) * L.c) * p;    // with Signal & Scale
    const uplift = (projected - now) * 12;

    revNow.textContent    = currency(now);
    revNew.textContent    = currency(projected);
    revAnnual.textContent = '+' + currency(Math.max(0, uplift));

    const ratio = projected / Math.max(now, 1);
    const barPct = Math.min(100, Math.max(30, (ratio / 3) * 100));
    revBar.style.width = barPct + '%';

    // Populate the (hidden) unlocked panel content in advance
    const lever = document.getElementById('lever');
    const focus = document.getElementById('focus');
    if (lever) lever.innerHTML = L.lever;
    if (focus) focus.textContent = FOCUS[ind] || FOCUS.other;
  }

  [visitors, conv, value, industry].forEach((el) => {
    el.addEventListener('input', update);
    el.addEventListener('change', update);
  });
  update();
})();

/* ---------- Calc form submission (email gate) ---------- */
function handleCalcLead(e) {
  e.preventDefault();
  const input = document.getElementById('calc-email');
  const note  = document.getElementById('calc-note');
  const panel = document.getElementById('calc-unlocked');
  const email = (input.value || '').trim();
  if (!email) return false;
  note.textContent = 'Thanks — your personalized roadmap is unlocked below. We\'ll also email a copy to ' + email + '.';
  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return false;
}
window.handleCalcLead = handleCalcLead;

/* ---------- Testimonials slider ---------- */
(function () {
  const track = document.getElementById('testi-track');
  if (!track) return;
  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById('testi-dots');
  const prev = document.querySelector('.slider-btn--prev');
  const next = document.querySelector('.slider-btn--next');
  let index = 0;
  let timer = null;

  // Build dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    btn.addEventListener('click', () => go(i, true));
    dotsWrap.appendChild(btn);
  });
  const dots = Array.from(dotsWrap.children);

  function go(i, userInitiated) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    dots.forEach((d, j) => d.setAttribute('aria-current', String(j === index)));
    if (userInitiated) restart();
  }
  function restart() { stop(); start(); }
  function start()   { timer = setInterval(() => go(index + 1), 6000); }
  function stop()    { if (timer) { clearInterval(timer); timer = null; } }

  prev.addEventListener('click', () => { go(index - 1); restart(); });
  next.addEventListener('click', () => { go(index + 1); restart(); });

  const wrap = document.querySelector('.slider-wrap');
  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', start);

  // Basic swipe
  let startX = null;
  wrap.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stop(); }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    startX = null; start();
  });

  go(0);
  start();
})();

/* ---------- FAQ accordion: close others when one opens ---------- */
(function () {
  const items = document.querySelectorAll('.acc');
  items.forEach((d) =>
    d.addEventListener('toggle', () => {
      if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
    })
  );
})();

/* ---------- Original contact form ---------- */
function handleLead(e) {
  e.preventDefault();
  const input = document.getElementById('email');
  const note = document.getElementById('cta-note');
  const email = (input.value || '').trim();
  if (!email) return false;
  note.textContent = "Thanks — we'll be in touch at " + email + " within 1 business day.";
  input.value = '';
  return false;
}
window.handleLead = handleLead;
