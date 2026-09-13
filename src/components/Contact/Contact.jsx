import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiMessageSquare,
  FiEdit3,
  FiSend,
  FiGithub,
  FiLinkedin,
  FiInstagram,
} from 'react-icons/fi';
import contactBgTemplate from '../../assets/images/contact-bg-template.webp';
import './Contact.css';

// Social links — apne real profile URLs se replace kar lena
const socials = [
  { label: 'Email', href: 'mailto:hello@example.com', icon: FiMail },
  { label: 'LinkedIn', href: 'https://linkedin.com/', icon: FiLinkedin },
  { label: 'GitHub', href: 'https://github.com/', icon: FiGithub },
  { label: 'Instagram', href: 'https://instagram.com/', icon: FiInstagram },
];

const MESSAGE_LIMIT = 500;

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MESSAGE_LIMIT) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hook this up to your email service / backend later.
    console.log(form);
  };

  return (
    <section id="contact" className="contact">
      {/* Background — tumhara diya hua template image */}
      <div className="contact__bg" aria-hidden="true">
        <img src={contactBgTemplate} className="contact__bg-img" alt="" />
      </div>

      {/* Corner decor labels */}
      <p className="contact__decor contact__decor--tl" aria-hidden="true">
        AVAILABLE
        <br />
        FOR NEW
        <br />
        OPPORTUNITIES
      </p>
      <p className="contact__decor contact__decor--tr" aria-hidden="true">
        SAME
        <br />
        IDEAS
        <br />
        BIGGER
        <br />
        TOMORROW
      </p>

      <div className="container contact__inner">
        <div className="contact__grid">
          <motion.div
            className="contact__left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="contact__eyebrow">
              <span className="contact__eyebrow-line" />
              06. LET&apos;S CONNECT
            </p>
            <h2 className="contact__heading">
              Let&apos;s
              <br />
              <span>Connect</span>
            </h2>
            <p className="contact__sub">
              Have a project in mind, a question, or just want to say hi? I&apos;d love to hear
              from you. Let&apos;s build something amazing together.
            </p>

            <div className="contact__socials">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="contact__right"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="contact__card">
              <div className="contact__card-top">
                <p className="contact__card-label">
                  <span className="contact__eyebrow-line" />
                  SEND A MESSAGE
                </p>
                <p className="contact__card-reply">
                  <span className="contact__reply-dot" />I usually reply within 24 hours.
                </p>
              </div>

              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__row">
                  <div className="contact__field">
                    <FiUser className="contact__field-icon" />
                    <input
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="contact__field">
                    <FiMail className="contact__field-icon" />
                    <input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="contact__field">
                  <FiMessageSquare className="contact__field-icon" />
                  <input
                    name="subject"
                    type="text"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact__field contact__field--textarea">
                  <FiEdit3 className="contact__field-icon contact__field-icon--top" />
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                  <span className="contact__char-count">
                    {form.message.length} / {MESSAGE_LIMIT}
                  </span>
                </div>

                <button type="submit" className="contact__submit">
                  <span>Send Message</span>
                  <FiSend />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;