// Generated sitemap — emits dist/sitemap.xml. Reproduces the locked 39-URL inventory with
// reciprocal hreflang clusters (user chose "fix reciprocity now"), excluding the noindex tools,
// the noindex blogs, and /es/blogs/. Single source of truth: tools.ts + blogs.ts + the locale
// clusters below. The P9 URL-inventory test asserts dist matches this set.
import { SITE_URL } from '../data/site';
import { sitemapTools, toolUrl } from '../data/tools';
import { indexedPosts, blogUrl } from '../data/blogs';

const LASTMOD = '2026-05-30';
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
  { loc: U('/blogs/'), alts: cluster({ en: '/blogs/', fr: '/fr/blogs/' }, '/blogs/') }, // /es/blogs/ excluded
  { loc: U('/fr/blogs/'), alts: cluster({ en: '/blogs/', fr: '/fr/blogs/' }, '/blogs/') },
];

// Translated tool clusters (px-to-rem ↔ px-a-rem-convertidor; rem-to-px ↔ rem-to-px-converter).
const pxCluster = (xd: string) => cluster({ en: '/tools/px-to-rem-converter/', es: '/es/tools/px-a-rem-convertidor/' }, xd);
const remCluster = (xd: string) => cluster({ en: '/tools/rem-to-px-converter/', es: '/es/tools/rem-to-px-converter/' }, xd);
const TRANSLATED_TOOL_ALTS: Record<string, Alt[]> = {
  'px-to-rem-converter': pxCluster('/tools/px-to-rem-converter/'),
  'rem-to-px-converter': remCluster('/tools/rem-to-px-converter/'),
};

const toolEntries: Entry[] = sitemapTools().map((t) => ({ loc: toolUrl(t.slug), alts: TRANSLATED_TOOL_ALTS[t.slug] }));

const esToolEntries: Entry[] = [
  { loc: U('/es/tools/px-a-rem-convertidor/'), alts: pxCluster('/tools/px-to-rem-converter/') },
  { loc: U('/es/tools/rem-to-px-converter/'), alts: remCluster('/tools/rem-to-px-converter/') },
];

// Blog posts: edit-images has a FR translation (reciprocal); the others stand alone.
const editImagesAlts = cluster(
  { en: '/blogs/edit-images-like-pro-free-online-tool.html', fr: '/fr/blogs/edit-images-like-pro-free-online-tool.html' },
  '/blogs/edit-images-like-pro-free-online-tool.html',
);
const blogEntries: Entry[] = indexedPosts().map((p) => ({
  loc: blogUrl(p.slug),
  alts: p.slug === 'edit-images-like-pro-free-online-tool' ? editImagesAlts : undefined,
}));
const frBlogEntries: Entry[] = [
  { loc: U('/fr/blogs/edit-images-like-pro-free-online-tool.html'), alts: editImagesAlts },
];

const all: Entry[] = [...landing, ...toolEntries, ...esToolEntries, ...blogEntries, ...frBlogEntries];

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
