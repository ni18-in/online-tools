#!/usr/bin/env node
// Strip JS-style "// ..." comments from JSON-LD blocks (which are invalid JSON
// and cause Google's structured-data parser to reject the entire schema).
// Conservative: only matches whitespace-prefixed "// ..." (so URL "://" is safe),
// and only inside <script type="application/ld+json"> blocks.

const fs = require('fs');
const path = require('path');

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === 'scripts') continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const root = path.resolve(__dirname, '..');
const blockRe = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;

// 1) Full-line comments:    /^\s*\/\/.*$/m  -> remove the line
// 2) Trailing comments:     /\s+\/\/\s+[^\n]*$/m -> remove from " //" onwards
function stripComments(json) {
  return json
    .replace(/^[ \t]*\/\/[^\n]*\n/gm, '')      // whole-line comment
    .replace(/[ \t]+\/\/[ \t][^\n]*$/gm, '');   // trailing inline comment
}

let changed = 0, blocks = 0;
for (const f of walk(root)) {
  let text = fs.readFileSync(f, 'utf8');
  let dirty = false;
  text = text.replace(blockRe, (full, body) => {
    blocks++;
    const cleaned = stripComments(body);
    if (cleaned !== body) {
      // Verify the cleaned block actually parses now
      try {
        JSON.parse(cleaned.trim());
      } catch (e) {
        console.warn(`SKIP (still invalid after strip): ${path.relative(root, f)} -- ${e.message.split('\n')[0]}`);
        return full;
      }
      dirty = true;
      return `<script type="application/ld+json">${cleaned}</script>`;
    }
    return full;
  });
  if (dirty) {
    fs.writeFileSync(f, text);
    console.log(`FIXED: ${path.relative(root, f)}`);
    changed++;
  }
}
console.log(`\nScanned ${blocks} JSON-LD blocks; modified ${changed} files.`);
