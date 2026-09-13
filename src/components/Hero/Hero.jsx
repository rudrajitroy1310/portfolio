import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroVideoPoster from '../../assets/images/hero-video-poster.webp';
import introVideo from '../../assets/videos/intro.mp4';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const roles = [
  'Cybersecurity Enthusiast & Builder',
  'Digital Forensics Learner',
  'Full Stack Developer',
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'linkedin' },
  { label: 'Email', href: 'mailto:hello@example.com', icon: 'mail' },
  { label: 'X', href: 'https://x.com/', icon: 'x' },
];

function Icon({ name }) {
  switch (name) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.94c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.16v3.2c0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.21h4.97V24H.24V8.21Zm8.29 0h4.77v2.15h.07c.66-1.26 2.29-2.58 4.71-2.58 5.03 0 5.96 3.31 5.96 7.62V24h-4.96v-7.73c0-1.85-.03-4.22-2.57-4.22-2.57 0-2.97 2.01-2.97 4.09V24H8.53V8.21Z" />
        </svg>
      );
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2" y="4.5" width="20" height="15" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M18.9 2h3.4l-7.4 8.5L23.6 22h-6.8l-5.3-6.9L5.4 22H2l7.9-9.1L1.6 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.9L6.4 4h-2l13.3 16Z" />
        </svg>
      );
    default:
      return null;
  }
}

function Hero({ introDone = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const roleTextRef = useRef(null);
  // Silent audio warm-up chal raha hai jab tak true hai — is dauraan
  // onPlay/onPause se aane wale state updates ignore kar dete hain, taaki
  // custom poster image beech mein flash na ho.
  const warmingRef = useRef(false);

  // ---------- Typewriter: role line 3 titles ke beech cycle karti hai —
  // type karo, thodi der ruko, delete karo, agla title, loop chalta rahega ----------
  useEffect(() => {
    const el = roleTextRef.current;
    if (!el) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      // Motion kam rakhni hai, isliye sirf simple text-switch (koi typing animation nahi)
      let i = 0;
      el.textContent = roles[0];
      const interval = setInterval(() => {
        i = (i + 1) % roles.length;
        el.textContent = roles[i];
      }, 2600);
      return () => clearInterval(interval);
    }

    const TYPE_SPEED = 55;
    const DELETE_SPEED = 28;
    const HOLD_TIME = 1900;
    const GAP_TIME = 450;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const tick = () => {
      const current = roles[roleIndex];

      if (!isDeleting) {
        charIndex += 1;
        el.textContent = current.slice(0, charIndex);

        if (charIndex === current.length) {
          isDeleting = true;
          timeoutId = setTimeout(tick, HOLD_TIME);
          return;
        }
        timeoutId = setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex -= 1;
        el.textContent = current.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          timeoutId = setTimeout(tick, GAP_TIME);
          return;
        }
        timeoutId = setTimeout(tick, DELETE_SPEED);
      }
    };

    timeoutId = setTimeout(tick, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  // ---------- GSAP: hero entrance timeline — ab yeh sirf tab chalta hai jab
  // Preloader ke doors poori tarah khul chuke hain (introDone === true), page
  // mount hote hi nahi. Isse animation hidden state mein "khatam" nahi hoti —
  // user ko actually dikhti hai. ----------
  useLayoutEffect(() => {
    if (!introDone) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.05 });

      tl.from('.hero__bg', { opacity: 0, scale: 1.08, duration: 1.1, ease: 'power2.out' })
        .from('.hero__kicker', { opacity: 0, y: 16, duration: 0.5 }, '-=0.6')
        .from('.hero__name', { opacity: 0, y: 34, duration: 0.7 }, '-=0.3')
        .from('.hero__role', { opacity: 0, y: 20, duration: 0.55 }, '-=0.4')
        .from('.hero__tagline', { opacity: 0, y: 18, duration: 0.55 }, '-=0.35')
        .from('.hero__actions .hero__cta', {
          opacity: 0,
          y: 16,
          duration: 0.5,
          stagger: 0.1,
        }, '-=0.3')
        .from('.hero__socials a', {
          opacity: 0,
          y: 12,
          duration: 0.4,
          stagger: 0.06,
        }, '-=0.3')
        .from(['.hero__corner--left', '.hero__corner--right'], {
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
        }, '-=0.4')
        .from('.hero__play', { opacity: 0, scale: 0.7, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.5')
        .from('.hero__scroll-cue', { opacity: 0, y: -10, duration: 0.5 }, '-=0.3');
    }, heroRef);

    return () => ctx.revert();
  }, [introDone]);

  // ---------- GSAP: parallax — hero bg thoda slow scroll hota hai jab user neeche jaata hai ----------
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.to('.hero__bg', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // ---------- Audio "warm-up" fix ----------
  // Kai browsers me video ka audio decoder pehli baar "cold" hota hai, isliye
  // jab video pehli baar play hota hai, shuru ke kuch milliseconds ka sound
  // cut ho jaata hai (sirf pehli baar — dobara play karo toh theek chalta hai).
  // Fix: page load hote hi, user ko dikhaye bina, video ko ek baar muted state
  // mein silently "play + turant pause" kar dete hain. Isse decoder pehle se
  // warm/ready ho jaata hai, aur jab user actually play button dabata hai,
  // audio bilkul shuru se, bina cut hue, sunayi deta hai.
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return undefined;

    let cancelled = false;

    const warmUp = () => {
      if (cancelled) return;
      warmingRef.current = true;
      vid.muted = true;
      const playPromise = vid.play();
      const finish = () => {
        vid.pause();
        vid.currentTime = 0;
        vid.muted = false;
        warmingRef.current = false;
      };
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            if (cancelled) return;
            finish();
          })
          .catch(() => {
            // Browser ne muted autoplay bhi block kar diya — koi baat nahi,
            // sirf muted wapas false kar do, normal click-to-play kaam karega.
            vid.muted = false;
            warmingRef.current = false;
          });
      } else {
        finish();
      }
    };

    if (vid.readyState >= 2) {
      warmUp();
    } else {
      vid.addEventListener('loadeddata', warmUp, { once: true });
    }

    return () => {
      cancelled = true;
      vid.removeEventListener('loadeddata', warmUp);
    };
  }, []);

  const handleToggle = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (!vid.paused) {
      vid.pause();
      vid.load();
      setIsPlaying(false);
      return;
    }

    const start = () => {
      vid.play().catch(() => {});
    };
    if (vid.readyState >= 3) {
      start();
    } else {
      vid.addEventListener('canplaythrough', start, { once: true });
    }
  };

  const handleEnded = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      vid.load();
    }
    setIsPlaying(false);
  };

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero__bg">
        <video
          ref={videoRef}
          className="hero__media"
          src={introVideo}
          poster={heroVideoPoster}
          preload="auto"
          playsInline
          onPlay={() => {
            if (!warmingRef.current) setIsPlaying(true);
          }}
          onPause={() => {
            if (!warmingRef.current) setIsPlaying(false);
          }}
          onEnded={handleEnded}
        />
        {!isPlaying && (
          <img
            src={heroVideoPoster}
            alt=""
            className="hero__poster"
            aria-hidden="true"
          />
        )}
        <div className="hero__scrim" />
      </div>

      <div className="hero__content">
        <p className="hero__kicker">Hello, I&apos;m</p>
        <h1 className="hero__name">
          Rudrajit <span>Roy</span>
        </h1>
        <p className="hero__role">
          <span className="hero__role-text" ref={roleTextRef} aria-hidden="true" />
          <span className="hero__role-cursor" aria-hidden="true" />
          <span className="hero__role-sr">{roles.join(' · ')}</span>
          <span className="hero__role-line" />
        </p>
        <p className="hero__tagline">
          Exploring the intersection of Security, Technology and Human
          Potential to build a Safer Digital World.
        </p>

        <div className="hero__actions">
          <a href="#contact" className="hero__cta hero__cta--solid" data-magnetic>
            Let&apos;s Connect
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
          <a href="#projects" className="hero__cta hero__cta--outline" data-magnetic>
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 3.5h9l3 3V16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
              <path d="M13 3.5V7h3" />
            </svg>
            View My Work
          </a>
        </div>

        <div className="hero__socials">
          {socials.map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noreferrer">
              <Icon name={s.icon} />
            </a>
          ))}
        </div>
      </div>

      <p className="hero__corner hero__corner--left">
        <span>// security · technology · people</span>
        a better tomorrow
      </p>

      <p className="hero__corner hero__corner--right">
        <span>&lt;/&gt;</span>
        building a safer digital world
      </p>

      <button
        type="button"
        className={`hero__play ${isPlaying ? 'is-playing' : ''}`}
        aria-label={isPlaying ? 'Stop intro video' : 'Play intro video'}
        data-magnetic
        onClick={handleToggle}
      >
        <span className="hero__play-ring" />
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        )}
      </button>

      <a href="#about" className="hero__scroll-cue" aria-label="Scroll to about section">
        <span>scroll</span>
        <svg viewBox="0 0 16 24" width="14" height="22" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="1" y="1" width="14" height="22" rx="7" />
          <circle className="hero__scroll-dot" cx="8" cy="7" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </section>
  );
}

export default Hero;