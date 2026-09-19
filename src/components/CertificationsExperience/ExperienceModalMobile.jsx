import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BsX, BsBriefcaseFill, BsBarChartFill, BsPatchCheckFill, BsInfinity,
  BsChevronRight,
} from 'react-icons/bs';
import expModalMobileBg from '../../assets/images/expmodal-mobile-bg.webp';
import './ExperienceModalMobile.css';

// status → badge color modifier (kept independent of the label text itself,
// so any future status value just falls back to the neutral/default look)
const STATUS_BADGE = {
  Present: 'expmm__badge--current',
  Internship: 'expmm__badge--internship',
  Freelance: 'expmm__badge--freelance',
};

// "Organization / Context Placeholder" -> "OC" — used as a stand-in logo
// mark on the card's visual panel until real company logos are wired in.
function getInitials(org) {
  const words = org.replace(/[/&-]/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '??';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function ExperienceModalMobile({ isOpen, onClose, experience, quote }) {
  const [activeStatus, setActiveStatus] = useState('All');

  // Lock body scroll while modal is open, close on Escape — same pinned-scroll
  // approach as the other mobile modals so the page doesn't jump on open/close.
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

  // Reset the filter every time the modal is (re)opened
  useEffect(() => {
    if (isOpen) setActiveStatus('All');
  }, [isOpen]);

  // Filter tabs, built straight from whatever status values actually exist
  // in the data — "All" first, then each one in first-seen order with a count
  const categories = useMemo(() => {
    const seen = [];
    experience.forEach((exp) => {
      if (!seen.includes(exp.status)) seen.push(exp.status);
    });
    return [
      { key: 'All', count: experience.length },
      ...seen.map((status) => ({
        key: status,
        count: experience.filter((exp) => exp.status === status).length,
      })),
    ];
  }, [experience]);

  const filtered = useMemo(
    () => (activeStatus === 'All' ? experience : experience.filter((exp) => exp.status === activeStatus)),
    [experience, activeStatus],
  );

  const stats = useMemo(() => [
    { label: 'Experiences', value: `${experience.length}+`, icon: <BsBriefcaseFill /> },
    { label: 'Domains', value: `${new Set(experience.map((e) => e.status)).size}`, icon: <BsBarChartFill /> },
    { label: 'Growth', value: '100%', icon: <BsPatchCheckFill /> },
    { label: 'Always Learning', value: '∞', icon: <BsInfinity /> },
  ], [experience]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="expmm__overlay"
          onClick={onClose}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            className="expmm__frame"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="expmm"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Full experience timeline"
              style={{ backgroundImage: `url(${expModalMobileBg})` }}
            >
              <div className="expmm__scrim" aria-hidden="true" />

              <button type="button" className="expmm__close" onClick={onClose} aria-label="Close">
                <BsX />
              </button>

              <div className="expmm__layout">
                {/* ---------- Header: eyebrow + heading + description ---------- */}
                <header className="expmm__sidebar">
                  <p className="expmm__eyebrow">
                    <span className="expmm__eyebrow-line" /> EXPERIENCE
                  </p>
                  <h2 className="expmm__heading">
                    My<br /><span>Journey</span>
                  </h2>
                  <p className="expmm__desc">
                    A timeline of roles, learnings and real world experiences.
                  </p>
                </header>

                {/* ---------- Filter tabs ---------- */}
                <div className="expmm__tabs">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.key}
                      className={`expmm__tab${activeStatus === cat.key ? ' expmm__tab--active' : ''}`}
                      onClick={() => setActiveStatus(cat.key)}
                    >
                      {cat.key} <span className="expmm__tab-count">({cat.count})</span>
                    </button>
                  ))}
                </div>

                {/* ---------- Stats row ---------- */}
                <div className="expmm__stats">
                  {stats.map((s) => (
                    <div className="expmm__stat" key={s.label}>
                      <span className="expmm__stat-icon">{s.icon}</span>
                      <strong>{s.value}</strong>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>

                {quote && (
                  <blockquote className="expmm__quote">
                    {quote.text}
                    <cite>— {quote.author}</cite>
                  </blockquote>
                )}

                {/* ---------- Boxed panel: scrollable list of full cards ---------- */}
                <div className="expmm__panel">
                  <div className="expmm__panel-inner">
                    {filtered.length === 0 ? (
                      <p className="expmm__empty">No experience matches this filter.</p>
                    ) : (
                      <div className="expmm__list">
                        {filtered.map((exp, idx) => {
                          const isCurrent = /present/i.test(exp.dateRange);
                          const badgeClass = STATUS_BADGE[exp.status] || 'expmm__badge--default';
                          return (
                            <div className="expmm__row" key={`${exp.role}-${exp.dateRange}`}>
                              {/* date sits to the left of the timeline dot */}
                              <span className="expmm__rail-date">{exp.dateRange}</span>

                              {/* rail: continuous dotted line + dot, sibling of the
                                  card so the stroke never gets interrupted by it */}
                              <span className="expmm__rail">
                                {idx !== 0 && <span className="expmm__rail-line expmm__rail-line--top" />}
                                <span className={`expmm__rail-dot${isCurrent ? ' expmm__rail-dot--current' : ''}`} />
                                {idx !== filtered.length - 1 && <span className="expmm__rail-line expmm__rail-line--bottom" />}
                                {isCurrent && <span className="expmm__current-pill expmm__current-pill--rail">Current</span>}
                              </span>

                              <div className="expmm__card">
                                <div className="expmm__card-main">
                                  <span className={`expmm__badge ${badgeClass}`}>
                                    <span className="expmm__badge-dot" />
                                    {exp.status}
                                  </span>

                                  <h3 className="expmm__card-role">{exp.role}</h3>
                                  <p className="expmm__card-org">{exp.org}</p>
                                  <p className="expmm__card-desc">{exp.description}</p>

                                  {exp.tags?.length > 0 && (
                                    <div className="expmm__card-tags">
                                      {exp.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className="expmm__card-tag">{tag}</span>
                                      ))}
                                      {exp.tags.length > 3 && (
                                        <span className="expmm__card-tag expmm__card-tag--more">
                                          +{exp.tags.length - 3}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div className="expmm__card-visual">
                                  <span className="expmm__card-visual-mark">{getInitials(exp.org)}</span>
                                  <span className="expmm__card-visual-org">{exp.org}</span>
                                  <button
                                    type="button"
                                    className="expmm__card-arrow"
                                    aria-label={`View ${exp.role} details`}
                                  >
                                    <BsChevronRight />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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

export default ExperienceModalMobile;