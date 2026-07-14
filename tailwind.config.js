/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  // Sync Tailwind's dark: variant with the existing data-theme mechanism
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        surface: {
          DEFAULT: '#0b0b0f',   // page background — premium dark, not pure black
          card: '#111116',      // card background
          raised: '#16161d',    // hovered / elevated card
        },
        stroke: {
          subtle: 'rgba(255, 255, 255, 0.05)',
          hover: 'rgba(255, 255, 255, 0.12)',
        },
        // Semantic, theme-aware tokens — resolve to CSS vars that flip with
        // [data-theme]. Use these in all new blocks so themes "just work".
        theme: {
          bg: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          card: 'var(--card-bg)',
          chip: 'var(--chip-bg)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          border: 'var(--card-border)',
          'border-hover': 'var(--card-border-hover)',
          accent: 'var(--accent-primary)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
