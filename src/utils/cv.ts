/**
 * CV/resume download helpers. Two static PDFs live in `public/cv/` (served
 * as-is by Vite at `/cv/*`), one per language. Every "Download CV" entry
 * point in the app (header, hero, AI twin chat) resolves the right file
 * from the current UI locale via these helpers, so they always stay in sync.
 */

export type CvLocale = 'en' | 'ru';

const CV_ASSET_PATH: Record<CvLocale, string> = {
  en: '/cv/en.pdf',
  ru: '/cv/ru.pdf',
};

const CV_DOWNLOAD_NAME: Record<CvLocale, string> = {
  en: 'Alex_Bessmelcev_CV_EN.pdf',
  ru: 'Alex_Bessmelcev_CV_RU.pdf',
};

function normalizeCvLocale(locale: string): CvLocale {
  return locale === 'ru' ? 'ru' : 'en';
}

/** Public URL of the CV PDF matching the given app locale. */
export function getCvUrl(locale: string): string {
  return CV_ASSET_PATH[normalizeCvLocale(locale)];
}

/** Friendly filename to suggest via the `download` attribute. */
export function getCvFilename(locale: string): string {
  return CV_DOWNLOAD_NAME[normalizeCvLocale(locale)];
}
