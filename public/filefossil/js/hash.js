// hash.js — deterministic, entirely local hashing + PRNG.
// Nothing here touches the network. The polynomial hash is chosen because a
// single-byte edit can be applied in O(log n) instead of rehashing the file.

const K1 = 0x01000193 | 0; // FNV prime, odd -> invertible mod 2^32
const K2 = 0x85ebca6b | 0;

export function fmix32(h) {
  h |= 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

// base^exp mod 2^32 by squaring (Math.imul is exact low-32-bit multiply).
export function powmod32(base, exp) {
  let r = 1, b = base | 0, e = exp >>> 0;
  while (e > 0) {
    if (e & 1) r = Math.imul(r, b);
    b = Math.imul(b, b);
    e >>>= 1;
  }
  return r | 0;
}

export class PolyHash {
  constructor() { this.reset(); }
  reset() { this.h1 = 0; this.h2 = 0; this.p1 = 1; this.p2 = 1; this.n = 0; }

  // Feed a chunk of bytes in file order.
  update(buf, len) {
    let h1 = this.h1, h2 = this.h2, p1 = this.p1, p2 = this.p2;
    const m = len === undefined ? buf.length : len;
    for (let i = 0; i < m; i++) {
      const b = buf[i];
      h1 = (h1 + Math.imul(b, p1)) | 0;
      h2 = (h2 + Math.imul(b ^ 0x5f, p2)) | 0;
      p1 = Math.imul(p1, K1);
      p2 = Math.imul(p2, K2);
    }
    this.h1 = h1; this.h2 = h2; this.p1 = p1; this.p2 = p2;
    this.n += m;
  }

  // Retroactively change the byte at `index` from oldB to newB.
  replace(index, oldB, newB) {
    const d = (newB - oldB) | 0;
    this.h1 = (this.h1 + Math.imul(d, powmod32(K1, index))) | 0;
    const d2 = ((newB ^ 0x5f) - (oldB ^ 0x5f)) | 0;
    this.h2 = (this.h2 + Math.imul(d2, powmod32(K2, index))) | 0;
  }

  // Four well-mixed 32-bit words.
  digest() {
    const n = this.n | 0;
    const a = fmix32(this.h1 ^ n);
    const b = fmix32(this.h2 ^ Math.imul(n, 0x9e3779b1));
    const c = fmix32((a ^ this.h2) | 0);
    const d = fmix32((b ^ this.h1 ^ 0x51ed270b) | 0);
    return [a, b, c, d];
  }
}

// sfc32 — small, fast, good enough for procedural morphology.
export function sfc32(a, b, c, d) {
  a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
  return function () {
    a |= 0; b |= 0; c |= 0; d |= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export function hex(v, digits) {
  return (v >>> 0).toString(16).toUpperCase().padStart(8, '0').slice(-digits);
}
