/**
 * terminal.js — Signal Transmission intro sequence
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

  // Fast staggered reveal — total ~2.5s visible, then auto-dismiss at ~3.2s
  const delays = [150, 400, 650, 900, 1100, 1300, 1500, 1700, 1900, 2100, 2300, 2550];

  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('visible'), delays[i] ?? (i * 300));
  });

  const totalDuration = (delays[lines.length - 1] ?? 2550) + 650;
  let dismissTimer = setTimeout(dismiss, totalDuration);

  function dismiss() {
    clearTimeout(dismissTimer);
    sessionStorage.setItem('intro-seen', '1');
    intro.classList.add('hidden');
  }

  if (skipBtn) skipBtn.addEventListener('click', dismiss);
  document.addEventListener('keydown', dismiss, { once: true });
})();
