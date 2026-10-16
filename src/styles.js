// ─── Design tokens ────────────────────────────────────────────────────────────
// Near-black base, warm white text, teal accent with a periwinkle partner for gradients
export const T = {
  bg:       "#0B0E14",   // Plain dark slate-navy background
  surface:  "#121722",   // Subtle dark surface cards/menus
  line:     "#1D2433",   // Elegant dark border line
  muted:    "#6B7689",   // Muted secondary detail
  sub:      "#8B98A5",   // Soft readable subtitle text
  text:     "#F0F4F8",   // Clean warm white text
  accent:   "#00C9B1",   // Vibrant accent color
  accent2:  "#7B8CFF",   // Gradient partner
};

const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
const grad = `linear-gradient(100deg, ${T.accent} 0%, ${T.accent2} 55%, #C3A6FF 100%)`;

export const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; scroll-padding-top: 72px; }

body {
  background: ${T.bg};
  color: ${T.text};
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
body.locked { overflow: hidden; }

a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; }
::selection { background: ${T.accent}33; color: ${T.text}; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: ${T.bg}; }
::-webkit-scrollbar-thumb { background: ${T.line}; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: ${T.muted}; }
:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 3px; border-radius: 6px; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

/* ─── BACKGROUND ──────────────────────────────────────────────── */
.bg-layer {
  position: fixed; inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.bg-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 80% 55% at 50% 0%, #000 25%, transparent 75%);
          mask-image: radial-gradient(ellipse 80% 55% at 50% 0%, #000 25%, transparent 75%);
}
.aurora {
  position: absolute;
  width: 70vmax; height: 70vmax;
  border-radius: 50%;
  will-change: transform;
}
.aurora--a {
  top: -30vmax; left: -20vmax;
  background: radial-gradient(circle, ${T.accent}1c 0%, transparent 60%);
  animation: drift-a 28s ease-in-out infinite alternate;
}
.aurora--b {
  bottom: -35vmax; right: -25vmax;
  background: radial-gradient(circle, ${T.accent2}18 0%, transparent 60%);
  animation: drift-b 34s ease-in-out infinite alternate;
}
@keyframes drift-a { to { transform: translate(18vw, 24vh) scale(1.15); } }
@keyframes drift-b { to { transform: translate(-22vw, -20vh) scale(1.1); } }

.page { position: relative; z-index: 1; }

/* ─── CURSOR ──────────────────────────────────────────────────── */
.cursor-dot, .cursor-ring {
  position: fixed; top: 0; left: 0;
  z-index: 1000;
  pointer-events: none;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s, width 0.35s ${ease}, height 0.35s ${ease},
              background 0.3s, border-color 0.3s;
}
.cursor-dot { width: 6px; height: 6px; background: ${T.accent}; }
.cursor-ring { width: 36px; height: 36px; border: 1px solid rgba(240,244,248,0.35); }
.cursor-dot.on, .cursor-ring.on { opacity: 1; }
.cursor-ring.hover { width: 60px; height: 60px; background: ${T.accent}14; border-color: ${T.accent}88; }
.cursor-ring.down { width: 26px; height: 26px; }
.cursor-ring.text, .cursor-dot.text { opacity: 0; }
.has-cursor, .has-cursor * { cursor: none !important; }
.has-cursor input, .has-cursor textarea { cursor: text !important; }

/* ─── SCROLL PROGRESS ─────────────────────────────────────────── */
.scroll-progress {
  position: fixed; top: 0; left: 0; right: 0;
  height: 2px;
  z-index: 101;
  background: ${grad};
  transform-origin: 0 50%;
  transform: scaleX(0);
  box-shadow: 0 0 10px ${T.accent}88;
}

/* ─── NAV ─────────────────────────────────────────────────────── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 72px;
  padding: 0 40px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  border-bottom: 1px solid transparent;
  transition: height 0.4s ${ease}, background 0.4s, border-color 0.4s, box-shadow 0.4s;
}
.nav.scrolled {
  height: 62px;
  background: rgba(11, 14, 20, 0.72);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);
}
.nav-logo {
  display: inline-flex; align-items: center; gap: 10px;
  background: none; border: none; cursor: pointer;
  font-family: 'DM Mono', monospace;
  font-size: 0.9rem;
  color: ${T.accent};
  letter-spacing: 0.02em;
  position: relative; z-index: 102;
}
.nav-logo-mark {
  width: 32px; height: 32px;
  border-radius: 9px;
  display: grid; place-items: center;
  background: ${grad};
  color: ${T.bg};
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: -0.02em;
  box-shadow: 0 4px 18px ${T.accent}40;
  transition: transform 0.5s ${ease};
}
.nav-logo:hover .nav-logo-mark { transform: rotate(-10deg) scale(1.08); }

.nav-links {
  position: relative;
  display: flex; gap: 2px;
  list-style: none;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.025);
}
.nav-links a {
  position: relative; z-index: 1;
  display: block;
  padding: 6px 14px;
  font-size: 0.82rem;
  color: ${T.sub};
  border-radius: 999px;
  letter-spacing: 0.01em;
  transition: color 0.25s;
}
.nav-links a:hover, .nav-links a.active { color: ${T.text}; }
.nav-indicator {
  position: absolute; top: 4px; bottom: 4px; left: 0;
  width: 0;
  border-radius: 999px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.09);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.55s ${ease}, width 0.55s ${ease}, opacity 0.3s;
}
.nav-right { display: flex; align-items: center; gap: 12px; }
.nav-cta {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid ${T.accent}55;
  color: ${T.accent};
  background: ${T.accent}0f;
  cursor: pointer;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
}
.nav-cta:hover { background: ${T.accent}; color: ${T.bg}; box-shadow: 0 0 24px ${T.accent}55; }

.hamburger {
  display: none;
  position: relative; z-index: 102;
  width: 42px; height: 42px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
}
.hamburger span {
  position: absolute; left: 12px;
  width: 16px; height: 1.5px;
  background: ${T.text};
  border-radius: 2px;
  transition: transform 0.45s ${ease}, top 0.45s ${ease}, opacity 0.3s;
}
.hamburger span:nth-child(1) { top: 15px; }
.hamburger span:nth-child(2) { top: 20px; }
.hamburger span:nth-child(3) { top: 25px; }
.hamburger.open span:nth-child(1) { top: 20px; transform: rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: translateX(-6px); }
.hamburger.open span:nth-child(3) { top: 20px; transform: rotate(-45deg); }

.mobile-menu {
  position: fixed; inset: 0; z-index: 99;
  display: flex; flex-direction: column; justify-content: center; gap: 4px;
  padding: 96px 28px 40px;
  background: rgba(11, 14, 20, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  opacity: 0; visibility: hidden;
  transition: opacity 0.4s, visibility 0.4s;
}
.mobile-menu.open { opacity: 1; visibility: visible; }
.mobile-menu a, .mobile-menu .mobile-cta {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.5s ${ease}, transform 0.6s ${ease}, color 0.2s;
}
.mobile-menu.open a, .mobile-menu.open .mobile-cta {
  opacity: 1; transform: none;
  transition-delay: calc(var(--i) * 45ms + 80ms);
}
.mobile-menu a {
  display: flex; align-items: baseline; gap: 16px;
  padding: 6px 0;
  font-size: clamp(1.8rem, 8vw, 2.6rem);
  font-weight: 300;
  letter-spacing: -0.04em;
  color: ${T.sub};
}
.mobile-menu a span { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: ${T.accent}; letter-spacing: 0.04em; }
.mobile-menu a:hover, .mobile-menu a.active { color: ${T.text}; }
.mobile-menu .mobile-cta { align-self: flex-start; margin-top: 28px; }

@media (max-width: 1080px) {
  .nav-links, .nav-cta { display: none; }
  .hamburger { display: block; }
}
@media (max-width: 700px) { .nav { padding: 0 20px; } }

/* ─── LAYOUT ──────────────────────────────────────────────────── */
.container { max-width: 1120px; margin: 0 auto; padding: 0 40px; }
section { position: relative; padding: 120px 0; }
@media (max-width: 700px) {
  .container { padding: 0 20px; }
  section { padding: 84px 0; }
}

/* ─── SECTION HEADER ──────────────────────────────────────────── */
.sec-header { margin-bottom: 56px; }
.sec-num {
  display: flex; align-items: center; gap: 14px;
  font-family: 'DM Mono', monospace;
  font-size: 0.74rem;
  color: ${T.accent};
  letter-spacing: 0.12em;
  margin-bottom: 14px;
  opacity: 0;
  transition: opacity 0.6s;
}
.sec-num::after {
  content: '';
  height: 1px; width: 0;
  background: linear-gradient(90deg, ${T.accent}, transparent);
  transition: width 1.1s ${ease} 0.25s;
}
.sec-title {
  font-size: clamp(2.3rem, 5.5vw, 3.6rem);
  font-weight: 300;
  letter-spacing: -0.035em;
  line-height: 1.1;
  overflow: hidden;
  padding-bottom: 0.1em;
}
.sec-title span { display: inline-block; transform: translateY(110%); transition: transform 1.1s ${ease}; }
.sec-header.visible .sec-num { opacity: 1; }
.sec-header.visible .sec-num::after { width: 80px; }
.sec-header.visible .sec-title span { transform: none; }

/* ─── REVEAL ──────────────────────────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(36px);
  filter: blur(6px);
  transition: opacity 0.9s ${ease}, transform 0.9s ${ease}, filter 0.9s ${ease};
}
.reveal.visible { opacity: 1; transform: none; filter: none; }

.hero-in {
  opacity: 0;
  animation: heroUp 1s ${ease} forwards;
}
@keyframes heroUp {
  from { opacity: 0; transform: translateY(28px); filter: blur(8px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}

.blink::after {
  content: '_';
  color: ${T.accent};
  animation: blink 1.1s step-end infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── CARD (shared) ───────────────────────────────────────────── */
.card-wrap { height: 100%; }
.card {
  --x: 50%; --y: 50%;
  position: relative;
  height: 100%;
  isolation: isolate;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(22,28,40,0.62), rgba(14,18,27,0.62));
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 1px 0 rgba(255,255,255,0.03) inset, 0 10px 40px -12px rgba(0,0,0,0.5);
  transform: perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0px));
  transition: transform 0.5s ${ease}, border-color 0.4s, box-shadow 0.4s;
}
.card::before {
  content: '';
  position: absolute; inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: radial-gradient(520px circle at var(--x) var(--y), ${T.accent}12, transparent 42%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.card::after {
  content: '';
  position: absolute; inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: radial-gradient(380px circle at var(--x) var(--y), ${T.accent}aa, ${T.accent2}44 30%, transparent 55%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
@media (hover: hover) {
  .card:hover { --lift: -4px; border-color: rgba(255,255,255,0.09); box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 60px -18px rgba(0,0,0,0.65); }
  .card:hover::before, .card:hover::after { opacity: 1; }
}

/* ─── BUTTONS ─────────────────────────────────────────────────── */
.magnetic { display: inline-flex; transition: transform 0.4s ${ease}; }
.btn {
  position: relative;
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 26px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.88rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  transition: box-shadow 0.35s, background 0.3s, border-color 0.3s, color 0.3s, transform 0.2s;
}
.btn:active { transform: scale(0.97); }
.btn .arrow { display: inline-block; transition: transform 0.3s ${ease}; }
.btn:hover .arrow { transform: translateX(4px); }

.btn-primary {
  background: ${T.accent};
  color: ${T.bg};
  box-shadow: 0 10px 30px -10px ${T.accent}aa;
}
.btn-primary::before {
  content: '';
  position: absolute; inset: 0; z-index: -1;
  background: ${grad};
  opacity: 0;
  transition: opacity 0.4s;
}
.btn-primary::after {
  content: '';
  position: absolute; top: 0; left: -100%; z-index: -1;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s ease;
}
.btn-primary:hover::before { opacity: 1; }
.btn-primary:hover::after { left: 100%; }
.btn-primary:hover { box-shadow: 0 14px 40px -10px ${T.accent2}cc; }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-ghost {
  background: rgba(255,255,255,0.03);
  border-color: rgba(255,255,255,0.11);
  color: ${T.text};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.btn-ghost:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.22); }

.btn-link {
  background: none; border: none;
  padding: 13px 6px;
  color: ${T.sub};
}
.btn-link::after {
  content: '';
  position: absolute; left: 6px; right: 6px; bottom: 9px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0.35);
  transform-origin: left;
  opacity: 0.5;
  transition: transform 0.4s ${ease}, opacity 0.3s;
}
.btn-link:hover { color: ${T.text}; }
.btn-link:hover::after { transform: scaleX(1); opacity: 1; }

/* ─── HERO ────────────────────────────────────────────────────── */
#hero {
  min-height: 100vh;
  min-height: 100svh;
  display: flex; align-items: center;
  padding: 120px 0 100px;
}
.hero-content {
  width: 100%;
  opacity: calc(1 - var(--hp, 0) * 1.3);
  transform: translate3d(0, calc(var(--hp, 0) * 110px), 0) scale(calc(1 - var(--hp, 0) * 0.04));
  will-change: transform, opacity;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 72px;
  align-items: center;
}
.hero-status {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 6px 14px 6px 12px;
  margin-bottom: 30px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  font-size: 0.78rem;
  color: ${T.sub};
}
.hero-status i { position: relative; width: 8px; height: 8px; border-radius: 50%; background: #3DDC97; }
.hero-status i::after {
  content: '';
  position: absolute; inset: 0;
  border-radius: 50%;
  background: inherit;
  animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ping { 75%, 100% { transform: scale(2.8); opacity: 0; } }

.hero-name {
  font-size: clamp(3.6rem, 10vw, 7.6rem);
  font-weight: 300;
  letter-spacing: -0.045em;
  line-height: 0.95;
  margin-bottom: 26px;
}
.split { display: inline-block; }
.split-char {
  display: inline-block;
  opacity: 0;
  animation: charIn 1.1s ${ease} forwards;
}
@keyframes charIn {
  from { opacity: 0; transform: translateY(65%) rotate(7deg); filter: blur(12px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}
.hero-name em {
  display: inline-block;
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1.1em;
  letter-spacing: -0.01em;
  padding-right: 0.1em;
  background: ${grad};
  background-size: 200% auto;
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
  opacity: 0;
  animation: charIn 1.3s ${ease} 480ms forwards, sheen 7s linear 1.8s infinite;
}
@keyframes sheen { to { background-position: -200% center; } }

.hero-meta {
  font-family: 'DM Mono', monospace;
  font-size: 0.78rem;
  color: ${T.muted};
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}
.hero-role {
  font-size: clamp(1.15rem, 2.3vw, 1.55rem);
  font-weight: 300;
  color: ${T.sub};
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  min-height: 1.6em;
}
.typed { color: ${T.text}; font-weight: 400; }
.typed-caret {
  display: inline-block;
  width: 2px; height: 1.05em;
  margin-left: 3px;
  vertical-align: -0.15em;
  background: ${T.accent};
  animation: blink 1s step-end infinite;
}
.hero-tagline {
  font-size: 1rem;
  color: ${T.sub};
  max-width: 440px;
  line-height: 1.7;
  margin-bottom: 40px;
}
.hero-ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }

/* Portrait */
.hero-visual {
  position: relative;
  width: 300px; height: 300px;
  justify-self: center;
}
.photo-glow {
  position: absolute; inset: 8%;
  border-radius: 50%;
  background: radial-gradient(circle, ${T.accent}66, ${T.accent2}33 50%, transparent 72%);
  filter: blur(40px);
  animation: breathe 6s ease-in-out infinite;
}
@keyframes breathe { 0%,100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.15); opacity: 1; } }
.photo-orbit {
  position: absolute; inset: -46px;
  border-radius: 50%;
  border: 1px dashed rgba(255,255,255,0.09);
  animation: spin 50s linear infinite reverse;
}
.photo-orbit::before, .photo-orbit::after {
  content: '';
  position: absolute;
  border-radius: 50%;
}
.photo-orbit::before {
  top: 50%; left: -4px;
  width: 8px; height: 8px; margin-top: -4px;
  background: ${T.accent2};
  box-shadow: 0 0 14px ${T.accent2};
}
.photo-orbit::after {
  top: 14.6%; right: 14.6%;
  width: 6px; height: 6px;
  transform: translate(50%, -50%);
  background: ${T.accent};
  box-shadow: 0 0 12px ${T.accent};
}
.photo-ring {
  position: absolute; inset: -10px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, ${T.accent}, transparent 25%, ${T.accent2} 50%, transparent 75%, ${T.accent});
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px));
  animation: spin 9s linear infinite;
}
.photo-circle {
  position: relative; z-index: 1;
  width: 100%; height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 30px 80px rgba(0,0,0,0.55);
}
.photo-circle img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
  transition: transform 0.9s ${ease};
}
.photo-circle::after {
  content: '';
  position: absolute; inset: 0;
  border-radius: 50%;
  background: linear-gradient(160deg, ${T.accent}18 0%, transparent 50%, rgba(11,14,20,0.35) 100%);
  pointer-events: none;
}
.hero-visual:hover .photo-circle img { transform: scale(1.06); }

.float-chip {
  position: absolute; z-index: 2;
  display: flex; align-items: center; gap: 8px;
  padding: 9px 14px;
  border-radius: 12px;
  background: rgba(18, 23, 34, 0.78);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.09);
  box-shadow: 0 12px 30px rgba(0,0,0,0.4);
  font-size: 0.76rem;
  color: ${T.sub};
  white-space: nowrap;
  animation: float 6s ease-in-out infinite;
}
.float-chip b { color: ${T.text}; font-weight: 600; }
.float-chip i { width: 6px; height: 6px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px ${T.accent}; }
.float-chip:nth-of-type(1) { top: 4%; left: -30%; }
.float-chip:nth-of-type(2) { top: 46%; right: -24%; animation-delay: -2s; }
.float-chip:nth-of-type(2) i { background: ${T.accent2}; box-shadow: 0 0 8px ${T.accent2}; }
.float-chip:nth-of-type(3) { bottom: -2%; left: -14%; animation-delay: -4s; }
.float-chip:nth-of-type(4) { top: -9%; right: -10%; animation-delay: -3s; }
.float-chip:nth-of-type(4) i { background: ${T.accent2}; box-shadow: 0 0 8px ${T.accent2}; }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

.scroll-cue {
  position: absolute; bottom: 28px; left: 0; right: 0;
  margin: 0 auto;
  width: fit-content;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  background: none; border: none; cursor: pointer;
  font-family: 'DM Mono', monospace;
  font-size: 0.64rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: ${T.muted};
  transition: color 0.3s;
}
.scroll-cue:hover { color: ${T.sub}; }
.mouse {
  position: relative;
  width: 22px; height: 34px;
  border: 1.5px solid currentColor;
  border-radius: 12px;
}
.mouse::after {
  content: '';
  position: absolute; top: 6px; left: 50%;
  width: 2px; height: 6px; margin-left: -1px;
  border-radius: 2px;
  background: ${T.accent};
  animation: wheel 1.8s ease-in-out infinite;
}
@keyframes wheel { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(12px); } }

@media (max-width: 1100px) {
  .float-chip:nth-of-type(1) { left: -18%; }
  .float-chip:nth-of-type(2) { right: -12%; }
  .float-chip:nth-of-type(4) { right: -2%; }
}
@media (max-width: 860px) {
  #hero { padding: 110px 0 72px; }
  .hero-grid { grid-template-columns: 1fr; gap: 44px; }
  .hero-visual { order: -1; width: 150px; height: 150px; justify-self: start; margin-left: 10px; }
  .photo-orbit { inset: -24px; }
  .photo-ring { inset: -7px; }
  .float-chip, .scroll-cue { display: none; }
  .hero-status { margin-bottom: 22px; }
}

/* ─── MARQUEE ─────────────────────────────────────────────────── */
.marquee-wrap {
  position: relative; z-index: 1;
  padding: 26px 0;
  border-top: 1px solid ${T.line};
  border-bottom: 1px solid ${T.line};
  background: rgba(11,14,20,0.55);
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.marquee { display: flex; overflow: hidden; }
.marquee + .marquee { margin-top: 12px; }
.marquee-track { display: flex; flex-shrink: 0; animation: marquee 60s linear infinite; }
.marquee--rev .marquee-track { animation-direction: reverse; animation-duration: 75s; }
.marquee-wrap:hover .marquee-track { animation-play-state: paused; }
.marquee-item {
  display: inline-flex; align-items: center; gap: 28px;
  padding-right: 28px;
  font-size: 1.35rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${T.sub};
  white-space: nowrap;
}
.marquee-item i { font-style: normal; font-size: 0.65rem; color: ${T.accent}; opacity: 0.7; }
.marquee--rev .marquee-item {
  font-family: 'DM Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  color: ${T.muted};
}
.marquee--rev .marquee-item i { color: ${T.accent2}; }
@keyframes marquee { to { transform: translateX(-50%); } }

/* ─── ABOUT ───────────────────────────────────────────────────── */
.about-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 64px; align-items: start; }
.about-bio {
  font-size: 1.05rem;
  font-weight: 300;
  color: ${T.sub};
  line-height: 1.85;
}
.about-bio p + p { margin-top: 1.2em; }
.about-bio strong { color: ${T.text}; font-weight: 500; }
.about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat { padding: 28px 24px; }
.stat-val {
  font-size: clamp(2.2rem, 4vw, 2.9rem);
  font-weight: 300;
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: 12px;
  font-variant-numeric: tabular-nums;
}
.stat-val .unit { color: ${T.accent}; }
.stat-lbl { font-size: 0.78rem; color: ${T.muted}; line-height: 1.4; }
@media (max-width: 860px) { .about-grid { grid-template-columns: 1fr; gap: 40px; } }

/* ─── TAGS ────────────────────────────────────────────────────── */
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  color: ${T.sub};
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 999px;
  padding: 4px 11px;
  letter-spacing: 0.02em;
  transition: color 0.25s, border-color 0.25s, background 0.25s;
}
.tag:hover { color: ${T.accent}; border-color: ${T.accent}55; background: ${T.accent}10; }

/* ─── EXPERIENCE (timeline) ───────────────────────────────────── */
.timeline { position: relative; padding-left: 48px; }
.timeline-rail {
  position: absolute; left: 11px; top: 10px; bottom: 10px;
  width: 2px;
  border-radius: 2px;
  background: ${T.line};
  overflow: hidden;
}
.timeline-fill {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, ${T.accent}, ${T.accent2});
  transform-origin: top;
  transform: scaleY(var(--p, 0));
}
.tl-item { position: relative; }
.tl-item + .tl-item { margin-top: 24px; }
.tl-node {
  position: absolute; left: -43px; top: 36px; z-index: 1;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: ${T.bg};
  border: 2px solid ${T.muted};
  transition: border-color 0.5s, box-shadow 0.5s;
}
.tl-item:has(.visible) .tl-node { border-color: ${T.accent}; box-shadow: 0 0 0 5px ${T.accent}1f, 0 0 18px ${T.accent}88; }
.exp-card { padding: 32px; }
.exp-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
.exp-role { font-size: 1.2rem; font-weight: 500; letter-spacing: -0.02em; }
.exp-company { font-size: 0.9rem; color: ${T.accent}; margin-top: 4px; }
.exp-date {
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  color: ${T.sub};
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  white-space: nowrap;
}
.exp-bullets { list-style: none; display: flex; flex-direction: column; gap: 9px; margin-bottom: 20px; }
.exp-bullets li {
  position: relative;
  padding-left: 22px;
  font-size: 0.9rem;
  color: ${T.sub};
  line-height: 1.7;
}
.exp-bullets li::before {
  content: '▹';
  position: absolute; left: 0; top: 0;
  color: ${T.accent};
}
@media (max-width: 700px) {
  .timeline { padding-left: 28px; }
  .timeline-rail { left: 5px; }
  .tl-node { left: -29px; top: 30px; }
  .exp-card { padding: 24px 20px; }
}

/* ─── PROJECTS (index list + hover preview) ───────────────────── */
.span-2 { grid-column: span 2; }
@media (max-width: 860px) { .span-2 { grid-column: auto; } }

.pl-meta {
  display: flex; justify-content: space-between; gap: 16px;
  padding-bottom: 14px;
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  color: ${T.muted};
  letter-spacing: 0.06em;
}
.pl-hint--touch { display: none; }
@media (hover: none) {
  .pl-hint--hover { display: none; }
  .pl-hint--touch { display: inline; }
}

.pl-list { border-bottom: 1px solid ${T.line}; }
.pl-row { border-top: 1px solid ${T.line}; }
.pl-h { font: inherit; }

.pl-head {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 64px 1fr auto 44px;
  align-items: center;
  gap: 20px;
  padding: 30px 0;
  background: none; border: none;
  text-align: left;
  cursor: pointer;
  isolation: isolate;
}
.pl-head::before {
  content: '';
  position: absolute; inset: 0 -24px;
  z-index: -1;
  border-radius: 14px;
  background: linear-gradient(90deg, ${T.accent}12, ${T.accent2}08 60%, transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s ${ease};
}
.pl-idx {
  font-family: 'DM Mono', monospace;
  font-size: 0.78rem;
  color: ${T.muted};
  letter-spacing: 0.06em;
  transition: color 0.3s;
}
.pl-name {
  display: inline-flex; align-items: center; gap: 14px;
  font-size: clamp(1.7rem, 4.4vw, 3.3rem);
  font-weight: 300;
  letter-spacing: -0.035em;
  line-height: 1.1;
  color: ${T.text};
  transition: transform 0.6s ${ease}, color 0.4s;
}
.pl-star { font-size: 0.4em; color: ${T.accent}; transform: translateY(-0.6em); }
.pl-kind {
  font-family: 'DM Mono', monospace;
  font-size: 0.74rem;
  color: ${T.sub};
  letter-spacing: 0.04em;
  white-space: nowrap;
  transition: color 0.3s;
}
.pl-toggle {
  position: relative;
  width: 44px; height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  transition: border-color 0.3s, background 0.3s, transform 0.5s ${ease};
}
.pl-toggle::before, .pl-toggle::after {
  content: '';
  position: absolute; top: 50%; left: 50%;
  width: 14px; height: 1.5px; margin: -0.75px 0 0 -7px;
  border-radius: 2px;
  background: ${T.text};
}
.pl-toggle::after { transform: rotate(90deg); }

@media (hover: hover) {
  .pl-head:hover::before { transform: scaleX(1); }
  .pl-head:hover .pl-name { transform: translateX(14px); }
  .pl-head:hover .pl-idx, .pl-head:hover .pl-kind { color: ${T.accent}; }
  .pl-head:hover .pl-toggle { border-color: ${T.accent}88; }
  .pl-list:has(.pl-head:hover) .pl-head:not(:hover) .pl-name { color: ${T.muted}; }
}
.pl-row.open .pl-idx { color: ${T.accent}; }
.pl-row.open .pl-toggle { transform: rotate(135deg); background: ${T.accent}; border-color: ${T.accent}; }
.pl-row.open .pl-toggle::before, .pl-row.open .pl-toggle::after { background: ${T.bg}; }

/* Accordion: animate 0fr → 1fr so the panel eases to its natural height */
.pl-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.7s ${ease};
}
.pl-row.open .pl-panel { grid-template-rows: 1fr; }
.pl-panel-inner { overflow: hidden; min-height: 0; }
.pl-body {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 48px;
  align-items: start;
  padding: 4px 0 44px 84px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s, transform 0.7s ${ease};
}
.pl-row.open .pl-body { opacity: 1; transform: none; transition-delay: 0.12s; }
.pl-content { display: flex; flex-direction: column; gap: 20px; }
.pl-desc { font-size: 0.95rem; color: ${T.sub}; line-height: 1.8; }

.pl-metrics {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.07);
}
.pl-metric { padding: 16px 14px; background: rgba(11,14,20,0.9); }
.pl-metric b {
  display: block;
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: -0.04em;
  line-height: 1.15;
  background: ${grad};
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
}
.pl-metric span { font-family: 'DM Mono', monospace; font-size: 0.66rem; color: ${T.muted}; letter-spacing: 0.03em; }

.proj-links { display: flex; flex-wrap: wrap; gap: 10px; }
.proj-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'DM Mono', monospace;
  font-size: 0.74rem;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.03);
  color: ${T.text};
  transition: border-color 0.25s, color 0.25s, background 0.25s;
}
.proj-link:hover { border-color: ${T.accent}; color: ${T.accent}; background: ${T.accent}10; }
.arr { display: inline-block; transition: transform 0.3s ${ease}; }
a:hover > .arr, a:hover .arr { transform: translate(2px, -2px); }

/* Browser frame shared by the inline shot and the floating preview */
.pl-shot, .pp-inner {
  display: block;
  border-radius: 14px;
  overflow: hidden;
  background: ${T.surface};
  border: 1px solid rgba(255,255,255,0.09);
  box-shadow: 0 24px 60px -20px rgba(0,0,0,0.7);
}
.pl-shot { transition: border-color 0.3s, transform 0.6s ${ease}; }
.pl-shot:hover { border-color: ${T.accent}66; transform: translateY(-4px); }
.pl-bar {
  display: flex; align-items: center; gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.025);
}
.pl-bar i { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.14); }
.pl-bar span {
  flex: 1;
  margin: 0 30px 0 10px;
  padding: 3px 10px;
  border-radius: 6px;
  background: rgba(255,255,255,0.04);
  font-family: 'DM Mono', monospace;
  font-size: 0.66rem;
  color: ${T.muted};
  text-align: center;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pl-frame { display: block; aspect-ratio: 16 / 10; overflow: hidden; }
.pl-frame img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; transition: transform 0.9s ${ease}; }
.pl-shot:hover .pl-frame img { transform: scale(1.04); }

.proj-preview {
  position: fixed; top: 0; left: 0; z-index: 80;
  width: clamp(320px, 30vw, 440px);
  pointer-events: none;
  will-change: transform;
}
.pp-inner {
  box-shadow: 0 30px 90px rgba(0,0,0,0.65), 0 0 0 1px ${T.accent}22;
  opacity: 0;
  transform: scale(0.82);
  transition: opacity 0.3s, transform 0.5s ${ease};
}
.proj-preview.show .pp-inner { opacity: 1; transform: none; }
.pp-window { aspect-ratio: 16 / 10; overflow: hidden; }
.pp-strip { height: 100%; display: flex; flex-direction: column; transition: transform 0.7s ${ease}; }
.pp-strip img { flex: 0 0 100%; width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }

@media (max-width: 860px) {
  .pl-body { grid-template-columns: 1fr; gap: 28px; padding-left: 0; }
}
@media (max-width: 640px) {
  .pl-head { grid-template-columns: 34px 1fr 38px; grid-template-rows: auto auto; row-gap: 6px; column-gap: 12px; padding: 22px 0; }
  .pl-idx { grid-row: 1; align-self: start; padding-top: 0.55em; }
  .pl-name { grid-column: 2; grid-row: 1; font-size: 1.6rem; }
  .pl-kind { grid-column: 2; grid-row: 2; font-size: 0.68rem; }
  .pl-toggle { grid-column: 3; grid-row: 1 / span 2; width: 38px; height: 38px; }
  .pl-metrics { grid-template-columns: 1fr 1fr; }
  .pl-meta { font-size: 0.66rem; }
}

/* ─── SKILLS ──────────────────────────────────────────────────── */
.skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-flow: dense; gap: 20px; }
.skills-card { padding: 28px; }
.skills-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.skills-icon {
  width: 40px; height: 40px;
  border-radius: 11px;
  display: grid; place-items: center;
  font-family: 'DM Mono', monospace;
  font-size: 0.85rem;
  color: ${T.accent};
  background: ${T.accent}12;
  border: 1px solid ${T.accent}30;
}
.skills-title { font-size: 1rem; font-weight: 500; letter-spacing: -0.01em; }
.skills-count { margin-left: auto; font-family: 'DM Mono', monospace; font-size: 0.7rem; color: ${T.muted}; }
.skill-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-chip {
  font-size: 0.84rem;
  color: ${T.sub};
  padding: 6px 13px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.025);
  opacity: 0;
  transform: translateY(10px) scale(0.96);
  transition: opacity 0.5s ${ease}, transform 0.5s ${ease}, color 0.25s, border-color 0.25s, background 0.25s;
  transition-delay: calc(var(--i) * 45ms + 250ms);
}
.visible .skill-chip { opacity: 1; transform: none; }
.skill-chip:hover { color: ${T.text}; border-color: ${T.accent}66; background: ${T.accent}12; transition-delay: 0s; }
@media (max-width: 960px) { .skills-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) {
  .skills-grid { grid-template-columns: 1fr; }
  .skills-card { padding: 24px 20px; }
}

/* ─── CERTIFICATIONS ──────────────────────────────────────────── */
.cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.cert-card { display: flex; flex-direction: column; gap: 10px; padding: 28px; }
.cert-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.cert-issuer { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: ${T.accent}; letter-spacing: 0.03em; }
.cert-date { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: ${T.muted}; }
.cert-title { font-size: 1.1rem; font-weight: 500; letter-spacing: -0.02em; line-height: 1.35; }
.cert-desc { font-size: 0.87rem; color: ${T.sub}; line-height: 1.65; }
.cert-link {
  align-self: flex-start;
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: auto; padding-top: 10px;
  font-family: 'DM Mono', monospace;
  font-size: 0.74rem;
  color: ${T.sub};
  transition: color 0.25s;
}
.cert-link:hover { color: ${T.accent}; }
@media (max-width: 760px) {
  .cert-grid { grid-template-columns: 1fr; }
  .cert-card { padding: 24px 20px; }
}

/* ─── ACHIEVEMENTS ────────────────────────────────────────────── */
.ach-list { display: grid; gap: 14px; }
.ach-card { display: grid; grid-template-columns: 76px 1fr; gap: 20px; align-items: center; padding: 24px 30px; }
.ach-idx {
  font-size: 2.4rem;
  font-weight: 300;
  letter-spacing: -0.05em;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.22);
  transition: -webkit-text-stroke-color 0.4s, color 0.4s;
}
.ach-card:hover .ach-idx { -webkit-text-stroke-color: ${T.accent}; color: ${T.accent}22; }
.ach-text { font-size: 0.95rem; color: ${T.sub}; line-height: 1.65; }
.ach-text strong { color: ${T.text}; font-weight: 500; }
@media (max-width: 640px) {
  .ach-card { grid-template-columns: 44px 1fr; gap: 14px; padding: 20px; }
  .ach-idx { font-size: 1.7rem; }
}

/* ─── CONTACT ─────────────────────────────────────────────────── */
.contact-card {
  padding: clamp(36px, 7vw, 72px) clamp(20px, 6vw, 64px);
  text-align: center;
  background:
    radial-gradient(ellipse 70% 60% at 50% 0%, ${T.accent}1c, transparent 70%),
    linear-gradient(180deg, rgba(22,28,40,0.7), rgba(14,18,27,0.7));
}
.contact-big {
  font-size: clamp(2.2rem, 6vw, 4.2rem);
  font-weight: 300;
  letter-spacing: -0.035em;
  line-height: 1.05;
  margin-bottom: 22px;
}
.contact-big em {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.01em;
  padding-right: 0.06em;
  background: ${grad};
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
}
.contact-blurb {
  max-width: 560px;
  margin: 0 auto 36px;
  font-size: 1.02rem;
  font-weight: 300;
  color: ${T.sub};
  line-height: 1.8;
}
.contact-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; margin-bottom: 44px; }
.email-copy { font-family: 'DM Mono', monospace; font-size: 0.8rem; font-weight: 400; }
.email-copy .copy-state {
  font-size: 0.68rem;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(255,255,255,0.07);
  color: ${T.sub};
  transition: background 0.3s, color 0.3s;
}
.email-copy.copied .copy-state { background: ${T.accent}22; color: ${T.accent}; }
.social-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 720px; margin: 0 auto; }
.social-tile {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.025);
  font-size: 0.88rem;
  color: ${T.sub};
  transition: color 0.3s, border-color 0.3s, background 0.3s, transform 0.4s ${ease};
}
.social-tile:hover { color: ${T.text}; border-color: ${T.accent}55; background: ${T.accent}0d; transform: translateY(-3px); }
.social-tile:hover .arr { color: ${T.accent}; }
@media (max-width: 640px) { .social-grid { grid-template-columns: 1fr 1fr; } }

/* ─── FOOTER ──────────────────────────────────────────────────── */
footer { position: relative; z-index: 1; padding: 32px 0; border-top: 1px solid ${T.line}; }
.footer-inner {
  display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  color: ${T.muted};
}
.footer-inner button { background: none; border: none; cursor: pointer; color: ${T.sub}; font: inherit; transition: color 0.25s; }
.footer-inner button:hover { color: ${T.accent}; }

/* ─── BACK TO TOP ─────────────────────────────────────────────── */
.to-top {
  position: fixed; right: 28px; bottom: 28px; z-index: 90;
  width: 50px; height: 50px;
  display: grid; place-items: center;
  border: none;
  border-radius: 50%;
  background: rgba(18,23,34,0.82);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  color: ${T.text};
  font-size: 1rem;
  cursor: pointer;
  opacity: 0;
  transform: translateY(16px) scale(0.9);
  pointer-events: none;
  transition: opacity 0.4s, transform 0.5s ${ease}, background 0.3s;
}
.to-top.show { opacity: 1; transform: none; pointer-events: auto; }
.to-top:hover { background: ${T.accent}22; }
.to-top svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.to-top .ring-bg { stroke: rgba(255,255,255,0.08); }
.to-top .ring-fg { stroke: ${T.accent}; }
@media (max-width: 700px) { .to-top { right: 16px; bottom: 16px; width: 44px; height: 44px; } }

/* ─── RESUME MODAL ────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  background: rgba(5,7,11,0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.25s ease;
}
.modal-box {
  position: relative;
  width: 100%; max-width: 440px;
  padding: 40px 40px 36px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(24,30,44,0.92), rgba(14,18,27,0.95));
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 30px 90px rgba(0,0,0,0.6);
  animation: modalIn 0.5s ${ease};
}
.modal-box::before {
  content: '';
  position: absolute; top: 0; left: 15%; right: 15%;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${T.accent}, transparent);
}
.modal-box::after {
  content: '';
  position: absolute; top: -120px; left: 50%;
  width: 260px; height: 200px; margin-left: -130px;
  background: radial-gradient(${T.accent}22, transparent 70%);
  pointer-events: none;
}
.modal-backdrop.closing { animation: fadeOut 0.22s ease forwards; }
.modal-backdrop.closing .modal-box { animation: modalOut 0.22s ease forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeOut { to { opacity: 0; } }
@keyframes modalIn { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes modalOut { to { opacity: 0; transform: translateY(12px) scale(0.97); } }
.modal-close {
  position: absolute; top: 14px; right: 14px; z-index: 1;
  width: 34px; height: 34px;
  display: grid; place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: ${T.sub};
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s, background 0.2s, transform 0.3s ${ease};
}
.modal-close:hover { color: ${T.text}; background: rgba(255,255,255,0.08); transform: rotate(90deg); }
.modal-title { font-size: 1.45rem; font-weight: 500; letter-spacing: -0.03em; margin-bottom: 8px; }
.modal-sub { font-size: 0.86rem; color: ${T.sub}; line-height: 1.6; margin-bottom: 28px; }
.modal-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
.modal-label { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: ${T.muted}; letter-spacing: 0.08em; }
.modal-input {
  padding: 13px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  font: inherit;
  font-size: 0.92rem;
  color: ${T.text};
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.modal-input::placeholder { color: ${T.muted}; }
.modal-input:focus { border-color: ${T.accent}80; background: rgba(255,255,255,0.06); box-shadow: 0 0 0 4px ${T.accent}18; }
.modal-actions { display: flex; gap: 12px; margin-top: 28px; }
.modal-actions .btn { flex: 1; justify-content: center; }
.modal-actions .btn-ghost { flex: 0 0 auto; }
.spinner {
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: spin 0.7s linear infinite;
}
.modal-success { text-align: center; padding: 8px 0 0; }
.check {
  width: 64px; height: 64px;
  margin: 0 auto 20px;
  display: grid; place-items: center;
  border-radius: 50%;
  background: ${T.accent}18;
  border: 1px solid ${T.accent}44;
  animation: pop 0.6s ${ease};
}
.check path {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: draw 0.5s ease 0.25s forwards;
}
@keyframes pop { from { transform: scale(0.5); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes draw { to { stroke-dashoffset: 0; } }
.modal-success h3 { font-size: 1.2rem; font-weight: 500; margin-bottom: 8px; }
.modal-success p { font-size: 0.86rem; color: ${T.sub}; line-height: 1.6; margin-bottom: 26px; }
.modal-success p strong { color: ${T.text}; font-weight: 500; }
.modal-success .btn { width: 100%; justify-content: center; }
.modal-error {
  margin-top: 8px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #ff7b7b;
  background: rgba(255,107,107,0.08);
  border: 1px solid rgba(255,107,107,0.18);
}
@media (max-width: 700px) { .modal-box { padding: 32px 22px 26px; } }

/* ─── REDUCED MOTION ──────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    animation-delay: 0s !important;
    transition-duration: 0.001ms !important;
    transition-delay: 0s !important;
  }
  .reveal, .skill-chip, .sec-num { opacity: 1 !important; transform: none !important; filter: none !important; }
  .sec-title span { transform: none !important; }
  .hero-content { transform: none !important; opacity: 1 !important; }
  .marquee-track { animation: none !important; }
}
`;
