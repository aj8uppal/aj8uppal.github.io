#!/usr/bin/env node
/**
 * Fails if a Media Queries Level 4 range query reaches the source or the build.
 *
 * `@media (width <= 620px)` reads better than `@media (max-width: 620px)` and
 * means the same thing on any browser that understands it. On one that does
 * not - iOS Safari before 16.4, March 2023 - the query fails to parse and the
 * browser throws away the entire block. Every mobile breakpoint on this site
 * was written in the range form, so those phones were served the desktop
 * layout with no adaptation at all: rails beside content at 430px, label/value
 * grids overprinting, sideways scroll. It shipped, and it took a real device to
 * find, because every engine we test in supports the syntax.
 *
 * The same failure applies to `matchMedia('(width <= 620px)')`, which quietly
 * returns matches:false forever, so the folds and swipe rows never engaged
 * either.
 *
 * Checked in `src/` (what someone will edit) and in `dist/` (what actually
 * ships, in case a transformer ever puts it back).
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/* Inside a media query only. A bare `r.width > 0` in TypeScript is arithmetic,
   not a breakpoint, so the match has to be anchored to a length unit. */
const RANGE = /\(\s*(?:width|height|inline-size|block-size)\s*[<>]=?\s*[\d.]+(?:px|em|rem)/i;

const EXT = /\.(css|astro|tsx|ts|js|mjs|html)$/;
const SKIP = new Set(['node_modules', '.git', '.astro']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(name)) out.push(p);
  }
  return out;
}

const roots = ['src', 'dist'].filter((d) => existsSync(d));
const bad = [];

for (const root of roots) {
  for (const file of walk(root)) {
    /* Comments keep their line count so the report still points somewhere
       real, but lose their content: the note explaining this rule quotes the
       syntax it bans, and so will the next one. */
    const text = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (c) =>
      c.replace(/[^\n]/g, ' '),
    );
    if (!RANGE.test(text)) continue;
    text.split('\n').forEach((line, i) => {
      /* Minified CSS is one long line, so report the query rather than the
         column and let the source copy carry the line number. */
      let m;
      const all = new RegExp(RANGE.source, 'gi');
      while ((m = all.exec(line))) bad.push(`${file}:${i + 1}  ${m[0]}...)`);
    });
  }
}

if (bad.length) {
  console.error(
    `\nRange-syntax media queries found (${bad.length}). These are dropped whole by\n` +
      `iOS Safari before 16.4, which serves those phones an unstyled desktop layout.\n` +
      `Write min-width:/max-width: instead - see the note at the top of global.css.\n`,
  );
  for (const b of bad) console.error(`  ${b}`);
  process.exit(1);
}

console.log(`check-mq: no range-syntax media queries in ${roots.join(', ')}`);
