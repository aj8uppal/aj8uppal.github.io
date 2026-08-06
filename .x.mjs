import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const ids = process.argv.slice(2);
const pal = process.env.PAL;
mkdirSync('/tmp/p6shots', { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
p.on('pageerror', (e) => errs.push(String(e)));
await p.goto('http://127.0.0.1:4321/?lab', { waitUntil: 'networkidle' });
if (pal) {
  await p.click(`[data-pal="${pal}"]`);
  await p.waitForTimeout(400);
}

for (const id of ids) {
  await p.click(`[data-hero="${id}"]`);
  await p.waitForTimeout(300);
  // sweep the pointer through the hero, then hold
  await p.mouse.move(300, 300, { steps: 8 });
  await p.mouse.move(1000, 500, { steps: 25 });
  await p.mouse.move(620, 340, { steps: 20 });
  await p.waitForTimeout(1400);
  const perf = await p.evaluate(() => {
    const q = window.__heroPerf;
    return q && { v: q.variant, el: q.elements, avg: q.avgDrawMs, max: q.maxDrawMs, fps: q.fps };
  });
  console.log(
    String(perf.v).padEnd(9),
    'elements',
    String(perf.el).padStart(5),
    '| avg',
    String(perf.avg).padStart(6) + 'ms',
    '| max',
    String(perf.max.toFixed(2)).padStart(5) + 'ms',
    '| fps',
    perf.fps
  );
  await p.screenshot({ path: `/tmp/p6shots/hero-${id}${pal ? '-' + pal : ''}.png` });
}
console.log('errors:', errs.length ? errs : 'none');
await b.close();
