/**
 * Little-endian binary writer/reader over a growable ArrayBuffer.
 *
 * Positions travel as int16 at quarter-unit precision (±8191 world units,
 * comfortably wider than the arena) and angles as uint16 turns, which keeps a
 * full snapshot of a busy arena to a few kilobytes.
 */

const TAU = Math.PI * 2;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const POS_SCALE = 4;

export class Writer {
  constructor(capacity = 16384) {
    this._alloc(capacity);
    this.o = 0;
  }
  _alloc(cap) {
    const old = this.bytesView;
    this.buf = new ArrayBuffer(cap);
    this.dv = new DataView(this.buf);
    this.bytesView = new Uint8Array(this.buf);
    if (old) this.bytesView.set(old.subarray(0, this.o));
  }
  reset() { this.o = 0; return this; }
  ensure(n) {
    if (this.o + n <= this.buf.byteLength) return;
    let cap = this.buf.byteLength * 2;
    while (cap < this.o + n) cap *= 2;
    this._alloc(cap);
  }
  u8(v) { this.ensure(1); this.dv.setUint8(this.o, v & 0xff); this.o += 1; }
  i8(v) { this.ensure(1); this.dv.setInt8(this.o, clampInt(v, -128, 127)); this.o += 1; }
  u16(v) { this.ensure(2); this.dv.setUint16(this.o, clampInt(v, 0, 65535), true); this.o += 2; }
  i16(v) { this.ensure(2); this.dv.setInt16(this.o, clampInt(v, -32768, 32767), true); this.o += 2; }
  u32(v) { this.ensure(4); this.dv.setUint32(this.o, clampInt(v, 0, 4294967295), true); this.o += 4; }
  f32(v) { this.ensure(4); this.dv.setFloat32(this.o, v, true); this.o += 4; }
  f64(v) { this.ensure(8); this.dv.setFloat64(this.o, v, true); this.o += 8; }
  pos(v) { this.i16(Math.round(v * POS_SCALE)); }
  vel(v) { this.i16(Math.round(v)); }
  angle(a) { this.u16(Math.round(((((a % TAU) + TAU) % TAU) / TAU) * 65535)); }
  unit(v) { this.u8(Math.round(Math.min(1, Math.max(0, v)) * 255)); }
  str(s) {
    const bytes = encoder.encode(String(s)).subarray(0, 255);
    this.u8(bytes.length);
    this.ensure(bytes.length);
    this.bytesView.set(bytes, this.o);
    this.o += bytes.length;
  }
  /** A right-sized copy, safe to hand to WebSocket.send. */
  finish() { return this.buf.slice(0, this.o); }
}

export class Reader {
  constructor(buffer) {
    this.dv = new DataView(buffer);
    this.bytes = new Uint8Array(buffer);
    this.o = 0;
  }
  get remaining() { return this.dv.byteLength - this.o; }
  u8() { const v = this.dv.getUint8(this.o); this.o += 1; return v; }
  i8() { const v = this.dv.getInt8(this.o); this.o += 1; return v; }
  u16() { const v = this.dv.getUint16(this.o, true); this.o += 2; return v; }
  i16() { const v = this.dv.getInt16(this.o, true); this.o += 2; return v; }
  u32() { const v = this.dv.getUint32(this.o, true); this.o += 4; return v; }
  f32() { const v = this.dv.getFloat32(this.o, true); this.o += 4; return v; }
  f64() { const v = this.dv.getFloat64(this.o, true); this.o += 8; return v; }
  pos() { return this.i16() / POS_SCALE; }
  vel() { return this.i16(); }
  angle() { return (this.u16() / 65535) * TAU; }
  unit() { return this.u8() / 255; }
  str() {
    const n = this.u8();
    const s = decoder.decode(this.bytes.subarray(this.o, this.o + n));
    this.o += n;
    return s;
  }
}

function clampInt(v, lo, hi) {
  v = Math.round(v);
  if (!(v >= lo)) return lo;   // also catches NaN
  return v > hi ? hi : v;
}
