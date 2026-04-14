/**
 * space-bg.js — Deep Space Constellation System
 * Custom HTML5 Canvas — no external dependencies.
 *
 * 5 named constellations, each tied to a page section via IntersectionObserver.
 * Constellations live in the viewport margins so they never obscure content.
 */
(function () {

  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shooters = [], frame = 0;

  // Per-constellation activation level (0 = invisible, 1 = fully lit)
  const live   = { NAVIGATOR: 0, WANDERER: 0, ARCHITECT: 0, BUILDER: 0, SIGNAL: 0 };
  const wanted = { NAVIGATOR: 0, WANDERER: 0, ARCHITECT: 0, BUILDER: 0, SIGNAL: 0 };

  /**
   * Constellation definitions.
   * star positions = [x%, y%] of viewport — kept in the left/right margins
   * so they never block the centre content column.
   */
  const CONSTS = [
    {
      key: 'NAVIGATOR',
      label: 'NAV-01 · NAVIGATOR',
      section: 'hero',
      col: '#7C6FFF', rgb: '124,111,255',
      stars: [
        [8, 9], [5, 16], [11, 15],
        [7, 22], [10, 26], [5, 29], [12, 31]
      ],
      edges: [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6]]
    },
    {
      key: 'WANDERER',
      label: 'NAV-02 · WANDERER',
      section: 'about',
      col: '#60A5FA', rgb: '96,165,250',
      stars: [
        [4, 43], [9, 47], [5, 53],
        [12, 57], [6, 62], [11, 66]
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[1,3]]
    },
    {
      key: 'ARCHITECT',
      label: 'NAV-03 · ARCHITECT',
      section: 'tools',
      col: '#A78BFA', rgb: '167,139,250',
      stars: [
        [88, 33], [93, 37], [89, 42],
        [85, 46], [93, 48], [88, 53], [91, 59], [84, 40]
      ],
      edges: [[0,1],[1,2],[2,3],[2,4],[4,5],[5,6],[3,5],[0,7],[7,2]]
    },
    {
      key: 'BUILDER',
      label: 'NAV-04 · BUILDER',
      section: 'projects',
      col: '#34D399', rgb: '52,211,153',
      stars: [
        [6, 67], [12, 70], [8, 75],
        [13, 79], [5, 82], [10, 86], [7, 77]
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,3],[0,6],[6,2]]
    },
    {
      key: 'SIGNAL',
      label: 'NAV-05 · SIGNAL',
      section: 'contact',
      col: '#FBBF24', rgb: '251,191,36',
      stars: [
        [87, 72], [93, 76], [89, 81],
        [95, 83], [90, 88], [84, 85]
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,2],[0,2]]
    }
  ];

  // ── Star field ─────────────────────────────────────────────────────────────
  function buildStars() {
    stars = Array.from({ length: 265 }, () => ({
      x:  Math.random(),
      y:  Math.random(),
      r:  Math.random() < 0.06 ? Math.random() * 1.3 + 0.7 : Math.random() * 0.65 + 0.15,
      a:  Math.random() * 0.55 + 0.2,
      tw: Math.random() * 0.005 + 0.001,
      to: Math.random() * Math.PI * 2,
      col: (() => {
        const t = Math.random();
        return t < 0.12 ? '#ccc8ff' : t < 0.08 ? '#b8d4ff' : '#ffffff';
      })()
    }));
  }

  // ── Resize ─────────────────────────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  // ── Nebula helpers ─────────────────────────────────────────────────────────
  const NEBULAE = [
    { x: 0.12, y: 0.26, rx: 0.28, ry: 0.16, a: 0.038, rgb: '55,35,160' },
    { x: 0.88, y: 0.46, rx: 0.20, ry: 0.12, a: 0.030, rgb: '35,75,200' },
    { x: 0.48, y: 0.78, rx: 0.32, ry: 0.18, a: 0.026, rgb: '85,35,140' }
  ];

  function drawNebulae() {
    for (const n of NEBULAE) {
      const cx = n.x * W, cy = n.y * H;
      const rx = n.rx * W, ry = n.ry * H;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      g.addColorStop(0, `rgba(${n.rgb},${n.a})`);
      g.addColorStop(1, `rgba(${n.rgb},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStarField() {
    for (const s of stars) {
      const tw = Math.sin(frame * s.tw + s.to) * 0.18;
      const a  = Math.max(0.04, s.a + tw);
      const sx = s.x * W, sy = s.y * H;

      ctx.globalAlpha = a;
      ctx.fillStyle = s.col;
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow on larger stars
      if (s.r > 0.85) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 5);
        g.addColorStop(0, `rgba(200,200,255,${a * 0.28})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ── Shooting stars ─────────────────────────────────────────────────────────
  function spawnShooter() {
    if (shooters.length < 2 && Math.random() < 0.0025) {
      const left = Math.random() < 0.55;
      shooters.push({
        x:     left ? 0.05 + Math.random() * 0.25 : 0.65 + Math.random() * 0.28,
        y:     0.03 + Math.random() * 0.38,
        vx:    (left ? 1 : -1) * (Math.random() * 0.0038 + 0.0025),
        vy:    Math.random() * 0.0018 + 0.0008,
        a:     1,
        decay: Math.random() * 0.007 + 0.005,
        len:   35 + Math.random() * 45
      });
    }
  }

  function drawShooters() {
    spawnShooter();
    shooters = shooters.filter(s => s.a > 0.02);
    for (const s of shooters) {
      const x1 = s.x * W, y1 = s.y * H;
      const dx = s.vx * s.len, dy = s.vy * s.len;
      const g = ctx.createLinearGradient(x1, y1, x1 - dx * W, y1 - dy * H);
      g.addColorStop(0, `rgba(255,255,255,${s.a})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - dx * W, y1 - dy * H);
      ctx.stroke();
      s.x += s.vx;
      s.y += s.vy;
      s.a -= s.decay;
    }
  }

  // ── Constellations ─────────────────────────────────────────────────────────
  function drawConstellations() {
    for (const con of CONSTS) {
      // Smooth lerp toward target
      live[con.key] += (wanted[con.key] - live[con.key]) * 0.022;
      const v = live[con.key];
      if (v < 0.008) continue;

      // Convert % positions to px
      const pts = con.stars.map(([px, py]) => [px * W / 100, py * H / 100]);

      // — Connector lines —
      ctx.save();
      ctx.strokeStyle = con.col;
      ctx.lineWidth = 0.75;
      ctx.globalAlpha = v * 0.42;
      for (const [a, b] of con.edges) {
        ctx.beginPath();
        ctx.moveTo(pts[a][0], pts[a][1]);
        ctx.lineTo(pts[b][0], pts[b][1]);
        ctx.stroke();
      }
      ctx.restore();

      // — Star nodes —
      for (const [sx, sy] of pts) {
        // Outer halo
        const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, 15);
        halo.addColorStop(0, `rgba(${con.rgb},${v * 0.28})`);
        halo.addColorStop(1, `rgba(${con.rgb},0)`);
        ctx.fillStyle = halo;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, 15, 0, Math.PI * 2);
        ctx.fill();

        // White hot core
        ctx.globalAlpha = Math.min(1, v * 1.25);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, 2.1, 0, Math.PI * 2);
        ctx.fill();

        // Coloured inner dot
        ctx.globalAlpha = v * 0.9;
        ctx.fillStyle = con.col;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // — Constellation label (appears after 45% activation) —
      if (v > 0.45) {
        const la = (v - 0.45) / 0.55;
        const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
        const ty = pts.reduce((mn, p) => Math.min(mn, p[1]), Infinity) - 16;
        ctx.save();
        ctx.globalAlpha = la * 0.52;
        ctx.fillStyle = con.col;
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(con.label, cx, ty);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ── Main render loop ───────────────────────────────────────────────────────
  function render() {
    frame++;
    ctx.clearRect(0, 0, W, H);
    drawNebulae();
    drawStarField();
    drawShooters();
    drawConstellations();
    requestAnimationFrame(render);
  }

  // ── IntersectionObserver — ties sections to constellations ─────────────────
  function observe() {
    const sectionMap = {
      hero:     'NAVIGATOR',
      about:    'WANDERER',
      tools:    'ARCHITECT',
      projects: 'BUILDER',
      contact:  'SIGNAL'
    };

    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        const k = sectionMap[e.target.id];
        if (k) wanted[k] = e.isIntersecting ? 1 : 0.06;
      }
    }, { threshold: 0.12 });

    let observed = 0;
    for (const id of Object.keys(sectionMap)) {
      const el = document.getElementById(id);
      if (el) { io.observe(el); observed++; }
    }

    // On pages without these sections (cv.html, work-with-me.html),
    // activate all constellations at ambient levels for ambiance.
    if (observed === 0) {
      wanted.NAVIGATOR = 1.0;
      wanted.WANDERER  = 0.60;
      wanted.ARCHITECT = 0.45;
      wanted.BUILDER   = 0.35;
      wanted.SIGNAL    = 0.50;
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  window.addEventListener('load', () => {
    resize();
    window.addEventListener('resize', resize);
    observe();
    render();
  });

})();
