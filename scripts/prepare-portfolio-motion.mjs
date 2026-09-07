/** Encode actual app recordings, then derive each poster from its final MP4.
 * FFMPEG=/path/to/ffmpeg npm run portfolio:motion:prepare
 * Raw recordings stay outside Git, beside the original image archive.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { saltlineStyles } from '../src/data/portfolio-motion.mjs';
const root = path.resolve(import.meta.dirname, '..');
const input =
  process.env.PORTFOLIO_MOTION_RAW || path.resolve(root, '../data/portfolio-videos/2026-09-06');
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const output = path.join(root, 'public/media/previews');
await mkdir(output, { recursive: true });
const keys = [
  ...saltlineStyles.map((s) => `saltline-${s.key}`),
  'murmuration',
  'ember',
  'blockhold',
  'cubit',
  'eyeshot',
];
const only = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const manifestPath = path.join(root, 'src/data/portfolio-motion-captures.json');
let manifest = [];
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8')).captures;
} catch {
  /* first batch */
}
for (const key of keys.filter((key) => !only.length || only.includes(key))) {
  const raw = path.join(input, `${key}.webm`);
  const video = path.join(output, `${key}.mp4`);
  const poster = path.join(root, `src/assets/preview-${key}.webp`);
  const args = [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    raw,
    '-an',
    '-vf',
    'fps=60,scale=1280:720:flags=lanczos,setsar=1',
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '23',
    '-maxrate',
    '4000k',
    '-bufsize',
    '8000k',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-g',
    '120',
    '-tag:v',
    'avc1',
    video,
  ];
  if (!process.argv.includes('--manifest-only')) {
    execFileSync(ffmpeg, args, { stdio: ['ignore', 'inherit', 'inherit'] });
    const first = execFileSync(
      ffmpeg,
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-i',
        video,
        '-frames:v',
        '1',
        '-f',
        'image2pipe',
        '-vcodec',
        'png',
        '-',
      ],
      { maxBuffer: 12e6 },
    );
    await sharp(first).webp({ quality: 95, effort: 6 }).toFile(poster);
  }
  const probe = spawnSync(
    ffmpeg,
    ['-hide_banner', '-i', video, '-map', '0:v:0', '-f', 'null', '-'],
    { encoding: 'utf8' },
  );
  if (probe.status !== 0) throw new Error(`Cannot decode ${key}: ${probe.stderr}`);
  const frames = Number([...probe.stderr.matchAll(/frame=\s*(\d+)/g)].at(-1)?.[1]);
  if (!frames || frames < 180) throw new Error(`${key} is too short`);
  const hash = createHash('sha256')
    .update(await readFile(raw))
    .digest('hex');
  manifest = manifest.filter((item) => item.key !== key);
  manifest.push({
    key,
    raw: `${key}.webm`,
    rawSha256: hash,
    video: `/media/previews/${key}.mp4`,
    bytes: (await stat(video)).size,
    poster: `preview-${key}.webp`,
    posterFrom: 'First decoded frame of the final MP4',
    width: 1280,
    height: 720,
    fps: 60,
    frames,
    seconds: Number((frames / 60).toFixed(3)),
    audio: false,
  });
  console.log(`${key}: ${(manifest.at(-1).bytes / 1e6).toFixed(2)} MB`);
}
await writeFile(
  manifestPath,
  JSON.stringify(
    {
      rawArchive: 'data/portfolio-videos/2026-09-06 (outside Git)',
      captureRecipes: 'scripts/capture-portfolio-motion.mjs',
      captured: '2026-09-06–2026-09-07',
      captures: manifest.sort((a, b) => keys.indexOf(a.key) - keys.indexOf(b.key)),
    },
    null,
    2,
  ) + '\n',
);
