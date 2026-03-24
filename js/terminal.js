/**
 * terminal.js — Boot sequence terminal intro
 */
(function () {
  const intro    = document.getElementById('terminal-intro');
  const skipBtn  = document.getElementById('terminal-skip');
  const linesEl  = document.querySelectorAll('.terminal-line');

  if (!intro) return;

  // If user already visited, skip
  if (sessionStorage.getItem('intro-seen')) {
    intro.classList.add('hidden');
    return;
  }

  const delays = [300, 900, 1400, 1900, 2400, 2800, 3200, 3700, 4100];

  linesEl.forEach((line, i) => {
    setTimeout(() => {
      line.classList.add('visible');
    }, delays[i] || i * 500);
  });

  // Auto-dismiss after sequence
  const totalDuration = (delays[linesEl.length - 1] || 4000) + 1200;

  let dismissTimer = setTimeout(dismiss, totalDuration);

  function dismiss() {
    clearTimeout(dismissTimer);
    sessionStorage.setItem('intro-seen', '1');
    intro.classList.add('hidden');
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', dismiss);
  }

  // Also skip on any keypress
  document.addEventListener('keydown', dismiss, { once: true });
})();
