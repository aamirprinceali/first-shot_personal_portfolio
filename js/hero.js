/**
 * hero.js — Hero section animations
 *
 * Requires decode.js to be loaded first (provides window.scrambleDecode
 * and window.onIntroGone as shared globals).
 *
 * A: Text scramble decode on the hero name
 * B: Cursor parallax on the neofetch card (gentle depth/weight effect)
 * C: Progress bars animate in with a glow pulse at completion
 *
 * All three wait for the terminal intro to close before firing.
 */
(function () {

  // ── A: Hero name scramble decode ─────────────────────────────────────────
  // The .scramble spans in the <h1> each carry data-text="Word".
  // Aamir decodes first, then Ali 280ms later.
  const scrambleEls = document.querySelectorAll('.scramble');
  if (scrambleEls.length) {
    window.onIntroGone(() => {
      scrambleEls.forEach((el, i) => {
        setTimeout(() => window.scrambleDecode(el), i * 280);
      });
    });
  }

  // ── B: Cursor parallax on neofetch card ──────────────────────────────────
  // Mouse movement across the hero section drifts the neofetch card gently
  // in the opposite direction — creates a sense of depth and weight.
  const hero       = document.getElementById('hero');
  const heroVisual = document.querySelector('.hero-visual');

  if (hero && heroVisual) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      targetX = ((e.clientX - cx) / rect.width)  * -14;
      targetY = ((e.clientY - cy) / rect.height) * -9;
    });

    hero.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    function parallaxLoop() {
      // Only apply once the reveal animation has finished
      if (heroVisual.classList.contains('revealed')) {
        currentX += (targetX - currentX) * 0.07;
        currentY += (targetY - currentY) * 0.07;
        heroVisual.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
      }
      requestAnimationFrame(parallaxLoop);
    }

    window.onIntroGone(() => parallaxLoop());
  }

  // ── C: Progress bars animate in ──────────────────────────────────────────
  // Bars start at 0% then animate to their target values with a glow pulse.
  const bars = document.querySelectorAll('.nf-bar-fill');

  if (bars.length) {
    bars.forEach(bar => {
      bar.dataset.target = bar.style.width || '0%';
      bar.style.transition = 'none';
      bar.style.width = '0%';
    });

    window.onIntroGone(() => {
      bars.forEach((bar, i) => {
        setTimeout(() => {
          bar.style.transition = 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
          bar.style.width = bar.dataset.target;

          // Glow pulse when the bar reaches its final width
          setTimeout(() => {
            bar.style.transition = 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
            bar.style.boxShadow  = '0 0 14px rgba(124,111,255,0.7), 0 0 5px rgba(124,111,255,0.4)';
            setTimeout(() => { bar.style.boxShadow = ''; }, 480);
          }, 920);

        }, 160 + i * 185);
      });
    });
  }

})();
