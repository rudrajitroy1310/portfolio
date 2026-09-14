import { BsAward, BsPatchCheckFill, BsBarChartFill } from 'react-icons/bs';
import pythonIcon from '../../assets/icons/python.webp';
import kaliIcon from '../../assets/icons/kali-linux.webp';
import jsIcon from '../../assets/icons/javascript.webp';

// ---- Shared dummy data for Certifications & Experience — used by both the
// desktop (CertificationsExperience) and mobile (CertificationsExperienceMobile)
// components, plus the two "View All" modals, so there's a single source of
// truth instead of duplicating this array in two places. ----
// credentialId abhi masked (••••) hai, real ID milte hi wahan daal dena.
export const certifications = [
  {
    title: 'Certification Name Placeholder One',
    issuer: 'Issuing Platform',
    category: 'Cybersecurity',
    description: 'Placeholder description — replace with what this certification actually covers.',
    date: 'Month 2024',
    credentialId: '••••••••••••',
    link: '#',
    image: null, // replace with an imported photo of the actual certificate when ready
  },
  {
    title: 'Certification Name Placeholder Two',
    issuer: 'Issuing Platform',
    category: 'Networking',
    description: 'Placeholder description — replace with what this certification actually covers.',
    date: 'Month 2023',
    credentialId: '••••••••••••',
    link: '#',
    image: null,
  },
  {
    title: 'Certification Name Placeholder Three',
    issuer: 'Issuing Platform',
    category: 'Cloud',
    description: 'Placeholder description — replace with what this certification actually covers.',
    date: 'Month 2023',
    credentialId: '••••••••••••',
    link: '#',
    image: null,
  },
  {
    title: 'Certification Name Placeholder Four',
    issuer: 'Issuing Platform',
    category: 'Development',
    description: 'Placeholder description — replace with what this certification actually covers.',
    date: 'Month 2023',
    credentialId: '••••••••••••',
    link: '#',
    image: null,
  },
  {
    title: 'Certification Name Placeholder Five',
    issuer: 'Issuing Platform',
    category: 'Cybersecurity',
    description: 'Placeholder description — replace with what this certification actually covers.',
    date: 'Month 2023',
    credentialId: '••••••••••••',
    link: '#',
    image: null,
  },
  {
    title: 'Certification Name Placeholder Six',
    issuer: 'Issuing Platform',
    category: 'Other',
    description: 'Placeholder description — replace with what this certification actually covers.',
    date: 'Month 2022',
    credentialId: '••••••••••••',
    link: '#',
    image: null,
  },
];

// ---- Sidebar stats + quote shown inside the "View All" modal ----
export const certStats = [
  { label: 'Certificates', value: `${certifications.length}+`, icon: <BsAward /> },
  { label: 'Domains', value: '4', icon: <BsBarChartFill /> },
  { label: 'Self-Learned', value: '100%', icon: <BsPatchCheckFill /> },
];

export const certQuote = {
  text: 'Certifications are not just credentials, they are milestones in my learning journey.',
  author: 'Rudrajit Roy',
};

// ---- Work experience — description/tags/tools sirf ExperienceModal (View All
// popup) ke detail panel me use hote hain, card/timeline preview list inhe
// touch nahi karta. ----
export const experience = [
  {
    role: 'Role Title Placeholder',
    org: 'Organization / Context Placeholder',
    status: 'Present',
    dateRange: 'Month 2024 – Present',
    description: 'Placeholder summary of what this role involves and what it is focused on.',
    tags: ['Tag One', 'Tag Two', 'Tag Three'],
    bullets: [
      'Placeholder responsibility or achievement line one.',
      'Placeholder responsibility or achievement line two.',
      'Placeholder responsibility or achievement line three.',
    ],
    tools: [
      { name: 'Kali Linux', icon: kaliIcon },
      { name: 'Python', icon: pythonIcon },
      { name: 'JavaScript', icon: jsIcon },
    ],
  },
  {
    role: 'Role Title Placeholder',
    org: 'Organization / Context Placeholder',
    status: 'Internship',
    dateRange: 'Month 2023 – Month 2023',
    description: 'Placeholder summary of what this role involves and what it is focused on.',
    tags: ['Tag One', 'Tag Two'],
    bullets: [
      'Placeholder responsibility or achievement line one.',
      'Placeholder responsibility or achievement line two.',
      'Placeholder responsibility or achievement line three.',
    ],
    tools: [
      { name: 'Python', icon: pythonIcon },
      { name: 'JavaScript', icon: jsIcon },
    ],
  },
  {
    role: 'Role Title Placeholder',
    org: 'Organization / Context Placeholder',
    status: 'Freelance',
    dateRange: 'Month 2023 – Month 2023',
    description: 'Placeholder summary of what this role involves and what it is focused on.',
    tags: ['Tag One', 'Tag Two'],
    bullets: [
      'Placeholder responsibility or achievement line one.',
      'Placeholder responsibility or achievement line two.',
      'Placeholder responsibility or achievement line three.',
    ],
    tools: [
      { name: 'JavaScript', icon: jsIcon },
    ],
  },
  {
    role: 'Role Title Placeholder',
    org: 'Organization / Context Placeholder',
    status: 'Internship',
    dateRange: 'Month 2022 – Month 2022',
    description: 'Placeholder summary of what this role involves and what it is focused on.',
    tags: ['Tag One', 'Tag Two'],
    bullets: [
      'Placeholder responsibility or achievement line one.',
      'Placeholder responsibility or achievement line two.',
      'Placeholder responsibility or achievement line three.',
    ],
    tools: [
      { name: 'Python', icon: pythonIcon },
    ],
  },
  {
    role: 'Role Title Placeholder',
    org: 'Organization / Context Placeholder',
    status: 'Freelance',
    dateRange: 'Month 2022 – Month 2022',
    description: 'Placeholder summary of what this role involves and what it is focused on.',
    tags: ['Tag One', 'Tag Two'],
    bullets: [
      'Placeholder responsibility or achievement line one.',
      'Placeholder responsibility or achievement line two.',
      'Placeholder responsibility or achievement line three.',
    ],
    tools: [
      { name: 'Kali Linux', icon: kaliIcon },
      { name: 'JavaScript', icon: jsIcon },
    ],
  },
];

export const expQuote = {
  text: 'Every experience adds a new layer to who I am.',
  author: 'Rudrajit Roy',
};
