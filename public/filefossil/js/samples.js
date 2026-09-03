// samples.js — synthetic specimens, generated in code with deliberately
// different statistical signatures. These are NOT real files scraped from
// anywhere; every byte is produced by the deterministic generator below.

import { sfc32 } from './hash.js';

function words(rng, count) {
  const W = ['the', 'ledger', 'of', 'strata', 'a', 'quiet', 'archive', 'bone', 'index', 'was',
    'kept', 'in', 'vellum', 'and', 'ink', 'each', 'entry', 'names', 'one', 'specimen',
    'found', 'beneath', 'the', 'quarry', 'road', 'we', 'measured', 'it', 'twice', 'then',
    'drew', 'the', 'ribs', 'by', 'lamplight', 'until', 'morning', 'came', 'over', 'the',
    'chalk', 'field', 'nothing', 'here', 'is', 'catalogued', 'without', 'a', 'number'];
  const out = [];
  for (let i = 0; i < count; i++) out.push(W[Math.floor(rng() * W.length)]);
  return out;
}

function enc(str) { return new TextEncoder().encode(str); }

function noise(rng, len, lo, hi) {
  const b = new Uint8Array(len);
  const span = hi - lo + 1;
  for (let i = 0; i < len; i++) b[i] = lo + Math.floor(rng() * span);
  return b;
}

function concat(parts) {
  let len = 0;
  for (const p of parts) len += p.length;
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

// 1. High-entropy blob: looks like ciphertext / compressed payload.
function makeCipher() {
  const rng = sfc32(0x9e3779b9, 0x243f6a88, 0xb7e15162, 0x0f1bbcdc);
  return noise(rng, 262144, 0, 255);
}

// 2. Compressible prose: high printable ratio, low entropy.
function makeJournal() {
  const rng = sfc32(0x1a2b3c4d, 0x5e6f7a8b, 0x9cadbe0f, 0x13572468);
  const lines = [];
  lines.push('FIELD JOURNAL — CHALK QUARRY, VOLUME II\n');
  lines.push('=======================================\n\n');
  for (let i = 0; i < 900; i++) {
    const w = words(rng, 8 + Math.floor(rng() * 9));
    let line = w.join(' ');
    if (rng() < 0.18) line = '  * ' + line;
    lines.push(line + '.\n');
    if (rng() < 0.09) lines.push('\n');
  }
  return enc(lines.join(''));
}

// 3. Fixed-width record file: heavy padding nulls, strong periodicity.
function makeLedger() {
  const rng = sfc32(0x2468ace0, 0x13579bdf, 0xfeedbeef, 0x0badc0de);
  const REC = 64, COUNT = 3000;
  const out = new Uint8Array(REC * COUNT + 16);
  out.set(enc('LDGR\x00\x01\x00\x40'), 0);            // little private header
  out.set(enc('\x00\x00\x00\x00\x00\x00\x00\x00'), 8);
  const names = ['ammonite', 'belemnite', 'crinoid', 'trilobite', 'brachiopod', 'nautilus', 'graptolite'];
  for (let r = 0; r < COUNT; r++) {
    const o = 16 + r * REC;
    // 4-byte big-endian id
    out[o] = (r >> 24) & 255; out[o + 1] = (r >> 16) & 255; out[o + 2] = (r >> 8) & 255; out[o + 3] = r & 255;
    const nm = enc(names[Math.floor(rng() * names.length)]);
    out.set(nm, o + 4);                                 // rest of the field stays 0x00
    // three little-endian 16-bit measurements at a fixed offset
    for (let k = 0; k < 3; k++) {
      const v = Math.floor(rng() * 4000);
      out[o + 40 + k * 2] = v & 255;
      out[o + 41 + k * 2] = (v >> 8) & 255;
    }
    out[o + REC - 1] = 0x0a;
  }
  return out;
}

// 4. Image-shaped: real PNG signature + IHDR, then incompressible pixel noise.
function makePlate() {
  const rng = sfc32(0xcafed00d, 0x8badf00d, 0xdeadc0de, 0x1337beef);
  const sig = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = concat([
    new Uint8Array([0, 0, 0, 13]), enc('IHDR'),
    new Uint8Array([0, 0, 1, 0x90, 0, 0, 1, 0x2c, 8, 6, 0, 0, 0]),
    new Uint8Array([0x3a, 0x11, 0x9c, 0x4d])
  ]);
  const body = concat([
    new Uint8Array([0, 2, 0, 0]), enc('IDAT'),
    noise(rng, 131072, 0, 255),
    enc('IEND'), new Uint8Array([0xae, 0x42, 0x60, 0x82])
  ]);
  return concat([sig, ihdr, body]);
}

// 5. Archive-shaped: ZIP local headers, stored text members, deflate-ish noise.
function makeAtlas() {
  const rng = sfc32(0x0ff1ce00, 0xabad1dea, 0x5eedfeed, 0xc0ffee11);
  const parts = [];
  const names = ['atlas/plate01.txt', 'atlas/plate02.txt', 'atlas/index.csv',
    'atlas/raw/scan01.bin', 'atlas/raw/scan02.bin', 'atlas/notes.md'];
  for (let i = 0; i < names.length; i++) {
    const nm = enc(names[i]);
    const stored = i % 2 === 0;
    const payload = stored
      ? enc(words(rng, 700).join(' ') + '\n')
      : noise(rng, 24000, 0, 255);
    const h = new Uint8Array(30);
    h.set([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00, stored ? 0x00 : 0x08, 0x00], 0);
    h[26] = nm.length & 255; h[27] = nm.length >> 8;
    parts.push(h, nm, payload);
  }
  const dir = new Uint8Array([0x50, 0x4b, 0x05, 0x06, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  parts.push(dir);
  return concat(parts);
}

let cache = null;

export function getSamples() {
  if (cache) return cache;
  cache = [
    { id: 'cipher', label: 'cipher.bin', blurb: 'near-maximal entropy', build: makeCipher },
    { id: 'journal', label: 'journal.txt', blurb: 'plain prose', build: makeJournal },
    { id: 'ledger', label: 'ledger.dat', blurb: 'fixed-width records', build: makeLedger },
    { id: 'plate', label: 'plate.png', blurb: 'header + pixel noise', build: makePlate },
    { id: 'atlas', label: 'atlas.zip', blurb: 'mixed archive members', build: makeAtlas }
  ].map(s => {
    let bytes = null;
    return { ...s, get bytes() { if (!bytes) bytes = s.build(); return bytes; } };
  });
  return cache;
}
