// Locale registry. Localization is by directory (/, /es/, /fr/) — Astro mirrors the
// current structure. The smart language switcher in <SiteHeader> maps a page to its
// translated equivalent when one exists, else falls back to the locale home.
export type Locale = 'en' | 'es' | 'fr';

export const LOCALES: Locale[] = ['en', 'es', 'fr'];

export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

/** og:locale value per language. */
export const LOCALE_OG: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
};

/** Root path for each locale (English lives at the site root). */
export const LOCALE_BASE: Record<Locale, string> = {
  en: '/',
  es: '/es/',
  fr: '/fr/',
};

/** Navigation labels per locale. */
export const NAV_LABELS: Record<Locale, { home: string; tools: string; blogs: string; about: string }> = {
  en: { home: 'Home', tools: 'Tools', blogs: 'Blogs', about: 'About' },
  es: { home: 'Inicio', tools: 'Herramientas', blogs: 'Blog', about: 'Acerca de' },
  fr: { home: 'Accueil', tools: 'Outils', blogs: 'Blog', about: 'À propos' },
};
