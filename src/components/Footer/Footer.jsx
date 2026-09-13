import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiGithub, FiLinkedin, FiInstagram, FiMail } from 'react-icons/fi';
import footerBgTemplate from '../../assets/images/footer-bg-template.webp';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

// Social links — apne real profile URLs se replace kar lena
const socials = [
  { label: 'GitHub', href: 'https://github.com/', icon: FiGithub },
  { label: 'LinkedIn', href: 'https://linkedin.com/', icon: FiLinkedin },
  { label: 'Instagram', href: 'https://instagram.com/', icon: FiInstagram },
  { label: 'Email', href: 'mailto:hello@example.com', icon: FiMail },
];

function Footer() {
  const year = new Date().getFullYear();

  const footerRef = useRef(null);
  const brandRef = useRef(null);
  const linksRef = useRef(null);
  const rightRef = useRef(null);
  const bottomRef = useRef(null);
  const socialRefs = useRef([]);

  // ---------- GSAP: scroll-triggered entrance (ek hi baar chalta hai) ----------
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from([brandRef.current, linksRef.current, rightRef.current], {
        opacity: 0,
        y: 26,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(bottomRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.6,
        delay: 0.25,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // ---------- GSAP: magnetic hover — social icons cursor ki taraf khinchte hain ----------
  const handleMagnetMove = (e, i) => {
    const el = socialRefs.current[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: relX * 0.35,
      y: relY * 0.35,
      scale: 1.12,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleMagnetLeave = (i) => {
    const el = socialRefs.current[i];
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <footer className="footer" id="footer" ref={footerRef}>
      {/* Background — tumhara diya hua template image (koi zoom/scale animation nahi, static rakha) */}
      <div className="footer__bg" aria-hidden="true">
        <img src={footerBgTemplate} className="footer__bg-img" alt="" />
      </div>

      <div className="footer__inner footer__top">
        <div className="footer__brand" ref={brandRef}>
          {/* Logo yahan nahi banaya — woh tumhare bg template image ke andar hi hai */}
          <div className="footer__brand-text">
            <p className="footer__tagline">BUILD &middot; LEARN &middot; GROW &middot; REPEAT</p>
            <p className="footer__name">
              RUDRAJIT <span>ROY</span>
            </p>
            <p className="footer__tagline footer__tagline--bottom">TURNING IDEAS INTO IMPACT</p>
          </div>
        </div>

        <nav className="footer__links" ref={linksRef}>
          {links.map((link, i) => (
            <span key={link.href} className="footer__link-item">
              {i > 0 && <span className="footer__pipe" aria-hidden="true" />}
              <a href={link.href}>{link.label}</a>
            </span>
          ))}
        </nav>

        <div className="footer__right" ref={rightRef}>
          <p className="footer__decor" aria-hidden="true">
            SAME
            <br />
            IDEAS
            <br />
            BIGGER
            <br />
            TOMORROW
            <span className="footer__decor-line" />
          </p>

          <div className="footer__socials">
            {socials.map(({ label, href, icon: Icon }, i) => (
              <a
                key={label}
                ref={(el) => {
                  socialRefs.current[i] = el;
                }}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label={label}
                data-magnetic
                onMouseMove={(e) => handleMagnetMove(e, i)}
                onMouseLeave={() => handleMagnetLeave(i)}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__divider" aria-hidden="true">
        <span className="footer__divider-sweep" />
      </div>

      <div className="footer__inner footer__bottom" ref={bottomRef}>
        <p className="footer__copy">&copy; {year} Rudrajit Roy. All rights reserved.</p>

        <p className="footer__credit">
          CRAFTED WITH <span className="footer__code">&lt;/&gt;</span> AND{' '}
          <span className="footer__heart">&#9829;</span>
        </p>

        <a href="#hero" className="footer__keep">
          KEEP BUILDING
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
      </div>
    </footer>
  );
}

export default Footer;