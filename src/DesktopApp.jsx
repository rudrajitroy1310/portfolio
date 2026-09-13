import { useState } from 'react';
import CustomCursor from './components/CustomCursor/CustomCursor';
import Preloader from './components/Preloader/Preloader';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import CertificationsExperience from './components/CertificationsExperience/CertificationsExperience';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

// Yeh poora 16:9 (landscape/desktop) design hai — jaisa ka taisa, koi change nahi.
function DesktopApp() {
  // Preloader ke doors khulne ke exact moment pe true hota hai —
  // isse neeche ka poora site "unlock" hone jaisa fade+scale reveal karta hai.
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setIntroDone(true)} />
      <CustomCursor />
      <Navbar />
      <main className={`app-reveal${introDone ? ' is-revealed' : ''}`}>
        <Hero introDone={introDone} />
        <About />
        <Skills />
        <Projects />
        <CertificationsExperience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default DesktopApp;
