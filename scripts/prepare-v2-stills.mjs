/**
 * Derives the /v2/ world pages' screenshots from the raw captures in the
 * ignored data/v2-captures/<slug>/still-*.png (1920×1080, real frames from the
 * running games, written when each game's footage was captured).
 *
 * Writes src/assets/v2-<slug>-<n>.webp, numbered in filename order; Astro's
 * image pipeline makes the responsive sizes from there. Idempotent:
 * `node scripts/prepare-v2-stills.mjs [slug ...]`.
 */
import { readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const RAW = path.join(ROOT, 'data/v2-captures');
const OUT = path.join(ROOT, 'src/assets');
const only = process.argv.slice(2);

for (const slug of (await readdir(RAW)).sort()) {
  if (only.length && !only.includes(slug)) continue;
  const dir = path.join(RAW, slug);
  if (!existsSync(dir)) continue;
  const stills = (await readdir(dir)).filter((f) => /^still-.*\.png$/.test(f)).sort();
  let n = 0;
  for (const file of stills) {
    n++;
    const buf = await sharp(path.join(dir, file))
      .resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 82, effort: 6 })
      .toBuffer();
    const name = `v2-${slug}-${n}.webp`;
    await writeFile(path.join(OUT, name), buf);
    console.log(name.padEnd(34), file.padEnd(34), (buf.length / 1024).toFixed(0).padStart(5), 'KB');
  }
}
