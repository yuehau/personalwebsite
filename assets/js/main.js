/* ════════════════════════════════════════════════════════════
   Chin Yue Hau — Allianz Financial Advisor · main.js
   Nav, drawer, scroll effects, reveal, FAQ, agent-code copy,
   and the lead-generation form (no backend — WhatsApp handoff).
   ════════════════════════════════════════════════════════════ */

// ── Navbar scroll + scroll progress + back-to-top (throttled with rAF)
const nav = document.getElementById('nav');
const prog = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');
let ticking = false;
function onScroll() {
  const sy = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (docH > 0 ? (sy / docH) * 100 : 0) + '%';
  nav.classList.toggle('raised', sy > 50);
  backTop.classList.toggle('show', sy > 600);
  ticking = false;
}
window.addEventListener('scroll', function () {
  if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });

backTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Smooth scroll for in-page anchors (offsetting fixed nav)
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
      closeDrawer();
    }
  });
});

// ── Mobile burger menu
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
burger.addEventListener('click', function () {
  burger.classList.toggle('open');
  drawer.classList.toggle('open');
});
function closeDrawer() {
  burger.classList.remove('open');
  drawer.classList.remove('open');
}
document.addEventListener('click', function (e) {
  if (!nav.contains(e.target) && !drawer.contains(e.target)) closeDrawer();
});

// ── Scroll reveal — once-only
const io = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.rev, .rev-l, .rev-r').forEach(function (el) { io.observe(el); });

// ── FAQ accordion
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(function (a) { a.classList.remove('open'); });
  document.querySelectorAll('.faq-q').forEach(function (b) { b.classList.remove('active'); });
  if (!isOpen) { answer.classList.add('open'); btn.classList.add('active'); }
}

// ── Agent code copy-to-clipboard
function copyAgentCode(btn) {
  navigator.clipboard.writeText('241514-3').then(function () {
    const original = btn.innerHTML;
    btn.innerHTML = '✓ Copied — 241514-3';
    setTimeout(function () { btn.innerHTML = original; }, 2200);
  });
}

// ── Lead-generation form ─────────────────────────────────────
// GitHub Pages has no backend, so the form packages the enquiry
// into a structured WhatsApp message (primary) and a mailto link
// (fallback shown in the success state).
(function () {
  const form = document.getElementById('leadForm');
  if (!form) return;
  const WA_NUMBER = '60147058125';
  const EMAIL = 'yh.chin.allianz@gmail.com';

  // ── CRM capture ──────────────────────────────────────────
  // Paste your Apps Script Web App URL here (the same /exec URL used by
  // Agent_Workspace.html → Settings & Sync). When set, every form submission
  // is ALSO saved straight into the Leads tab of your Insurance_CRM sheet.
  // Leave '' to disable. Never blocks the WhatsApp handoff.
  const CRM_SYNC_URL = 'https://script.google.com/macros/s/AKfycbzjBHl-R9YiftrcuP62zGRdMfNIjAbkR3yRxrhJK9sTzVLSjkWaABqgesbAtUjZdHyyOw/exec';

  const fields = {
    name: document.getElementById('lf-name'),
    phone: document.getElementById('lf-phone'),
    plan: document.getElementById('lf-plan'),
    time: document.getElementById('lf-time'),
    msg: document.getElementById('lf-msg')
  };

  function setErr(input, on) {
    input.classList.toggle('err', on);
    const err = input.parentElement.querySelector('.f-err');
    if (err) err.classList.toggle('show', on);
  }
  [fields.name, fields.phone, fields.plan].forEach(function (input) {
    input.addEventListener('input', function () { setErr(input, false); });
    input.addEventListener('change', function () { setErr(input, false); });
  });

  function buildMessage() {
    const lines = [
      'Hi Yue Hau, I\'d like a free consultation. (via chinyuehau website)',
      '',
      'Name: ' + fields.name.value.trim(),
      'Phone: ' + fields.phone.value.trim(),
      'Interested in: ' + fields.plan.value,
      'Best time to contact: ' + (fields.time.value || 'Anytime')
    ];
    const msg = fields.msg.value.trim();
    if (msg) lines.push('Note: ' + msg);
    return lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;
    if (fields.name.value.trim().length < 2) { setErr(fields.name, true); ok = false; }
    // Accept Malaysian / international formats: digits, spaces, dashes, optional +
    if (!/^\+?[0-9][0-9 \-()]{7,17}$/.test(fields.phone.value.trim())) { setErr(fields.phone, true); ok = false; }
    if (!fields.plan.value) { setErr(fields.plan, true); ok = false; }
    if (!ok) return;

    const text = buildMessage();

    // Save the lead into the CRM sheet (fire-and-forget)
    if (CRM_SYNC_URL) {
      try {
        fetch(CRM_SYNC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'formLead',
            name: fields.name.value.trim(),
            phone: fields.phone.value.trim(),
            product: fields.plan.value,
            bestTime: fields.time.value || 'Anytime',
            message: fields.msg.value.trim(),
            source: 'Website'
          })
        }).catch(function () {});
      } catch (err) { /* never block the conversion path */ }
    }
    const wa = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
    const mailto = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent('Consultation request — ' + fields.name.value.trim()) +
      '&body=' + encodeURIComponent(text);

    // Success state with both channels
    form.style.display = 'none';
    const success = document.getElementById('leadSuccess');
    success.classList.add('show');
    document.getElementById('ls-wa').href = wa;
    document.getElementById('ls-mail').href = mailto;

    // Open WhatsApp immediately (primary conversion path)
    window.open(wa, '_blank', 'noopener');
  });

  document.getElementById('ls-reset').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('leadSuccess').classList.remove('show');
    form.style.display = '';
  });
})();
