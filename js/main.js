/**
 * main.js — Scroll progress, reveal animations, nav, stats counter, keyboard nav
 */

// ─── Scroll Progress Bar ──────────────────────────────
const progressBar = document.getElementById('scroll-progress');

function updateProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}

// ─── Sticky Nav ───────────────────────────────────────
const nav = document.getElementById('nav');

function updateNav() {
  if (!nav) return;
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

// ─── Reveal on Scroll ─────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el) => observer.observe(el));

// ─── Stats Counter ────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach((el) => statObserver.observe(el));

// ─── Scroll Event ─────────────────────────────────────
window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
}, { passive: true });

// Init
updateProgress();
updateNav();

// ─── Keyboard Navigation ─────────────────────────────
const sections = ['hero', 'about', 'tools', 'projects', 'contact'];

document.addEventListener('keydown', (e) => {
  // Don't hijack when typing in form fields
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= sections.length) {
    const target = document.getElementById(sections[num - 1]);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }
});

// ─── Mobile Nav Hamburger ─────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

// ─── Keyboard Hint Auto-hide ──────────────────────────
const hint = document.getElementById('keyboard-hint');
if (hint) {
  setTimeout(() => {
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), 600);
  }, 5000);
}

// ─── Contact Form ─────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-primary');
    const original = btn.textContent;
    btn.textContent = 'Message sent ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}
