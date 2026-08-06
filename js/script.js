/* ============================================================
   LOADING INTRO — cybersecurity / digital-forensics boot sequence
   Runs on every load. Degrades safely: if anything below throws,
   the hard-timeout guard still removes the overlay.
   ============================================================ */
(function () {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  // only play the boot-sequence once per tab session — repeat visits (nav, back/forward,
  // refresh) shouldn't force everyone to sit through the same 4-6s intro again
  const SEEN_KEY = "portfolio-preloader-seen";
  let alreadySeen = false;
  try {
    alreadySeen = sessionStorage.getItem(SEEN_KEY) === "true";
  } catch (e) { /* sessionStorage blocked (private mode etc.) — just show the intro every time */ }

  if (alreadySeen) {
    preloader.remove();
    document.body.classList.add("loaded");
    return;
  }

  try {
    sessionStorage.setItem(SEEN_KEY, "true");
  } catch (e) { /* storage unavailable — intro will just replay next load, that's fine */ }

  document.body.classList.add("preloading");

  const linesEl = document.getElementById("preloaderLines");
  const fillEl = document.getElementById("preloaderFill");
  const pctEl = document.getElementById("preloaderPct");
  const canvas = document.getElementById("preloaderRain");

  /* ---- background binary rain ---- */
  let rainRAF = null;
  try {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      let cols, drops;

      function sizeRain() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cols = Math.floor(canvas.width / 18);
        drops = Array.from({ length: cols }, () => Math.random() * -50);
      }
      sizeRain();
      window.addEventListener("resize", sizeRain);

      function drawRain() {
        ctx.fillStyle = "rgba(5, 7, 13, 0.16)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "14px 'JetBrains Mono', monospace";
        drops.forEach((y, i) => {
          ctx.fillStyle = Math.random() > 0.94 ? "rgba(99, 194, 255, 0.9)" : "rgba(58, 168, 240, 0.55)";
          ctx.fillText(Math.random() > 0.5 ? "1" : "0", i * 18, y * 18);
          drops[i] = y * 18 > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
        });
        rainRAF = requestAnimationFrame(drawRain);
      }
      drawRain();
    }
  } catch (e) { /* rain is decorative only — safe to skip on failure */ }

  /* ---- typed boot-sequence lines ---- */
  const bootLines = [
    '&gt; booting secure_kernel.sys',
    '&gt; initializing encryption layer... <span class="ok">OK</span>',
    '&gt; mounting digital forensics toolkit...',
    '&gt; scanning network interfaces...',
    '&gt; verifying digital signature... <span class="ok">VERIFIED</span>',
    '&gt; <span class="granted">ACCESS GRANTED</span>',
    '&gt; welcome, rudrajit roy'
  ];
  const lineDelay = 300;
  const totalDuration = lineDelay * bootLines.length + 400;

  bootLines.forEach((html, i) => {
    setTimeout(() => {
      if (!linesEl) return;
      const row = document.createElement("div");
      row.className = "line";
      row.innerHTML = html + (i === bootLines.length - 1 ? '<span class="preloader-cursor"></span>' : "");
      linesEl.appendChild(row);
      linesEl.scrollTop = linesEl.scrollHeight;
    }, i * lineDelay);
  });

  /* ---- progress bar, synced to the same duration ---- */
  const startTime = performance.now();
  function tickProgress(now) {
    const pct = Math.min(100, Math.round(((now - startTime) / totalDuration) * 100));
    if (fillEl) fillEl.style.width = pct + "%";
    if (pctEl) pctEl.textContent = pct + "%";
    if (pct < 100) requestAnimationFrame(tickProgress);
  }
  requestAnimationFrame(tickProgress);

  /* ---- finish: fade out and hand control back to the page ---- */
  let finished = false;
  function finishPreload() {
    if (finished) return;
    finished = true;
    if (fillEl) fillEl.style.width = "100%";
    if (pctEl) pctEl.textContent = "100%";
    preloader.classList.add("fade-out");
    preloader.setAttribute("aria-hidden", "true"); // stop screen readers announcing it mid fade-out
    document.body.classList.remove("preloading");
    document.body.classList.add("loaded");
    if (rainRAF) cancelAnimationFrame(rainRAF);
    setTimeout(() => preloader.remove(), 650);
  }

  setTimeout(finishPreload, totalDuration + 250);
  preloader.addEventListener("click", finishPreload); // let impatient visitors skip the intro
  setTimeout(finishPreload, 6000); // hard safety net so a slow device is never stuck
})();


/* ============================================================
   CONFIG — change this to your real GitHub username
   ============================================================ */
const GITHUB_USERNAME = "rudrajitroy1310";

/* ============================================================
   NAVBAR: SCROLL OFFSET (fixes anchor links landing off-target)
   + SCROLLSPY (active underline follows the section in view)
   ============================================================ */
const navbarEl = document.getElementById("navbar");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateScrollOffset() {
  // tells the browser to stop this many px short of the anchor target,
  // so content doesn't hide behind the sticky navbar
  const navHeight = navbarEl.offsetHeight;
  document.documentElement.style.scrollPaddingTop = `${navHeight + 14}px`;
}
updateScrollOffset();
window.addEventListener("resize", updateScrollOffset);

const navSectionMap = new Map();
navAnchors.forEach((a) => {
  const id = a.getAttribute("href").slice(1);
  const target = document.getElementById(id);
  if (target) navSectionMap.set(target, a);
});

function setActiveNavLink(link) {
  navAnchors.forEach((a) => a.classList.remove("active"));
  if (link) link.classList.add("active");
}

// instant feedback on click, before the scrollspy below catches up
navAnchors.forEach((a) => {
  a.addEventListener("click", () => setActiveNavLink(a));
});

function createNavSpyObserver() {
  return new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length === 0) return;
      // among sections currently in view, the one nearest the top wins
      visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const link = navSectionMap.get(visible[0].target);
      if (link) setActiveNavLink(link);
    },
    {
      rootMargin: `-${navbarEl.offsetHeight + 20}px 0px -55% 0px`,
      threshold: 0
    }
  );
}

let navSpyObserver = createNavSpyObserver();
navSectionMap.forEach((_, section) => navSpyObserver.observe(section));

// rebuild the observer on resize so the navbar-height offset stays accurate
window.addEventListener("resize", () => {
  navSpyObserver.disconnect();
  navSpyObserver = createNavSpyObserver();
  navSectionMap.forEach((_, section) => navSpyObserver.observe(section));
});

/* ============================================================
   TYPING ANIMATION (roles under name)
   ============================================================ */
const roles = [
  "Cybersecurity Enthusiast",
  "Full Stack Developer",
  "AI & IoT Developer"
];

const typedEl = document.getElementById("typedRole");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400); // pause at full word
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

/* ============================================================
   THEME TOGGLE (dark / light)
   ============================================================ */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");

function applyTheme(isLight) {
  document.body.classList.toggle("light-theme", isLight);
  themeIcon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
}

const savedTheme = localStorage.getItem("portfolio-theme");
applyTheme(savedTheme === "light");

themeToggle.addEventListener("click", () => {
  const isLight = !document.body.classList.contains("light-theme");
  applyTheme(isLight);
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
});

/* ============================================================
   ABOUT — READ MORE / READ LESS TOGGLE
   ============================================================ */
const aboutToggleBtn = document.getElementById("aboutToggleBtn");
const aboutMore = document.getElementById("aboutMore");
const aboutToggleText = document.getElementById("aboutToggleText");
const aboutToggleIcon = document.getElementById("aboutToggleIcon");

if (aboutToggleBtn && aboutMore) {
  aboutToggleBtn.addEventListener("click", () => {
    const isHidden = aboutMore.hidden;
    aboutMore.hidden = !isHidden;
    aboutToggleText.textContent = isHidden ? "Read Less" : "Read More";
    aboutToggleIcon.className = isHidden
      ? "fa-solid fa-arrow-up"
      : "fa-solid fa-arrow-right";
  });
}

/* ============================================================
   MOBILE MENU TOGGLE
   ============================================================ */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* ============================================================
   PARTICLE / NETWORK NODE BACKGROUND (hero globe)
   ============================================================ */
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  const wrap = canvas.parentElement;
  canvas.width = wrap.offsetWidth;
  canvas.height = wrap.offsetHeight;
}

function createParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.6
    });
  }
}

let particleRAF = null;

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(99, 194, 255, 0.8)";
    ctx.fill();
  });

  // connect nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(58, 168, 240, ${1 - dist / 90})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  particleRAF = requestAnimationFrame(drawParticles);
}

function startParticles() {
  if (particleRAF === null) drawParticles();
}

function stopParticles() {
  if (particleRAF !== null) {
    cancelAnimationFrame(particleRAF);
    particleRAF = null;
  }
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles(45);
});

resizeCanvas();
createParticles(45);
startParticles();

// pause the animation loop when the hero section is scrolled out of view,
// resume it when it's back — saves CPU/battery on long scroll sessions
const heroSection = document.getElementById("home");
if (heroSection) {
  const particleVisibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startParticles();
        } else {
          stopParticles();
        }
      });
    },
    { threshold: 0 }
  );
  particleVisibilityObserver.observe(heroSection);
}

// also pause when the browser tab itself isn't visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopParticles();
  } else if (heroSection && heroSection.getBoundingClientRect().bottom > 0 &&
             heroSection.getBoundingClientRect().top < window.innerHeight) {
    startParticles();
  }
});

/* ============================================================
   LIVE GITHUB STATS (public REST API — no token needed)
   Cached in localStorage for 1 hour so repeat visits (and the
   60 req/hour unauthenticated rate limit) don't re-hit the API
   every single page load.
   ============================================================ */
const GH_CACHE_KEY = `gh-stats-cache:${GITHUB_USERNAME}`;
const GH_CACHE_TTL = 60 * 60 * 1000; // 1 hour

// one retry after a short pause — smooths over the occasional dropped request/
// transient GitHub API hiccup without hammering it if something's really down
async function fetchWithRetry(url, retries = 1, delayMs = 900) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const err = new Error(`Request failed: ${res.status}`);
        err.status = res.status;
        throw err;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastErr;
}

function renderGithubStats({ avatar_url, login, public_repos, followers, totalStars }) {
  const avatarEl = document.getElementById("ghAvatar");
  const usernameEl = document.getElementById("ghUsername");
  const reposEl = document.getElementById("ghRepos");
  const followersEl = document.getElementById("ghFollowers");
  const starsEl = document.getElementById("ghStars");

  avatarEl.src = avatar_url;
  usernameEl.textContent = login;
  reposEl.textContent = public_repos ?? "–";
  followersEl.textContent = followers ?? "–";
  starsEl.textContent = totalStars ?? "–";
}

function readGithubCache() {
  try {
    const raw = localStorage.getItem(GH_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.timestamp !== "number") return null;
    if (Date.now() - parsed.timestamp > GH_CACHE_TTL) return null; // expired
    return parsed.data;
  } catch (e) {
    return null; // corrupted cache — ignore and refetch
  }
}

function writeGithubCache(data) {
  try {
    localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) { /* localStorage full/unavailable — safe to skip caching */ }
}

async function loadGithubStats() {
  const usernameEl = document.getElementById("ghUsername");
  const reposEl = document.getElementById("ghRepos");
  const followersEl = document.getElementById("ghFollowers");
  const starsEl = document.getElementById("ghStars");
  const chartImg = document.getElementById("ghChartImg");

  // contribution heatmap (public, no auth needed) — has its own caching upstream
  chartImg.src = `https://ghchart.rshah.org/3aa8f0/${GITHUB_USERNAME}`;

  // serve instantly from cache if we have a fresh one, skip the network entirely
  const cached = readGithubCache();
  if (cached) {
    renderGithubStats(cached);
    return;
  }

  try {
    const res = await fetchWithRetry(`https://api.github.com/users/${GITHUB_USERNAME}`);
    const user = await res.json();

    // total stars = sum of stargazers_count across public repos
    let totalStars = 0;
    const reposRes = await fetchWithRetry(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`
    );
    if (reposRes.ok) {
      const repos = await reposRes.json();
      totalStars = Array.isArray(repos)
        ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
        : 0;
    }

    const data = {
      avatar_url: user.avatar_url,
      login: user.login,
      public_repos: user.public_repos,
      followers: user.followers,
      totalStars
    };

    renderGithubStats(data);
    writeGithubCache(data);
  } catch (err) {
    // distinguish a genuinely wrong username from a transient network/rate-limit issue,
    // so the fallback text tells visitors (and future-you) something useful
    const notFound = err && err.status === 404;
    usernameEl.textContent = notFound
      ? GITHUB_USERNAME + " (not found)"
      : GITHUB_USERNAME + " — stats unavailable right now";
    usernameEl.title = notFound
      ? "No GitHub user with this username"
      : "GitHub API didn't respond after a retry — could be rate-limited or offline. Try refreshing in a bit.";
    reposEl.textContent = "–";
    followersEl.textContent = "–";
    starsEl.textContent = "–";
    console.warn("GitHub stats could not be loaded:", err);
  }
}

loadGithubStats();

/* ============================================================
   SKILLS — SCROLL-IN REVEAL ANIMATION
   ============================================================ */
const skillCards = document.querySelectorAll(".skill-card");

// stagger each card so they animate in one after another
skillCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.06}s`;
});

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        skillObserver.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.2 } // trigger when 20% of the card is visible
);

skillCards.forEach((card) => skillObserver.observe(card));

/* ============================================================
   EXPERIENCE TIMELINE — HORIZONTAL SCROLL CONTROLS
   ============================================================ */
const expTimelineEl = document.getElementById("expTimeline");
const expScrollLeftBtn = document.getElementById("expScrollLeft");
const expScrollRightBtn = document.getElementById("expScrollRight");

if (expTimelineEl && expScrollLeftBtn && expScrollRightBtn) {
  function updateExpScrollButtons() {
    const maxScroll = expTimelineEl.scrollWidth - expTimelineEl.clientWidth;
    expScrollLeftBtn.disabled = expTimelineEl.scrollLeft <= 4;
    expScrollRightBtn.disabled = expTimelineEl.scrollLeft >= maxScroll - 4;
  }

  expScrollLeftBtn.addEventListener("click", () => {
    expTimelineEl.scrollBy({ left: -300, behavior: "smooth" });
  });
  expScrollRightBtn.addEventListener("click", () => {
    expTimelineEl.scrollBy({ left: 300, behavior: "smooth" });
  });

  // let a normal vertical mouse-wheel/trackpad scroll move the strip sideways
  expTimelineEl.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        expTimelineEl.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );

  expTimelineEl.addEventListener("scroll", updateExpScrollButtons);
  window.addEventListener("resize", updateExpScrollButtons);
  updateExpScrollButtons();
}

/* ============================================================
   EXPERIENCE TIMELINE — SCROLL-IN REVEAL ANIMATION
   ============================================================ */
const expItems = document.querySelectorAll(".exp-item");

expItems.forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.12}s`;
});

const expObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        expObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

expItems.forEach((item) => expObserver.observe(item));

/* ============================================================
   ACCESSIBILITY: FOCUS-TRAP UTILITY FOR MODALS
   Keeps Tab / Shift+Tab cycling inside the open modal, moves
   focus in when it opens, and restores it to whatever triggered
   the modal when it closes — so keyboard and screen-reader users
   never get dropped onto the page behind an open dialog.
   ============================================================ */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");

function createFocusTrap(container) {
  let lastFocused = null;
  let handleKeydown = null;

  function getFocusable() {
    return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
      (el) => el.offsetParent !== null // skip hidden/collapsed elements
    );
  }

  function onKeydown(e) {
    if (e.key !== "Tab") return;
    const focusable = getFocusable();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return {
    activate() {
      lastFocused = document.activeElement;
      handleKeydown = onKeydown;
      container.addEventListener("keydown", handleKeydown);

      // land focus inside the modal — prefer the close button, it's always present and predictable
      const closeBtn = container.querySelector("[data-close], [data-close-all]");
      const target = closeBtn || getFocusable()[0];
      if (target) target.focus();
    },
    deactivate() {
      if (handleKeydown) {
        container.removeEventListener("keydown", handleKeydown);
        handleKeydown = null;
      }
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
      lastFocused = null;
    }
  };
}

/* ============================================================
   PROJECT DETAIL MODAL
   ============================================================ */
const projectCards = document.querySelectorAll(".project-card");
const projectModal = document.getElementById("projectModal");
const modalThumb = document.getElementById("modalThumb");
const modalTitle = document.getElementById("modalTitle");
const modalDetail = document.getElementById("modalDetail");
const modalTags = document.getElementById("modalTags");
const modalGithub = document.getElementById("modalGithub");
const projectModalTrap = createFocusTrap(projectModal.querySelector(".modal-box"));

function openProjectModal(card) {
  const title = card.querySelector("h3").textContent;
  const detailEl = card.querySelector(".project-detail");
  const detail = detailEl ? detailEl.textContent : card.querySelector("p").textContent;
  const tags = [...card.querySelectorAll(".tags span")].map((t) => t.textContent);
  const thumbSource = card.querySelector(".project-thumb");
  const github = card.dataset.github || "#";

  // rebuild the thumbnail (image / fallback icon + gradient class) inside the modal
  const thumbColorClass = [...thumbSource.classList].find((c) => c !== "project-thumb");
  modalThumb.className = "modal-thumb" + (thumbColorClass ? " " + thumbColorClass : "");
  modalThumb.innerHTML = thumbSource.innerHTML;

  modalTitle.textContent = title;
  modalDetail.textContent = detail;
  modalTags.innerHTML = tags.map((t) => `<span>${t}</span>`).join("");
  modalGithub.href = github;

  projectModal.classList.add("open");
  document.body.classList.add("modal-open");
  projectModalTrap.activate();
}

function closeProjectModal() {
  projectModal.classList.remove("open");
  if (!allProjectsOverlay.classList.contains("open")) {
    document.body.classList.remove("modal-open");
  }
  projectModalTrap.deactivate();
}

projectCards.forEach((card) => {
  card.addEventListener("click", () => openProjectModal(card));
});

projectModal.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && projectModal.classList.contains("open")) closeProjectModal();
});

/* ============================================================
   CERTIFICATE PREVIEW MODAL
   ============================================================ */
const certItems = document.querySelectorAll(".cert-item");
const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");
const certModalTitle = document.getElementById("certModalTitle");
const certModalIssuer = document.getElementById("certModalIssuer");
const certModalTrap = createFocusTrap(certModal.querySelector(".modal-box"));

// Count badge: always reflects however many .cert-item elements exist,
// so adding/removing certificates in the HTML needs zero JS changes.
const certCountBadge = document.getElementById("certCountBadge");
if (certCountBadge) {
  certCountBadge.textContent = certItems.length;
}

// Fade indicators: show a top fade once the user has scrolled down,
// and a bottom fade whenever there's more content below the fold.
const certList = document.getElementById("certList");
const certListWrap = document.getElementById("certListWrap");

function updateCertScrollFades() {
  if (!certList || !certListWrap) return;
  const { scrollTop, scrollHeight, clientHeight } = certList;
  certListWrap.classList.toggle("scrolled-top", scrollTop > 4);
  certListWrap.classList.toggle("has-more", scrollTop + clientHeight < scrollHeight - 4);
}

if (certList) {
  updateCertScrollFades();
  certList.addEventListener("scroll", updateCertScrollFades);
  window.addEventListener("resize", updateCertScrollFades);
}

function openCertModal(item) {
  const title = item.querySelector("strong").textContent;
  const issuer = item.querySelector("span").textContent;
  const imgSrc = item.dataset.certImg || "";

  certModalTitle.textContent = title;
  certModalIssuer.textContent = issuer;
  certModalImg.style.display = "";
  certModalImg.alt = title + " certificate";
  certModalImg.src = imgSrc;

  certModal.classList.add("open");
  document.body.classList.add("modal-open");
  certModalTrap.activate();
}

function closeCertModal() {
  certModal.classList.remove("open");
  if (!projectModal.classList.contains("open") && !allProjectsOverlay.classList.contains("open")) {
    document.body.classList.remove("modal-open");
  }
  certModalTrap.deactivate();
}

certItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault(); // stop the bare '#' href from jumping to the top of the page
    openCertModal(item);
  });
});

certModal.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeCertModal);
});

// if the certificate image can't be found, hide it so the fallback icon shows instead
certModalImg.addEventListener("error", () => {
  certModalImg.style.display = "none";
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && certModal.classList.contains("open")) closeCertModal();
});

/* ============================================================
   ALL PROJECTS OVERVIEW PANEL
   ============================================================ */
const viewAllBtn = document.getElementById("viewAllBtn");
const allProjectsOverlay = document.getElementById("allProjectsOverlay");
const allProjectsGrid = document.getElementById("allProjectsGrid");
const allProjectsTrap = createFocusTrap(allProjectsOverlay.querySelector(".all-projects-panel"));

function populateAllProjectsGrid() {
  if (allProjectsGrid.dataset.filled === "true") return; // build once
  projectCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.addEventListener("click", () => openProjectModal(clone));
    allProjectsGrid.appendChild(clone);
  });
  allProjectsGrid.dataset.filled = "true";
}

function playAllProjectsIntro() {
  const cards = allProjectsGrid.querySelectorAll(".project-card");
  cards.forEach((card, i) => {
    card.classList.remove("pop-in");
    void card.offsetWidth; // force reflow so the animation restarts every time
    card.style.animationDelay = `${i * 0.08}s`;
    card.classList.add("pop-in");
  });
}

function openAllProjects() {
  populateAllProjectsGrid();
  allProjectsOverlay.classList.add("open");
  document.body.classList.add("modal-open");
  playAllProjectsIntro();
  allProjectsTrap.activate();
}

function closeAllProjects() {
  allProjectsOverlay.classList.remove("open");
  document.body.classList.remove("modal-open");
  allProjectsTrap.deactivate();
}

viewAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openAllProjects();
});

allProjectsOverlay.querySelectorAll("[data-close-all]").forEach((el) => {
  el.addEventListener("click", closeAllProjects);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && allProjectsOverlay.classList.contains("open")) {
    closeAllProjects();
  }
});

/* ============================================================
   PROJECTS — SCROLL-IN REVEAL ANIMATION (3D tilt-in)
   ============================================================ */
projectCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.12}s`;
});

const projectObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        projectObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

projectCards.forEach((card) => projectObserver.observe(card));