/**
 * Optional sound for /v2/: off until the visitor asks for it, synthesized here
 * with raw WebAudio (no audio files, no libraries).
 *
 * Score. Eight chords in D at 60 BPM, 80 beats a cycle, voice-led so that
 * common tones sustain across a change and moving voices step:
 *   Dmaj9 · Bm11 · Gmaj9 · Em9 · Cmaj7#11 · A9sus4 · Bbmaj9 · A(add9)
 * The bass falls in thirds (D B G E C), leans on the borrowed C and Bb, and
 * comes home through A. A four-cycle form (dawn, rise, open, breath) decides
 * which layers play and how open the pad filter sits; one three-note motif
 * (step down, leap down) recurs over chords 1, 3, 5, 7 and 8 and is never
 * random. Layers: four pad voices of two detuned soft saws each, panned in
 * pairs and run through one slowly moving low-pass and a stereo chorus; a
 * bass of sine plus filtered saw; a sine halo an octave up; the motif on an
 * FM glass voice into a dotted-eighth ping-pong delay; a quiet mallet
 * arpeggio in the "open" cycle; and a faint band of moving air.
 *
 * Flight. soundFrame() maps camera speed onto a log scale and drives a wind
 * layer: decorrelated stereo noise through a band-pass that climbs with
 * speed, a resonant whistle, turbulence flutter, a low rumble on long jumps,
 * a pan that follows travel, and a small duck-and-open of the pad. An arrival
 * plays once when the camera settles (speed under a tenth of the flight's
 * peak, within 10% of a station; under reduced motion, after a short stay) at
 * a station it was not already at; the
 * station `orbit:station` event fires mid-flight, so it only stands in when
 * no frames arrive. Each world has its own voice and figure, drawn from the
 * chord sounding then and lifted a chord tone on return visits; long jumps
 * land with a low tuned thump. Near the black hole a drone on D with a
 * sweeping resonance, rumble and a circling hiss fades in.
 *
 * Engineering. Every note is scheduled on AudioContext time by a lookahead
 * scheduler; control changes use setTargetAtTime, at most ~30 a second; every
 * transient node is stopped and disconnected when its last source ends. The
 * score has its own gentle bus compressor; the master is a high-pass, a
 * limiter that only catches stray peaks and a soft clipper whose ceiling is
 * -1.4 dBFS. The same engine renders into an OfflineAudioContext, which is how
 * it was measured: the bed sits near -23 LUFS, arrivals within 2.5 LU of each
 * other, peaks below -5 dBFS.
 */

/* ------------------------------------------------------------------ score */

const BEAT = 1; // seconds; 60 BPM
const LOOKAHEAD = 1.2; // seconds of score scheduled ahead of the clock
const TICK_MS = 150;

interface Chord {
  bass: number;
  /** Four upper voices, low to high, MIDI. Common tones stay in their slot. */
  voices: readonly [number, number, number, number];
  beats: number;
}

const PROGRESSION: readonly Chord[] = [
  { bass: 38, voices: [57, 61, 64, 66], beats: 12 }, // Dmaj9
  { bass: 35, voices: [57, 62, 64, 66], beats: 8 }, // Bm11
  { bass: 31, voices: [59, 62, 66, 69], beats: 12 }, // Gmaj9
  { bass: 40, voices: [59, 62, 66, 67], beats: 8 }, // Em9
  { bass: 36, voices: [59, 64, 66, 67], beats: 10 }, // Cmaj7#11
  { bass: 33, voices: [59, 62, 64, 67], beats: 6 }, // A9sus4
  { bass: 34, voices: [57, 60, 62, 65], beats: 10 }, // Bbmaj9
  { bass: 33, voices: [57, 59, 61, 64], beats: 14 }, // A(add9)
];

/** [beat offset, MIDI, velocity]. The same contour each time: step down, leap down. */
type Phrase = readonly (readonly [number, number, number])[];
const MOTIF: Record<'a' | 'b' | 'c' | 'd' | 'e', Phrase> = {
  a: [
    [2, 78, 1],
    [3.5, 76, 0.78],
    [5, 69, 0.9],
  ], // Dmaj9: F#5 E5 A4
  b: [
    [2, 78, 0.9],
    [3.5, 76, 0.72],
    [5, 71, 0.85],
    [7.5, 74, 0.55],
  ], // Gmaj9: F#5 E5 B4, D5
  c: [
    [2, 79, 1],
    [3.5, 78, 0.78],
    [5, 71, 0.9],
  ], // Cmaj7#11: G5 F#5 B4
  d: [
    [2, 77, 0.9],
    [3.5, 74, 0.75],
    [5, 72, 0.8],
  ], // Bbmaj9: F5 D5 C5
  e: [
    [1, 73, 0.75],
    [3, 71, 0.65],
    [5.5, 69, 0.85],
  ], // A(add9): C#5 B4 A4, the cadence
};

interface Section {
  /** Pad low-pass centre, Hz. */
  cutoff: number;
  /** Motif phrase per chord index, with an octave shift. */
  motif: Partial<Record<number, readonly [keyof typeof MOTIF, number]>>;
  halo: readonly boolean[];
  arp: readonly boolean[];
  bass: readonly boolean[];
}

const ALL = [true, true, true, true, true, true, true, true] as const;
const NONE = [false, false, false, false, false, false, false, false] as const;
const FORM: readonly Section[] = [
  // dawn
  {
    cutoff: 900,
    motif: { 0: ['a', 0], 4: ['c', 0] },
    halo: NONE,
    arp: NONE,
    bass: [false, true, true, true, true, true, true, true],
  },
  // rise
  {
    cutoff: 1300,
    motif: { 0: ['a', 0], 2: ['b', 0], 4: ['c', 0], 6: ['d', 0], 7: ['e', 0] },
    halo: [false, false, true, true, true, true, true, true],
    arp: NONE,
    bass: ALL,
  },
  // open
  {
    cutoff: 1750,
    motif: { 0: ['a', 12], 4: ['c', 12], 7: ['e', 0] },
    halo: ALL,
    arp: [false, true, true, true, true, true, true, false],
    bass: ALL,
  },
  // breath
  {
    cutoff: 760,
    motif: { 7: ['e', 0] },
    halo: NONE,
    arp: NONE,
    bass: [false, false, true, true, true, true, true, true],
  },
];

/** Arpeggio order over the chord's tones above A4, in eighth notes. */
const ARP_ORDER = [0, 2, 1, 3, 2, 4, 3, 1] as const;

/* ---------------------------------------------------------------- timbres */

type ToneName =
  | 'glass'
  | 'mallet'
  | 'bowl'
  | 'ember'
  | 'void'
  | 'celesta'
  | 'kalimba'
  | 'wood'
  | 'horn'
  | 'pulse'
  | 'pluck'
  | 'rhodes';

interface Tone {
  /** Carrier: sine, or one of the built tables. */
  wave: 'sine' | 'triangle' | 'saw' | 'pulse';
  gain: number;
  attack: number;
  /** Time to -60 dB. */
  decay: number;
  /** FM: modulator ratio, peak index, index time constant (s), resting index. */
  fm?: readonly [number, number, number, number];
  /** Extra sine partials: ratio, relative gain, decay scale. */
  partials?: readonly (readonly [number, number, number])[];
  /** Second carrier this many cents sharp, for slow beating. */
  chorus?: number;
  /** Per-note low-pass: start, peak, rest (Hz) over the attack and decay. */
  filter?: readonly [number, number, number];
  /** Struck noise: band-pass centre, Q, gain, decay (s). */
  noise?: readonly [number, number, number, number];
  /** Pitch drift over the decay, cents. */
  drift?: number;
}

const TONES: Record<ToneName, Tone> = {
  // FM 1:3.5 with the index falling away: a struck glass or tubular tone.
  glass: {
    wave: 'sine',
    gain: 0.5,
    attack: 0.004,
    decay: 3.6,
    fm: [3.5, 1.3, 0.35, 0.08],
    partials: [[2, 0.16, 0.55]],
    chorus: 3,
  },
  // 1:4 with a fast index drop: marimba.
  mallet: {
    wave: 'sine',
    gain: 0.55,
    attack: 0.003,
    decay: 1.4,
    fm: [4, 1.8, 0.06, 0],
    partials: [[9.9, 0.04, 0.08]],
  },
  // Free-edge bowl modes, each beating against a twin.
  bowl: {
    wave: 'sine',
    gain: 0.36,
    attack: 0.012,
    decay: 6,
    partials: [
      [2.71, 0.5, 0.7],
      [5.15, 0.2, 0.45],
      [8.43, 0.07, 0.3],
    ],
    chorus: 2.5,
  },
  // Chowning's 1:1.4 bell, low and dark, with a spit of crackle.
  ember: {
    wave: 'sine',
    gain: 0.5,
    attack: 0.005,
    decay: 3,
    fm: [1.4, 2.4, 0.5, 0.2],
    noise: [1700, 1.1, 0.12, 0.16],
  },
  // A slow, beating FM tone that sinks a few cents.
  void: {
    wave: 'sine',
    gain: 0.5,
    attack: 0.09,
    decay: 7,
    fm: [2.005, 1.1, 1.6, 0.25],
    partials: [[0.5, 0.45, 1]],
    drift: -14,
  },
  celesta: {
    wave: 'sine',
    gain: 0.4,
    attack: 0.003,
    decay: 2.4,
    fm: [7, 0.8, 0.12, 0],
    partials: [[4, 0.1, 0.25]],
  },
  // Inharmonic tine.
  kalimba: {
    wave: 'sine',
    gain: 0.5,
    attack: 0.002,
    decay: 1.7,
    fm: [5.4, 1.1, 0.04, 0],
    noise: [3800, 2, 0.05, 0.02],
  },
  wood: {
    wave: 'sine',
    gain: 0.45,
    attack: 0.002,
    decay: 0.5,
    fm: [2.3, 2.2, 0.025, 0],
    noise: [2400, 3, 0.08, 0.018],
  },
  // Soft brass: detuned saws opening a filter.
  horn: {
    wave: 'saw',
    gain: 0.26,
    attack: 0.14,
    decay: 2.4,
    chorus: 7,
    filter: [260, 1500, 700],
  },
  // A filtered 25% pulse: a pixel-art nod, kept round.
  pulse: {
    wave: 'pulse',
    gain: 0.2,
    attack: 0.003,
    decay: 0.7,
    filter: [2600, 2600, 1300],
  },
  // Triangle with a paper tick.
  pluck: {
    wave: 'triangle',
    gain: 0.5,
    attack: 0.002,
    decay: 0.9,
    noise: [3200, 0.8, 0.06, 0.03],
  },
  // DX-style electric piano: 1:1 body, and a tine partial that dies at once.
  rhodes: {
    wave: 'sine',
    gain: 0.5,
    attack: 0.004,
    decay: 3.6,
    fm: [1, 1.5, 0.35, 0.2],
    partials: [[14, 0.03, 0.03]],
  },
};

/* --------------------------------------------------------------- arrivals */

interface Signature {
  tone: ToneName;
  /** Figure indexes into the chord tones at or above this MIDI note. */
  lo: number;
  figure: readonly number[];
  /** Seconds between notes. */
  gap: number;
  pan: number;
  /** Pan travelled across the figure. */
  spread?: number;
  /** Level trim, dB: measured so every arrival lands near -22 LUFS momentary. */
  db?: number;
}

const SIGNATURES: Record<string, Signature> = {
  'world:seventide': { tone: 'mallet', lo: 67, figure: [0, 2, 4], gap: 0.11, pan: -0.25, db: 1 },
  'world:emberdeep': { tone: 'ember', lo: 50, figure: [3, 0], gap: 0.2, pan: 0.15 },
  'world:saltline': { tone: 'bowl', lo: 62, figure: [0, 5], gap: 0.6, pan: -0.15, db: -2 },
  'world:lumen-hollow': {
    tone: 'celesta',
    lo: 79,
    figure: [4, 2, 3, 0],
    gap: 0.16,
    pan: 0.3,
    db: 3,
  },
  'world:seventide-globe': {
    tone: 'kalimba',
    lo: 64,
    figure: [0, 3, 1],
    gap: 0.14,
    pan: -0.3,
    db: 3,
  },
  'world:blockhold': { tone: 'wood', lo: 69, figure: [0, 0, 2], gap: 0.12, pan: 0.25, db: 7 },
  'world:lanternwake': { tone: 'bowl', lo: 69, figure: [2, 0], gap: 0.45, pan: 0.1, db: -0.5 },
  'world:voidreach': { tone: 'void', lo: 50, figure: [0, 4], gap: 0.9, pan: 0, db: -2 },
  'world:harvest-crown': { tone: 'horn', lo: 57, figure: [0, 2], gap: 0.32, pan: -0.1, db: 5 },
  'world:cubit': { tone: 'glass', lo: 76, figure: [3, 1, 4], gap: 0.09, pan: 0.35, db: -4.5 },
  'world:lantern-roads': {
    tone: 'pulse',
    lo: 69,
    figure: [0, 1, 2, 4],
    gap: 0.075,
    pan: -0.2,
    db: 13.5,
  },
  'world:eyeshot': { tone: 'pluck', lo: 72, figure: [2, 1], gap: 0.13, pan: 0.15, db: 5 },
  // The overview: the whole chord, struck upward across the field.
  system: {
    tone: 'glass',
    lo: 69,
    figure: [0, 1, 2, 3, 4, 5],
    gap: 0.07,
    pan: -0.6,
    spread: 1.2,
    db: 2,
  },
  earth: { tone: 'rhodes', lo: 55, figure: [0, 2, 4], gap: 0.11, pan: 0, spread: 0.4, db: 1 },
  // The Moon and the astronaut line: the motif's contour, alone.
  origin: { tone: 'glass', lo: 69, figure: [4, 3, 0], gap: 0.42, pan: 0.2, db: -1.5 },
  contact: { tone: 'bowl', lo: 62, figure: [0, 3], gap: 0.7, pan: -0.1, spread: 0.2, db: -0.5 },
};

/* --------------------------------------------------------------- flight */

/** Speed is mapped on a log scale: ~0.02 held, ~0.35-0.6 for a hop between
 * worlds (130-520 u/s), ~0.9 for the long jumps (2700-3000), 1 at 4000. */
const SPEED_REF = 25;
const SPEED_LOG = Math.log1p(4000 / SPEED_REF);
const flightLevel = (speed: number) =>
  speed > 0 ? Math.min(1, Math.log1p(speed / SPEED_REF) / SPEED_LOG) : 0;

/* ----------------------------------------------------------------- utils */

const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pink noise (Kellet), with the loop seam cross-faded. */
function pinkNoise(ctx: BaseAudioContext, seconds: number, seed: number) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  const r = rng(seed);
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  for (let i = 0; i < len; i++) {
    const w = r() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852;
    b3 = 0.8665 * b3 + w * 0.3104856;
    b4 = 0.55 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.016898;
    d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  const fade = Math.floor(ctx.sampleRate * 0.08);
  for (let i = 0; i < fade; i++) {
    const a = i / fade;
    d[len - fade + i] = d[len - fade + i]! * (1 - a) + d[i]! * a;
  }
  // The loop now ends where it begins; drop the duplicated head.
  return { buf, start: fade / ctx.sampleRate };
}

/** Stereo room: three bands decaying at their own rates (lows longest), a
 * handful of early reflections, decorrelated left and right. */
function roomImpulse(ctx: BaseAudioContext, seconds: number) {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * seconds);
  const buf = ctx.createBuffer(2, len, sr);
  const kLo = 1 - Math.exp((-2 * Math.PI * 450) / sr);
  const kHi = 1 - Math.exp((-2 * Math.PI * 3800) / sr);
  const rtLo = 3.6,
    rtMid = 2.7,
    rtHi = 1.1;
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    const r = rng(9001 + ch * 77);
    let lo = 0,
      hi = 0;
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const w = r() * 2 - 1;
      lo += kLo * (w - lo);
      hi += kHi * (w - hi);
      const eLo = Math.exp((-6.9 * t) / rtLo);
      const eMid = Math.exp((-6.9 * t) / rtMid);
      const eHi = Math.exp((-6.9 * t) / rtHi);
      // Diffuse onset: the tail builds over the first 60 ms.
      const build = Math.min(1, t / 0.06);
      d[i] = (lo * 1.6 * eLo + (hi - lo) * eMid + (w - hi) * 0.5 * eHi) * build;
    }
    const taps = ch === 0 ? [0.011, 0.019, 0.029, 0.043] : [0.014, 0.023, 0.034, 0.051];
    taps.forEach((tt, j) => {
      const i = Math.floor(tt * sr);
      if (i < len) d[i] = d[i]! + (j % 2 ? -0.5 : 0.6) / (1 + j);
    });
    const tail = Math.floor(sr * 0.25);
    for (let i = 0; i < tail; i++) d[len - tail + i] = d[len - tail + i]! * (1 - i / tail);
  }
  return buf;
}

/** Soft clipper: linear to 0.6, then a tanh knee that never passes `ceil`. */
function clipCurve(ceil: number) {
  const n = 4097;
  const c = new Float32Array(n);
  const knee = 0.6;
  const room = ceil - knee;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    const a = Math.abs(x);
    const y = a <= knee ? a : knee + room * Math.tanh((a - knee) / room);
    c[i] = Math.sign(x) * y;
  }
  return c;
}

/* ---------------------------------------------------------------- engine */

export interface SoundEngine {
  /** Starts the score with its first chord at context time `t`. */
  start(t: number): void;
  /** Schedules score events due before context time `horizon`. */
  schedule(horizon: number): void;
  /** Flight and zone controls for one animation frame, at context time `t`. */
  frame(speed: number, travel: number, key: string, t: number): void;
  /** Plays the arrival for a station; `energy` 0-1 is how far the flight was. */
  arrive(key: string, t: number, energy: number): void;
  /** Sets the black-hole presence and pad colour for a station when frames are not arriving. */
  zone(key: string, t: number): void;
  /** Fades the whole output in or out from context time `t`. */
  fade(up: boolean, t: number): void;
  /** Transient voices currently alive (each holds its nodes until its sources end). */
  live(): number;
}

interface Sustain {
  midi: number;
  env: GainNode;
  srcs: OscillatorNode[];
  nodes: AudioNode[];
  level: number;
}

/** `bed: false` mutes the score and air (used to audition the effects alone). */
export function createSoundEngine(
  ctx: BaseAudioContext,
  opts: { bed?: boolean } = {},
): SoundEngine {
  const c = ctx;
  const now0 = c.currentTime;
  let alive = 0;

  /* waves */
  const sawWave = (() => {
    const n = 40;
    const re = new Float32Array(n);
    const im = new Float32Array(n);
    for (let k = 1; k < n; k++) im[k] = 1 / Math.pow(k, 1.12) / (1 + Math.pow(k / 18, 2));
    return c.createPeriodicWave(re, im);
  })();
  const pulseWave = (() => {
    const n = 32;
    const re = new Float32Array(n);
    const im = new Float32Array(n);
    for (let k = 1; k < n; k++)
      re[k] = Math.sin(Math.PI * k * 0.25) / k / (1 + Math.pow(k / 14, 2));
    return c.createPeriodicWave(re, im);
  })();
  const setWave = (o: OscillatorNode, w: Tone['wave']) => {
    if (w === 'saw') o.setPeriodicWave(sawWave);
    else if (w === 'pulse') o.setPeriodicWave(pulseWave);
    else o.type = w;
  };

  /* helpers that create persistent nodes */
  const gain = (v: number) => {
    const g = c.createGain();
    g.gain.value = v;
    return g;
  };
  const biquad = (type: BiquadFilterType, f: number, q = 0.707) => {
    const b = c.createBiquadFilter();
    b.type = type;
    b.frequency.value = f;
    b.Q.value = q;
    return b;
  };
  const lfo = (f: number, depth: number, target: AudioParam, type: OscillatorType = 'sine') => {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const g = gain(depth);
    o.connect(g).connect(target);
    o.start(now0);
    return o;
  };

  /* master: the score is glued on its own bus; everything then sums into a
   * high-pass, a trim, a limiter that only catches stray peaks, a soft
   * clipper and the toggle fade */
  const mix = gain(1);
  const hp = biquad('highpass', 26, 0.6);
  const trim = gain(0.335);
  const limiter = c.createDynamicsCompressor();
  limiter.threshold.value = -4;
  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.2;
  const clip = c.createWaveShaper();
  clip.curve = clipCurve(0.85);
  const out = gain(0);
  mix.connect(hp).connect(trim).connect(limiter).connect(clip).connect(out);
  out.connect(c.destination);
  const glue = c.createDynamicsCompressor();
  glue.threshold.value = -20;
  glue.knee.value = 10;
  glue.ratio.value = 1.8;
  glue.attack.value = 0.08;
  glue.release.value = 0.6;
  glue.connect(mix);

  /* reverb */
  const verbIn = gain(1);
  const verbHp = biquad('highpass', 170);
  const verbLp = biquad('lowpass', 6500);
  const pre = c.createDelay(0.1);
  pre.delayTime.value = 0.028;
  const verb = c.createConvolver();
  verb.buffer = roomImpulse(c, 3.8);
  const verbOut = gain(0.9);
  verbIn.connect(verbHp).connect(verbLp).connect(pre).connect(verb).connect(verbOut).connect(mix);

  /* ping-pong delay (dotted eighth) */
  const echoIn = gain(1);
  const echoHp = biquad('highpass', 320);
  const dl = c.createDelay(2);
  const dr = c.createDelay(2);
  dl.delayTime.value = 0.75 * BEAT;
  dr.delayTime.value = 0.75 * BEAT;
  const fb = gain(0.36);
  const fbLp = biquad('lowpass', 2600);
  const echoMerge = c.createChannelMerger(2);
  const echoOut = gain(0.55);
  echoIn.connect(echoHp).connect(dl);
  dl.connect(dr);
  dr.connect(fbLp).connect(fb).connect(dl);
  dl.connect(echoMerge, 0, 0);
  dr.connect(echoMerge, 0, 1);
  echoMerge.connect(echoOut);
  echoOut.connect(mix);
  echoOut.connect(verbIn);

  /* bed: zone level and flight duck in series */
  const bed = gain(1);
  const bedMute = gain(opts.bed === false ? 0 : 1);
  const duck = gain(1);
  bed.connect(duck).connect(bedMute).connect(glue);
  const bedVerb = gain(0.55);
  bedMute.connect(bedVerb).connect(verbIn);

  /* pad: bus, low-pass (score base + LFO + flight), chorus */
  const padBus = gain(1);
  const padHp = biquad('highpass', 110);
  const padLp = biquad('lowpass', FORM[0]!.cutoff, 0.9);
  const padOut = gain(1);
  padBus.connect(padHp).connect(padLp).connect(padOut).connect(bed);
  lfo(1 / 23, 210, padLp.frequency);
  const padOpen = c.createConstantSource();
  padOpen.offset.value = 0;
  padOpen.connect(padLp.frequency);
  padOpen.start(now0);
  // Chorus: two modulated short delays, one per side.
  const split = c.createChannelSplitter(2);
  const merge = c.createChannelMerger(2);
  const chL = c.createDelay(0.05);
  const chR = c.createDelay(0.05);
  chL.delayTime.value = 0.012;
  chR.delayTime.value = 0.017;
  lfo(0.17, 0.0024, chL.delayTime);
  lfo(0.13, 0.0031, chR.delayTime, 'triangle');
  padLp.connect(split);
  split.connect(chL, 0);
  split.connect(chR, 1);
  chL.connect(merge, 0, 0);
  chR.connect(merge, 0, 1);
  const chorusWet = gain(0.42);
  merge.connect(chorusWet).connect(bed);

  /* bass and sub */
  const bassBus = gain(1);
  const bassLp = biquad('lowpass', 240, 0.6);
  bassBus.connect(bassLp).connect(bed);

  /* halo */
  const haloBus = gain(1);
  const haloLp = biquad('lowpass', 5200);
  haloBus.connect(haloLp).connect(bed);
  const haloVerb = gain(0.8);
  haloLp.connect(haloVerb).connect(verbIn);

  /* motif and arpeggio */
  const motifBus = gain(1);
  motifBus.connect(bed);
  const motifSend = gain(0.7);
  motifBus.connect(motifSend);
  motifSend.connect(echoIn);
  motifSend.connect(verbIn);
  const arpBus = gain(1);
  const arpLp = biquad('lowpass', 2400);
  arpBus.connect(arpLp).connect(bed);
  const arpSend = gain(0.8);
  arpLp.connect(arpSend);
  arpSend.connect(echoIn);
  arpSend.connect(verbIn);

  /* noise sources: two pink loops of different lengths, so the texture
   * never lines up into an audible repeat */
  const pinkA = pinkNoise(c, 5.3, 11);
  const pinkB = pinkNoise(c, 6.7, 23);
  const loopNoise = (p: { buf: AudioBuffer; start: number }) => {
    const s = c.createBufferSource();
    s.buffer = p.buf;
    s.loop = true;
    s.loopStart = p.start;
    s.loopEnd = p.buf.duration;
    s.start(now0, p.start);
    return s;
  };
  const nA = loopNoise(pinkA);
  const nB = loopNoise(pinkB);
  const noiseSt = c.createChannelMerger(2);
  nA.connect(noiseSt, 0, 0);
  nB.connect(noiseSt, 0, 1);

  /* air: a faint band of moving noise under the bed */
  const airBp = biquad('bandpass', 3400, 0.6);
  lfo(1 / 37, 1500, airBp.frequency);
  const air = gain(0.095);
  noiseSt.connect(airBp).connect(air).connect(bed);

  /* flight: wind band, whistle, flutter, rumble, pan */
  const sfx = gain(1);
  sfx.connect(mix);
  const sfxVerb = gain(0.3);
  sfx.connect(sfxVerb).connect(verbIn);
  const accent = gain(1.5);
  accent.connect(mix);
  const accentVerb = gain(0.6);
  accent.connect(accentVerb).connect(verbIn);
  const accentEcho = gain(0.16);
  accent.connect(accentEcho).connect(echoIn);
  const windBp = biquad('bandpass', 300, 0.65);
  const windLp = biquad('lowpass', 900, 0.5);
  const windAmp = gain(0);
  const windPan = c.createStereoPanner();
  noiseSt.connect(windBp).connect(windLp).connect(windAmp).connect(windPan).connect(sfx);
  // Turbulence: two incommensurate LFOs summed into the wind's gain.
  const flutter = gain(0);
  const f1 = c.createOscillator();
  const f2 = c.createOscillator();
  f1.frequency.value = 4.7;
  f2.frequency.value = 7.9;
  const f2g = gain(0.6);
  f1.connect(flutter);
  f2.connect(f2g).connect(flutter);
  flutter.connect(windAmp.gain);
  f1.start(now0);
  f2.start(now0);
  const whistleBp = biquad('bandpass', 400, 7);
  const whistle = gain(0);
  noiseSt.connect(whistleBp).connect(whistle).connect(windPan);
  const rumbleLp = biquad('lowpass', 75, 0.8);
  nA.connect(rumbleLp);
  const rumble = gain(0);
  rumbleLp.connect(rumble).connect(sfx);

  /* presence: the black hole */
  const presence = gain(0);
  presence.connect(mix);
  const presenceVerb = gain(0.25);
  presence.connect(presenceVerb).connect(verbIn);
  const droneLp = biquad('lowpass', 260, 4);
  lfo(0.043, 120, droneLp.frequency);
  const droneA = c.createOscillator();
  const droneB = c.createOscillator();
  droneA.setPeriodicWave(sawWave);
  droneB.setPeriodicWave(sawWave);
  droneA.frequency.value = hz(26);
  droneB.frequency.value = hz(26);
  droneB.detune.value = 9;
  const droneG = gain(0.5);
  // Thin the 37 Hz fundamental: the harmonics carry the pitch on small speakers.
  const droneHp = biquad('highpass', 48, 0.7);
  droneA.connect(droneLp);
  droneB.connect(droneLp);
  droneLp.connect(droneHp).connect(droneG).connect(presence);
  droneA.start(now0);
  droneB.start(now0);
  const holeRumble = gain(0.2);
  lfo(0.11, 0.12, holeRumble.gain);
  rumbleLp.connect(holeRumble).connect(presence);
  const hissBp = biquad('bandpass', 2600, 0.9);
  const hiss = gain(0.08);
  lfo(0.061, 0.045, hiss.gain);
  const hissPan = c.createStereoPanner();
  lfo(0.07, 0.75, hissPan.pan);
  nB.connect(hissBp).connect(hiss).connect(hissPan).connect(presence);

  /* -------------------------------------------------------- transient voices */

  /** Disconnect every node of a voice once its last source has ended.
   * `counted` voices (sustains) were counted when they started. */
  const own = (srcs: AudioScheduledSourceNode[], nodes: AudioNode[], counted = false) => {
    if (!counted) alive++;
    let left = srcs.length;
    const done = () => {
      if (--left > 0) return;
      for (const n of nodes) n.disconnect();
      alive--;
    };
    for (const s of srcs) s.onended = done;
  };

  /** A sustained note of `voices` detuned oscillators, each panned. */
  const sustain = (
    dest: AudioNode,
    midi: number,
    t: number,
    attack: number,
    level: number,
    wave: Tone['wave'],
    detunes: readonly number[],
    pans: readonly number[],
  ): Sustain => {
    const env = c.createGain();
    env.gain.setValueAtTime(0, t);
    // Two-stage swell: most of the level by the end of the attack, the rest
    // over the following seconds, so a held note keeps opening.
    env.gain.setTargetAtTime(level * 0.82, t, attack / 3);
    env.gain.setTargetAtTime(level, t + attack, attack);
    env.connect(dest);
    const srcs: OscillatorNode[] = [];
    const nodes: AudioNode[] = [env];
    detunes.forEach((cents, i) => {
      const o = c.createOscillator();
      setWave(o, wave);
      o.frequency.value = hz(midi);
      o.detune.value = cents;
      const p = c.createStereoPanner();
      p.pan.value = pans[i] ?? 0;
      o.connect(p).connect(env);
      o.start(t);
      srcs.push(o);
      nodes.push(o, p);
    });
    alive++;
    return { midi, env, srcs, nodes, level };
  };

  const release = (v: Sustain, t: number, time: number) => {
    v.env.gain.setTargetAtTime(0, t, time / 5);
    const end = t + time * 1.5;
    own(v.srcs, v.nodes, true);
    for (const o of v.srcs) o.stop(end);
  };

  /** A short band-passed noise burst, started and stopped here. */
  let burstSeed = 1;
  const burst = (
    t: number,
    f: number,
    q: number,
    level: number,
    decay: number,
    dest: AudioNode,
    srcs: AudioScheduledSourceNode[],
    nodes: AudioNode[],
  ) => {
    const s = c.createBufferSource();
    s.buffer = pinkA.buf;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = f;
    bp.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level, t + 0.0015);
    g.gain.setTargetAtTime(0, t + 0.0015, decay / 4);
    s.connect(bp).connect(g).connect(dest);
    // A different stretch of the noise each time.
    burstSeed = (burstSeed * 7919) % 4093;
    s.start(t, (burstSeed / 4093) * (pinkA.buf.duration - 2 * decay - 0.1));
    s.stop(t + decay * 2 + 0.05);
    srcs.push(s);
    nodes.push(s, bp, g);
    return bp;
  };

  /** A struck or plucked note on one of the TONES. */
  const strike = (
    name: ToneName,
    midi: number,
    t: number,
    vel: number,
    pan: number,
    dest: AudioNode,
  ) => {
    const tone = TONES[name];
    const f = hz(midi);
    const peak = tone.gain * vel;
    const end = t + tone.attack + tone.decay;
    const srcs: AudioScheduledSourceNode[] = [];
    const nodes: AudioNode[] = [];
    const osc = (freq: number) => {
      const o = c.createOscillator();
      o.frequency.value = freq;
      o.start(t);
      o.stop(end);
      srcs.push(o);
      nodes.push(o);
      return o;
    };
    const p = c.createStereoPanner();
    p.pan.value = pan;
    p.connect(dest);
    nodes.push(p);
    let head: AudioNode = p;
    if (tone.filter) {
      const lp = c.createBiquadFilter();
      lp.type = 'lowpass';
      lp.Q.value = 0.8;
      const [a, b, r] = tone.filter;
      lp.frequency.setValueAtTime(a, t);
      lp.frequency.linearRampToValueAtTime(b, t + tone.attack + 0.02);
      lp.frequency.setTargetAtTime(r, t + tone.attack + 0.02, tone.decay / 4);
      lp.connect(p);
      nodes.push(lp);
      head = lp;
    }
    const amp = c.createGain();
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(peak, t + tone.attack);
    amp.gain.setTargetAtTime(0, t + tone.attack, tone.decay / 6.9);
    amp.connect(head);
    nodes.push(amp);
    const carriers = tone.chorus ? [0, tone.chorus] : [0];
    for (const cents of carriers) {
      const o = osc(f);
      setWave(o, tone.wave);
      o.detune.setValueAtTime(cents, t);
      if (tone.drift) o.detune.linearRampToValueAtTime(cents + tone.drift, end);
      const g = c.createGain();
      g.gain.value = cents ? 0.6 : 1;
      o.connect(g).connect(amp);
      nodes.push(g);
      if (tone.fm) {
        const [ratio, index, tau, rest] = tone.fm;
        const m = osc(f * ratio);
        const dev = c.createGain();
        dev.gain.setValueAtTime(index * f * ratio, t);
        dev.gain.setTargetAtTime(rest * f * ratio, t + 0.001, tau);
        m.connect(dev).connect(o.frequency);
        nodes.push(dev);
      }
    }
    for (const [ratio, rel, scale] of tone.partials ?? []) {
      if (f * ratio > 16000) continue;
      const o = osc(f * ratio);
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak * rel, t + tone.attack);
      g.gain.setTargetAtTime(0, t + tone.attack, (tone.decay * scale) / 6.9);
      o.connect(g).connect(head);
      nodes.push(g);
    }
    if (tone.noise) {
      const [nf, q, ng, nd] = tone.noise;
      burst(t, nf, q, ng * vel, nd, head, srcs, nodes);
    }
    own(srcs, nodes);
  };

  /** A low tuned thump that drops onto `midi`. */
  const thump = (midi: number, t: number, level: number, length: number) => {
    if (level <= 0.001) return;
    const o = c.createOscillator();
    o.frequency.setValueAtTime(hz(midi + 12), t);
    o.frequency.setTargetAtTime(hz(midi), t, length * 0.08);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level, t + 0.006);
    g.gain.setTargetAtTime(0, t + 0.006, length / 6.9);
    o.connect(g).connect(sfx);
    o.start(t);
    o.stop(t + length + 0.05);
    own([o], [o, g]);
  };

  /* --------------------------------------------------------------- score state */

  let started = false;
  let chordIndex = 0;
  let cycle = 0;
  let nextChordAt = 0;
  /** Recent chord starts, newest last: [time, index]. */
  const history: [number, number][] = [];
  const pads: (Sustain | null)[] = [null, null, null, null];
  const halos: (Sustain | null)[] = [null, null];
  let bass: Sustain[] = [];
  interface Ev {
    t: number;
    kind: 0 | 1;
    midi: number;
    vel: number;
    pan: number;
  }
  const queue: Ev[] = [];
  let qHead = 0;
  const human = rng(4242);

  const PAD_PANS = [-0.5, 0.35, -0.2, 0.55] as const;
  const PAD_DETUNE = [5, 7, 4, 6] as const;

  const scheduleChord = (t: number) => {
    const chord = PROGRESSION[chordIndex]!;
    const sec = FORM[cycle % FORM.length]!;
    const first = cycle === 0 && chordIndex === 0;
    history.push([t, chordIndex]);
    if (history.length > 4) history.shift();
    padLp.frequency.setTargetAtTime(sec.cutoff, t, 3);

    // Pad: hold common tones; moving voices cross-fade, top voice first.
    chord.voices.forEach((m, i) => {
      const held = pads[i];
      if (held && held.midi === m) {
        held.env.gain.setTargetAtTime(held.level * 0.84, t - 0.5, 0.3);
        held.env.gain.setTargetAtTime(held.level, t + 0.4, 1.6);
        return;
      }
      const lag = first ? i * 1.3 : (3 - i) * 0.35 + human() * 0.15;
      if (held) release(held, t + lag + 0.2, 3.5);
      const d = PAD_DETUNE[i]!;
      const pan = PAD_PANS[i]!;
      pads[i] = sustain(
        padBus,
        m,
        t + lag,
        first ? 4 : 2.6,
        0.06 / (1 + i * 0.12),
        'saw',
        [-d, d],
        [pan - 0.3, pan + 0.3],
      );
    });

    // Halo: the top two voices an octave up, on sine.
    for (let i = 0; i < 2; i++) {
      const m = chord.voices[i + 2]! + 12;
      const held = halos[i];
      const want = sec.halo[chordIndex];
      if (held && (!want || held.midi !== m)) {
        release(held, t, 4);
        halos[i] = null;
      }
      if (want && !halos[i]) {
        halos[i] = sustain(
          haloBus,
          m,
          t + 0.6 + i,
          5,
          0.04,
          'sine',
          [i ? 3 : -3],
          [i ? 0.6 : -0.6],
        );
      }
    }

    // Bass: sine fundamental for weight, a filtered saw for small speakers.
    for (const b of bass) release(b, t, 2.5);
    bass = [];
    if (sec.bass[chordIndex]) {
      bass.push(sustain(bassBus, chord.bass, t, 1.6, 0.085, 'sine', [0], [0]));
      bass.push(sustain(bassBus, chord.bass, t, 1.9, 0.05, 'saw', [-4, 4], [-0.15, 0.15]));
    }

    // Motif and arpeggio go to the queue, played when their time comes.
    const from = queue.length;
    const m = sec.motif[chordIndex];
    if (m && !first) {
      const [name, shift] = m;
      MOTIF[name].forEach(([beat, midi, vel], j) => {
        queue.push({
          t: t + beat * BEAT + (human() - 0.5) * 0.03,
          kind: 0,
          midi: midi + shift,
          vel: vel * (shift ? 0.7 : 1),
          pan: [-0.18, 0.2, 0, 0.12][j] ?? 0,
        });
      });
    }
    if (sec.arp[chordIndex]) {
      const tones = chordTones(chordIndex, 69, 88);
      const steps = chord.beats * 2;
      for (let s = 0; s < steps; s++) {
        const idx = ARP_ORDER[s % ARP_ORDER.length]!;
        const swell = Math.sin((Math.PI * (s + 0.5)) / steps);
        queue.push({
          t: t + s * 0.5 * BEAT + (human() - 0.5) * 0.012,
          kind: 1,
          midi: tones[Math.min(idx, tones.length - 1)]!,
          vel: 0.35 + 0.65 * swell,
          pan: s % 2 ? 0.35 : -0.35,
        });
      }
    }
    const added = queue.splice(from).sort((a, b) => a.t - b.t);
    for (const e of added) queue.push(e);
  };

  /** Chord tones (bass and voices, every octave) in [lo, hi], ascending. */
  const chordTones = (index: number, lo: number, hi: number) => {
    const ch = PROGRESSION[index]!;
    const pcs = new Set([ch.bass % 12, ...ch.voices.map((v) => v % 12)]);
    const out: number[] = [];
    for (let m = lo; m <= hi; m++) if (pcs.has(m % 12)) out.push(m);
    return out;
  };

  /** The chord sounding at `t`, and when the next change lands. */
  const chordAt = (t: number) => {
    let idx = history.length ? history[0]![1] : 0;
    for (const [ht, hi] of history) if (ht <= t) idx = hi;
    let next = Infinity;
    for (const [ht] of history) if (ht > t) next = Math.min(next, ht);
    if (next === Infinity && started) next = nextChordAt;
    return { idx, next };
  };

  /** Tones safe for an accent at `t` that rings ~2 s: if the chord is about
   * to change, only the tones the two chords share (or the next chord). */
  const safeTones = (t: number, lo: number) => {
    const { idx, next } = chordAt(t);
    const hi = lo + 30;
    const cur = chordTones(idx, lo, hi);
    if (next - t > 2.2) return cur;
    const nIdx = (idx + 1) % PROGRESSION.length;
    const nxt = chordTones(nIdx, lo, hi);
    const shared = cur.filter((m) => nxt.includes(m));
    if (shared.length >= 3) return shared;
    return next - t < 1.2 ? nxt : cur;
  };

  /* ------------------------------------------------------- flight state */

  let lastN = -1;
  let lastUpdate = -1;
  let lastPan = 0;
  let lastPresence = -1;
  let peak = 0;
  let arrivedKey = '';
  let lastArrival = -10;
  let nearSince = -1;
  let nearKey = '';
  let primed = false;
  const visits = new Map<string, number>();

  const presenceFor = (key: string, travel: number) =>
    key === 'hero' ? Math.max(0, 1 - travel * 1.8) : key === 'system' ? 0.22 : 0;

  const setPresence = (v: number, t: number) => {
    if (Math.abs(v - lastPresence) < 0.01) return;
    lastPresence = v;
    presence.gain.setTargetAtTime(v * 0.3, t, 0.7);
    // The bed darkens and steps back while the hole is on screen.
    bed.gain.setTargetAtTime(1 - 0.22 * v, t, 0.9);
  };

  const engine: SoundEngine = {
    start(t) {
      if (started) return;
      started = true;
      nextChordAt = t;
    },

    schedule(horizon) {
      if (!started) return;
      while (nextChordAt < horizon) {
        scheduleChord(nextChordAt);
        nextChordAt += PROGRESSION[chordIndex]!.beats * BEAT;
        chordIndex = (chordIndex + 1) % PROGRESSION.length;
        if (chordIndex === 0) cycle++;
      }
      while (qHead < queue.length && queue[qHead]!.t < horizon) {
        const e = queue[qHead++]!;
        if (e.kind === 0) strike('glass', e.midi, e.t, e.vel * 0.42, e.pan, motifBus);
        else strike('mallet', e.midi, e.t, e.vel * 0.16, e.pan, arpBus);
      }
      if (qHead > 64) {
        queue.splice(0, qHead);
        qHead = 0;
      }
    },

    frame(speed, travel, key, t) {
      const n = flightLevel(speed);
      // Control changes at most ~30 times a second, and only when they move.
      if (t - lastUpdate > 0.033 && (Math.abs(n - lastN) > 0.003 || t - lastUpdate > 0.5)) {
        lastUpdate = t;
        lastN = n;
        const gate = smooth(0.05, 0.16, n);
        windAmp.gain.setTargetAtTime(2.6 * Math.pow(n, 1.25) * gate, t, 0.05);
        flutter.gain.setTargetAtTime(0.45 * n * n * gate, t, 0.08);
        const centre = 170 * Math.pow(2, 5 * n);
        windBp.frequency.setTargetAtTime(centre, t, 0.06);
        windLp.frequency.setTargetAtTime(Math.min(16000, centre * 2.6 + 400), t, 0.06);
        whistleBp.frequency.setTargetAtTime(240 * Math.pow(2, 2.3 * n), t, 0.08);
        whistle.gain.setTargetAtTime(1.2 * n * n * gate, t, 0.08);
        rumble.gain.setTargetAtTime(0.9 * smooth(0.45, 0.95, n), t, 0.12);
        padOpen.offset.setTargetAtTime(1100 * n, t, 0.25);
        duck.gain.setTargetAtTime(1 - 0.28 * n, t, 0.2);
        const pan = (travel - 0.5) * 0.7 * (travel > 0 ? 1 : 0);
        if (Math.abs(pan - lastPan) > 0.01) {
          lastPan = pan;
          windPan.pan.setTargetAtTime(pan, t, 0.3);
        }
        setPresence(presenceFor(key, travel), t);
      }

      // Arrival: settled near a station the camera was not already at.
      if (!primed) {
        primed = true;
        arrivedKey = key;
      }
      if (speed > peak) peak = speed;
      // With no motion seen (reduced motion cuts at travel 0.5, speed 0) the
      // camera cannot say it has stopped: wait for the visitor to stay on the
      // new shot, and space the accents out.
      const still = peak < 3;
      const near = still || travel < 0.1 || travel > 0.9;
      const settled = speed < Math.max(3, Math.min(0.1 * peak, 40));
      if (near && settled && key !== arrivedKey) {
        if (nearSince < 0 || nearKey !== key) {
          nearSince = t;
          nearKey = key;
        }
        if (t - nearSince >= (still ? 0.8 : 0) && t - lastArrival > (still ? 2 : 1)) {
          arrivedKey = key;
          lastArrival = t;
          nearSince = -1;
          engine.arrive(key, t + 0.03, flightLevel(peak));
          peak = 0;
        }
      } else {
        nearSince = -1;
        if (near && settled && travel === 0) peak = 0;
      }
    },

    arrive(key, t, energy) {
      const e = clamp01(energy);
      const visit = visits.get(key) ?? 0;
      visits.set(key, visit + 1);
      const { idx } = chordAt(t);
      const root = PROGRESSION[idx]!.bass;
      if (key === 'hero') {
        // Back at the hole: a long drop onto the low root and a closing roar.
        thump(root < 33 ? root + 12 : root, t, 0.2 + 0.15 * e, 2.6);
        const srcs: AudioScheduledSourceNode[] = [];
        const nodes: AudioNode[] = [];
        const bp = burst(t, 300, 0.7, 0.65 + 0.5 * e, 1.6, sfx, srcs, nodes);
        bp.frequency.setValueAtTime(900, t);
        bp.frequency.setTargetAtTime(90, t, 0.4);
        own(srcs, nodes);
        return;
      }
      if (key === 'belt') {
        // Grit: a scatter of small stones across the field, then one ping.
        const r = rng(77 + visit);
        let tt = t;
        for (let i = 0; i < 9; i++) {
          const srcs: AudioScheduledSourceNode[] = [];
          const nodes: AudioNode[] = [];
          const p = c.createStereoPanner();
          p.pan.value = (r() * 2 - 1) * 0.85;
          p.connect(accent);
          nodes.push(p);
          const level = (0.38 - i * 0.03) * (0.6 + 0.4 * e);
          burst(tt, 1500 + r() * 3800, 5, level, 0.06, p, srcs, nodes);
          own(srcs, nodes);
          tt += 0.04 + r() * 0.14 * (1 + i * 0.12);
        }
        const tones = safeTones(t, 76);
        strike('glass', tones[1 + (visit % 3)] ?? 81, t + 0.35, 0.3, 0.2, accent);
        thump(root + 12, t, 0.07 * e, 0.6);
        return;
      }
      const sig = SIGNATURES[key] ?? SIGNATURES['world:cubit']!;
      const tones = safeTones(t, sig.lo);
      // Later visits lift the figure one chord tone, so a return differs.
      const lift = visit % 3;
      const count = sig.figure.length;
      // A figure of many notes is a chord: keep its sum near a single strike.
      const norm = 1 / Math.sqrt(Math.max(1, count / 2));
      const trim = Math.pow(10, (sig.db ?? 0) / 20);
      sig.figure.forEach((step, i) => {
        const midi = tones[Math.min(tones.length - 1, step + lift)] ?? sig.lo;
        const pan = sig.pan + (sig.spread ?? 0) * (count > 1 ? i / (count - 1) : 0);
        const vel = (0.7 + 0.3 * e) * (1 - i * 0.07) * norm;
        strike(sig.tone, midi, t + i * sig.gap, vel * 0.55 * trim, pan, accent);
      });
      // Long jumps land with weight; short hops barely touch down.
      const weight = key === 'world:voidreach' ? 0.5 + 0.5 * e : e * e;
      thump(root < 33 ? root + 12 : root, t, 0.2 * weight, 1.1);
    },

    zone(key, t) {
      setPresence(presenceFor(key, 0), t);
    },

    fade(up, t) {
      const g = out.gain;
      g.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t);
      if (up) {
        g.setTargetAtTime(1, t, 0.9);
        // Frames are ignored while off: take the current station as given
        // rather than greeting it with an arrival.
        primed = false;
        peak = 0;
      } else g.linearRampToValueAtTime(0, t + 1);
    },

    live: () => alive,
  };

  return engine;
}

/* ------------------------------------------------------------------ live */

let ctx: AudioContext | null = null;
let engine: SoundEngine | null = null;
let on = false;
let ticker = 0;
let suspendTimer = 0;
let fallbackTimer = 0;
/** Context time of the last soundFrame; station events stand in when stale. */
let lastFrameAt = -10;
const arrivals: [string, number, number][] = [];

const tick = () => {
  if (ctx && engine && ctx.state === 'running') engine.schedule(ctx.currentTime + LOOKAHEAD);
};

/**
 * Per-frame flight input. `speed` is the smoothed camera speed (world units/s),
 * `travel` is 0 at a station and rises toward 1 on the way to the next, `key`
 * is the nearest station. Returns at once while sound is off; never allocates.
 */
export function soundFrame(speed: number, travel: number, key: string): void {
  if (!on || !ctx || !engine || ctx.state !== 'running') return;
  const t = ctx.currentTime;
  lastFrameAt = t;
  engine.frame(speed, travel, key, t);
}

export function initSound() {
  const btn = document.querySelector<HTMLButtonElement>('[data-sound]');
  if (!btn) return;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) {
    btn.hidden = true;
    return;
  }

  const set = (value: boolean) => {
    on = value;
    btn.setAttribute('aria-pressed', String(on));
    clearTimeout(suspendTimer);
    if (on) {
      // iOS: the ringer switch mutes "ambient" audio; this was asked for.
      const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
      if (session) session.type = 'playback';
      if (!ctx) {
        ctx = new AC({ latencyHint: 'playback' });
        void ctx.resume();
        engine = createSoundEngine(ctx);
        if (import.meta.env.DEV) {
          // Dev builds log arrivals for the live checks.
          const arrive = engine.arrive;
          engine.arrive = (k, t, e) => {
            arrivals.push([k, +t.toFixed(2), +e.toFixed(2)]);
            arrive(k, t, e);
          };
        }
        engine.start(ctx.currentTime + 0.15);
        ctx.addEventListener('statechange', () => {
          if (on && ctx && ctx.state !== 'running' && !document.hidden) void ctx.resume();
        });
      } else void ctx.resume();
      engine!.fade(true, ctx.currentTime);
      clearInterval(ticker);
      ticker = window.setInterval(tick, TICK_MS);
      tick();
    } else if (ctx && engine) {
      engine.fade(false, ctx.currentTime);
      const c = ctx;
      suspendTimer = window.setTimeout(() => {
        if (on) return;
        clearInterval(ticker);
        void c.suspend();
        // Hand the iOS session back so other apps' audio is not held off.
        const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
        if (session) session.type = 'auto';
      }, 1200);
    }
  };
  btn.addEventListener('click', () => set(!on));

  document.addEventListener('orbit:station', (e) => {
    if (!on || !ctx || !engine) return;
    const key = (e as CustomEvent<string>).detail ?? '';
    if (ctx.currentTime - lastFrameAt < 0.5) return;
    // No per-frame input: the event fires mid-flight, so wait for the
    // camera to settle, and drop the accent if the flight carries on past.
    engine.zone(key, ctx.currentTime);
    clearTimeout(fallbackTimer);
    fallbackTimer = window.setTimeout(() => {
      if (on && ctx && engine) engine.arrive(key, ctx.currentTime + 0.03, 0.5);
    }, 900);
  });

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) void ctx.suspend();
    else if (on) void ctx.resume();
  });

  if (import.meta.env.DEV)
    Object.assign(window, {
      __sound: { frame: soundFrame, live: () => engine?.live() ?? 0, ctx: () => ctx, arrivals },
    });
}
