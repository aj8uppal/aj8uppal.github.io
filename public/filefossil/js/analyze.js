// analyze.js — reads bytes locally and measures them. No network, ever.
//
// Everything that feeds the morphology is derived from three histograms plus a
// polynomial hash, all of which can be updated in O(1)-ish time when a single
// byte is edited. That is what makes the "mutate one byte" slider instant even
// on a 32 MB file.

import { PolyHash, sfc32, hex } from './hash.js';

export const SEGMENTS = 64;                 // entropy-profile windows
export const MAX_BYTES = 32 * 1024 * 1024;  // hard analysis cap
const CHUNK = 1 << 19;                      // 512 KiB read chunks

const PRINTABLE = new Uint8Array(256);
for (let i = 0x20; i <= 0x7e; i++) PRINTABLE[i] = 1;
PRINTABLE[9] = PRINTABLE[10] = PRINTABLE[13] = 1;

const LOG2 = Math.LOG2E;

function entropyOf(hist, base, total) {
  if (total <= 0) return 0;
  let e = 0;
  for (let i = 0; i < 256; i++) {
    const c = hist[base + i];
    if (c > 0) { const p = c / total; e -= p * Math.log(p); }
  }
  return e * LOG2;
}

// --- container sniffing: header bytes only. No content interpretation. ---
const FAMILIES = {
  archive:    { hue: 26,  order: 'Compressiformes', pigment: 'amber' },
  document:   { hue: 212, order: 'Documentiformes', pigment: 'indigo' },
  image:      { hue: 148, order: 'Pictoformes',     pigment: 'verdigris' },
  executable: { hue: 352, order: 'Executiformes',   pigment: 'oxblood' },
  text:       { hue: 44,  order: 'Litteriformes',   pigment: 'ochre' },
  media:      { hue: 282, order: 'Sonoriformes',    pigment: 'aubergine' },
  unknown:    { hue: 196, order: 'Incertae sedis',  pigment: 'slate' }
};

const MAGIC = [
  ['ZIP (PK\\x03\\x04)', 'archive', b => b[0] === 0x50 && b[1] === 0x4b && (b[2] === 3 || b[2] === 5 || b[2] === 7)],
  ['GZIP (\\x1f\\x8b)', 'archive', b => b[0] === 0x1f && b[1] === 0x8b],
  ['BZIP2 (BZh)', 'archive', b => b[0] === 0x42 && b[1] === 0x5a && b[2] === 0x68],
  ['XZ (\\xfd7zXZ)', 'archive', b => b[0] === 0xfd && b[1] === 0x37 && b[2] === 0x7a && b[3] === 0x58],
  ['7Z (7z\\xbc\\xaf)', 'archive', b => b[0] === 0x37 && b[1] === 0x7a && b[2] === 0xbc && b[3] === 0xaf],
  ['RAR (Rar!)', 'archive', b => b[0] === 0x52 && b[1] === 0x61 && b[2] === 0x72 && b[3] === 0x21],
  ['ZSTD (\\x28\\xb5\\x2f\\xfd)', 'archive', b => b[0] === 0x28 && b[1] === 0xb5 && b[2] === 0x2f && b[3] === 0xfd],
  ['TAR (ustar)', 'archive', b => b.length > 262 && b[257] === 0x75 && b[258] === 0x73 && b[259] === 0x74 && b[260] === 0x61 && b[261] === 0x72],
  ['PDF (%PDF-)', 'document', b => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46],
  ['RTF ({\\rtf)', 'document', b => b[0] === 0x7b && b[1] === 0x5c && b[2] === 0x72 && b[3] === 0x74],
  ['PNG (\\x89PNG)', 'image', b => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47],
  ['JPEG (\\xff\\xd8\\xff)', 'image', b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff],
  ['GIF (GIF8)', 'image', b => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38],
  ['BMP (BM)', 'image', b => b[0] === 0x42 && b[1] === 0x4d],
  ['TIFF', 'image', b => (b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2a) || (b[0] === 0x4d && b[1] === 0x4d && b[2] === 0x00 && b[3] === 0x2a)],
  ['ELF (\\x7fELF)', 'executable', b => b[0] === 0x7f && b[1] === 0x45 && b[2] === 0x4c && b[3] === 0x46],
  ['Mach-O', 'executable', b => {
    const w = (b[0] << 24 | b[1] << 16 | b[2] << 8 | b[3]) >>> 0;
    return w === 0xfeedface || w === 0xfeedfacf || w === 0xcefaedfe || w === 0xcffaedfe || w === 0xcafebabe;
  }],
  ['PE / MZ', 'executable', b => b[0] === 0x4d && b[1] === 0x5a],
  ['WASM (\\0asm)', 'executable', b => b[0] === 0x00 && b[1] === 0x61 && b[2] === 0x73 && b[3] === 0x6d],
  ['OGG (OggS)', 'media', b => b[0] === 0x4f && b[1] === 0x67 && b[2] === 0x67 && b[3] === 0x53],
  ['RIFF / WAV', 'media', b => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46],
  ['MP3 (ID3)', 'media', b => b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33],
  ['FLAC (fLaC)', 'media', b => b[0] === 0x66 && b[1] === 0x4c && b[2] === 0x61 && b[3] === 0x43],
  ['MP4 (ftyp)', 'media', b => b.length > 8 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70],
  ['SQLite', 'archive', b => b[0] === 0x53 && b[1] === 0x51 && b[2] === 0x4c && b[3] === 0x69]
];

function sniff(bytes, printableRatio, nullRatio) {
  const head = bytes.subarray(0, Math.min(bytes.length, 512));
  for (const [label, family, test] of MAGIC) {
    try { if (test(head)) return { label, family, matched: true }; } catch (_) { /* short buffer */ }
  }
  if (head.length >= 3 && head[0] === 0xef && head[1] === 0xbb && head[2] === 0xbf) {
    return { label: 'UTF-8 text (BOM)', family: 'text', matched: true };
  }
  if (printableRatio > 0.92 && nullRatio < 0.001) {
    return { label: 'plain text (no signature)', family: 'text', matched: false };
  }
  return { label: 'no known signature', family: 'unknown', matched: false };
}

// --- names -------------------------------------------------------------
const GENUS_A = ['Crypt', 'Entrop', 'Byt', 'Null', 'Hex', 'Glyph', 'Sigil', 'Palimps', 'Codic', 'Vector',
  'Umbr', 'Ferr', 'Chron', 'Strat', 'Gramm', 'Lith', 'Osse', 'Cinder', 'Vellum', 'Run',
  'Tessell', 'Obsid', 'Quant', 'Archiv', 'Carb', 'Nimb', 'Sable', 'Vitr'];
const GENUS_B = ['o', 'i', 'a', 'e', 'y', 'ae'];
const GENUS_C = ['saurus', 'therium', 'pteryx', 'don', 'gnathus', 'ceras', 'morpha', 'pus',
  'rhinus', 'stega', 'lepis', 'vermis', 'cetus', 'anodon', 'phyton', 'lestes'];
const EPI_A = ['vexill', 'ferrug', 'noct', 'pallid', 'sublim', 'tenebr', 'fract', 'lamin', 'spir',
  'cavern', 'argent', 'plumb', 'virid', 'sanguin', 'umbrat', 'ciner', 'vitre', 'horrid',
  'gracil', 'robust', 'tessell', 'stell', 'murin', 'glabr', 'asper', 'nodul', 'strig', 'sulc'];
const EPI_B = ['ifer', 'atus', 'osus', 'inus', 'icus', 'oides', 'ensis', 'arius', 'ulus', 'escens'];

function pick(list, r) { return list[Math.floor(r * list.length) % list.length]; }

// --- the analysis object ----------------------------------------------
export class Analysis {
  constructor(name, totalSize, n, kind) {
    this.name = name;
    this.totalSize = totalSize;
    this.n = n;
    this.kind = kind || 'file';
    this.truncated = totalSize > n;
    this.bytes = new Uint8Array(n);
    this.segCount = Math.max(4, Math.min(SEGMENTS, n));
    this.segHist = new Int32Array(SEGMENTS * 256);
    this.hist = new Int32Array(256);
    this.dhist = new Int32Array(256);   // histogram of (b[i] - b[i-1]) & 255
    this.hash = new PolyHash();
    this.mutations = new Map();         // index -> original byte
    this.stats = null;
  }

  segOf(i) {
    const s = Math.floor(i * this.segCount / this.n);
    return s >= this.segCount ? this.segCount - 1 : s;
  }

  ingest(chunk, offset) {
    const { segHist, hist, dhist, bytes } = this;
    bytes.set(chunk, offset);
    const segCount = this.segCount, n = this.n;
    let prev = offset > 0 ? bytes[offset - 1] : -1;
    for (let i = 0; i < chunk.length; i++) {
      const b = chunk[i];
      const gi = offset + i;
      let s = Math.floor(gi * segCount / n);
      if (s >= segCount) s = segCount - 1;
      segHist[s * 256 + b]++;
      hist[b]++;
      if (prev >= 0) dhist[(b - prev) & 255]++;
      prev = b;
    }
    this.hash.update(chunk, chunk.length);
  }

  setByte(i, v) {
    const b = this.bytes;
    const old = b[i];
    if (old === v) return false;
    if (!this.mutations.has(i)) this.mutations.set(i, old);
    b[i] = v;
    this.hist[old]--; this.hist[v]++;
    const s = this.segOf(i) * 256;
    this.segHist[s + old]--; this.segHist[s + v]++;
    if (i > 0) {
      const p = b[i - 1];
      this.dhist[(old - p) & 255]--; this.dhist[(v - p) & 255]++;
    }
    if (i < this.n - 1) {
      const q = b[i + 1];
      this.dhist[(q - old) & 255]--; this.dhist[(q - v) & 255]++;
    }
    this.hash.replace(i, old, v);
    if (this.mutations.get(i) === v) this.mutations.delete(i);
    this.computeStats();
    return true;
  }

  restore() {
    if (!this.mutations.size) return false;
    for (const [i, orig] of Array.from(this.mutations)) this.setByte(i, orig);
    this.mutations.clear();
    this.computeStats();
    return true;
  }

  computeStats() {
    const { hist, dhist, segHist, n } = this;
    const entropy = entropyOf(hist, 0, n);

    let printable = 0, high = 0, distinct = 0;
    for (let i = 0; i < 256; i++) {
      const c = hist[i];
      if (c > 0) distinct++;
      if (PRINTABLE[i]) printable += c;
      if (i >= 128) high += c;
    }
    const nulls = hist[0];

    // top-8 histogram mass -> how concentrated the byte distribution is
    const sorted = Array.from(hist).sort((a, b) => b - a);
    let top8 = 0;
    for (let i = 0; i < 8; i++) top8 += sorted[i];
    const top8Mass = n ? top8 / n : 0;
    const skew = Math.max(0, (top8Mass - 8 / 256) / (1 - 8 / 256));

    const pairs = Math.max(1, n - 1);
    const deltaEntropy = entropyOf(dhist, 0, pairs);
    const repeatRatio = dhist[0] / pairs;

    // entropy profile along the file — this is the spine
    const segCount = this.segCount;
    const profile = new Float32Array(SEGMENTS);
    let pMin = 8, pMax = 0, rough = 0, prev = null;
    for (let s = 0; s < segCount; s++) {
      let tot = 0;
      const base = s * 256;
      for (let i = 0; i < 256; i++) tot += segHist[base + i];
      const e = entropyOf(segHist, base, tot);
      profile[s] = e;
      if (e < pMin) pMin = e;
      if (e > pMax) pMax = e;
      if (prev !== null) rough += Math.abs(e - prev);
      prev = e;
    }
    for (let s = segCount; s < SEGMENTS; s++) profile[s] = profile[segCount - 1];
    rough = segCount > 1 ? rough / (segCount - 1) : 0;

    const printableRatio = n ? printable / n : 0;
    const nullRatio = n ? nulls / n : 0;
    const highRatio = n ? high / n : 0;
    const container = sniff(this.bytes, printableRatio, nullRatio);
    const fam = FAMILIES[container.family];

    const seeds = this.hash.digest();
    const rng = sfc32(seeds[0], seeds[1], seeds[2], seeds[3]);
    const r1 = rng(), r2 = rng(), r3 = rng(), r4 = rng(), r5 = rng();
    const genus = pick(GENUS_A, r1) + pick(GENUS_B, r2) + pick(GENUS_C, r3);
    const epithet = pick(EPI_A, r4) + pick(EPI_B, r5);

    this.stats = {
      n, totalSize: this.totalSize, truncated: this.truncated,
      entropy, profile, profileMin: pMin, profileMax: pMax, profileRough: rough,
      segCount,
      printableRatio, nullRatio, highRatio, repeatRatio, deltaEntropy,
      distinct, top8Mass, skew,
      container, family: container.family, hue: fam.hue, order: fam.order, pigment: fam.pigment,
      seeds,
      binomial: genus + ' ' + epithet,
      catalogue: 'FF-' + hex(seeds[0], 4) + '-' + hex(seeds[1], 4),
      accession: (seeds[2] % 900 + 100) + '.' + (seeds[3] % 90 + 10)
    };
    return this.stats;
  }
}

function toBlob(src) {
  if (src instanceof Blob) return src;
  return new Blob([src]);
}

/**
 * Read a File/Blob/Uint8Array in chunks and measure it. Yields to the event
 * loop between chunks so the progress bar actually paints and the tab never
 * locks up. Returns an Analysis, or null if `isStale()` reports that a newer
 * load has superseded this one.
 */
export async function analyze(source, name, kind, onProgress, isStale) {
  const blob = toBlob(source);
  const total = blob.size;
  const n = Math.min(total, MAX_BYTES);
  const a = new Analysis(name, total, n, kind);
  if (n === 0) { a.computeStats(); return a; }

  let off = 0;
  let lastYield = performance.now();
  while (off < n) {
    const end = Math.min(off + CHUNK, n);
    const buf = new Uint8Array(await blob.slice(off, end).arrayBuffer());
    a.ingest(buf, off);
    off = end;
    if (onProgress) onProgress(off / n);
    if (isStale && isStale()) return null;   // a newer file superseded this one
    // Let the browser paint at most ~every 16ms of work.
    if (off < n && performance.now() - lastYield > 12) {
      await new Promise(r => requestAnimationFrame(r));
      lastYield = performance.now();
    }
  }
  a.computeStats();
  return a;
}

export { FAMILIES };
