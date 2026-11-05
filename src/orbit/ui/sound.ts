/**
 * Optional sound, off until asked for, and synthesized here: no audio files.
 *
 * Everything is consonant by construction. A slow I–vi–IV–V progression in
 * D with added ninths is voiced on sine and soft triangle partials, each note
 * breathing on its own slow swell, through a warm reverb whose impulse is
 * low-passed noise (a white-noise tail hisses). Over it, now and then, a
 * music-box note drawn only from the chord that is sounding; arriving at a new
 * station plays three of them, rising. No noise beds, no detuned saws, no
 * hover sounds.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let padBus: GainNode | null = null;
let bellBus: GainNode | null = null;
let on = false;
let chordTimer = 0;
let bellTimer = 0;
let chordIndex = 0;
let lastChime = 0;

const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
/** D(add9) · Bm(add9) · Gmaj9 · Asus2(6): open voicings, no clashing seconds below the top. */
const CHORDS = [
  [50, 57, 62, 66, 69, 76],
  [47, 54, 62, 66, 69, 73],
  [43, 50, 59, 62, 66, 69],
  [45, 52, 59, 64, 69, 71],
];
const CHORD_SECONDS = 15;

function impulse(c: AudioContext, seconds: number) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      // One-pole low-pass on the noise, with the cutoff closing as the tail decays.
      const t = i / len;
      const k = 0.35 - 0.3 * t;
      lp += k * (Math.random() * 2 - 1 - lp);
      d[i] = lp * Math.pow(1 - t, 2.6) * 2.2;
    }
  }
  return buf;
}

function build() {
  const c = new AudioContext();
  ctx = c;
  master = c.createGain();
  master.gain.value = 0;
  const tone = c.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 4200;
  tone.Q.value = 0.4;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -20;
  comp.ratio.value = 2.5;
  comp.attack.value = 0.05;
  comp.release.value = 0.6;
  master.connect(tone).connect(comp).connect(c.destination);

  const verb = c.createConvolver();
  verb.buffer = impulse(c, 6);
  const pre = c.createDelay(0.2);
  pre.delayTime.value = 0.045;
  const wet = c.createGain();
  wet.gain.value = 0.62;
  pre.connect(verb).connect(wet).connect(master);

  padBus = c.createGain();
  padBus.gain.value = 0.95;
  padBus.connect(master);
  padBus.connect(pre);
  bellBus = c.createGain();
  bellBus.gain.value = 0.55;
  bellBus.connect(master);
  const bellSend = c.createGain();
  bellSend.gain.value = 1.4;
  bellBus.connect(bellSend).connect(pre);
}

/** One chord: every note swells in, breathes, and releases into the next. */
function playChord(notes: number[]) {
  if (!ctx || !padBus) return;
  const c = ctx;
  const t = c.currentTime + 0.05;
  const attack = 5;
  const hold = CHORD_SECONDS - 1;
  const release = 7;
  notes.forEach((m, i) => {
    const f = midi(m);
    const voice = c.createGain();
    const level = 0.06 / Math.sqrt(1 + i * 0.9);
    voice.gain.setValueAtTime(0, t);
    voice.gain.linearRampToValueAtTime(level, t + attack + i * 0.35);
    voice.gain.setValueAtTime(level, t + hold);
    voice.gain.linearRampToValueAtTime(0, t + hold + release);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2300 + i * 260;
    lp.Q.value = 0.3;
    voice.connect(lp).connect(padBus!);

    // Each note breathes at its own slow rate.
    const swell = c.createGain();
    swell.gain.value = 0.75;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.05 + Math.random() * 0.07;
    const depth = c.createGain();
    depth.gain.value = 0.25;
    lfo.connect(depth).connect(swell.gain);
    swell.connect(voice);

    const a = c.createOscillator();
    a.type = 'sine';
    a.frequency.value = f;
    const b = c.createOscillator();
    b.type = 'triangle';
    b.frequency.value = f * 2;
    b.detune.value = 3;
    const bg = c.createGain();
    bg.gain.value = 0.07;
    a.connect(swell);
    b.connect(bg).connect(swell);
    const end = t + hold + release + 0.2;
    for (const o of [a, b, lfo]) {
      o.start(t);
      o.stop(end);
    }
  });
}

function nextChord() {
  if (!on) return;
  playChord(CHORDS[chordIndex % CHORDS.length]!);
  chordIndex++;
  chordTimer = window.setTimeout(nextChord, CHORD_SECONDS * 1000);
}

/** A soft music-box note: a sine and its octave, quick attack, long decay. */
function bell(m: number, when = 0, gain = 0.05) {
  if (!ctx || !bellBus) return;
  const t = ctx.currentTime + when;
  const f = midi(m);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
  g.connect(bellBus);
  const a = ctx.createOscillator();
  a.type = 'sine';
  a.frequency.value = f;
  const b = ctx.createOscillator();
  b.type = 'sine';
  b.frequency.value = f * 2;
  const bg = ctx.createGain();
  bg.gain.value = 0.18;
  a.connect(g);
  b.connect(bg).connect(g);
  for (const o of [a, b]) {
    o.start(t);
    o.stop(t + 4);
  }
}

const current = () => CHORDS[(chordIndex + CHORDS.length - 1) % CHORDS.length]!;

function sparkle() {
  if (!on) return;
  const notes = current().slice(-3);
  bell(notes[Math.floor(Math.random() * notes.length)]! + 12, 0, 0.03);
  bellTimer = window.setTimeout(sparkle, 4000 + Math.random() * 6000);
}

function arrive() {
  if (!on || !ctx) return;
  const now = performance.now();
  if (now - lastChime < 1800) return;
  lastChime = now;
  const notes = current();
  [notes[2]!, notes[3]!, notes[4]!].forEach((m, i) => bell(m + 12, i * 0.13, 0.045 - i * 0.008));
}

export function initSound() {
  const btn = document.querySelector<HTMLButtonElement>('[data-sound]');
  if (!btn) return;
  const label = btn.querySelector('[data-sound-label]');
  const set = (value: boolean) => {
    on = value;
    btn.setAttribute('aria-pressed', String(on));
    if (label) label.textContent = on ? 'Sound on' : 'Sound off';
    clearTimeout(chordTimer);
    clearTimeout(bellTimer);
    if (on) {
      if (!ctx) build();
      void ctx!.resume();
      const t = ctx!.currentTime;
      master!.gain.cancelScheduledValues(t);
      master!.gain.setValueAtTime(master!.gain.value, t);
      master!.gain.linearRampToValueAtTime(1.1, t + 3);
      nextChord();
      bellTimer = window.setTimeout(sparkle, 6000);
    } else if (ctx && master) {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 1.2);
      const c = ctx;
      window.setTimeout(() => {
        if (!on) void c.suspend();
      }, 1400);
    }
  };
  btn.addEventListener('click', () => set(!on));
  document.addEventListener('orbit:station', (e) => {
    const key = (e as CustomEvent<string>).detail ?? '';
    if (key.startsWith('world:') || key === 'earth' || key === 'origin' || key === 'contact')
      arrive();
  });
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) void ctx.suspend();
    else if (on) void ctx.resume();
  });
}
