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
  // ─── Add your projects here ──────────────────────────
  // Example (uncomment and edit):
  //
  // {
  //   title: "AI-Powered Intake Triage",
  //   description: "Automated patient intake workflow using GPT-4 to classify urgency levels and route tickets to the right care team, reducing manual triage time by 60%.",
  //   tags: ["AI", "GPT-4", "Healthcare", "Automation"],
  //   liveUrl: "https://your-demo.com",
  //   githubUrl: "https://github.com/aamirali/project",
  //   status: "Completed",
  //   previewUrl: "https://your-demo.com"
  // },
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

  grid.innerHTML = PROJECTS.map((p, i) => `
    <div class="project-card reveal reveal-delay-${(i % 4) + 1}">
      <div class="project-preview">
        ${p.previewUrl
          ? `<iframe src="${p.previewUrl}" loading="lazy" title="${p.title} preview" sandbox="allow-scripts allow-same-origin"></iframe>`
          : `<div class="project-preview-placeholder">[ preview ]</div>`
        }
        <div class="project-overlay">
          ${p.liveUrl   ? `<a href="${p.liveUrl}"   target="_blank" rel="noopener" class="project-overlay-btn">↗ Live demo</a>` : ''}
          ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="project-overlay-btn">⌥ Source</a>` : ''}
        </div>
      </div>
      <div class="project-body">
        <div class="project-tags">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.description}</div>
        <div class="project-footer">
          <div class="project-links">
            ${p.liveUrl   ? `<a href="${p.liveUrl}"   target="_blank" rel="noopener" class="project-link">↗ Demo</a>` : ''}
            ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="project-link">⌥ GitHub</a>` : ''}
          </div>
          <div class="project-status">${p.status}</div>
        </div>
      </div>
    </div>
  `).join('');

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
