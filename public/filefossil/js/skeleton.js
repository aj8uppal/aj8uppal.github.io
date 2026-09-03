// skeleton.js — builds the 3D specimen from a genome.
// Output is a flat Float32Array of xyz points plus a list of primitives, all
// preallocated so a full rebuild every frame (during a mutation morph) is cheap.

import { sfc32 } from './hash.js';

export const S = { LINE: 0, BONE: 1, HAIR: 2, PLATE: 3, ACCENT: 4, PIT: 5 };

export class Geom {
  constructor(cap = 40000) {
    this.buf = new Float32Array(cap * 3);
    this.cap = cap;
    this.prims = [];
    this.count = 0;
    this.n = 0;
    this.cur = null;
    this.anchors = {};
  }
  reset() {
    this.n = 0;
    this.count = 0;
    this.cur = null;
    this.anchors = {};
  }
  begin(style, closed) {
    let p = this.prims[this.count];
    if (!p) { p = { off: 0, len: 0, s: 0, closed: false, depth: 0 }; this.prims[this.count] = p; }
    p.off = this.n; p.len = 0; p.s = style; p.closed = !!closed;
    this.cur = p;
  }
  pt(x, y, z) {
    if (this.n >= this.cap) return;
    const i = this.n * 3;
    this.buf[i] = x; this.buf[i + 1] = y; this.buf[i + 2] = z;
    this.n++; this.cur.len++;
  }
  end() {
    if (this.cur && this.cur.len > 1) this.count++;
    else if (this.cur) this.n -= this.cur.len;
    this.cur = null;
  }
  anchor(name, x, y, z) { this.anchors[name] = [x, y, z]; }
}

const TAU = Math.PI * 2;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

function profileAt(profile, t) {
  const m = profile.length - 1;
  const f = clamp(t, 0, 1) * m;
  const i = Math.floor(f);
  const j = Math.min(m, i + 1);
  const k = f - i;
  return profile[i] * (1 - k) + profile[j] * k;
}

// Spine curve. t = 0 at tail tip, 1 at the base of the skull.
// Every magnitude below is a fraction of the total body length L, so the animal
// keeps sane proportions no matter what the statistics ask for.
function spinePoint(g, t, out) {
  const L = 1.0 + g.tailLen;
  const x = t * L - L * 0.56;
  const pr = profileAt(g.spineProfile, t);                  // already in [-1, 1]
  const neck = g.neckArch * 0.30 * L * Math.pow(clamp((t - 0.55) / 0.45, 0, 1), 1.7);
  const droop = -0.055 * L * Math.pow(1 - t, 2.1) * (1 + g.tailCurl);
  const y = neck + droop + pr * 0.055 * L * g.spineAmp;
  const z = Math.sin(t * Math.PI * 2 * g.lateralFreq + g.phase) * 0.033 * L * g.lateralAmp
          + g.asym * 0.022 * L * t;
  out[0] = x; out[1] = y; out[2] = z;
  return out;
}

// Vertebral radius: a bell centred on the ribcage, tapering to a point at the tail.
function radiusAt(g, t) {
  const L = 1.0 + g.tailLen;
  const bodyU = (g.tailLen + 0.40) / L;
  const sigma = 0.30 / L;
  const bell = Math.exp(-Math.pow((t - bodyU) / sigma, 2));
  let r = g.girth * 0.135 * L * (0.10 + 0.90 * bell);
  if (t < bodyU) r *= Math.pow(clamp(t / bodyU, 0, 1), g.tailTaper * 0.55) * 0.92 + 0.08;
  return Math.max(r, 0.009 * L);
}

const _a = [0, 0, 0], _b = [0, 0, 0];

// Local frame: tangent T, binormal B (roughly ±z), up U.
function frameAt(g, t, f) {
  const d = 0.004;
  spinePoint(g, clamp(t - d, 0, 1), _a);
  spinePoint(g, clamp(t + d, 0, 1), _b);
  let tx = _b[0] - _a[0], ty = _b[1] - _a[1], tz = _b[2] - _a[2];
  const tl = Math.hypot(tx, ty, tz) || 1;
  tx /= tl; ty /= tl; tz /= tl;
  // B = normalize(T x up)
  let bx = ty * 0 - tz * 1, by = tz * 0 - tx * 0, bz = tx * 1 - ty * 0;
  const bl = Math.hypot(bx, by, bz) || 1;
  bx /= bl; by /= bl; bz /= bl;
  // U = B x T
  const ux = by * tz - bz * ty, uy = bz * tx - bx * tz, uz = bx * ty - by * tx;
  spinePoint(g, t, f.p);
  f.tg = [tx, ty, tz]; f.b = [bx, by, bz]; f.u = [ux, uy, uz];
  return f;
}

// A limb bone: a tapered quad whose width lies in the sagittal plane, so it
// still reads as bone (not wire) when viewed from the side.
function boneQuad(geom, A, B, w1, w2, bhat, style) {
  let dx = B[0] - A[0], dy = B[1] - A[1], dz = B[2] - A[2];
  const dl = Math.hypot(dx, dy, dz) || 1;
  dx /= dl; dy /= dl; dz /= dl;
  let px = dy * bhat[2] - dz * bhat[1];
  let py = dz * bhat[0] - dx * bhat[2];
  let pz = dx * bhat[1] - dy * bhat[0];
  const pl = Math.hypot(px, py, pz) || 1;
  px /= pl; py /= pl; pz /= pl;
  geom.begin(style, true);
  geom.pt(A[0] + px * w1, A[1] + py * w1, A[2] + pz * w1);
  geom.pt(B[0] + px * w2, B[1] + py * w2, B[2] + pz * w2);
  geom.pt(B[0] - px * w2, B[1] - py * w2, B[2] - pz * w2);
  geom.pt(A[0] - px * w1, A[1] - py * w1, A[2] - pz * w1);
  geom.end();
}

function ring(geom, f, r, sides, style, squash) {
  geom.begin(style, true);
  for (let i = 0; i < sides; i++) {
    const a = i / sides * TAU;
    const cu = Math.cos(a) * r * (squash || 1), cb = Math.sin(a) * r;
    geom.pt(f.p[0] + f.u[0] * cu + f.b[0] * cb,
            f.p[1] + f.u[1] * cu + f.b[1] * cb,
            f.p[2] + f.u[2] * cu + f.b[2] * cb);
  }
  geom.end();
}

/** Build the whole animal into `geom`. */
export function buildSkeleton(geom, g) {
  geom.reset();
  const rng = sfc32(g.pitSeed | 0, 0x9e3779b9, 0x85ebca6b, 0xc2b2ae35);

  const L = 1.0 + g.tailLen;
  const NV = Math.max(10, Math.round(g.vertebrae));
  const f = { p: [0, 0, 0], tg: null, b: null, u: null };
  const frames = [];
  for (let i = 0; i < NV; i++) {
    const t = NV === 1 ? 1 : i / (NV - 1);
    const fr = frameAt(g, t, f);
    frames.push({ t, p: fr.p.slice(), u: fr.u.slice(), b: fr.b.slice(), tg: fr.tg.slice(), r: radiusAt(g, t) });
  }

  // --- vertebrae: blocky centra, so the column reads as bone from any angle
  const spacing = L / Math.max(1, NV - 1);
  for (let i = 0; i < NV; i++) {
    const fr = frames[i];
    const half = spacing * 0.40;
    const hh = fr.r * 0.80;
    const zw = fr.r * 0.66;
    const P = (a, b, c) => geom.pt(
      fr.p[0] + fr.tg[0] * a + fr.u[0] * b + fr.b[0] * c,
      fr.p[1] + fr.tg[1] * a + fr.u[1] * b + fr.b[1] * c,
      fr.p[2] + fr.tg[2] * a + fr.u[2] * b + fr.b[2] * c);
    for (const sz of [zw, -zw]) {
      geom.begin(S.BONE, true);
      P(-half, -hh * 0.86, sz); P(-half * 0.66, hh, sz);
      P(half * 0.66, hh, sz); P(half, -hh * 0.86, sz);
      geom.end();
    }
    geom.begin(S.LINE, false); P(-half * 0.66, hh, zw); P(-half * 0.66, hh, -zw); geom.end();
    geom.begin(S.LINE, false); P(half, -hh * 0.86, zw); P(half, -hh * 0.86, -zw); geom.end();
    // transverse processes every other vertebra
    if (i % 2 === 0 && fr.r > 0.014 * L) {
      for (const side of [1, -1]) {
        geom.begin(S.LINE, false);
        P(0, 0, zw * 0.6 * side);
        P(-half * 0.3, -fr.r * 0.35, fr.r * 1.9 * side);
        geom.end();
      }
    }
  }

  // --- neural spines (dorsal crest) — height from high-bit density ------
  let crestTip = null;
  for (let i = 1; i < NV - 1; i++) {
    const fr = frames[i];
    const env = Math.sin(Math.pow(fr.t, 0.85) * Math.PI);
    const h = g.crestHeight * 0.20 * L * env * (0.5 + 0.5 * profileAt(g.crestProfile, fr.t));
    if (h < 0.005 * L) continue;
    const base = fr.r * 0.5;
    const top = [fr.p[0] + fr.u[0] * (base + h), fr.p[1] + fr.u[1] * (base + h), fr.p[2] + fr.u[2] * (base + h)];
    geom.begin(i % 3 === 0 ? S.ACCENT : S.BONE, true);
    const bw = fr.r * 0.52, tw = 0.0022 * L;
    geom.pt(fr.p[0] + fr.u[0] * base - fr.tg[0] * bw,
            fr.p[1] + fr.u[1] * base - fr.tg[1] * bw,
            fr.p[2] + fr.u[2] * base - fr.tg[2] * bw);
    geom.pt(top[0] - fr.tg[0] * tw, top[1] - fr.tg[1] * tw, top[2] - fr.tg[2] * tw);
    geom.pt(top[0] + fr.tg[0] * tw, top[1] + fr.tg[1] * tw, top[2] + fr.tg[2] * tw);
    geom.pt(fr.p[0] + fr.u[0] * base + fr.tg[0] * bw,
            fr.p[1] + fr.u[1] * base + fr.tg[1] * bw,
            fr.p[2] + fr.u[2] * base + fr.tg[2] * bw);
    geom.end();
    if (!crestTip || h > crestTip[3]) crestTip = [top[0], top[1], top[2], h];
  }
  if (crestTip) geom.anchor('crest', crestTip[0], crestTip[1], crestTip[2]);
  else { const fr = frames[Math.floor(NV * 0.7)]; geom.anchor('crest', fr.p[0], fr.p[1] + fr.r, fr.p[2]); }
  geom.anchor('vertebrae', frames[Math.floor(NV * 0.52)].p[0], frames[Math.floor(NV * 0.52)].p[1], frames[Math.floor(NV * 0.52)].p[2]);

  // --- ribs — count from histogram concentration ------------------------
  const NR = Math.max(0, Math.round(g.ribPairs));
  const rib0 = 0.10 + g.tailLen / (1 + g.tailLen) * 0.72;
  const rib1 = Math.min(0.93, rib0 + 0.42);
  let ribAnchor = null;
  for (let i = 0; i < NR; i++) {
    const t = NR === 1 ? (rib0 + rib1) / 2 : rib0 + (rib1 - rib0) * (i / (NR - 1));
    const fr = frameAt(g, t, f);
    const r = radiusAt(g, t);
    const env = Math.sin(clamp((t - rib0) / (rib1 - rib0), 0, 1) * Math.PI) * 0.55 + 0.45;
    const span = (0.55 + g.ribSweep * 0.75) * r * 1.95 * env;
    const drop = g.ribDrop * r * 4.4 * env;
    for (const side of [1, -1]) {
      geom.begin(S.LINE, false);
      const N = 12;
      let ex = 0, ey = 0, ez = 0;
      for (let k = 0; k < N; k++) {
        const a = k / (N - 1);
        const out = Math.sin(a * Math.PI * 0.86) * span * side;
        const down = -Math.pow(a, 1.15) * drop - r * 0.30;
        const back = -Math.pow(a, 1.7) * r * 2.0;
        ex = fr.p[0] + fr.tg[0] * back + fr.u[0] * down + fr.b[0] * out;
        ey = fr.p[1] + fr.tg[1] * back + fr.u[1] * down + fr.b[1] * out;
        ez = fr.p[2] + fr.tg[2] * back + fr.u[2] * down + fr.b[2] * out;
        geom.pt(ex, ey, ez);
      }
      geom.end();
      if (side === 1 && i === Math.floor(NR / 2)) ribAnchor = [ex, ey, ez];
    }
  }
  if (ribAnchor) geom.anchor('ribs', ribAnchor[0], ribAnchor[1], ribAnchor[2]);

  // --- dorsal plates — count from entropy roughness ---------------------
  const NP = Math.max(0, Math.round(g.plates));
  for (let i = 0; i < NP; i++) {
    const t = rib0 - 0.06 + (rib1 - rib0 + 0.16) * (NP === 1 ? 0.5 : i / (NP - 1));
    if (t <= 0.02 || t >= 0.99) continue;
    const fr = frameAt(g, t, f);
    const r = radiusAt(g, t);
    const w = r * (0.9 + g.plateWidth * 0.9);
    const hgt = r * (1.0 + g.plateWidth * 0.6);
    const sk = g.plateSkew * r * 0.6;
    const bx = fr.b, ux = fr.u, tg = fr.tg;
    const base = r * 0.6;
    const P = (a, b, c) => geom.pt(
      fr.p[0] + tg[0] * a + ux[0] * b + bx[0] * c,
      fr.p[1] + tg[1] * a + ux[1] * b + bx[1] * c,
      fr.p[2] + tg[2] * a + ux[2] * b + bx[2] * c);
    geom.begin(S.PLATE, true);
    P(-w * 0.5, base, 0); P(sk, base + hgt, w * 0.34); P(w * 0.5, base, 0); P(sk * 0.5, base + hgt * 0.45, -w * 0.30);
    geom.end();
    geom.begin(S.HAIR, false);
    P(-w * 0.22, base + hgt * 0.18, 0); P(sk * 0.7, base + hgt * 0.8, w * 0.15);
    geom.end();
  }

  // --- limbs — pairs from run/delta structure ---------------------------
  const NL = Math.max(0, Math.round(g.limbPairs));
  const ND = Math.max(2, Math.round(g.digits));
  let limbAnchor = null;
  for (let i = 0; i < NL; i++) {
    const t = NL === 1 ? rib1 - 0.05 : rib0 + 0.04 + (rib1 - rib0 - 0.08) * (i / (NL - 1));
    const fr = frameAt(g, t, f);
    const r = radiusAt(g, t);
    const len = g.limbLen * 0.26 * L * (0.8 + 0.4 * (1 - i / Math.max(1, NL)));
    const sp = g.limbSplay;
    for (const side of [1, -1]) {
      const px = fr.p[0], py = fr.p[1], pz = fr.p[2];
      const B = fr.b, U = fr.u, T = fr.tg;
      // shoulder / hip sits at the ventral edge of the ribcage
      const hang = g.ribDrop * r * 3.2;
      const out0 = r * 1.9 * side;
      const sh = [px + B[0] * out0 + U[0] * -hang,
                  py + B[1] * out0 + U[1] * -hang,
                  pz + B[2] * out0 + U[2] * -hang];
      // girdle
      geom.begin(S.LINE, false);
      geom.pt(px, py, pz); geom.pt(sh[0], sh[1], sh[2]);
      geom.end();
      const el = [sh[0] + B[0] * len * 0.40 * sp * side + U[0] * -len * 0.58 + T[0] * -len * 0.30,
                  sh[1] + B[1] * len * 0.40 * sp * side + U[1] * -len * 0.58 + T[1] * -len * 0.30,
                  sh[2] + B[2] * len * 0.40 * sp * side + U[2] * -len * 0.58 + T[2] * -len * 0.30];
      const fwd = len * (0.16 + g.wrist * 0.34);
      const wr = [el[0] + B[0] * len * 0.16 * side + U[0] * -len * 0.52 + T[0] * fwd,
                  el[1] + B[1] * len * 0.16 * side + U[1] * -len * 0.52 + T[1] * fwd,
                  el[2] + B[2] * len * 0.16 * side + U[2] * -len * 0.52 + T[2] * fwd];
      boneQuad(geom, sh, el, r * 0.34, r * 0.22, B, S.BONE);
      boneQuad(geom, el, wr, r * 0.24, r * 0.16, B, S.BONE);
      for (let d = 0; d < ND; d++) {
        const a = (d / Math.max(1, ND - 1) - 0.5) * g.digitSplay * 2;
        const dl = len * 0.30 * (0.7 + 0.5 * Math.cos(a));
        geom.begin(S.LINE, false);
        geom.pt(wr[0], wr[1], wr[2]);
        geom.pt(wr[0] + B[0] * dl * Math.sin(a) * side + U[0] * -dl * 0.70 + T[0] * dl * Math.cos(a) * 0.55,
                wr[1] + B[1] * dl * Math.sin(a) * side + U[1] * -dl * 0.70 + T[1] * dl * Math.cos(a) * 0.55,
                wr[2] + B[2] * dl * Math.sin(a) * side + U[2] * -dl * 0.70 + T[2] * dl * Math.cos(a) * 0.55);
        geom.end();
      }
      if (side === 1 && !limbAnchor) limbAnchor = wr;
    }
  }
  if (limbAnchor) geom.anchor('limbs', limbAnchor[0], limbAnchor[1], limbAnchor[2]);

  // --- tail tip anchor & terminal fin -----------------------------------
  const tail = frames[0];
  geom.anchor('tail', tail.p[0], tail.p[1], tail.p[2]);

  // --- skull — shape family + horns from the header signature -----------
  const head = frameAt(g, 1, f);
  const T = head.tg, U = head.u, B = head.b;
  const hp = head.p;
  const sl = g.skullLen * 0.40 * L, sd = g.skullDepth * 0.40 * L;
  const K = (a, b, c) => geom.pt(hp[0] + T[0] * a + U[0] * b + B[0] * c,
                                 hp[1] + T[1] * a + U[1] * b + B[1] * c,
                                 hp[2] + T[2] * a + U[2] * b + B[2] * c);
  const variant = Math.round(g.skull) % 7;
  const snout = [0.55, 0.95, 0.45, 1.15, 1.25, 0.75, 0.85][variant];
  const dome = [1.1, 1.35, 1.25, 0.8, 0.75, 1.0, 1.4][variant];

  // Side profile of the cranium, drawn on both flanks and tied together so it
  // reads as a solid head from any angle.
  const prof = [
    [0.00, -sd * 0.42, 0.60], [0.05, sd * dome * 0.60, 0.62], [0.30, sd * dome, 0.66],
    [0.62, sd * dome * 0.78, 0.52], [0.82 * snout, sd * 0.50, 0.36],
    [snout, sd * 0.10, 0.22], [snout * 0.99, -sd * 0.28, 0.20],
    [0.55 * snout, -sd * 0.42, 0.36], [0.28, -sd * 0.52, 0.58]
  ];
  for (const side of [1, -1]) {
    geom.begin(S.BONE, true);
    for (const [a, b, zw] of prof) K(sl * a, b, sd * zw * side);
    geom.end();
  }
  for (const idx of [2, 5, 8]) {
    const [a, b, zw] = prof[idx];
    geom.begin(S.LINE, false);
    K(sl * a, b, sd * zw); K(sl * a, b, -sd * zw);
    geom.end();
  }
  // orbit
  for (const side of [1, -1]) {
    geom.begin(S.LINE, true);
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * TAU;
      K(sl * (0.30 + snout * 0.24) + Math.cos(a) * sl * g.orbit * 0.30,
        sd * 0.40 + Math.sin(a) * sd * g.orbit * 0.85,
        sd * 0.58 * side);
    }
    geom.end();
  }
  // mandible
  for (const side of [0.5, -0.5]) {
    geom.begin(S.LINE, false);
    K(sl * 0.06, -sd * 0.52, sd * 0.54 * side * 2);
    K(sl * snout * 0.48, -sd * (0.62 + g.jawGape), sd * 0.40 * side * 2);
    K(sl * snout * 0.97, -sd * (0.32 + g.jawGape * 1.5), sd * 0.18 * side * 2);
    geom.end();
  }
  // teeth
  const NT = Math.max(3, Math.round(g.toothCount));
  for (let i = 0; i < NT; i++) {
    const a = snout * (0.34 + 0.60 * (i / (NT - 1)));
    for (const side of [0.5, -0.5]) {
      geom.begin(S.LINE, false);
      K(sl * a, -sd * 0.30, sd * 0.40 * side * 2);
      K(sl * (a + 0.02), -sd * (0.30 + 0.20 + g.jawGape * 0.4), sd * 0.38 * side * 2);
      geom.end();
    }
  }
  // horns / crest — count from the container family
  const NH = Math.max(0, Math.round(g.horns));
  for (let i = 0; i < NH; i++) {
    const spread = NH === 1 ? 0 : (i / (NH - 1) - 0.5) * 2;
    const hl = g.hornLen * (1 - Math.abs(spread) * 0.35) * 0.62 * L;
    geom.begin(S.ACCENT, false);
    K(sl * 0.24, sd * dome * 0.92, sd * spread * 0.9);
    K(sl * (0.24 - g.hornSweep * 0.75), sd * dome * 0.92 + hl, sd * spread * 1.5);
    geom.end();
  }
  geom.anchor('skull', hp[0] + T[0] * sl * snout, hp[1] + T[1] * sl * snout + sd * 0.2, hp[2]);
  geom.anchor('horns', hp[0] + T[0] * sl * 0.24, hp[1] + sd * dome + g.hornLen * 0.62 * L, hp[2]);

  // --- pitting — density from null bytes --------------------------------
  const NPit = Math.max(0, Math.round(g.pits));
  for (let i = 0; i < NPit; i++) {
    const t = 0.12 + rng() * 0.82;
    const fr = frameAt(g, t, f);
    const r = radiusAt(g, t);
    const ang = rng() * TAU;
    const rad = r * (0.5 + rng() * 0.9);
    const cx = fr.p[0] + fr.u[0] * Math.cos(ang) * rad + fr.b[0] * Math.sin(ang) * rad;
    const cy = fr.p[1] + fr.u[1] * Math.cos(ang) * rad + fr.b[1] * Math.sin(ang) * rad;
    const cz = fr.p[2] + fr.u[2] * Math.cos(ang) * rad + fr.b[2] * Math.sin(ang) * rad;
    const pr = (0.0022 + rng() * 0.0034) * L;
    geom.begin(S.PIT, true);
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * TAU;
      geom.pt(cx + Math.cos(a) * pr, cy + Math.sin(a) * pr, cz + Math.cos(a + 1) * pr * 0.6);
    }
    geom.end();
    if (i === 0) geom.anchor('pits', cx, cy, cz);
  }
  if (NPit === 0) {
    const fr = frames[Math.floor(NV * 0.35)];
    geom.anchor('pits', fr.p[0], fr.p[1] - fr.r, fr.p[2]);
  }

  return geom;
}
