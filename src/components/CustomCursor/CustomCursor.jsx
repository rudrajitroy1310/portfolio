import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

// Selectors jinpe cursor "hover" state mein expand hota hai (flame tip bada/bright ho jaata hai)
const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, [data-cursor-hover]';
// Selectors jinpe magnetic pull lagta hai — khud element bhi cursor ki taraf thoda khinchta hai
const MAGNETIC_SELECTOR = '[data-magnetic]';

// Flame ek chain of segments hai — segment[0] cursor ko tight follow karta hai (flame ka
// nozzle/base), baaki segments pichhle segment ko lag ke saath follow karte hain. Jitni
// tez mouse move hoga, utna hi gap khulega aur flame utni hi lambi kheenchti dikhegi.
// Jab mouse ruk jaata hai, sab segments dheere dheere tip pe wapas simat jaate hain.
const SEGMENT_COUNT = 9;
const LERP = [0.45, 0.34, 0.27, 0.22, 0.18, 0.15, 0.12, 0.1, 0.08];
const SIZES = [22, 19, 16, 13, 10, 8, 6, 5, 4];
const COLORS = [
  '#ff8a93',
  '#ff6470',
  '#ff4a58',
  '#ff2f42',
  'var(--red)',
  '#e02138',
  'rgba(255, 39, 64, 0.65)',
  'rgba(190, 18, 36, 0.35)',
  'rgba(130, 10, 26, 0.12)',
];
const OPACITIES = [1, 0.96, 0.9, 0.8, 0.68, 0.54, 0.38, 0.22, 0.1];
const BLURS = [0, 0, 1, 2, 3, 4, 5, 6, 7];

function CustomCursor() {
  const wrapRef = useRef(null);
  const segmentRefs = useRef([]);
  const pingRef = useRef(null);
  const magneticTargetRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef(
    Array.from({ length: SEGMENT_COUNT }, () => ({ x: 0, y: 0 }))
  );
  const initializedRef = useRef(false);
  const lastMoveRef = useRef(0);
  const idleRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduceMotion) return undefined;

    document.documentElement.classList.add('has-custom-cursor');

    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    const tick = () => {
      const pts = pointsRef.current;
      const m = mouseRef.current;

      pts[0].x += (m.x - pts[0].x) * LERP[0];
      pts[0].y += (m.y - pts[0].y) * LERP[0];
      for (let i = 1; i < SEGMENT_COUNT; i += 1) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * LERP[i];
        pts[i].y += (pts[i - 1].y - pts[i].y) * LERP[i];
      }

      segmentRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translate(${pts[i].x}px, ${pts[i].y}px) translate(-50%, -50%)`;
      });

      // Idle detection: kuch der mouse na hile toh flame "settle" ho ke blink karti hai
      const now = performance.now();
      const isIdleNow = now - lastMoveRef.current > 350;
      if (isIdleNow !== idleRef.current) {
        idleRef.current = isIdleNow;
        wrap.classList.toggle('cc-flame--idle', isIdleNow);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const handleMove = (e) => {
      let x = e.clientX;
      let y = e.clientY;

      const magnetEl = magneticTargetRef.current;
      if (magnetEl) {
        const rect = magnetEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const pull = 0.35;
        x = e.clientX + (cx - e.clientX) * pull;
        y = e.clientY + (cy - e.clientY) * pull;
      }

      mouseRef.current = { x, y };
      lastMoveRef.current = performance.now();

      // Pehli move pe flame ko turant us jagah "teleport" karo, corner se ghisatte hue
      // nahi aana chahiye
      if (!initializedRef.current) {
        initializedRef.current = true;
        pointsRef.current = Array.from({ length: SEGMENT_COUNT }, () => ({ x, y }));
      }
    };

    const handleEnterHover = () => wrap.classList.add('cc-flame--lock');
    const handleLeaveHover = () => wrap.classList.remove('cc-flame--lock');

    const handleEnterMagnetic = (e) => {
      magneticTargetRef.current = e.currentTarget;
      wrap.classList.add('cc-flame--lock');
    };
    const handleLeaveMagnetic = () => {
      magneticTargetRef.current = null;
      wrap.classList.remove('cc-flame--lock');
    };

    const handleDown = () => {
      wrap.classList.add('cc-flame--click');
      if (pingRef.current) {
        gsap.fromTo(
          pingRef.current,
          { opacity: 0.7, scale: 0.3 },
          { opacity: 0, scale: 2.4, duration: 0.55, ease: 'power2.out' }
        );
      }
    };
    const handleUp = () => wrap.classList.remove('cc-flame--click');

    const handleLeaveWindow = () => gsap.to(wrap, { opacity: 0, duration: 0.2 });
    const handleEnterWindow = () => gsap.to(wrap, { opacity: 1, duration: 0.2 });

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseleave', handleLeaveWindow);
    document.addEventListener('mouseenter', handleEnterWindow);

    const bindTargets = () => {
      document.querySelectorAll(HOVER_SELECTOR).forEach((el) => {
        el.addEventListener('mouseenter', handleEnterHover);
        el.addEventListener('mouseleave', handleLeaveHover);
      });
      document.querySelectorAll(MAGNETIC_SELECTOR).forEach((el) => {
        el.addEventListener('mouseenter', handleEnterMagnetic);
        el.addEventListener('mouseleave', handleLeaveMagnetic);
      });
    };
    const unbindTargets = () => {
      document.querySelectorAll(HOVER_SELECTOR).forEach((el) => {
        el.removeEventListener('mouseenter', handleEnterHover);
        el.removeEventListener('mouseleave', handleLeaveHover);
      });
      document.querySelectorAll(MAGNETIC_SELECTOR).forEach((el) => {
        el.removeEventListener('mouseenter', handleEnterMagnetic);
        el.removeEventListener('mouseleave', handleLeaveMagnetic);
      });
    };

    bindTargets();
    const observer = new MutationObserver(() => {
      unbindTargets();
      bindTargets();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeaveWindow);
      document.removeEventListener('mouseenter', handleEnterWindow);
      unbindTargets();
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="cc-flame" ref={wrapRef} aria-hidden="true">
      {SIZES.map((size, i) => (
        <div
          key={i}
          ref={(el) => {
            segmentRefs.current[i] = el;
          }}
          className={`cc-flame-seg${i === 0 ? ' cc-flame-seg--tip' : ''}`}
          style={{
            width: size,
            height: size,
            background: COLORS[i],
            opacity: OPACITIES[i],
            filter: BLURS[i] ? `blur(${BLURS[i]}px)` : undefined,
            zIndex: 9999 - i,
          }}
        >
          {i === 0 && <div className="cc-flame__ping" ref={pingRef} />}
        </div>
      ))}
    </div>
  );
}

export default CustomCursor;