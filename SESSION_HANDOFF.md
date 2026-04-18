# portfolio-site — Session Handoff
**Branch:** space-final | **Last updated:** 2026-04-18
**GitHub:** https://github.com/aamirprinceali/first-shot_personal_portfolio

---

## What This Site Is
Aamir's space/constellation themed portfolio. The "Full Experience" version.  
Audience: creatives, tech builders, curious people.  
Run: `open index.html` — no build step, plain HTML/CSS/JS.

---

## Current State — What's Built and Working

### Core features
- **Custom canvas constellation system** (`js/space-bg.js`) — 5 named constellations, each maps to a section. Constellations activate/fade as user scrolls.
- **Terminal intro** (`js/terminal.js`) — "ENCRYPTED FILE DETECTED / DECODING FILE" theme. Skip with any key. `sessionStorage('intro-seen')` prevents replay same session.
- **Hero animations** (`js/hero.js`) — scramble-decode on "Aamir Ali" after terminal closes, cursor parallax on neofetch card, progress bars animate in with glow
- **Nav active section highlight** — nav link glows for the section currently in view (main.js IntersectionObserver)
- **3D card tilt** — tool, project, service cards tilt toward cursor on hover (main.js)
- **Section dividers** — glow when user scrolls near them, colored to their constellation
- **Comets** — max 3 at once, spawn frequently, purple-white tint, long trails. Visible within ~10–20 seconds of browsing.
- **Full SEO** — meta, OG, Twitter cards, JSON-LD structured data
- **favicon.svg** — constellation icon
- **robots.txt + sitemap.xml**

### Contact / functional
- **Contact form** — Web3Forms key `61182368-6cdc-4631-9ac8-be2a5293d520` (NOTE: form submissions not yet tested to inbox — verify this works)
- **Calendly links** — placeholder `https://calendly.com/aamir-ali` in index.html (hero) and work-with-me.html (15min + 30min buttons). **Replace with real Calendly URL.**
- **Resume download** — `aamir-ali-resume.pdf` in portfolio-site root. **Drop the file in — it doesn't exist yet.** Button is already wired.

### Pages
- `index.html` — Main portfolio (hero, about, tools, projects, contact)
- `cv.html` — Full career timeline, education, certifications (Google AI certs now vertical list), download button
- `work-with-me.html` — Services, process steps, Calendly booking

### Nav structure (each page hides its own link — already correct)
- index.html nav: About, AI & Automation, Projects, Work With Me, CV
- cv.html nav: About, AI & Automation, Projects, Work With Me (no CV)
- work-with-me.html nav: About, AI & Automation, Projects, CV (no Work With Me)

### Design tokens (quick ref)
```
--bg: #030308  --text: #E2E2F0  --accent: #7C6FFF
--green: #34D399  --font-sans: 'Space Grotesk'  --font-mono: 'JetBrains Mono'
```

---

## Files Reference
```
index.html, cv.html, work-with-me.html
css/variables.css, reset.css, layout.css, components.css
js/cursor.js, main.js, projects.js, terminal.js, hero.js, space-bg.js
js/decode.js  ← EXISTS but NOT loaded in any HTML. Contains page transition
              scramble-out effect. Available if you want to re-enable later.
favicon.svg, robots.txt, sitemap.xml
SESSION_HANDOFF.md  ← this file
```

---

## What Still Needs To Be Done

### Must do before launch
- [ ] **Drop in resume PDF** — name it `aamir-ali-resume.pdf`, place in portfolio-site root
- [ ] **Update Calendly URL** — search `calendly.com/aamir-ali` in index.html and work-with-me.html, replace with real link
- [ ] **Test contact form** — submit a test message and confirm it arrives at aamirali1211@gmail.com. Web3Forms should work but hasn't been verified this session.
- [ ] **Add "Switch to Professional" link** — subtle footer/nav link pointing to portfolio-minimal URL (once that site is deployed)
- [ ] **Deploy to GitHub Pages** — merge space-final → main, enable Pages in GitHub repo settings. Use custom domain once registered.

### Nice to have (post-launch)
- [ ] OG preview image (`og-image.png`) — 1200×630px image for social sharing previews
- [ ] Calendly — consider embedding inline widget on work-with-me.html instead of just a link
- [ ] Constellation tooltips on hover — small label showing constellation name
- [ ] Animated stat counters (years, projects, etc.) in About section

---

## Three-Site Architecture (big picture)
Aamir has 3 portfolio properties:

| Site | Repo | Purpose |
|------|------|---------|
| **Space portfolio** (this one) | `first-shot_personal_portfolio` branch `space-final` | Creative/tech audience, full experience |
| **Minimal portfolio** | `portfolio-minimal` | Recruiter/corporate audience, Fortune/Bloomberg editorial aesthetic |
| **Gateway page** | `portfolio-gateway` | Optional choice page, shared intentionally — not linked from either site |

Each site links directly to the other (not through the gateway). Gateway is a standalone shareable link.

---

## Scramble-Decode Function (hero.js — canonical version)
```js
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234#@✦·';
function scrambleDecode(el) {
  // walks text nodes, randomly resolves characters over ~880ms
  // see js/hero.js and js/decode.js for full implementation
}
```

## Written-Out Effect (for gateway + minimal site reference)
```css
/* Plain CSS (gateway): */
.write-on { clip-path: inset(0 100% 0 0); transition: clip-path 0.7s cubic-bezier(0.16,1,0.3,1); }
.write-on.revealed { clip-path: inset(0 0% 0 0); }

/* Framer Motion (portfolio-minimal React): */
// initial={{ clipPath: "inset(0 100% 0 0)" }}
// animate={{ clipPath: "inset(0 0% 0 0)" }}
// transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
```
