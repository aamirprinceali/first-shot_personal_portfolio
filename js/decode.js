/**
 * decode.js — Sitewide scramble-decode system
 *
 * On every page load, all headings decode in a top-to-bottom waterfall.
 * On index.html, this waits for the terminal intro to finish first.
 * When navigating between pages, headings scramble OUT before the browser
 * navigates, then decode IN on the new page.
 *
 * Globals used by hero.js:
 *   window.scrambleDecode(el)   — decode a single element
 *   window.onIntroGone(cb)      — fire callback after terminal closes
 */

const NOISE_CHARS  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01#@✦';
const FRAME_MS     = 22;
const TOTAL_FRAMES = 46; // ~1 second per heading

// ── Decode a single text node ─────────────────────────────────────────────────
function decodeTextNode(textNode) {
  const original = textNode.textContent;
  const chars    = original.split('');
  const resolved = chars.map(c => /\s/.test(c)); // spaces stay resolved
  const pending  = resolved.reduce((acc, r, i) => (r ? acc : [...acc, i]), []);

  if (!pending.length) return;

  let frame = 0;
  if (textNode._dt) clearInterval(textNode._dt);

  textNode._dt = setInterval(() => {
    frame++;

    // Last couple frames: snap to final
    if (frame >= TOTAL_FRAMES - 1) {
      textNode.textContent = original;
      clearInterval(textNode._dt);
      textNode._dt = null;
      return;
    }

    // Randomly resolve a portion of remaining characters each frame
    const unresolved = resolved
      .map((r, i) => (r ? -1 : i))
      .filter(i => i >= 0);

    const count = Math.ceil(unresolved.length / (TOTAL_FRAMES - frame));
    unresolved
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .forEach(i => { resolved[i] = true; });

    textNode.textContent = chars
      .map((c, i) => resolved[i]
        ? c
        : NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)])
      .join('');

  }, FRAME_MS);
}

// ── Decode all text nodes in an element (preserves <br> and child tags) ───────
window.scrambleDecode = function scrambleDecode(el) {
  const walk = (node) => {
    if (node.nodeType === 3 && node.textContent.trim()) {
      decodeTextNode(node);
    } else {
      node.childNodes.forEach(walk);
    }
  };
  walk(el);
};

// ── Wait for terminal intro to close (index.html only) ───────────────────────
window.onIntroGone = function onIntroGone(callback) {
  const intro = document.getElementById('terminal-intro');
  if (!intro || intro.classList.contains('hidden')) {
    setTimeout(callback, 150);
    return;
  }
  const obs = new MutationObserver(() => {
    if (intro.classList.contains('hidden')) {
      obs.disconnect();
      setTimeout(callback, 280);
    }
  });
  obs.observe(intro, { attributes: true, attributeFilter: ['class'] });
};

// ── Collect headings to decode ────────────────────────────────────────────────
// Excludes the hero .scramble spans — hero.js handles those separately.
function getHeadings() {
  return Array.from(
    document.querySelectorAll('h1, h2, h3, .section-title, .cv-name')
  ).filter(el =>
    !el.classList.contains('scramble') &&
    !el.closest('.scramble') &&
    !el.querySelector('.scramble')
  );
}

// ── Decode all headings top-to-bottom ────────────────────────────────────────
function decodeAll() {
  const headings = getHeadings();
  if (!headings.length) return;

  // Sort by vertical position so we waterfall top → bottom
  headings
    .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
    .forEach((el, i) => {
      setTimeout(() => window.scrambleDecode(el), i * 110);
    });
}

// ── Fire on page load ─────────────────────────────────────────────────────────
(function () {
  const intro      = document.getElementById('terminal-intro');
  const firstVisit = intro && !sessionStorage.getItem('intro-seen');

  if (firstVisit) {
    // index.html, first visit — wait for terminal to finish
    window.onIntroGone(decodeAll);
  } else {
    // All other pages / revisits — decode shortly after paint
    setTimeout(decodeAll, 220);
  }
})();

// ── Page transition: scramble OUT before navigating ──────────────────────────
// All headings scramble back to noise as you leave, then decode in on arrival.
(function () {
  function scrambleToNoise(el, onDone) {
    const textNodes = [];
    const walk = (node) => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        textNodes.push({ node, original: node.textContent });
      } else {
        node.childNodes.forEach(walk);
      }
    };
    walk(el);

    if (!textNodes.length) { onDone(); return; }

    let frame = 0;
    const FRAMES = 14;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / FRAMES;
      textNodes.forEach(({ node, original }) => {
        node.textContent = original.split('').map(c => {
          if (/\s/.test(c)) return c;
          return Math.random() < progress
            ? NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)]
            : c;
        }).join('');
      });
      if (frame >= FRAMES) {
        clearInterval(timer);
        onDone();
      }
    }, FRAME_MS);
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Only intercept internal page links — skip anchors, external, mailto, tel
    if (!href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('mailto') ||
        href.startsWith('tel')) return;

    e.preventDefault();

    const headings = getHeadings();
    if (!headings.length) { window.location.href = href; return; }

    let done = 0;
    headings.forEach(el => {
      scrambleToNoise(el, () => {
        done++;
        if (done === headings.length) window.location.href = href;
      });
    });

    // Safety fallback
    setTimeout(() => { window.location.href = href; }, 500);
  });
})();
