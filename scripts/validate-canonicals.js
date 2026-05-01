#!/usr/bin/env node
// For every HTML page, verify rel="canonical" matches the file's deployed URL path.
const fs = require('fs');
const path = require('path');

function walk(d, acc = []) {
  for (const n of fs.readdirSync(d)) {
    if (n === '.git' || n === 'node_modules' || n === 'scripts') continue;
    const full = path.join(d, n);
    const s = fs.statSync(full);
    if (s.isDirectory()) walk(full, acc);
    else if (n.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const root = path.resolve(__dirname, '..');
const issues = [];
for (const f of walk(root)) {
  if (path.basename(f).startsWith('yandex_') || path.basename(f) === '404.html') continue;
  const t = fs.readFileSync(f, 'utf8');
  const m = t.match(/<link[^>]+rel="canonical"[^>]+href="https:\/\/online-tools\.ni18\.in([^"]+)"/);
  if (!m) { issues.push({ file: f, problem: 'no canonical' }); continue; }
  const canonical = m[1];
  let filePath = '/' + path.relative(root, f).split(path.sep).join('/');
  if (filePath.endsWith('/index.html')) filePath = filePath.replace(/index\.html$/, '');
  if (canonical !== filePath) {
    issues.push({ file: path.relative(root, f), canonical, expected: filePath });
  }
}
console.log('Canonical mismatches:', issues.length);
for (const i of issues) console.log(`  ${i.file}  canonical=${i.canonical}  expected=${i.expected}`);
