/** Record the browser's painted page when a transparent canvas depends on CSS.
 * Acknowledge frames immediately; write/encode after capture so disk IO cannot
 * stall the render loop. Held frames keep their real elapsed durations.
 */
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function recordCompositor(page, raw, key, action, seconds, crop) {
  const directory = path.join(raw, `${key}-frames`);
  await mkdir(directory, { recursive: true });
  const client = await page.context().newCDPSession(page);
  await client.send('Page.enable');
  const frames = [];
  client.on('Page.screencastFrame', (frame) => {
    frames.push({ time: frame.metadata.timestamp, data: Buffer.from(frame.data, 'base64') });
    void client.send('Page.screencastFrameAck', { sessionId: frame.sessionId });
  });
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 94,
    maxWidth: 1280,
    maxHeight: 800,
    everyNthFrame: 1,
  });
  const start = Date.now();
  await action();
  await page.waitForTimeout(Math.max(1, seconds * 1000 - (Date.now() - start)));
  await client.send('Page.stopScreencast');
  if (frames.length < 30) throw new Error(`${key}: too few captured frames`);
  const end = frames.at(-1).time;
  const index = [];
  for (let i = 0; i < frames.length; i++) {
    const filename = `${String(i).padStart(5, '0')}.jpg`;
    await writeFile(path.join(directory, filename), frames[i].data);
    index.push(
      `file '${filename}'\nduration ${Math.max(0.001, (frames[i + 1]?.time ?? end + 0.5) - frames[i].time)}`,
    );
  }
  index.push(`file '${String(frames.length - 1).padStart(5, '0')}.jpg'`);
  await writeFile(path.join(directory, 'frames.txt'), index.join('\n'));
  await client.detach();
  console.log(
    `${key}: ${frames.length} compositor frames in ${(end - frames[0].time).toFixed(2)} seconds`,
  );
  execFileSync(
    process.env.FFMPEG || 'ffmpeg',
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      path.join(directory, 'frames.txt'),
      '-vf',
      `${crop ? `crop=${crop},` : ''}scale=1280:720:flags=lanczos,fps=60`,
      '-c:v',
      'libvpx-vp9',
      '-b:v',
      '10000k',
      '-deadline',
      'realtime',
      '-cpu-used',
      '6',
      path.join(raw, `${key}.webm`),
    ],
    { stdio: 'inherit' },
  );
}
