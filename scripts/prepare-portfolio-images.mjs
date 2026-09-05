/**
 * Import the user-supplied Saltline viewport captures without changing their
 * source pixels. The crop removes the 67px browser/game header and the 214px
 * in-game HUD while preserving the complete boat and wake/reflection.
 *
 * Example:
 *   node scripts/prepare-portfolio-images.mjs \
 *     --input-dir /path/to/data/portfolio-assets/saltline \
 *     --output-dir src/assets
 *
 * Inputs are named saltline-{moonlight,sunrise,morning}.png. The output files
 * use unique portfolio-saltline-* names so existing assets cannot be replaced
 * accidentally. The defaults point at the repo's external asset convention;
 * use --input-dir/--output-dir for a scratch import or another checkout.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const inputDir = option('--input-dir', path.resolve(ROOT, '../data/portfolio-assets/saltline'));
const outputDir = option('--output-dir', path.resolve(ROOT, 'src/assets'));
const crop = { left: 0, top: 67, width: 3456, height: 1953 };
const scenes = ['moonlight', 'sunrise', 'morning'];

await mkdir(outputDir, { recursive: true });
const records = [];
for (const scene of scenes) {
  const input = path.join(inputDir, `saltline-${scene}.png`);
  const output = path.join(outputDir, `portfolio-saltline-${scene}.webp`);
  const metadata = await sharp(input).metadata();
  if (metadata.width !== 3456 || metadata.height !== 2234) {
    throw new Error(`${input}: expected 3456x2234, got ${metadata.width}x${metadata.height}`);
  }
  await sharp(input).extract(crop).webp({ quality: 88, effort: 6 }).toFile(output);
  records.push({
    scene,
    input: path.basename(input),
    output: path.basename(output),
    sourceSha256: createHash('sha256')
      .update(await readFile(input))
      .digest('hex'),
    source: `${metadata.width}x${metadata.height} ${metadata.format}`,
    crop,
  });
}
const report = option('--report', path.join(outputDir, 'portfolio-saltline-import.json'));
await writeFile(
  report,
  `${JSON.stringify({ provenance: 'User-supplied Saltline captures; source PNG pixels are not modified.', records }, null, 2)}\n`,
);
console.log(
  `Prepared ${records.length} Saltline photographs; crop ${crop.width} × ${crop.height}.`,
);
