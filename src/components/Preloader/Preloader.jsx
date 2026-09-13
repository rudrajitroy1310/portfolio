import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FiLock, FiCrosshair } from 'react-icons/fi';
import preloaderLeftBg from '../../assets/images/preloader-left.webp';
import preloaderRightBg from '../../assets/images/preloader-right.webp';
import rrLogo from '../../assets/images/rr-logo.webp';
import './Preloader.css';

const BOOT_LOGS = [
  'LOADING PORTFOLIO...',
  'CHECKING SYSTEMS... OK',
  'VERIFYING ASSETS... OK',
  'PREPARING EXPERIENCE... OK',
];

const NAME = 'RUDRAJIT ROY';

/**
 * Stage content ko ek hi jagah define kiya hai kyunki isse hum
 * do baar (left door + right door) render karenge. Dono copies
 * hamesha 100vw-wide "stage" ke andar EXACT same absolute position
 * pe render hoti hain — door wrapper ka overflow:hidden + offset
 * math hi curtain/door illusion create karta hai (see Preloader.css).
 * Isliye is component ke andar koi door-specific positioning nahi
 * honi chahiye, sab kuch true viewport coordinates ke hisaab se hai.
 */
function StageContent({ progress, visibleLogs, phase }) {
  const active = phase === 'access' || phase === 'opening';
  const welcomeName = NAME.split(' ')[0];

  return (
    <div className="preloader__stage">
      {/* ---------- Background layers ----------
          Actual template art (world-map + rocky terrain + red glow)
          ab door-level pe render hoti hai (see Preloader return below),
          isliye yahan sirf generic overlays (scanlines/vignette) hain
          jo image ke upar consistent grain/depth add karte hain. */}
      <div className="preloader__scanlines" />
      <div className="preloader__vignette" />

      {/* ---------- Top left: name ---------- */}
      <div className="preloader__brand">
        <div className="preloader__brand-dash" />
        <div className="preloader__brand-name">
          RUDRAJIT <span>ROY</span>
        </div>
        <div className="preloader__brand-sub">PORTFOLIO</div>
      </div>

      {/* ---------- Top right: status + nav ---------- */}
      <div className="preloader__nav">
        <div className="preloader__nav-status">&gt; INITIALIZING...</div>
        <ul className="preloader__nav-list">
          <li>SKILLS</li>
          <li>PROJECTS</li>
          <li>EXPERIENCE</li>
          <li>CONTACT</li>
        </ul>
        <span className="preloader__corner preloader__corner--tr" />
      </div>

      {/* ---------- Center: radar + logo ---------- */}
      <div className="preloader__core">
        <div className={`preloader__seam${active ? ' is-active' : ''}`} />
        <div className="preloader__radar-ticks" />

        <svg
          className="preloader__radar"
          viewBox="0 0 420 420"
          aria-hidden="true"
        >
          <circle className="ring ring--outer ring--dash" cx="210" cy="210" r="206" />
          <circle className="ring ring--slow" cx="210" cy="210" r="190" />
          <circle className="ring ring--dash ring--rev" cx="210" cy="210" r="150" />
          <circle className="ring ring--fast" cx="210" cy="210" r="112" />
          <circle className="ring ring--dash" cx="210" cy="210" r="78" />
          <path className="arc arc--a" d="M 30.6 126.3 A 198 198 0 0 1 158.8 18.7" />
          <path className="arc arc--b" d="M 294.0 64.5 A 168 168 0 0 1 375.4 180.8" />
          <path className="arc arc--c" d="M 334.0 255.1 A 132 132 0 0 1 221.5 341.5" />
        </svg>

        <div className={`preloader__logo${active ? ' is-flash' : ''}`}>
          <img
            className="preloader__logo-img"
            src={rrLogo}
            alt="RR"
            draggable="false"
          />
        </div>
      </div>

      {/* ---------- Right middle: tagline ---------- */}
      <div className="preloader__tagline">
        <div className="preloader__tagline-main">
          CODE <span>/</span> SECURE <span>/</span> BUILD
        </div>
        <div className="preloader__tagline-sub">TURNING IDEAS INTO IMPACT</div>
      </div>

      {/* ---------- Bottom left: boot log ---------- */}
      <div className="preloader__log" aria-live="polite">
        {BOOT_LOGS.map((line, i) => (
          <div
            key={line}
            className={`preloader__log-line${i < visibleLogs ? ' is-visible' : ''}`}
          >
            <span className="preloader__log-caret">&gt;&gt;</span> {line}
          </div>
        ))}
        <div
          className={`preloader__log-line preloader__log-line--welcome${
            visibleLogs >= BOOT_LOGS.length + 1 ? ' is-visible' : ''
          }`}
        >
          <span className="preloader__log-caret">&gt;&gt;</span> WELCOME, {welcomeName.toUpperCase()}
        </div>
      </div>

      {/* ---------- Bottom center: progress ---------- */}
      <div className="preloader__progress">
        <div className="preloader__progress-label">
          LOADING EXPERIENCE <span>{progress}%</span>
        </div>
        <div className="preloader__progress-track">
          <div
            className="preloader__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ---------- Bottom left corner: coords ---------- */}
      <div className="preloader__coords">
        <FiCrosshair aria-hidden="true" />
        <span>22.5726&deg; N | 88.3639&deg; E</span>
      </div>

      {/* ---------- Bottom right corner: security tags ---------- */}
      <div className="preloader__tags">
        <FiLock aria-hidden="true" />
        <span>SECURITY / DEVELOPMENT / INNOVATION</span>
      </div>
    </div>
  );
}

function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [phase, setPhase] = useState('boot'); // boot -> access -> opening -> done
  const [removed, setRemoved] = useState(false);

  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const finish = () => {
      document.body.style.overflow = prevOverflow;
      onComplete?.();
      // Thoda buffer taaki hero ka fade-in overlap se pehle DOM se hata sake
      setTimeout(() => setRemoved(true), 50);
    };

    if (prefersReducedMotion) {
      // Motion-sensitive users ke liye: sirf quick fade, koi door/parallax nahi
      setVisibleLogs(BOOT_LOGS.length + 1);
      setProgress(100);
      setPhase('done');
      const t = setTimeout(finish, 400);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = prevOverflow;
      };
    }

    const progressData = { value: 0 };
    const tl = gsap.timeline();

    gsap.set([leftDoorRef.current, rightDoorRef.current], {
      xPercent: 0,
      rotateY: 0,
      scale: 1,
    });

    tl.call(() => setVisibleLogs(1), null, 0);
    tl.call(() => setVisibleLogs(2), null, 0.5);
    tl.call(() => setVisibleLogs(3), null, 1.05);
    tl.call(() => setVisibleLogs(4), null, 1.6);

    tl.to(
      progressData,
      {
        value: 100,
        duration: 2.15,
        ease: 'power2.inOut',
        onUpdate: () => setProgress(Math.floor(progressData.value)),
      },
      0
    );

    tl.call(
      () => {
        setVisibleLogs(BOOT_LOGS.length + 1);
        setPhase('access');
      },
      null,
      2.2
    );

    tl.call(() => setPhase('opening'), null, 2.55);

    tl.to(
      leftDoorRef.current,
      {
        xPercent: -100,
        rotateY: -10,
        scale: 0.94,
        duration: 1.1,
        ease: 'power4.inOut',
      },
      2.6
    );
    tl.to(
      rightDoorRef.current,
      {
        xPercent: 100,
        rotateY: 10,
        scale: 0.94,
        duration: 1.1,
        ease: 'power4.inOut',
      },
      2.6
    );

    tl.call(() => setPhase('done'), null, 3.55);
    tl.call(finish, null, 3.7);

    return () => {
      tl.kill();
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (removed) return null;

  return (
    <div className={`preloader${phase === 'done' ? ' is-done' : ''}`} role="status">
      <div className="preloader__door preloader__door--left" ref={leftDoorRef}>
        <div
          className="preloader__door-bg"
          style={{ backgroundImage: `url(${preloaderLeftBg})` }}
        />
        <StageContent progress={progress} visibleLogs={visibleLogs} phase={phase} />
      </div>
      <div className="preloader__door preloader__door--right" ref={rightDoorRef}>
        <div
          className="preloader__door-bg"
          style={{ backgroundImage: `url(${preloaderRightBg})` }}
        />
        <StageContent progress={progress} visibleLogs={visibleLogs} phase={phase} />
      </div>
    </div>
  );
}

export default Preloader;