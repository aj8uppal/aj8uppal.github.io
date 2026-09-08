import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const archive = path.resolve(
  process.env.PORTFOLIO_TRAILER_ARCHIVE ||
    path.join(root, '../data/portfolio-trailers/2026-09-07/cinematic-v4'),
);
const ffmpeg =
  process.env.FFMPEG ||
  '/private/tmp/portfolio-video-tools/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const source = JSON.parse(await readFile(path.join(archive, 'final-manifest.json'), 'utf8'));
const out = path.join(root, 'public/media/trailers/v4');
const scratch = path.join(archive, 'web-delivery');
await mkdir(out, { recursive: true });
await mkdir(scratch, { recursive: true });
const keys = process.argv.slice(2);

async function hash(file) {
  const digest = createHash('sha256');
  for await (const chunk of createReadStream(file)) digest.update(chunk);
  return digest.digest('hex');
}

function run(args, logFile) {
  return new Promise((resolve, reject) => {
    const log = createWriteStream(logFile);
    const child = spawn(ffmpeg, ['-nostdin', '-hide_banner', '-y', ...args]);
    child.stdout.pipe(log);
    child.stderr.pipe(log);
    child.once('error', reject);
    child.once('close', (code) => {
      log.end();
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited ${code}; see ${logFile}`));
    });
  });
}

const stamp = (seconds) => {
  const ms = Math.round(seconds * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
};

const trailers = [];
for (const film of source.films) {
  const key = film.key;
  const crf = key === 'murmuration' ? 24 : 18;
  const profile = `1080p-x264-slow-crf${crf}-gop60-aac-copy-v1`;
  const file = path.join(out, `${key}.mp4`);
  const recordFile = path.join(scratch, `${key}.json`);
  const record = await readFile(recordFile, 'utf8')
    .then(JSON.parse)
    .catch(() => null);
  const available = await stat(file).catch(() => null);
  const current =
    record?.sourceSha256 === film.master.sha256 &&
    record?.profile === profile &&
    available &&
    (await hash(file)) === record.sha256;
  if (!current && (!keys.length || keys.includes(key))) {
    if ((await hash(film.master.path)) !== film.master.sha256)
      throw new Error(`${key}: approved master hash differs`);
    console.log(`Encoding ${key}`);
    const temporary = path.join(scratch, `${key}.partial.mp4`);
    await run(
      [
        '-threads',
        '6',
        '-i',
        film.master.path,
        '-map',
        '0:v:0',
        '-map',
        '0:a:0',
        '-vf',
        'scale=1920:1080:flags=lanczos,setsar=1',
        '-c:v',
        'libx264',
        '-preset',
        'slow',
        '-crf',
        String(crf),
        '-threads',
        '6',
        '-profile:v',
        'high',
        '-pix_fmt',
        'yuv420p',
        '-g',
        '60',
        '-keyint_min',
        '30',
        '-color_primaries',
        'bt709',
        '-color_trc',
        'bt709',
        '-colorspace',
        'bt709',
        '-c:a',
        'copy',
        '-movflags',
        '+faststart',
        '-metadata',
        `title=${film.title} — trailer`,
        '-metadata',
        `comment=${film.music.credit}${film.crowd ? ` ${film.crowd.credit}` : ''}`,
        temporary,
      ],
      path.join(scratch, `${key}-encode.log`),
    );
    const bytes = (await stat(temporary)).size;
    if (bytes >= 95 * 1024 ** 2)
      throw new Error(`${key}: web encode exceeds the 95 MiB file budget`);
    await rename(temporary, file);
    await writeFile(
      recordFile,
      JSON.stringify(
        {
          key,
          profile,
          sourceSha256: film.master.sha256,
          sha256: await hash(file),
          bytes,
        },
        null,
        2,
      ) + '\n',
    );
  }
  if (!(await stat(file).catch(() => null))) continue;
  const frame = path.join(scratch, `${key}-first-frame.png`);
  await run(['-i', file, '-frames:v', '1', frame], path.join(scratch, `${key}-poster.log`));
  await sharp(frame)
    .webp({ quality: 92 })
    .toFile(path.join(root, `src/assets/trailer-v4-${key}.webp`));
  const timeline = JSON.parse(await readFile(film.timeline.path, 'utf8'));
  const captions = timeline.captions.map(
    (caption) =>
      `${stamp(caption.at)} --> ${stamp(Math.min(film.durationSeconds, caption.at + caption.duration))}\n${caption.text
        .replaceAll('\u00a0', ' ')
        .replace(/[ \t]+$/gm, '')
        .trim()}`,
  );
  await writeFile(path.join(out, `${key}.vtt`), `WEBVTT\n\n${captions.join('\n\n')}\n`);
  const exportRecord = JSON.parse(await readFile(recordFile, 'utf8'));
  trailers.push({
    key,
    title: film.title,
    duration: film.durationSeconds,
    src: `/media/trailers/v4/${key}.mp4`,
    captions: `/media/trailers/v4/${key}.vtt`,
    poster: `trailer-v4-${key}.webp`,
    width: 1920,
    height: 1080,
    ...exportRecord,
    music: { title: film.music.title, artist: film.music.artist, url: film.music.page },
    crowd: film.crowd
      ? { title: film.crowd.title, artist: film.crowd.artist, url: film.crowd.page }
      : null,
    licenseUrl: film.music.licenseDeed,
  });
  console.log(`${key}: ${(exportRecord.bytes / 1024 ** 2).toFixed(1)} MiB`);
}
if (trailers.length !== source.films.length)
  throw new Error(
    `Only ${trailers.length}/${source.films.length} exports available; existing site manifest left unchanged`,
  );
await writeFile(
  path.join(root, 'src/data/portfolio-trailers.json'),
  JSON.stringify(trailers, null, 2) + '\n',
);
console.log(
  `Prepared ${trailers.length} trailers. Original audio packets and editorial timing retained.`,
);
