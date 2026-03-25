/**
 * main.js — Scroll progress, reveal animations, nav, expertise tags, keyboard nav
 */

// ─── Scroll Progress Bar ──────────────────────────────
const progressBar = document.getElementById('scroll-progress');

function updateProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}

// ─── Sticky Nav ───────────────────────────────────────
const nav = document.getElementById('nav');

function updateNav() {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 60);
}

// ─── Reveal on Scroll ─────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach((el) => revealObserver.observe(el));

// ─── Expertise Tags — Staggered Cascade ──────────────
// Tags slide up + fade in one by one when section scrolls into view.
// A brief border shimmer plays as each tag appears.
const expertiseTags    = document.querySelectorAll('.exp-tag');
const expertiseWrapper = document.getElementById('expertise-tags');

if (expertiseWrapper && expertiseTags.length) {
  const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        expertiseTags.forEach((tag, i) => {
          setTimeout(() => {
            tag.classList.add('visible');
          }, i * 90);
        });
        tagObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  tagObserver.observe(expertiseWrapper);
}

// ─── Scroll Event ─────────────────────────────────────
window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
}, { passive: true });

updateProgress();
updateNav();

// ─── Keyboard Navigation ─────────────────────────────
const sections = ['hero', 'about', 'tools', 'projects', 'contact'];

document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= sections.length) {
    document.getElementById(sections[num - 1])?.scrollIntoView({ behavior: 'smooth' });
  }
});

// ─── Mobile Nav Hamburger ─────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open  = navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
    spans[1].style.opacity   = open ? '0' : '';
    spans[2].style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
  });

  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
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

// ─── Contact Form — Web3Forms ─────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn      = contactForm.querySelector('.btn-primary');
    const original = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled    = true;

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body:   new FormData(contactForm)
      });
      const data = await res.json();

      if (data.success) {
        btn.textContent = 'Message sent ✓';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled    = false;
        }, 3000);
      } else {
        btn.textContent = 'Something went wrong — try email directly';
        btn.disabled    = false;
      }
    } catch {
      btn.textContent = 'Network error — try email directly';
      btn.disabled    = false;
    }
  });
}
