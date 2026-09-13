import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import aboutMobileBg from '../../assets/images/about-mobile-bg.webp';
import kaliIcon from '../../assets/icons/kali-linux.webp';
import pythonIcon from '../../assets/icons/python.webp';
import supabaseIcon from '../../assets/icons/supabase.webp';
import javascriptIcon from '../../assets/icons/javascript.webp';
import './AboutMobile.css';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { icon: kaliIcon, name: 'Kali Linux', tag: 'Penetration Testing' },
  { icon: pythonIcon, name: 'Python', tag: 'Automation & Scripting' },
  { icon: supabaseIcon, name: 'Supabase', tag: 'Backend & Database' },
  { icon: javascriptIcon, name: 'JavaScript', tag: 'Web Development' },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 11 11 5M11 5H6M11 5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RRLogo() {
  return (
    <svg viewBox="0 0 120 70" className="about-m__brand-logo" fill="none">
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

function AboutMobile() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  // ---------- GSAP: scroll-triggered entrance (ek hi baar chalta hai) ----------
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });

      tl.from('.about-m__kicker', { opacity: 0, x: -18, duration: 0.5, ease: 'power2.out' })
        .from('.about-m__brand', { opacity: 0, x: 18, duration: 0.5, ease: 'power2.out' }, '<')
        .from('.about-m__index', { opacity: 0, x: -14, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .from('.about-m__signature', { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .from('.about-m__eyebrow', { opacity: 0, x: -20, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .from('.about-m__heading', { opacity: 0, y: 22, duration: 0.6, ease: 'power3.out' }, '-=0.35')
        .from('.about-m__text', { opacity: 0, y: 18, duration: 0.5, ease: 'power2.out' }, '-=0.35')
        .from('.about-m__skill-card', {
          opacity: 0,
          y: 20,
          scale: 0.9,
          duration: 0.45,
          stagger: 0.08,
          ease: 'back.out(1.6)',
        }, '-=0.25')
        .from('.about-m__actions > *', { opacity: 0, y: 12, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.2')
        .from('.about-m__footer-note', { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, '-=0.1');

      // ---------- Background parallax: bg thoda slow move karta hai scroll ke against ----------
      if (bgRef.current) {
        gsap.set(bgRef.current, { scale: 1.06, transformOrigin: 'center center' });
        gsap.to(bgRef.current, {
          yPercent: -5,
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
    <section id="about" className="about-m" ref={sectionRef}>
      <div className="about-m__poster">
        <div className="about-m__bg-layer" ref={bgRef} style={{ backgroundImage: `url(${aboutMobileBg})` }} />
        <div className="about-m__mask" aria-hidden="true" />

        <p className="about-m__kicker">
          CURIOUS MIND.
          <br />
          SAFER TOMORROW.
          <br />
          //
        </p>

        <div className="about-m__brand">
          <RRLogo />
          <p className="about-m__brand-text">
            DISCIPLINE
            <br />
            BUILDS
            <br />
            FREEDOM
          </p>
          <span className="about-m__brand-bar" />
        </div>

        <div className="about-m__index">
          <span className="about-m__index-num">02</span>
          <span className="about-m__index-bar" />
          <span className="about-m__index-label">ABOUT</span>
        </div>

        <div className="about-m__signature">
          <p className="about-m__sig-name">
            Rudrajit
            <br />
            Roy
          </p>
          <p className="about-m__sig-role">
            CYBERSECURITY
            <br />
            ENTHUSIAST
          </p>
        </div>

        <div className="about-m__body">
          <p className="about-m__eyebrow">
            <span className="about-m__eyebrow-line" />
            ABOUT ME
          </p>

          <h2 className="about-m__heading">
            Hello,
            <br />
            I&apos;m <span>RUDRAJIT ROY</span>
          </h2>

          <p className="about-m__text">
            A cybersecurity enthusiast, developer and lifelong learner. I love
            exploring the intersection of security, technology and human
            potential. I enjoy building practical solutions, experimenting
            with new tools and constantly improving my skills to create{' '}
            <span className="about-m__text-highlight">a safer digital world</span>.
          </p>

          <div className="about-m__skills">
            {skills.map((skill) => (
              <a key={skill.name} href="#skills" className="about-m__skill-card">
                <span className="about-m__skill-arrow">
                  <ArrowIcon />
                </span>
                <img src={skill.icon} alt="" className="about-m__skill-icon" />
                <div className="about-m__skill-info">
                  <span className="about-m__skill-name">{skill.name}</span>
                  <span className="about-m__skill-tag">{skill.tag}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="about-m__actions">
            <a href="/cv.pdf" className="about-m__cta" download="Rudrajit-Roy-CV.pdf">
              Download CV
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M8 2v8m0 0 3-3m-3 3-3-3M2.5 13h11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <p className="about-m__footer-note">
          //
          <br />
          BUILDING
          <br />
          A SAFER
          <br />
          DIGITAL WORLD
        </p>
      </div>
    </section>
  );
}

export default AboutMobile;