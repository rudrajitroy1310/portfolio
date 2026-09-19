import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BsAward, BsBriefcaseFill, BsPatchCheckFill, BsArrowRight,
  BsChevronLeft, BsChevronRight,
} from 'react-icons/bs';
import certExpMobileBg from '../../assets/images/certexp-mobile-bg.webp';
import CertificatesModalMobile from './CertificatesModalMobile';
import ExperienceModalMobile from './ExperienceModalMobile';
import {
  certifications, certStats, certQuote, experience, expQuote,
} from './certExpData';
import './CertificationsExperienceMobile.css';

gsap.registerPlugin(ScrollTrigger);

// Kitne cert cards ek baar me viewport me dikhte hain (baaki 2 side me thoda peek karte hain)
const VISIBLE_CARDS = 3;

function CertificationsExperienceMobile() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [isCertModalOpen, setCertModalOpen] = useState(false);
  const [isExpModalOpen, setExpModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // Preview card tap karne par usi certificate ka detail modal ke andar khulna
  // chahiye — "View All" button se khole to null (default/first cert dikhta hai)
  const [selectedCertTitle, setSelectedCertTitle] = useState(null);

  const openCertModal = (title = null) => {
    setSelectedCertTitle(title);
    setCertModalOpen(true);
  };

  // Preview: saare cert cards (swipeable carousel, 3 ek baar me visible) aur 3 experience rows —
  // poori detail ke liye "View All" modal hai
  const previewCerts = useMemo(() => certifications, []);
  const previewExp = useMemo(() => experience.slice(0, 3), []);

  // ---------- Carousel: horizontal scroll-snap track, dots + arrow buttons uske saath sync ----------
  const dotCount = Math.max(previewCerts.length - VISIBLE_CARDS + 1, 1);

  const scrollToIndex = (idx) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(idx, dotCount - 1));
    const card = track.children[clamped];
    if (card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    let raf = null;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const first = track.children[0];
        if (!first) return;
        const step = first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);
        const idx = Math.round(track.scrollLeft / step);
        setActiveIndex(Math.max(0, Math.min(idx, dotCount - 1)));
      });
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [dotCount]);

  // ---------- GSAP: scroll-triggered batch reveal, ek hi baar chalta hai ----------
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.certexp-m__reveal', sectionRef.current);
      ScrollTrigger.batch(targets, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.6)',
        }),
      });

      gsap.fromTo(
        '.certexp-m__bg-layer',
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="certifications" className="certexp-m" ref={sectionRef}>
        <div className="certexp-m__poster">
          <div className="certexp-m__bg-layer" style={{ backgroundImage: `url(${certExpMobileBg})` }} />
          <div className="certexp-m__mask" aria-hidden="true" />

          {/* ---------- Header: eyebrow + heading + subtitle (left), word-stack + tagline (right) ---------- */}
          <div className="certexp-m__header">
            <div className="certexp-m__header-left certexp-m__reveal">
              <p className="certexp-m__eyebrow">
                <span className="certexp-m__eyebrow-line" />
                MY JOURNEY
              </p>
              <h2 className="certexp-m__heading">
                CERTIFICATIONS &amp;<br /><span>EXPERIENCE</span>
              </h2>
              <p className="certexp-m__subtitle">
                A combination of hands-on experience and industry-recognized certifications
                that reflect my commitment to continuous learning and practical growth.
              </p>
            </div>

            <div className="certexp-m__header-right certexp-m__reveal" style={{ '--i': 1 }}>
              <div className="certexp-m__word-stack">
                <span>LEARN</span>
                <span>PRACTICE</span>
                <span>CERTIFY</span>
                <span>GROW</span>
                <span>REPEAT</span>
              </div>
            </div>
          </div>

          {/* ---------- 01 Certifications ---------- */}
          <div className="certexp-m__block">
            <div className="certexp-m__block-header certexp-m__reveal">
              <span className="certexp-m__block-icon"><BsAward /></span>
              <div className="certexp-m__block-title">
                <h3>CERTIFICATIONS</h3>
                <p>Industry-recognized certifications that validate my skills.</p>
              </div>
              <button type="button" className="certexp-m__view-all" onClick={() => openCertModal(null)}>
                View All <BsArrowRight />
              </button>
            </div>

            <div className="certexp-m__carousel">
              <button
                type="button"
                className="certexp-m__arrow certexp-m__arrow--prev certexp-m__reveal certexp-m__reveal--pop"
                aria-label="Previous certifications"
                onClick={() => scrollToIndex(activeIndex - 1)}
                disabled={activeIndex === 0}
              >
                <BsChevronLeft />
              </button>

              <div className="certexp-m__track" ref={trackRef}>
                {previewCerts.map((cert, idx) => (
                  <button
                    type="button"
                    className="certexp-m__cert-card certexp-m__reveal"
                    style={{ '--i': idx }}
                    key={cert.title}
                    onClick={() => openCertModal(cert.title)}
                    aria-label={`View details for ${cert.title}`}
                  >
                    <div className="certexp-m__cert-top">
                      <span className="certexp-m__cert-badge"><BsAward /></span>
                      <span className="certexp-m__verified"><BsPatchCheckFill /> Verified</span>
                    </div>
                    <h4>{cert.title}</h4>
                    <p className="certexp-m__cert-issuer">{cert.issuer}</p>
                    <p className="certexp-m__cert-desc">{cert.description}</p>
                    <div className="certexp-m__cert-meta">
                      <span>{cert.date}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="certexp-m__arrow certexp-m__arrow--next certexp-m__reveal certexp-m__reveal--pop"
                aria-label="Next certifications"
                onClick={() => scrollToIndex(activeIndex + 1)}
                disabled={activeIndex >= dotCount - 1}
              >
                <BsChevronRight />
              </button>
            </div>

            <div className="certexp-m__dots certexp-m__reveal" role="tablist" aria-label="Certification cards">
              {Array.from({ length: dotCount }).map((_, idx) => (
                <button
                  // eslint-disable-next-line react/no-array-index-key
                  key={idx}
                  type="button"
                  className={`certexp-m__dot${idx === activeIndex ? ' is-active' : ''}`}
                  aria-label={`Go to card ${idx + 1}`}
                  onClick={() => scrollToIndex(idx)}
                />
              ))}
            </div>
          </div>

          {/* ---------- 02 Experience ---------- */}
          <div className="certexp-m__block">
            <div className="certexp-m__block-header certexp-m__reveal">
              <span className="certexp-m__block-icon"><BsBriefcaseFill /></span>
              <div className="certexp-m__block-title">
                <h3>EXPERIENCE</h3>
                <p>My professional journey and contributions in the real world.</p>
              </div>
              <button type="button" className="certexp-m__view-all" onClick={() => setExpModalOpen(true)}>
                View All <BsArrowRight />
              </button>
            </div>

            <div className="certexp-m__timeline">
              {previewExp.map((exp, idx) => {
                const [dateStart, dateEnd] = exp.dateRange.split('–').map((s) => s.trim());
                const isLast = idx === previewExp.length - 1;
                return (
                  <div className={`certexp-m__exp-row${isLast ? ' certexp-m__exp-row--last' : ''}`} key={`${exp.role}-${idx}`}>
                    <div className="certexp-m__exp-date">
                      <span>{dateStart}</span>
                      <span>{`- ${dateEnd}`}</span>
                    </div>
                    <div className="certexp-m__exp-rail">
                      <span className="certexp-m__exp-dot certexp-m__reveal certexp-m__reveal--pop" style={{ '--i': idx }} />
                      {!isLast && <span className="certexp-m__exp-line" />}
                    </div>
                    <div className="certexp-m__exp-card certexp-m__reveal" style={{ '--i': idx }}>
                      <div className="certexp-m__exp-top">
                        <h4>{exp.role}</h4>
                        <span className="certexp-m__exp-status">{exp.status}</span>
                      </div>
                      <p className="certexp-m__exp-org">{exp.org}</p>
                      <ul className="certexp-m__exp-bullets">
                        {exp.bullets.slice(0, 2).map((b) => <li key={b}>{b}</li>)}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CertificatesModalMobile
        isOpen={isCertModalOpen}
        onClose={() => setCertModalOpen(false)}
        certifications={certifications}
        stats={certStats}
        quote={certQuote}
        initialTitle={selectedCertTitle}
      />

      <ExperienceModalMobile
        isOpen={isExpModalOpen}
        onClose={() => setExpModalOpen(false)}
        experience={experience}
        quote={expQuote}
      />
    </>
  );
}

export default CertificationsExperienceMobile;