/**
 * terminal.js — Personal boot sequence intro
 */
(function () {
  const intro   = document.getElementById('terminal-intro');
  const skipBtn = document.getElementById('terminal-skip');
  const lines   = document.querySelectorAll('.terminal-line');

  if (!intro) return;

  // Skip on revisit within same session
  if (sessionStorage.getItem('intro-seen')) {
    intro.classList.add('hidden');
    return;
  }

  // Staggered reveal timing (ms) — spaced so visitors can read each line
  const delays = [400, 1200, 2200, 3100, 4000, 5200, 6200, 7400, 8600];

  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('visible'), delays[i] ?? i * 900);
  });

  const totalDuration = (delays[lines.length - 1] ?? 8000) + 2200;
  let dismissTimer = setTimeout(dismiss, totalDuration);

  function dismiss() {
    clearTimeout(dismissTimer);
    sessionStorage.setItem('intro-seen', '1');
    intro.classList.add('hidden');
  }

  if (skipBtn) skipBtn.addEventListener('click', dismiss);
  document.addEventListener('keydown', dismiss, { once: true });
})();
