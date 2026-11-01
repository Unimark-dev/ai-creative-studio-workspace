#!/usr/bin/env node
// Reads a brand source in a real browser, so JavaScript-rendered guidelines work too.
// Usage: node read_brand.js https://brand.example.com
// Prints JSON: pages[{url,title,text}], colors, fonts, logos. Saves a screenshot of the first page as shot.png.
const path = require('path');
const { execSync } = require('child_process');

function loadPlaywright() {
  try { return require('playwright'); } catch (e) { /* fall through to the global install */ }
  return require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
}

const MAX_TEXT = 15000;
const TIME_BUDGET_MS = 70000;
// Pages most likely to hold brand rules are read first.
const rank = (u) => (/brand|guideline|identity/i.test(u) ? 0 : /logo|typeface|typography|font|colou?r/i.test(u) ? 1 : /image|photo|voice|tone/i.test(u) ? 2 : 3);

async function readPage(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 12000 }).catch(() => page.waitForTimeout(1500));
  // This function runs inside the page, so it cannot use anything from this file's scope.
  return page.evaluate(() => {
    const RELATED = /brand|guideline|identity|logo|colou?r|typo|typeface|font|image|photo|style|voice|tone/i;
    const count = {};
    const bump = (k) => { if (k) count[k] = (count[k] || 0) + 1; };
    const fonts = {};
    document.querySelectorAll('body, body *').forEach((e) => {
      const s = getComputedStyle(e);
      bump(s.color); bump(s.backgroundColor);
      const f = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      if (f) fonts[f] = (fonts[f] || 0) + 1;
    });
    const hex = (c) => {
      const m = c.match(/^rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)$/);
      if (!m || m[4] === '0') return null;
      return '#' + [m[1], m[2], m[3]].map((n) => (+n).toString(16).padStart(2, '0')).join('').toUpperCase();
    };
    const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map((x) => x[0]);
    return {
      title: document.title,
      text: document.body ? document.body.innerText : '',
      colors: [...new Set(top(count, 24).map(hex).filter(Boolean))].slice(0, 14),
      fonts: top(fonts, 6),
      logos: [...document.querySelectorAll('img[src], a[href]')]
        .map((e) => e.currentSrc || e.src || e.href || '')
        .filter((u) => /^https:/.test(u) && /logo|wordmark|brand-assets?/i.test(u) && /\.(svg|png|zip|webp)(\?|$)/i.test(u)).slice(0, 8),
      links: [...document.links].filter((a) => RELATED.test(a.href + ' ' + a.textContent)).map((a) => a.href.split('#')[0]),
    };
  });
}

(async () => {
  const start = new URL(process.argv[2]);
  if (start.protocol !== 'https:') throw new Error('Only https links are supported');
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const first = await readPage(page, start.href);
  await page.screenshot({ path: 'shot.png' }).catch(() => {});
  const related = [...new Set(first.links)].filter((u) => { try { return new URL(u).host === start.host && u !== start.href; } catch (e) { return false; } }).sort((a, b) => rank(a) - rank(b)).slice(0, 4);
  const pages = [{ url: start.href, title: first.title, text: first.text.slice(0, MAX_TEXT) }];
  const began = Date.now();
  for (const url of related) {
    if (Date.now() - began > TIME_BUDGET_MS) break;
    const r = await readPage(page, url).catch(() => null);
    if (r) pages.push({ url, title: r.title, text: r.text.slice(0, MAX_TEXT) });
  }
  await browser.close();
  console.log(JSON.stringify({ pages, colors: first.colors, fonts: first.fonts, logos: first.logos }));
})().catch((e) => { console.error(String(e && e.message || e)); process.exit(1); });
