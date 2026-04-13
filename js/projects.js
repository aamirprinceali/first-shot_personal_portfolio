/**
 * projects.js — Project data store
 *
 * To add a new project, add an object to the PROJECTS array below.
 * The site will automatically render the cards.
 *
 * Fields:
 *   title       {string}  — Project name
 *   description {string}  — Short description (1–2 sentences)
 *   tags        {string[]}— Tech/tool tags (e.g. ["AI", "Python", "Notion"])
 *   liveUrl     {string}  — Live demo URL (or "" to hide)
 *   githubUrl   {string}  — GitHub URL (or "" to hide)
 *   status      {string}  — e.g. "In Progress", "Completed", "Concept"
 *   previewUrl  {string}  — URL to load in preview iframe (or "" for placeholder)
 */

const PROJECTS = [
  {
    title: "NextRound — Job Hunt HQ",
    description: "A full job hunting command center built from scratch. Track every application, prep for interviews, compose recruiter emails with built-in templates, and monitor your pipeline from first apply to final offer — all in one place.",
    tags: ["React", "TypeScript", "Vite", "CRM"],
    liveUrl: "",
    githubUrl: "https://github.com/aamirprinceali/NextRound",
    status: "In Progress",
    previewUrl: ""
  },
  {
    title: "Managr — Sober Living Ops",
    description: "An operations platform built for sober living facilities. Manage residents, track drug tests, assign chores, log medications and meetings, and flag violations — everything a house manager needs to run a tight ship.",
    tags: ["Next.js", "Supabase", "Tailwind", "Healthcare"],
    liveUrl: "",
    githubUrl: "https://github.com/aamirprinceali/managr",
    status: "In Progress",
    previewUrl: ""
  },
  {
    title: "HomeBase — Family Command Center",
    description: "A mobile app that keeps the whole household on the same page. Manage family members, shared tasks, schedules, and house responsibilities — all backed by real-time Firebase sync.",
    tags: ["React Native", "Expo", "Firebase", "Mobile"],
    liveUrl: "",
    githubUrl: "https://github.com/aamirprinceali/HomeBase",
    status: "In Progress",
    previewUrl: ""
  },
  {
    title: "HelloHero — Scheduling System",
    description: "A scheduling system built for HelloHero, a mental health organization. Manages therapy providers across multiple schools and districts — with a visual timeline, session assignment, student tracking, and real-time provider capacity.",
    tags: ["Next.js", "TypeScript", "Zustand", "Scheduling"],
    liveUrl: "",
    githubUrl: "",
    status: "In Progress",
    previewUrl: ""
  },
  {
    title: "Clinician Dashboard",
    description: "A provider-facing dashboard for HelloHero clinicians. View assigned students across school districts, track session completion, manage caseloads, and flag scheduling conflicts — all in one clean interface built to reduce admin overhead.",
    tags: ["Next.js", "TypeScript", "Healthcare", "Dashboard"],
    liveUrl: "",
    githubUrl: "",
    status: "In Progress",
    previewUrl: ""
  },
  {
    title: "Lead Scraping Automation",
    description: "An automated lead generation pipeline that scrapes target websites for business contacts, deduplicates and scores the data, then pushes qualified leads directly into CRM pipelines via n8n — removing the manual research grind entirely.",
    tags: ["n8n", "Puppeteer", "Automation", "CRM"],
    liveUrl: "",
    githubUrl: "",
    status: "In Progress",
    previewUrl: ""
  },
];

// ─── Renderer ────────────────────────────────────────
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  if (PROJECTS.length === 0) {
    grid.innerHTML = `
      <div class="projects-empty reveal">
        <div class="projects-empty-icon">🚧</div>
        <div class="projects-empty-title">Projects Coming Soon</div>
        <div class="projects-empty-desc">
          I'm currently building out my first projects. Check back soon —
          or reach out if you'd like to collaborate on something.
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = PROJECTS.map((p, i) => {
    const pid = String(i + 1).padStart(3, '0');
    return `
    <div class="project-card reveal reveal-delay-${(i % 4) + 1}">
      <div class="project-preview">
        ${p.previewUrl
          ? `<iframe src="${p.previewUrl}" loading="lazy" title="${p.title} preview" sandbox="allow-scripts allow-same-origin"></iframe>`
          : `<div class="project-preview-placeholder">
               <span class="placeholder-pid">PID ${pid}</span>
               <span>[ no preview — process running ]</span>
             </div>`
        }
        <div class="project-overlay">
          ${p.liveUrl   ? `<a href="${p.liveUrl}"   target="_blank" rel="noopener" class="project-overlay-btn">↗ live demo</a>` : ''}
          ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="project-overlay-btn">⌥ source</a>` : ''}
        </div>
      </div>
      <div class="project-body">
        <div class="project-proc-row">
          <span class="project-pid">${pid}</span>
          <div class="project-tags">
            ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.description}</div>
        <div class="project-footer">
          <div class="project-links">
            ${p.liveUrl   ? `<a href="${p.liveUrl}"   target="_blank" rel="noopener" class="project-link">↗ demo</a>` : ''}
            ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="project-link">⌥ github</a>` : ''}
          </div>
          <div class="project-status">${p.status}</div>
        </div>
      </div>
    </div>
  `}).join('');

  // Re-observe new cards for reveal animation
  grid.querySelectorAll('.reveal').forEach((el) => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', renderProjects);
