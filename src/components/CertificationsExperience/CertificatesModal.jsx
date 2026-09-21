import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BsX, BsChevronLeft, BsChevronRight, BsAward, BsShieldLock, BsDiagram3,
  BsCloud, BsCodeSlash, BsGrid, BsCalendar3, BsPatchCheckFill, BsTagFill,
  BsKey, BsBoxArrowUpRight, BsShieldFillCheck,
} from 'react-icons/bs';
import certModalBg from '../../assets/images/certmodal-bg.webp';
import './CertificatesModal.css';

// Category → icon map, reused for tab pills + card badges + detail tag
const CATEGORY_ICONS = {
  'All Certificates': BsAward,
  Cybersecurity: BsShieldLock,
  Networking: BsDiagram3,
  Cloud: BsCloud,
  Development: BsCodeSlash,
  Other: BsGrid,
};

const CATEGORIES = ['All Certificates', 'Cybersecurity', 'Networking', 'Cloud', 'Development', 'Other'];

function CertificatesModal({
  isOpen, onClose, certifications, stats, quote, initialTitle,
}) {
  const [activeCategory, setActiveCategory] = useState('All Certificates');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCredential, setShowCredential] = useState(false);

  // Jab kisi specific card se modal khola gaya ho (preview list se click),
  // usi certificate ko seedha carousel me active karke dikhao
  useEffect(() => {
    if (!isOpen || !initialTitle) return;
    setActiveCategory('All Certificates');
    const idx = certifications.findIndex((c) => c.title === initialTitle);
    setActiveIndex(idx >= 0 ? idx : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialTitle]);

  // Lock body scroll while modal is open, close on Escape — pins the page at
  // its current scroll position (instead of just hiding overflow) so the
  // background doesn't jump/shift when the modal opens or closes.
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

  const filtered = useMemo(
    () => (activeCategory === 'All Certificates'
      ? certifications
      : certifications.filter((c) => c.category === activeCategory)),
    [certifications, activeCategory],
  );

  // Close the credential preview whenever the active card changes, so it
  // doesn't stay open showing a stale certificate after switching
  useEffect(() => {
    setShowCredential(false);
  }, [activeIndex, activeCategory]);

  const total = filtered.length;
  const active = total > 0 ? filtered[activeIndex] : null;

  const goTo = (idx) => {
    if (total === 0) return;
    setActiveIndex(((idx % total) + total) % total);
  };
  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  // Shortest signed distance from activeIndex on a circular track — this is
  // what makes prev/next feel like a real slide: every card's --pos shifts
  // by exactly ±1 each click, so the transform transition animates smoothly
  // instead of cards being swapped/remounted.
  const wrapOffset = (idx) => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="certmodal__overlay"
          onClick={onClose}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            className="certmodal__frame"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="certmodal__glow-ring" aria-hidden="true" />
        <div
          className="certmodal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="All certifications"
          style={{ backgroundImage: `url(${certModalBg})` }}
        >
        <div className="certmodal__scrim" aria-hidden="true" />

        {/* Hidden while the credential preview is open, so it doesn't sit on
            top of / overlap with that card's own close button */}
        {!showCredential && (
          <button type="button" className="certmodal__close" onClick={onClose} aria-label="Close">
            <BsX />
          </button>
        )}

        <p className="certmodal__topright">
          // SMALL<br />STEPS<br />BIG<br />OPPORTUNITIES
        </p>

        <div className="certmodal__layout">
          {/* ---------- Sidebar ---------- */}
          <aside className="certmodal__sidebar">
            <p className="certmodal__eyebrow">
              <span className="certmodal__eyebrow-line" /> CERTIFICATIONS
            </p>
            <h2 className="certmodal__heading">
              Proof of<br /><span>Growth</span>
            </h2>
            <p className="certmodal__desc">
              A collection of industry-recognized certifications that validate my skills,
              knowledge and commitment to continuous learning.
            </p>

            <div className="certmodal__stats">
              {stats.map((s) => (
                <div className="certmodal__stat" key={s.label}>
                  <span className="certmodal__stat-icon">{s.icon}</span>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <blockquote className="certmodal__quote">
              <span className="certmodal__quote-mark">&ldquo;</span>
              {quote.text}
              <cite>— {quote.author}</cite>
            </blockquote>
          </aside>

          {/* ---------- Main: tabs + carousel + detail ---------- */}
          <div className="certmodal__main">
            <div className="certmodal__tabs">
              {CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                return (
                  <button
                    type="button"
                    key={cat}
                    className={`certmodal__tab${activeCategory === cat ? ' certmodal__tab--active' : ''}`}
                    onClick={() => { setActiveCategory(cat); setActiveIndex(0); }}
                  >
                    <Icon /> {cat}
                  </button>
                );
              })}
            </div>

            {total === 0 ? (
              <p className="certmodal__empty">No certifications in this category yet.</p>
            ) : (
              <>
                <div className="certmodal__carousel">
                  <button type="button" className="certmodal__nav certmodal__nav--prev" onClick={goPrev} aria-label="Previous">
                    <BsChevronLeft />
                  </button>

                  <div className="certmodal__orbit">
                    {filtered.map((cert, idx) => {
                      const Icon = CATEGORY_ICONS[cert.category] || BsAward;
                      const offset = wrapOffset(idx);
                      const isActive = offset === 0;
                      const isNear = Math.abs(offset) <= 1;
                      return (
                        <button
                          type="button"
                          key={cert.title}
                          className={`certmodal__orbit-card${isActive ? ' certmodal__orbit-card--active' : ''}`}
                          style={{ '--pos': offset, pointerEvents: isNear ? 'auto' : 'none' }}
                          aria-hidden={!isNear}
                          tabIndex={isNear ? 0 : -1}
                          onClick={() => goTo(idx)}
                        >
                          <span className={`certmodal__orbit-badge${isActive ? ' certmodal__orbit-badge--active' : ''}`}>
                            <BsPatchCheckFill />
                          </span>
                          <span className="certmodal__orbit-icon">
                            {cert.issuerLogo ? (
                              <img src={cert.issuerLogo} alt="" className="certmodal__orbit-logo" />
                            ) : (
                              <Icon />
                            )}
                          </span>
                          <span className="certmodal__orbit-title">{cert.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button type="button" className="certmodal__nav certmodal__nav--next" onClick={goNext} aria-label="Next">
                    <BsChevronRight />
                  </button>
                </div>

                <div className="certmodal__progress">
                  <div className="certmodal__progress-track">
                    <div
                      className="certmodal__progress-fill"
                      style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
                    />
                  </div>
                  <span className="certmodal__progress-count">
                    {pad(activeIndex + 1)} / {pad(total)}
                  </span>
                </div>

                {/* ---------- Detail panel for the active card ---------- */}
                {active && (
                  <>
                  <div className="certmodal__detail" key={`${active.title}-${activeIndex}`}>
                    <div className={`certmodal__detail-art${active.image ? ' certmodal__detail-art--has-image' : ''}`}>
                      {active.image ? (
                        <img src={active.image} alt={active.title} className="certmodal__detail-art-img" />
                      ) : (
                        <>
                          <span className="certmodal__detail-art-icon">
                            {active.issuerLogo ? (
                              <img src={active.issuerLogo} alt="" className="certmodal__detail-art-logo" />
                            ) : (
                              (() => {
                                const Icon = CATEGORY_ICONS[active.category] || BsAward;
                                return <Icon />;
                              })()
                            )}
                          </span>
                          <p className="certmodal__detail-art-title">{active.title}</p>
                          <p className="certmodal__detail-art-issuer">{active.issuer}</p>
                        </>
                      )}
                    </div>

                    <div className="certmodal__detail-info">
                      <span className="certmodal__detail-tag">
                        {(() => {
                          const Icon = CATEGORY_ICONS[active.category] || BsAward;
                          return <Icon />;
                        })()}
                        {active.category}
                      </span>
                      <h3>{active.title}</h3>
                      <p className="certmodal__detail-issuer">{active.issuer}</p>
                      <p className="certmodal__detail-desc">{active.description}</p>

                      <div className="certmodal__detail-actions">
                        <button
                          type="button"
                          className="certmodal__btn certmodal__btn--primary"
                          onClick={() => setShowCredential(true)}
                        >
                          View Credential <BsBoxArrowUpRight />
                        </button>
                      </div>
                    </div>

                    <div className="certmodal__detail-meta">
                      <div className="certmodal__meta-row">
                        <BsCalendar3 />
                        <div>
                          <span>Issued</span>
                          <strong>{active.date}</strong>
                        </div>
                      </div>
                      <div className="certmodal__meta-row">
                        <BsShieldFillCheck />
                        <div>
                          <span>Status</span>
                          <strong className="certmodal__meta-ok">Verified</strong>
                        </div>
                      </div>
                      <div className="certmodal__meta-row">
                        <BsTagFill />
                        <div>
                          <span>Category</span>
                          <strong>{active.category}</strong>
                        </div>
                      </div>
                      <div className="certmodal__meta-row">
                        <BsKey />
                        <div>
                          <span>Credential ID</span>
                          <strong>{active.credentialId}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ---------- "View Credential" square image preview ---------- */}
                  {showCredential && (
                    <div
                      className="certmodal__cred-overlay"
                      role="presentation"
                      onClick={() => setShowCredential(false)}
                    >
                      <div
                        className="certmodal__cred-card"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${active.title} certificate`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="certmodal__cred-close"
                          onClick={() => setShowCredential(false)}
                          aria-label="Close"
                        >
                          <BsX />
                        </button>

                        <div className="certmodal__cred-image">
                          {active.image ? (
                            <img src={active.image} alt={active.title} />
                          ) : (
                            <>
                              <span className="certmodal__cred-image-icon">
                                {(() => {
                                  const Icon = CATEGORY_ICONS[active.category] || BsAward;
                                  return <Icon />;
                                })()}
                              </span>
                              <p className="certmodal__cred-image-title">{active.title}</p>
                            </>
                          )}
                        </div>

                        <p className="certmodal__cred-caption">
                          {active.issuer} <span>•</span> {active.date}
                        </p>
                      </div>
                    </div>
                  )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CertificatesModal;