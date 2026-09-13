import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BsArrowLeft, BsX, BsChevronLeft, BsChevronRight,
  BsCalendar3, BsPersonFill, BsGithub, BsFileEarmarkText, BsPlayFill,
  BsBoxArrowUpRight, BsQuote,
} from 'react-icons/bs';
import projectDetailBg from '../../assets/images/project-detail-bg.webp';
import './ProjectDetailModal.css';

// ---- Same RR logo used everywhere else in the modals ----
function RRLogoMini() {
  return (
    <svg viewBox="0 0 120 70" className="pdetail__brand-logo" fill="none">
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

// A placeholder "screenshot" — a small fake dashboard drawn in CSS so the
// carousel has something to show even before real product screenshots
// are available. Driven off project data so different projects can show
// different quick-stats inside the same frame. Each slide index renders a
// different fake screen (Dashboard / Scan / Results / Findings / Settings)
// so it's visually obvious the carousel is actually moving between slides.
const FRAME_NAV = ['Dashboard', 'Scan', 'Results', 'Findings', 'Settings'];

const FRAME_VARIANTS = [
  {
    headline: 'Dashboard overview',
    sub: 'Everything at a glance the moment a scan finishes.',
  },
  {
    headline: 'Scan in progress…',
    sub: 'Crawling open ports and services in real time.',
  },
  {
    headline: 'Results summary',
    sub: 'Every finding grouped by severity, ready to export.',
  },
  {
    headline: 'Findings detail',
    sub: 'Drill into a single vulnerability for full context.',
  },
  {
    headline: 'Settings & config',
    sub: 'Tune scan depth, timeouts, and reporting options.',
  },
];

function ScreenshotFrame({ project, slide = 0 }) {
  const stats = project.detail?.stats || [];
  const activeNav = slide % FRAME_NAV.length;
  const variant = FRAME_VARIANTS[slide % FRAME_VARIANTS.length];

  return (
    <div className="pdetail__frame">
      <div className="pdetail__frame-topbar">
        <span className="pdetail__frame-brand">
          <span className="pdetail__frame-brand-dot" />
          {project.title}
        </span>
        <span className="pdetail__frame-user">
          {project.detail?.type || 'Personal Project'}
        </span>
      </div>
      <div className="pdetail__frame-body">
        <aside className="pdetail__frame-nav">
          {FRAME_NAV.map((item, i) => (
            <span key={item} className={`pdetail__frame-nav-item${i === activeNav ? ' pdetail__frame-nav-item--active' : ''}`}>
              {item}
            </span>
          ))}
        </aside>
        <div className="pdetail__frame-main">
          <p className="pdetail__frame-headline">{variant.headline}</p>
          <p className="pdetail__frame-sub">{variant.sub}</p>
          {stats.length > 0 && (
            <div className="pdetail__frame-stats">
              {stats.map((s) => (
                <div key={s.label} className="pdetail__frame-stat">
                  <span className={`pdetail__frame-stat-value${s.accent ? ' pdetail__frame-stat-value--accent' : ''}`}>
                    {s.value}
                  </span>
                  <span className="pdetail__frame-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectDetailModal({ project, onClose }) {
  const isOpen = Boolean(project);
  const [slide, setSlide] = useState(0);
  const touchState = useRef({ x: 0, tracking: false });
  const slideCount = project?.detail?.screenshotCount || 5;

  // Same body-scroll-lock technique used across the other modals so the
  // page underneath doesn't jump when this one opens/closes.
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

    setSlide(0);

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

  if (!project) return null;

  const goTo = (idx) => setSlide(((idx % slideCount) + slideCount) % slideCount);
  const goPrev = () => goTo(slide - 1);
  const goNext = () => goTo(slide + 1);

  const onTouchStart = (e) => {
    touchState.current = { x: e.touches[0].clientX, tracking: true };
  };
  const onTouchEnd = (e) => {
    if (!touchState.current.tracking) return;
    const dx = e.changedTouches[0].clientX - touchState.current.x;
    touchState.current.tracking = false;
    if (Math.abs(dx) < 30) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const pad = (n) => String(n).padStart(2, '0');
  const detail = project.detail || {};
  const links = detail.links || {};
  const features = detail.features || [];
  const hasLinks = Boolean(links.live || links.code || links.docs);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="pdetail__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} details`}
        >
          <motion.div
            className="pdetail"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pdetail__inner">
              <div
                className="pdetail__bg"
                style={{ backgroundImage: `url(${projectDetailBg})` }}
              />
              <div className="pdetail__mask" aria-hidden="true" />

              {/* ---------- Top bar: logo + tagline, menu (also closes) ---------- */}
              <div className="pdetail__topbar">
                <div className="pdetail__brand">
                  <RRLogoMini />
                  <div className="pdetail__brand-text">
                    <span className="pdetail__brand-name">RUDRAJIT ROY</span>
                  </div>
                </div>
                <button type="button" className="pdetail__menu" onClick={onClose} aria-label="Close">
                  <BsX />
                </button>
              </div>

              <button type="button" className="pdetail__back" onClick={onClose}>
                <BsArrowLeft />
                {' '}
                BACK TO PROJECTS
              </button>

              {/* ---------- Intro: category, title, subtitle, desc, meta ---------- */}
              <div className="pdetail__intro">
                <p className="pdetail__eyebrow">
                  <span className="pdetail__eyebrow-line" />
                  {project.category.toUpperCase()}
                </p>

                <h1 className="pdetail__title">
                  {project.title}
                  {detail.version && (
                    <span className="pdetail__version">{detail.version}</span>
                  )}
                </h1>

                <p className="pdetail__subtitle">{project.subtitle}</p>
                <p className="pdetail__desc">{project.description}</p>

                <div className="pdetail__meta">
                  {detail.status && (
                    <span className="pdetail__meta-item">
                      <span className="pdetail__meta-dot" />
                      {detail.status}
                    </span>
                  )}
                  {detail.date && (
                    <span className="pdetail__meta-item">
                      <BsCalendar3 />
                      {detail.date}
                    </span>
                  )}
                  {detail.type && (
                    <span className="pdetail__meta-item">
                      <BsPersonFill />
                      {detail.type}
                    </span>
                  )}
                </div>
              </div>

              {/* ---------- Screenshot carousel ---------- */}
              <div className="pdetail__carousel-row">
                <div
                  className="pdetail__carousel"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  style={{ '--accent-a': project.accent[0], '--accent-b': project.accent[1] }}
                >
                  <button type="button" className="pdetail__nav pdetail__nav--prev" onClick={goPrev} aria-label="Previous screenshot">
                    <BsChevronLeft />
                  </button>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <ScreenshotFrame project={project} slide={slide} />
                    </motion.div>
                  </AnimatePresence>

                  <button type="button" className="pdetail__nav pdetail__nav--next" onClick={goNext} aria-label="Next screenshot">
                    <BsChevronRight />
                  </button>
                </div>

                <div className="pdetail__carousel-foot">
                  <div className="pdetail__dots">
                    {Array.from({ length: slideCount }).map((_, idx) => (
                      <button
                        // eslint-disable-next-line react/no-array-index-key
                        key={idx}
                        type="button"
                        className={`pdetail__dot${idx === slide ? ' pdetail__dot--active' : ''}`}
                        onClick={() => goTo(idx)}
                        aria-label={`Go to screenshot ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="pdetail__slide-count">
                    {pad(slide + 1)}
                    {' '}
                    /
                    {' '}
                    {pad(slideCount)}
                  </span>
                </div>
              </div>

              {/* ---------- Flat body: features, stack, links, quote ---------- */}
              <div className="pdetail__content">
                {features.length > 0 && (
                  <section className="pdetail__section pdetail__section--features">
                    <p className="pdetail__section-title">
                      <span className="pdetail__section-dash" />
                      Key Features
                    </p>
                    <div className="pdetail__features">
                      {features.map((f) => (
                        <div key={f.title} className="pdetail__feature">
                          <span className="pdetail__feature-icon"><f.Icon /></span>
                          <h4 className="pdetail__feature-title">{f.title}</h4>
                          <p className="pdetail__feature-desc">{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="pdetail__section pdetail__section--stack">
                  <p className="pdetail__section-title">
                    <span className="pdetail__section-dash" />
                    Tech Stack
                  </p>
                  <div className="pdetail__stack">
                    {project.tags.map((tagName) => (
                      <span key={tagName} className="pdetail__stack-pill">{tagName}</span>
                    ))}
                  </div>
                </section>

                {hasLinks && (
                  <div className="pdetail__links">
                    {links.live && (
                      <a href={links.live} target="_blank" rel="noreferrer" className="pdetail__link pdetail__link--primary">
                        <BsPlayFill />
                        {' '}
                        View Live
                        <BsBoxArrowUpRight />
                      </a>
                    )}
                    {links.code && (
                      <a href={links.code} target="_blank" rel="noreferrer" className="pdetail__link">
                        <BsGithub />
                        {' '}
                        View Code
                        <BsBoxArrowUpRight />
                      </a>
                    )}
                    {links.docs && (
                      <a href={links.docs} target="_blank" rel="noreferrer" className="pdetail__link">
                        <BsFileEarmarkText />
                        {' '}
                        Docs
                        <BsBoxArrowUpRight />
                      </a>
                    )}
                  </div>
                )}

                {detail.quote && (
                  <div className="pdetail__quote">
                    <BsQuote className="pdetail__quote-icon" />
                    <p className="pdetail__quote-text">{detail.quote}</p>
                  </div>
                )}

                <div className="pdetail__spacer" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProjectDetailModal;