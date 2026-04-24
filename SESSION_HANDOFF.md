# portfolio-site — Session Handoff
**Branch:** space-final | **Last updated:** 2026-04-24
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
- **3D card tilt** — tool and service cards tilt toward cursor on hover (main.js). Project cards excluded — they had a gravity/pull feeling that Aamir hated.
- **Section dividers** — glow when user scrolls near them, colored to their constellation
- **Comets** — max 3 at once, spawn frequently, purple-white tint, long trails

### GSAP animations (added session 3)
- **GSAP 3.12.5 + ScrollTrigger** loaded via CDN on all three pages
- **js/animations.js** (new file) handles staggered entrances for:
  - Project cards: stagger every 0.1s, slide up from y:44, power3.out
  - Tool cards: row-by-row stagger with subtle scale (0.97 → 1)
  - CV timeline items: slide in from x:-28 with 0.12s stagger per item
  - Highlight items in About: cascade from left
  - Service cards on work-with-me: staggered entrance
- `projects.js` checks for GSAP and skips its own IntersectionObserver when GSAP is present

### Design upgrades (session 3)
- **Project card hover**: translateY(-7px) scale(1.012) + multi-layer green glow
- **Shimmer sweep**: ::after pseudo-element sweeps across card on hover
- **Project overlay**: slides up from bottom (was a flat opacity fade)
- **Preview placeholders**: 6 distinct gradient color palettes per project (blue, teal, purple, cyan, slate, amber)
- **Section title accent**: glowing purple underline bar via ::after on every .section-title

### Contact / functional
- **Contact form** — Web3Forms key `61182368-6cdc-4631-9ac8-be2a5293d520` (NOTE: form submissions not yet tested to inbox — verify this works)
- **Calendly links** — placeholder `https://calendly.com/aamir-ali` in index.html (hero) and work-with-me.html (15min + 30min buttons). **Replace with real Calendly URL.**
- **Resume download** — `aamir-ali-resume.pdf` in portfolio-site root. **Drop the file in — it doesn't exist yet.** Button is already wired.

### CV page (synced session 3)
- Dates corrected to match Resume v5.2 (HelloHero Sep 2025, Hazel Sep 2025, Lighthouse Apr/Mar dates)
- Quality audit score: 99% (was 100%)
- Team size: 30-person (was 25+)
- Summary: matches resume exactly
- Sidebar: 8 skill categories, all tools from resume added (Zendesk, Big Purple Dot, Dazos, Perplexity, Calendly, Acuity, Kipu, Availity, instantvob, VerifyTreatment, Supabase)

### Pages
- `index.html` — Main portfolio (hero, about, tools, projects, contact)
- `cv.html` — Full career timeline, education, certifications, all tools
- `work-with-me.html` — Services, process steps, Calendly booking

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
js/cursor.js       ← magnetic cursor (project/tool cards excluded from pull)
js/main.js         ← scroll, tilt (tool + service only), nav, contact form
js/projects.js     ← project data + renderer (defers to GSAP if available)
js/terminal.js     ← terminal intro
js/hero.js         ← hero scramble-decode, cursor parallax, progress bars
js/space-bg.js     ← canvas constellation system
js/animations.js   ← GSAP ScrollTrigger — project/tool/timeline stagger
js/decode.js       ← EXISTS but NOT loaded. Page transition scramble-out, available if wanted.
favicon.svg, robots.txt, sitemap.xml
SESSION_HANDOFF.md ← this file
```

---

## What Still Needs To Be Done

### Must do before launch
- [ ] **Drop in resume PDF** — name it `aamir-ali-resume.pdf`, place in portfolio-site root
- [ ] **Update Calendly URL** — search `calendly.com/aamir-ali` in index.html and work-with-me.html, replace with real link
- [ ] **Test contact form** — submit a test message and confirm it arrives at aamirali1211@gmail.com
- [ ] **Deploy to GitHub Pages** — merge space-final → main, enable Pages in GitHub repo settings

### Nice to have (post-launch)
- [ ] OG preview image (`og-image.png`) — 1200×630px image for social sharing previews
- [ ] Calendly — consider embedding inline widget on work-with-me.html
- [ ] Constellation tooltips on hover — small label showing constellation name
- [ ] "Switch to Professional →" footer link (after minimal portfolio site is deployed)

---

## Three-Site Architecture (big picture)
| Site | Repo | Purpose |
|------|------|---------|
| **Space portfolio** (this one) | `first-shot_personal_portfolio` branch `space-final` | Creative/tech audience, full experience |
| **Minimal portfolio** | `portfolio-minimal` | Recruiter/corporate audience, Fortune/Bloomberg editorial aesthetic |
| **Gateway page** | `portfolio-gateway` | Optional choice page, shared intentionally — not linked from either site |

---

## Session History
- **Session 1**: Initial build — constellation, terminal, hero, base layout
- **Session 2**: decode system, nav active, 3D tilt, comets, Calendly, resume download, CV, SEO
- **Session 3 (2026-04-24)**: CV synced to Resume v5.2, cursor gravity fixed, GSAP added, design polished
