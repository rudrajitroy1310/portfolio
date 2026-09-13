import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './NavbarMobile.css';

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

// Mobile (9:16) navbar — desktop Navbar ke andar jo hamburger/dropdown design
// already narrow-width (max-width: 960px) par kaam karta hai, wahi design yahan
// copy kiya hai. Fark sirf itna hai ki yahan woh "collapse into logo-only"
// wala scroll-based behavior nahi hai (woh sirf desktop ke wide-links ke liye
// tha) — mobile pe pill hamesha logo + hamburger dikhati hai.
function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#hero');
  // isHero: abhi Home/Hero section visible hai ya nahi
  const [isHero, setIsHero] = useState(true);
  // navExpanded: baaki sections me user ne logo click karke navbar manually khola hai
  const [navExpanded, setNavExpanded] = useState(false);

  const navRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const heroEl = document.getElementById('hero');

    const onScroll = () => {
      setScrolled(window.scrollY > 12);

      if (heroEl) {
        // Navbar height ke neeche tak hero dikh raha hai toh abhi bhi hero context hai
        const heroBottom = heroEl.getBoundingClientRect().bottom;
        setIsHero(heroBottom > 70);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hero section me wapas aane par navbar apne aap full ho jaye, manual toggle reset ho
  useEffect(() => {
    if (isHero) setNavExpanded(false);
  }, [isHero]);

  // Baaki sections me collapsed rahega jab tak user khud logo click na kare
  const collapsed = !isHero && !navExpanded;

  // Collapse hote hi agar dropdown khula tha toh usse bhi band kar do
  useEffect(() => {
    if (collapsed) setOpen(false);
  }, [collapsed]);

  // Scroll-spy: jis section me abhi user hai, usko real-time me track karke
  // active link automatically update karo
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter(Boolean);

    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: '-15% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // ---------- Scroll progress ring — RR logo ke around border, active SECTION ke hisaab se ----------
  // Continuous scroll % nahi — jitne sections utne hi discrete steps: Home me khaali,
  // About aate hi thoda bhare, Skills me aur, ... Contact tak aate poora ring ban jaaye.
  useEffect(() => {
    const ring = progressRef.current;
    if (!ring) return;

    const idx = links.findIndex((l) => l.href === active);
    const pct = idx >= 0 ? idx / (links.length - 1) : 0;
    // 1 = poora chhupa hua (koi border nahi), 0 = poora khinch gaya (full border)
    ring.style.strokeDashoffset = String(1 - pct);
  }, [active]);

  // ---------- GSAP: navbar entrance — page load pe hero se thoda pehle drop-in hota hai ----------
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        opacity: 0,
        y: -24,
        duration: 0.7,
        ease: 'power3.out',
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const handleLinkClick = (href) => {
    setActive(href);
    setOpen(false);
    // Link select karte hi navbar wapas collapse ho jaye (agar hero pe nahi hai)
    setNavExpanded(false);
  };

  const handleBrandClick = (e) => {
    if (!isHero) {
      // Hero ke ilawa kahin bhi ho toh logo sirf navbar open/close karega, navigate nahi karega
      e.preventDefault();
      setNavExpanded((v) => !v);
    } else {
      setActive('#hero');
    }
  };

  return (
    <header
      className={`navbar-m ${scrolled ? 'navbar-m--scrolled' : ''} ${open ? 'navbar-m--open' : ''} ${collapsed ? 'navbar-m--collapsed' : ''}`}
      ref={navRef}
    >
      <div className="navbar-m__inner">
        <a href="#hero" className="navbar-m__brand" onClick={handleBrandClick}>
          <span className="navbar-m__mark-wrap">
            <span className="navbar-m__mark">
              R<span>R</span>
            </span>
            <svg className="navbar-m__mark-ring" viewBox="0 0 40 40" aria-hidden="true">
              <rect
                ref={progressRef}
                x="2"
                y="2"
                width="36"
                height="36"
                rx="11"
                ry="11"
                pathLength="1"
              />
            </svg>
          </span>
          <span className="navbar-m__brand-text">Rudrajit Roy</span>
        </a>

        <button
          type="button"
          className="navbar-m__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav className="navbar-m__links">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href ? 'is-active' : ''}
              onClick={() => handleLinkClick(link.href)}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="navbar-m__cta" onClick={() => handleLinkClick('#contact')}>
            <span className="navbar-m__cta-dot" />
            Let&apos;s Connect
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </nav>
      )}
    </header>
  );
}

export default NavbarMobile;