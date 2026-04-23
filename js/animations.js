/**
 * animations.js — GSAP ScrollTrigger animations
 *
 * Handles staggered entrances for project cards, tool cards, and timeline items.
 * Falls back gracefully if GSAP isn't loaded.
 * Load this after main.js in all HTML files.
 */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // ─── Project Cards — staggered entrance ───────────────────────
  // Cards are rendered dynamically by projects.js, so we watch the grid
  // with a MutationObserver and animate when they appear.
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid) {
    const initProjectCards = () => {
      const cards = projectsGrid.querySelectorAll('.project-card');
      if (!cards.length) return;

      // Take over from CSS reveal — set GSAP as the authority on opacity/transform
      cards.forEach(c => {
        c.classList.remove('reveal', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4');
        gsap.set(c, { opacity: 0, y: 44 });
      });

      ScrollTrigger.create({
        trigger: projectsGrid,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            stagger: { each: 0.1, from: 'start' },
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'transform,opacity'
          });
        }
      });
    };

    const mo = new MutationObserver(() => {
      if (projectsGrid.children.length > 0) {
        mo.disconnect();
        // Small delay to let projects.js finish setting up
        requestAnimationFrame(initProjectCards);
      }
    });
    mo.observe(projectsGrid, { childList: true });
  }

  // ─── Tool Cards — staggered grid entrance ────────────────────
  const toolCards = Array.from(document.querySelectorAll('.tool-card.reveal'));
  if (toolCards.length) {
    // Group into rows of 4 for row-by-row stagger
    const rowSize = 4;
    const rows    = [];
    for (let i = 0; i < toolCards.length; i += rowSize) {
      rows.push(toolCards.slice(i, i + rowSize));
    }

    rows.forEach(row => {
      row.forEach(c => {
        c.classList.remove('reveal', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4');
        gsap.set(c, { opacity: 0, y: 28, scale: 0.97 });
      });

      ScrollTrigger.create({
        trigger: row[0],
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(row, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.07,
            duration: 0.65,
            ease: 'power2.out',
            clearProps: 'transform,opacity'
          });
        }
      });
    });
  }

  // ─── CV Timeline Items — slide in from left ───────────────────
  const timelineItems = Array.from(document.querySelectorAll('.tv2-item.reveal'));
  if (timelineItems.length) {
    timelineItems.forEach(el => {
      el.classList.remove('reveal', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3');
      gsap.set(el, { opacity: 0, x: -28 });
    });

    timelineItems.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            x: 0,
            duration: 0.75,
            delay: i * 0.12,
            ease: 'power2.out',
            clearProps: 'transform,opacity'
          });
        }
      });
    });
  }

  // ─── Highlight Items — stagger from left ─────────────────────
  const highlights = Array.from(document.querySelectorAll('.highlight-item.reveal'));
  if (highlights.length) {
    highlights.forEach(el => {
      el.classList.remove('reveal', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4');
      gsap.set(el, { opacity: 0, x: -18 });
    });

    ScrollTrigger.create({
      trigger: highlights[0],
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(highlights, {
          opacity: 1,
          x: 0,
          stagger: 0.09,
          duration: 0.65,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        });
      }
    });
  }

  // ─── Service Cards (work-with-me.html) ───────────────────────
  const serviceCards = Array.from(document.querySelectorAll('.service-card.reveal'));
  if (serviceCards.length) {
    serviceCards.forEach(el => {
      el.classList.remove('reveal', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3');
      gsap.set(el, { opacity: 0, y: 32 });
    });

    ScrollTrigger.create({
      trigger: serviceCards[0],
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(serviceCards, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity'
        });
      }
    });
  }

})();
