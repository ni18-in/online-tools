// Blog catalog. Posts live at /blogs/<slug>.html (literal .html, per the URL contract).
// 6 are indexed (in sitemap); ai-love-calculator + face-beauty-test are noindex (excluded).
import { SITE_URL, SITE_NAME } from './site';
import type { HreflangLink, Props as SeoProps } from '../components/Seo.astro';
import type { Locale } from './i18n';

export interface BlogPost {
  slug: string; // filename without .html
  title: string;
  description: string;
  keywords: string;
  category: string;
  datePublished: string;
  dateModified: string;
  image: string;
  author: string;
  noindex?: boolean;
  i18n?: {
    es?: {
      slug: string;
      title: string;
      description: string;
      keywords: string;
      category?: string;
    };
    fr?: {
      slug: string;
      title: string;
      description: string;
      keywords: string;
      category?: string;
    };
  };
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'iphone-photo-fixer-guide',
    title: 'How to Convert HEIC to JPG on PC Free (Offline & Private) - iPhone Photo Fixer Guide',
    description: 'Learn how to convert HEIC photos to JPG or PNG instantly on Windows PC using our free, offline, and private iPhone Photo Fixer tool.',
    keywords: 'heic to jpg, iphone photo fixer, convert heic, offline converter',
    category: 'Utility',
    datePublished: '2026-01-16T12:00:00+05:30',
    dateModified: '2026-01-16T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/iphone-photo-fixer-guide-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-iphone-photo-fixer',
        title: 'Cómo Convertir HEIC a JPG en PC Gratis (Local y Privado) - Guía',
        description: 'Aprende a convertir fotos HEIC a JPG o PNG al instante en Windows usando nuestra herramienta gratuita y local iPhone Photo Fixer.',
        keywords: 'heic a jpg, iphone photo fixer, convertir heic, convertidor offline',
        category: 'Utilidades'
      },
      fr: {
        slug: 'guide-iphone-photo-fixer',
        title: 'Comment Convertir HEIC en JPG sur PC Gratuitement (Hors Ligne & Privé)',
        description: 'Découvrez comment convertir vos photos HEIC en JPG ou PNG instantanément sur Windows avec notre outil gratuit et local iPhone Photo Fixer.',
        keywords: 'heic en jpg, iphone photo fixer, convertir heic, convertisseur hors ligne',
        category: 'Utilitaire'
      }
    }
  },
  {
    slug: 'markdown-to-word-guide',
    title: 'How to Convert Markdown & ChatGPT to Word for Free (2026 Guide)',
    description: 'Learn how to convert Markdown files and ChatGPT responses to formatted Microsoft Word (.docx) documents instantly using our free online tool.',
    keywords: 'markdown to word, chatgpt to word, docx converter, markdown guide',
    category: 'Productivity',
    datePublished: '2026-01-11T12:00:00+05:30',
    dateModified: '2026-01-11T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/markdown-to-word-guide-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-convertir-markdown-a-word',
        title: 'Cómo Convertir Markdown y ChatGPT a Word Gratis (Guía 2026)',
        description: 'Aprende a convertir archivos Markdown y respuestas de ChatGPT en documentos Word (.docx) formateados con nuestra herramienta gratuita.',
        keywords: 'markdown a word, chatgpt a word, convertidor docx, guia markdown',
        category: 'Productividad'
      },
      fr: {
        slug: 'guide-convertir-markdown-en-word',
        title: 'Comment Convertir Markdown et ChatGPT en Word Gratuitement (Guide 2026)',
        description: 'Apprenez à convertir des fichiers Markdown et des réponses ChatGPT en documents Microsoft Word (.docx) avec notre outil en ligne gratuit.',
        keywords: 'markdown en word, chatgpt en word, convertisseur docx, guide markdown',
        category: 'Productivité'
      }
    }
  },
  {
    slug: 'vtf-converter-guide',
    title: 'Mastering VTF Conversion: A Free Online Tool for Source Engine Modders',
    description: 'Convert images to Valve Texture Format (VTF) instantly with this free online tool. Perfect for CS:GO, TF2, and L4D2 modders.',
    keywords: 'vtf converter, valve texture format, source engine modding, texture tool',
    category: 'Development',
    datePublished: '2025-12-31T12:00:00+05:30',
    dateModified: '2025-12-31T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/vtf-converter-guide-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-convertidor-vtf',
        title: 'Dominando la Conversión VTF: Herramienta Online para Modders del Source Engine',
        description: 'Convierte imágenes a Valve Texture Format (VTF) al instante de forma gratuita. Ideal para modders de CS:GO, TF2 y L4D2.',
        keywords: 'convertidor vtf, valve texture format, modding source engine, texturas vtf',
        category: 'Desarrollo'
      },
      fr: {
        slug: 'guide-convertisseur-vtf',
        title: 'Maîtriser la Conversion VTF : Outil en Ligne pour Moddeurs Source Engine',
        description: 'Convertissez des images en Valve Texture Format (VTF) instantanément avec cet outil gratuit. Parfait pour les moddeurs de CS:GO, TF2 et L4D2.',
        keywords: 'convertisseur vtf, valve texture format, modding source engine, outil texture',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'px-to-rem-converter',
    title: 'Why You Should Be Using REMs and How Our PX to REM Converter Can Help',
    description: 'Learn why REM units are essential for modern, responsive web design and how our free PX to REM Converter can streamline your workflow.',
    keywords: 'px to rem, rem converter, responsive design, css units',
    category: 'Design',
    datePublished: '2025-11-23T15:14:00+05:30',
    dateModified: '2025-11-23T15:14:00+05:30',
    image: `${SITE_URL}/assets/blog/px-to-rem-converter-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'convertidor-px-a-rem-guia',
        title: 'Por Qué Deberías Usar REM y Cómo Nuestro Convertidor PX a REM Ayuda',
        description: 'Descubre por qué las unidades REM son esenciales para el diseño web adaptativo y cómo nuestro convertidor PX a REM optimiza tu flujo de trabajo.',
        keywords: 'px a rem, convertidor rem, diseno responsivo, unidades css',
        category: 'Diseño'
      },
      fr: {
        slug: 'convertisseur-px-en-rem-guide',
        title: 'Pourquoi Utiliser des REM et Comment Notre Convertisseur PX en REM Vous Aide',
        description: 'Découvrez pourquoi les unités REM sont essentielles pour le design web adaptatif et comment notre convertisseur PX en REM simplifie votre travail.',
        keywords: 'px en rem, convertisseur rem, design adaptatif, unites css',
        category: 'Design'
      }
    }
  },
  {
    slug: 'json-visualizer-pro-tame-your-json-data',
    title: 'Introducing JSON Visualizer Pro: Tame Your JSON Data!',
    description: 'Discover JSON Visualizer Pro, a free online tool to easily view, format, minify, copy, and validate JSON data with features like tree view and undo/redo.',
    keywords: 'json visualizer, json formatter, json validator, developer tool',
    category: 'Developer',
    datePublished: '2025-04-12T13:14:00+05:30',
    dateModified: '2025-04-12T13:14:00+05:30',
    image: `${SITE_URL}/assets/blog/json-visualizer-pro-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'json-visualizer-pro-doma-tus-datos-json',
        title: '¡Presentamos JSON Visualizer Pro: Doma tus Datos JSON!',
        description: 'Descubre JSON Visualizer Pro, una herramienta gratuita en línea para formatear, minificar, copiar y validar datos JSON fácilmente con vista de árbol.',
        keywords: 'visualizador json, formateador json, validador json, herramienta desarrollador',
        category: 'Programación'
      },
      fr: {
        slug: 'json-visualizer-pro-domptez-vos-donnees-json',
        title: 'Présentation de JSON Visualizer Pro : Domptez vos Données JSON !',
        description: 'Découvrez JSON Visualizer Pro, un outil gratuit en ligne pour visualiser, formater, minifier et valider des données JSON avec vue arborescente.',
        keywords: 'visualiseur json, formateur json, validateur json, outil developpement',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'edit-images-like-pro-free-online-tool',
    title: 'Edit Images Like a Pro for Free with This Amazing Online Tool in 2025',
    description: 'Learn how to edit images like a pro with a free, powerful online tool in 2025. Resize, crop, add text, and more—no downloads or costs. Perfect for beginners and pros alike!',
    keywords: 'image editor, free online tool, photo editing, resize image, crop image',
    category: 'Design',
    datePublished: '2025-04-05T18:00:00+05:30',
    dateModified: '2025-04-05T18:00:00+05:30',
    image: `${SITE_URL}/assets/blog/edit-images-pro-tool-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'editar-imagenes-como-un-profesional-herramienta-gratuita-online',
        title: 'Edita Imágenes como un Pro Gratis con esta Increíble Herramienta Online en 2025',
        description: 'Aprende a editar imágenes como un profesional con una herramienta gratuita en línea en 2025. Redimensiona, recorta y optimiza fotos sin descargas ni costos.',
        keywords: 'editor de imagenes, herramienta online gratis, edicion de fotos, redimensionar imagen, recortar imagen',
        category: 'Diseño'
      },
      fr: {
        slug: 'edit-images-like-pro-free-online-tool',
        title: 'Éditez des Images comme un Pro Gratuitement avec cet Outil en Ligne en 2025',
        description: 'Apprenez à éditer des images comme un pro avec un outil en ligne gratuit et puissant en 2025. Redimensionnez, recadrez, ajoutez du texte et plus encore.',
        keywords: 'editeur d images, outil en ligne gratuit, retouche photo, redimensionner image, recadrer image',
        category: 'Design'
      }
    }
  },
  // ---- noindex posts (excluded from sitemap) ----
  {
    slug: 'ai-love-calculator',
    title: 'AI Love Calculator: Test Your Compatibility Instant & Free',
    description: 'Check your love compatibility instantly with our AI Love Calculator. Free, fast, and accurate love test for couples and crushes. Try it now!',
    keywords: 'love calculator, ai love test, compatibility test, relationship score',
    category: 'Fun',
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
    category: 'Fun',
    datePublished: '2026-01-06T18:00:00+05:30',
    dateModified: '2026-01-06T18:00:00+05:30',
    image: `${SITE_URL}/assets/og-image.svg`,
    author: 'ni18',
    noindex: true,
    i18n: {
      fr: {
        slug: 'ai-beauty-test-free-online',
        title: 'Test de Beauté IA : Découvrez Votre Score et Sosie Célébrité Gratuitement',
        description: 'Découvrez votre score d’attractivité faciale avec notre Test de Beauté IA. Apprenez comment cela fonctionne et ce que vos résultats signifient.',
        keywords: 'test de beaute, score du visage, attractivite ia, analyse faciale',
        category: 'Fun'
      }
    }
  },
];

export function blogUrl(slug: string, lang: Locale = 'en'): string {
  if (lang === 'es') {
    const post = blogPosts.find((p) => p.slug === slug);
    const esSlug = post?.i18n?.es?.slug || slug;
    return `${SITE_URL}/es/blogs/${esSlug}.html`;
  }
  if (lang === 'fr') {
    const post = blogPosts.find((p) => p.slug === slug);
    const frSlug = post?.i18n?.fr?.slug || slug;
    return `${SITE_URL}/fr/blogs/${frSlug}.html`;
  }
  return `${SITE_URL}/blogs/${slug}.html`;
}

export function indexedPosts(): BlogPost[] {
  return blogPosts.filter((p) => !p.noindex);
}

function blogPostingSchema(post: BlogPost, lang: Locale = 'en') {
  const title = lang === 'es' ? post.i18n?.es?.title : lang === 'fr' ? post.i18n?.fr?.title : post.title;
  const description = lang === 'es' ? post.i18n?.es?.description : lang === 'fr' ? post.i18n?.fr?.description : post.description;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title || post.title,
    description: description || post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    image: post.image,
    url: blogUrl(post.slug, lang),
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/icons/android-chrome-192x192.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': blogUrl(post.slug, lang) },
  };
}

export function blogBreadcrumb(post: BlogPost, lang: Locale = 'en') {
  const homeLabel = lang === 'es' ? 'Inicio' : lang === 'fr' ? 'Accueil' : 'Home';
  const blogLabel = lang === 'es' ? 'Blog' : lang === 'fr' ? 'Blog' : 'Blog';
  const postTitle = lang === 'es' ? post.i18n?.es?.title : lang === 'fr' ? post.i18n?.fr?.title : post.title;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabel, item: `${SITE_URL}${lang === 'en' ? '' : '/' + lang}/` },
      { '@type': 'ListItem', position: 2, name: blogLabel, item: `${SITE_URL}${lang === 'en' ? '' : '/' + lang}/blogs/` },
      { '@type': 'ListItem', position: 3, name: postTitle || post.title },
    ],
  };
}

export function blogHreflang(post: BlogPost): HreflangLink[] {
  const links: HreflangLink[] = [{ hreflang: 'en', href: blogUrl(post.slug, 'en') }];
  if (post.i18n?.es) links.push({ hreflang: 'es', href: blogUrl(post.slug, 'es') });
  if (post.i18n?.fr) links.push({ hreflang: 'fr', href: blogUrl(post.slug, 'fr') });
  links.push({ hreflang: 'x-default', href: blogUrl(post.slug, 'en') });
  return links;
}

/** Full SEO props for a blog post page (canonical .html, robots, OG article, BlogPosting + Breadcrumb). */
export function blogSeo(post: BlogPost, lang: Locale = 'en'): SeoProps {
  const url = blogUrl(post.slug, lang);
  const title = lang === 'es' ? post.i18n?.es?.title : lang === 'fr' ? post.i18n?.fr?.title : post.title;
  const description = lang === 'es' ? post.i18n?.es?.description : lang === 'fr' ? post.i18n?.fr?.description : post.description;
  const keywords = lang === 'es' ? post.i18n?.es?.keywords : lang === 'fr' ? post.i18n?.fr?.keywords : post.keywords;
  const localeStr = lang === 'es' ? 'es_ES' : lang === 'fr' ? 'fr_FR' : 'en_US';
  return {
    title: title || post.title,
    description: description || post.description,
    keywords: keywords || post.keywords,
    canonical: url,
    robots: post.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1',
    hreflang: blogHreflang(post),
    og: {
      type: 'article',
      url,
      title: title || post.title,
      description: description || post.description,
      image: post.image,
      siteName: SITE_NAME,
      locale: localeStr,
    },
    twitter: { card: 'summary_large_image', url, title: title || post.title, description: description || post.description, image: post.image },
    jsonLd: [blogPostingSchema(post, lang), blogBreadcrumb(post, lang)],
  };
}
