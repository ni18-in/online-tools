// Generated sitemap — emits dist/sitemap.xml. Reproduces the locked 39-URL inventory with
// reciprocal hreflang clusters (user chose "fix reciprocity now"), excluding the noindex tools,
// the noindex blogs, and /es/blogs/. Single source of truth: tools.ts + blogs.ts + the locale
// clusters below. The P9 URL-inventory test asserts dist matches this set.
import { SITE_URL } from '../data/site';
import { sitemapTools, toolUrl, toolHreflang } from '../data/tools';
import { indexedPosts, blogUrl, blogHreflang } from '../data/blogs';

const LASTMOD = new Date().toISOString().split('T')[0];
const U = (p: string) => `${SITE_URL}${p}`;

interface Alt { hreflang: string; href: string }
interface Entry { loc: string; alts?: Alt[] }

// Reciprocal cluster helper: builds the alternates list for a set of locale→href pairs.
function cluster(pairs: Record<string, string>, xDefault: string): Alt[] {
  const alts: Alt[] = Object.entries(pairs).map(([hreflang, href]) => ({ hreflang, href: U(href) }));
  alts.push({ hreflang: 'x-default', href: U(xDefault) });
  return alts;
}

const landing: Entry[] = [
  { loc: U('/'), alts: cluster({ en: '/', es: '/es/', fr: '/fr/' }, '/') },
  { loc: U('/es/'), alts: cluster({ en: '/', es: '/es/', fr: '/fr/' }, '/') },
  { loc: U('/fr/'), alts: cluster({ en: '/', es: '/es/', fr: '/fr/' }, '/') },
  { loc: U('/tools/'), alts: cluster({ en: '/tools/', es: '/es/tools/', fr: '/fr/tools/' }, '/tools/') },
  { loc: U('/es/tools/'), alts: cluster({ en: '/tools/', es: '/es/tools/', fr: '/fr/tools/' }, '/tools/') },
  { loc: U('/fr/tools/'), alts: cluster({ en: '/tools/', es: '/es/tools/', fr: '/fr/tools/' }, '/tools/') },
  { loc: U('/about/'), alts: cluster({ en: '/about/', es: '/es/about/', fr: '/fr/about/' }, '/about/') },
  { loc: U('/es/about/'), alts: cluster({ en: '/about/', es: '/es/about/', fr: '/fr/about/' }, '/about/') },
  { loc: U('/fr/about/'), alts: cluster({ en: '/about/', es: '/es/about/', fr: '/fr/about/' }, '/about/') },
  { loc: U('/blogs/'), alts: cluster({ en: '/blogs/', es: '/es/blogs/', fr: '/fr/blogs/' }, '/blogs/') },
  { loc: U('/es/blogs/'), alts: cluster({ en: '/blogs/', es: '/es/blogs/', fr: '/fr/blogs/' }, '/blogs/') },
  { loc: U('/fr/blogs/'), alts: cluster({ en: '/blogs/', es: '/es/blogs/', fr: '/fr/blogs/' }, '/blogs/') },
];

const toolEntries: Entry[] = [];
const esToolEntries: Entry[] = [];
const frToolEntries: Entry[] = [];

sitemapTools().forEach((t) => {
  const alts = toolHreflang(t);
  
  // English entry
  toolEntries.push({
    loc: toolUrl(t.slug),
    alts,
  });

  // Spanish entry
  if (t.i18n?.es) {
    esToolEntries.push({
      loc: U(`/es/tools/${t.i18n.es}/`),
      alts,
    });
  }

  // French entry
  if (t.i18n?.fr) {
    frToolEntries.push({
      loc: U(`/fr/tools/${t.i18n.fr}/`),
      alts,
    });
  }
});

// Blog posts: dynamically generated with correct reciprocal alternates.
const blogEntries: Entry[] = indexedPosts().map((p) => ({
  loc: blogUrl(p.slug, 'en'),
  alts: blogHreflang(p),
}));

const esBlogEntries: Entry[] = indexedPosts()
  .filter((p) => p.i18n?.es)
  .map((p) => ({
    loc: blogUrl(p.slug, 'es'),
    alts: blogHreflang(p),
  }));

const frBlogEntries: Entry[] = indexedPosts()
  .filter((p) => p.i18n?.fr)
  .map((p) => ({
    loc: blogUrl(p.slug, 'fr'),
    alts: blogHreflang(p),
  }));

const all: Entry[] = [...landing, ...toolEntries, ...esToolEntries, ...frToolEntries, ...blogEntries, ...esBlogEntries, ...frBlogEntries];

function render(e: Entry): string {
  const alts = (e.alts ?? [])
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
    .join('\n');
  return `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${LASTMOD}</lastmod>${alts ? '\n' + alts : ''}\n  </url>`;
}

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${all.map(render).join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
