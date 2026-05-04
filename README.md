# Portfolio - Alexander Bess

Modern Full-Stack developer portfolio built with Vue 3, TypeScript, and Tailwind CSS.

## 🚀 Technologies

- **Frontend**: Vue 3 (Composition API), TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **Internationalization**: Vue I18n
- **Tools**: ESLint, Prettier, PostCSS

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── components/          # Vue components
│   │   ├── Header.vue      # Navigation
│   │   ├── Hero.vue        # Hero section
│   │   ├── About.vue       # About section
│   │   ├── Projects.vue    # Projects section
│   │   └── Contact.vue     # Contact section
│   ├── views/              # Pages for routing
│   │   ├── Home.vue        # Home page
│   │   └── About.vue       # About page
│   ├── locales/            # Internationalization
│   │   ├── en.json         # English translations
│   │   └── ru.json         # Russian translations
│   ├── assets/             # Static assets
│   │   └── main.css        # Global styles
│   ├── App.vue             # Root component
│   ├── main.ts             # Entry point
│   └── i18n.ts             # i18n configuration
├── public/                 # Public files
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 🛠️ Installation & Setup

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview build**
   ```bash
   npm run preview
   ```

## 🎨 Features

- **Responsive Design**: Fully responsive interface for all devices
- **Modern Technologies**: Vue 3 with Composition API and TypeScript
- **Internationalization**: Multi-language support (English/Russian)
- **Animations**: Smooth transitions and animations using Tailwind CSS
- **SEO Optimized**: Proper HTML structure and meta tags
- **Fast Loading**: Optimized build with Vite

## 📝 Customization

### Changing Personal Information

1. **Name and Title**: Open `src/components/Hero.vue` and modify the text in h1 and p tags, or update the locale files
2. **Contact Info**: Open `src/components/Contact.vue` and update email, phone, and links
3. **Projects**: Open `src/components/Projects.vue` and modify the `projects` array
4. **Skills**: Open `src/components/About.vue` and update the `skills` array

### Adding New Languages

1. Create a new JSON file in `src/locales/` (e.g., `de.json` for German)
2. Copy the structure from `en.json` and translate the content
3. Update `src/i18n.ts` to include the new locale
4. Add language buttons to the Header component

### Color Scheme Customization

Open `tailwind.config.js` and modify colors in the `theme.extend.colors` section

## 🚀 Deployment

### Vercel
1. Connect your repository to Vercel
2. Set up environment variables (if needed)
3. Deploy the project

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### GitHub Pages
1. Build the project: `npm run build`
2. Upload contents of `dist` folder to `gh-pages` branch

## 🌍 Internationalization

This portfolio supports multiple languages to make it accessible to HR professionals worldwide:

- **English** (default) - For international opportunities
- **Russian** - For local opportunities

Language can be switched using the buttons in the navigation header. The preference is saved in localStorage and persists across sessions.

## 📄 License

MIT License

## 🤝 Contact

- Email: alexander.bess@example.com
- GitHub: @username
- LinkedIn: linkedin.com/in/username
