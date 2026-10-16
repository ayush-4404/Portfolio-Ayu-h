// ─── Content ──────────────────────────────────────────────────────────────────

export const EMAIL = "ayushmishra7484@gmail.com";
export const RESUME_LINK = "https://drive.google.com/file/d/1DGOAeeMJvZ_FeqbF6814hOtULbJ8b9Uh/view?usp=drive_link";

export const NAV = ["About", "Experience", "Projects", "Skills", "Certifications", "Achievements", "Contact"];

// Cycled by the typewriter in the hero — "I build …"
export const ROLES = ["full-stack products.", "LLM pipelines.", "scalable backends.", "software that ships."];

export const STATS = [
  { val: "8.89", unit: "", lbl: "CGPA — BIT Mesra" },
  { val: "1000", unit: "+", lbl: "DSA problems solved" },
  { val: "500", unit: "+", lbl: "Active users on Product" },
  { val: "8",  unit: "+", lbl: "months of experience" },
];

export const HERO_CHIPS = [
  { strong: "1000+", text: "DSA problems" },
  { strong: "500+", text: "users on Stedzo" },
  { strong: "1800+", text: "LeetCode rating" },
  { strong: "8+", text: "months of experience" },
];

export const EXP = [
  {
    role: "Software Engineer Intern",
    company: "Jury Assist",
    date: "May – August 2026",
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

export const SKILLS = [
  { group: "Languages",     icon: "λ",   items: ["Python", "C++", "Java", "JavaScript"] },
  { group: "Web & Backend", icon: "</>", items: ["React.js", "Node.js", "FastAPI", "Django", "Express.js", "Docker", "Redis", "AWS", "Tailwind CSS"], wide: true },
  { group: "Databases",     icon: "{ }", items: ["MongoDB", "PostgreSQL", "MySQL", "ChromaDB"] },
  { group: "AI & ML",       icon: "✦",   items: ["LangChain", "LangGraph", "HuggingFace", "RAG Pipelines", "NLP"] },
  { group: "Fundamentals",  icon: "∑",   items: ["System Design", "DSA", "Linux", "OS", "DBMS", "OOP"] },
];

export const MARQUEE_TECH = [...new Set(SKILLS.slice(0, 4).flatMap(s => s.items))];
export const MARQUEE_TOPICS = [
  "full-stack engineering", "applied ai", "llm pipelines", "distributed systems",
  "competitive programming", "system design", "developer tools", "software that ships",
];

export const PROJECTS = [
  {
    featured: true,
    name: "Stedzo",
    kind: "Multi-tenant SaaS",
    image: "/projects/stedzo.webp",
    domain: "stedzo.com",
    desc: "Multi-tenant SaaS for self-study libraries — Student, Library Owner, Super Admin roles. 500+ users across 20+ libraries, deployed as web app and Android app (Capacitor v6). Backend: 45 REST routes, Socket.IO chat, 11 cron jobs. 130k+ question mock test engine with KaTeX, Razorpay + OCR payment verification.",
    tags: ["Node.js", "MongoDB", "React", "TypeScript", "Socket.IO", "Capacitor", "Razorpay"],
    links: [{ label: "Live", href: "https://www.stedzo.com/" }],
    metrics: [
      { val: "500+", lbl: "active users" },
      { val: "20+", lbl: "libraries" },
      { val: "45", lbl: "REST routes" },
      { val: "130k+", lbl: "mock questions" },
    ],
  },
  {
    name: "Scalable URL Shortener",
    kind: "Web app",
    image: "/projects/pico-url.webp",
    domain: "pico-url-beta.vercel.app",
    desc: "Full-stack shortener — Base62 encoding, custom aliases, JWT auth, click analytics dashboard. Sub-10ms redirect latency via Redis caching. Containerized with Docker, API rate limiting, schema designed for high-traffic.",
    tags: ["Node.js", "Express.js", "React", "MongoDB", "Redis", "Docker"],
    links: [{ label: "GitHub", href: "https://github.com/ayush-4404/pico-url" }, { label: "Live", href: "https://pico-url-beta.vercel.app/" }],
  },
  {
    name: "ChatWithYoutube Extension",
    kind: "Chrome extension · AI",
    image: "/projects/youtube-chat.webp",
    domain: "youtube-chatbot-langchain.streamlit.app",
    desc: "Chrome extension for conversational AI over any YouTube video. Client-side pipeline fetches, cleans, and chunks transcripts for Gemini API. LangChain memory for context-aware multi-turn chat across sessions.",
    tags: ["Python", "JavaScript", "Flask", "LangChain", "Gemini API"],
    links: [{ label: "GitHub", href: "https://github.com/ayush-4404/youtube-chatbot-langchain" }, { label: "Streamlit", href: "https://youtube-chatbot-langchain.streamlit.app/" }],
  },
  {
    name: "AutoStream AI Agent",
    kind: "AI agent",
    image: "/projects/autostream.webp",
    domain: "architecture",
    desc: "LangGraph-powered conversational agent that qualifies leads from social media conversations. Models the workflow as a state machine — nodes handle intent detection, RAG retrieval from a knowledge base, response generation, and progressive lead capture (name → email → platform). Designed for WhatsApp deployment via Meta webhooks with Redis session persistence.",
    tags: ["Python", "LangGraph", "LangChain", "Gemini API", "RAG", "FastAPI"],
    links: [{ label: "GitHub", href: "https://github.com/ayush-4404/AutoStreamAI-Agent" }],
  },
  {
    name: "TossUp",
    kind: "Real-time web app",
    image: "/projects/tossup.webp",
    domain: "tossup-lemon.vercel.app",
    desc: "Real-time IPL match prediction platform with group-based competition. JWT auth, protected REST APIs for predictions, virtual coin transactions, and live leaderboard updates with strict server-side validation. Optimized MongoDB schemas across users, groups, matches, and bets — packaged as an Android APK.",
    tags: ["MongoDB", "Express.js", "React", "Node.js", "JWT"],
    links: [{ label: "GitHub", href: "https://github.com/ayush-4404/TossUp-frontend" }, { label: "Live", href: "https://tossup-lemon.vercel.app/" }],
  },
];

export const CERTIFICATIONS = [
  {
    title: "Generative AI Leader & Practitioner",
    issuer: "Google Cloud",
    date: "2024",
    desc: "Foundational and advanced principles of LLMs, prompt engineering, fine-tuning, and RAG architectures on Google Cloud infrastructure.",
    link: "https://www.skills.google/public_profiles/0642431d-540b-40ac-af22-f69cf6f6550b/badges/9184431",
  },
  {
    title: "Blockchain Technologies & Applications",
    issuer: "INSEAD",
    date: "2024",
    desc: "Decentralized systems, smart contract design, cryptographic consensus protocols, and Web3 applications.",
    link: "https://coursera.org/share/fedc7d9df4be1644777ca8198f9f0ce3",
  },
  {
    title: "Introduction to Philosophy",
    issuer: "The University of Edinburgh",
    date: "2025",
    desc: "Core philosophical traditions covering epistemology, ethics, logic, and the philosophy of mind.",
    link: "https://coursera.org/share/92f6c9bc04e13b4fe44e8c823434cb3c",
  },
  {
    title: "Introduction to Basic Game Development using Scratch",
    issuer: "Coursera Project Network",
    date: "2021",
    desc: "Game design fundamentals — event-driven programming, sprite logic, and interactive project building using Scratch.",
    link: "https://coursera.org/share/be698fd260d99ced0a5198653a79bebf",
  },
  {
    title: "Getting Started with Azure DevOps Boards",
    issuer: "Coursera Project Network",
    date: "2021",
    desc: "Agile project tracking with Azure DevOps — work items, sprints, backlogs, and team workflow management.",
    link: "https://coursera.org/share/0da7d648a0f77846cf2260b75bb038e2",
  },
];

export const ACHIEVEMENTS = [
  { text: <><strong>900+ DSA problems</strong> solved across LeetCode, Codeforces, and GeeksforGeeks.</> },
  { text: <><strong>Codeforces Pupil — 1250+ rating</strong>. LeetCode <strong>1800+ rating</strong> across 20+ contests. Top <strong>7.8% Globally</strong>.</> },
  { text: <><strong>1st Runner-up</strong>, Lost Codes Competitive Programming Contest, BIT Mesra.</> },
  { text: <><strong>Winner</strong>, Business Plan Competition, BIT Mesra 2024.</> },
  { text: <><strong>98.65 percentile, JEE Mains 2023</strong> — AIR 15,610 out of 1.1 million candidates.</> },
];

export const SOCIALS = [
  { label: "GitHub",        href: "https://github.com/ayush-4404" },
  { label: "LinkedIn",      href: "https://www.linkedin.com/in/ayush-raj-bt219/" },
  { label: "LeetCode",      href: "https://leetcode.com/u/ayush_mishra44/" },
  { label: "Codeforces",    href: "https://codeforces.com/profile/AYUSHmishra04" },
  { label: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/profile/ayushmisltof?tab=activity" },
  { label: "Codolio",       href: "https://codolio.com/profile/ayush_mishra44" },
];
