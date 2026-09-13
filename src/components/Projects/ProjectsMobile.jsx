import { useEffect, useRef, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BsArrowRight, BsPalette2, BsPlayBtnFill, BsCheckSquareFill,
} from 'react-icons/bs';
import { FaLaptopCode } from 'react-icons/fa';
import projectsMobileBg from '../../assets/images/projects-mobile-bg.webp';
import ProjectsAllModal from './ProjectsAllModal';
import ProjectDetailModal from './ProjectDetailModal';
import './ProjectsMobile.css';

gsap.registerPlugin(ScrollTrigger);

// ---- DUMMY DATA — sirf layout/design dikhane ke liye placeholder hai ----
// Baad me apne real projects (title, description, tags, link) se replace karna
const projects = [
  {
    title: 'ZAROO FF',
    category: 'web',
    Icon: BsPalette2,
    accent: ['#3a0a0d', '#ff2740'],
    description: 'A modern YouTube channel banner design with a dark theme and red accents.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: '#',
  },
  {
    title: 'Portfolio Website',
    category: 'frontend',
    Icon: FaLaptopCode,
    accent: ['#0a1830', '#2f5dff'],
    description: 'My personal portfolio website built with modern web technologies and smooth animations.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion'],
    link: '#',
  },
  {
    title: 'Netflix Clone',
    category: 'fullstack',
    Icon: BsPlayBtnFill,
    accent: ['#1a0505', '#8a0000'],
    description: 'A front-end clone of Netflix with responsive design and modern UI/UX.',
    tags: ['React', 'Firebase', 'Tailwind CSS'],
    link: '#',
  },
  {
    title: 'Todo App',
    category: 'frontend',
    Icon: BsCheckSquareFill,
    accent: ['#04140e', '#0f8a52'],
    description: 'A simple and clean todo app with add, delete, and filter features.',
    tags: ['React', 'LocalStorage', 'CSS'],
    link: '#',
  },
];

function RRLogo() {
  return (
    <svg viewBox="0 0 120 70" className="projects-m__brand-logo" fill="none">
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

function ProjectsMobile() {
  const sectionRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailProject, setDetailProject] = useState(null);

  // Mobile card list ab sirf 3 dikhata hai — baaki "View All Projects" modal ke andar honge
  // (filtering bhi wahi modal ke andar hogi, ab yaha koi filter buttons nahi hai)
  const previewProjects = useMemo(() => projects.slice(0, 3), []);

  // ---------- GSAP: scroll-triggered entrance (ek hi baar chalta hai) + subtle bg parallax ----------
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

      tl.from('.projects-m__kicker', { opacity: 0, x: -18, duration: 0.5, ease: 'power2.out' })
        .from('.projects-m__brand', { opacity: 0, x: 18, duration: 0.5, ease: 'power2.out' }, '<')
        .from('.projects-m__index', { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .from('.projects-m__eyebrow', { opacity: 0, x: -20, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .from('.projects-m__heading', { opacity: 0, y: 22, duration: 0.6, ease: 'power3.out' }, '-=0.35')
        .from('.projects-m__text', { opacity: 0, y: 18, duration: 0.5, ease: 'power2.out' }, '-=0.35')
        .from('.projects-m__card', {
          opacity: 0,
          y: 16,
          duration: 0.4,
          stagger: 0.07,
          ease: 'power2.out',
        }, '-=0.2')
        .from('.projects-m__cta', { opacity: 0, y: 12, duration: 0.4, ease: 'power2.out' }, '-=0.15')
        .from('.projects-m__footer-note', { opacity: 0, x: 14, duration: 0.5, ease: 'power2.out' }, '-=0.2');

      // Halka background parallax — scroll ke saath bg-layer thoda upar/neeche move hota hai
      gsap.fromTo(
        '.projects-m__bg-layer',
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="projects" className="projects-m" ref={sectionRef}>
      <div className="projects-m__poster">
        <div className="projects-m__bg-layer" style={{ backgroundImage: `url(${projectsMobileBg})` }} />
        <div className="projects-m__mask" aria-hidden="true" />

        <p className="projects-m__kicker">
          CURIOUS MIND.
          <br />
          SAFER TOMORROW.
          <br />
          //
        </p>

        <div className="projects-m__brand">
          <RRLogo />
          <p className="projects-m__brand-text">
            TURNING
            <br />
            IDEAS INTO
            <br />
            REAL
            <br />
            EXPERIENCES
          </p>
          <span className="projects-m__brand-bar" />
        </div>

        <div className="projects-m__index">
          <span className="projects-m__index-num">04</span>
          <span className="projects-m__index-bar" />
          <span className="projects-m__index-label">PROJECTS</span>
        </div>

        <div className="projects-m__body">
          <p className="projects-m__eyebrow">
            <span className="projects-m__eyebrow-line" />
            MY PROJECTS
          </p>

          <h2 className="projects-m__heading">
            Some of My
            <br />
            <span>Works</span>
          </h2>

          <p className="projects-m__text">
            A few projects I&apos;ve built to solve real problems and explore
            modern web tech.
          </p>

          <div className="projects-m__list">
            {previewProjects.map((project) => (
              <button
                type="button"
                key={project.title}
                className="projects-m__card"
                style={{ '--accent-a': project.accent[0], '--accent-b': project.accent[1] }}
                onClick={() => setDetailProject(project)}
              >
                <span className="projects-m__card-thumb">
                  <span className="projects-m__card-thumb-bar">
                    <i /><i /><i />
                    <span className="projects-m__card-thumb-url" />
                  </span>
                  <span className="projects-m__card-thumb-body">
                    <project.Icon className="projects-m__card-thumb-icon" />
                    <span className="projects-m__card-thumb-label">{project.title}</span>
                  </span>
                </span>
                <div className="projects-m__card-info">
                  <span className="projects-m__card-title">
                    {project.title}
                  </span>
                  <span className="projects-m__card-desc">{project.description}</span>
                  <div className="projects-m__card-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="projects-m__card-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="projects-m__cta"
            onClick={() => setIsModalOpen(true)}
          >
            View All Projects
            <span className="projects-m__cta-arrow">
              <BsArrowRight />
            </span>
          </button>
        </div>

        <p className="projects-m__footer-note">
          //
          <br />
          REAL PROJECTS.
          <br />
          REAL SKILLS.
          <br />
          REAL GROWTH.
        </p>
      </div>

      <ProjectsAllModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </section>

      <ProjectDetailModal project={detailProject} onClose={() => setDetailProject(null)} />
    </>
  );
}

export default ProjectsMobile;