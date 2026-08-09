/**
 * Turns the raw capture batch into build-ready intermediates under src/assets/.
 *
 * The source PNGs are 3-9MB screen captures and live outside the repo. They are not
 * usable as-is for two reasons: the game frames carry black letterbox bars from the
 * capture window, and every saltline frame has the developer panel open down the left
 * edge. This script crops both away, downscales to the largest size any layout slot
 * actually needs, and writes lossy-but-clean WebP. Astro's sharp pipeline takes it from
 * there and emits the responsive AVIF/WebP the page ships.
 *
 * Idempotent. Re-run with `npm run images` after changing a crop.
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = '/Users/ajuppal/personal/firstmate-aj8uppal/data/portfolio-assets';
const OUT = path.resolve(import.meta.dirname, '../src/assets');
/* Written by this script and only by this script. The page reads it to answer
   "what was cut off this" without a second copy of the recipe to keep in step. */
const MANIFEST = path.resolve(import.meta.dirname, '../src/data/captures.json');

/**
 * Measured, not guessed:
 *   Ember Wilds frames are 3456x2160 with a 120px black bar top and bottom. The real
 *   viewport is 3456x1920 (1.8:1).
 *   saltline frames are 3456x2234 with a 75px bar at the top only. The developer panel's
 *   right edge sits at x=621, so cropping from x=680 clears it with margin.
 */
const EMBER = { left: 0, top: 120, width: 3456, height: 1920 };
const SALT_CLEAN = { left: 680, top: 75, width: 2776, height: 1562 }; // 16:9, panel removed
const SALT_FULL = { left: 0, top: 75, width: 3456, height: 2159 }; // panel kept, on purpose
/**
 * The card lead slot is a 2.15:1 band. Cropping a 16:9 frame down to it with
 * object-fit would eat the top of the Ghostgale status panel, which is real
 * product UI and part of the evidence. So the band is composed here instead:
 * the developer strip goes, the whole right-hand HUD column stays, and the
 * height comes off the bottom, where there is nothing but water and chrome.
 */
const SALT_LEAD = { left: 680, top: 75, width: 2776, height: 1291 };
/**
 * The Rendezvous dashboard capture was framed for a portfolio slide: a 14 to
 * 26px band of black-and-white speckle all the way round it, which is nobody's
 * UI. 28 off every edge clears the widest of it and takes nothing but the
 * application's own background with it. The two theme captures next to it were
 * taken flush and are not cropped at all.
 */
const RZ_FRAME = { left: 28, top: 28, width: 2864, height: 1784 };

/**
 * What each crop takes out, in the words the comments above already use.
 *
 * Keyed by the box itself so a crop cannot acquire a description that belongs
 * to a different crop. This is the only part of the recipe the page shows, and
 * it is the part a reader is entitled to: an edited capture that will not say
 * what was edited off it is a claim, not evidence.
 */
const OMITS = new Map([
  [EMBER, 'the black letterbox bars the capture window puts on the top and bottom'],
  [SALT_CLEAN, 'the developer panel down the left edge, and the bar above the viewport'],
  [SALT_LEAD, 'the developer panel down the left edge, the top bar, and open water below the hull'],
  [SALT_FULL, 'the bar above the viewport; the developer panel is kept, on purpose'],
  [RZ_FRAME, 'the speckled decorative border the capture was framed in'],
]);

/** @type {Array<{in: string, out: string, crop?: object, width: number, quality?: number}>} */
const JOBS = [
  // Ember Wilds - full-bleed spread
  {
    in: 'emberwilds-biome-fallowmere-dusk.png',
    out: 'ember-spread-fallowmere-dusk',
    crop: EMBER,
    width: 3000,
  },
  // Ember Wilds - the multiplayer proof. No bars on this one, so no crop.
  {
    in: 'emberwilds-MULTIPLAYER-two-players-chat.png',
    out: 'ember-proof-two-players',
    width: 2400,
  },
  // Ember Wilds - the seven named regions, shown one at a time by the frame switcher
  {
    in: 'emberwilds-hearthvale-water.png',
    out: 'ember-region-hearthvale',
    crop: EMBER,
    width: 2000,
  },
  {
    in: 'emberwilds-biome-fallowmere-wide.png',
    out: 'ember-region-fallowmere',
    crop: EMBER,
    width: 2000,
  },
  {
    in: 'emberwilds-greenmarch-ruin-loot.png',
    out: 'ember-region-greenmarch',
    crop: EMBER,
    width: 2000,
  },
  { in: 'emberwilds-biome-fenmarch.png', out: 'ember-region-fenmarch', crop: EMBER, width: 2000 },
  {
    in: 'emberwilds-combat-ashen-waste-nova.png',
    out: 'ember-region-ashen-waste',
    crop: EMBER,
    width: 2000,
  },
  {
    in: 'emberwilds-biome-greywall-peaks-combat.png',
    out: 'ember-region-greywall-peaks',
    crop: EMBER,
    width: 2000,
  },
  {
    in: 'emberwilds-biome-black-plateau.png',
    out: 'ember-region-black-plateau',
    crop: EMBER,
    width: 2000,
  },
  // Ember Wilds - supporting figures
  {
    in: 'emberwilds-npc-quest-dialogue.png',
    out: 'ember-fig-quest-dialogue',
    crop: EMBER,
    width: 1600,
  },
  {
    in: 'emberwilds-creature-befriending.png',
    out: 'ember-fig-befriending',
    crop: EMBER,
    width: 1600,
  },

  // saltline - the flagship lead. Picked frame, not a default: 06:31 dawn, island
  // silhouette, three raiders named on the horizon, light path on the water.
  // Swap it by pointing saltline.lead.asset at a different name in content.ts.
  {
    in: 'saltline-dawn-island-blue.png',
    out: 'saltline-lead-dawn',
    crop: SALT_LEAD,
    width: 2800,
  },
  // saltline - the arc: one seed, six times of day, all six shown at once. Read in
  // chronological order, which is the order they are declared in.
  { in: 'saltline-night-moon-wake.png', out: 'saltline-arc-night', crop: SALT_CLEAN, width: 1600 },
  {
    in: 'saltline-dawn-island-ships.png',
    out: 'saltline-arc-sunrise',
    crop: SALT_CLEAN,
    width: 1600,
  },
  { in: 'saltline-dawn-island-blue.png', out: 'saltline-arc-dawn', crop: SALT_CLEAN, width: 1600 },
  {
    in: 'saltline-fleet-raiders-daylight.png',
    out: 'saltline-arc-daylight',
    crop: SALT_CLEAN,
    width: 1600,
  },
  {
    in: 'saltline-golden-hour-calm.png',
    out: 'saltline-arc-golden',
    crop: SALT_CLEAN,
    width: 1600,
  },
  { in: 'saltline-sunset-dramatic.png', out: 'saltline-arc-sunset', crop: SALT_CLEAN, width: 1600 },
  // saltline - the panel stays in this one. It is the argument, not an accident.
  {
    in: 'saltline-fleet-raiders-daylight.png',
    out: 'saltline-proof-panel',
    crop: SALT_FULL,
    width: 2400,
  },

  // hidamari - one frame, and it carries the whole section
  { in: 'hidamari-hero-canopy-3360x1440.png', out: 'hidamari-spread-canopy', width: 3000 },

  // Elderwood Vale - software-rendered captures at 1280x720. Card size only, never full bleed.
  { in: 'elderwood-vale-default-1280x720.png', out: 'elderwood-default', width: 1280 },
  { in: 'elderwood-vale-placement-coverage-1280x720.png', out: 'elderwood-coverage', width: 1280 },
  { in: 'elderwood-vale-stress-burst-1280x720.png', out: 'elderwood-stress', width: 1280 },

  // Playground - the three legacy demos that actually run
  { in: 'legacy-grinchjump-REVIVED.png', out: 'legacy-grinchjump', width: 1200, quality: 88 },

  // Rendezvous - the only thing in the playground that was a product. Nothing
  // runs, so these three are the whole of the evidence. The lead is the
  // dashboard; the two after it are one screen at one second in both themes.
  { in: 'rz-rendezvous-main.png', out: 'rendezvous-dashboard', crop: RZ_FRAME, width: 2400 },
  { in: 'rz-rendezvous1light.png', out: 'rendezvous-day', width: 1400 },
  { in: 'rz-rendezvous1dark.png', out: 'rendezvous-night', width: 1400 },
];

async function run() {
  if (!existsSync(SRC)) {
    console.error(`source batch not found: ${SRC}`);
    process.exitCode = 1;
    return;
  }
  await mkdir(OUT, { recursive: true });

  let bytes = 0;
  /** @type {object[]} */
  const manifest = [];

  for (const job of JOBS) {
    const from = path.join(SRC, job.in);
    const to = path.join(OUT, `${job.out}.webp`);
    let pipe = sharp(from);
    if (job.crop) pipe = pipe.extract(job.crop);
    await pipe
      .resize({ width: job.width, withoutEnlargement: true })
      .webp({ quality: job.quality ?? 90, effort: 6 })
      .toFile(to);
    const { size } = await stat(to);
    bytes += size;
    console.log(`${job.out.padEnd(30)} ${String(job.width).padStart(5)}w  ${kb(size)}`);

    /* Everything about the edit, read back off the two files rather than
       restated from the recipe above. The page's inspection mode prints this
       verbatim, so a number here that disagreed with the pixels would be the
       site vouching for the wrong thing. */
    const src = await sharp(from).metadata();
    const out = await sharp(to).metadata();
    const { mtime } = await stat(from);
    manifest.push({
      out: job.out,
      from: job.in,
      src: { w: src.width, h: src.height },
      asset: { w: out.width, h: out.height, bytes: size },
      dated: mtime.toISOString().slice(0, 10),
      ...(job.crop
        ? {
            crop: job.crop,
            trim: {
              left: job.crop.left,
              top: job.crop.top,
              right: src.width - job.crop.left - job.crop.width,
              bottom: src.height - job.crop.top - job.crop.height,
            },
            omits: OMITS.get(job.crop) ?? null,
          }
        : {}),
    });
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

  const written = (await readdir(OUT)).filter((f) => f.endsWith('.webp'));
  const loose = written.filter((f) => !JOBS.some((j) => `${j.out}.webp` === f));
  console.log(`\n${written.length} intermediates, ${kb(bytes)} total in src/assets/`);
  console.log(`${manifest.length} recorded in ${path.relative(process.cwd(), MANIFEST)}`);
  // Anything in src/assets this recipe does not make. Written by another
  // script or left behind by an older one; either way the page's inspection
  // mode has nothing to say about it and should be told so out loud.
  if (loose.length) console.log(`not from this recipe: ${loose.join(', ')}`);
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

await run();
