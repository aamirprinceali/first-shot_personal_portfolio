# portfolio-site — Session Handoff

**Branch:** space-final  
**Last updated:** 2026-04-16

---

## What This Site Is
Aamir's space/constellation themed portfolio. The "Full Experience" side. Audience: creatives, tech builders, curious people. Recruiters get a separate site (portfolio-minimal).

**Run:** Open `index.html` directly in browser — no build step.

---

## Current State — What's Built and Working

### Complete Features
- Custom HTML5 Canvas constellation system (`js/space-bg.js`) — 5 named constellations, each maps to a section. Constellations activate/fade as user scrolls.
- Terminal intro (`js/terminal.js`) — boot screen with typing effect, skip button, `sessionStorage.setItem('intro-seen', '1')` on close
- Hero animations (`js/hero.js`):
  - Scramble-decode on "Aamir Ali" (fires after terminal closes)
  - Cursor parallax on neofetch card
  - Progress bars animate in with glow pulse (values: AI Tools 92%, Automation 91%, Healthcare 93%, Ops Design 96%)
- Section dividers glow when user scrolls near them, colored to their constellation
- Tool cards: left purple accent bar, hover lift
- Project cards: left green accent bar, hover lift
- Process step cards (work-with-me.html): left accent bar, hover lift
- Full SEO: meta tags, OG, Twitter cards, JSON-LD structured data
- `favicon.svg` — constellation icon
- `robots.txt` + `sitemap.xml`
- About me text: final approved version (4 paragraphs)
- All section `$ command` labels REMOVED
- Nav logo: clean "Aamir Ali" (no terminal prompt styling)
- Contact form: Web3Forms key `61182368-6cdc-4631-9ac8-be2a5293d520`

### Files
```
index.html, cv.html, work-with-me.html
css/variables.css, reset.css, layout.css, components.css
js/cursor.js, main.js, projects.js, terminal.js, hero.js, space-bg.js
favicon.svg, robots.txt, sitemap.xml
```

---

## What Still Needs To Be Built (This Chat)

### 1. Terminal Intro — Update Text to "DECODING FILE"
In `js/terminal.js`, update the boot sequence lines so the intro reads like it's decoding a file. Something like:
```
> INITIALIZING SECURE TERMINAL...
> DECODING FILE: aamir_ali.profile
> CLEARANCE VERIFIED
> LOADING...
```
Keep the same timing/animation structure, just update the text strings.

### 2. Sitewide Decode Effect on Navigation
When the user clicks a nav link or the page loads, all major headings (`.section-title`, `h1`, `h2`) should scramble-decode in. Re-use the same `scrambleDecode()` function from `js/hero.js`.

Implementation plan:
- On `DOMContentLoaded`, call `scrambleDecode()` on all targeted headings with staggered delays
- Headings already visible in viewport decode first
- Headings below the fold decode when they enter viewport (IntersectionObserver)
- The scramble chars: `'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234#@✦·'`
- Same `FRAMES_PER_CHAR = 7`, `INTERVAL_MS = 35` settings as hero.js
- This makes the ENTIRE SITE feel like it was encrypted and is being unlocked as you explore it

### 3. "Switch to Professional Cut" Button
Add a subtle link somewhere on all 3 pages (probably footer or nav) that says:
- "See the Professional Cut →" or "Professional Version →"
- Links directly to portfolio-minimal URL (update once that site is deployed)
- On space site: subtle styling — `--text-2` color, no glow, feels like a footnote

### 4. Redirect Rule for cv.html and work-with-me.html
If someone lands directly on `cv.html` or `work-with-me.html` without having seen the terminal intro, redirect them to `index.html` so the full intro plays.

Add at the TOP of `<head>` in cv.html and work-with-me.html:
```html
<script>
  if (!sessionStorage.getItem('intro-seen')) {
    window.location.replace('index.html');
  }
</script>
```

Note: `sessionStorage` (not localStorage) — this clears when the tab closes so every new visit gets the intro.

---

## Scramble Decode Function (canonical version from hero.js)
```js
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234#@✦·';
const FRAMES_PER_CHAR = 7;
const INTERVAL_MS = 35;

function scrambleDecode(el) {
  const target = el.textContent;
  let frame = 0;
  const total = target.length * FRAMES_PER_CHAR;
  const id = setInterval(() => {
    const resolved = Math.floor(frame / FRAMES_PER_CHAR);
    el.textContent = target.split('').map((ch, i) => {
      if (i < resolved) return ch;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    if (++frame >= total) { el.textContent = target; clearInterval(id); }
  }, INTERVAL_MS);
}
```

---

## Written-Out (Clip-Path Reveal) Effect — for Gateway + Minimal Site
This is what the GATEWAY page will use on the professional side, and what portfolio-minimal should use for chapter headers:

**Plain CSS (for gateway):**
```css
.write-on {
  clip-path: inset(0 100% 0 0);
  animation: writeOn var(--duration, 0.8s) cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes writeOn {
  to { clip-path: inset(0 0% 0 0); }
}
/* Stagger with animation-delay on each element */
```

**Framer Motion (for portfolio-minimal React):**
```jsx
<motion.div
  initial={{ clipPath: "inset(0 100% 0 0)" }}
  animate={{ clipPath: "inset(0 0% 0 0)" }}
  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
>
  Chapter Title
</motion.div>
```

---

## Gateway Site (Separate Chat/Repo)
- Repo: `~/Desktop/dev/portfolio-gateway` (GitHub: aamirprinceali/portfolio-gateway)
- Standalone — not linked from space site, not embedded in minimal site
- Aamir shares this URL intentionally when he wants someone to choose
- CLAUDE.md in that folder has the full design brief for building it

---

## Design Tokens (quick reference)
```css
--bg: #030308   --text: #E2E2F0   --accent: #7C6FFF
--green: #34D399   --amber: #FBBF24
--font-sans: 'Space Grotesk'   --font-mono: 'JetBrains Mono'
```

---

## Not Yet Done (Lower Priority)
- Animated stat counters in About section
- "Currently Building" ticker strip under hero
- Constellation name tooltips on hover
- OG preview image
- Calendly embed (Aamir will provide link)
- Domain registration + DNS setup
- GitHub Pages go-live (merge space-final → main, enable Pages)
- Google Search Console submission
