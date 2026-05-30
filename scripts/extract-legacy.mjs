#!/usr/bin/env node
/**
 * Extract a legacy tool into verbatim Astro-ready partials, so migration preserves the
 * tool's markup + JS exactly (no hand-transcription) while isolating its CSS.
 *
 *   node scripts/extract-legacy.mjs <slug> [srcRelPath]
 *
 * Reads tools/<slug>/index.html (or the given path) and writes:
 *   src/components/legacy/tools/<slug>/body.html   — <body> markup, scripts/ads/nav-chrome removed
 *   src/components/legacy/tools/<slug>/styles.css  — concatenated <style>, every selector scoped to #tool-<slug>
 *   src/components/legacy/tools/<slug>/script.js    — the tool's functional inline JS (GA/ads removed)
 * and prints the SEO bits (title/description/keywords/canonical/og/JSON-LD) + external head deps
 * to wire into the page by hand.
 *
 * set:html does NOT execute injected <script>, so JS is split out and re-attached by the page
 * via <script is:inline set:html={...}> (which renders a real, executing <script> tag).
 */
import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

const slug = process.argv[2];
if (!slug) { console.error('usage: extract-legacy.mjs <slug> [srcRelPath] [category]'); process.exit(1); }
const srcRel = process.argv[3] || `tools/${slug}/index.html`;
const category = process.argv[4] || 'tools'; // 'tools' | 'blogs' — controls output dir + scope id
const root = path.resolve(import.meta.dirname, '..');
const src = fs.readFileSync(path.join(root, srcRel), 'utf8');

const scopeId = category === 'blogs' ? `#blog-${slug}` : `#tool-${slug}`;

// ---- sibling external assets (tools that ship their own style.css / script.js) ----
const srcDir = path.dirname(path.join(root, srcRel));
const readSibling = (name) => {
  const p = path.join(srcDir, name);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
};
const extCss = readSibling('style.css');
const extJs = readSibling('script.js');

// ---- CSS: concat inline <style> + any external style.css, scope every selector to the island ----
const styleBlocks =
  [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n') + '\n' + extCss;
let scopedCss = '';
if (styleBlocks.trim()) {
  const tree = postcss.parse(styleBlocks);
  tree.walkRules((rule) => {
    const p = rule.parent;
    if (p && p.type === 'atrule' && /keyframes/i.test(p.name)) return; // don't scope keyframe steps
    rule.selectors = rule.selectors.map((sel) => {
      const s = sel.trim();
      if (!s) return s;
      if (s === 'html' || s === 'body' || s === ':root') return scopeId;
      if (s.startsWith(':root')) return s.replace(/^:root/, scopeId);
      if (s.startsWith('html') || s.startsWith('body')) return scopeId + ' ' + s.replace(/^(html|body)\b/, '').trim();
      if (s.startsWith(scopeId)) return s;
      return `${scopeId} ${s}`;
    });
  });
  scopedCss = tree.toString();
}

// ---- body: strip <script>, adsbygoogle <ins>, and collect functional inline JS ----
const bodyMatch = src.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let body = bodyMatch ? bodyMatch[1] : src;

const inlineJs = [];
body = body.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, code) => {
  if (/\bsrc\s*=/.test(attrs)) return ''; // external scripts handled via head deps
  if (/adsbygoogle|googletagmanager|gtag\(/.test(code)) return ''; // ads / analytics
  inlineJs.push(code.trim());
  return '';
});
// remove AdSense <ins> units
body = body.replace(/<ins\b[^>]*class="[^"]*adsbygoogle[^"]*"[\s\S]*?<\/ins>/gi, '');

// blogs reuse the old site chrome (header/footer); keep only the <main>/<article> content.
if (category === 'blogs') {
  const m = body.match(/<main[^>]*>[\s\S]*?<\/main>/i) || body.match(/<article[^>]*>[\s\S]*?<\/article>/i);
  if (m) body = m[0];
}

// ---- external head deps (CDN libs/fonts) minus GA, ads, tailwind CDN, and the tool's own
//      relative script.js (which we inline below) ----
const headDeps = [];
for (const m of src.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/gi)) {
  const u = m[1];
  if (/googletagmanager|adsbygoogle|cdn\.tailwindcss\.com/.test(u)) continue;
  if (/^(\.\/)?script\.js(\?|$)/.test(u) || u.endsWith('/script.js')) continue; // inlined
  headDeps.push(m[0].trim());
}
if (extJs.trim()) inlineJs.push(extJs.trim());

// ---- write partials ----
const outDir = path.join(root, 'src/components/legacy', category, slug);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'body.html'), body.trim() + '\n');
fs.writeFileSync(path.join(outDir, 'styles.css'), scopedCss.trim() + '\n');
fs.writeFileSync(path.join(outDir, 'script.js'), inlineJs.join('\n\n') + '\n');

// ---- print SEO bits for hand-wiring ----
const pick = (re) => (src.match(re) || [])[1] || '';
console.log('=== ' + slug + ' ===');
console.log('title:', pick(/<title>([\s\S]*?)<\/title>/i).trim());
console.log('description:', pick(/<meta\s+name="description"\s+content="([^"]*)"/i));
console.log('keywords:', pick(/<meta\s+name="keywords"\s+content="([^"]*)"/i));
console.log('author:', pick(/<meta\s+name="author"\s+content="([^"]*)"/i));
console.log('canonical:', pick(/<link\s+rel="canonical"\s+href="([^"]*)"/i));
for (const m of src.matchAll(/<meta\s+property="(og:[^"]+)"\s+content="([^"]*)"/gi)) console.log(`${m[1]}:`, m[2]);
console.log('head deps:', headDeps.length ? headDeps.join('\n  ') : '(none)');
const ld = [...src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
console.log(`JSON-LD blocks: ${ld.length}`);
ld.forEach((m, i) => {
  try { console.log(`  [${i}] types: ` + JSON.stringify(JSON.parse(m[1])['@type'] || (JSON.parse(m[1])['@graph'] || []).map((g) => g['@type']))); }
  catch { console.log(`  [${i}] (parse error)`); }
});
console.log(`\nWrote: ${path.relative(root, outDir)}/{body.html, styles.css, script.js}`);
console.log(`body chars: ${body.length}, css chars: ${scopedCss.length}, js blocks: ${inlineJs.length}`);
