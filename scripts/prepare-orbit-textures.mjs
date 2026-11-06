/**
 * Derives the homepage scene's textures from the raw art in data/orbit-art/.
 *
 * The raw files stay outside Git (see .gitignore): the generated PNGs are 1-4MB
 * each and the NASA maps are 4K. What ships is written to src/orbit/textures/
 * and imported by the scene with `?url`, so Vite hashes it like any other asset.
 *
 * Every planet map is an equirectangular wrap. The generator was asked for
 * seamless left/right edges and mostly delivers, but "mostly" shows up as a
 * hard vertical line on a rotating sphere. So each wrap is cross-faded with a
 * copy of itself rolled by half its width, over a narrow band at the edges:
 * at the seam the two sides then come from the same continuous middle strip.
 *
 * Idempotent. `node scripts/prepare-orbit-textures.mjs` after replacing any raw.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const RAW = path.join(ROOT, 'data/orbit-art');
const OUT = path.join(ROOT, 'src/orbit/textures');

/** @param {sharp.Sharp} img @param {number} w @param {number} h @param {number} band */
async function seamless(img, w, h, band = 0.06) {
  const { data, info } = await img
    .resize(w, h, { fit: 'fill', kernel: 'lanczos3' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const c = info.channels;
  const out = Buffer.alloc(data.length);
  const bw = Math.round(w * band);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      // Distance to the nearest edge, as a 0..1 weight toward the rolled copy.
      const edge = Math.min(x, w - 1 - x);
      const t = edge >= bw ? 0 : 0.5 + 0.5 * Math.cos((edge / bw) * Math.PI);
      const rx = (x + (w >> 1)) % w;
      const i = (y * w + x) * c;
      const j = (y * w + rx) * c;
      for (let k = 0; k < c; k++) out[i + k] = Math.round(data[i + k] * (1 - t) + data[j + k] * t);
    }
  return sharp(out, { raw: { width: w, height: h, channels: c } });
}

/** Fades a sprite to black at its borders, so an additive plate never shows a rectangle. */
async function vignette(img, w, h) {
  const { data, info } = await img
    .resize(w, h, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const c = info.channels;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const u = (x / (w - 1)) * 2 - 1;
      const v = (y / (h - 1)) * 2 - 1;
      const r = Math.hypot(u * 1.0, v * 1.0);
      const f = Math.min(1, Math.max(0, (1.12 - r) / 0.42));
      const s = f * f * (3 - 2 * f);
      const i = (y * w + x) * c;
      for (let k = 0; k < c; k++) data[i + k] = Math.round(data[i + k] * s);
    }
  return sharp(data, { raw: { width: w, height: h, channels: c } });
}

const jobs = [
  // name, source, kind, width, height, quality
  ['sky', 'sky-panorama.png', 'sky', 2048, 1024, 86],
  ['saltline', 'planet-saltline.png', 'wrap', 2048, 1024, 84],
  ['clouds', 'planet-clouds.png', 'mask', 2048, 1024, 80],
  ['ice', 'planet-ice.png', 'wrap', 2048, 1024, 84],
  ['emberdeep', 'planet-emberdeep.png', 'wrap', 2048, 1024, 84],
  ['seventide', 'planet-seventide.png', 'wrap', 2048, 1024, 84],
  ['harvest', 'planet-harvest.png', 'wrap', 2048, 1024, 84],
  ['lumen', 'planet-lumen.png', 'wrap', 2048, 1024, 84],
  ['lanternwake', 'planet-lanternwake.png', 'wrap', 2048, 1024, 84],
  ['lantern-roads', 'planet-lantern-roads.png', 'pixel', 1024, 512, 90],
  ['moon', 'moon-rock.png', 'wrap', 2048, 1024, 82],
  ['nebula-violet', 'nebula-violet.png', 'sprite', 1024, 683, 82],
  ['nebula-amber', 'nebula-amber.png', 'sprite', 1024, 683, 82],
  ['nebula-blue', 'nebula-blue.png', 'sprite', 1024, 683, 82],
  ['earth-day', 'nasa/earth-blue-marble.jpg', 'map', 4096, 2048, 84],
  ['earth-day-lo', 'nasa/earth-blue-marble.jpg', 'map', 2048, 1024, 84],
  ['earth-night', 'nasa/earth-night.jpg', 'map', 2048, 1024, 80],
  ['earth-water', 'nasa/earth-water.png', 'mask', 1024, 512, 80],
];

await mkdir(OUT, { recursive: true });
const manifest = [];
const prompts = JSON.parse(await readFile(path.join(RAW, 'prompts.json'), 'utf8'));
for (const [name, src, kind, w, h, q] of jobs) {
  let img = sharp(path.join(RAW, src));
  if (kind === 'wrap') img = await seamless(img, w, h);
  else if (kind === 'mask') img = await seamless(img.greyscale(), w, h, 0.05);
  else if (kind === 'sprite') img = await vignette(img, w, h);
  else if (kind === 'sky') {
    // Point stars in the panorama magnify into soft blobs. A median takes them
    // out and leaves the band and its dust; the shader draws sharp stars back.
    const { data, info } = await sharp(path.join(RAW, src))
      .median(5)
      .raw()
      .toBuffer({ resolveWithObject: true });
    img = await seamless(
      sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }),
      w,
      h,
      0.04,
    );
  } else if (kind === 'pixel') {
    // Pixel art keeps hard edges: nearest-neighbour down to the art's own
    // grid, and the scene samples it with a nearest magnification filter.
    const { data, info } = await (
      await seamless(img, w, h, 0.03)
    )
      .raw()
      .toBuffer({ resolveWithObject: true });
    img = sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } });
  } else img = img.resize(w, h, { fit: 'fill' });
  const file = name + '.webp';
  const buf = await img.webp({ quality: q, effort: 6 }).toBuffer();
  await writeFile(path.join(OUT, file), buf);
  const base = path.basename(src, path.extname(src));
  const generated = prompts.find((p) => p.name === base);
  manifest.push({
    file,
    from: src,
    bytes: buf.length,
    provenance: generated
      ? { generator: 'Codex built-in image_gen', prompt: generated.prompt }
      : {
          source: 'NASA Visible Earth (public domain), via the three-globe example assets',
          url: `https://cdn.jsdelivr.net/gh/vasturiano/three-globe@master/example/img/${path.basename(src)}`,
        },
  });
  console.log(file.padEnd(22), (buf.length / 1024).toFixed(0).padStart(6), 'KB');
  // A 512px stand-in for every surface map. The scene starts every body on it
  // (the overview sees them from far off) and fetches the full map only as the
  // camera closes in, so a visitor who never scrolls downloads a tenth as much.
  if (kind === 'wrap' || kind === 'mask' || kind === 'pixel' || name === 'earth-day') {
    const lo = await sharp(buf)
      .resize(512, 256, { fit: 'fill', kernel: kind === 'pixel' ? 'nearest' : 'lanczos3' })
      .webp({ quality: 80, effort: 6 })
      .toBuffer();
    await writeFile(path.join(OUT, name + '-512.webp'), lo);
    console.log((name + '-512.webp').padEnd(22), (lo.length / 1024).toFixed(0).padStart(6), 'KB');
  }
}
await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
