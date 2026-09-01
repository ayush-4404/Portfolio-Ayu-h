import { useState, useEffect, useRef } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
// Restrained palette: near-black base, warm white text, one accent used sparingly
const T = {
  bg:       "#0B0E14",   // Plain dark slate-navy background
  surface:  "#121722",   // Subtle dark surface cards/menus
  line:     "#1D2433",   // Elegant dark border line
  muted:    "#4A5568",   // Muted secondary detail
  sub:      "#8B98A5",   // Soft readable subtitle text
  text:     "#F0F4F8",   // Clean warm white text
  accent:   "#00C9B1",   // Vibrant accent color
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: ${T.bg};
  color: ${T.text};
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ─── INTERACTIVE BACKGROUND ──────────────────────────────────── */
.bg-canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* Cursor glow — main large halo */
.bg-canvas::before {
  content: '';
  position: absolute;
  width: 800px; height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, ${T.accent}18 0%, ${T.accent}06 40%, transparent 70%);
  transform: translate(-50%, -50%);
  left: var(--mx, 50%);
  top: var(--my, 50%);
  transition: left 0.08s linear, top 0.08s linear;
}

/* Cursor glow — tight inner spotlight */
.bg-canvas::after {
  content: '';
  position: absolute;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, ${T.accent}22 0%, transparent 70%);
  transform: translate(-50%, -50%);
  left: var(--mx, 50%);
  top: var(--my, 50%);
  transition: left 0.05s linear, top 0.05s linear;
}

/* Floating particle base */
.bg-particle {
  position: absolute;
  will-change: transform;
}

/* Dot */
.bg-particle--dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: ${T.sub};
  opacity: 0.35;
}

/* Ring */
.bg-particle--ring {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 1px solid ${T.sub};
  opacity: 0.2;
}

/* Cross */
.bg-particle--cross {
  width: 14px; height: 14px;
  opacity: 0.2;
  position: relative;
}
.bg-particle--cross::before,
.bg-particle--cross::after {
  content: '';
  position: absolute;
  background: ${T.sub};
}
.bg-particle--cross::before {
  width: 14px; height: 1px;
  top: 50%; left: 0;
  transform: translateY(-50%);
}
.bg-particle--cross::after {
  width: 1px; height: 14px;
  left: 50%; top: 0;
  transform: translateX(-50%);
}

/* Small diamond — uses inner span for rotation so parallax doesn't override */
.bg-particle--diamond {
  width: 10px; height: 10px;
  opacity: 0.2;
}
.bg-particle--diamond::before {
  content: '';
  position: absolute;
  width: 8px; height: 8px;
  border: 1px solid ${T.accent};
  transform: rotate(45deg);
  top: 1px; left: 1px;
}

/* Thin horizontal line */
.bg-particle--line {
  width: 50px; height: 1px;
  background: ${T.sub};
  opacity: 0.15;
}

@media (prefers-reduced-motion: reduce) {
  .bg-canvas { display: none; }
}
@media (max-width: 700px) {
  .bg-canvas .bg-particle { opacity: 0.1 !important; }
}

a { color: inherit; text-decoration: none; }
::selection { background: ${T.accent}22; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-thumb { background: ${T.line}; }

/* ─── NAV ─────────────────────────────────────────────────────── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 0 48px;
  height: 60px;
  display: flex; align-items: center; justify-content: space-between;
  background: ${T.bg}CC;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.4s;
}
nav.scrolled { border-color: ${T.line}; }
.nav-logo {
  font-family: 'DM Mono', monospace;
  font-size: 0.9rem;
  color: ${T.accent};
  cursor: pointer;
  letter-spacing: 0.02em;
}
.nav-links { display: flex; gap: 36px; list-style: none; }
.nav-links a {
  font-size: 0.82rem;
  font-weight: 400;
  color: ${T.sub};
  letter-spacing: 0.02em;
  transition: color 0.2s;
  position: relative;
}
.nav-links a::after {
  content: '';
  position: absolute; bottom: -2px; left: 0;
  width: 0; height: 1px;
  background: ${T.text};
  transition: width 0.25s ease;
}
.nav-links a:hover { color: ${T.text}; }
.nav-links a:hover::after { width: 100%; }

.hamburger {
  display: none; background: none; border: none;
  cursor: pointer; padding: 4px; flex-direction: column; gap: 5px;
}
.hamburger span { display: block; width: 20px; height: 1px; background: ${T.text}; transition: all 0.3s; }
.mobile-menu {
  display: none; position: fixed; top: 60px; left: 0; right: 0;
  background: ${T.surface};
  border-bottom: 1px solid ${T.line};
  padding: 24px 48px; flex-direction: column; gap: 20px; z-index: 99;
}
.mobile-menu.open { display: flex; }
.mobile-menu a { font-size: 1rem; color: ${T.sub}; transition: color 0.2s; }
.mobile-menu a:hover { color: ${T.text}; }

@media (max-width: 700px) {
  nav { padding: 0 24px; }
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { padding: 24px; }
}

/* ─── LAYOUT ──────────────────────────────────────────────────── */
.container { max-width: 860px; margin: 0 auto; padding: 0 48px; }
@media (max-width: 700px) { .container { padding: 0 24px; } }

section { padding: 100px 0; }
section + section { border-top: 1px solid ${T.line}; }

/* ─── SECTION HEADER ──────────────────────────────────────────── */
.sec-header { margin-bottom: 56px; }
.sec-num {
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  color: ${T.accent};
  letter-spacing: 0.06em;
  margin-bottom: 10px;
  display: block;
}
.sec-title {
  font-size: 2.2rem;
  font-weight: 300;
  color: ${T.text};
  letter-spacing: -0.04em;
  line-height: 1.1;
}

/* ─── HERO ────────────────────────────────────────────────────── */
#hero {
  min-height: 100vh;
  display: flex; align-items: center;
  padding: 0;
  border-bottom: 1px solid ${T.line};
}
.hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 48px;
  width: 100%;
  padding: 60px 0 80px;
}
.hero-left { flex: 1; }
.hero-eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 0.78rem;
  color: ${T.sub};
  letter-spacing: 0.08em;
  margin-bottom: 24px;
}
.hero-name {
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 300;
  letter-spacing: -0.05em;
  color: ${T.text};
  line-height: 0.95;
  margin-bottom: 28px;
}
.hero-name em {
  font-style: italic;
  font-weight: 300;
  color: ${T.sub};
}
.hero-tagline {
  font-size: 1rem;
  font-weight: 400;
  color: ${T.sub};
  max-width: 340px;
  line-height: 1.65;
  margin-bottom: 40px;
}
.hero-ctas { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
.hero-cta-primary {
  position: relative;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: ${T.bg};
  background: ${T.accent};
  padding: 11px 28px;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 0 20px ${T.accent}30, 0 4px 16px rgba(0,0,0,0.3);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}
.hero-cta-primary::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
  transition: left 0.45s ease;
}
.hero-cta-primary:hover::before { left: 100%; }
.hero-cta-primary:hover {
  box-shadow: 0 0 32px ${T.accent}55, 0 6px 24px rgba(0,0,0,0.35);
  transform: translateY(-1px);
}
.hero-cta-primary:active { transform: translateY(0px); }
.hero-cta-primary .btn-arrow {
  display: inline-block;
  transition: transform 0.25s ease;
  font-style: normal;
}
.hero-cta-primary:hover .btn-arrow { transform: translateX(3px); }
.hero-cta-secondary {
  font-size: 0.85rem;
  color: ${T.sub};
  letter-spacing: 0.01em;
  transition: color 0.2s;
  cursor: pointer;
  background: none; border: none;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: ${T.line};
}
.hero-cta-secondary:hover { color: ${T.text}; text-decoration-color: ${T.muted}; }

.hero-photo-wrap {
  position: relative;
  width: 200px; height: 200px;
  flex-shrink: 0;
}

/* Circular photo */
.hero-photo-wrap .photo-circle {
  width: 200px; height: 200px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  z-index: 2;
  border: 2px solid ${T.accent}40;
  box-shadow:
    0 0 0 6px ${T.accent}10,
    0 0 32px ${T.accent}18,
    0 20px 60px rgba(0,0,0,0.5);
  transition: box-shadow 0.4s ease;
}
.hero-photo-wrap:hover .photo-circle {
  box-shadow:
    0 0 0 6px ${T.accent}25,
    0 0 48px ${T.accent}30,
    0 20px 60px rgba(0,0,0,0.5);
}
.hero-photo-wrap .photo-circle img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
  transition: transform 0.5s ease;
}
.hero-photo-wrap:hover .photo-circle img {
  transform: scale(1.04);
}

/* Shimmer overlay */
.hero-photo-wrap .photo-circle::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, ${T.accent}12 0%, transparent 60%);
  pointer-events: none;
}

/* Decorative corner brackets */
.hero-photo-wrap::before,
.hero-photo-wrap::after {
  content: '';
  position: absolute;
  width: 20px; height: 20px;
  border-color: ${T.accent};
  border-style: solid;
  opacity: 0.5;
  z-index: 1;
  transition: opacity 0.3s;
}
.hero-photo-wrap::before {
  top: -8px; left: -8px;
  border-width: 1px 0 0 1px;
}
.hero-photo-wrap::after {
  bottom: -8px; right: -8px;
  border-width: 0 1px 1px 0;
}
.hero-photo-wrap:hover::before,
.hero-photo-wrap:hover::after {
  opacity: 1;
}

/* Floating accent dot */
.hero-photo-wrap .photo-dot {
  position: absolute;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: ${T.accent};
  bottom: 12px; right: 4px;
  z-index: 3;
  box-shadow: 0 0 12px ${T.accent};
  animation: pulse-dot 2.5s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
}

@media (max-width: 700px) {
  .hero-inner { flex-direction: column-reverse; align-items: flex-start; padding: 80px 0 60px; gap: 32px; }
  .hero-photo-wrap { width: 130px; height: 130px; }
  .hero-photo-wrap .photo-circle { width: 130px; height: 130px; }
  .hero-name { font-size: 3rem; }
}

/* ─── ABOUT ───────────────────────────────────────────────────── */
.about-layout { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 64px; align-items: start; }
.about-bio {
  font-size: 1.02rem;
  font-weight: 300;
  color: ${T.sub};
  line-height: 1.85;
}
.about-bio p + p { margin-top: 1.2em; }
.about-bio strong { color: ${T.text}; font-weight: 500; }
.about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: ${T.line}; border: 1px solid ${T.line}; border-radius: 3px; overflow: hidden; }
.stat-item {
  background: ${T.bg};
  padding: 24px 20px;
}
.stat-val {
  font-size: 1.9rem;
  font-weight: 300;
  color: ${T.text};
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 5px;
}
.stat-val span { color: ${T.accent}; }
.stat-lbl { font-size: 0.75rem; color: ${T.muted}; line-height: 1.4; }

@media (max-width: 700px) { .about-layout { grid-template-columns: 1fr; gap: 40px; } }

/* ─── EXPERIENCE ──────────────────────────────────────────────── */
.exp-list { display: flex; flex-direction: column; }
.exp-item {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 32px;
  padding: 36px 0;
  border-bottom: 1px solid ${T.line};
}
.exp-item:first-child { border-top: 1px solid ${T.line}; }
.exp-meta { padding-top: 4px; }
.exp-date {
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  color: ${T.muted};
  line-height: 1.5;
  letter-spacing: 0.02em;
}
.exp-company {
  font-size: 0.82rem;
  color: ${T.accent};
  margin-top: 6px;
  font-weight: 400;
}
.exp-role {
  font-size: 1.05rem;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.exp-bullets { list-style: none; display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
.exp-bullets li {
  font-size: 0.88rem;
  color: ${T.sub};
  line-height: 1.7;
  padding-left: 14px;
  position: relative;
}
.exp-bullets li::before {
  content: ''; position: absolute; left: 0; top: 10px;
  width: 4px; height: 1px; background: ${T.muted};
}
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  color: ${T.muted};
  background: ${T.surface};
  border: 1px solid ${T.line};
  border-radius: 2px;
  padding: 3px 8px;
  letter-spacing: 0.02em;
  transition: color 0.2s, border-color 0.2s;
}
.tag:hover { color: ${T.text}; border-color: ${T.muted}; }

@media (max-width: 700px) {
  .exp-item { grid-template-columns: 1fr; gap: 12px; }
}

/* ─── SKILLS ──────────────────────────────────────────────────── */
.skills-table { display: flex; flex-direction: column; }
.skills-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 32px;
  padding: 24px 0;
  border-bottom: 1px solid ${T.line};
  align-items: baseline;
}
.skills-row:first-child { border-top: 1px solid ${T.line}; }
.skills-group-label {
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  color: ${T.muted};
  letter-spacing: 0.04em;
}
.skills-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-pill {
  font-size: 0.83rem;
  color: ${T.sub};
  transition: color 0.2s;
}
.skill-pill:hover { color: ${T.text}; }
.skill-pill + .skill-pill::before { content: '·'; margin-right: 8px; color: ${T.line}; }

@media (max-width: 700px) {
  .skills-row { grid-template-columns: 1fr; gap: 10px; }
}

/* ─── PROJECTS ────────────────────────────────────────────────── */
.projects-list { display: flex; flex-direction: column; }
.project-item {
  padding: 36px 0;
  border-bottom: 1px solid ${T.line};
}
.project-item:first-child { border-top: 1px solid ${T.line}; }
.project-header { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-bottom: 12px; flex-wrap: wrap; }
.project-name {
  font-size: 1.15rem;
  font-weight: 500;
  color: ${T.text};
  letter-spacing: -0.03em;
}
.project-links-inline { display: flex; gap: 16px; }
.project-link-item {
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  color: ${T.muted};
  letter-spacing: 0.02em;
  transition: color 0.2s;
  border-bottom: 1px solid ${T.line};
  padding-bottom: 1px;
}
.project-link-item:hover { color: ${T.text}; border-color: ${T.muted}; }
.project-desc {
  font-size: 0.88rem;
  color: ${T.sub};
  line-height: 1.75;
  margin-bottom: 16px;
  max-width: 600px;
}
.project-featured-mark {
  font-family: 'DM Mono', monospace;
  font-size: 0.68rem;
  color: ${T.accent};
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

/* ─── CERTIFICATIONS ───────────────────────────────────────────── */
.cert-list { display: flex; flex-direction: column; }
.cert-item {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 32px;
  padding: 28px 0;
  border-bottom: 1px solid ${T.line};
}
.cert-item:first-child { border-top: 1px solid ${T.line}; }
.cert-issuer {
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  color: ${T.accent};
  letter-spacing: 0.02em;
}
.cert-date {
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  color: ${T.muted};
  margin-top: 4px;
}
.cert-title {
  font-size: 1.05rem;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}
.cert-desc {
  font-size: 0.88rem;
  color: ${T.sub};
  line-height: 1.65;
}
@media (max-width: 700px) {
  .cert-item { grid-template-columns: 1fr; gap: 8px; }
}

/* ─── ACHIEVEMENTS ────────────────────────────────────────────── */
.ach-list { display: flex; flex-direction: column; }
.ach-item {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid ${T.line};
  align-items: baseline;
}
.ach-item:first-child { border-top: 1px solid ${T.line}; }
.ach-idx {
  font-family: 'DM Mono', monospace;
  font-size: 0.68rem;
  color: ${T.muted};
  padding-top: 2px;
}
.ach-text {
  font-size: 0.92rem;
  color: ${T.sub};
  line-height: 1.65;
}
.ach-text strong { color: ${T.text}; font-weight: 500; }

/* ─── CONTACT ─────────────────────────────────────────────────── */
.contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
.contact-blurb {
  font-size: 1rem;
  font-weight: 300;
  color: ${T.sub};
  line-height: 1.8;
  margin-bottom: 32px;
}
.contact-email {
  font-size: 1rem;
  color: ${T.text};
  border-bottom: 1px solid ${T.muted};
  padding-bottom: 2px;
  transition: color 0.2s, border-color 0.2s;
  display: inline-block;
}
.contact-email:hover { color: ${T.accent}; border-color: ${T.accent}; }
.social-col { display: flex; flex-direction: column; gap: 0; }
.social-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid ${T.line};
  color: ${T.sub};
  font-size: 0.88rem;
  transition: color 0.2s;
}
.social-row:first-child { border-top: 1px solid ${T.line}; }
.social-row:hover { color: ${T.text}; }
.social-arrow { font-size: 0.75rem; transition: transform 0.2s; }
.social-row:hover .social-arrow { transform: translate(2px, -2px); }

@media (max-width: 700px) { .contact-layout { grid-template-columns: 1fr; gap: 40px; } }

/* ─── FOOTER ──────────────────────────────────────────────────── */
footer {
  padding: 36px 0;
  border-top: 1px solid ${T.line};
}
.footer-inner {
  display: flex; justify-content: space-between; align-items: center;
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  color: ${T.muted};
}

/* ─── SCROLL ANIMATIONS ───────────────────────────────────────── */

/* Default hidden state */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.visible { opacity: 1; transform: translateY(0); }

/* Slide from left */
.reveal-left {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-left.visible { opacity: 1; transform: translateX(0); }

/* Line draw — horizontal rule growing in width */
.reveal-line {
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-line.visible { transform: scaleX(1); }

/* Stagger delays (applied via inline style) */

/* Hero — separate keyframe animation on load */
.hero-in {
  opacity: 0;
  animation: heroUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes heroUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Cursor blink on mono text */
.blink::after {
  content: '_';
  color: ${T.accent};
  animation: blink 1.1s step-end infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-left, .reveal-line, .hero-in {
    opacity: 1 !important; transform: none !important; animation: none !important;
  }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV = ["About", "Experience", "Projects", "Skills", "Certifications", "Achievements", "Contact"];

const STATS = [
  { val: "8.89", unit: "", lbl: "GPA — BIT Mesra" },
  { val: "900", unit: "+", lbl: "DSA problems solved" },
  { val: "500", unit: "+", lbl: "Stedzo users" },
  { val: "90",  unit: "%", lbl: "Alignment recall, Jury Assist" },
];

const EXP = [
  {
    role: "Software Engineer Intern",
    company: "Jury Assist",
    date: "May – July 2026",
    bullets: [
      "Designed and shipped a semantic contract comparison pipeline — sentence embeddings, Hungarian alignment, LLM risk classification. 90% alignment recall, 77% faster analysis via async concurrency. Deployed to production.",
      "Architected a multi-tier subscription gating system (FastAPI, PostgreSQL, React) across 11 document tools, enabling tiered monetization.",
      "Shipped 6 feature enhancements and resolved critical bugs through CI/CD pipelines in Agile sprints.",
    ],
    tags: ["FastAPI", "PostgreSQL", "React", "Python", "LLM", "CI/CD"],
  },
  {
    role: "Natural Language Evaluator — Hindi",
    company: "Outlier",
    date: "May – Jun 2024",
    bullets: [
      "Evaluated and refined Hindi LLM outputs — diagnosed failure modes across 500+ responses, proposed structured prompt improvements that directly boosted model quality benchmarks.",
      "Worked cross-functionally with 5+ evaluators to identify linguistic edge cases and optimize prompt-response pipelines.",
    ],
    tags: ["Prompt Engineering", "LLM Evaluation", "NLP", "Hindi"],
  },
];

const SKILLS = [
  { group: "Languages",     items: ["Python", "C++", "Java", "JavaScript"] },
  { group: "Web & Backend", items: ["React.js", "Node.js", "FastAPI", "Django", "Express.js", "Docker", "Redis", "AWS", "Tailwind CSS"] },
  { group: "Databases",     items: ["MongoDB", "PostgreSQL", "MySQL", "ChromaDB"] },
  { group: "AI & ML",       items: ["LangChain", "LangGraph", "HuggingFace", "RAG Pipelines", "NLP"] },
  { group: "Fundamentals",  items: ["System Design", "DSA", "Linux", "OS", "DBMS", "OOP"] },
];

const PROJECTS = [
  {
    featured: true,
    name: "Stedzo",
    desc: "Multi-tenant SaaS for self-study libraries — Student, Library Owner, Super Admin roles. 500+ users across 20+ libraries, deployed as web app and Android app (Capacitor v6). Backend: 45 REST routes, Socket.IO chat, 11 cron jobs. 130k+ question mock test engine with KaTeX, Razorpay + OCR payment verification.",
    tags: ["Node.js", "MongoDB", "React", "TypeScript", "Socket.IO", "Capacitor", "Razorpay"],
    links: [{ label: "Live", href: "#" }, { label: "GitHub", href: "#" }],
  },
  {
    name: "Scalable URL Shortener",
    desc: "Full-stack shortener — Base62 encoding, custom aliases, JWT auth, click analytics dashboard. Sub-10ms redirect latency via Redis caching. Containerized with Docker, API rate limiting, schema designed for high-traffic.",
    tags: ["Node.js", "Express.js", "React", "MongoDB", "Redis", "Docker"],
    links: [{ label: "GitHub", href: "#" }, { label: "Live", href: "#" }],
  },
  {
    name: "ChatWithYoutube Extension",
    desc: "Chrome extension for conversational AI over any YouTube video. Client-side pipeline fetches, cleans, and chunks transcripts for Gemini API. LangChain memory for context-aware multi-turn chat across sessions.",
    tags: ["Python", "JavaScript", "Flask", "LangChain", "Gemini API"],
    links: [{ label: "GitHub", href: "#" }, { label: "Streamlit", href: "#" }],
  },
];

const CERTIFICATIONS = [
  {
    title: "Generative AI Leader & Practitioner",
    issuer: "Google Cloud",
    date: "2024",
    desc: "Foundational and advanced principles of LLMs, prompt engineering, fine-tuning, and RAG architectures.",
  },
  {
    title: "Blockchain Technologies & Applications",
    issuer: "INSEAD",
    date: "2024",
    desc: "Decentralized systems, smart contract design, cryptographic consensus protocols, and Web3 applications.",
  },
];

const ACHIEVEMENTS = [
  { text: <><strong>900+ DSA problems</strong> solved across LeetCode, Codeforces, and GeeksforGeeks.</> },
  { text: <><strong>Codeforces Pupil — 1250+ rating</strong>, top 25% globally. LeetCode 1800+ rating across 20+ contests.</> },
  { text: <><strong>1st Runner-up</strong>, Lost Codes Competitive Programming Contest, BIT Mesra.</> },
  { text: <><strong>Winner</strong>, Business Plan Competition, BIT Mesra 2024.</> },
  { text: <><strong>98.65 percentile, JEE Mains 2023</strong> — AIR 15,610 out of 1.1 million candidates.</> },
  { text: <><strong>Sponsorship Head</strong>, The Literary Society, BIT Mesra — onboarded 4 sponsors, managed outreach and negotiation.</> },
  { text: <>Certified: <strong>Generative AI</strong> (Google Cloud) · <strong>Blockchain Technologies</strong> (INSEAD).</> },
];

const SOCIALS = [
  { label: "GitHub",        href: "https://github.com/ayush-4404" },
  { label: "LinkedIn",      href: "https://www.linkedin.com/in/ayush-raj-bt219/" },
  { label: "LeetCode",      href: "https://leetcode.com/u/ayush_mishra44/" },
  { label: "Codeforces",    href: "https://codeforces.com/profile/AYUSHmishra04" },
  { label: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/profile/ayushmisltof?tab=activity" },
  { label: "Codolio",       href: "https://codolio.com/profile/ayush_mishra44" },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Small components ─────────────────────────────────────────────────────────

function SectionHeader({ num, title }) {
  const ref = useReveal();
  return (
    <div className="sec-header reveal" ref={ref}>
      <span className="sec-num">{num}</span>
      <h2 className="sec-title">{title}</h2>
    </div>
  );
}

function RevealDiv({ children, className = "", delay = 0, type = "reveal" }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`${type} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef(null);

  // Generate particles once (deterministic positions, random-ish via seed)
  const particles = useRef((() => {
    const types = ["dot", "dot", "dot", "ring", "cross", "diamond", "line", "dot", "ring"];
    const seed = [];
    for (let i = 0; i < 28; i++) {
      const t = types[i % types.length];
      // Spread across the viewport using golden-ratio-ish distribution
      const x = ((i * 37.7) % 100);
      const y = ((i * 23.3 + 11) % 100);
      const depth = 0.3 + (i % 5) * 0.18; // parallax depth 0.3–1.02
      seed.push({ type: t, x, y, depth });
    }
    return seed;
  })()).current;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Target mouse position
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    // Current lerped position
    const curr = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let rafId;

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const loop = () => {
      // Smooth lerp — 12% per frame (~60fps → ~200ms settling time)
      curr.x += (mouse.x - curr.x) * 0.12;
      curr.y += (mouse.y - curr.y) * 0.12;

      // Update glow position
      if (canvasRef.current) {
        canvasRef.current.style.setProperty("--mx", `${curr.x}px`);
        canvasRef.current.style.setProperty("--my", `${curr.y}px`);
      }

      // Parallax particles
      if (particlesRef.current) {
        const cx = (curr.x / window.innerWidth - 0.5) * 2;   // -1 to 1
        const cy = (curr.y / window.innerHeight - 0.5) * 2;
        const els = particlesRef.current.children;
        for (let i = 0; i < els.length; i++) {
          const depth = parseFloat(els[i].dataset.depth) || 0.5;
          const dx = cx * depth * 60;   // up to ±60px for deepest layer
          const dy = cy * depth * 60;
          els[i].style.transform = `translate(${dx}px, ${dy}px)`;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{css}</style>
      <div className="bg-canvas" ref={canvasRef}>
        <div ref={particlesRef}>
          {particles.map((p, i) => (
            <div
              key={i}
              className={`bg-particle bg-particle--${p.type}`}
              data-depth={p.depth}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            />
          ))}
        </div>
      </div>
      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <span className="nav-logo blink" onClick={() => go("hero")} style={{ cursor: "pointer" }}>ayush.dev</span>
        <ul className="nav-links">
          {NAV.map(n => (
            <li key={n}>
              <a href={`#${n.toLowerCase()}`} onClick={e => { e.preventDefault(); go(n.toLowerCase()); }}>
                {n.toLowerCase()}
              </a>
            </li>
          ))}
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV.map(n => (
          <a key={n} href={`#${n.toLowerCase()}`} onClick={e => { e.preventDefault(); go(n.toLowerCase()); }}>{n.toLowerCase()}</a>
        ))}
      </div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section id="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-left">
              <p className="hero-eyebrow hero-in" style={{ animationDelay: "0ms" }}>
                CS Student · BIT Mesra · Ranchi, India
              </p>
              <h1 className="hero-name hero-in" style={{ animationDelay: "80ms" }}>
                Ayush<br /><em>Raj</em>
              </h1>
              <p className="hero-tagline hero-in" style={{ animationDelay: "180ms" }}>
                Full-stack developer with a passion for AI and systems.
              </p>
              <div className="hero-ctas hero-in" style={{ animationDelay: "280ms" }}>
                <button className="hero-cta-primary" onClick={() => go("projects")}>View projects <span className="btn-arrow">→</span></button>
                <button className="hero-cta-secondary" onClick={() => go("contact")}>Get in touch</button>
              </div>
            </div>
            <div className="hero-photo-wrap hero-in" style={{ animationDelay: "160ms" }}>
              <div className="photo-circle">
                <img src="/profile.webp" alt="Ayush Raj" />
              </div>
              <div className="photo-dot" />
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────── */}
      <section id="about">
        <div className="container">
          <SectionHeader num="01" title="About" />
          <div className="about-layout">
            <RevealDiv delay={0}>
              <div className="about-bio">
                <p>
                  I'm a <strong>Computer Science student at BIT Mesra</strong> building at the intersection of full-stack engineering and applied AI. I care about systems that are fast, scalable, and actually useful.
                </p>
                <p>
                  At <strong>Jury Assist</strong>, I shipped a semantic contract analysis pipeline to production. Before that I evaluated Hindi LLM outputs at <strong>Outlier</strong>. On the side, I built <strong>Stedzo</strong> — a multi-tenant SaaS now serving 500+ users across 20+ libraries.
                </p>
                <p>
                  I compete in competitive programming (900+ problems, Codeforces Pupil), build Chrome extensions, containerize apps with Docker, and keep pushing the limits of what I can ship.
                </p>
              </div>
            </RevealDiv>
            <RevealDiv delay={100}>
              <div className="about-stats">
                {STATS.map(s => (
                  <div className="stat-item" key={s.lbl}>
                    <div className="stat-val">{s.val}<span>{s.unit}</span></div>
                    <div className="stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ───────────────────────────────────────────── */}
      <section id="experience">
        <div className="container">
          <SectionHeader num="02" title="Experience" />
          <div className="exp-list">
            {EXP.map((e, i) => (
              <RevealDiv key={e.company} type="reveal-left" delay={i * 80} className="exp-item">
                <div className="exp-meta">
                  <div className="exp-date">{e.date}</div>
                  <div className="exp-company">{e.company}</div>
                </div>
                <div>
                  <div className="exp-role">{e.role}</div>
                  <ul className="exp-bullets">
                    {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                  <div className="tags">
                    {e.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────────── */}
      <section id="projects">
        <div className="container">
          <SectionHeader num="03" title="Projects" />
          <div className="projects-list">
            {PROJECTS.map((p, i) => (
              <RevealDiv key={p.name} delay={i * 80} className="project-item">
                {p.featured && <div className="project-featured-mark">Featured</div>}
                <div className="project-header">
                  <div className="project-name">{p.name}</div>
                  <div className="project-links-inline">
                    {p.links.map(l => (
                      <a key={l.label} href={l.href} className="project-link-item" target="_blank" rel="noopener noreferrer">
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
                <p className="project-desc">{p.desc}</p>
                <div className="tags">
                  {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────────────────── */}
      <section id="skills">
        <div className="container">
          <SectionHeader num="04" title="Skills" />
          <div className="skills-table">
            {SKILLS.map((sg, i) => (
              <RevealDiv key={sg.group} delay={i * 60} className="skills-row">
                <div className="skills-group-label">{sg.group.toLowerCase()}</div>
                <div className="skills-pills">
                  {sg.items.map(s => <span key={s} className="skill-pill">{s}</span>)}
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ───────────────────────────────────────── */}
      <section id="certifications">
        <div className="container">
          <SectionHeader num="05" title="Certifications" />
          <div className="cert-list">
            {CERTIFICATIONS.map((c, i) => (
              <RevealDiv key={c.title} delay={i * 70} className="cert-item">
                <div>
                  <div className="cert-issuer">{c.issuer}</div>
                  <div className="cert-date">{c.date}</div>
                </div>
                <div>
                  <div className="cert-title">{c.title}</div>
                  <div className="cert-desc">{c.desc}</div>
                </div>
              </RevealDiv>
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
              <RevealDiv key={i} delay={i * 50} className="ach-item">
                <div className="ach-idx">0{i + 1}</div>
                <div className="ach-text">{a.text}</div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────── */}
      <section id="contact">
        <div className="container">
          <SectionHeader num="07" title="Get in touch" />
          <div className="contact-layout">
            <RevealDiv delay={0}>
              <p className="contact-blurb">
                Open to internships, full-time roles, and interesting problems. If you're building something worth working on — or just want to talk systems and AI — reach out.
              </p>
              <a href="mailto:ayushmishra7484@gmail.com" className="contact-email">
                ayushmishra7484@gmail.com
              </a>
            </RevealDiv>
            <RevealDiv delay={80}>
              <div className="social-col">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} className="social-row" target="_blank" rel="noopener noreferrer">
                    <span>{s.label}</span>
                    <span className="social-arrow">↗</span>
                  </a>
                ))}
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <span>Ayush Raj © 2026</span>
            <span>Built with React</span>
          </div>
        </div>
      </footer>
    </>
  );
}
