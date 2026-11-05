/**
 * Optional sound, off until asked for. Everything is synthesized here: a low
 * drone with a slowly breathing filter, a wash of filtered noise, sparse
 * pentatonic chimes through a generated reverb, and a soft whoosh each time
 * the camera leaves for a new station. No audio files.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let verb: ConvolverNode | null = null;
let on = false;
let chimeTimer = 0;

function impulse(c: AudioContext, seconds: number) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
  }
  return buf;
}

function build() {
  const c = new AudioContext();
  ctx = c;
  master = c.createGain();
  master.gain.value = 0;
  const comp = c.createDynamicsCompressor();
  master.connect(comp).connect(c.destination);
  verb = c.createConvolver();
  verb.buffer = impulse(c, 5);
  const wet = c.createGain();
  wet.gain.value = 0.55;
  verb.connect(wet).connect(master);

  // Drone: fifths around A1, through a breathing low-pass.
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 340;
  lp.Q.value = 0.7;
  const drone = c.createGain();
  drone.gain.value = 0.22;
  lp.connect(drone).connect(master);
  drone.connect(verb);
  for (const [f, type, g] of [
    [55, 'sine', 0.55],
    [82.4, 'sawtooth', 0.08],
    [110.3, 'sawtooth', 0.06],
    [164.8, 'triangle', 0.08],
  ] as const) {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = f;
    o.detune.value = (Math.random() - 0.5) * 8;
    const og = c.createGain();
    og.gain.value = g;
    o.connect(og).connect(lp);
    o.start();
  }
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.045;
  const lfoG = c.createGain();
  lfoG.gain.value = 170;
  lfo.connect(lfoG).connect(lp.frequency);
  lfo.start();

  // Space wind: pink-ish noise through a slow band-pass sweep.
  const noise = c.createBufferSource();
  const nb = c.createBuffer(1, c.sampleRate * 4, c.sampleRate);
  const nd = nb.getChannelData(0);
  let b = 0;
  for (let i = 0; i < nd.length; i++) {
    b = 0.985 * b + 0.015 * (Math.random() * 2 - 1);
    nd[i] = b * 6;
  }
  noise.buffer = nb;
  noise.loop = true;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 600;
  bp.Q.value = 0.6;
  const ng = c.createGain();
  ng.gain.value = 0.05;
  noise.connect(bp).connect(ng).connect(master);
  ng.connect(verb);
  noise.start();
  const lfo2 = c.createOscillator();
  lfo2.frequency.value = 0.03;
  const lfo2G = c.createGain();
  lfo2G.gain.value = 380;
  lfo2.connect(lfo2G).connect(bp.frequency);
  lfo2.start();
}

function chime() {
  if (!ctx || !verb || !master || !on) return;
  const scale = [440, 493.9, 587.3, 659.3, 784, 880, 987.8, 1174.7];
  const f = scale[Math.floor(Math.random() * scale.length)]!;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.value = f;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.035, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
  o.connect(g);
  g.connect(verb);
  g.connect(master);
  o.start(t);
  o.stop(t + 3.6);
  chimeTimer = window.setTimeout(chime, 2200 + Math.random() * 5200);
}

export function whoosh(strength = 1) {
  if (!ctx || !master || !on) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  const len = ctx.sampleRate * 1.6;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 1.4;
  f.frequency.setValueAtTime(220, t);
  f.frequency.exponentialRampToValueAtTime(2400, t + 0.7);
  f.frequency.exponentialRampToValueAtTime(300, t + 1.5);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.06 * strength, t + 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.55);
  src.connect(f).connect(g).connect(master);
  if (verb) g.connect(verb);
  src.start(t);
}

export function blip() {
  if (!ctx || !master || !on) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(1320, t);
  o.frequency.exponentialRampToValueAtTime(1980, t + 0.06);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.018, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  o.connect(g).connect(master);
  if (verb) g.connect(verb);
  o.start(t);
  o.stop(t + 0.16);
}

export function initSound() {
  const btn = document.querySelector<HTMLButtonElement>('[data-sound]');
  if (!btn) return;
  const set = (value: boolean) => {
    on = value;
    btn.setAttribute('aria-pressed', String(on));
    btn.querySelector('[data-sound-label]')!.textContent = on ? 'Sound on' : 'Sound off';
    if (on) {
      if (!ctx) build();
      ctx!.resume();
      master!.gain.cancelScheduledValues(ctx!.currentTime);
      master!.gain.setTargetAtTime(0.9, ctx!.currentTime, 0.8);
      clearTimeout(chimeTimer);
      chimeTimer = window.setTimeout(chime, 1200);
    } else if (ctx && master) {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      clearTimeout(chimeTimer);
    }
  };
  btn.addEventListener('click', () => set(!on));
  let lastBlip = 0;
  document.addEventListener('pointerover', (e) => {
    const el = (e.target as HTMLElement).closest('a, button');
    if (!el || performance.now() - lastBlip < 70) return;
    lastBlip = performance.now();
    blip();
  });
  document.addEventListener('orbit:station', () => whoosh());
}
