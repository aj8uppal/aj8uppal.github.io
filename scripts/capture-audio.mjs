/** Synthetic guitar input, adapted from BeatLayer's e2e/make-guitar.mjs.
 * Karplus–Strong strings give the real beat tracker a reproducible recording.
 * Generate it in memory so captures never need a personal audio file.
 */
function guitarRecording() {
  const sr = 44100;
  const bpm = 96;
  const seconds = 40;
  const bpmEnd = bpm;
  const N = sr * seconds;
  const mix = new Float32Array(N);
  let seed = 12345;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296 - 0.5;
  };

  function pluck(freq, start, amp, dur = 1.2) {
    const period = Math.round(sr / freq);
    const buf = new Float32Array(period);
    for (let i = 0; i < period; i++) buf[i] = rnd() * 2;
    let idx = 0;
    const len = Math.min(N - start, Math.floor(dur * sr));
    for (let i = 0; i < len; i++) {
      const next = (idx + 1) % period;
      const v = 0.5 * (buf[idx] + buf[next]) * 0.996;
      buf[idx] = v;
      mix[start + i] += v * amp * Math.exp(-i / (sr * dur * 0.6));
      idx = next;
    }
  }
  const chords = [
    [82.41, 123.47, 164.81, 207.65, 246.94, 329.63], // E
    [110, 138.59, 164.81, 220, 277.18], // A
    [146.83, 220, 293.66, 369.99], // D
    [98, 123.47, 146.83, 196, 246.94, 392], // G
  ];
  const lead = 1.0; // one second of near-silence before the first strum
  let t = lead;
  for (let b = 0; t < seconds - 1; b++) {
    const bar = Math.floor(b / 4);
    const chord = chords[bar % chords.length];
    const beat = 60 / (bpm + (bpmEnd - bpm) * (t / seconds));
    // strum on the beat, a lighter up-strum on the "and"
    const down = b % 4 === 0 ? 0.55 : 0.42;
    chord.forEach((f, i) => pluck(f, Math.floor((t + i * 0.008) * sr), down));
    chord.slice(2).forEach((f, i) => pluck(f, Math.floor((t + beat / 2 + i * 0.006) * sr), 0.22));
    t += beat;
  }
  // normalise
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(mix[i]));
  const g = 0.8 / peak;
  const buf = Buffer.alloc(44 + N * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + N * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24);
  buf.writeUInt32LE(sr * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(N * 2, 40);
  for (let i = 0; i < N; i++)
    buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(mix[i] * g * 32767))), 44 + i * 2);
  return buf;
}

export async function captureBeatlayer(page, { base }) {
  await page.goto(`${base}/beatlayer/`, { waitUntil: 'networkidle' });
  await page.locator('.dropzone').waitFor();
  await page.setInputFiles('input[type=file][accept*="audio"]', {
    name: 'guitar-96.wav',
    mimeType: 'audio/wav',
    buffer: guitarRecording(),
  });
  await page.locator('.track-name').waitFor({ timeout: 20000 });
  await page.waitForFunction(() => !!document.querySelector('.pill.ok, .pill.warn'), null, {
    timeout: 30000,
  });
  const bpm = Number(await page.inputValue('.bpm-input'));
  if (Math.min(Math.abs(bpm - 96), Math.abs(bpm - 48), Math.abs(bpm - 192)) >= 1) {
    throw new Error(`Unexpected guitar tempo: ${bpm}`);
  }
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.waitForTimeout(4800);
  const time = await page.locator('.time').textContent();
  if (time === '0:00.0' || !(await page.locator('.cell.live').count())) {
    throw new Error('Playback did not advance the sequencer');
  }
}
