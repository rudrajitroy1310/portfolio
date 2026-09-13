import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import aboutPhoto from '../../assets/images/about-photo.webp';
import aboutBg from '../../assets/images/about-bg.webp';
import kaliIcon from '../../assets/icons/kali-linux.webp';
import pythonIcon from '../../assets/icons/python.webp';
import supabaseIcon from '../../assets/icons/supabase.webp';
import javascriptIcon from '../../assets/icons/javascript.webp';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    icon: kaliIcon,
    name: 'Kali Linux',
    tag: 'Penetration Testing',
  },
  {
    icon: pythonIcon,
    name: 'Python',
    tag: 'Automation & Scripting',
  },
  {
    icon: supabaseIcon,
    name: 'Supabase',
    tag: 'Backend & Database',
  },
  {
    icon: javascriptIcon,
    name: 'JavaScript',
    tag: 'Web Development',
  },
];

function About() {
  const sectionRef = useRef(null);
  const photoRef = useRef(null);

  // ---------- GSAP: scroll-triggered entrance (ek hi baar chalta hai) ----------
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
        },
      });

      tl.from('.about__index', { opacity: 0, x: -20, duration: 0.5, ease: 'power2.out' })
        .from('.about__photo-card', {
          opacity: 0,
          y: 40,
          scale: 0.94,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.3')
        .from('.about__eyebrow', { opacity: 0, x: -24, duration: 0.5, ease: 'power2.out' }, '-=0.5')
        .from('.about__heading', { opacity: 0, y: 26, duration: 0.6, ease: 'power3.out' }, '-=0.35')
        .from('.about__text', { opacity: 0, y: 20, duration: 0.55, ease: 'power2.out' }, '-=0.35')
        .from('.about__skill-card', {
          opacity: 0,
          y: 22,
          scale: 0.85,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.6)',
        }, '-=0.3')
        .from('.about__actions > *', {
          opacity: 0,
          y: 14,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
        }, '-=0.25');

      // ---------- Parallax: photo card thoda slow move karta hai scroll ke against ----------
      if (photoRef.current) {
        gsap.to(photoRef.current, {
          yPercent: -8,
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
    <section id="about" className="about" style={{ backgroundImage: `url(${aboutBg})` }} ref={sectionRef}>
      <div className="container about__inner">
        <div className="about__visual">
          <div className="about__index">
            <span className="about__index-num">02</span>
            <span className="about__index-bar" />
            <span className="about__index-label">ABOUT</span>
          </div>

          <div className="about__photo-card" ref={photoRef}>
            <img src={aboutPhoto} alt="Rudrajit Roy — Cybersecurity Enthusiast" className="about__photo" />
          </div>
        </div>

        <div className="about__content">
          <p className="about__eyebrow">
            <span className="about__eyebrow-line" />
            ABOUT ME
          </p>

          <h2 className="about__heading">
            Hello,
            <br />
            I&apos;m <span>RUDRAJIT ROY</span>
          </h2>

          <p className="about__text">
            A cybersecurity enthusiast, developer and lifelong learner. I love
            exploring the intersection of security, technology and human
            potential. I enjoy building practical solutions, experimenting
            with new tools and constantly improving my skills to create{' '}
            <span className="about__text-highlight">a safer digital world</span>.
          </p>

          <div className="about__skills">
            {skills.map((skill) => (
              <div key={skill.name} className="about__skill-card">
                <img src={skill.icon} alt={`${skill.name} — ${skill.tag}`} className="about__skill-icon" />
              </div>
            ))}
          </div>

          <div className="about__actions">
            <a href="/cv.pdf" className="about__cta" download="Rudrajit-Roy-CV.pdf">
              Download CV
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M8 2v8m0 0 3-3m-3 3-3-3M2.5 13h11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#skills" className="about__link">
              More About Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;