#!/usr/bin/env node
// Builds the Studio page by embedding the sandbox scripts into assets/studio.html.
// Usage: node build_studio.js output.html
const fs = require('fs');
const path = require('path');

const out = process.argv[2];
if (!out) { console.error('Usage: node build_studio.js output.html'); process.exit(2); }
const b64 = (name) => fs.readFileSync(path.join(__dirname, name)).toString('base64');
const html = fs.readFileSync(path.join(__dirname, '..', 'assets', 'studio.html'), 'utf8')
  .replace('__COMPOSE_B64__', () => b64('compose.js'))
  .replace('__READ_BRAND_B64__', () => b64('read_brand.js'));
fs.writeFileSync(out, html);
console.log(JSON.stringify({ output: out, bytes: Buffer.byteLength(html) }));
