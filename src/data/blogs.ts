// Blog catalog. Posts live at /blogs/<slug>.html (literal .html, per the URL contract).
// 6 are indexed (in sitemap); ai-love-calculator + face-beauty-test are noindex (excluded).
import { SITE_URL, SITE_NAME } from './site';
import type { Props as SeoProps } from '../components/Seo.astro';

export interface BlogPost {
  slug: string; // filename without .html
  title: string;
  description: string;
  keywords: string;
  datePublished: string;
  dateModified: string;
  image: string;
  author: string;
  noindex?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'iphone-photo-fixer-guide',
    title: 'How to Convert HEIC to JPG on PC Free (Offline & Private) - iPhone Photo Fixer Guide',
    description: 'Learn how to convert HEIC photos to JPG or PNG instantly on Windows PC using our free, offline, and private iPhone Photo Fixer tool.',
    keywords: 'heic to jpg, iphone photo fixer, convert heic, offline converter',
    datePublished: '2026-01-16T12:00:00+05:30',
    dateModified: '2026-01-16T12:00:00+05:30',
    image: `${SITE_URL}/assets/og-image.svg`,
    author: 'ni18',
  },
  {
    slug: 'markdown-to-word-guide',
    title: 'How to Convert Markdown & ChatGPT to Word for Free (2026 Guide)',
    description: 'Learn how to convert Markdown files and ChatGPT responses to formatted Microsoft Word (.docx) documents instantly using our free online tool.',
    keywords: 'markdown to word, chatgpt to word, docx converter, markdown guide',
    datePublished: '2026-01-11T12:00:00+05:30',
    dateModified: '2026-01-11T12:00:00+05:30',
    image: `${SITE_URL}/assets/og-image.svg`,
    author: 'ni18',
  },
  {
    slug: 'vtf-converter-guide',
    title: 'Mastering VTF Conversion: A Free Online Tool for Source Engine Modders',
    description: 'Convert images to Valve Texture Format (VTF) instantly with this free online tool. Perfect for CS:GO, TF2, and L4D2 modders.',
    keywords: 'vtf converter, valve texture format, source engine modding, texture tool',
    datePublished: '2025-12-31T12:00:00+05:30',
    dateModified: '2025-12-31T12:00:00+05:30',
    image: `${SITE_URL}/assets/og-image.svg`,
    author: 'ni18',
  },
  {
    slug: 'px-to-rem-converter',
    title: 'Why You Should Be Using REMs and How Our PX to REM Converter Can Help',
    description: 'Learn why REM units are essential for modern, responsive web design and how our free PX to REM Converter can streamline your workflow.',
    keywords: 'px to rem, rem converter, responsive design, css units',
    datePublished: '2025-11-23T15:14:00+05:30',
    dateModified: '2025-11-23T15:14:00+05:30',
    image: `${SITE_URL}/assets/blog/px-to-rem-converter-banner.png`,
    author: 'ni18',
  },
  {
    slug: 'json-visualizer-pro-tame-your-json-data',
    title: 'Introducing JSON Visualizer Pro: Tame Your JSON Data!',
    description: 'Discover JSON Visualizer Pro, a free online tool to easily view, format, minify, copy, and validate JSON data with features like tree view and undo/redo.',
    keywords: 'json visualizer, json formatter, json validator, developer tool',
    datePublished: '2025-04-12T13:14:00+05:30',
    dateModified: '2025-04-12T13:14:00+05:30',
    image: `${SITE_URL}/assets/blog/json-visualizer-pro-banner.png`,
    author: 'ni18',
  },
  {
    slug: 'edit-images-like-pro-free-online-tool',
    title: 'Edit Images Like a Pro for Free with This Amazing Online Tool in 2025',
    description: 'Learn how to edit images like a pro with a free, powerful online tool in 2025. Resize, crop, add text, and more—no downloads or costs. Perfect for beginners and pros alike!',
    keywords: 'image editor, free online tool, photo editing, resize image, crop image',
    datePublished: '2025-04-05T18:00:00+05:30',
    dateModified: '2025-04-05T18:00:00+05:30',
    image: `${SITE_URL}/assets/blog/edit-images-pro-tool-banner.png`,
    author: 'ni18',
  },
  // ---- noindex posts (excluded from sitemap) ----
  {
    slug: 'ai-love-calculator',
    title: 'AI Love Calculator: Test Your Compatibility Instant & Free',
    description: 'Check your love compatibility instantly with our AI Love Calculator. Free, fast, and accurate love test for couples and crushes. Try it now!',
    keywords: 'love calculator, ai love test, compatibility test, relationship score',
    datePublished: '2026-01-09T18:00:00+05:30',
    dateModified: '2026-01-09T18:00:00+05:30',
    image: `${SITE_URL}/assets/og-image.svg`,
    author: 'ni18',
    noindex: true,
  },
  {
    slug: 'face-beauty-test',
    title: 'Face Beauty Test: How Attractive Are You? Check Your Score with AI',
    description: 'Discover your facial attractiveness score with our AI Face Beauty Test. Learn how it works, its benefits, and what your results mean. Try it now!',
    keywords: 'beauty test, face score, ai attractiveness, facial analysis',
    datePublished: '2026-01-06T18:00:00+05:30',
    dateModified: '2026-01-06T18:00:00+05:30',
    image: `${SITE_URL}/assets/og-image.svg`,
    author: 'ni18',
    noindex: true,
  },
];

export function blogUrl(slug: string): string {
  return `${SITE_URL}/blogs/${slug}.html`;
}

export function indexedPosts(): BlogPost[] {
  return blogPosts.filter((p) => !p.noindex);
}

function blogPostingSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    image: post.image,
    url: blogUrl(post.slug),
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/icons/android-chrome-192x192.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': blogUrl(post.slug) },
  };
}

export function blogBreadcrumb(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blogs/` },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  };
}

/** Full SEO props for a blog post page (canonical .html, robots, OG article, BlogPosting + Breadcrumb). */
export function blogSeo(post: BlogPost): SeoProps {
  const url = blogUrl(post.slug);
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    canonical: url,
    robots: post.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1',
    og: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      image: post.image,
      siteName: SITE_NAME,
      locale: 'en_US',
    },
    twitter: { card: 'summary_large_image', url, title: post.title, description: post.description, image: post.image },
    jsonLd: [blogPostingSchema(post), blogBreadcrumb(post)],
  };
}
