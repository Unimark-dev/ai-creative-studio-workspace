#!/usr/bin/env node
// Renders exact text and original logo files over a generated image, at exact pixels.
// A real browser engine shapes Arabic and applies real fonts, which image models cannot do reliably.
//
// Usage: node compose.js spec.json
// Needs Node and Playwright with Chromium. All are preinstalled in the Higgsfield sandbox.
//
// spec.json:
// {
//   "width": 1080, "height": 1350, "output": "final.png",
//   "background": "https://... or local path",
//   "focus": "50% 50%",                       // optional: which part stays visible when the frame crops
//   "fonts": ["https://fonts.googleapis.com/css2?family=Cairo:wght@700&display=swap"],  // optional stylesheet URLs
//   "fontFiles": [{"family": "Brand Sans", "src": "brand.woff2", "weight": 700}],       // optional supplied files
//   "layers": [
//     {"type": "text", "text": "...", "x": 80, "y": 120, "w": 920, "font": "Cairo",
//      "size": 96, "weight": 700, "color": "#FFFFFF", "align": "right", "dir": "rtl", "lineHeight": 1.25},
//     {"type": "image", "src": "logo.png", "x": 80, "y": 1200, "w": 220}
//   ]
// }
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function loadPlaywright() {
  try { return require('playwright'); } catch (e) { /* fall through to the global install */ }
  return require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Local files become data URIs, so the page has no filesystem dependency.
function resolve(src, baseDir) {
  if (/^(https?:|data:)/.test(src)) return src;
  const file = path.resolve(baseDir, src);
  const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };
  const type = types[path.extname(file).toLowerCase()] || 'application/octet-stream';
  return `data:${type};base64,${fs.readFileSync(file).toString('base64')}`;
}

function layerHtml(l, baseDir) {
  const box = `position:absolute;left:${l.x}px;top:${l.y}px;${l.w ? `width:${l.w}px;` : ''}`;
  if (l.type === 'image') return `<img src="${resolve(l.src, baseDir)}" style="${box}${l.h ? `height:${l.h}px;` : 'height:auto;'}">`;
  if (l.type === 'text') {
    const css = [
      `font-family:'${l.font}',sans-serif`, `font-size:${l.size}px`, `font-weight:${l.weight || 400}`,
      `color:${l.color || '#000'}`, `text-align:${l.align || 'left'}`, `direction:${l.dir || 'ltr'}`,
      `line-height:${l.lineHeight || 1.2}`, `letter-spacing:${l.tracking || 0}`, 'white-space:pre-wrap',
    ].join(';');
    return `<div lang="${l.dir === 'rtl' ? 'ar' : 'en'}" style="${box}${css}">${esc(l.text)}</div>`;
  }
  throw new Error(`Unknown layer type: ${l.type}`);
}

(async () => {
  const specPath = process.argv[2];
  if (!specPath) { console.error('Usage: node compose.js spec.json'); process.exit(2); }
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const baseDir = path.dirname(path.resolve(specPath));
  const faces = (spec.fontFiles || []).map((f) => `@font-face{font-family:'${f.family}';src:url('${resolve(f.src, baseDir)}');font-weight:${f.weight || 400};}`).join('');
  const links = (spec.fonts || []).map((u) => `<link rel="stylesheet" href="${esc(u)}">`).join('');
  const bg = spec.background ? `<img src="${resolve(spec.background, baseDir)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${spec.focus || '50% 50%'}">` : '';
  const html = `<!doctype html><html><head><meta charset="utf-8">${links}<style>${faces}html,body{margin:0;width:${spec.width}px;height:${spec.height}px;overflow:hidden;position:relative}</style></head><body>${bg}${(spec.layers || []).map((l) => layerHtml(l, baseDir)).join('')}</body></html>`;

  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // A silent fallback font would be an off-brand ad that looks fine, so report what actually loaded.
  const report = await page.evaluate((families) => ({
    missingFonts: families.filter((f) => !document.fonts.check(`16px "${f}"`) || ![...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')),
    brokenImages: [...document.images].filter((i) => !i.naturalWidth).length,
    overflow: [...document.querySelectorAll('div,img')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.left < -1 || r.top < -1; }).length,
  }), [...new Set((spec.layers || []).filter((l) => l.type === 'text').map((l) => l.font))]);

  await page.screenshot({ path: spec.output || 'final.png' });
  await browser.close();
  console.log(JSON.stringify({ output: spec.output || 'final.png', width: spec.width, height: spec.height, ...report }));
  if (report.missingFonts.length || report.brokenImages || report.overflow) process.exit(3);
})().catch((e) => { console.error(e); process.exit(1); });
