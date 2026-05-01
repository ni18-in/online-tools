#!/usr/bin/env node
// Extract every <script type="application/ld+json"> ... </script> block
// from each HTML file and try JSON.parse(). Reports any parse failures.
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
const files = walk(root);
const re = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;

let fileCount = 0, blockCount = 0, errCount = 0;
const errors = [];

for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  let m, blocksInFile = 0, errsInFile = 0;
  while ((m = re.exec(text)) !== null) {
    blocksInFile++;
    blockCount++;
    try {
      JSON.parse(m[1].trim());
    } catch (e) {
      errsInFile++;
      errCount++;
      errors.push({ file: path.relative(root, f), block: blocksInFile, error: e.message.split('\n')[0] });
    }
  }
  if (blocksInFile > 0) fileCount++;
}

console.log(`Files with JSON-LD:  ${fileCount}`);
console.log(`Total JSON-LD blocks: ${blockCount}`);
console.log(`Parse errors:         ${errCount}`);
if (errors.length) {
  console.log('\nFAILURES:');
  for (const e of errors) console.log(`  ${e.file}  block#${e.block}  -- ${e.error}`);
  process.exit(1);
}
