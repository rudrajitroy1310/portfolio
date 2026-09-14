import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BsAward, BsBriefcaseFill, BsPatchCheckFill, BsBoxArrowUpRight,
  BsCalendar3, BsTagFill, BsArrowRight, BsGlobe2,
} from 'react-icons/bs';
import certBgTemplate from '../../assets/images/certifications-bg-template.webp';
import CertificatesModal from './CertificatesModal';
import ExperienceModal from './ExperienceModal';
import {
  certifications, certStats, certQuote, experience, expQuote,
} from './certExpData';
import './CertificationsExperience.css';

gsap.registerPlugin(ScrollTrigger);

function CertificationsExperience() {
  // ---- Scroll-reveal: har .certexp__reveal element viewport me aate hi
  // 'certexp__reveal--visible' class pa jaata hai (ek baar), CSS transition
  // usko fade+slide-in animate kar deta hai. Stagger delay --i inline style se aata hai.
  const sectionRef = useRef(null);
  const dividerRef = useRef(null);
  const [isCertModalOpen, setCertModalOpen] = useState(false);
  const [isExpModalOpen, setExpModalOpen] = useState(false);

  // ---------- GSAP: scroll-triggered batch reveal — jab bhi ek ya zyada
  // .certexp__reveal elements viewport me enter karte hain, wo saath mein
  // (staggered) fade+slide-up animate ho jaate hain, ek hi baar ----------
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.certexp__reveal', sectionRef.current);

      ScrollTrigger.batch(targets, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.09,
            ease: 'power2.out',
          }),
      });

      // ---------- Parallax: beech ka globe divider scroll ke against thoda move karta hai ----------
      if (dividerRef.current) {
        gsap.to(dividerRef.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="certifications" className="certexp" ref={sectionRef}>
      {/* ---------- Background: reference template image ---------- */}
      <div className="certexp__bg" aria-hidden="true">
        <img src={certBgTemplate} className="certexp__bg-img" alt="" />
      </div>

      <div className="certexp__inner">
        <div className="certexp__header">
          <div className="certexp__header-left certexp__reveal">
            <p className="certexp__eyebrow">
              <span className="certexp__eyebrow-line" />
              JOURNEY
            </p>
            <h2 className="certexp__heading">
              CERTIFICATIONS &amp; <span>EXPERIENCE</span>
            </h2>
            <p className="certexp__subtitle">
              A combination of hands-on experience and industry-recognized certifications that
              reflect my commitment to continuous learning and practical growth.
            </p>
          </div>

          <div className="certexp__header-right certexp__reveal" style={{ '--i': 1 }}>
            <div className="certexp__vertical-text">
              <span>LEARN</span>
              <span>PRACTICE</span>
              <span>CERTIFY</span>
              <span>GROW</span>
              <span>REPEAT</span>
              <em className="certexp__vertical-line" />
            </div>
          </div>
        </div>

        <div className="certexp__body">
          {/* ---------- Left: Certifications ---------- */}
          <div className="certexp__col">
            <div className="certexp__col-header">
              <div className="certexp__col-header-left">
                <span className="certexp__col-icon">
                  <BsAward />
                </span>
                <div>
                  <h3>CERTIFICATIONS</h3>
                  <p>Industry-recognized certifications that validate my skills and knowledge.</p>
                </div>
              </div>
              <button type="button" className="certexp__view-all" onClick={() => setCertModalOpen(true)}>
                View All <BsArrowRight />
              </button>
            </div>

            <div className="certexp__cert-list">
              {certifications.slice(0, 4).map((cert, idx) => (
                <a
                  key={cert.title}
                  href={cert.link}
                  className="certexp__cert-card certexp__reveal"
                  style={{ '--i': idx }}
                  target={cert.link === '#' ? undefined : '_blank'}
                  rel={cert.link === '#' ? undefined : 'noreferrer'}
                >
                  <div className="certexp__cert-badge">
                    <BsAward />
                  </div>

                  <div className="certexp__cert-content">
                    <div className="certexp__cert-top">
                      <div>
                        <h4>{cert.title}</h4>
                        <p className="certexp__cert-issuer">{cert.issuer}</p>
                      </div>
                      <div className="certexp__cert-top-right">
                        <span className="certexp__verified">
                          <BsPatchCheckFill /> Verified
                        </span>
                        <BsBoxArrowUpRight className="certexp__cert-link-icon" />
                      </div>
                    </div>

                    <p className="certexp__cert-desc">{cert.description}</p>

                    <div className="certexp__cert-meta">
                      <span>
                        <BsCalendar3 /> {cert.date}
                      </span>
                      <span>
                        <BsTagFill /> Credential ID <em>{cert.credentialId}</em>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ---------- Middle: real HTML divider — replaces the globe/numbers baked
              into the background image, so it always stretches with card height ---------- */}
          <div className="certexp__divider certexp__reveal" style={{ '--i': 1 }} aria-hidden="true" ref={dividerRef}>
            <span className="certexp__divider-marker">01</span>

            <div className="certexp__divider-center">
              <span className="certexp__divider-globe">
                <BsGlobe2 />
              </span>
              <p className="certexp__divider-text">
                SAME<br />GUY<br />HIGHER<br />GOALS
              </p>
            </div>

            <span className="certexp__divider-marker">02</span>
          </div>

          {/* ---------- Right: Experience ---------- */}
          <div className="certexp__col">
            <div className="certexp__col-header">
              <div className="certexp__col-header-left">
                <span className="certexp__col-icon">
                  <BsBriefcaseFill />
                </span>
                <div>
                  <h3>EXPERIENCE</h3>
                  <p>My professional journey, roles and contributions in the real world.</p>
                </div>
              </div>
              <button type="button" className="certexp__view-all" onClick={() => setExpModalOpen(true)}>
                View All <BsArrowRight />
              </button>
            </div>

            <div className="certexp__exp-list">
              {experience.slice(0, 3).map((exp, idx) => (
                <div
                  className="certexp__exp-row certexp__reveal"
                  style={{ '--i': idx }}
                  key={`${exp.role}-${exp.dateRange}-${idx}`}
                >
                  <div className="certexp__exp-timeline">
                    <span className="certexp__exp-dot" />
                    <span className="certexp__exp-line" />
                  </div>

                  <div className="certexp__exp-card">
                    <p className="certexp__exp-date">{exp.dateRange}</p>
                    <div className="certexp__exp-top">
                      <h4>{exp.role}</h4>
                      <span className="certexp__exp-status">{exp.status}</span>
                    </div>
                    <p className="certexp__exp-org">{exp.org}</p>
                    <ul className="certexp__exp-bullets">
                      {exp.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="certexp__corner-text certexp__corner-text--left">
        CERTIFIED<br />TO BUILD<br />A SAFER TOMORROW<br />//
      </div>
      <div className="certexp__corner-text certexp__corner-text--right">
        EXPERIENCE<br />BUILDS PERSPECTIVE<br />CERTIFICATIONS<br />ADD STRENGTH<br />//
      </div>

      <CertificatesModal
        isOpen={isCertModalOpen}
        onClose={() => setCertModalOpen(false)}
        certifications={certifications}
        stats={certStats}
        quote={certQuote}
      />

      <ExperienceModal
        isOpen={isExpModalOpen}
        onClose={() => setExpModalOpen(false)}
        experience={experience}
        quote={expQuote}
      />
    </section>
  );
}

export default CertificationsExperience;