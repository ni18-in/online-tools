// Single source of truth for the tool catalog. Drives the homepage grid, the /tools/
// listing, client-side search, per-page SEO + reciprocal hreflang, and the sitemap.
// Per-tool PAGE specifics (full JSON-LD, legacy body) are attached during P3–P5.
import { SITE_URL, DEFAULT_ROBOTS } from './site';
import type { HreflangLink } from '../components/Seo.astro';

export type ToolCategory = 'developer' | 'text' | 'media' | 'calculator' | 'fun';
export type SchemaType = 'WebApplication' | 'SoftwareApplication' | 'VideoGame';

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  developer: 'Developer',
  text: 'Text & Content',
  media: 'Media & Images',
  calculator: 'Calculators',
  fun: 'Fun & Games',
};

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  schemaType: SchemaType;
  /** JSON-LD applicationCategory (or 'Game' for VideoGame). */
  applicationCategory?: string;
  /** Homepage ItemList rating (featured tools only). */
  rating?: { value: number; count: number };
  /** Per-page robots; defaults to DEFAULT_ROBOTS. */
  robots?: string;
  /** Included in sitemap.xml. Defaults true; false for the noindex tools. */
  inSitemap?: boolean;
  /** Translated slugs where a localized page exists (drives reciprocal hreflang). */
  i18n?: { es?: string; fr?: string };
}

const NOINDEX = 'noindex, follow';

export const tools: Tool[] = [
  {
    slug: 'free-online-image-utility-tool',
    name: 'Free Online Image Utility Tool',
    description: 'A browser-based image tool that allows you to resize, compress, convert, and optimize images online for free.',
    category: 'media',
    schemaType: 'WebApplication',
    applicationCategory: 'MultimediaApplication',
    rating: { value: 4.6, count: 40 },
  },
  {
    slug: 'all-in-one-text-analyzer',
    name: 'All-in-One Text Analyzer',
    description: 'Analyze your text instantly: Get word count, character count, sentence count, paragraph count, estimated reading time, and keyword frequency. Free online tool.',
    category: 'text',
    schemaType: 'WebApplication',
    applicationCategory: 'UtilitiesApplication',
    rating: { value: 4.8, count: 20 },
  },
  {
    slug: 'json-visualizer-pro',
    name: 'JSON Visualizer Pro',
    description: 'Discover JSON Visualizer Pro, a free online tool to easily view, format, minify, copy, and validate JSON data with features like tree view and undo/redo.',
    category: 'developer',
    schemaType: 'WebApplication',
    applicationCategory: 'UtilitiesApplication',
    rating: { value: 4.6, count: 20 },
    // Historically the only tool with the bare robots value — preserved exactly.
    robots: 'index, follow',
  },
  {
    slug: 'json-comparison-tool',
    name: 'JSON Comparison Online - Diff Tool & Validator',
    description: 'Free online tool to compare, diff, validate, and beautify two JSON objects side-by-side. Visualize differences with color highlighting. No server-side processing.',
    category: 'developer',
    schemaType: 'WebApplication',
    applicationCategory: 'UtilitiesApplication',
    rating: { value: 4.8, count: 4 },
  },
  {
    slug: 'ai-beauty-test',
    name: 'AI Beauty Test',
    description: 'Get a free AI beauty score based on facial features, find your celebrity look-alike, analyze face parts, and compare photos with the AI Beauty Test tool. Fun, interactive, and insightful!',
    category: 'fun',
    schemaType: 'WebApplication',
    applicationCategory: 'EntertainmentApplication',
    robots: NOINDEX,
    inSitemap: false,
    i18n: { es: 'ai-beauty-test', fr: 'ai-beauty-test' },
  },
  {
    slug: 'guess-the-logo',
    name: 'Guess the Logo - Fun Brand Quiz Game',
    description: 'Test your brand knowledge with Guess the Logo! A fun and addictive quiz game with multiple modes, difficulty levels, and endless logo challenges. Play now in your browser!',
    category: 'fun',
    schemaType: 'VideoGame',
    applicationCategory: 'Game',
    rating: { value: 4.6, count: 67 },
  },
  {
    slug: 'online-text-compare',
    name: 'Online Text Compare',
    description: 'A free online tool to compare two pieces of text and highlight the differences. Supports multiple languages, dark mode, and provides clear visual diffs for added, removed, and common lines.',
    category: 'text',
    schemaType: 'WebApplication',
    applicationCategory: 'UtilitiesApplication',
    rating: { value: 4.6, count: 45 },
  },
  {
    slug: 'screen-recorder-pro',
    name: 'Screen Recorder Pro',
    description: 'Screen Recorder Pro allows users to record their screen (entire screen, application window, or browser tab) with optional audio directly in the browser. All processing is done client-side, ensuring privacy. Recordings can be downloaded in .webm format.',
    category: 'media',
    schemaType: 'WebApplication',
    applicationCategory: 'UtilitiesApplication',
    rating: { value: 4.7, count: 11 },
  },
  {
    slug: 'px-to-rem-converter',
    name: 'PX to REM Converter',
    description: 'Free online PX to REM converter tool for developers and designers. Instantly convert pixel values to REM units with a customizable base font size, following Material Design principles.',
    category: 'developer',
    schemaType: 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    rating: { value: 4.7, count: 10 },
    i18n: { es: 'px-a-rem-convertidor' },
  },
  {
    slug: 'ai-love-calculator',
    name: 'AI Love Calculator',
    description: 'Free online AI Love Calculator tool for entertainment purposes. Discover your love potential with our "advanced" AI!',
    category: 'fun',
    schemaType: 'WebApplication',
    applicationCategory: 'EntertainmentApplication',
    robots: NOINDEX,
    inSitemap: false,
  },
  {
    slug: 'next-gen-gst-reforms',
    name: 'Next Gen GST Calculator',
    description: 'Free online Next Gen GST Calculator tool for understanding and calculating GST based on the new reforms.',
    category: 'calculator',
    schemaType: 'WebApplication',
    applicationCategory: 'FinanceApplication',
  },
  {
    slug: 'basic-authentication-header-generator',
    name: 'Basic Authentication Header Generator',
    description: 'Free online Basic Authentication Header Generator tool for generating HTTP headers.',
    category: 'developer',
    schemaType: 'WebApplication',
    applicationCategory: 'DeveloperApplication',
  },
  {
    slug: 'mh-meter-price-calculator',
    name: 'MH Meter Price Calculator',
    description: 'Calculate Auto Rickshaw, Black & Yellow Taxi, and Cool Cab fares in Mumbai & Maharashtra. Official 2025 Tariff rates (MMRTA).',
    category: 'calculator',
    schemaType: 'WebApplication',
    applicationCategory: 'TravelApplication',
    rating: { value: 4.8, count: 25 },
  },
  {
    slug: 'vtf-converter',
    name: 'VTF Converter',
    description: 'Convert images (PNG, JPG) to VTF (Valve Texture Format) online for free. Client-side, secure, and fast.',
    category: 'media',
    schemaType: 'WebApplication',
    applicationCategory: 'MultimediaApplication',
    rating: { value: 5, count: 1 },
  },
  {
    slug: 'advance-epoch-converter',
    name: 'Advance Epoch & Unix Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. Supports seconds, milliseconds, microseconds, nanoseconds, and timezones.',
    category: 'developer',
    schemaType: 'WebApplication',
    applicationCategory: 'DeveloperApplication',
  },
  {
    slug: 'markdown-to-word',
    name: 'Markdown to Word Converter',
    description: 'Convert Markdown text to Microsoft Word (.docx) documents instantly. Free online tool, preserves formatting, headers, lists, and more.',
    category: 'text',
    schemaType: 'WebApplication',
    applicationCategory: 'UtilitiesApplication',
  },
  {
    slug: 'subtitle-resync-tool',
    name: 'Subtitle Resync Tool',
    description: 'A simple utility where users upload a .SRT subtitle file and a video, then press "Shift +1s" or "Shift -0.5s" to fix audio sync issues.',
    category: 'media',
    schemaType: 'WebApplication',
    applicationCategory: 'MultimediaApplication',
  },
  {
    slug: 'iphone-photo-fixer',
    name: 'iPhone Photo Fixer',
    description: 'Convert HEIC images to JPG or PNG instantly. Batch converter, runs offline, no upload required. Secure and free.',
    category: 'media',
    schemaType: 'WebApplication',
    applicationCategory: 'MultimediaApplication',
  },
  // ---- tools not on the homepage grid, but with their own pages + sitemap entries ----
  {
    slug: 'grade-calculator',
    name: 'Universal Grade Calculator',
    description: 'The fastest and easiest universal weighted grade calculator. Define categories, add assignments, and get your grade instantly.',
    category: 'calculator',
    schemaType: 'WebApplication',
    applicationCategory: 'EducationalApplication',
  },
  {
    slug: 'rem-to-px-converter',
    name: 'REM to PX Converter',
    description: 'A simple, free online REM to PX converter for developers and designers. Instantly convert REM units to pixel values.',
    category: 'developer',
    schemaType: 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    i18n: { es: 'rem-to-px-converter' },
  },
  {
    slug: 'happy-new-year',
    name: 'Happy New Year Wish Generator',
    description: 'Create and share personalized Happy New Year greetings and wishes online — free and instant.',
    category: 'fun',
    schemaType: 'WebApplication',
    applicationCategory: 'EntertainmentApplication',
  },
];

export interface ExternalCard {
  external: string;
  name: string;
  description: string;
}

// Homepage grid order — reproduces the current site exactly (19 cards: 18 tools + 1 off-site).
export const homepageGrid: (string | ExternalCard)[] = [
  'free-online-image-utility-tool',
  'all-in-one-text-analyzer',
  'json-visualizer-pro',
  'json-comparison-tool',
  'ai-beauty-test',
  'guess-the-logo',
  'online-text-compare',
  'screen-recorder-pro',
  'px-to-rem-converter',
  'ai-love-calculator',
  'next-gen-gst-reforms',
  'basic-authentication-header-generator',
  {
    external: 'https://tools.ni18.in/p/majhi-ladki-bahin-yojana-kyc-status.html',
    name: 'Majhi Ladki Bahin Yojana - KYC Status Checker',
    description: 'Majhi Ladki Bahin Yojana - KYC Status Checker - Easy way to see status.',
  },
  'mh-meter-price-calculator',
  'vtf-converter',
  'advance-epoch-converter',
  'markdown-to-word',
  'subtitle-resync-tool',
  'iphone-photo-fixer',
];

// Order of tools shown in the homepage CollectionPage > ItemList JSON-LD (the curated 10).
export const homepageItemListOrder = [
  'free-online-image-utility-tool',
  'all-in-one-text-analyzer',
  'json-visualizer-pro',
  'json-comparison-tool',
  'guess-the-logo',
  'online-text-compare',
  'screen-recorder-pro',
  'px-to-rem-converter',
  'mh-meter-price-calculator',
  'vtf-converter',
];

// ---------- helpers ----------
const bySlug = new Map(tools.map((t) => [t.slug, t]));

export function getTool(slug: string): Tool | undefined {
  return bySlug.get(slug);
}

export function toolUrl(slug: string): string {
  return `${SITE_URL}/tools/${slug}/`;
}

export function toolRobots(tool: Tool): string {
  return tool.robots ?? DEFAULT_ROBOTS;
}

/** Tools that get their own page + sitemap entry (all of them) — sitemap inclusion via inSitemap. */
export function sitemapTools(): Tool[] {
  return tools.filter((t) => t.inSitemap !== false);
}

/**
 * Reciprocal hreflang set for an English tool page. en + x-default always; es/fr added when a
 * translation exists (user chose "fix reciprocity now").
 */
export function toolHreflang(tool: Tool): HreflangLink[] {
  const links: HreflangLink[] = [{ hreflang: 'en', href: toolUrl(tool.slug) }];
  if (tool.i18n?.es) links.push({ hreflang: 'es', href: `${SITE_URL}/es/tools/${tool.i18n.es}/` });
  if (tool.i18n?.fr) links.push({ hreflang: 'fr', href: `${SITE_URL}/fr/tools/${tool.i18n.fr}/` });
  links.push({ hreflang: 'x-default', href: toolUrl(tool.slug) });
  return links;
}

/** Builds the JSON-LD `item` object for a tool in the homepage ItemList. */
export function homepageItemListItem(tool: Tool) {
  return {
    '@type': tool.schemaType,
    name: tool.name,
    description: tool.description,
    url: toolUrl(tool.slug),
    applicationCategory: tool.applicationCategory,
    operatingSystem: 'Browser',
    offers: { '@type': 'Offer', price: '0.00', priceCurrency: 'USD' },
    ...(tool.rating
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: tool.rating.value, ratingCount: tool.rating.count } }
      : {}),
  };
}
