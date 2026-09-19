import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  SiPython,
  SiDjango,
  SiFlask,
  SiReact,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiMysql,
  SiPostgresql,
  SiLinux,
  SiKalilinux,
  SiWireshark,
  SiBurpsuite,
  SiGit,
  SiGithub,
} from 'react-icons/si';
import { GiRadarSweep } from 'react-icons/gi';
import { FaFingerprint } from 'react-icons/fa';
import skillsGlobePlanet from '../../assets/images/skills-globe-planet.webp';
import skillsGlobeLogo from '../../assets/images/skills-globe-logo.webp';
import skillsOrbitRings from '../../assets/images/skills-orbit-template.webp';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

// Har skill ko ek ya zyada categories diye — filter buttons isi se kaam karenge
const skills = [
  { name: 'Python', Icon: SiPython, categories: ['fullstack'] },
  { name: 'Django', Icon: SiDjango, categories: ['fullstack'] },
  { name: 'Flask', Icon: SiFlask, categories: ['fullstack'] },
  { name: 'React', Icon: SiReact, categories: ['fullstack'] },
  { name: 'JavaScript', Icon: SiJavascript, categories: ['fullstack'] },
  { name: 'HTML', Icon: SiHtml5, categories: ['fullstack'] },
  { name: 'CSS', Icon: SiCss, categories: ['fullstack'] },
  { name: 'MySQL', Icon: SiMysql, categories: ['fullstack'] },
  { name: 'PostgreSQL', Icon: SiPostgresql, categories: ['fullstack'] },
  { name: 'Git', Icon: SiGit, categories: ['fullstack'] },
  { name: 'GitHub', Icon: SiGithub, categories: ['fullstack'] },
  { name: 'Linux', Icon: SiLinux, categories: ['cyber'] },
  { name: 'Kali Linux', Icon: SiKalilinux, categories: ['cyber', 'forensics'] },
  { name: 'Wireshark', Icon: SiWireshark, categories: ['cyber', 'forensics'] },
  { name: 'Nmap', Icon: GiRadarSweep, categories: ['cyber'] },
  { name: 'Burp Suite', Icon: SiBurpsuite, categories: ['cyber'] },
  { name: 'Autopsy', Icon: FaFingerprint, categories: ['forensics'] },
];

const filters = [
  { key: 'all', label: 'ALL' },
  { key: 'cyber', label: 'Cyber Security' },
  { key: 'forensics', label: 'Digital Forensics' },
  { key: 'fullstack', label: 'Full Stack Developer' },
];

// Orbit radius (% of the square orbit box) jahan icons place honge —
// bg ring image ki outer ring ke radius se match karke set kiya hai
const ORBIT_RADIUS = 45.5;

// N icons ko circle ke around evenly space karta hai, top se shuru karke clockwise
function getOrbitPosition(index, total) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const left = 50 + ORBIT_RADIUS * Math.cos(angle);
  const top = 50 + ORBIT_RADIUS * Math.sin(angle);
  return { left: `${left}%`, top: `${top}%` };
}

function Skills() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isOrbitPaused, setIsOrbitPaused] = useState(false);

  const sectionRef = useRef(null);
  const statValueRef = useRef(null);
  const pillRefs = useRef({});

  const filteredSkills = useMemo(() => {
    if (activeFilter === 'all') return skills;
    return skills.filter((s) => s.categories.includes(activeFilter));
  }, [activeFilter]);

  // ---------- GSAP: scroll-triggered entrance (ek hi baar chalta hai, bg image ko touch nahi karta) ----------
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      tl.from('.skills__corner-tag', { opacity: 0, y: -18, duration: 0.6, ease: 'power2.out' })
        .from('.skills__eyebrow', { opacity: 0, x: -24, duration: 0.5, ease: 'power2.out' }, '-=0.35')
        .from('.skills__heading-line', {
          opacity: 0,
          y: 34,
          duration: 0.65,
          stagger: 0.14,
          ease: 'power3.out',
        }, '-=0.25')
        .from('.skills__subtitle', { opacity: 0, y: 18, duration: 0.55, ease: 'power2.out' }, '-=0.35')
        .from('.skills__tagline', { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .from('.skills__filter-btn', {
          opacity: 0,
          y: -14,
          scale: 0.85,
          duration: 0.45,
          stagger: 0.08,
          ease: 'back.out(1.7)',
        }, '-=0.5')
        .from('.skills__orbit', { opacity: 0, scale: 0.82, duration: 0.85, ease: 'back.out(1.3)' }, '-=0.35')
        .from('.skills__stat', { opacity: 0, x: 26, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.6')
        .from('.skills__stats-line', { scaleX: 0, transformOrigin: 'right center', duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .from('.skills__decor', { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' }, '-=0.25');

      // Count-up: "17+" number 0 se target tak animate hota hai
      if (statValueRef.current) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: skills.length,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (statValueRef.current) {
              statValueRef.current.textContent = `${Math.round(counter.val)}+`;
            }
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ---------- GSAP: magnetic hover — skill icons cursor ki taraf halka khinchte hain ----------
  const handlePillMove = (e, key) => {
    const el = pillRefs.current[key];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: relX * 0.3,
      y: relY * 0.3,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handlePillLeave = (key) => {
    const el = pillRefs.current[key];
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <section id="skills" className="skills" ref={sectionRef}>
      <img
        src={skillsOrbitRings}
        alt=""
        className="skills__bg-template"
        aria-hidden="true"
      />

      <p className="skills__corner-tag" aria-hidden="true">
        TURNING IDEAS
        <br />
        INTO IMPACT
        <span className="skills__corner-line" />
      </p>

      <div className="container skills__inner">
        <div className="skills__layout">
          {/* ---------- Left: heading + copy ---------- */}
          <div className="skills__text">
            <p className="skills__eyebrow">
              <span className="skills__eyebrow-index">// 03</span>
              <span className="skills__eyebrow-line" />
              MY SKILLS
            </p>

            <h2 className="skills__heading">
              <span className="skills__heading-line">Technologies</span>
              <br />
              <span className="skills__heading-line skills__heading-line--accent">I Work With</span>
            </h2>

            <p className="skills__subtitle">
              A blend of modern tools and technologies to turn ideas into
              powerful digital experiences.
            </p>

            <div className="skills__tagline">
              <span className="skills__tagline-bracket" aria-hidden="true" />
              <p>
                BETTER TOOLS
                <br />
                BRIGHTER IDEAS
              </p>
            </div>
          </div>

          {/* ---------- Center: orbit ---------- */}
          <div className="skills__orbit-wrap">
            <div className="skills__filters">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`skills__filter-btn${activeFilter === f.key ? ' skills__filter-btn--active' : ''}`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="skills__orbit">
              <div className="skills__globe">
                <span className="skills__globe-label skills__globe-label--top">
                  DEVELOPER
                </span>
                <img src={skillsGlobePlanet} alt="" className="skills__globe-img" />
                <img src={skillsGlobeLogo} alt="Rudrajit Roy" className="skills__globe-logo" />
                <span className="skills__globe-label skills__globe-label--bottom">
                  TOOLS × IDEAS × IMPACT
                </span>
              </div>

              <div className={`skills__orbit-ring${isOrbitPaused ? ' skills__orbit-ring--paused' : ''}`}>
                <AnimatePresence>
                  {filteredSkills.map(({ name, Icon }, idx) => {
                    const pos = getOrbitPosition(idx, filteredSkills.length);
                    return (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="skills__pill"
                        style={pos}
                        title={name}
                        aria-label={name}
                        data-magnetic
                        onClick={() => setIsOrbitPaused((prev) => !prev)}
                        onMouseMove={(e) => handlePillMove(e, name)}
                        onMouseLeave={() => handlePillLeave(name)}
                      >
                        <div
                          className="skills__pill-magnet"
                          ref={(el) => {
                            pillRefs.current[name] = el;
                          }}
                        >
                          <div className="skills__pill-inner">
                            <Icon className="skills__icon" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <p className="skills__scroll-hint">
              <svg viewBox="0 0 16 26" width="14" height="22" fill="none" stroke="currentColor" strokeWidth="1.3">
                <rect x="1" y="1" width="14" height="24" rx="7" />
                <line className="skills__scroll-dot" x1="8" y1="6" x2="8" y2="11" strokeLinecap="round" />
              </svg>
              SCROLL TO EXPLORE
            </p>
          </div>

          {/* ---------- Right: stats + tagline ---------- */}
          <div className="skills__stats">
            <div className="skills__stat">
              <span className="skills__stat-value" ref={statValueRef}>{skills.length}+</span>
              <span className="skills__stat-label">Technologies</span>
            </div>
            <div className="skills__stat">
              <span className="skills__stat-value">Real</span>
              <span className="skills__stat-label">Project Experience</span>
            </div>
            <div className="skills__stat">
              <span className="skills__stat-value">Always</span>
              <span className="skills__stat-label">Learning</span>
            </div>
            <span className="skills__stats-line" aria-hidden="true" />

            <p className="skills__decor" aria-hidden="true">
              <span className="skills__decor-slash">/</span> SAME IDEAS
              <br />
              BIGGER TOMORROW
              <span className="skills__decor-line" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;