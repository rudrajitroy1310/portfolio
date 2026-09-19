import { useEffect, useState } from 'react';
import Preloader from './components/Preloader/Preloader';
import NavbarMobile from './components/Navbar/NavbarMobile';
import HeroMobile from './components/Hero/HeroMobile';
import AboutMobile from './components/About/AboutMobile';
import SkillsMobile from './components/Skills/SkillsMobile';
import ProjectsMobile from './components/Projects/ProjectsMobile';
import CertificationsExperienceMobile from './components/CertificationsExperience/CertificationsExperienceMobile';
import ContactMobile from './components/Contact/ContactMobile';
import Footer from './components/Footer/Footer';

// 9:16 (portrait/mobile) design — Navbar, Hero aur About ab apna alag
// mobile-optimized design use kar rahe hain (NavbarMobile, HeroMobile,
// AboutMobile). Baaki sections filhaal temporarily desktop wale hi
// components use kar rahe hain (taaki mobile screen blank na dikhe), jaise
// jaise unka apna mobile design banega, use yahan swap karte jaayenge
// CustomCursor yahan jaan-boojh kar nahi hai
// — touch devices pe cursor concept apply nahi hota.
function MobileApp() {
  const [introDone, setIntroDone] = useState(false);

  // Jo section screen pe nahi hai uski infinite CSS animations (glow/pulse)
  // pause kar dete hain (index.css: [data-offscreen="true"]). Screen pe aate
  // hi wapas chalti hain — dikhne mein kuch nahi badalta, bas scroll ke waqt
  // GPU pe ek saath 15+ animations ka bojh nahi padta.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const sections = document.querySelectorAll('.mobile-app-shell main > section');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.setAttribute('data-offscreen', e.isIntersecting ? 'false' : 'true');
        });
      },
      { rootMargin: '150px 0px 150px 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mobile-app-shell">
      <Preloader onComplete={() => setIntroDone(true)} />
      <NavbarMobile />
      <main className={`app-reveal${introDone ? ' is-revealed' : ''}`}>
        <HeroMobile introDone={introDone} />
        <AboutMobile />
        <SkillsMobile />
        <ProjectsMobile />
        <CertificationsExperienceMobile />
        <ContactMobile />
      </main>
      <Footer />
    </div>
  );
}

export default MobileApp;