import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { css } from "./styles";
import { useReveal } from "./motion";
import { Reveal, Card, SplitText, Typewriter, CountUp, Magnetic, Cursor, Background } from "./effects";
import ProjectList from "./ProjectList";
import {
  EMAIL, RESUME_LINK, NAV, ROLES, STATS, HERO_CHIPS, EXP, SKILLS, MARQUEE_TECH, MARQUEE_TOPICS,
  PROJECTS, CERTIFICATIONS, ACHIEVEMENTS, SOCIALS,
} from "./data";

const RING_C = 2 * Math.PI * 22; // back-to-top progress ring circumference

// ─── Small components ─────────────────────────────────────────────────────────

function SectionHeader({ num, title }) {
  const ref = useReveal();
  return (
    <div className="sec-header" ref={ref}>
      <span className="sec-num">{num}</span>
      <h2 className="sec-title"><span>{title}</span></h2>
    </div>
  );
}

function Marquee({ items, reverse = false }) {
  // Two identical halves → translateX(-50%) loops seamlessly
  const half = [...items, ...items];
  return (
    <div className={`marquee${reverse ? " marquee--rev" : ""}`}>
      <div className="marquee-track">
        {[...half, ...half].map((t, i) => (
          <span className="marquee-item" key={i}>{t}<i>✦</i></span>
        ))}
      </div>
    </div>
  );
}

function ResumeModal({ closing, onClose }) {
  const [resumeName, setResumeName] = useState("");
  const [resumeEmail, setResumeEmail] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeStatus, setResumeStatus] = useState("idle"); // idle | success
  const [resumeError, setResumeError] = useState("");

  const sendResume = async (e) => {
    e.preventDefault();
    if (!resumeName.trim() || !resumeEmail.trim()) return;
    setResumeLoading(true);
    setResumeError("");
    try {
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.send(
        "service_ssagqfn",
        "template_qh4e05p",
        {
          to_name: resumeName.trim(),
          to_email: resumeEmail.trim(),
          resume_link: RESUME_LINK,
        },
        "YCISAk5ht13cwgmnH"
      );
      setResumeStatus("success");
    } catch (err) {
      // EmailJS throws an EmailJSResponseStatus object with .status and .text
      const status = err?.status ?? "unknown";
      const text   = err?.text   ?? (typeof err === "string" ? err : JSON.stringify(err));
      console.error("[EmailJS] Error:", status, text);
      if (status === 400) {
        setResumeError("Invalid request — check that template variables match. (" + text + ")");
      } else if (status === 401 || status === 403) {
        setResumeError("Authentication failed — public key or service ID may be wrong.");
      } else if (status === 404) {
        setResumeError("Template or service not found — check dashboard IDs.");
      } else if (status === 429) {
        setResumeError("Too many requests — please try again in a minute.");
      } else {
        setResumeError(`Something went wrong (${status}: ${text}). Please try again.`);
      }
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <div
      className={`modal-backdrop${closing ? " closing" : ""}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {resumeStatus === "success" ? (
          <div className="modal-success">
            <div className="check">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C9B1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h3 id="resume-title">Resume sent!</h3>
            <p>Check your inbox — the resume has been sent to <strong>{resumeEmail}</strong>.</p>
            <button className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form onSubmit={sendResume}>
            <p className="modal-title" id="resume-title">Get my resume</p>
            <p className="modal-sub">I'll send the resume directly to your email.</p>
            <div className="modal-field">
              <label className="modal-label" htmlFor="resume-name">YOUR NAME</label>
              <input
                id="resume-name"
                className="modal-input"
                type="text"
                placeholder="e.g. Ayush Mishra"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="modal-field">
              <label className="modal-label" htmlFor="resume-email">YOUR EMAIL</label>
              <input
                id="resume-email"
                className="modal-input"
                type="email"
                placeholder="e.g. ayush@example.com"
                value={resumeEmail}
                onChange={(e) => setResumeEmail(e.target.value)}
                required
              />
            </div>
            {resumeError && <p className="modal-error">{resumeError}</p>}
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={resumeLoading || !resumeName.trim() || !resumeEmail.trim()}
              >
                {resumeLoading ? <><span className="spinner" /> Sending…</> : <>Send resume <span className="arrow">↗</span></>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [active, setActive] = useState("hero");
  const [modal, setModal] = useState("closed"); // closed | open | closing
  const [copied, setCopied] = useState(false);

  const progressRef = useRef(null);
  const ringRef = useRef(null);
  const heroRef = useRef(null);
  const timelineRef = useRef(null);
  const navListRef = useRef(null);
  const indicatorRef = useRef(null);

  const openModal = () => { setMenuOpen(false); setModal("open"); };
  const closeModal = useCallback(() => {
    setModal("closing");
    setTimeout(() => setModal("closed"), 220);
  }, []);

  // Scroll-linked visuals, batched to one update per frame
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      // Read all layout values before writing any styles, so the browser doesn't
      // have to recalculate layout mid-handler
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const tl = timelineRef.current;
      const tlRect = tl?.getBoundingClientRect();

      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = `${RING_C * (1 - p)}`;
      heroRef.current?.style.setProperty("--hp", Math.min(1, y / vh).toFixed(3));
      if (tlRect) {
        const tp = Math.min(1, Math.max(0, (vh * 0.7 - tlRect.top) / tlRect.height));
        tl.style.setProperty("--p", tp.toFixed(3));
      }
      setScrolled(y > 40);
      setShowTop(y > vh * 0.8);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Scrollspy: whichever section crosses the middle of the viewport is active
  useEffect(() => {
    const ids = ["hero", ...NAV.map(n => n.toLowerCase())];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Slide the nav pill under the active link
  useLayoutEffect(() => {
    const place = () => {
      const ind = indicatorRef.current;
      const link = navListRef.current?.querySelector(`a[data-id="${active}"]`);
      if (!ind) return;
      if (!link) { ind.style.opacity = "0"; return; }
      const { offsetWidth, offsetLeft } = link;
      ind.style.opacity = "1";
      ind.style.width = `${offsetWidth}px`;
      ind.style.transform = `translateX(${offsetLeft}px)`;
    };
    place();
    document.fonts?.ready.then(place);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  // Lock page scroll behind overlays; Escape closes them
  useEffect(() => {
    document.body.classList.toggle("locked", menuOpen || modal !== "closed");
  }, [menuOpen, modal]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      if (modal === "open") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, closeModal]);

  const go = (id) => {
    setMenuOpen(false);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <>
      <style>{css}</style>
      <Background />
      <Cursor />
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <button className="nav-logo" onClick={() => go("hero")} aria-label="Back to top">
          <span className="nav-logo-mark">AR</span>
          <span className="blink">ayush.dev</span>
        </button>
        <ul className="nav-links" ref={navListRef}>
          <li className="nav-indicator" ref={indicatorRef} aria-hidden="true" />
          {NAV.map(n => {
            const id = n.toLowerCase();
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  data-id={id}
                  className={active === id ? "active" : ""}
                  aria-current={active === id ? "true" : undefined}
                  onClick={e => { e.preventDefault(); go(id); }}
                >
                  {id}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="nav-right">
          <button className="nav-cta" onClick={openModal}>Resume ↓</button>
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        {NAV.map((n, i) => {
          const id = n.toLowerCase();
          return (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "active" : ""}
              style={{ "--i": i }}
              tabIndex={menuOpen ? 0 : -1}
              onClick={e => { e.preventDefault(); go(id); }}
            >
              <span>0{i + 1}</span>{id}
            </a>
          );
        })}
        <button className="btn btn-primary mobile-cta" style={{ "--i": NAV.length }} tabIndex={menuOpen ? 0 : -1} onClick={openModal}>
          Get my resume <span className="arrow">↓</span>
        </button>
      </div>

      <main className="page">
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section id="hero" ref={heroRef}>
          <div className="container hero-content">
            <div className="hero-grid">
              <div className="hero-left">
                <div className="hero-status hero-in" style={{ animationDelay: "0ms" }}>
                  <i /> Open to internships &amp; full-time roles
                </div>
                <h1 className="hero-name">
                  <SplitText text="Ayush" delay={120} />
                  <br />
                  <em>Raj</em>
                </h1>
                <p className="hero-meta hero-in" style={{ animationDelay: "650ms" }}>
                  CS Student · BIT Mesra · Ranchi, India
                </p>
                <p className="hero-role hero-in" style={{ animationDelay: "750ms" }}>
                  I build <Typewriter words={ROLES} />
                </p>
                <p className="hero-tagline hero-in" style={{ animationDelay: "850ms" }}>
                  Full-stack developer with a passion for AI and systems.
                </p>
                <div className="hero-ctas hero-in" style={{ animationDelay: "950ms" }}>
                  <Magnetic>
                    <button className="btn btn-primary" onClick={() => go("projects")}>
                      View projects <span className="arrow">→</span>
                    </button>
                  </Magnetic>
                  <Magnetic>
                    <button className="btn btn-ghost" onClick={openModal}>↓ Download resume</button>
                  </Magnetic>
                  <button className="btn btn-link" onClick={() => go("contact")}>Get in touch</button>
                </div>
              </div>

              <div className="hero-visual hero-in">
                <div className="photo-glow" />
                <div className="photo-orbit" />
                <div className="photo-ring" />
                <div className="photo-circle">
                  <img
                    src="/profile.webp"
                    srcSet="/profile-300.webp 300w, /profile.webp 600w"
                    sizes="(max-width: 860px) 150px, 300px"
                    alt="Ayush Raj, full-stack developer and CS student at BIT Mesra"
                    width="300"
                    height="300"
                    fetchPriority="high"
                  />
                </div>
                {HERO_CHIPS.map(c => (
                  <span className="float-chip" key={c.text}><i /><b>{c.strong}</b> {c.text}</span>
                ))}
              </div>
            </div>
          </div>
          <button className="scroll-cue hero-in" style={{ animationDelay: "1500ms" }} onClick={() => go("about")} aria-label="Scroll to about">
            <span className="mouse" />
            scroll
          </button>
        </section>

        <div className="marquee-wrap" aria-hidden="true">
          <Marquee items={MARQUEE_TECH} />
          <Marquee items={MARQUEE_TOPICS} reverse />
        </div>

        {/* ── ABOUT ────────────────────────────────────────────────── */}
        <section id="about">
          <div className="container">
            <SectionHeader num="01" title="About" />
            <div className="about-grid">
              <Reveal>
                <div className="about-bio">
                  <p>
                    I'm a <strong>Computer Science student at BIT Mesra</strong> building at the <strong>intersection of full-stack engineering and applied AI</strong>. I care about systems that are fast, scalable, and actually useful.
                  </p>
                  <p>
                    I've had the opportunity to work on <strong>real-world engineering problems</strong>, from building <strong>production-ready backend systems</strong> to working with <strong>LLM Pipelines</strong> and <strong>large-scale data</strong>. Alongside this, I built <strong>Stedzo</strong>, a <strong>multi-tenant SaaS platform</strong> that digitizes self-study libraries and now serves <strong>500+ users across 20+ libraries</strong>.
                  </p>
                  <p>
                    Beyond building products, I enjoy <strong>competitive programming</strong>, with <strong>900+ problems solved</strong>, and exploring <strong>distributed systems</strong>, <strong>databases</strong>, <strong>AI</strong>, and <strong>developer tools</strong>. I like going beyond just using technology — <strong>understanding how things work under the hood</strong> and turning that understanding into software that actually ships.
                  </p>
                </div>
              </Reveal>
              <div className="about-stats">
                {STATS.map((s, i) => (
                  <Card key={s.lbl} delay={100 + i * 80} className="stat">
                    <div className="stat-val"><CountUp value={s.val} /><span className="unit">{s.unit}</span></div>
                    <div className="stat-lbl">{s.lbl}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ───────────────────────────────────────────── */}
        <section id="experience">
          <div className="container">
            <SectionHeader num="02" title="Experience" />
            <div className="timeline" ref={timelineRef}>
              <div className="timeline-rail"><div className="timeline-fill" /></div>
              {EXP.map((e, i) => (
                <div className="tl-item" key={e.company}>
                  <span className="tl-node" />
                  <Card delay={i * 80} className="exp-card">
                    <div className="exp-head">
                      <div>
                        <h3 className="exp-role">{e.role}</h3>
                        <div className="exp-company">{e.company}</div>
                      </div>
                      <div className="exp-date">{e.date}</div>
                    </div>
                    <ul className="exp-bullets">
                      {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                    <div className="tags">
                      {e.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ─────────────────────────────────────────────── */}
        <section id="projects">
          <div className="container">
            <SectionHeader num="03" title="Projects" />
            <ProjectList projects={PROJECTS} />
          </div>
        </section>

        {/* ── SKILLS ───────────────────────────────────────────────── */}
        <section id="skills">
          <div className="container">
            <SectionHeader num="04" title="Skills" />
            <div className="skills-grid">
              {SKILLS.map((sg, i) => (
                <Card key={sg.group} delay={i * 70} wrapClass={sg.wide ? "span-2" : ""} className="skills-card">
                  <div className="skills-head">
                    <span className="skills-icon" aria-hidden="true">{sg.icon}</span>
                    <h3 className="skills-title">{sg.group}</h3>
                    <span className="skills-count">{String(sg.items.length).padStart(2, "0")}</span>
                  </div>
                  <div className="skill-chips">
                    {sg.items.map((s, j) => <span key={s} className="skill-chip" style={{ "--i": j }}>{s}</span>)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ───────────────────────────────────────── */}
        <section id="certifications">
          <div className="container">
            <SectionHeader num="05" title="Certifications" />
            <div className="cert-grid">
              {CERTIFICATIONS.map((c, i) => (
                <Card key={c.title} delay={(i % 2) * 80} wrapClass={i === 0 ? "span-2" : ""} className="cert-card">
                  <div className="cert-top">
                    <span className="cert-issuer">{c.issuer}</span>
                    <span className="cert-date">{c.date}</span>
                  </div>
                  <h3 className="cert-title">{c.title}</h3>
                  <p className="cert-desc">{c.desc}</p>
                  {c.link && (
                    <a href={c.link} className="cert-link" target="_blank" rel="noopener noreferrer">
                      View credential <span className="arr">↗</span>
                    </a>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── ACHIEVEMENTS ─────────────────────────────────────────── */}
        <section id="achievements">
          <div className="container">
            <SectionHeader num="06" title="Achievements" />
            <div className="ach-list">
              {ACHIEVEMENTS.map((a, i) => (
                <Card key={i} delay={i * 60} className="ach-card">
                  <div className="ach-idx">0{i + 1}</div>
                  <div className="ach-text">{a.text}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ──────────────────────────────────────────────── */}
        <section id="contact">
          <div className="container">
            <SectionHeader num="07" title="Get in touch" />
            <Card className="contact-card">
              <h3 className="contact-big">Let's build something<br /><em>worth shipping.</em></h3>
              <p className="contact-blurb">
                Open to internships, full-time roles, and interesting problems. If you're building something worth working on — or just want to talk systems and AI — reach out.
              </p>
              <div className="contact-actions">
                <Magnetic>
                  <a href={`mailto:${EMAIL}`} className="btn btn-primary">Say hello <span className="arrow">→</span></a>
                </Magnetic>
                <button className={`btn btn-ghost email-copy${copied ? " copied" : ""}`} onClick={copyEmail}>
                  {EMAIL}
                  <span className="copy-state" aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
                </button>
              </div>
              <div className="social-grid">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} className="social-tile" target="_blank" rel="noopener noreferrer">
                    <span>{s.label}</span>
                    <span className="arr">↗</span>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <span>Ayush Raj © 2026</span>
            <span>Designed &amp; built with React</span>
            <button onClick={() => go("hero")}>Back to top ↑</button>
          </div>
        </div>
      </footer>

      <button className={`to-top${showTop ? " show" : ""}`} onClick={() => go("hero")} aria-label="Back to top" tabIndex={showTop ? 0 : -1}>
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle className="ring-bg" cx="24" cy="24" r="22" fill="none" strokeWidth="2" />
          <circle
            className="ring-fg"
            ref={ringRef}
            cx="24" cy="24" r="22"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C}
          />
        </svg>
        ↑
      </button>

      {modal !== "closed" && <ResumeModal closing={modal === "closing"} onClose={closeModal} />}
    </>
  );
}
