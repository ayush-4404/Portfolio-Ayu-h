import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReveal, useReducedMotion, prefersReducedMotion, hasFinePointer } from "./motion";

// ─── Reveal wrappers ──────────────────────────────────────────────────────────

export function Reveal({ children, className = "", delay = 0, style, ...rest }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </div>
  );
}

// Glass card with a cursor-tracking spotlight and optional 3D tilt.
// The reveal transform lives on the wrapper so it never fights the tilt transform.
export function Card({ children, className = "", wrapClass = "", delay = 0, tilt = 0 }) {
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    if (tilt && hasFinePointer()) {
      el.style.setProperty("--rx", `${(y / r.height - 0.5) * -tilt}deg`);
      el.style.setProperty("--ry", `${(x / r.width - 0.5) * tilt}deg`);
    }
  };
  const onLeave = (e) => {
    if (!tilt) return;
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  return (
    <Reveal delay={delay} className={`card-wrap ${wrapClass}`}>
      <div className={`card ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
        {children}
      </div>
    </Reveal>
  );
}

// ─── Text effects ─────────────────────────────────────────────────────────────

export function SplitText({ text, delay = 0, step = 55 }) {
  return (
    <span className="split" aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} className="split-char" aria-hidden="true" style={{ animationDelay: `${delay + i * step}ms` }}>
          {c}
        </span>
      ))}
    </span>
  );
}

export function Typewriter({ words, typeMs = 65, deleteMs = 32, holdMs = 1900 }) {
  const reduced = useReducedMotion();
  const [typed, setText] = useState("");
  const text = reduced ? words[0] : typed;
  useEffect(() => {
    if (reduced) return;
    let i = 0, len = 0, deleting = false, timer;
    const step = () => {
      const word = words[i];
      if (!deleting) {
        len++;
        setText(word.slice(0, len));
        if (len === word.length) { deleting = true; timer = setTimeout(step, holdMs); return; }
        timer = setTimeout(step, typeMs);
      } else {
        len--;
        setText(word.slice(0, len));
        if (len === 0) { deleting = false; i = (i + 1) % words.length; timer = setTimeout(step, 350); return; }
        timer = setTimeout(step, deleteMs);
      }
    };
    timer = setTimeout(step, 1100);
    return () => clearTimeout(timer);
  }, [words, typeMs, deleteMs, holdMs, reduced]);
  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span className="typed" aria-hidden="true">{text}<span className="typed-caret" /></span>
    </>
  );
}

// Counts from 0 to `value` once visible; keeps the source's decimal places.
// The real value is rendered so prerendered HTML (and crawlers) see it; the
// layout effect zeroes it before first paint on the client.
export function CountUp({ value, duration = 1800 }) {
  const ref = useRef(null);
  const decimals = (value.split(".")[1] || "").length;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const target = parseFloat(value);
    el.textContent = (0).toFixed(decimals);
    let raf;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = (target * eased).toFixed(decimals);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); el.textContent = value; };
  }, [value, decimals, duration]);
  return <span ref={ref}>{value}</span>;
}

// ─── Pointer effects ──────────────────────────────────────────────────────────

// Pulls its child toward the cursor while hovered
export function Magnetic({ children, strength = 0.28 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const leave = () => { el.style.transform = ""; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return <span className="magnetic" ref={ref}>{children}</span>;
}

// Dot + lagging ring cursor; grows over interactive elements
export function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    if (!hasFinePointer()) return;
    const dot = dotRef.current, ring = ringRef.current;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const m = { x: -100, y: -100 }, r = { x: -100, y: -100 };
    let raf, shown = false;

    const move = (e) => {
      m.x = e.clientX; m.y = e.clientY;
      if (!shown) { shown = true; r.x = m.x; r.y = m.y; dot.classList.add("on"); ring.classList.add("on"); }
    };
    const over = (e) => {
      const t = e.target.closest?.("a, button, [data-cursor], input, textarea, label");
      const isText = !!t && t.matches("input, textarea");
      ring.classList.toggle("hover", !!t && !isText);
      ring.classList.toggle("text", isText);
      dot.classList.toggle("text", isText);
    };
    const down = () => ring.classList.add("down");
    const up = () => ring.classList.remove("down");
    const hide = () => { shown = false; dot.classList.remove("on"); ring.classList.remove("on"); };
    const loop = () => {
      r.x += (m.x - r.x) * 0.18;
      r.y += (m.y - r.y) * 0.18;
      dot.style.transform = `translate3d(${m.x}px, ${m.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("mouseleave", hide);
    raf = requestAnimationFrame(loop);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", hide);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}

// ─── Background ───────────────────────────────────────────────────────────────

// Drifting constellation on canvas: nodes link to neighbours and to the cursor,
// get nudged away from it, and parallax slightly with scroll.
export function Background() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = prefersReducedMotion();
    const LINK = 130, CURSOR_LINK = 190, REPEL = 120, GLOW = 420;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let w = 0, h = 0, pts = [], raf = 0, lastScroll = window.scrollY;

    const seed = () => {
      const count = Math.round(Math.min(90, Math.max(22, (w * h) / 15000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.3 + 0.5,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const widthChanged = window.innerWidth !== w;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile URL-bar show/hide only changes height — keep the field stable
      if (widthChanged) seed();
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      mouse.x += (mouse.tx - mouse.x) * 0.1;
      mouse.y += (mouse.ty - mouse.y) * 0.1;
      const hasMouse = mouse.tx > -9000;

      if (hasMouse) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, GLOW);
        g.addColorStop(0, "rgba(0, 201, 177, 0.10)");
        g.addColorStop(0.45, "rgba(0, 201, 177, 0.025)");
        g.addColorStop(1, "rgba(0, 201, 177, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(mouse.x - GLOW, mouse.y - GLOW, GLOW * 2, GLOW * 2);
      }

      const sy = window.scrollY;
      const ds = sy - lastScroll;
      lastScroll = sy;

      for (const p of pts) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy - ds * p.r * 0.12;
          if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;
        }
        if (hasMouse) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < REPEL * REPEL && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / REPEL) * 0.9;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          if (dx > LINK || dx < -LINK) continue;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          ctx.strokeStyle = `rgba(139, 152, 165, ${(1 - Math.sqrt(d2) / LINK) * 0.16})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        if (hasMouse) {
          const dx = a.x - mouse.x, dy = a.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CURSOR_LINK) {
            ctx.strokeStyle = `rgba(0, 201, 177, ${(1 - d / CURSOR_LINK) * 0.4})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = "rgba(160, 172, 186, 0.55)";
      ctx.beginPath();
      for (const p of pts) {
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fill();

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      if (mouse.x < -9000) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    if (!reduced) raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-grid" />
      <div className="aurora aurora--a" />
      <div className="aurora aurora--b" />
      <canvas ref={canvasRef} className="bg-canvas" />
    </div>
  );
}
