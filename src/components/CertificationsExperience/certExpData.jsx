import { BsAward, BsPatchCheckFill, BsBarChartFill } from 'react-icons/bs';
import pythonIcon from '../../assets/icons/python.webp';
import kaliIcon from '../../assets/icons/kali-linux.webp';
import jsIcon from '../../assets/icons/javascript.webp';
import dcscCertImage from '../../assets/images/certificates/dcsc-certificate.webp';
import tdoLogo from '../../assets/images/certificates/tdo-logo.webp';
import ciscoCertImage from '../../assets/images/certificates/cisco-cybersecurity-certificate.webp';
import ciscoLogo from '../../assets/images/certificates/cisco-logo.webp';
import ciscoCtmCertImage from '../../assets/images/certificates/cisco-cyber-threat-management-certificate.webp';
import tcsionCertImage from '../../assets/images/certificates/tcsion-it-primer-certificate.webp';
import tcsionLogo from '../../assets/images/certificates/tcsion-logo.webp';
import nasscomCertImage from '../../assets/images/certificates/nasscom-genai-tools-certificate.webp';
import futureskillsLogo from '../../assets/images/certificates/futureskills-prime-logo.webp';

// ---- Shared dummy data for Certifications & Experience — used by both the
// desktop (CertificationsExperience) and mobile (CertificationsExperienceMobile)
// components, plus the two "View All" modals, so there's a single source of
// truth instead of duplicating this array in two places. ----
// credentialId abhi masked (••••) hai, real ID milte hi wahan daal dena.
export const certifications = [
  {
    title: 'DCSC — Drop Certified Security Course',
    issuer: 'The Drop Organization (TDO Tech Education Pvt. Ltd.)',
    category: 'Cybersecurity',
    description: 'Successfully completed the requirements and examination for Web Application Penetration Testing under the Drop Certified Security Course (DCSC).',
    tags: ['Cybersecurity', 'Web Application Security', 'Penetration Testing', 'Web Security', 'Vulnerability Assessment'],
    date: 'Apr 2026',
    credentialId: 'DCSC-RRBR1225',
    link: '#',
    image: dcscCertImage,
    issuerLogo: tdoLogo,
  },
  {
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    category: 'Cybersecurity',
    description: 'Successfully completed the Introduction to Cybersecurity course offered through the Cisco Networking Academy program, covering foundational concepts of cybersecurity and digital security.',
    tags: ['Cybersecurity', 'Network Security', 'Security Fundamentals', 'Cyber Awareness'],
    date: 'Aug 2026',
    credentialId: '11950e89-dae7-49b6-a6b9-0efd7562c552',
    link: '#',
    image: ciscoCertImage,
    issuerLogo: ciscoLogo,
  },
  {
    title: 'Cyber Threat Management',
    issuer: 'Cisco Networking Academy',
    category: 'Cybersecurity',
    description: 'Successfully completed the Cyber Threat Management course through the Cisco Networking Academy program, covering concepts related to identifying, understanding, and managing cyber threats.',
    tags: ['Cybersecurity', 'Threat Management', 'Cyber Threats', 'Network Security', 'Security Operations'],
    date: 'Sep 2026',
    credentialId: 'cde896b6-eceb-4846-a831-4651bd4bcd67',
    link: '#',
    image: ciscoCtmCertImage,
    issuerLogo: ciscoLogo,
  },
  {
    title: 'TCS iON Career Edge – IT Primer',
    issuer: 'TCS iON — Tata Consultancy Services',
    category: 'Development',
    description: 'Successfully completed the TCS iON Career Edge – IT Primer course, covering IT industry fundamentals, job tools, industry elements, trending technologies, and career development.',
    tags: ['IT Fundamentals', 'Career Development', 'Trending Technologies', 'IT Industry', 'TCS iON'],
    date: 'Sep 2026',
    credentialId: '8739-33394418-1016',
    link: '#',
    image: tcsionCertImage,
    issuerLogo: tcsionLogo,
  },
  {
    title: 'Gen AI Tools',
    issuer: 'FutureSkills Prime / IT-ITeS Sector Skills Council (Nasscom)',
    category: 'Other',
    description: 'Certificate of participation for successfully completing Gen AI Tools, aligned with competency standards developed by the IT-ITeS Sector Skills Council Nasscom in collaboration with industry and government.',
    tags: ['Generative AI', 'AI Tools', 'Artificial Intelligence', 'Emerging Technology', 'Digital Skills'],
    date: 'Aug 2026',
    credentialId: '26060825933',
    link: '#',
    image: nasscomCertImage,
    issuerLogo: futureskillsLogo,
  },
  {
    title: 'Certification Name Placeholder One',
    issuer: 'Issuing Platform',
    category: 'Cybersecurity',
    description: 'Placeholder description — replace with what this certification actually covers.',
    tags: ['Cybersecurity', 'Hands-on'],
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
    tags: ['Networking', 'Hands-on'],
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
    tags: ['Cloud', 'Hands-on'],
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
    tags: ['Development', 'Hands-on'],
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
    tags: ['Cybersecurity', 'Hands-on'],
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
    tags: ['Other', 'Hands-on'],
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