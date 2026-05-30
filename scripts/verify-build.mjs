#!/usr/bin/env node
/**
 * Post-build SEO/URL gate (runs against dist/). Fails the build on:
 *   1. a page whose <link rel=canonical> doesn't match its deployed path
 *   2. any invalid JSON-LD block
 *   3. URL drift — an INDEXABLE page missing from sitemap.xml, or a sitemap URL with no file
 *   4. a render-blocking cdn.tailwindcss.com reference creeping back in
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

  // collect indexable (not noindex) pages, excluding 404
  const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || '';
  if (!/noindex/.test(robots) && rel !== '/404.html') indexablePaths.add(rel);
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
if (fail.length) {
  console.error(`\n✗ verify-build FAILED (${fail.length}):`);
  for (const f of fail) console.error('  - ' + f);
  process.exit(1);
}
console.log('✓ verify-build passed: canonicals, JSON-LD, URL inventory, no render-blocking CDN.');
