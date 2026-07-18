export interface PersonalInfo {
  name: string;
  title: string;
  subTitle: string;
  experienceYears: number;
  email: string;
  telegram: string;
  github: string;
  linkedin: string;
  website: string;
  about: string;
}

export interface Skills {
  frontend: string[];
  architecture: string[];
  toolsAndAI: string[];
}

/** Stable ids — must match the keys under `bento.experience.jobs` in locale files. */
export type JobId = 'emcd' | 'wsender' | 'anketolog' | 'tenzor' | 'crypton' | 'chrono';

export interface JobExperience {
  /** i18n key: role/location/period/achievements live under `bento.experience.jobs.<id>` */
  id: JobId;
  company: string;
  techStack: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
}

/** Stable ids — must match the keys under `bento.projects.items` in locale files. */
export type ProjectId = 'p2pMarketplace' | 'uiKit' | 'cryptoCard' | 'surveyPlatform' | 'terrainGenerator';

export interface Project {
  /** i18n key: name/description live under `bento.projects.items.<id>` */
  id: ProjectId;
  /** External link; omit for internal/NDA projects. */
  link?: string;
  techStack: string[];
  /** Wide (2-column) card in the bento grid. */
  featured?: boolean;
}

export type InterestIcon = 'camera' | 'compass' | 'gamepad-2';

/** Stable ids — must match the keys under `bento.interests` in locale files. */
export type InterestId = 'photography' | 'traveling' | 'videoGames';

export interface Interest {
  /** i18n key: name/description live in `locales/*.json` under `bento.interests.<id>` */
  id: InterestId;
  icon: InterestIcon;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: Skills;
  experience: JobExperience[];
  projects: Project[];
  education: Education[];
  interests: Interest[];
}

export const portfolioData: PortfolioData = {
  personalInfo: {
    name: 'Alex Bessmelcev',
    title: 'Senior Frontend Engineer',
    subTitle: 'Expert in Vue.js, React.js, TypeScript & Robust Frontend Architecture',
    experienceYears: 6,
    email: 'alexbessmelcev@gmail.com',
    telegram: '@Alex_Sage',
    github: 'https://github.com/AlexanderBess',
    linkedin: 'https://linkedin.com/in/alex-bessmelcev',
    website: 'https://alex-bes.vercel.app/',
    about:
      'Results-driven Senior Frontend Engineer with 6+ years of experience in designing, building, and scaling high-load web applications, enterprise dashboards, and Web3/P2P platforms. Expert in Vue.js (2/3), Nuxt.js, React.js, and Next.js, with a heavy focus on TypeScript and robust frontend architecture. Adept at accelerating development workflows using advanced AI-assisted tools (Claude, Gemini) for architecture validation and code analysis.',
  },
  skills: {
    frontend: [
      'Vue.js (Vue 2 & Vue 3)',
      'React.js',
      'Nuxt.js',
      'Next.js',
      'TypeScript',
      'JavaScript (ES6+)',
      'Three.js',
      'HTML5/SCSS',
    ],
    architecture: [
      'Frontend Architecture',
      'Component-driven Development',
      'Reusable UI Systems (Storybook)',
      'WebSockets',
      'Web3 (Ethers.js/Web3.js)',
      'Web Vitals Tuning & Performance Optimization',
    ],
    toolsAndAI: [
      'AI-assisted Development (Claude, Gemini, Cursor IDE)',
      'Prompt Engineering',
      'Figma',
      'Git',
      'Webpack/Vite',
      'Pinia/Redux',
    ],
  },
  experience: [
    {
      id: 'emcd',
      company: 'emcd.io',
      techStack: ['Vue 3', 'TypeScript', 'Composition API', 'WebSockets', 'Vite', 'Storybook', 'Figma', 'LLMs'],
    },
    {
      id: 'wsender',
      company: 'WSender',
      techStack: ['Next.js', 'React', 'TypeScript', 'Three.js', 'CSS Animations', 'Figma'],
    },
    {
      id: 'anketolog',
      company: 'Anketolog',
      techStack: ['Nuxt.js', 'Vue.js', 'SSR', 'SEO', 'WCAG', 'Semantic HTML', 'ARIA'],
    },
    {
      id: 'tenzor',
      company: 'Tenzor',
      techStack: ['Next.js', 'React', 'TypeScript', 'State Management', 'ERP Systems'],
    },
    {
      id: 'crypton',
      company: 'Crypton Studio',
      techStack: ['Nuxt.js', 'Vue.js', 'TypeScript', 'Web3.js', 'Ethers.js', 'dApps', 'Smart Contracts'],
    },
    {
      id: 'chrono',
      company: 'Chrono',
      techStack: ['JavaScript', 'JQuery', 'REST APIs', 'PHP',  'HTML5 Canvas', '3D Animations', 'NetCat CMS'],
    },
  ],
  projects: [
    {
      id: 'p2pMarketplace',
      link: 'https://emcd.io/crypto-p2p/',
      techStack: ['Vue 3', 'TypeScript', 'WebSockets', 'Pinia'],
      featured: true,
    },
    {
      id: 'cryptoCard',
      link: 'https://emcd.io/payment-card/',
      techStack: ['Vue 3', 'TypeScript', 'Pinia', 'Figma'],
    },
    {
      id: 'uiKit',
      techStack: ['Vue 3', 'Storybook', 'Figma'],
    },
    {
      id: 'surveyPlatform',
      link: 'https://anketolog.ru',
      techStack: ['Nuxt.js', 'SSR', 'WCAG'],
    },
    {
      id: 'terrainGenerator',
      link: 'https://github.com/AlexanderBess/ThreeJs',
      techStack: ['Vue 3', 'Three.js', 'Simplex Noise', 'Vite'],
      featured: true,
    },
  ],
  education: [
    {
      degree: "Bachelor's Degree in Information Systems and Technologies in Media Industry",
      institution: 'Siberian State University of Telecommunications and Information Sciences',
      location: 'Novosibirsk, Russia',
    },
    {
      degree: "Associate's Degree in Information Systems and Programming",
      institution: 'NSU Higher College of Informatics',
      location: 'Novosibirsk, Russia',
    },
  ],
  interests: [
    { id: 'photography', icon: 'camera' },
    { id: 'traveling', icon: 'compass' },
    { id: 'videoGames', icon: 'gamepad-2' },
  ],
};
