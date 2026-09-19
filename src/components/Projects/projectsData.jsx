import {
  BsCheckCircleFill, BsCrosshair, BsShieldCheck, BsFileEarmarkText, BsGearFill,
  BsShieldLockFill, BsSearch, BsPlayBtnFill, BsBugFill, BsTerminalFill,
  BsCheckSquareFill, BsPalette2,
} from 'react-icons/bs';
import {
  FaLaptopCode, FaShieldAlt, FaFingerprint, FaCode,
} from 'react-icons/fa';
import vigilonPoster from '../../assets/images/projects/vigilon/vigilon-poster.webp';
import vigilonSs1 from '../../assets/images/projects/vigilon/vigilon-ss-1.webp';
import vigilonSs2 from '../../assets/images/projects/vigilon/vigilon-ss-2.webp';
import vigilonSs3 from '../../assets/images/projects/vigilon/vigilon-ss-3.webp';

// =====================================================================
//  PROJECTS — SINGLE SOURCE OF TRUTH
//  Yahi ek file desktop cards, mobile cards, "View All" popups aur dono
//  detail popups ka data deti hai. Real projects yahin `projects` list
//  mein bharo — baaki kisi file mein data badalne ki zaroorat nahi.
//
//  ORDER: sabse NAYA project sabse upar. Mobile ke 3 preview cards aur
//  desktop ke 6 preview cards list ke top se lete hain, aur "View All"
//  popups mein bhi yahi order dikhta hai.
//
//  Har project ke fields:
//    title            — project ka naam
//    subtitle         — chhoti CAPS line, jaise 'DETECT · ANALYZE · SECURE' (mobile detail)
//    category         — 'cyber' | 'fullstack' | 'forensics' | 'other'
//    description      — 1-2 line summary (cards pe dikhti hai)
//    tagline          — ek line ka slogan (desktop detail)
//    longDescription  — 2-3 line detail (desktop detail)
//    tags             — tech stack ki list
//    version, status  — jaise 'v1.0.0', 'Completed' ya 'In Progress'
//    date, type       — jaise 'Dec 2024', 'Personal Project' (mobile detail)
//    features         — [{ title, desc }] — desktop sirf title dikhata hai,
//                       mobile title + desc dono
//    links            — { live, code, docs } — jo link nahi hai use hata do,
//                       uska button apne aap chhup jayega
//    whatILearned     — "What I Learned" ka note
//
//  Optional: Icon, accent (card ka gradient), screenshotCount,
//            stats (sirf mobile ke mock screenshot frame ke liye), features[].Icon
//  — na do toh category ke hisaab se default lag jaata hai.
//
//  ABHI KA DATA DUMMY HAI — sirf layout dikhane ke liye placeholder.
// =====================================================================

const placeholderFeatures = [
  { title: 'Placeholder Feature One', desc: 'Short line about this feature' },
  { title: 'Placeholder Feature Two', desc: 'Short line about this feature' },
  { title: 'Placeholder Feature Three', desc: 'Short line about this feature' },
  { title: 'Placeholder Feature Four', desc: 'Short line about this feature' },
];

const placeholderLinks = { live: '#', code: '#', docs: '#' };

const placeholderLong =
  'Placeholder long description — replace with 2-3 sentences explaining what this project does, who it is for, and what problem it solves.';

const placeholderLearned =
  'Placeholder note on what you learned building this project — new tools, concepts or challenges you overcame.';

export const projects = [
  {
    title: 'VIGILON',
    subtitle: 'DETECT · ANALYZE · RESPOND',
    category: 'cyber',
    accent: ['#1c0a2e', '#b026ff'],
    description: 'Real-time Network Intrusion Detection and SOC Dashboard.',
    tagline: 'Detect · Analyze · Respond · Protect',
    longDescription:
      'VIGILON combines Suricata-based detection with ML anomaly analysis to monitor network threats in real time, store alerts, visualize attacks through a SOC dashboard, and send automated Telegram/Discord notifications.',
    tags: ['Python', 'Suricata', 'Flask', 'SQLite', 'Chart.js', 'REST API', 'IsolationForest', 'Docker'],
    status: 'Completed',
    type: 'CodeAlpha Internship Project',
    images: {
      poster: vigilonPoster,
      screenshots: [vigilonSs1, vigilonSs2, vigilonSs3],
    },
    screenshotCount: 3,
    features: [
      { title: 'Real-Time IDS', desc: 'Live network traffic monitoring with instant threat detection', Icon: BsCrosshair },
      { title: 'Custom Suricata Rules', desc: 'Tailored detection rules for known and emerging attack patterns', Icon: BsShieldCheck },
      { title: 'ML Anomaly Detection', desc: 'IsolationForest model flags statistically unusual traffic flows', Icon: BsSearch },
      { title: 'Live SOC Dashboard', desc: 'Real-time alert feed, severity charts and attack timeline', Icon: BsFileEarmarkText },
      { title: 'Telegram & Discord Alerts', desc: 'Automated notifications the moment a threat is detected', Icon: BsGearFill },
      { title: 'REST API', desc: 'Programmatic access to alerts and system health', Icon: BsCheckCircleFill },
    ],
    links: {
      code: 'https://github.com/rudrajitroy1310/CodeAlpha_Vigilon',
      docs: 'https://github.com/rudrajitroy1310/CodeAlpha_Vigilon#readme',
    },
    whatILearned:
      'IDS development, Suricata rules, ML anomaly detection, REST APIs and SOC dashboard development.',
  },
  {
    title: 'NetRazor',
    subtitle: 'DETECT · ANALYZE · SECURE',
    category: 'cyber',
    Icon: BsShieldLockFill,
    accent: ['#2a0508', '#ff2740'],
    description: 'A network vulnerability scanner to detect open ports, services and common vulnerabilities.',
    tagline: 'Discover vulnerabilities before attackers do.',
    longDescription: placeholderLong,
    tags: ['Python', 'Nmap', 'Linux', 'Cybersecurity'],
    version: 'v1.0.0',
    status: 'Completed',
    date: 'Dec 2024',
    type: 'Personal Project',
    stats: [
      { label: 'Open Ports', value: '12' },
      { label: 'Vulnerabilities', value: '5', accent: true },
      { label: 'Services', value: '8' },
      { label: 'Risk Level', value: 'High', accent: true },
    ],
    features: [
      { title: 'Port Scanning', desc: 'Identify open ports and services', Icon: BsCrosshair },
      { title: 'Vulnerability Detection', desc: 'Detect known security issues', Icon: BsShieldCheck },
      { title: 'Detailed Reports', desc: 'Get comprehensive scan results', Icon: BsFileEarmarkText },
      { title: 'Customizable', desc: 'Flexible scan options and configurations', Icon: BsGearFill },
    ],
    links: placeholderLinks,
    whatILearned:
      'Improved my understanding of network protocols, port scanning, vulnerability assessment and security best practices.',
  },
  {
    title: 'Portfolio Website',
    subtitle: 'BUILD · ANIMATE · SHIP',
    category: 'fullstack',
    Icon: FaLaptopCode,
    accent: ['#0a1830', '#2f5dff'],
    description: 'My personal portfolio website built with modern web technologies and smooth animations.',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription: placeholderLong,
    tags: ['React', 'Tailwind CSS', 'Framer Motion'],
    version: 'v1.0.0',
    status: 'Completed',
    date: 'Month 2024',
    type: 'Personal Project',
    features: placeholderFeatures,
    links: placeholderLinks,
    whatILearned: placeholderLearned,
  },
  {
    title: 'CipherTrace',
    subtitle: 'RECOVER · TRACE · REPORT',
    category: 'forensics',
    Icon: BsSearch,
    accent: ['#1c0a2e', '#9b3dff'],
    description: 'A digital forensics tool to trace file metadata and recover deleted evidence from disk images.',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription: placeholderLong,
    tags: ['Python', 'Autopsy', 'Forensics'],
    version: 'v1.0.0',
    status: 'In Progress',
    date: 'Month 2024',
    type: 'Personal Project',
    features: placeholderFeatures,
    links: placeholderLinks,
    whatILearned: placeholderLearned,
  },
  {
    title: 'Netflix Clone',
    subtitle: 'STREAM · BROWSE · WATCH',
    category: 'fullstack',
    Icon: BsPlayBtnFill,
    accent: ['#1a0505', '#8a0000'],
    description: 'A front-end clone of Netflix with responsive design and modern UI/UX.',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription: placeholderLong,
    tags: ['React', 'Firebase', 'Tailwind CSS'],
    version: 'v1.0.0',
    status: 'Completed',
    date: 'Month 2024',
    type: 'Personal Project',
    features: placeholderFeatures,
    links: placeholderLinks,
    whatILearned: placeholderLearned,
  },
  {
    title: 'PhishNet',
    subtitle: 'SCAN · FLAG · PROTECT',
    category: 'cyber',
    Icon: BsBugFill,
    accent: ['#2a0508', '#ff2740'],
    description: 'A phishing detection tool that analyzes URLs and emails for malicious patterns.',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription: placeholderLong,
    tags: ['Python', 'ML', 'Cybersecurity'],
    version: 'v1.0.0',
    status: 'Completed',
    date: 'Month 2023',
    type: 'Personal Project',
    features: placeholderFeatures,
    links: placeholderLinks,
    whatILearned: placeholderLearned,
  },
  {
    title: 'LogSentinel',
    subtitle: 'PARSE · MONITOR · ALERT',
    category: 'forensics',
    Icon: BsTerminalFill,
    accent: ['#1c0a2e', '#9b3dff'],
    description: 'A log analysis tool for identifying suspicious activity across system logs.',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription: placeholderLong,
    tags: ['Python', 'SIEM', 'Forensics'],
    version: 'v1.0.0',
    status: 'Completed',
    date: 'Month 2023',
    type: 'Personal Project',
    features: placeholderFeatures,
    links: placeholderLinks,
    whatILearned: placeholderLearned,
  },
  {
    title: 'Todo App',
    subtitle: 'ADD · FILTER · DONE',
    category: 'other',
    Icon: BsCheckSquareFill,
    accent: ['#04140e', '#0f8a52'],
    description: 'A simple and clean todo app with add, delete, and filter features.',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription: placeholderLong,
    tags: ['React', 'LocalStorage', 'CSS'],
    version: 'v1.0.0',
    status: 'Completed',
    date: 'Month 2023',
    type: 'Personal Project',
    features: placeholderFeatures,
    links: placeholderLinks,
    whatILearned: placeholderLearned,
  },
  {
    title: 'ZAROO FF',
    subtitle: 'DESIGN · BRAND · STYLE',
    category: 'other',
    Icon: BsPalette2,
    accent: ['#3a0a0d', '#ff2740'],
    description: 'A modern YouTube channel banner design with a dark theme and red accents.',
    tagline: 'A placeholder tagline for this project goes here.',
    longDescription: placeholderLong,
    tags: ['HTML', 'CSS', 'JavaScript'],
    version: 'v1.0.0',
    status: 'Completed',
    date: 'Month 2022',
    type: 'Personal Project',
    features: placeholderFeatures,
    links: placeholderLinks,
    whatILearned: placeholderLearned,
  },
];

// ---- Projects section ke stats (sirf desktop pe dikhte hain) — apne asli numbers daalna ----
export const projectStats = [
  { label: 'Projects Completed', value: '00+' },
  { label: 'Domains Explored', value: '00+' },
  { label: 'Total Hours', value: '0+' },
];

// =====================================================================
//  NEECHE KA HISSA EDIT MAT KARO — yeh upar ke `projects` ko desktop aur
//  mobile components ke format mein badalta hai.
// =====================================================================

const CATEGORY_LABELS = {
  cyber: 'Cybersecurity',
  fullstack: 'Full Stack',
  forensics: 'Digital Forensics',
  other: 'Other',
};

// Icon/accent na diya ho toh category ke hisaab se default
const CATEGORY_DEFAULTS = {
  cyber: { Icon: FaShieldAlt, accent: ['#2a0508', '#ff2740'] },
  fullstack: { Icon: FaLaptopCode, accent: ['#0a1830', '#2f5dff'] },
  forensics: { Icon: FaFingerprint, accent: ['#1c0a2e', '#9b3dff'] },
  other: { Icon: FaCode, accent: ['#04140e', '#0f8a52'] },
};

const normalized = projects.map((p) => {
  const d = CATEGORY_DEFAULTS[p.category] || CATEGORY_DEFAULTS.other;
  return {
    ...p,
    Icon: p.Icon || d.Icon,
    accent: p.accent || d.accent,
    tags: p.tags || [],
    links: p.links || {},
    features: (p.features || []).map((f) => ({ ...f, Icon: f.Icon || BsCheckCircleFill })),
  };
});

// Card ka external link: live > code > '#'
const cardLink = (p) => p.links.live || p.links.code || '#';

// Desktop (Projects.jsx) ka format
export const desktopProjects = normalized.map((p) => ({
  title: p.title,
  category: p.category,
  Icon: p.Icon,
  images: p.images,
  screenshotCount: p.screenshotCount,
  description: p.description,
  tags: p.tags,
  link: cardLink(p),
  version: p.version,
  status: p.status,
  tagline: p.tagline,
  longDescription: p.longDescription,
  features: p.features.map((f) => f.title),
  liveLink: p.links.live,
  codeLink: p.links.code,
  docsLink: p.links.docs,
  whatILearned: p.whatILearned,
}));

// Mobile (ProjectsMobile, ProjectsAllModal, ProjectDetailModal) ka format
export const mobileProjects = normalized.map((p) => ({
  title: p.title,
  subtitle: p.subtitle || '',
  category: CATEGORY_LABELS[p.category] || 'Other',
  Icon: p.Icon,
  accent: p.accent,
  images: p.images,
  description: p.description,
  tags: p.tags,
  link: cardLink(p),
  detail: {
    version: p.version,
    status: p.status,
    date: p.date,
    type: p.type,
    tagline: p.tagline,
    screenshotCount: p.screenshotCount,
    stats: p.stats,
    features: p.features,
    quote: p.whatILearned,
    links: p.links,
  },
}));