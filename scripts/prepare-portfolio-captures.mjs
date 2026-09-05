/** Import reviewed captures from the external raw archive. No pixels are drawn
 * or retouched here: every output is a crop/resize of an actual running app.
 *
 * npm run portfolio:images
 * PORTFOLIO_RAW_DIR=/path/to/raw node scripts/prepare-portfolio-captures.mjs
 *
 * New captures use this separate recipe so `npm run built:shots` remains the
 * live recapture workflow, while this batch reproduces the reviewed selection.
 */
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const input =
  process.env.PORTFOLIO_RAW_DIR || path.resolve(root, '../data/portfolio-assets/2026-09-05');
const output = path.join(root, 'src/assets');
const recipes = [
  [
    'portfolio-eyeshot-feature',
    'Eyeshot: a close view of the live Angle practice prompt and graph, from an actual pointer interaction over HTTPS. Cropped from the complete practice frame below.',
    {
      raw: 'eyeshot-practice-angle-1200x800.png',
      crop: { left: 275, top: 192, width: 650, height: 356 },
    },
  ],
  [
    'portfolio-eyeshot-practice',
    'Eyeshot: the complete 1200 × 800 practice frame, including header, tabs, Angle prompt, graph, timer and Lock in control. No account or leaderboard submission.',
    { raw: 'eyeshot-practice-angle-1200x800.png' },
  ],
  [
    'built-boundary',
    'Boundary 3.1: the actual guided first delivery. Controls and timing cue remain visible.',
  ],
  [
    'portfolio-boundary-running',
    'Boundary 3.1: the guided first single, using the real batting and running controls.',
  ],
  ['portfolio-boundary-phone', 'Boundary 3.1: real guided gameplay at a 390 × 844 viewport.'],
  [
    'portfolio-bring-home-thalassa',
    'Game-owner capture from the running pre-rebrand 1.4.0 playtest: Thalassa phase two, with a prepared level-20 character. The canonical rebrand preserves the game mechanics.',
    { raw: 'built-bring-something-home.png' },
  ],
  [
    'portfolio-bring-home-recap',
    'Game-owner capture from the same prepared-character 1.4.0 playtest, after a completed Elder expedition.',
  ],
  [
    'built-driftfall',
    'Driftfall 1.3.1: a fresh AJ pilot raises a barrier during an actual Frontier encounter.',
  ],
  [
    'portfolio-driftfall-flight',
    'Driftfall 1.3.1: a fresh AJ pilot approaches the Haven Reach station using free-cursor controls.',
  ],
  [
    'portfolio-driftfall-run',
    'Driftfall 1.3.1: the first Frontier encounter, reached through ordinary game controls.',
  ],
  [
    'built-beatlayer',
    'BeatLayer: generated 96 BPM guitar fixture, analysed and playing with synthesized drums.',
  ],
  ['built-filefossil', 'Filefossil: the built-in synthetic atlas.zip bytes, rendered by the app.'],
  [
    'built-roomtone',
    'Roomtone: the procedurally drawn demo bedroom, scanned into the Ember Eleven chord.',
  ],
  [
    'built-shipworthy',
    'Shipworthy: the live daily drop and default build profile, captured September 5, 2026.',
  ],
  ['built-lifetrack', 'LifeTrack: the app’s own sample data in its Today view.'],
  [
    'built-sleep-debt-ledger',
    'Sleep Debt Ledger: twelve prepared nights in a disposable browser context.',
  ],
  [
    'built-tab-graveyard',
    'Tab Graveyard: the live landing-page card generator using its 61-tab demo.',
  ],
  [
    'built-playlist-from-photo',
    'The running poster canvas, given AJ’s Saltline sunrise capture. The browser demo uses a fixed song list.',
  ],
  [
    'portfolio-playlist-interface',
    'The same Saltline sunrise poster in the complete Playlist From a Photo interface.',
  ],
  [
    'portfolio-ai-wrapped-card',
    'The running AI Wrapped share card, using its built-in synthetic chat export.',
  ],
];

await mkdir(output, { recursive: true });
const records = [];
for (const [key, source, options = {}] of recipes) {
  const filename = options.raw || `${key}.png`;
  const bytes = await readFile(path.join(input, filename));
  const metadata = await sharp(bytes).metadata();
  let image = sharp(bytes);
  if (options.crop) image = image.extract(options.crop);
  const result = await image
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toFile(path.join(output, `${key}.webp`));
  records.push({
    image: key,
    raw: filename,
    rawSha256: createHash('sha256').update(bytes).digest('hex'),
    source,
    sourceWidth: metadata.width,
    sourceHeight: metadata.height,
    width: result.width,
    height: result.height,
    ...(options.crop ? { crop: options.crop } : {}),
    processing: options.crop
      ? 'Documented detail crop; downscale only, WebP quality 90.'
      : 'Full captured frame; downscale only, WebP quality 90.',
  });
}
await writeFile(
  path.join(root, 'src/data/portfolio-photographs.json'),
  `${JSON.stringify(records, null, 2)}\n`,
);
console.log(`Prepared ${records.length} reviewed portfolio captures.`);
