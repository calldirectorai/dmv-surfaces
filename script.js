// ─── Page Routing ───
function showPage(page) {
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector('.nav-link[data-page="' + page + '"]');
  if (activeLink) activeLink.classList.add('active');
  const header = document.getElementById('main-header');
  if (page === 'home') {
    header.classList.add('transparent');
    header.classList.remove('solid');
    handleScroll();
  } else {
    header.classList.remove('transparent');
    header.classList.add('solid');
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(observeElements, 100);
}

// ─── Mobile Menu ───
function openMobileMenu() {
  document.getElementById('mobileMenu').classList.add('open');
  document.getElementById('mobileOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ─── Scroll Handler ───
function handleScroll() {
  const header = document.getElementById('main-header');
  if (header.classList.contains('transparent')) {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
}
window.addEventListener('scroll', handleScroll);

// ─── Scroll Animations ───
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up:not(.visible)').forEach(el => observer.observe(el));
}

// ─── Stat Counter Animation ───
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          let suffix = '+';
          if (target === 98) suffix = '%';
          if (target === 3) { suffix = 'x'; }
          el.textContent = current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ─── Contact Form ───
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  var form = this;
  var submitBtn = form.querySelector('[type="submit"]');
  var originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  var name    = document.getElementById('c-name').value.trim();
  var phone   = document.getElementById('c-phone').value.trim();
  var email   = document.getElementById('c-email').value.trim();
  var service = document.getElementById('c-service').value.trim();
  var message = document.getElementById('c-message').value.trim();

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://app.calldirector.ai/api/webhooks/flow/2330/181e13342e9fa2e746905acd01c727f21fe8e70c054c2ffc7a1f968e24b7e86f', true);
  xhr.setRequestHeader('Content-Type', 'text/plain');
  xhr.send(JSON.stringify({
    webhook_contactName:  name,
    webhook_contactPhone: phone,
    webhook_contactEmail: email,
    webhook_service:      service,
    webhook_message:      message
  }));

  // Show success immediately — webhook is fire-and-forget
  form.style.display = 'none';
  document.getElementById('form-success').classList.remove('hidden');
});

function resetContactForm() {
  var form = document.getElementById('contact-form');
  form.reset();
  form.style.display = '';
  document.getElementById('form-success').classList.add('hidden');
}

// ─── Vera Voice Launcher ───
function triggerVeraVoice() {
  var tip = document.getElementById('voiceTip');
  if (tip) tip.style.display = 'none';
  var pmgBtn = document.querySelector('.pmg-launcher-btn, .vera-launcher-btn, [class*="launcher"]');
  if (pmgBtn) { pmgBtn.click(); return; }
  var allBtns = document.querySelectorAll('button, [role="button"]');
  for (var i = 0; i < allBtns.length; i++) {
    var btn = allBtns[i];
    if (btn.closest('.voice-widget, .navbar, .hero')) continue;
    if (btn.textContent && btn.textContent.trim().length < 30) { btn.click(); return; }
  }
  var vw = window.innerWidth, vh = window.innerHeight;
  var els = document.elementsFromPoint(vw - 75, vh - 100);
  for (var j = 0; j < els.length; j++) {
    var el = els[j];
    if (el.tagName === 'BUTTON' || el.role === 'button' || el.onclick) {
      if (!el.closest('.voice-widget')) { el.click(); return; }
    }
  }
  showPage('contact');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', function() {
  observeElements();
  handleScroll();
  setTimeout(function() {
    var tip = document.getElementById('voiceTip');
    if (tip) tip.style.display = 'none';
  }, 15000);
});