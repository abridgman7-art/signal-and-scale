// Mobile nav toggle
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

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Lead form — placeholder handler (replace with your real endpoint later)
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
