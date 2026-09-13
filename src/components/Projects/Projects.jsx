import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BsGrid3X3GapFill, BsThreeDots, BsBoxArrowUpRight, BsX, BsSearch, BsArrowLeft, BsArrowRight,
  BsChevronDown, BsCheckLg, BsGithub, BsFileEarmarkText, BsInfoCircleFill, BsEyeFill,
  BsDatabaseFill, BsTerminalFill, BsGearFill, BsTools, BsPalette2, BsMagic, BsShieldLockFill,
  BsChevronLeft, BsChevronRight, BsCodeSlash,
} from 'react-icons/bs';
import { MdSecurity } from 'react-icons/md';
import {
  FaLayerGroup, FaFingerprint, FaShieldAlt, FaLaptopCode, FaCode,
  FaPython, FaLinux, FaDocker, FaReact, FaNodeJs,
} from 'react-icons/fa';
import projectsBgTemplate from '../../assets/images/projects-bg-template.webp';
import './Projects.css';

// ---- DUMMY DATA — sirf layout/design dikhane ke liye placeholder hai ----
// Titles, description, tags, links, features, screenshots — sab baad me apne real projects se replace karna
const projects = [
  {
    title: 'Project One',
    category: 'cyber',
    Icon: FaShieldAlt,
    screenshotCount: 8, // demo ke liye 5 se zyada — isliye thumb-strip mein ">" button aayega
    description: 'Placeholder summary for a cybersecurity project — replace with real details.',
    tags: ['Python', 'Nmap', 'Cybersecurity'],
    link: '#',
    version: 'v1.0.0',
    status: 'Completed',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription:
      'Placeholder long description — replace with 2-3 sentences explaining what this project does, who it is for, and what problem it solves. Talk about the core functionality and the value it provides.',
    features: [
      'Placeholder Feature One', 'Placeholder Feature Two',
      'Placeholder Feature Three', 'Placeholder Feature Four',
      'Placeholder Feature Five', 'Placeholder Feature Six',
    ],
    liveLink: '#',
    codeLink: '#',
    docsLink: '#',
    whatILearned:
      'Placeholder note on what you learned building this project — new tools, concepts or challenges you overcame.',
  },
  {
    title: 'Project Two',
    category: 'fullstack',
    Icon: FaLaptopCode,
    description: 'Placeholder summary for a full stack project — replace with real details.',
    tags: ['React', 'Node.js', 'Database'],
    link: '#',
    version: 'v1.0.0',
    status: 'Completed',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription:
      'Placeholder long description — replace with 2-3 sentences explaining what this project does, who it is for, and what problem it solves. Talk about the core functionality and the value it provides.',
    features: [
      'Placeholder Feature One', 'Placeholder Feature Two',
      'Placeholder Feature Three', 'Placeholder Feature Four',
      'Placeholder Feature Five', 'Placeholder Feature Six',
    ],
    liveLink: '#',
    codeLink: '#',
    docsLink: '#',
    whatILearned:
      'Placeholder note on what you learned building this project — new tools, concepts or challenges you overcame.',
  },
  {
    title: 'Project Three',
    category: 'forensics',
    Icon: FaFingerprint,
    description: 'Placeholder summary for a forensics project — replace with real details.',
    tags: ['Python', 'Forensics', 'CLI'],
    link: '#',
    version: 'v1.0.0',
    status: 'In Progress',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription:
      'Placeholder long description — replace with 2-3 sentences explaining what this project does, who it is for, and what problem it solves. Talk about the core functionality and the value it provides.',
    features: [
      'Placeholder Feature One', 'Placeholder Feature Two',
      'Placeholder Feature Three', 'Placeholder Feature Four',
      'Placeholder Feature Five', 'Placeholder Feature Six',
    ],
    liveLink: '#',
    codeLink: '#',
    docsLink: '#',
    whatILearned:
      'Placeholder note on what you learned building this project — new tools, concepts or challenges you overcame.',
  },
  {
    title: 'Project Four',
    category: 'cyber',
    Icon: FaShieldAlt,
    description: 'Placeholder summary for another security project — replace with real details.',
    tags: ['Docker', 'Linux', 'Cybersecurity'],
    link: '#',
    version: 'v1.0.0',
    status: 'Completed',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription:
      'Placeholder long description — replace with 2-3 sentences explaining what this project does, who it is for, and what problem it solves. Talk about the core functionality and the value it provides.',
    features: [
      'Placeholder Feature One', 'Placeholder Feature Two',
      'Placeholder Feature Three', 'Placeholder Feature Four',
      'Placeholder Feature Five', 'Placeholder Feature Six',
    ],
    liveLink: '#',
    codeLink: '#',
    docsLink: '#',
    whatILearned:
      'Placeholder note on what you learned building this project — new tools, concepts or challenges you overcame.',
  },
  {
    title: 'Project Five',
    category: 'fullstack',
    Icon: FaLaptopCode,
    description: 'Placeholder summary for a web app project — replace with real details.',
    tags: ['React', 'Tailwind CSS', 'Animation'],
    link: '#',
    version: 'v1.0.0',
    status: 'Completed',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription:
      'Placeholder long description — replace with 2-3 sentences explaining what this project does, who it is for, and what problem it solves. Talk about the core functionality and the value it provides.',
    features: [
      'Placeholder Feature One', 'Placeholder Feature Two',
      'Placeholder Feature Three', 'Placeholder Feature Four',
      'Placeholder Feature Five', 'Placeholder Feature Six',
    ],
    liveLink: '#',
    codeLink: '#',
    docsLink: '#',
    whatILearned:
      'Placeholder note on what you learned building this project — new tools, concepts or challenges you overcame.',
  },
  {
    title: 'Project Six',
    category: 'other',
    Icon: FaCode,
    description: 'Placeholder summary for a misc project — replace with real details.',
    tags: ['Python', 'Automation', 'Tool'],
    link: '#',
    version: 'v1.0.0',
    status: 'Completed',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription:
      'Placeholder long description — replace with 2-3 sentences explaining what this project does, who it is for, and what problem it solves. Talk about the core functionality and the value it provides.',
    features: [
      'Placeholder Feature One', 'Placeholder Feature Two',
      'Placeholder Feature Three', 'Placeholder Feature Four',
      'Placeholder Feature Five', 'Placeholder Feature Six',
    ],
    liveLink: '#',
    codeLink: '#',
    docsLink: '#',
    whatILearned:
      'Placeholder note on what you learned building this project — new tools, concepts or challenges you overcame.',
  },
];

// Tag ke naam se icon match karne ke liye — naya tag add karo toh yahan bhi entry daal dena
const tagIconMap = {
  python: FaPython,
  nmap: BsEyeFill,
  linux: FaLinux,
  cybersecurity: BsShieldLockFill,
  react: FaReact,
  'node.js': FaNodeJs,
  database: BsDatabaseFill,
  docker: FaDocker,
  forensics: FaFingerprint,
  cli: BsTerminalFill,
  automation: BsGearFill,
  tool: BsTools,
  'tailwind css': BsPalette2,
  animation: BsMagic,
};

// Screenshot gallery abhi placeholder hai — jab real screenshots ho tab in slots mein image daal dena
// Default count jab kisi project mein 'screenshotCount' nahi diya ho
const PLACEHOLDER_SHOT_COUNT = 5;
// Ek "page" mein kitne thumbnails ek saath dikhte hain — isse zyada hone par hi ">" (more) button aayega
const THUMBS_PER_PAGE = 5;

const filters = [
  { key: 'all', label: 'All Projects', Icon: BsGrid3X3GapFill },
  { key: 'cyber', label: 'Cybersecurity', Icon: MdSecurity },
  { key: 'fullstack', label: 'Full Stack', Icon: FaLayerGroup },
  { key: 'forensics', label: 'Digital Forensics', Icon: FaFingerprint },
  { key: 'other', label: 'Other', Icon: BsThreeDots },
];

// Filter select hone pe modal ka heading/description bhi isi hisaab se badalta hai
const filterHeadings = {
  all: {
    eyebrow: 'EXPLORE',
    heading: <>ALL <span>PROJECTS</span></>,
    desc: 'A collection of my works across Cybersecurity, Full Stack, Digital Forensics and more. Each project reflects my curiosity, problem-solving mindset and passion for building a safer digital world.',
  },
  cyber: {
    eyebrow: 'EXPLORE · CYBERSECURITY',
    heading: <>CYBER<span>SECURITY</span></>,
    desc: 'Security-focused builds — network analysis, defensive tooling and hands-on work that spots the threat before it becomes a breach.',
  },
  fullstack: {
    eyebrow: 'EXPLORE · FULL STACK',
    heading: <>FULL <span>STACK</span></>,
    desc: 'End-to-end web builds — frontend, backend and everything in between. Real apps, real workflows, built to actually be used.',
  },
  forensics: {
    eyebrow: 'EXPLORE · DIGITAL FORENSICS',
    heading: <>DIGITAL <span>FORENSICS</span></>,
    desc: 'Investigative tools and case work — tracing evidence, recovering data and making sense of digital footprints.',
  },
  other: {
    eyebrow: 'EXPLORE · OTHER',
    heading: <>OTHER <span>WORK</span></>,
    desc: "Everything that doesn't fit one box — experiments, tools and side builds worth sharing.",
  },
};

// Stats bhi dummy hain — apne asli numbers se replace kar lena
const stats = [
  { label: 'Projects Completed', value: '00+' },
  { label: 'Domains Explored', value: '00+' },
  { label: 'Total Hours', value: '0+' },
];

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

// Modal ke andar wala grid — modal khulne ke baad thoda delay se start hota hai
// taaki modal ki apni open animation ke saath overlap na ho (stutter fix)
const modalGridVariants = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.25, staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function ProjectCard({ project, onOpen }) {
  const { title, description, tags, link, Icon } = project;
  return (
    <motion.div
      className="projects__card"
      variants={cardVariants}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(project);
      }}
    >
      <div className="projects__card-top">
        <div className="projects__card-thumb">
          <span className="projects__card-thumb-glow" aria-hidden="true" />
          <Icon className="projects__card-thumb-icon" />
        </div>

        <div className="projects__card-body">
          <div className="projects__card-title-row">
            <h3 className="projects__card-title">{title}</h3>
            <a
              href={link}
              className="projects__card-ext"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${title} live link`}
            >
              <BsBoxArrowUpRight />
            </a>
          </div>

          <p className="projects__card-desc">{description}</p>

          <div className="projects__card-tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <a href={link} className="projects__card-view" onClick={(e) => e.stopPropagation()}>
        View Project <BsBoxArrowUpRight />
      </a>
    </motion.div>
  );
}

function Projects() {
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeShot, setActiveShot] = useState(0);
  const [thumbPage, setThumbPage] = useState(0);

  // Modal ke apne independent filter/search/sort/pagination states
  const [modalFilter, setModalFilter] = useState('all');
  const [modalSearch, setModalSearch] = useState('');
  const [modalSort, setModalSort] = useState('newest');
  const [modalSortOpen, setModalSortOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1);
  const MODAL_PAGE_SIZE = 9;
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  // Modal khulne par jo bhi field-reset chahiye (filters, gallery index) — scroll
  // lock se alag rakha hai taaki dono independently, bina conflict ke chal sakein.
  useEffect(() => {
    if (showAllModal) {
      setModalFilter('all');
      setModalSearch('');
      setModalSort('newest');
      setModalSortOpen(false);
      setModalPage(1);
    }
  }, [showAllModal]);

  useEffect(() => {
    if (selectedProject) {
      setActiveShot(0);
      setThumbPage(0);
    }
  }, [selectedProject]);

  // Kisi bhi modal (all-projects ya project-detail, ya dono nested) khulne pe
  // background scroll lock — same pinned-scroll approach jo Certifications aur
  // Experience modals mein hai, taaki close karne par page apni scroll position
  // par hi rahe (Projects section se hate nahi, top se scroll-up bhi na ho).
  useEffect(() => {
    const isAnyModalOpen = showAllModal || Boolean(selectedProject);
    if (!isAnyModalOpen) return undefined;

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
    };
  }, [showAllModal, selectedProject]);

  // Filter/search/sort badalte hi page 1 pe wapas
  useEffect(() => {
    setModalPage(1);
  }, [modalFilter, modalSearch, modalSort]);

  // Selected project ke actual screenshot count ke hisaab se thumbnail paging
  const shotCount = selectedProject?.screenshotCount ?? PLACEHOLDER_SHOT_COUNT;
  const totalThumbPages = Math.ceil(shotCount / THUMBS_PER_PAGE);
  const thumbPageStart = thumbPage * THUMBS_PER_PAGE;
  const thumbsOnPage = Math.min(THUMBS_PER_PAGE, shotCount - thumbPageStart);
  // Kisi screenshot pe jump karte waqt uska thumbnail-page bhi khud sync ho jaye
  const goToShot = (index) => {
    setActiveShot(index);
    setThumbPage(Math.floor(index / THUMBS_PER_PAGE));
  };

  // Sidebar filter list — counts dummy data se hi nikal liye
  const sidebarFilters = filters.map((f) => ({
    ...f,
    count: f.key === 'all' ? projects.length : projects.filter((p) => p.category === f.key).length,
  }));

  const modalResults = useMemo(() => {
    let list = modalFilter === 'all' ? projects : projects.filter((p) => p.category === modalFilter);
    if (modalSearch.trim()) {
      const q = modalSearch.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    list = modalSort === 'oldest' ? list : [...list].reverse();
    return list;
  }, [modalFilter, modalSearch, modalSort]);

  const modalTotalPages = Math.max(1, Math.ceil(modalResults.length / MODAL_PAGE_SIZE));
  const modalCurrentPage = Math.min(modalPage, modalTotalPages);
  const modalPageItems = modalResults.slice(
    (modalCurrentPage - 1) * MODAL_PAGE_SIZE,
    modalCurrentPage * MODAL_PAGE_SIZE
  );
  const modalShowingStart = modalResults.length === 0 ? 0 : (modalCurrentPage - 1) * MODAL_PAGE_SIZE + 1;
  const modalShowingEnd = Math.min(modalCurrentPage * MODAL_PAGE_SIZE, modalResults.length);

  return (
    <section id="projects" className="projects">
      {/* Background — tumhara diya hua template image, top pe anchor kiya hua */}
      <div className="projects__bg" aria-hidden="true">
        <img src={projectsBgTemplate} className="projects__bg-img" alt="" />
      </div>

      <div className="projects__inner">
        <motion.div
          className="projects__header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="projects__header-left">
            <p className="projects__eyebrow">
              <span className="projects__eyebrow-line" />
              MY PROJECTS
            </p>
            <h2 className="projects__heading">
              SOME OF MY <span>WORKS</span>
            </h2>
            <p className="projects__subtitle">
              Here are some of the projects I&apos;ve built across Cybersecurity, Full Stack and
              Digital Forensics. Each project represents my curiosity, problem-solving mindset and
              passion for building a safer digital world.
            </p>
          </div>

          <div className="projects__header-right">
            <div className="projects__vertical-text">
              <span>BUILD</span>
              <span>SOLVE</span>
              <span>SECURE</span>
              <span>REPEAT</span>
              <em className="projects__vertical-line" />
            </div>
          </div>
        </motion.div>

        <div className="projects__body">
          <motion.div
            className="projects__grid"
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {projects.map((project) => (
              <ProjectCard project={project} key={project.title} onOpen={setSelectedProject} />
            ))}
          </motion.div>

          <motion.aside
            className="projects__stats"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -8 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {stats.map((s) => (
              <div className="projects__stat" key={s.label}>
                <p className="projects__stat-label">{s.label}</p>
                <p className="projects__stat-value">{s.value}</p>
              </div>
            ))}

            <p className="projects__stats-note">
              Every project is a step towards a safer and smarter digital world.
            </p>

            <button
              type="button"
              className="projects__stats-btn"
              onClick={() => setShowAllModal(true)}
            >
              View All Projects <BsBoxArrowUpRight />
            </button>
          </motion.aside>
        </div>

        <div className="projects__corner-text projects__corner-text--left">
          BUILD<br />SOLVE<br />IMPROVE<br />//
        </div>
        <div className="projects__corner-text projects__corner-text--right">
          REAL PROJECTS.<br />REAL SKILLS.<br />REAL IMPACT.
        </div>
      </div>

      <AnimatePresence>
        {showAllModal && (
          <motion.div
            className="projects__modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={() => setShowAllModal(false)}
          >
            <motion.div
              className="projects__modal"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="projects__modal-close"
                onClick={() => setShowAllModal(false)}
                aria-label="Close"
              >
                <BsX />
              </button>

              <div className="projects__modal-topbar">
                <div className="projects__modal-titleblock">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={modalFilter}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="projects__modal-eyebrow">
                        <span className="projects__eyebrow-line" />
                        {filterHeadings[modalFilter].eyebrow}
                      </p>
                      <h3 className="projects__modal-heading">
                        {filterHeadings[modalFilter].heading}
                      </h3>
                      <p className="projects__modal-desc">
                        {filterHeadings[modalFilter].desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="projects__modal-vertical-text">
                  <span>BUILD</span>
                  <span>SOLVE</span>
                  <span>SECURE</span>
                  <span>REPEAT</span>
                  <em className="projects__vertical-line" />
                </div>
              </div>

              <div className="projects__modal-content">
                <aside className="projects__modal-sidebar">
                  <ul className="projects__modal-filter-list">
                    {sidebarFilters.map((f) => (
                      <li key={f.key}>
                        <button
                          type="button"
                          className={`projects__modal-filter-item${modalFilter === f.key ? ' projects__modal-filter-item--active' : ''}`}
                          onClick={() => setModalFilter(f.key)}
                        >
                          <span className="projects__modal-filter-icon">
                            <f.Icon />
                          </span>
                          <span className="projects__modal-filter-label">{f.label}</span>
                          <span className="projects__modal-filter-count">
                            {String(f.count).padStart(2, '0')}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>

                <div className="projects__modal-main">
                  <div className="projects__modal-toolbar">
                    <div className="projects__modal-search">
                      <BsSearch />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={modalSearch}
                        onChange={(e) => setModalSearch(e.target.value)}
                      />
                    </div>

                    <div className="projects__modal-sort">
                      <span>Sort by</span>
                      <div className="projects__modal-sort-select">
                        <button
                          type="button"
                          className={`projects__modal-sort-trigger${modalSortOpen ? ' projects__modal-sort-trigger--open' : ''}`}
                          onClick={() => setModalSortOpen((o) => !o)}
                        >
                          {sortOptions.find((o) => o.value === modalSort)?.label}
                          <BsChevronDown />
                        </button>

                        <AnimatePresence>
                          {modalSortOpen && (
                            <>
                              <div
                                className="projects__modal-sort-backdrop"
                                onClick={() => setModalSortOpen(false)}
                              />
                              <motion.ul
                                className="projects__modal-sort-menu"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                              >
                                {sortOptions.map((opt) => (
                                  <li key={opt.value}>
                                    <button
                                      type="button"
                                      className={`projects__modal-sort-option${modalSort === opt.value ? ' projects__modal-sort-option--active' : ''}`}
                                      onClick={() => {
                                        setModalSort(opt.value);
                                        setModalSortOpen(false);
                                      }}
                                    >
                                      {opt.label}
                                    </button>
                                  </li>
                                ))}
                              </motion.ul>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {modalPageItems.length > 0 ? (
                    <motion.div
                      className="projects__grid projects__grid--modal"
                      key={`${modalFilter}-${modalSearch}-${modalSort}-${modalCurrentPage}`}
                      variants={modalGridVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {modalPageItems.map((project) => (
                        <ProjectCard project={project} key={project.title} onOpen={setSelectedProject} />
                      ))}
                    </motion.div>
                  ) : (
                    <p className="projects__modal-empty">No projects match your search.</p>
                  )}

                  <div className="projects__modal-pagination">
                    <p className="projects__modal-pagination-note">
                      Showing {modalShowingStart}-{modalShowingEnd} of {modalResults.length} projects
                    </p>

                    <div className="projects__modal-pagination-controls">
                      <button
                        type="button"
                        disabled={modalCurrentPage === 1}
                        onClick={() => setModalPage((p) => Math.max(1, p - 1))}
                        aria-label="Previous page"
                      >
                        <BsArrowLeft />
                      </button>

                      {Array.from({ length: modalTotalPages }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={n === modalCurrentPage ? 'projects__modal-page--active' : ''}
                          onClick={() => setModalPage(n)}
                        >
                          {n}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={modalCurrentPage === modalTotalPages}
                        onClick={() => setModalPage((p) => Math.min(modalTotalPages, p + 1))}
                        aria-label="Next page"
                      >
                        <BsArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="projects__modal-footer">
                <div className="projects__modal-brand projects__modal-brand--footer">
                  <p className="projects__modal-brand-name">RUDRAJIT ROY</p>
                  <p className="projects__modal-brand-tagline">
                    SAME GUY · HIGHER GOALS · BRIGHTER TOMORROW
                  </p>
                  <span className="projects__modal-brand-line" />
                </div>

                <div className="projects__modal-corner-text">
                  // //<br />
                  REAL PROJECTS.<br />REAL SKILLS.<br />REAL IMPACT.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Project Detail popup — reference design ke hisaab se ---------- */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="projects__detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="projects__detail"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="projects__detail-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close"
              >
                <BsX />
              </button>

              <p className="projects__detail-eyebrow">
                <span className="projects__eyebrow-line" />
                PROJECT DETAILS
              </p>

              <div className="projects__detail-content">
                {/* ---- Left: screenshot gallery ---- */}
                <div className="projects__detail-gallery">
                  <div className="projects__detail-shot">
                    <span className="projects__detail-shot-glow" aria-hidden="true" />
                    <selectedProject.Icon className="projects__detail-shot-icon" />
                  </div>

                  <div className="projects__detail-thumbs">
                    {Array.from({ length: thumbsOnPage }, (_, i) => {
                      const shotIndex = thumbPageStart + i;
                      return (
                        <button
                          type="button"
                          key={shotIndex}
                          className={`projects__detail-thumb${activeShot === shotIndex ? ' projects__detail-thumb--active' : ''}`}
                          onClick={() => goToShot(shotIndex)}
                        >
                          <selectedProject.Icon />
                        </button>
                      );
                    })}
                    {/* Yeh button sirf tab dikhega jab screenshots 5 (THUMBS_PER_PAGE) se zyada hon —
                        click karne pe agla batch of thumbnails le aata hai, cyclic wraps to start */}
                    {totalThumbPages > 1 && (
                      <button
                        type="button"
                        className="projects__detail-thumb-more"
                        onClick={() => {
                          const nextPage = (thumbPage + 1) % totalThumbPages;
                          setThumbPage(nextPage);
                          setActiveShot(nextPage * THUMBS_PER_PAGE);
                        }}
                        aria-label="Show more screenshots"
                      >
                        <BsChevronRight />
                      </button>
                    )}
                  </div>

                  <div className="projects__detail-shot-nav">
                    <p className="projects__detail-shot-count">
                      {String(activeShot + 1).padStart(2, '0')} / {String(shotCount).padStart(2, '0')}
                    </p>
                    <div className="projects__detail-shot-arrows">
                      <button
                        type="button"
                        onClick={() => goToShot((activeShot - 1 + shotCount) % shotCount)}
                        aria-label="Previous screenshot"
                      >
                        <BsChevronLeft />
                      </button>
                      <button
                        type="button"
                        onClick={() => goToShot((activeShot + 1) % shotCount)}
                        aria-label="Next screenshot"
                      >
                        <BsChevronRight />
                      </button>
                    </div>
                  </div>

                  <div className="projects__detail-gallery-footer">
                    <div className="projects__detail-vertical-text">
                      <span>BUILD</span>
                      <span>SOLVE</span>
                      <span>SECURE</span>
                      <span>REPEAT</span>
                    </div>
                  </div>
                </div>

                {/* ---- Right: details ---- */}
                <div className="projects__detail-info">
                  <div className="projects__detail-info-scroll">
                    <div className="projects__detail-top-row">
                      <p className="projects__detail-category">
                        <selectedProject.Icon />
                        {filters.find((f) => f.key === selectedProject.category)?.label.toUpperCase()}
                      </p>

                      <div className="projects__detail-meta">
                        <span className="projects__detail-version">{selectedProject.version}</span>
                        <span
                          className={`projects__detail-status${selectedProject.status === 'Completed' ? ' projects__detail-status--done' : ''}`}
                        >
                          <em />
                          {selectedProject.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="projects__detail-title">{selectedProject.title}</h3>
                    <p className="projects__detail-tagline">{selectedProject.tagline}</p>
                    <p className="projects__detail-desc">{selectedProject.longDescription}</p>

                    <div className="projects__detail-tags">
                      {selectedProject.tags.map((tag) => {
                        const TagIcon = tagIconMap[tag.toLowerCase()] || BsCodeSlash;
                        return (
                          <span key={tag}>
                            <TagIcon />
                            {tag}
                          </span>
                        );
                      })}
                    </div>

                    <p className="projects__detail-subheading">
                      <span className="projects__eyebrow-line" />
                      KEY FEATURES
                    </p>
                    <div className="projects__detail-features">
                      {selectedProject.features.map((feat) => (
                        <p key={feat}>
                          <BsCheckLg /> {feat}
                        </p>
                      ))}
                    </div>

                    <p className="projects__detail-subheading">
                      <span className="projects__eyebrow-line" />
                      LIVE LINKS
                    </p>
                    <div className="projects__detail-links">
                      <a href={selectedProject.liveLink} className="projects__detail-link projects__detail-link--primary">
                        View Live <BsBoxArrowUpRight />
                      </a>
                      <a href={selectedProject.codeLink} className="projects__detail-link">
                        <BsGithub /> View Code
                      </a>
                      <a href={selectedProject.docsLink} className="projects__detail-link">
                        <BsFileEarmarkText /> Documentation
                      </a>
                    </div>

                    <div className="projects__detail-learned">
                      <p className="projects__detail-learned-title">
                        <BsInfoCircleFill /> What I Learned
                      </p>
                      <p className="projects__detail-learned-text">{selectedProject.whatILearned}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="projects__detail-footer">
                <div className="projects__modal-brand projects__detail-brand">
                  <p className="projects__modal-brand-logo">RR</p>
                  <p className="projects__modal-brand-name">RUDRAJIT ROY</p>
                  <span className="projects__modal-brand-line" />
                </div>

                <div className="projects__detail-corner-text">
                  CURIOUS MIND.<br />SAFER TOMORROW.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Projects;