/**
 * Math & utility helpers.
 * All game physics is written to be frame-rate independent: damping uses
 * `damp(k, dt)` so behaviour is identical at 60Hz, 144Hz or 240Hz.
 */

export const TAU = Math.PI * 2;
export const PI = Math.PI;
export const DEG = Math.PI / 180;

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => (b - a === 0 ? 0 : (v - a) / (b - a));
export const smoothstep = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0 || 1e-9));
  return t * t * (3 - 2 * t);
};
export const smootherstep = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0 || 1e-9));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/** Frame-rate independent exponential decay factor. `v *= expDecay(rate, dt)` */
export const expDecay = (rate, dt) => Math.exp(-rate * dt);
/** Frame-rate independent lerp toward a target. */
export const damp = (a, b, rate, dt) => b + (a - b) * Math.exp(-rate * dt);

export const sign = Math.sign;
export const hypot = Math.hypot;

export const len = (x, y) => Math.sqrt(x * x + y * y);
export const len2 = (x, y) => x * x + y * y;
export const dist = (ax, ay, bx, by) => Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
export const dist2 = (ax, ay, bx, by) => (ax - bx) ** 2 + (ay - by) ** 2;

/** Shortest signed angular difference b - a, in (-PI, PI]. */
export function angleDelta(a, b) {
  let d = (b - a) % TAU;
  if (d > PI) d -= TAU;
  if (d < -PI) d += TAU;
  return d;
}
export function angleLerp(a, b, t) {
  return a + angleDelta(a, b) * t;
}
export function angleDamp(a, b, rate, dt) {
  return a + angleDelta(a, b) * (1 - Math.exp(-rate * dt));
}

/** Deterministic, fast PRNG (mulberry32). */
export function makeRng(seed = 0x9e3779b9) {
  let s = seed >>> 0;
  const f = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  f.range = (a, b) => a + f() * (b - a);
  f.int = (a, b) => Math.floor(a + f() * (b - a + 1));
  f.pick = (arr) => arr[Math.floor(f() * arr.length) % arr.length];
  f.sign = () => (f() < 0.5 ? -1 : 1);
  f.angle = () => f() * TAU;
  f.gauss = () => {
    // Box-Muller, single output.
    let u = 0;
    while (u === 0) u = f();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * f());
  };
  f.reseed = (n) => { s = n >>> 0; };
  return f;
}

export const rng = makeRng((Math.random() * 0xffffffff) >>> 0);
export const rand = (a = 1, b) => (b === undefined ? rng() * a : a + rng() * (b - a));
export const randInt = (a, b) => Math.floor(a + rng() * (b - a + 1));
export const randSign = () => (rng() < 0.5 ? -1 : 1);
export const pick = (arr) => arr[(Math.random() * arr.length) | 0];

/** 1D value noise, used for camera shake. */
const NOISE_N = 256;
const noiseTable = new Float32Array(NOISE_N);
for (let i = 0; i < NOISE_N; i++) noiseTable[i] = Math.random() * 2 - 1;
export function noise1(x) {
  const i = Math.floor(x);
  const f = x - i;
  const a = noiseTable[i & (NOISE_N - 1)];
  const b = noiseTable[(i + 1) & (NOISE_N - 1)];
  const t = f * f * (3 - 2 * f);
  return a + (b - a) * t;
}

/** Convert #rrggbb or [r,g,b] to a normalized float triple. */
export function parseColor(c) {
  if (Array.isArray(c)) return c;
  const n = parseInt(c.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** HSV (0..1) -> RGB (0..1) */
export function hsv(h, s, v, out = [0, 0, 0]) {
  h = ((h % 1) + 1) % 1;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: out[0] = v; out[1] = t; out[2] = p; break;
    case 1: out[0] = q; out[1] = v; out[2] = p; break;
    case 2: out[0] = p; out[1] = v; out[2] = t; break;
    case 3: out[0] = p; out[1] = q; out[2] = v; break;
    case 4: out[0] = t; out[1] = p; out[2] = v; break;
    default: out[0] = v; out[1] = p; out[2] = q; break;
  }
  return out;
}

/** Format an integer with thousands separators. */
export function commafy(n) {
  n = Math.floor(n);
  let s = String(Math.abs(n));
  let out = '';
  while (s.length > 3) {
    out = ',' + s.slice(-3) + out;
    s = s.slice(0, -3);
  }
  return (n < 0 ? '-' : '') + s + out;
}

export function formatTime(seconds) {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  const cs = Math.floor((s * 100) % 100);
  return `${m}:${String(r).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

/**
 * A pooled array that reuses object slots. Entities are marked dead and
 * compacted in-place each frame, avoiding GC pressure in the hot loop.
 */
export class Pool {
  constructor(factory, initial = 64) {
    this.factory = factory;
    this.items = [];
    this.count = 0;
    this.free = [];
    for (let i = 0; i < initial; i++) this.free.push(factory());
  }
  spawn() {
    const o = this.free.length ? this.free.pop() : this.factory();
    o.alive = true;
    this.items[this.count++] = o;
    return o;
  }
  /** Compact: remove dead entries, returning them to the free list. */
  compact() {
    let w = 0;
    const items = this.items;
    for (let i = 0; i < this.count; i++) {
      const o = items[i];
      if (o.alive) items[w++] = o;
      else this.free.push(o);
    }
    for (let i = w; i < this.count; i++) items[i] = undefined;
    this.count = w;
  }
  clear() {
    for (let i = 0; i < this.count; i++) {
      this.items[i].alive = false;
      this.free.push(this.items[i]);
      this.items[i] = undefined;
    }
    this.count = 0;
  }
  forEach(fn) {
    for (let i = 0; i < this.count; i++) fn(this.items[i], i);
  }
}
