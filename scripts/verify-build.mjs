#!/usr/bin/env node
/**
 * Post-build SEO/URL gate (runs against dist/). Fails the build on:
 *   1. a page whose <link rel=canonical> doesn't match its deployed path
 *   2. any invalid JSON-LD block
 *   3. URL drift — an INDEXABLE page missing from sitemap.xml, or a sitemap URL with no file
 *   4. a render-blocking cdn.tailwindcss.com reference creeping back in
 *   5. a page without exactly one <h1>
 *   6. an og:image / twitter:image pointing at a file that isn't in dist
 *   7. two indexable pages sharing a <title> or a meta description (duplicate-content signal)
 *   8. an empty main content region (a blank page — shipped twice before this check existed)
 *   9. a broken internal link, or an <img> without alt
 * Checks 5–9 exist because each one shipped a real defect that 1–4 did not catch.
 * Length/quality problems that don't break anything are reported as warnings.
 * This is the anti-deindexing guard: the dist URL set must equal the sitemap's.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const BASE = 'https://online-tools.ni18.in';
const fail = [];

function walk(d, acc = []) {
  for (const n of fs.readdirSync(d)) {
    const full = path.join(d, n);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (n.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const htmlFiles = walk(dist);

// Deployed path for a dist file: dir/index.html -> /dir/ ; foo.html -> /foo.html
function deployedPath(file) {
  let rel = '/' + path.relative(dist, file).split(path.sep).join('/');
  if (rel.endsWith('/index.html')) rel = rel.replace(/index\.html$/, '');
  return rel;
}

const indexablePaths = new Set();
let jsonLdBlocks = 0;
const warn = [];
const titles = new Map(); // title -> [paths]
const descriptions = new Map(); // description -> [paths]
const linkSources = new Map(); // internal href -> Set(pages linking it)

/** A dist-relative URL path resolves to a real file (page or asset). */
function resolves(urlPath) {
  const clean = urlPath.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return true; // relative/protocol-less — not our business
  const asFile = path.join(dist, clean.slice(1));
  if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) return true;
  const asDir = clean.endsWith('/') ? clean : clean + '/';
  return fs.existsSync(path.join(dist, asDir.slice(1), 'index.html'));
}

for (const f of htmlFiles) {
  const rel = deployedPath(f);
  // Search-engine verification files are intentionally canonical-less and not in the sitemap.
  if (path.basename(f).startsWith('yandex_')) continue;
  const html = fs.readFileSync(f, 'utf8');

  // (1) canonical
  const cm = html.match(/<link[^>]+rel="canonical"[^>]+href="https:\/\/online-tools\.ni18\.in([^"]*)"/);
  if (!cm) fail.push(`${rel}: no canonical`);
  else if (cm[1] !== rel) fail.push(`${rel}: canonical=${cm[1]} expected=${rel}`);

  // (2) JSON-LD parse
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    jsonLdBlocks++;
    try { JSON.parse(m[1]); } catch (e) { fail.push(`${rel}: invalid JSON-LD — ${e.message.split('\n')[0]}`); }
  }

  // (4) no Tailwind CDN
  if (html.includes('cdn.tailwindcss.com')) fail.push(`${rel}: render-blocking cdn.tailwindcss.com present`);

  // (5) exactly one <h1> — 17 tool pages had none and happy-new-year had two
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  if (h1s !== 1) fail.push(`${rel}: ${h1s} <h1> elements (need exactly 1)`);

  // (6) social images must exist on disk — 4 blog banners were referenced but never committed
  for (const m of html.matchAll(/(?:property|name)="(og:image|twitter:image)"[^>]*content="([^"]+)"/g)) {
    const u = m[2].startsWith(BASE) ? m[2].slice(BASE.length) : m[2];
    if (u.startsWith('/') && !resolves(u)) fail.push(`${rel}: ${m[1]} file missing — ${u}`);
  }

  // (8) non-empty main content — two fr blog pages shipped a blank <article>
  const region = html.match(/<(article|main)\b[^>]*>([\s\S]*?)<\/\1>/);
  if (region) {
    const text = region[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text.length < 40) fail.push(`${rel}: <${region[1]}> renders almost no text (${text.length} chars) — blank page?`);
  }

  // (9) alt text, and every local <img src> must resolve — two article heroes rendered a
  // broken image because only og:image was ever checked.
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=/.test(m[0])) fail.push(`${rel}: <img> without alt`);
    const src = (m[0].match(/\ssrc="([^"]+)"/) || [])[1];
    if (src && src.startsWith('/') && !resolves(src)) fail.push(`${rel}: <img src> file missing — ${src}`);
  }
  for (const m of html.matchAll(/<a\b[^>]*href="(\/[^"]*)"/g)) {
    if (!linkSources.has(m[1])) linkSources.set(m[1], new Set());
    linkSources.get(m[1]).add(rel);
  }

  // collect indexable (not noindex) pages, excluding 404
  const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || '';
  const isIndexable = !/noindex/.test(robots) && rel !== '/404.html';
  if (isIndexable) indexablePaths.add(rel);

  // (7) duplicate title/description, and length warnings — indexable pages only
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) fail.push(`${rel}: no <title>`);
  if (!desc) fail.push(`${rel}: no meta description`);
  if (isIndexable) {
    if (title) (titles.get(title) ?? titles.set(title, []).get(title)).push(rel);
    if (desc) (descriptions.get(desc) ?? descriptions.set(desc, []).get(desc)).push(rel);
    if (title && title.length > 65) warn.push(`${rel}: title ${title.length} chars (>65 truncates in SERPs)`);
    if (desc && desc.length > 165) warn.push(`${rel}: description ${desc.length} chars (>165 truncates in SERPs)`);
  }
}

// (7) duplicates across the indexable set
for (const [t, ps] of titles) {
  if (ps.length > 1) fail.push(`duplicate <title> on ${ps.length} pages ("${t.slice(0, 60)}"): ${ps.join(', ')}`);
}
for (const [d, ps] of descriptions) {
  if (ps.length > 1) fail.push(`duplicate meta description on ${ps.length} pages: ${ps.join(', ')}`);
}

// (9) broken internal links
for (const [href, from] of linkSources) {
  if (!resolves(href)) {
    const srcs = [...from].slice(0, 3).join(', ');
    fail.push(`broken internal link ${href} (linked from ${srcs}${from.size > 3 ? ` +${from.size - 3} more` : ''})`);
  }
}

// (3) URL drift vs sitemap
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapPaths = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(BASE, '')));

for (const p of sitemapPaths) {
  const file = p === '/' ? 'index.html' : p.endsWith('.html') ? p.slice(1) : p.slice(1) + 'index.html';
  if (!fs.existsSync(path.join(dist, file))) fail.push(`sitemap URL has no file: ${p}`);
}
for (const p of indexablePaths) {
  if (!sitemapPaths.has(p)) fail.push(`indexable page missing from sitemap (URL drift): ${p}`);
}

// ---- report ----
console.log(`Pages: ${htmlFiles.length} | JSON-LD blocks: ${jsonLdBlocks} | indexable: ${indexablePaths.size} | sitemap URLs: ${sitemapPaths.size}`);
if (warn.length) {
  console.log(`\n⚠ ${warn.length} warning(s) (not blocking):`);
  for (const w of warn) console.log('  - ' + w);
}
if (fail.length) {
  console.error(`\n✗ verify-build FAILED (${fail.length}):`);
  for (const f of fail) console.error('  - ' + f);
  process.exit(1);
}
console.log(
  '\n✓ verify-build passed: canonicals, JSON-LD, URL inventory, no render-blocking CDN,\n' +
    '  single h1 per page, social images present, no duplicate titles/descriptions,\n' +
    '  no blank pages, no broken internal links, every img has alt.'
);
