/**
 * Wire protocol between two peers (relayed verbatim by the server).
 *
 * Authority is split by what each player touches, which keeps every player's
 * own actions instant:
 *   - The host simulates the world: enemies, spawning, geoms, score, lives.
 *   - Whoever flies a ship simulates its movement and decides its own death
 *     against the enemies *they* can see.
 *   - Whoever fires a gun simulates its bullets and decides their hits.
 *
 * HOST -> GUEST  snapshot, 30 Hz: world state + the events since the last one
 * GUEST -> HOST  report, per frame: ship/gun state, shots, hits, death, bomb
 * Lobby control rides alongside as small JSON messages.
 */

import { Writer, Reader } from './codec.js';

export const PROTOCOL_VERSION = 1;

export const MSG = { SNAPSHOT: 1, GUEST: 2 };

export const EV = {
  KILL: 1, DAMAGE: 2, ABSORB: 3, BH_BURST: 4, ROCKET: 5, NEST: 6, SHOT: 7,
  COLLECT: 8, MULT: 9, EXTRA_LIFE: 10, RING: 11, DEATH: 12, RESPAWN: 13,
  BOMB: 14, GAMEOVER: 15,
};

export const RING_COLORS = ['white', 'accent0', 'accent1', 'blackhole', 'blackholeCore', 'gate', 'player'];
export const CAUSES = ['shot', 'bomb', 'chain', 'death'];
export const GAME_STATES = ['playing', 'dying', 'gameover'];

const NONE = 255;
const SNAKE = 4;
const BLACKHOLE = 5;
const ROCKET = 6;
const NEST = 7;

// ------------------------------------------------------------------ events

export function writeEvent(w, ev) {
  const a = ev.a;
  w.u8(ev.kind);
  switch (ev.kind) {
    case EV.KILL:
      w.u16(a[0]); w.u8(a[1]); w.u8(a[2]); w.pos(a[3]); w.pos(a[4]); w.vel(a[5]); w.vel(a[6]);
      w.u32(a[7]); w.u8(a[8]); w.u8(a[9] < 0 ? NONE : a[9]);
      break;
    case EV.DAMAGE: w.u16(a[0]); w.u8(a[1]); w.pos(a[2]); w.pos(a[3]); break;
    case EV.ABSORB: w.u8(a[0]); w.pos(a[1]); w.pos(a[2]); break;
    case EV.BH_BURST: w.pos(a[0]); w.pos(a[1]); break;
    case EV.ROCKET: w.pos(a[0]); w.pos(a[1]); w.angle(a[2]); break;
    case EV.NEST: w.pos(a[0]); w.pos(a[1]); break;
    case EV.SHOT: w.u8(a[0]); w.pos(a[1]); w.pos(a[2]); w.angle(a[3]); break;
    case EV.COLLECT: w.u16(a[0]); w.u8(a[1]); w.u8(a[2]); w.pos(a[3]); w.pos(a[4]); break;
    case EV.MULT: w.u8(a[0]); w.u8(a[1]); break;
    case EV.EXTRA_LIFE: break;
    case EV.RING: w.pos(a[0]); w.pos(a[1]); w.u16(a[2]); w.u16(a[3]); w.u8(a[4]); w.u8(a[5] ? 1 : 0); break;
    case EV.DEATH: w.u8(a[0]); w.pos(a[1]); w.pos(a[2]); break;
    case EV.RESPAWN: w.u8(a[0]); w.pos(a[1]); w.pos(a[2]); w.u8(a[3]); break;
    case EV.BOMB: w.u8(a[0]); w.pos(a[1]); w.pos(a[2]); break;
    case EV.GAMEOVER: w.u32(a[0]); w.u8(a[1]); w.f32(a[2]); w.u16(a[3]); w.u16(a[4]); break;
    default: throw new Error('unknown event ' + ev.kind);
  }
}

export function readEvent(r) {
  const kind = r.u8();
  switch (kind) {
    case EV.KILL: {
      const id = r.u16(), seg = r.u8(), type = r.u8(), x = r.pos(), y = r.pos(), vx = r.vel(), vy = r.vel();
      const gained = r.u32(), cause = CAUSES[r.u8()] || 'shot', by = r.u8();
      return { kind, id, seg, type, x, y, vx, vy, gained, cause, by: by === NONE ? -1 : by };
    }
    case EV.DAMAGE: return { kind, id: r.u16(), type: r.u8(), x: r.pos(), y: r.pos() };
    case EV.ABSORB: return { kind, type: r.u8(), x: r.pos(), y: r.pos() };
    case EV.BH_BURST: return { kind, x: r.pos(), y: r.pos() };
    case EV.ROCKET: return { kind, x: r.pos(), y: r.pos(), rot: r.angle() };
    case EV.NEST: return { kind, x: r.pos(), y: r.pos() };
    case EV.SHOT: return { kind, player: r.u8(), x: r.pos(), y: r.pos(), angle: r.angle() };
    case EV.COLLECT: return { kind, id: r.u16(), player: r.u8(), progress: r.u8(), x: r.pos(), y: r.pos() };
    case EV.MULT: return { kind, mult: r.u8(), player: r.u8() };
    case EV.EXTRA_LIFE: return { kind };
    case EV.RING: return { kind, x: r.pos(), y: r.pos(), max: r.u16(), speed: r.u16(), color: RING_COLORS[r.u8()] || 'white', lethal: r.u8() === 1 };
    case EV.DEATH: return { kind, player: r.u8(), x: r.pos(), y: r.pos() };
    case EV.RESPAWN: return { kind, player: r.u8(), x: r.pos(), y: r.pos(), gen: r.u8() };
    case EV.BOMB: return { kind, player: r.u8(), x: r.pos(), y: r.pos() };
    case EV.GAMEOVER: return { kind, score: r.u32(), mult: r.u8(), time: r.f32(), kills: [r.u16(), r.u16()] };
    default: throw new Error('unknown event ' + kind);
  }
}

// --------------------------------------------------------------- snapshot

export function encodeSnapshot(w, game, seq, hostTime, events) {
  w.reset();
  w.u8(MSG.SNAPSHOT);
  w.u16(seq);
  w.f64(hostTime);
  w.f32(game.runTime);
  w.u32(game.score);
  w.u8(game.multiplier);
  w.u8(game.geomProgress);
  w.u8(game.lives === Infinity ? NONE : Math.min(254, Math.max(0, game.lives)));
  w.u8(Math.min(254, game.bombs));
  w.u8(game.state === 'gameover' ? 2 : game.state === 'dying' ? 1 : 0);
  w.unit(game.difficulty / 2);

  const ps = game.players;
  w.u8(ps.length);
  for (const p of ps) {
    w.u8((p.alive ? 1 : 0) | (p.out ? 2 : 0) | (p.aimActive ? 4 : 0) | (p.firing ? 8 : 0));
    w.u8(p.gen & 0xff);
    w.pos(p.x); w.pos(p.y);
    w.vel(p.vx); w.vel(p.vy);
    w.angle(p.aim);
    w.u8(Math.min(255, Math.round(p.invuln * 50)));
    w.unit(p.thrust);
    w.unit(p.spawnAnim);
  }

  const em = game.enemies;
  w.u16(em.count);
  for (let i = 0; i < em.count; i++) {
    const e = em.items[i];
    w.u16(e.id);
    w.u8(e.type);
    w.u8((e.spawning ? 1 : 0) | (e.launched ? 2 : 0));
    w.pos(e.x); w.pos(e.y);
    w.angle(e.rot);
    w.u8(Math.round(Math.min(2.55, e.scale) * 100));
    w.unit(e.spawnT);
    w.unit(e.hitFlash);
    w.unit(e.hp / (e.maxHp || 1));
    w.unit(e.type === NEST ? e.spawnTimer / 2 : e.type === BLACKHOLE ? e.chargeT / 0.45 : 0);
    if (e.type === SNAKE) {
      w.u8(e.segCount);
      for (let s = 0; s < e.segCount; s++) { w.pos(e.segs[s * 2]); w.pos(e.segs[s * 2 + 1]); }
    }
  }

  const gm = game.geoms;
  w.u16(gm.count);
  for (let i = 0; i < gm.count; i++) {
    const g = gm.items[i];
    w.u16(g.id);
    w.pos(g.x); w.pos(g.y);
    w.u8(Math.min(255, Math.round(g.life * 20)));
    w.u8(g.captured < 0 ? NONE : g.captured);
  }

  w.u16(events.length);
  for (const ev of events) writeEvent(w, ev);
  return w.finish();
}

export function decodeSnapshot(buffer) {
  const r = new Reader(buffer);
  if (r.u8() !== MSG.SNAPSHOT) throw new Error('not a snapshot');
  const snap = {
    seq: r.u16(),
    hostTime: r.f64(),
    runTime: r.f32(),
    score: r.u32(),
    mult: r.u8(),
    progress: r.u8(),
    lives: r.u8(),
    bombs: r.u8(),
    state: GAME_STATES[r.u8()] || 'playing',
    difficulty: r.unit() * 2,
    players: [],
  };
  if (snap.lives === NONE) snap.lives = Infinity;

  const np = r.u8();
  for (let i = 0; i < np; i++) {
    const f = r.u8();
    snap.players.push({
      alive: !!(f & 1), out: !!(f & 2), aimActive: !!(f & 4), firing: !!(f & 8),
      gen: r.u8(), x: r.pos(), y: r.pos(), vx: r.vel(), vy: r.vel(), aim: r.angle(),
      invuln: r.u8() / 50, thrust: r.unit(), spawnAnim: r.unit(),
    });
  }

  const ne = r.u16();
  const en = {
    n: ne,
    id: new Uint16Array(ne), type: new Uint8Array(ne), flags: new Uint8Array(ne),
    x: new Float32Array(ne), y: new Float32Array(ne), rot: new Float32Array(ne),
    scale: new Float32Array(ne), spawnT: new Float32Array(ne), hitFlash: new Float32Array(ne),
    hp: new Float32Array(ne), extra: new Float32Array(ne),
    segStart: new Int32Array(ne), segCount: new Uint8Array(ne),
    segs: [],
    index: new Map(),
  };
  for (let i = 0; i < ne; i++) {
    en.id[i] = r.u16();
    en.type[i] = r.u8();
    en.flags[i] = r.u8();
    en.x[i] = r.pos(); en.y[i] = r.pos();
    en.rot[i] = r.angle();
    en.scale[i] = r.u8() / 100;
    en.spawnT[i] = r.unit();
    en.hitFlash[i] = r.unit();
    en.hp[i] = r.unit();
    en.extra[i] = r.unit();
    if (en.type[i] === SNAKE) {
      const c = r.u8();
      en.segCount[i] = c;
      en.segStart[i] = en.segs.length;
      for (let s = 0; s < c; s++) en.segs.push(r.pos(), r.pos());
    }
    en.index.set(en.id[i], i);
  }

  const ng = r.u16();
  const gm = {
    n: ng,
    id: new Uint16Array(ng), x: new Float32Array(ng), y: new Float32Array(ng),
    life: new Float32Array(ng), cap: new Int8Array(ng),
    index: new Map(),
  };
  for (let i = 0; i < ng; i++) {
    gm.id[i] = r.u16();
    gm.x[i] = r.pos(); gm.y[i] = r.pos();
    gm.life[i] = r.u8() / 20;
    const c = r.u8();
    gm.cap[i] = c === NONE ? -1 : c;
    gm.index.set(gm.id[i], i);
  }

  const nev = r.u16();
  snap.events = [];
  for (let i = 0; i < nev; i++) snap.events.push(readEvent(r));
  snap.enemies = en;
  snap.geoms = gm;
  return snap;
}

// ------------------------------------------------------------ guest report

export const GF = { MOVE: 1, GUN: 2, AIM_ACTIVE: 4, FIRING: 8, BOMB: 16, DIED: 32 };

export function encodeGuest(w, rep) {
  w.reset();
  w.u8(MSG.GUEST);
  w.u16(rep.seq);
  let flags = 0;
  if (rep.move) flags |= GF.MOVE;
  if (rep.gun) flags |= GF.GUN;
  if (rep.gun && rep.gun.aimActive) flags |= GF.AIM_ACTIVE;
  if (rep.gun && rep.gun.firing) flags |= GF.FIRING;
  if (rep.bomb) flags |= GF.BOMB;
  if (rep.died) flags |= GF.DIED;
  w.u8(flags);
  w.u8(rep.ship);
  w.u8(rep.gen & 0xff);
  if (rep.move) {
    const m = rep.move;
    w.pos(m.x); w.pos(m.y); w.vel(m.vx); w.vel(m.vy);
    w.unit(m.thrust);
    w.u8(Math.min(255, Math.round(m.invuln * 50)));
  }
  if (rep.gun) w.angle(rep.gun.aim);
  w.u8(Math.min(255, rep.shots.length));
  for (let i = 0; i < Math.min(255, rep.shots.length); i++) {
    const s = rep.shots[i];
    w.pos(s.x); w.pos(s.y); w.angle(s.angle);
  }
  w.u8(Math.min(255, rep.hits.length));
  for (let i = 0; i < Math.min(255, rep.hits.length); i++) {
    const h = rep.hits[i];
    w.u16(h.id); w.u8(h.seg); w.i8(Math.round(h.dx * 127)); w.i8(Math.round(h.dy * 127));
  }
  if (rep.died) { w.pos(rep.died.x); w.pos(rep.died.y); }
  return w.finish();
}

export function decodeGuest(buffer) {
  const r = new Reader(buffer);
  if (r.u8() !== MSG.GUEST) throw new Error('not a guest report');
  const rep = { seq: r.u16() };
  const flags = r.u8();
  rep.ship = r.u8();
  rep.gen = r.u8();
  rep.bomb = !!(flags & GF.BOMB);
  if (flags & GF.MOVE) {
    rep.move = { x: r.pos(), y: r.pos(), vx: r.vel(), vy: r.vel(), thrust: r.unit(), invuln: r.u8() / 50 };
  }
  if (flags & GF.GUN) {
    rep.gun = { aim: r.angle(), aimActive: !!(flags & GF.AIM_ACTIVE), firing: !!(flags & GF.FIRING) };
  }
  rep.shots = [];
  const ns = r.u8();
  for (let i = 0; i < ns; i++) rep.shots.push({ x: r.pos(), y: r.pos(), angle: r.angle() });
  rep.hits = [];
  const nh = r.u8();
  for (let i = 0; i < nh; i++) rep.hits.push({ id: r.u16(), seg: r.u8(), dx: r.i8() / 127, dy: r.i8() / 127 });
  if (flags & GF.DIED) rep.died = { x: r.pos(), y: r.pos() };
  return rep;
}

export function peekType(buffer) {
  return buffer.byteLength ? new Uint8Array(buffer)[0] : 0;
}

export { Writer, Reader };
