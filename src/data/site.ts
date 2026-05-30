// Site-wide constants — single source of truth for URL, analytics, and ads.
export const SITE_URL = 'https://online-tools.ni18.in';
export const SITE_NAME = 'Online Tools';

// Google Analytics 4 — standardized onto every page (was pasted per-page before).
export const GA_ID = 'G-RJER6TKTQ3';

// Google AdSense — one verified publisher + slot, applied consistently via <AdSlot>.
export const ADSENSE_CLIENT = 'ca-pub-9080750085757406';
export const ADSENSE_SLOT = '2773802330';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/og-image.svg`;
export const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1';

/** Join the site origin with a root-relative path → absolute URL. */
export function abs(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
