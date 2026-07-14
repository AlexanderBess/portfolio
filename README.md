# 👨‍💻 Modern Portfolio — Alex Bessmelcev

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

Personal portfolio built as a technology demo: bento-grid UI, live Three.js scene, an AI twin chat widget, full i18n and a token-based theme system. Focused on performance (Web Vitals), accessibility (WCAG) and clean, typed code.

**Live:** [alex-bes.vercel.app](https://alex-bes.vercel.app/)

---

## 🌟 Key Features

### 🍱 Bento Grid UI
Reusable `BentoCard`/`BentoGrid` components: subtle borders, a cursor-tracking radial glow, a 3D-tilt photo card with glare, and a responsive mosaic (1 column on mobile → 4-column grid on desktop).

### 🧊 Live Three.js Scene
Wireframe icosahedron with a particle shell and mouse parallax in the hero card. Lazy-loaded into a separate chunk, rAF pauses offscreen, DPR capped at 2, full dispose on unmount, `prefers-reduced-motion` respected.

### 🤖 AI Twin Chat Widget
"Ask my AI twin" — a floating chat with quick questions, typing indicator, skeletons and message animations. Transport-agnostic architecture: a client-side mock by default, a real Claude-powered backend (`api/ai-twin.ts`, Vercel serverless) enabled via `VITE_AI_TWIN_ENDPOINT`. The system prompt is built from the actual resume data. Free-tier protection: request caps + per-IP rate limits (Upstash Redis or in-memory).

### 📐 Interactive Engineering Canvas
Page-wide grid background with a pointer "flashlight": CSS-var coordinates written only inside `requestAnimationFrame`, touch support with fade-out on release, no `filter: blur` — mobile-GPU friendly.

### 🎨 Token-based Theming
Dark/light themes driven by CSS custom properties (`--card-bg`, `--canvas-*`, ...) mapped into Tailwind as semantic colors (`bg-theme-card`, `text-theme-muted`). Components never hardcode colors — new blocks get theming for free.

### 🌍 Multi-language Support
**Vue I18n** with symmetric EN/RU dictionaries. All translatable content lives in locale files, keyed by stable ids from a single typed data source (`portfolioData.ts`). `<html lang>` stays in sync with the active locale.

### ♿ Accessibility
Semantic landmarks, `aria-labelledby` sections, keyboard-visible focus rings (`:focus-visible`), `aria-live` chat messages, decorative elements hidden from screen readers, `prefers-reduced-motion` honored across all animations.

### ⚡ Performance
Code-split Three.js chunk, scroll-reveal via a shared `IntersectionObserver` (`v-reveal` directive), eager + `fetchpriority="high"` for the LCP image, `AppImage` helper with AVIF/WebP and native lazy loading.

---

## 🛠 Tech Stack & Tools

| Category | Technology |
| :--- | :--- |
| **Frontend** | Vue 3 (Composition API, `<script setup>`) |
| **Typing** | TypeScript (strict) |
| **3D** | Three.js |
| **Styles** | Tailwind CSS, SCSS, design tokens (CSS custom properties) |
| **Build Tool** | Vite |
| **Routing** | Vue Router 4 |
| **i18n** | Vue I18n 11 |
| **Physics** | Matter.js (hero pills) |
| **Icons** | lucide-vue-next |
| **Backend** | Vercel Serverless + Anthropic API (AI twin) |

---

## 📁 Project Directory Structure

```
portfolio/
├── api/
│   └── ai-twin.ts             # Vercel serverless: Claude proxy + rate limits
├── public/                    # Favicons, og-image
├── src/
│   ├── assets/                # Tailwind entry CSS, images
│   ├── components/
│   │   ├── bento/             # BentoCard/Grid, showcase sections, Three.js scene
│   │   ├── chat/              # AI twin widget
│   │   ├── ui/                # AppImage (lazy + AVIF/WebP)
│   │   ├── Header.vue         # Nav, theme & language switchers
│   │   ├── PhysicBlock.vue    # Matter.js hero pills
│   │   └── InteractiveGridBg.vue  # Engineering-canvas background
│   ├── composables/           # useAiTwinChat
│   ├── data/portfolioData.ts  # Single typed source of resume data
│   ├── directives/reveal.ts   # v-reveal scroll animations
│   ├── locales/               # en.json / ru.json (symmetric)
│   ├── server/aiTwinPrompt.ts # System prompt builder (data + locales)
│   ├── services/aiTwin.ts     # Chat providers: mock / HTTP
│   ├── styles/                # SCSS: theme tokens, global styles
│   └── views/Home.vue         # Page composition
├── tailwind.config.js         # Semantic theme colors → CSS vars
└── vite.config.ts
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev        # dev server on :3000
npm run build      # type-check + production build
```

### AI Twin backend (optional)

Without configuration the chat runs on a client-side mock. To enable the real model on Vercel:

1. Set `ANTHROPIC_API_KEY` and `VITE_AI_TWIN_ENDPOINT=/api/ai-twin` in project env vars.
2. Optional: `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` for durable rate limits, `AI_TWIN_ALLOWED_ORIGINS` to lock the endpoint to your domain.

See `.env.example` for details.

---

## 🤝 Contact

- Email: alexbessmelcev@gmail.com
- Telegram: [@Alex_Sage](https://t.me/Alex_Sage)
- GitHub: [@AlexanderBess](https://github.com/AlexanderBess)
- LinkedIn: [alex-bessmelcev](https://linkedin.com/in/alex-bessmelcev)
