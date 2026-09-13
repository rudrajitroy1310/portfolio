import { useState } from 'react';
import Preloader from './components/Preloader/Preloader';
import NavbarMobile from './components/Navbar/NavbarMobile';
import HeroMobile from './components/Hero/HeroMobile';
import AboutMobile from './components/About/AboutMobile';
import Skills from './components/Skills/Skills';
import ProjectsMobile from './components/Projects/ProjectsMobile';
import CertificationsExperience from './components/CertificationsExperience/CertificationsExperience';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

// 9:16 (portrait/mobile) design — Navbar, Hero aur About ab apna alag
// mobile-optimized design use kar rahe hain (NavbarMobile, HeroMobile,
// AboutMobile). Baaki sections filhaal temporarily desktop wale hi
// components use kar rahe hain (taaki mobile screen blank na dikhe), jaise
// jaise unka apna mobile design banega, use yahan swap karte jaayenge
// (e.g. Skills -> SkillsMobile). CustomCursor yahan jaan-boojh kar nahi hai
// — touch devices pe cursor concept apply nahi hota.
function MobileApp() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setIntroDone(true)} />
      <NavbarMobile />
      <main className={`app-reveal${introDone ? ' is-revealed' : ''}`}>
        <HeroMobile introDone={introDone} />
        <AboutMobile />
        <Skills />
        <ProjectsMobile />
        <CertificationsExperience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default MobileApp;