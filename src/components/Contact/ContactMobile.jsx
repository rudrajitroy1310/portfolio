import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser, FiMail, FiMessageSquare, FiSend, FiMapPin, FiClock, FiCoffee,
} from 'react-icons/fi';
import { SiGmail } from 'react-icons/si';
import {
  BsLinkedin, BsGithub, BsInstagram,
} from 'react-icons/bs';
import contactMobileBg from '../../assets/images/contactmobile-bg.webp';
import './ContactMobile.css';

/* ---------- Social icons — apne real handles/links se replace kar lena.
   x/y = icon ki position bg-poster box ke 0-100% coordinate space mein. ---------- */
const socials = [
  {
    key: 'email', label: 'Email', sub: 'Drop a message', href: 'mailto:rudrajitroy1310@gmail.com', Icon: SiGmail, x: 13, y: 6,
  },
  {
    key: 'linkedin', label: 'LinkedIn', sub: "Let's connect", href: 'https://linkedin.com/in/rudrajit-roy', Icon: BsLinkedin, x: 38, y: 12,
  },
  {
    key: 'github', label: 'GitHub', sub: 'Check my work', href: 'https://github.com/rudrajitroy1310', Icon: BsGithub, x: 62, y: 44,
  },
  {
    key: 'instagram', label: 'Instagram', sub: 'Follow my updates', href: 'https://instagram.com/rudrajitroy1310', Icon: BsInstagram, x: 86, y: 50,
  },
];

/* Har icon ke label (Name + sub) ke neeche itni jagah chodni hai ki text
   khatam hone ke baad hi curve wala "big dot" aaye — taaki dot/line icon
   se chipke nahi, jaisa reference mein hai. Stem line (chhota upar wala
   dot se curve wale dot tak) sirf isi gap ke aakhri hisse mein khinchi
   jaati hai, taaki upar text ke liye poori jagah khaali rahe. */
const DOT_OFFSET_Y = 36;
const dots = socials.map((s) => ({ x: s.x, y: s.y + DOT_OFFSET_Y }));
/* Stem: chhota dot (label ke just neeche) se seedha neeche curve ke
   bade dot tak — reference ki "flagpole" line. */
const stems = socials.map((s) => ({
  x: s.x,
  y1: s.y + DOT_OFFSET_Y * 0.5,
  y2: s.y + DOT_OFFSET_Y,
}));
const ARROW_START = { x: 6, y: dots[0].y + 10 };

/* Catmull-Rom points ko smooth SVG bezier curve mein convert karta hai —
   Skills orbit wali hi technique, taaki garland line sahi se jhoole. */
function smoothPath(points) {
  if (points.length < 2) return '';
  const pts = points.map((p) => [p.x, p.y]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/* Solid garland curve — sirf dots ke beech (plane se pehle dot tak nahi,
   wahan alag se dashed "tail" line hai, jaisa reference mein hai). */
const WAVE_PATH = smoothPath(dots);
/* Plane se pehle dot tak ek seedhi dashed tail line */
const TAIL_PATH = `M ${ARROW_START.x} ${ARROW_START.y} L ${dots[0].x} ${dots[0].y}`;

const ideasList = [
  { label: 'Location', value: 'India', icon: FiMapPin },
  { label: 'Availability', value: 'Open to Opportunities', icon: FiClock },
  { label: 'Coffee Chat?', value: 'Always a good idea!', icon: FiCoffee },
];

/* ---------- Message form: ek time par sirf ek hi field dikhta hai
   (Name -> Email -> Message), reference ke single pill input jaisa —
   Send/Next button hi step ko aage badhata hai, aakhri step par submit
   ho jaata hai. ---------- */
const STEPS = [
  {
    key: 'name', placeholder: 'Your Name', type: 'text', Icon: FiUser,
  },
  {
    key: 'email', placeholder: 'Your Email', type: 'email', Icon: FiMail,
  },
  {
    key: 'message', placeholder: 'Your Message', type: 'text', Icon: FiMessageSquare,
  },
];

function ContactMobile() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [current.key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form[current.key].trim()) return;

    if (!isLastStep) {
      setStep((s) => s + 1);
      return;
    }
    // Hook this up to your email service / backend later.
    console.log(form);
    setForm({ name: '', email: '', message: '' });
    setStep(0);
  };

  const goToStep = (idx) => {
    // Peeche wale (already-filled) step par wapas jaane deta hai
    if (idx < step) setStep(idx);
  };

  return (
    <section id="contact" className="contactm">
      {/* ================= Poster zone: bg image + overlay (fixed aspect,
          isliye andar ke saare % positions hamesha safe/predictable hain) ================= */}
      <div className="contactm__bg">
        <img src={contactMobileBg} className="contactm__bg-img" alt="" aria-hidden="true" />
        <div className="contactm__scrim" aria-hidden="true" />

        {/* ---------- Top-left brand corner ---------- */}
        <div className="contactm__brand">
          <span className="contactm__brand-mark">RR</span>
          <span className="contactm__corner-rule" />
        </div>

        {/* ---------- Top-right corner ---------- */}
        <div className="contactm__corner contactm__corner--tr">
          <span className="contactm__corner-rule" />
        </div>

        {/* ---------- Heading block ---------- */}
        <div className="contactm__head">
          <p className="contactm__eyebrow">// 06 &nbsp;LET&apos;S CONNECT</p>
          <h2 className="contactm__heading">
            Let&apos;s <span>Connect</span>
          </h2>
          <p className="contactm__tagline">Same Ideas Bigger Tomorrow.</p>
          <p className="contactm__sub">
            Have a project in mind, a question, or just want to say hi?
            I&apos;d love to hear from you. Let&apos;s build something amazing together.
          </p>
          <span className="contactm__head-rule" />
        </div>

        {/* ---------- Social wave ---------- */}
        <div className="contactm__wave">
          <svg
            className="contactm__wave-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={TAIL_PATH} className="contactm__wave-tail" />
            <path d={WAVE_PATH} className="contactm__wave-path" />
            {stems.map((s) => (
              <line
                key={`stem-${s.x}-${s.y1}`}
                x1={s.x}
                y1={s.y1}
                x2={s.x}
                y2={s.y2}
                className="contactm__wave-stem"
              />
            ))}
            {stems.map((s) => (
              <circle key={`stemdot-${s.x}-${s.y1}`} cx={s.x} cy={s.y1} r="0.6" className="contactm__wave-stem-dot" />
            ))}
            {dots.map((d) => (
              <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r="0.9" className="contactm__wave-dot" />
            ))}
          </svg>

          {/* ---------- Paper airplane — reference jaisa outlined fold-style icon,
             dashed tail line se pehle dot tak connect hota hai ---------- */}
          <svg
            className="contactm__wave-plane"
            viewBox="0 0 40 40"
            style={{ left: `${ARROW_START.x}%`, top: `${ARROW_START.y}%` }}
            aria-hidden="true"
          >
            <path
              d="M4 32 L35 5 L23 36 L16 21 Z"
              fill="rgba(255, 39, 64, 0.12)"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path d="M16 21 L35 5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>

          {socials.map(({
            key, label, sub, href, Icon, x, y,
          }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`contactm__social contactm__social--${key}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span className="contactm__social-icon">
                <Icon />
              </span>
              <span className="contactm__social-label">{label}</span>
              <span className="contactm__social-sub">{sub}</span>
            </a>
          ))}

          <p className="contactm__wave-caption">GOOD IDEAS<br />BETTER PEOPLE //</p>
        </div>
      </div>

      {/* ================= Flowing zone: plain dark bg, normal document flow ================= */}
      <motion.div
        className="contactm__inner"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="contactm__send">
          <div className="contactm__send-top">
            <p className="contactm__send-label">
              <span className="contactm__eyebrow-line" />
              SEND A MESSAGE
            </p>
            <p className="contactm__reply-note">
              <span className="contactm__reply-dot" />
              I usually reply within 24 hours.
            </p>
          </div>

          <form className="contactm__form" onSubmit={handleSubmit}>
            <div className="contactm__pill">
              <current.Icon className="contactm__pill-icon" />
              <input
                key={current.key}
                name={current.key}
                type={current.type}
                placeholder={`${current.placeholder}...`}
                value={form[current.key]}
                onChange={handleChange}
                autoFocus={step !== 0}
                required
              />
              <button type="submit" className="contactm__pill-submit" aria-label={isLastStep ? 'Send message' : 'Next'}>
                <FiSend />
              </button>
            </div>

            <div className="contactm__steps">
              {STEPS.map((s, idx) => (
                <button
                  key={s.key}
                  type="button"
                  className={`contactm__step-dot${idx === step ? ' contactm__step-dot--active' : ''}${idx < step ? ' contactm__step-dot--done' : ''}`}
                  onClick={() => goToStep(idx)}
                  aria-label={`Go to ${s.key} field`}
                  disabled={idx > step}
                />
              ))}
            </div>
          </form>
        </div>

        <blockquote className="contactm__quote">
          <span className="contactm__quote-mark" aria-hidden="true">&ldquo;</span>
          <p>Great ideas start with a conversation.</p>
          <cite>— Rudrajit Roy</cite>
        </blockquote>

        <ul className="contactm__ideas">
          {ideasList.map(({
            label, value, icon: Icon,
          }) => (
            <li key={label}>
              <Icon className="contactm__ideas-icon" aria-hidden="true" />
              <span>
                <strong>{label}</strong>
                <em>{value}</em>
              </span>
            </li>
          ))}
        </ul>

        <div className="contactm__corners-bottom">
          <div className="contactm__corner contactm__corner--bl">
            <span className="contactm__corner-rule" />
            <p className="contactm__corner-text">
              LEARN<br />PRACTICE<br />GROW<br />REPEAT
            </p>
          </div>
          <div className="contactm__corner contactm__corner--br">
            <span className="contactm__corner-rule" />
            <p className="contactm__corner-text">
              AVAILABLE<br />FOR NEW<br />OPPORTUNITIES
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default ContactMobile;