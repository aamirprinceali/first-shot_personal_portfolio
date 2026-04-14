/**
 * hero.js — Hero section animations
 *
 * A: Text scramble decode on the hero name
 * B: Cursor parallax on the neofetch card (gentle depth/weight effect)
 * C: Neofetch progress bars animate in with a glow pulse at completion
 *
 * All three wait for the terminal intro to close before firing,
 * so they don't compete with the signal-transmission animation.
 * If the user skips early, the observer catches that too.
 */
(function () {

  // ── Wait for terminal intro to disappear ──────────────────────────────────
  // Watches for the 'hidden' class to be added to #terminal-intro.
  // If there's no intro (cv.html, work-with-me.html), fires after a short delay.
  function onIntroGone(callback) {
    const intro = document.getElementById('terminal-intro');
    if (!intro || intro.classList.contains('hidden')) {
      setTimeout(callback, 200);
      return;
    }
    const obs = new MutationObserver(() => {
      if (intro.classList.contains('hidden')) {
        obs.disconnect();
        setTimeout(callback, 380); // slight buffer for CSS fade-out
      }
    });
    obs.observe(intro, { attributes: true, attributeFilter: ['class'] });
  }

  // ── A: Text Scramble Decode ───────────────────────────────────────────────
  // Elements with class="scramble" and data-text="Target Word" get scrambled
  // then decoded letter-by-letter. Fits the signal/transmission theme.
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234#@✦·';

  function scrambleDecode(el) {
    const target = el.dataset.text || el.textContent.trim();
    let frame = 0;
    const FRAMES_PER_CHAR = 7;
    const totalFrames = target.length * FRAMES_PER_CHAR + 8;

    const tick = setInterval(() => {
      el.textContent = target
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          const resolveAt = i * FRAMES_PER_CHAR;
          if (frame >= resolveAt + FRAMES_PER_CHAR) return char;
          if (frame >= resolveAt) {
            // Resolving: probability ramps toward the real character
            const progress = (frame - resolveAt) / FRAMES_PER_CHAR;
            return Math.random() < progress
              ? char
              : CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      frame++;
      if (frame > totalFrames) {
        el.textContent = target; // guarantee clean final state
        clearInterval(tick);
      }
    }, 35);
  }

  const scrambleEls = document.querySelectorAll('.scramble');
  if (scrambleEls.length) {
    onIntroGone(() => {
      scrambleEls.forEach((el, i) => {
        // Stagger each word slightly (Aamir fires, then Ali 280ms later)
        setTimeout(() => scrambleDecode(el), i * 280);
      });
    });
  }

  // ── B: Cursor Parallax on Neofetch Card ───────────────────────────────────
  // As the mouse moves across the hero section, the neofetch card drifts
  // gently in the opposite direction — creating a sense of depth and weight.
  // Uses lerp (linear interpolation) in a rAF loop for silky smoothness.
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
      // Only apply parallax after the reveal animation has completed
      if (heroVisual.classList.contains('revealed')) {
        currentX += (targetX - currentX) * 0.07;
        currentY += (targetY - currentY) * 0.07;
        const cx = parseFloat(currentX.toFixed(2));
        const cy = parseFloat(currentY.toFixed(2));
        heroVisual.style.transform = `translate(${cx}px, ${cy}px)`;
      }
      requestAnimationFrame(parallaxLoop);
    }

    // Start the loop after the intro clears to avoid conflicting
    // with the reveal animation that fires on page load
    onIntroGone(() => parallaxLoop());
  }

  // ── C: Progress Bars Animate In ──────────────────────────────────────────
  // Bars start at 0 width, then animate to their target values in sequence.
  // A brief violet glow pulses when each bar reaches its final width.
  const bars = document.querySelectorAll('.nf-bar-fill');

  if (bars.length) {
    // Capture the target width from inline style, then zero them out
    bars.forEach(bar => {
      bar.dataset.target = bar.style.width || '0%';
      bar.style.transition = 'none';
      bar.style.width = '0%';
    });

    onIntroGone(() => {
      bars.forEach((bar, i) => {
        setTimeout(() => {
          // Animate to target
          bar.style.transition = 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
          bar.style.width = bar.dataset.target;

          // Glow pulse fires when width animation completes
          setTimeout(() => {
            bar.style.transition = 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
            bar.style.boxShadow  = '0 0 14px rgba(124,111,255,0.7), 0 0 5px rgba(124,111,255,0.4)';
            setTimeout(() => {
              bar.style.boxShadow = '';
            }, 480);
          }, 920);

        }, 160 + i * 185);
      });
    });
  }

})();
