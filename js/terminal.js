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

  // Staggered reveal timing (ms)
  const delays = [300, 800, 1200, 1700, 2100, 2600, 3000, 3400, 3900, 4300, 4700];

  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('visible'), delays[i] ?? i * 450);
  });

  const totalDuration = (delays[lines.length - 1] ?? 5000) + 1400;
  let dismissTimer = setTimeout(dismiss, totalDuration);

  function dismiss() {
    clearTimeout(dismissTimer);
    sessionStorage.setItem('intro-seen', '1');
    intro.classList.add('hidden');
  }

  if (skipBtn) skipBtn.addEventListener('click', dismiss);
  document.addEventListener('keydown', dismiss, { once: true });
})();
