import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BsX, BsChevronLeft, BsChevronRight, BsGridFill, BsShieldLockFill, BsLayers,
  BsSearch, BsThreeDots, BsBoxArrowUpRight, BsArrowRight, BsArrowLeft,
  BsHandIndexThumb, BsPalette2, BsPlayBtnFill, BsCheckSquareFill, BsBugFill,
  BsTerminalFill, BsCrosshair, BsShieldCheck, BsFileEarmarkText, BsGearFill,
} from 'react-icons/bs';
import { FaLaptopCode } from 'react-icons/fa';
import projectsAllModalBg from '../../assets/images/projects-all-modal-bg.webp';
import ProjectDetailModal from './ProjectDetailModal';
import './ProjectsAllModal.css';

// ---- DUMMY DATA — sirf layout/design dikhane ke liye placeholder hai ----
// Baad me apne real projects (title, description, tags, link, category) se replace karna.
// category yahi 4 values me se ek honi chahiye taaki filter tabs sahi kaam karein:
// 'Cybersecurity' | 'Full Stack' | 'Digital Forensics' | 'Other'
const ALL_PROJECTS = [
  {
    title: 'NetRazor',
    subtitle: 'DETECT · ANALYZE · SECURE',
    category: 'Cybersecurity',
    Icon: BsShieldLockFill,
    accent: ['#2a0508', '#ff2740'],
    description: 'A network vulnerability scanner to detect open ports, services and common vulnerabilities.',
    tags: ['Python', 'Nmap', 'Linux', 'Cybersecurity'],
    link: '#',
    // Extra data used only by the project-detail screen (ProjectDetailModal).
    // Other projects fall back to sensible defaults there, but this one
    // mirrors the reference design exactly.
    detail: {
      version: 'v1.0.0',
      status: 'Completed',
      date: 'Dec 2024',
      type: 'Personal Project',
      tagline: 'Discover vulnerabilities before attackers do.',
      stats: [
        { label: 'Open Ports', value: '12' },
        { label: 'Vulnerabilities', value: '5', accent: true },
        { label: 'Services', value: '8' },
        { label: 'Risk Level', value: 'High', accent: true },
      ],
      features: [
        { title: 'Port Scanning', desc: 'Identify open ports and services', Icon: BsCrosshair },
        { title: 'Vulnerability Detection', desc: 'Detect known security issues', Icon: BsShieldCheck },
        { title: 'Detailed Reports', desc: 'Get comprehensive scan results', Icon: BsFileEarmarkText },
        { title: 'Customizable', desc: 'Flexible scan options and configurations', Icon: BsGearFill },
      ],
      quote: 'Improved my understanding of network protocols, port scanning, vulnerability assessment and security best practices.',
      quoteNote: 'A SMALL STEP TOWARDS A SAFER DIGITAL WORLD.',
      links: { live: '#', code: '#', docs: '#' },
    },
  },
  {
    title: 'Portfolio Website',
    subtitle: 'BUILD · ANIMATE · SHIP',
    category: 'Full Stack',
    Icon: FaLaptopCode,
    accent: ['#0a1830', '#2f5dff'],
    description: 'My personal portfolio website built with modern web technologies and smooth animations.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion'],
    link: '#',
  },
  {
    title: 'CipherTrace',
    subtitle: 'RECOVER · TRACE · REPORT',
    category: 'Digital Forensics',
    Icon: BsSearch,
    accent: ['#1c0a2e', '#9b3dff'],
    description: 'A digital forensics tool to trace file metadata and recover deleted evidence from disk images.',
    tags: ['Python', 'Autopsy', 'Forensics'],
    link: '#',
  },
  {
    title: 'Netflix Clone',
    subtitle: 'STREAM · BROWSE · WATCH',
    category: 'Full Stack',
    Icon: BsPlayBtnFill,
    accent: ['#1a0505', '#8a0000'],
    description: 'A front-end clone of Netflix with responsive design and modern UI/UX.',
    tags: ['React', 'Firebase', 'Tailwind CSS'],
    link: '#',
  },
  {
    title: 'PhishNet',
    subtitle: 'SCAN · FLAG · PROTECT',
    category: 'Cybersecurity',
    Icon: BsBugFill,
    accent: ['#2a0508', '#ff2740'],
    description: 'A phishing detection tool that analyzes URLs and emails for malicious patterns.',
    tags: ['Python', 'ML', 'Cybersecurity'],
    link: '#',
  },
  {
    title: 'LogSentinel',
    subtitle: 'PARSE · MONITOR · ALERT',
    category: 'Digital Forensics',
    Icon: BsTerminalFill,
    accent: ['#1c0a2e', '#9b3dff'],
    description: 'A log analysis tool for identifying suspicious activity across system logs.',
    tags: ['Python', 'SIEM', 'Forensics'],
    link: '#',
  },
  {
    title: 'Todo App',
    subtitle: 'ADD · FILTER · DONE',
    category: 'Other',
    Icon: BsCheckSquareFill,
    accent: ['#04140e', '#0f8a52'],
    description: 'A simple and clean todo app with add, delete, and filter features.',
    tags: ['React', 'LocalStorage', 'CSS'],
    link: '#',
  },
  {
    title: 'ZAROO FF',
    subtitle: 'DESIGN · BRAND · STYLE',
    category: 'Other',
    Icon: BsPalette2,
    accent: ['#3a0a0d', '#ff2740'],
    description: 'A modern YouTube channel banner design with a dark theme and red accents.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: '#',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All', Icon: BsGridFill },
  { key: 'Cybersecurity', label: 'Cybersecurity', Icon: BsShieldLockFill },
  { key: 'Full Stack', label: 'Full Stack', Icon: BsLayers },
  { key: 'Digital Forensics', label: 'Digital Forensics', Icon: BsSearch },
  { key: 'Other', label: 'Other', Icon: BsThreeDots },
];

function RRLogoMini() {
  return (
    <svg viewBox="0 0 120 70" className="pallmodal__brand-logo" fill="none">
      <path
        d="M4 66V6h26c11 0 18 6 18 16 0 8-4.5 13-11.5 15L52 66H38L26 39H16v27H4Z M16 16v14h13c6 0 9.5-2.7 9.5-7s-3.5-7-9.5-7H16Z"
        stroke="var(--red)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M56 66V6h26c11 0 18 6 18 16 0 8-4.5 13-11.5 15L104 66H90L78 39H68v27H56Z M68 16v14h13c6 0 9.5-2.7 9.5-7s-3.5-7-9.5-7H68Z"
        stroke="var(--red)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M46 4 34 68" stroke="var(--red)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function ProjectsAllModal({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailProject, setDetailProject] = useState(null);
  const touchState = useRef({ x: 0, tracking: false });

  // Lock body scroll while modal is open, close on Escape — same technique
  // used in CertificatesModal: pin the page at its current scroll position
  // instead of just hiding overflow, so background doesn't jump on open/close.
  useEffect(() => {
    if (!isOpen) return undefined;

    const scrollY = window.scrollY;
    const { body, documentElement: html } = document;

    const prevBodyStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    const prevHtmlOverflow = html.style.overflow;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      body.style.position = prevBodyStyle.position;
      body.style.top = prevBodyStyle.top;
      body.style.left = prevBodyStyle.left;
      body.style.right = prevBodyStyle.right;
      body.style.width = prevBodyStyle.width;
      body.style.overflow = prevBodyStyle.overflow;
      html.style.overflow = prevHtmlOverflow;
      const prevScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = prevScrollBehavior;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const filtered = useMemo(
    () => (activeCategory === 'all'
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.category === activeCategory)),
    [activeCategory],
  );

  // Reset carousel position whenever the filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  const total = filtered.length;

  const goTo = (idx) => {
    if (total === 0) return;
    setActiveIndex(((idx % total) + total) % total);
  };
  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  // Shortest signed distance from activeIndex on a circular track — each
  // card's --pos shifts by exactly ±1 per step so the CSS transform
  // transition animates a smooth slide instead of a jump.
  const wrapOffset = (idx) => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  // ---------- Basic touch-swipe support ----------
  const onTouchStart = (e) => {
    touchState.current = { x: e.touches[0].clientX, tracking: true };
  };
  const onTouchEnd = (e) => {
    if (!touchState.current.tracking) return;
    const dx = e.changedTouches[0].clientX - touchState.current.x;
    touchState.current.tracking = false;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <>
      <AnimatePresence>
        {isOpen && (
        <motion.div
          className="pallmodal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label="All projects"
        >
          <motion.div
            className="pallmodal"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pallmodal__inner">
              <div
                className="pallmodal__bg"
                style={{ backgroundImage: `url(${projectsAllModalBg})` }}
              />
              <div className="pallmodal__mask" aria-hidden="true" />

              {/* ---------- Top bar: brand + close ---------- */}
              <div className="pallmodal__topbar">
                <div className="pallmodal__brand">
                  <RRLogoMini />
                  <span className="pallmodal__brand-name">RUDRAJIT ROY</span>
                </div>
                <button type="button" className="pallmodal__close" onClick={onClose} aria-label="Close">
                  <BsX />
                </button>
              </div>

              {/* ---------- Body ---------- */}
              <div className="pallmodal__body">
                <p className="pallmodal__eyebrow">
                  <span className="pallmodal__eyebrow-line" />
                  EXPLORE
                </p>

                <h2 className="pallmodal__heading">
                  ALL
                  <br />
                  <span>PROJECTS</span>
                </h2>

                <p className="pallmodal__desc">
                  A collection of my works across Cybersecurity, Full Stack,
                  Digital Forensics and more. Each project reflects my curiosity,
                  problem-solving mindset and passion for building a safer digital world.
                </p>

                <div className="pallmodal__tabs">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.key}
                      className={`pallmodal__tab${activeCategory === cat.key ? ' pallmodal__tab--active' : ''}`}
                      onClick={() => setActiveCategory(cat.key)}
                    >
                      <cat.Icon /> {cat.label}
                    </button>
                  ))}
                </div>

                {total === 0 ? (
                  <p className="pallmodal__empty">No projects in this category yet.</p>
                ) : (
                  <>
                    <div
                      className="pallmodal__carousel"
                      onTouchStart={onTouchStart}
                      onTouchEnd={onTouchEnd}
                    >
                      <button type="button" className="pallmodal__nav pallmodal__nav--prev" onClick={goPrev} aria-label="Previous project">
                        <BsChevronLeft />
                      </button>

                      <div className="pallmodal__track">
                        {filtered.map((project, idx) => {
                          const offset = wrapOffset(idx);
                          if (Math.abs(offset) > 1) return null;
                          const isActive = offset === 0;
                          return (
                            <div
                              key={project.title}
                              className={`pallmodal__card${isActive ? ' pallmodal__card--active' : ''}`}
                              style={{
                                '--pos': offset,
                                '--accent-a': project.accent[0],
                                '--accent-b': project.accent[1],
                              }}
                              aria-hidden={!isActive}
                            >
                              <div className="pallmodal__card-thumb">
                                <span className="pallmodal__card-thumb-body" />
                                <project.Icon className="pallmodal__card-thumb-icon" />
                                <span className="pallmodal__card-thumb-scrim" />

                                <span className="pallmodal__card-index">
                                  {pad(idx + 1)}
                                  {' '}
                                  /
                                  {' '}
                                  {pad(total)}
                                </span>
                                <button
                                  type="button"
                                  className="pallmodal__card-external"
                                  aria-label={`Open ${project.title}`}
                                  tabIndex={isActive ? 0 : -1}
                                  onClick={() => setDetailProject(project)}
                                >
                                  <BsBoxArrowUpRight />
                                </button>

                                <span className="pallmodal__card-thumb-text">
                                  <span className="pallmodal__card-thumb-title">{project.title}</span>
                                  <span className="pallmodal__card-thumb-sub">{project.subtitle}</span>
                                </span>
                              </div>

                              <div className="pallmodal__card-info">
                                <span className="pallmodal__card-cat">
                                  <span className="pallmodal__card-cat-dash" />
                                  {project.category.toUpperCase()}
                                </span>
                                <h3 className="pallmodal__card-title">{project.title}</h3>
                                <p className="pallmodal__card-desc">{project.description}</p>
                                <div className="pallmodal__card-tags">
                                  {project.tags.map((tag) => (
                                    <span key={tag} className="pallmodal__card-tag">{tag}</span>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  className="pallmodal__card-cta"
                                  tabIndex={isActive ? 0 : -1}
                                  onClick={() => setDetailProject(project)}
                                >
                                  View Project
                                  <BsArrowRight />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button type="button" className="pallmodal__nav pallmodal__nav--next" onClick={goNext} aria-label="Next project">
                        <BsChevronRight />
                      </button>
                    </div>

                    <div className="pallmodal__dots">
                      {filtered.map((project, idx) => (
                        <button
                          type="button"
                          key={project.title}
                          className={`pallmodal__dot${idx === activeIndex ? ' pallmodal__dot--active' : ''}`}
                          onClick={() => goTo(idx)}
                          aria-label={`Go to project ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <div className="pallmodal__swipehint">
                      <span className="pallmodal__swipehint-icons">
                        <BsArrowLeft />
                        <BsHandIndexThumb />
                        <BsArrowRight />
                      </span>
                      <span>Swipe to explore</span>
                    </div>
                  </>
                )}
              </div>

              <p className="pallmodal__footer pallmodal__footer--left">
                REAL PROJECTS.
                <br />
                REAL SKILLS.
                <br />
                REAL IMPACT.
              </p>
              <p className="pallmodal__footer pallmodal__footer--right">
                NEXT
                <br />
                BIG IDEA
                <br />
                SOON...
              </p>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      <ProjectDetailModal project={detailProject} onClose={() => setDetailProject(null)} />
    </>
  );
}

export default ProjectsAllModal;