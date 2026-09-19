import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BsX, BsAward, BsShieldLock, BsDiagram3,
  BsCloud, BsCodeSlash, BsGrid, BsCalendar3, BsPatchCheckFill,
  BsSearch, BsSliders, BsArrowUpRight, BsShieldFillCheck,
  BsStarFill, BsInfinity,
} from 'react-icons/bs';
import certModalMobileBg from '../../assets/images/certmodal-mobile-bg.webp';
import './CertificatesModalMobile.css';

// Category → icon map, reused for tab pills + card icons
const CATEGORY_ICONS = {
  'All Certificates': BsAward,
  Cybersecurity: BsShieldLock,
  Networking: BsDiagram3,
  Cloud: BsCloud,
  Development: BsCodeSlash,
  Other: BsGrid,
};

const CATEGORIES = ['All Certificates', 'Cybersecurity', 'Networking', 'Cloud', 'Development', 'Other'];

function CertificatesModalMobile({
  isOpen, onClose, certifications, stats, quote, initialTitle,
}) {
  const [activeCategory, setActiveCategory] = useState('All Certificates');
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' | 'oldest'
  const miniGridRef = useRef(null);
  const activeCardRef = useRef(null);

  // Jab kisi specific card se modal khola gaya ho (preview carousel se tap),
  // usi certificate ko seedha overview me select karke dikhao — filter/search
  // ko clear karke, taaki wo card list me zaroor mile
  useEffect(() => {
    if (!isOpen) return;
    if (initialTitle) {
      setActiveCategory('All Certificates');
      setSearch('');
      setSelectedTitle(initialTitle);
    } else {
      setSelectedTitle(null);
    }
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

  // Pulls a 4-digit year out of the "Month 2024"-style date string so
  // certificates can be sorted newest/oldest without a real Date value
  const yearOf = (dateStr) => parseInt((dateStr || '').match(/\d{4}/)?.[0], 10) || 0;

  const filtered = useMemo(() => {
    let list = activeCategory === 'All Certificates'
      ? certifications
      : certifications.filter((c) => c.category === activeCategory);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) => c.title.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => (sortOrder === 'latest'
      ? yearOf(b.date) - yearOf(a.date)
      : yearOf(a.date) - yearOf(b.date)));
  }, [certifications, activeCategory, search, sortOrder]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSelectedTitle(null);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSortOrder('latest');
  };

  // Whichever card was tapped drives the overview column — defaults to the
  // first certificate in the current filter so the overview is never empty
  const active = useMemo(
    () => filtered.find((c) => c.title === selectedTitle) || filtered[0] || null,
    [filtered, selectedTitle],
  );

  // Left column (mini-grid) apne aap scroll ho ke active card ko view me le
  // aaye — chahe wo tap se select hua ho ya modal khulte hi (initialTitle se)
  // preselect ho. Scroll sirf grid ke andar hota hai, page/modal nahi hilta.
  useEffect(() => {
    const grid = miniGridRef.current;
    const card = activeCardRef.current;
    if (!grid || !card) return;
    const cardTop = card.offsetTop;
    const cardBottom = cardTop + card.offsetHeight;
    const viewTop = grid.scrollTop;
    const viewBottom = viewTop + grid.clientHeight;

    if (cardTop < viewTop || cardBottom > viewBottom) {
      const target = cardTop - (grid.clientHeight - card.offsetHeight) / 2;
      grid.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    }
  }, [active]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="certmodalm__overlay"
          onClick={onClose}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            className="certmodalm__frame"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="certmodalm__glow-ring" aria-hidden="true" />
        <div
          className="certmodalm"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="All certifications"
          style={{ backgroundImage: `url(${certModalMobileBg})` }}
        >
        <div className="certmodalm__scrim" aria-hidden="true" />

        <button type="button" className="certmodalm__close" onClick={onClose} aria-label="Close">
          <BsX />
        </button>

        <div className="certmodalm__layout">
          {/* ---------- Header: eyebrow + heading + description + quote + stats ---------- */}
          <header className="certmodalm__sidebar">
            <p className="certmodalm__eyebrow">
              <span className="certmodalm__eyebrow-line" /> CERTIFICATIONS
            </p>
            <h2 className="certmodalm__heading">
              Proof of<br /><span>Growth</span>
            </h2>

            <p className="certmodalm__desc">
              A collection of industry-recognized certifications that validate my skills,
              knowledge and commitment to continuous learning.
            </p>

            {quote && (
              <blockquote className="certmodalm__quote">
                {quote.text}
                <cite>— {quote.author}</cite>
              </blockquote>
            )}

            <div className="certmodalm__stats">
              {[...stats, { label: 'Always Learning', value: '∞', icon: <BsInfinity /> }].map((s) => (
                <div className="certmodalm__stat" key={s.label}>
                  <span className="certmodalm__stat-icon">{s.icon}</span>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </header>

          {/* ---------- Main: boxed panel containing tabs + grid/overview ---------- */}
          <div className="certmodalm__main">
            <div className="certmodalm__panel">
              <div className="certmodalm__panel-inner">
                <div className="certmodalm__search-row">
                  <div className="certmodalm__search">
                    <BsSearch />
                    <input
                      type="text"
                      placeholder="Search certificates..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="certmodalm__search-reset"
                    onClick={handleResetFilters}
                    aria-label="Reset search and sort"
                  >
                    <BsSliders />
                  </button>
                  <label className="certmodalm__sort">
                    <span>Sort</span>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                      <option value="latest">Latest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                  </label>
                </div>

                <div className="certmodalm__tabs">
                  {CATEGORIES.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat];
                    return (
                      <button
                        type="button"
                        key={cat}
                        className={`certmodalm__tab${activeCategory === cat ? ' certmodalm__tab--active' : ''}`}
                        onClick={() => handleCategoryChange(cat)}
                      >
                        <Icon /> {cat}
                      </button>
                    );
                  })}
                </div>

                {filtered.length === 0 ? (
                  <p className="certmodalm__empty">No certifications match this filter.</p>
                ) : (
                  <div className="certmodalm__panel-body">
                    {/* Left: 2-column grid of compact certificate cards */}
                    <div className="certmodalm__mini-grid" ref={miniGridRef}>
                      {filtered.map((cert, idx) => {
                        const Icon = CATEGORY_ICONS[cert.category] || BsAward;
                        const isActive = active && cert.title === active.title;
                        return (
                          <button
                            type="button"
                            key={cert.title}
                            ref={isActive ? activeCardRef : null}
                            className={`certmodalm__mini-card${isActive ? ' certmodalm__mini-card--active' : ''}`}
                            onClick={() => setSelectedTitle(cert.title)}
                            aria-pressed={isActive}
                            aria-label={cert.title}
                          >
                            <div className="certmodalm__mini-thumb">
                              <div className="certmodalm__mini-top">
                                <span className="certmodalm__mini-index">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                                <span className="certmodalm__mini-verified">
                                  <BsPatchCheckFill />
                                </span>
                              </div>
                              {cert.image ? (
                                <img src={cert.image} alt="" loading="lazy" />
                              ) : (
                                <span className="certmodalm__mini-thumb-fallback">
                                  <Icon />
                                </span>
                              )}
                            </div>

                            <p className="certmodalm__mini-title">{cert.title}</p>
                            <p className="certmodalm__mini-issuer">{cert.issuer}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: overview of whichever card is currently selected */}
                    {active && (
                      <div className="certmodalm__overview" key={active.title}>
                        <p className="certmodalm__overview-label">
                          <BsStarFill /> Featured Certificate
                        </p>

                        <div className="certmodalm__overview-thumb">
                          {active.image ? (
                            <img src={active.image} alt={active.title} />
                          ) : (
                            <span className="certmodalm__overview-thumb-fallback">
                              {(() => {
                                const Icon = CATEGORY_ICONS[active.category] || BsAward;
                                return <Icon />;
                              })()}
                            </span>
                          )}
                        </div>

                        <h3 className="certmodalm__overview-title">{active.title}</h3>
                        <p className="certmodalm__overview-issuer">{active.issuer}</p>
                        <p className="certmodalm__overview-desc">{active.description}</p>

                        <div className="certmodalm__overview-tags">
                          {(active.tags && active.tags.length ? active.tags : [active.category]).map((tag) => (
                            <span key={tag} className="certmodalm__overview-tag-pill">{tag}</span>
                          ))}
                        </div>

                        <div className="certmodalm__overview-meta">
                          <span className="certmodalm__overview-date"><BsCalendar3 /> {active.date}</span>
                          <span className="certmodalm__overview-ok"><BsShieldFillCheck /> Verified</span>
                        </div>

                        <a
                          href={active.link}
                          target="_blank"
                          rel="noreferrer"
                          className="certmodalm__btn certmodalm__btn--primary"
                        >
                          View Credential <BsArrowUpRight />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ---------- Journey row: sits below the boxed panel, in the
                leftover space at the bottom of the screen ---------- */}
            <div className="certmodalm__journey-row">
              {[...stats, { label: 'Always Learning', value: '∞', icon: <BsInfinity /> }].map((s) => (
                <div className="certmodalm__journey-row-item" key={s.label}>
                  <span className="certmodalm__journey-row-dot" />
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
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

export default CertificatesModalMobile;