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

// ─── Section Dividers — glow when near ───────────────
// Dividers start almost invisible and brighten as you scroll toward them.
// rootMargin: 120px extends the "active" zone so they glow before fully visible.
const dividers = document.querySelectorAll('.section-divider');
if (dividers.length) {
  const divObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => e.target.classList.toggle('active', e.isIntersecting));
  }, { threshold: 0, rootMargin: '120px 0px 120px 0px' });
  dividers.forEach(d => divObserver.observe(d));
}

// ─── 3D Tilt on Cards ────────────────────────────────
// Cards tilt slightly toward the cursor on hover — subtle depth effect.
const tiltCards = document.querySelectorAll('.tool-card, .project-card, .service-card');
tiltCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.08s ease, box-shadow var(--t-base), border-color var(--t-base)';
  });
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5; // -0.5 to 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.45s var(--ease-out), box-shadow var(--t-base), border-color var(--t-base)';
    card.style.transform = '';
  });
});

// ─── Nav Active Section Highlight ────────────────────
// Lights up the nav link matching whichever section is currently
// in the main reading area. Also marks page links active on cv/work-with-me.
const navLinkEls = document.querySelectorAll('.nav-links a');

// On cv.html / work-with-me.html — mark the matching page link active
const currentPage = window.location.pathname.split('/').pop();
navLinkEls.forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage) a.classList.add('nav-active');
});

// On index.html — track scroll position and highlight matching anchor link
const sectionIds = ['hero', 'about', 'tools', 'projects', 'contact'];
const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

if (sectionEls.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinkEls.forEach(a => {
        a.classList.toggle('nav-active', a.getAttribute('href') === `#${id}`);
      });
    });
  // rootMargin: top -40% means section must be past 40% down the screen to activate
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sectionEls.forEach(el => sectionObserver.observe(el));
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
