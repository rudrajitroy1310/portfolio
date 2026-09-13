import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BsX, BsChevronRight, BsBriefcaseFill, BsCalendar3, BsBarChartFill,
  BsShieldFillCheck, BsTools,
} from 'react-icons/bs';
import expModalBg from '../../assets/images/expmodal-bg.webp';
import './ExperienceModal.css';

function ExperienceModal({ isOpen, onClose, experience, quote }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Lock body scroll while modal is open, close on Escape — same pinned-scroll
  // approach as CertificatesModal so the page doesn't jump on open/close.
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
      // html has `scroll-behavior: smooth` globally (for nav links) — without
      // forcing 'auto' here, this restore scroll would animate from the top
      // instead of snapping back instantly to where the user was.
      const prevScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = prevScrollBehavior;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset to the first (most recent) role whenever the modal is (re)opened
  useEffect(() => {
    if (isOpen) setActiveIndex(0);
  }, [isOpen]);

  // isOpen false hone par bhi hooks upar already chal chuke hain (rules-of-hooks safe);
  // sirf render guard yahan hai — active na ho toh AnimatePresence exit ke dauraan
  // bhi crash na ho (activeIndex reset hone se pehle wala frame).
  const active = experience[activeIndex] || experience[0];
  const MAX_VISIBLE_TOOLS = 5;
  const visibleTools = active.tools?.slice(0, MAX_VISIBLE_TOOLS) || [];
  const extraToolsCount = (active.tools?.length || 0) - visibleTools.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="expmodal__overlay"
          onClick={onClose}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            className="expmodal__frame"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="expmodal__glow-ring" aria-hidden="true" />
        <div
          className="expmodal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Full experience timeline"
          style={{ backgroundImage: `url(${expModalBg})` }}
        >
          <div className="expmodal__scrim" aria-hidden="true" />

          <button type="button" className="expmodal__close" onClick={onClose} aria-label="Close">
            <BsX />
          </button>

          <p className="expmodal__topright">
            SAME<br />GUY<br />HIGHER<br />GOALS<br />//
            <em className="expmodal__corner-underline" />
          </p>
          <p className="expmodal__bottomright">
            DISCIPLINE<br />BUILDS<br />FREEDOM<br />//
            <em className="expmodal__corner-underline" />
          </p>

          <div className="expmodal__layout">
            {/* ---------- Sidebar: timeline list ---------- */}
            <aside className="expmodal__sidebar">
              <p className="expmodal__eyebrow">
                <span className="expmodal__eyebrow-line" /> EXPERIENCE
              </p>
              <h2 className="expmodal__heading">
                My<br /><span>Journey</span>
              </h2>
              <p className="expmodal__desc">
                A timeline of roles, learnings and real world experiences.
              </p>

              <div className="expmodal__timeline">
                {experience.map((exp, idx) => (
                  <button
                    type="button"
                    key={`${exp.role}-${exp.dateRange}`}
                    className={`expmodal__timeline-item${idx === activeIndex ? ' expmodal__timeline-item--active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <span className="expmodal__timeline-rail">
                      {idx !== 0 && <span className="expmodal__timeline-line-top" />}
                      <span className="expmodal__timeline-dot" />
                      {idx !== experience.length - 1 && <span className="expmodal__timeline-line-bottom" />}
                    </span>

                    <span className="expmodal__timeline-card">
                      <span className="expmodal__timeline-body">
                        <span className="expmodal__timeline-date">{exp.dateRange}</span>
                        <span className="expmodal__timeline-role">{exp.role}</span>
                        <span className="expmodal__timeline-org">{exp.org}</span>
                      </span>

                      <BsChevronRight className="expmodal__timeline-chevron" />
                    </span>
                  </button>
                ))}
              </div>

              {quote && (
                <blockquote className="expmodal__quote">
                  <span className="expmodal__quote-mark">&ldquo;</span>
                  {quote.text}
                  <cite>— {quote.author}</cite>
                </blockquote>
              )}
            </aside>

            {/* ---------- Main: detail panel for the active role ---------- */}
            <div className="expmodal__main">
              <div className="expmodal__detail" key={activeIndex}>
                <div className="expmodal__detail-top">
                  <span className="expmodal__detail-logo">
                    <BsBriefcaseFill />
                  </span>

                  <div className="expmodal__detail-head">
                    <div className="expmodal__detail-head-top">
                      <span className="expmodal__status-pill">{active.status}</span>
                      <span className="expmodal__detail-date">
                        <BsCalendar3 /> {active.dateRange}
                      </span>
                    </div>
                    <h3>{active.role}</h3>
                    <p className="expmodal__detail-org">{active.org}</p>

                    <p className="expmodal__detail-desc">{active.description}</p>
                  </div>
                </div>

                {active.tags?.length > 0 && (
                  <div className="expmodal__tags">
                    {active.tags.map((tag) => (
                      <span className="expmodal__tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                )}

                <div className="expmodal__box">
                  <div className="expmodal__box-head">
                    <span className="expmodal__box-icon"><BsBarChartFill /></span>
                    <h4>Key Contributions</h4>
                  </div>
                  <ul className="expmodal__contrib-list">
                    {active.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>

                {visibleTools.length > 0 && (
                  <div className="expmodal__box">
                    <div className="expmodal__box-head">
                      <span className="expmodal__box-icon"><BsTools /></span>
                      <h4>Tools &amp; Technologies</h4>
                    </div>
                    <div className="expmodal__tools-grid">
                      {visibleTools.map((tool) => (
                        <div className="expmodal__tool" key={tool.name}>
                          <span className="expmodal__tool-icon">
                            {typeof tool.icon === 'string' ? (
                              <img src={tool.icon} alt="" />
                            ) : (
                              tool.icon || <BsShieldFillCheck />
                            )}
                          </span>
                          <span>{tool.name}</span>
                        </div>
                      ))}
                      {extraToolsCount > 0 && (
                        <div className="expmodal__tool expmodal__tool--more">
                          <span className="expmodal__tool-icon">+{extraToolsCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ExperienceModal;