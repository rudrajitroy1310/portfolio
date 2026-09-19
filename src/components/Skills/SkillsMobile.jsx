import { useEffect, useMemo, useRef, useState } from 'react';
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
import skillsMobileBg from '../../assets/images/skills-mobile-bg.webp';
import './SkillsMobile.css';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Do curved "arc" paths — crystal ke left aur right se, top se
   bottom tak (jaisa reference mein trishul/vesica-shape orbit hai, poora
   circle nahi). Left arc = Frontend + Tools, Right arc = Backend + Fields/
   remaining tools — yehi corner label groups ke saath bhi match karta hai. ---------- */
/* categories desktop Skills.jsx ke `skills` array se hu-ba-hu match karte
   hain, taaki mobile filter aur desktop filter same tareeke se behave karein */
const leftArcSkills = [
  { name: 'JavaScript', Icon: SiJavascript, categories: ['fullstack'] },
  { name: 'React', Icon: SiReact, categories: ['fullstack'] },
  { name: 'HTML', Icon: SiHtml5, categories: ['fullstack'] },
  { name: 'CSS', Icon: SiCss, categories: ['fullstack'] },
  { name: 'Git', Icon: SiGit, categories: ['fullstack'] },
  { name: 'GitHub', Icon: SiGithub, categories: ['fullstack'] },
  { name: 'Linux', Icon: SiLinux, categories: ['cyber'] },
  { name: 'Kali Linux', Icon: SiKalilinux, categories: ['cyber', 'forensics'] },
  { name: 'Wireshark', Icon: SiWireshark, categories: ['cyber', 'forensics'] },
];

const rightArcSkills = [
  { name: 'Python', Icon: SiPython, categories: ['fullstack'] },
  { name: 'Django', Icon: SiDjango, categories: ['fullstack'] },
  { name: 'Flask', Icon: SiFlask, categories: ['fullstack'] },
  { name: 'MySQL', Icon: SiMysql, categories: ['fullstack'] },
  { name: 'PostgreSQL', Icon: SiPostgresql, categories: ['fullstack'] },
  { name: 'Nmap', Icon: GiRadarSweep, categories: ['cyber'] },
  { name: 'Burp Suite', Icon: SiBurpsuite, categories: ['cyber'] },
  { name: 'Autopsy', Icon: FaFingerprint, categories: ['forensics'] },
];

const totalSkills = leftArcSkills.length + rightArcSkills.length;

/* ---------- Har icon ki apni fixed (x%, y%) position — orbit box ke 0-100
   coordinate space mein (% hain, isliye har screen size par scale hote hain). ---------- */
/* "U" shape — 17 icons ek smooth curve par: left arm upar se neeche (9 icons,
   Wireshark bottom-center par), right arm bottom se upar (8 icons). Arms
   crystal ke bahar ki taraf halka bulge karte hain (reference jaisa), par
   zigzag nahi — har agla icon pichhle ke flow mein hai. Gaps ~12-15% hain
   (pill ~9.3% ka hai) isliye koi do icons touch nahi karte, aur kuch gaps
   thode chhote-bade rakhe hain taaki perfect mirror/ellipse na lage.
   Django ka x jaan-boojh kar thoda andar hai taaki "PostgreSQL" label se
   na takraye. */
const LEFT_POSITIONS = [
  { x: 23.3, y: 12.5 }, // JavaScript  (arm ka top)
  { x: 15.6, y: 22.5 }, // React
  { x: 9.5,  y: 35.5 }, // HTML
  { x: 9.0,  y: 48.5 }, // CSS         (arm ka sabse bahar wala hissa)
  { x: 11.5, y: 60.5 }, // Git
  { x: 17.0, y: 72.0 }, // GitHub
  { x: 26.0, y: 82.0 }, // Linux
  { x: 37.0, y: 89.5 }, // Kali Linux
  { x: 50.0, y: 92.5 }, // Wireshark   (U ka bottom-center)
];

const RIGHT_POSITIONS = [
  { x: 75.5, y: 12.5 }, // Python      (arm ka top)
  { x: 82.6, y: 23.0 }, // Django
  { x: 89.5, y: 36.0 }, // Flask
  { x: 91.0, y: 48.5 }, // MySQL       (arm ka sabse bahar wala hissa)
  { x: 88.5, y: 60.5 }, // PostgreSQL
  { x: 83.0, y: 72.0 }, // Nmap
  { x: 74.0, y: 82.0 }, // Burp Suite
  { x: 63.0, y: 89.5 }, // Autopsy
];

/* Catmull-Rom points ko smooth SVG bezier curve mein convert karta hai —
   reference ki halki connecting orbit-line ke liye */
function smoothPath(points) {
  if (points.length < 2) return '';
  const pts = points.map((p) => [p.x, p.y]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/* Ek hi continuous "U" line: left arm upar se neeche, bottom se guzar kar,
   right arm neeche se upar (isliye right positions ulti chalti hain). */
const U_PATH = smoothPath([...LEFT_POSITIONS, ...[...RIGHT_POSITIONS].reverse()]);

/* Pehle yahan 4 static corner labels the (Frontend/Backend/Tools/Fields,
   apni item-list ke saath). Ab wahi 4 corner slots desktop Skills.jsx wale
   FUNCTIONAL filter buttons bante hain (same keys/labels: ALL, Cyber
   Security, Digital Forensics, Full Stack Developer) — sirf visual format
   (// LABEL •) wahi purana wala hai. Click karne par icons filter hote hain
   jaise desktop mein hota hai, par yahan positions FIXED rehte hain (U-shape
   layout disturb nahi hota) — sirf non-matching icons dim/fade ho jaate
   hain, taaki spike-beam aur arc geometry hamesha sahi rahe. */
const filterGroups = [
  { key: 'all', title: 'ALL', side: 'left', row: 'top' },
  { key: 'cyber', title: 'CYBER SECURITY', side: 'right', row: 'top' },
  { key: 'forensics', title: 'DIGITAL FORENSICS', side: 'left', row: 'bottom' },
  { key: 'fullstack', title: 'FULL STACK', side: 'right', row: 'bottom' },
];

function StatIcon({ type }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  if (type === 'bolt') {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M13.5 2 5 13.5h5.2L9.6 22 19 10.2h-5.4L13.5 2Z" />
      </svg>
    );
  }
  if (type === 'folder') {
    return (
      <svg {...common}>
        <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.4h9A1.5 1.5 0 0 1 21 9.9v8.6A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-11Z" />
      </svg>
    );
  }
  if (type === 'user') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4.8 20c.6-3.8 3.6-6 7.2-6s6.6 2.2 7.2 6" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="currentColor" stroke="none">
      <rect x="3.5" y="13" width="3.6" height="7" rx="1" />
      <rect x="10.2" y="8.5" width="3.6" height="11.5" rx="1" />
      <rect x="16.9" y="4" width="3.6" height="16" rx="1" />
    </svg>
  );
}

const stats = [
  { icon: 'bolt', value: `${totalSkills}+`, label: 'Technologies', count: totalSkills },
  { icon: 'folder', value: '3+', label: 'Domains' },
  { icon: 'user', value: 'Real', label: 'Projects' },
  { icon: 'bars', value: 'Always', label: 'Learning' },
];

function SkillsMobile() {
  const [activeFilter, setActiveFilter] = useState('all');
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const statValueRef = useRef(null);

  const isSkillActive = useMemo(
    () => (categories) => activeFilter === 'all' || categories.includes(activeFilter),
    [activeFilter],
  );

  // ---------- Looping animations sirf tab chalao jab section screen par ho ----------
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-live');
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-live', entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ---------- GSAP: scroll-triggered entrance + bg parallax ----------
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

      tl.from('.skillsm__eyebrow', { opacity: 0, y: -12, duration: 0.45, ease: 'power2.out' })
        .from('.skillsm__heading-line', {
          opacity: 0,
          y: 26,
          duration: 0.55,
          stagger: 0.12,
          ease: 'power3.out',
        }, '-=0.2')
        .from('.skillsm__subtitle', { opacity: 0, y: 14, duration: 0.45, ease: 'power2.out' }, '-=0.3')
        .from('.skillsm__orbit', { opacity: 0, scale: 0.84, duration: 0.8, ease: 'back.out(1.3)' }, '-=0.25')
        .from('.skillsm__group', {
          opacity: 0,
          y: 12,
          duration: 0.45,
          stagger: 0.09,
          ease: 'power2.out',
        }, '-=0.55')
        .from('.skillsm__quote', { opacity: 0, x: -14, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .from('.skillsm__mindset', { opacity: 0, x: 14, duration: 0.5, ease: 'power2.out' }, '<')
        .from('.skillsm__stat', {
          opacity: 0,
          y: 16,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
        }, '-=0.25')
        .from('.skillsm__footnote', { opacity: 0, duration: 0.45, ease: 'power2.out' }, '-=0.15');

      // Count-up: "17+" number 0 se target tak
      if (statValueRef.current) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: totalSkills,
          duration: 1.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (statValueRef.current) {
              statValueRef.current.textContent = `${Math.round(counter.val)}+`;
            }
          },
        });
      }

      // Background parallax — bg scroll ke against halka slow move karta hai
      if (bgRef.current) {
        gsap.set(bgRef.current, { scale: 1.06, transformOrigin: 'center center' });
        gsap.to(bgRef.current, {
          yPercent: -4,
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

  const renderArc = (arcSkills, positions, side) =>
    arcSkills.map(({ name, Icon, categories }, idx) => {
      const pos = positions[idx];
      // Har icon ki apni float speed/phase (deterministic, taaki re-render par na badle)
      const seed = idx + (side === 'right' ? 9 : 0);
      const floatDur = 4.4 + ((seed * 37) % 17) / 10; // 4.4s - 6.0s
      const floatDelay = -(((seed * 53) % 50) / 10); // 0 se -4.9s (pehle se cycle ke beech mein)
      const active = isSkillActive(categories);
      return (
        <button
          key={name}
          type="button"
          className={`skillsm__pill skillsm__pill--${side}`}
          data-dimmed={active ? 'false' : 'true'}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            '--float-dur': `${floatDur}s`,
            '--float-delay': `${floatDelay}s`,
          }}
          title={name}
          aria-label={name}
          aria-hidden={active ? undefined : 'true'}
          tabIndex={active ? 0 : -1}
        >
          <span className="skillsm__pill-inner">
            <Icon className="skillsm__icon" />
          </span>
        </button>
      );
    });

  return (
    <section id="skills" className="skillsm" ref={sectionRef}>
      <div className="skillsm__poster">
        <div
          className="skillsm__bg-layer"
          ref={bgRef}
          style={{ backgroundImage: `url(${skillsMobileBg})` }}
        />
        <div className="skillsm__mask" aria-hidden="true" />

        {/* ---------- Heading block ---------- */}
        <div className="skillsm__head">
          <p className="skillsm__eyebrow">// 03. MY SKILLS</p>
          <h2 className="skillsm__heading">
            <span className="skillsm__heading-line">Technologies</span>
            <span className="skillsm__heading-line skillsm__heading-line--accent">
              I Work With
            </span>
          </h2>
          <p className="skillsm__subtitle">
            A blend of modern tools and technologies to turn ideas into
            powerful digital experiences.
          </p>
          <span className="skillsm__head-rule" aria-hidden="true" />
        </div>

        {/* ---------- Corner filter buttons (desktop ke filters, isi corner-label format mein) ---------- */}
        {filterGroups.map((group) => (
          <div
            key={group.key}
            className={`skillsm__group skillsm__group--${group.side} skillsm__group--${group.row}`}
          >
            <button
              type="button"
              className={`skillsm__group-title${activeFilter === group.key ? ' skillsm__group-title--active' : ''}`}
              onClick={() => setActiveFilter(group.key)}
              aria-pressed={activeFilter === group.key}
            >
              <span className="skillsm__group-slash">//</span>
              {group.title}
              <span className="skillsm__group-dot" aria-hidden="true" />
            </button>
          </div>
        ))}

        {/* ---------- Orbit: crystal ke around "U" shape mein icons ---------- */}
        <div className="skillsm__orbit">
          <span className="skillsm__orbit-spike skillsm__orbit-spike--top" aria-hidden="true" />
          <span className="skillsm__orbit-spike skillsm__orbit-spike--bottom" aria-hidden="true" />

          <svg
            className="skillsm__orbit-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={U_PATH} className="skillsm__orbit-arc" />
            {/* Do light-streaks, ek doosre se aadhe cycle ke phase par */}
            <path d={U_PATH} pathLength="100" className="skillsm__comet-glow" />
            <path d={U_PATH} pathLength="100" className="skillsm__comet" />
            <path d={U_PATH} pathLength="100" className="skillsm__comet-glow skillsm__comet--b" />
            <path d={U_PATH} pathLength="100" className="skillsm__comet skillsm__comet--b" />
          </svg>

          {renderArc(leftArcSkills, LEFT_POSITIONS, 'left')}
          {renderArc(rightArcSkills, RIGHT_POSITIONS, 'right')}
        </div>

        {/* ---------- Quote + mindset ---------- */}
        <figure className="skillsm__quote">
          <span className="skillsm__quote-mark" aria-hidden="true">&ldquo;</span>
          <blockquote>
            Tools are temporary,
            <br />
            skills are forever.
          </blockquote>
          <figcaption>&mdash; Rudrajit Roy</figcaption>
        </figure>

        <p className="skillsm__mindset">
          MORE
          <br />
          THAN TOOLS
          <br />
          A MINDSET
          <span className="skillsm__mindset-bar" aria-hidden="true" />
        </p>

        {/* ---------- Stats strip ---------- */}
        <div className="skillsm__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="skillsm__stat">
              <span className="skillsm__stat-icon">
                <StatIcon type={stat.icon} />
              </span>
              <span
                className="skillsm__stat-value"
                ref={stat.count ? statValueRef : undefined}
              >
                {stat.value}
              </span>
              <span className="skillsm__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <p className="skillsm__footnote">// SKILLS SHAPE IDEAS //</p>
      </div>
    </section>
  );
}

export default SkillsMobile;