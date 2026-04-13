/**
 * stars.js — Lightweight star field canvas
 * Generates twinkling stars behind the page content.
 */
(function () {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars  = [];
  let frame  = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.min(
      Math.floor((canvas.width * canvas.height) / 6500),
      220
    );
    for (let i = 0; i < count; i++) {
      stars.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        r:       Math.random() * 1.1 + 0.2,
        opacity: Math.random() * 0.65 + 0.12,
        speed:   Math.random() * 0.015 + 0.004,
        phase:   Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame += 0.018;

    stars.forEach((s) => {
      const op = s.opacity * (0.55 + 0.45 * Math.sin(frame * s.speed * 60 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 228, 255, ${op})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); createStars(); }, 200);
  });

  resize();
  createStars();
  draw();
})();
