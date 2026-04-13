/**
 * cv-timeline.js — Proximity-based hover-reveal career timeline
 * Move cursor near a timeline node to reveal its content.
 */
(function () {
  const timeline = document.getElementById('cv-timeline');
  if (!timeline) return;

  const nodes = Array.from(timeline.querySelectorAll('.timeline-node'));
  const THRESHOLD = 200; // px radius for activation

  function updateProximity(cursorX, cursorY) {
    nodes.forEach((node) => {
      const dot  = node.querySelector('.timeline-dot');
      if (!dot) return;

      const rect = dot.getBoundingClientRect();
      const dotX = rect.left + rect.width  / 2;
      const dotY = rect.top  + rect.height / 2;
      const dist = Math.hypot(cursorX - dotX, cursorY - dotY);

      if (dist < THRESHOLD) {
        const strength = 1 - dist / THRESHOLD; // 0→1 as cursor approaches
        node.style.setProperty('--proximity', strength);
        node.classList.add('proximity-active');
      } else {
        node.style.setProperty('--proximity', '0');
        node.classList.remove('proximity-active');
      }
    });
  }

  document.addEventListener('mousemove', (e) => {
    updateProximity(e.clientX, e.clientY);
  });

  // On touch devices, reveal all cards
  if ('ontouchstart' in window) {
    nodes.forEach((n) => n.classList.add('proximity-active'));
  }

  // Highlight the most-recent node by default (first one on page load)
  if (nodes.length) {
    nodes[nodes.length - 1].classList.add('proximity-active');
  }
})();
