import { useState, useEffect, useRef } from "react";
import { Reveal } from "./effects";
import { hasFinePointer } from "./motion";

const pad = (n) => String(n).padStart(2, "0");

// Index-style project list: big names in rows, a screenshot preview that trails
// the cursor on hover (desktop), and an accordion panel with the full details.
export default function ProjectList({ projects }) {
  const [open, setOpen] = useState(0); // featured project starts expanded
  const [preview, setPreview] = useState({ i: 0, on: false });
  const previewRef = useRef(null);
  const loop = useRef({ start: () => {}, stop: () => {} });

  useEffect(() => {
    const el = previewRef.current;
    if (!el || !hasFinePointer()) return;
    const m = { x: 0, y: 0 }, p = { x: 0, y: 0 };
    let off = 40, raf = 0, running = false, primed = false;

    const move = (e) => {
      m.x = e.clientX; m.y = e.clientY;
      if (!primed) { primed = true; p.x = m.x; p.y = m.y; }
    };
    const tick = () => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const dx = m.x - p.x;
      p.x += dx * 0.14;
      p.y += (m.y - p.y) * 0.14;
      // Sit right of the cursor; glide to the left side near the viewport edge
      const target = m.x + 40 + w > window.innerWidth - 16 ? -w - 40 : 40;
      off += (target - off) * 0.14;
      const x = p.x + off;
      const y = Math.min(Math.max(p.y - h / 2, 16), window.innerHeight - h - 16);
      const rot = Math.max(-7, Math.min(7, dx * 0.06));
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
      raf = requestAnimationFrame(tick);
    };
    loop.current = {
      start: () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } },
      stop: () => { running = false; cancelAnimationFrame(raf); },
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const show = (i) => {
    if (!hasFinePointer() || i === open) return;
    loop.current.start();
    setPreview({ i, on: true });
  };
  const hide = () => setPreview(s => ({ ...s, on: false }));
  const toggle = (i) => {
    setOpen(o => (o === i ? -1 : i));
    hide();
  };

  return (
    <>
      <Reveal className="pl-meta">
        <span>{pad(projects.length)} projects</span>
        <span className="pl-hint pl-hint--hover">hover to preview · click for details</span>
        <span className="pl-hint pl-hint--touch">tap a project for details</span>
      </Reveal>

      <div className="pl-list">
        {projects.map((p, i) => {
          const isOpen = open === i;
          const primary = p.links.find(l => l.label === "Live") ?? p.links[0];
          return (
            // Reveal toggles .visible imperatively, so the open state lives on an inner element
            <Reveal key={p.name} delay={i * 70}>
              <div className={`pl-row${isOpen ? " open" : ""}`}>
                <h3 className="pl-h">
                  <button
                    className="pl-head"
                    onClick={() => toggle(i)}
                    onPointerEnter={() => show(i)}
                    onPointerLeave={hide}
                    aria-expanded={isOpen}
                    aria-controls={`proj-panel-${i}`}
                  >
                    <span className="pl-idx">{pad(i + 1)}</span>
                    <span className="pl-name">
                      {p.name}
                      {p.featured && <span className="pl-star" title="Featured">★</span>}
                    </span>
                    <span className="pl-kind">{p.kind}</span>
                    <span className="pl-toggle" aria-hidden="true" />
                  </button>
                </h3>

                <div className="pl-panel" id={`proj-panel-${i}`} role="region" aria-label={p.name} inert={!isOpen}>
                  <div className="pl-panel-inner">
                    <div className="pl-body">
                      <div className="pl-content">
                        <p className="pl-desc">{p.desc}</p>
                        {p.metrics && (
                          <div className="pl-metrics">
                            {p.metrics.map(m => (
                              <div className="pl-metric" key={m.lbl}><b>{m.val}</b><span>{m.lbl}</span></div>
                            ))}
                          </div>
                        )}
                        <div className="tags">
                          {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                        </div>
                        <div className="proj-links">
                          {p.links.map(l => (
                            <a key={l.label} href={l.href} className="proj-link" target="_blank" rel="noopener noreferrer">
                              {l.label} <span className="arr">↗</span>
                            </a>
                          ))}
                        </div>
                      </div>
                      <a className="pl-shot" href={primary.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name} (${primary.label})`}>
                        <span className="pl-bar"><i /><i /><i /><span>{p.domain}</span></span>
                        <span className="pl-frame">
                          <img src={p.image} alt={`${p.name} preview`} width="1200" height="750" loading="lazy" decoding="async" />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Cursor-following preview (desktop only) */}
      <div
        className={`proj-preview${preview.on ? " show" : ""}`}
        ref={previewRef}
        aria-hidden="true"
        onTransitionEnd={() => { if (!preview.on) loop.current.stop(); }}
      >
        <div className="pp-inner">
          <div className="pl-bar"><i /><i /><i /><span>{projects[preview.i].domain}</span></div>
          <div className="pp-window">
            <div className="pp-strip" style={{ transform: `translateY(${-preview.i * 100}%)` }}>
              {projects.map(p => <img key={p.name} src={p.image} alt="" width="1200" height="750" decoding="async" />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
