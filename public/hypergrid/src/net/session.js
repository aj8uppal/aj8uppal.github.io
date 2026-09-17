/**
 * An online session between a host and one guest.
 *
 * Lobby: the host owns the room, the mode and the seating; both can ask for a
 * change. Play: the host runs the world and streams snapshots; the guest
 * renders them ~100 ms in the past, interpolated, so motion is smooth despite
 * packet jitter — while everything the guest *does* (flying, shooting,
 * collecting) is simulated locally and reported, so it never waits on the
 * network to feel responsive.
 *
 * Seat 0 is the host, seat 1 the guest. In Co-Op each seat owns a ship; in
 * Co-Pilot both seats share ship 0 and `pilot` says which seat flies it.
 */

import { RelayClient } from './relay.js';
import { relayUrl } from './config.js';
import {
  PROTOCOL_VERSION, MSG, EV, Writer, encodeSnapshot, decodeSnapshot, encodeGuest, decodeGuest, peekType,
} from './protocol.js';
import { MODES, PLAYER } from '../game/config.js';
import { clamp, lerp, angleLerp } from '../core/math.js';

const SNAPSHOT_HZ = 30;
const GUEST_HZ = 60;
const SNAKE = 4;
const NEST = 7;
const BLACKHOLE = 5;
const PREDICT_WINDOW = 1500;   // ms a predicted kill stays hidden awaiting the host

export class NetSession {
  constructor(game) {
    this.game = game;
    this.relay = null;
    this.status = 'idle';        // idle | connecting | lobby | playing | closed
    this.isHost = false;
    this.code = '';
    this.names = ['', ''];
    this.peerPresent = false;
    this.mode = 'coop';
    this.pilot = 0;              // Co-Pilot: which seat flies
    this.rtt = 0;
    this.pingId = 0;
    this.pingAt = 0;
    this.error = '';
    this.partnerLost = false;

    this.onChange = null;        // lobby/connection info changed
    this.onStart = null;         // a game is starting (or resuming)
    this.onLobby = null;         // back to the lobby
    this.onEnd = null;           // session over; argument is a message or ''

    // host
    this.events = [];
    this.inbox = [];
    this.snapSeq = 0;
    this.snapTimer = 0;
    this.writer = new Writer(32768);

    // guest
    this.gwriter = new Writer(2048);
    this._resetReplica();
  }

  get localSeat() { return this.isHost ? 0 : 1; }
  get peerSeat() { return this.isHost ? 1 : 0; }
  get localName() { return this.names[this.localSeat]; }
  get peerName() { return this.names[this.peerSeat]; }
  get modeInfo() { return MODES[this.mode]; }

  /** Ship index the guest controls part of. */
  get guestShip() { return this.mode === 'coop' ? 1 : 0; }

  /** Human-readable role for a seat, e.g. "PILOT", "GUNNER", "SHIP 2". */
  roleOf(seat) {
    if (this.mode === 'copilot') {
      if (this.partnerLost && seat === this.localSeat) return 'PILOT + GUNNER';
      return seat === this.pilot ? 'PILOT' : 'GUNNER';
    }
    return seat === 0 ? 'SHIP 1' : 'SHIP 2';
  }

  _changed() { if (this.onChange) this.onChange(); }

  // ---------------------------------------------------------------- lobby

  async host(mode, name) {
    this.isHost = true;
    this.mode = MODES[mode] && MODES[mode].online ? mode : 'coop';
    this.names = [name, ''];
    await this._connect();
    const res = await this.relay.host(this.mode, name);
    this.code = res.code;
    this.status = 'lobby';
    this._changed();
  }

  async join(code, name) {
    this.isHost = false;
    this.names = ['', name];
    await this._connect();
    const res = await this.relay.join(code.toUpperCase(), name);
    this.code = res.code;
    this.names[0] = res.hostName || 'HOST';
    this.peerPresent = true;
    this.status = 'lobby';
    this.relay.send({ t: 'hello', v: PROTOCOL_VERSION, name });
    this._changed();
  }

  async _connect() {
    this.status = 'connecting';
    this.error = '';
    this._changed();
    const relay = new RelayClient(relayUrl());
    this.relay = relay;
    relay.on('message', (m) => this._peer(m));
    relay.on('binary', (b) => this._binary(b));
    relay.on('peer-joined', (m) => {
      this.peerPresent = true;
      this.names[1] = m.name || 'GUEST';
      this._changed();
    });
    relay.on('peer-left', () => this._peerGone());
    relay.on('host-left', () => this._end('The host left the game.'));
    relay.on('close', () => this._end('Lost the connection to the multiplayer server.'));
    try {
      await relay.connect();
    } catch (err) {
      this.status = 'closed';
      throw err;
    }
    this.pingTimer = setInterval(() => this._ping(), 2000);
  }

  setMode(mode) {
    if (!MODES[mode] || !MODES[mode].online) return;
    if (this.isHost) { this.mode = mode; this._sendLobby(); }
    else this.relay.send({ t: 'lobby-req', mode });
  }

  swapRoles() {
    if (this.isHost) { this.pilot = this.pilot === 0 ? 1 : 0; this._sendLobby(); }
    else this.relay.send({ t: 'lobby-req', swap: true });
  }

  startGame() {
    if (!this.isHost || !this.peerPresent) return;
    this.relay.send({ t: 'start', mode: this.mode, pilot: this.pilot, names: this.names });
    this._beginPlay(false);
  }

  returnToLobby() {
    if (!this.isHost) return;
    this.relay.send({ t: 'to-lobby' });
    this.status = 'lobby';
    this.partnerLost = false;
    if (this.onLobby) this.onLobby();
    this._changed();
  }

  leave() {
    if (this.relay && this.relay.open) this.relay.send({ t: 'bye' });
    this._end('');
  }

  _sendLobby() {
    this._changed();
    if (this.relay && this.peerPresent) {
      this.relay.send({ t: 'lobby', mode: this.mode, pilot: this.pilot, names: this.names, code: this.code });
    }
  }

  _beginPlay(resume) {
    this.status = 'playing';
    this.partnerLost = false;
    this.events.length = 0;
    this.inbox.length = 0;
    this.snapTimer = 0;
    this._resetReplica();
    this.resume = resume;
    if (this.onStart) this.onStart({ resume });
    this._changed();
  }

  _peer(m) {
    switch (m.t) {
      case 'hello':
        if (m.v !== PROTOCOL_VERSION) {
          this.relay.send({ t: 'version', v: PROTOCOL_VERSION });
          this._end('You and your friend are running different versions of the game. Both of you reload the page and try again.');
          return;
        }
        if (this.isHost) {
          this.names[1] = String(m.name || 'GUEST').slice(0, 12);
          this.peerPresent = true;
          const st = this.game.state;
          if (this.status === 'playing' && st !== 'gameover' && st !== 'menu') {
            // A friend (re)joined mid-run: drop them straight into it.
            this.relay.send({ t: 'start', mode: this.mode, pilot: this.pilot, names: this.names, resume: true });
            this.partnerLost = false;
            this.game.onPartnerRejoined();
          } else {
            if (this.status === 'playing') this.returnToLobby();
            this._sendLobby();
          }
        }
        break;
      case 'version':
        this._end('You and your friend are running different versions of the game. Both of you reload the page and try again.');
        break;
      case 'lobby':
        if (this.isHost) return;
        this.mode = m.mode; this.pilot = m.pilot; this.names = m.names;
        if (this.status === 'playing') {
          this.status = 'lobby';
          if (this.onLobby) this.onLobby();
        }
        this.status = 'lobby';
        this._changed();
        break;
      case 'lobby-req':
        if (!this.isHost || this.status !== 'lobby') return;
        if (m.mode && MODES[m.mode] && MODES[m.mode].online) this.mode = m.mode;
        if (m.swap) this.pilot = this.pilot === 0 ? 1 : 0;
        this._sendLobby();
        break;
      case 'start':
        if (this.isHost) return;
        this.mode = m.mode; this.pilot = m.pilot; this.names = m.names;
        this._beginPlay(!!m.resume);
        break;
      case 'to-lobby':
        if (this.isHost) return;
        this.status = 'lobby';
        if (this.onLobby) this.onLobby();
        this._changed();
        break;
      case 'bye':
        if (this.isHost) this._peerGone();
        else this._end('The host left the game.');
        break;
      case 'ppng':
        this.relay.send({ t: 'ppong', id: m.id });
        break;
      case 'ppong': {
        if (m.id === this.pingId && this.pingAt) {
          const sample = performance.now() - this.pingAt;
          this.rtt = this.rtt ? this.rtt * 0.6 + sample * 0.4 : sample;
        }
        break;
      }
      default:
        break;
    }
  }

  _ping() {
    if (!this.relay || !this.relay.open || !this.peerPresent) return;
    this.pingId = (this.pingId + 1) % 1e6;
    this.pingAt = performance.now();
    this.relay.send({ t: 'ppng', id: this.pingId });
  }

  _peerGone() {
    this.peerPresent = false;
    this.rtt = 0;
    if (this.isHost) {
      if (this.status === 'playing') {
        this.partnerLost = true;
        this.game.onPartnerLost();
      }
    }
    this._changed();
  }

  _end(message) {
    if (this.status === 'closed') return;
    this.status = 'closed';
    this.error = message;
    clearInterval(this.pingTimer);
    if (this.relay) { this.relay.close(); }
    if (this.onEnd) this.onEnd(message);
  }

  _binary(buffer) {
    const type = peekType(buffer);
    try {
      if (this.isHost && type === MSG.GUEST) {
        if (this.status === 'playing') this.inbox.push(decodeGuest(buffer));
      } else if (!this.isHost && type === MSG.SNAPSHOT) {
        if (this.status === 'playing') this._onSnapshot(decodeSnapshot(buffer));
      }
    } catch (err) {
      console.warn('Dropped a malformed game packet', err);
    }
  }

  // ------------------------------------------------------------------ host

  /** Apply everything the guest reported since the last frame. */
  hostBeforeUpdate() {
    const game = this.game;
    for (const rep of this.inbox) {
      const p = game.players[rep.ship];
      if (!p) continue;
      const current = rep.gen === (p.gen & 0xff);
      const n = p.net;
      if (rep.move && current && !p.localMove) {
        n.has = true; n.exact = false;
        n.x = rep.move.x; n.y = rep.move.y;
        n.vx = rep.move.vx; n.vy = rep.move.vy;
        n.thrust = rep.move.thrust;
        n.invuln = rep.move.invuln;
      }
      if (rep.gun && !p.localGun) {
        n.has = true;
        n.aim = rep.gun.aim;
        n.aimActive = rep.gun.aimActive;
        n.firing = rep.gun.firing;
      }
      if (p.alive) {
        for (const s of rep.shots) game.remoteVolley(p.index, s.x, s.y, s.angle);
      }
      for (const h of rep.hits) {
        const e = game.enemies.findById(h.id);
        if (e) game.enemies.damage(e, h.seg === 255 ? 0 : h.seg, 1, h.dx, h.dy, game, 1);
      }
      if (rep.died && current && p.alive) {
        p.x = rep.died.x; p.y = rep.died.y;
        game.killPlayer(p, { force: true });
      }
      if (rep.bomb) game.useBomb(p);
    }
    this.inbox.length = 0;
  }

  hostEvent(kind, a) {
    if (this.status === 'playing' && this.peerPresent) this.events.push({ kind, a });
  }

  hostAfterUpdate(dt) {
    if (!this.peerPresent || !this.relay || !this.relay.open) {
      this.events.length = 0;
      return;
    }
    this.snapTimer += dt;
    const interval = 1 / SNAPSHOT_HZ;
    if (this.snapTimer < interval) return;
    this.snapTimer = Math.min(this.snapTimer - interval, interval);
    // Back-pressure: if the socket is congested, hold this snapshot (events
    // are kept and ride along with the next one).
    if (this.relay.buffered > 384 * 1024) return;
    const buf = encodeSnapshot(this.writer, this.game, this.snapSeq, performance.now(), this.events);
    this.snapSeq = (this.snapSeq + 1) & 0xffff;
    this.events.length = 0;
    this.relay.sendBinary(buf);
  }

  // ----------------------------------------------------------------- guest

  _resetReplica() {
    this.buffer = [];
    this.eventQueue = [];
    this.lastSnap = null;
    this.clock = 0;
    this.clockInit = false;
    this.delay = 100;
    this.jitter = 0;
    this.lastSnapAt = 0;
    this.stalled = false;
    this.frame = 0;
    this.replicaEnemies = new Map();
    this.replicaGeoms = new Map();
    this.predictedDead = new Map();
    this.predictedSever = new Map();
    this.predictedGeoms = new Map();
    this.localFlash = new Map();
    this.pendingShots = [];
    this.pendingHits = [];
    this.pendingBomb = false;
    this.pendingDeath = null;
    this.guestSeq = 0;
    this.guestTimer = 0;
    this.shipInitialised = false;
  }

  _onSnapshot(snap) {
    const now = performance.now();
    snap.recv = now;
    if (this.lastSnap) {
      const expected = snap.hostTime - this.lastSnap.hostTime;
      const actual = now - this.lastSnap.recv;
      this.jitter += (Math.abs(actual - expected) - this.jitter) * 0.1;
    }
    this.lastSnap = snap;
    this.buffer.push(snap);
    if (this.buffer.length > 16) this.buffer.shift();
    for (const ev of snap.events) this.eventQueue.push({ at: snap.hostTime, ev });
    this.lastSnapAt = now;
    // Render far enough behind to always have two snapshots to blend between.
    this.delay = clamp(1000 / SNAPSHOT_HZ * 2.2 + this.jitter * 2.5, 70, 240);
    if (!this.clockInit) {
      this.clock = snap.hostTime - this.delay;
      this.clockInit = true;
    }
  }

  /** Advance the render clock and apply the interpolated world to the game. */
  guestUpdate(dt) {
    const game = this.game;
    const latest = this.lastSnap;
    const now = performance.now();
    this.stalled = !!latest && now - this.lastSnapAt > 1200;
    if (!latest) return false;

    const target = latest.hostTime + (now - latest.recv) - this.delay;
    this.clock += dt * 1000;
    const err = target - this.clock;
    if (Math.abs(err) > 250) this.clock = target;
    else this.clock += err * Math.min(1, dt * 3);

    const buf = this.buffer;
    let a = buf[0];
    let b = buf[0];
    for (let i = 0; i < buf.length; i++) {
      if (buf[i].hostTime <= this.clock) a = buf[i];
      b = buf[i];
      if (buf[i].hostTime >= this.clock) break;
    }
    let t = 0;
    if (b !== a && b.hostTime > a.hostTime) t = clamp((this.clock - a.hostTime) / (b.hostTime - a.hostTime), 0, 1);
    // Drop snapshots the clock has fully passed.
    while (buf.length > 2 && buf[1].hostTime <= this.clock) buf.shift();

    game.score = a.score;
    game.multiplier = a.mult;
    game.geomProgress = a.progress;
    game.lives = a.lives;
    game.bombs = a.bombs;
    game.runTime = a.runTime;
    game.difficulty = a.difficulty;
    if (game.state !== 'gameover') game.state = a.state === 'dying' ? 'dying' : 'playing';

    this.frame++;
    if (!this.shipInitialised) this._initLocalShip(a);
    this._syncPlayers(a, b, t);
    this._syncEnemies(a, b, t, dt, now);
    this._syncGeoms(a, b, t, dt, now);
    this._dispatchEvents();
    return true;
  }

  _initLocalShip(snap) {
    const game = this.game;
    const p = game.players[this.guestShip];
    const rec = snap.players[this.guestShip];
    this.shipInitialised = true;
    if (!p || !rec || !p.localMove) return;
    // Resuming mid-run: start the ship wherever the host last had it.
    if (this.resume) {
      p.reset(rec.x, rec.y);
      p.gen = rec.gen;
      p.alive = rec.alive;
      p.out = rec.out;
    }
  }

  _syncPlayers(a, b, t) {
    const game = this.game;
    for (let i = 0; i < b.players.length; i++) {
      const p = game.players[i];
      if (!p) continue;
      const rb = b.players[i];
      const ra = a.players[i] || rb;
      p.out = rb.out;
      if (!p.localMove) {
        const n = p.net;
        n.has = true;
        n.exact = true;
        const same = ra.gen === rb.gen;
        n.x = same ? lerp(ra.x, rb.x, t) : rb.x;
        n.y = same ? lerp(ra.y, rb.y, t) : rb.y;
        n.vx = rb.vx; n.vy = rb.vy;
        n.thrust = rb.thrust;
        n.invuln = rb.invuln;
        const alive = t < 0.5 ? ra.alive : rb.alive;
        if (alive && !p.alive) { p.reset(n.x, n.y); p.spawnAnim = 0; }
        p.alive = alive;
      }
      if (!p.localGun) {
        p.net.has = true;
        p.net.aim = angleLerp(ra.aim, rb.aim, t);
        p.net.aimActive = rb.aimActive;
        p.net.firing = rb.firing;
      }
    }
  }

  _syncEnemies(a, b, t, dt, now) {
    const game = this.game;
    const em = game.enemies;
    const E = b.enemies;
    const A = a.enemies;
    const frame = this.frame;
    for (let i = 0; i < E.n; i++) {
      const id = E.id[i];
      const pd = this.predictedDead.get(id);
      if (pd !== undefined) {
        if (now < pd) continue;
        this.predictedDead.delete(id);
      }
      const type = E.type[i];
      let e = this.replicaEnemies.get(id);
      let fresh = false;
      if (!e || !e.alive || e.id !== id || e.type !== type) {
        e = em.replicaSpawn(type, id);
        this.replicaEnemies.set(id, e);
        fresh = true;
      }
      const j = a === b ? undefined : A.index.get(id);
      const px = e.x, py = e.y;
      if (j !== undefined) {
        e.x = lerp(A.x[j], E.x[i], t);
        e.y = lerp(A.y[j], E.y[i], t);
        e.rot = angleLerp(A.rot[j], E.rot[i], t);
        e.scale = lerp(A.scale[j], E.scale[i], t);
        e.spawnT = lerp(A.spawnT[j], E.spawnT[i], t);
      } else {
        e.x = E.x[i]; e.y = E.y[i];
        e.rot = E.rot[i];
        e.scale = E.scale[i];
        e.spawnT = E.spawnT[i];
      }
      if (!fresh && dt > 0) {
        e.vx = clamp((e.x - px) / dt, -2000, 2000);
        e.vy = clamp((e.y - py) / dt, -2000, 2000);
      }
      const flags = E.flags[i];
      e.spawning = !!(flags & 1);
      e.launched = !!(flags & 2);
      const lf = this.localFlash.get(id);
      e.hitFlash = lf !== undefined && now < lf ? 1 : E.hitFlash[i];
      e.hp = E.hp[i] * e.maxHp;
      if (type === NEST) e.spawnTimer = E.extra[i] * 2;
      else if (type === BLACKHOLE) e.chargeT = E.extra[i] * 0.45;
      if (type === SNAKE) {
        let c = E.segCount[i];
        const sev = this.predictedSever.get(id);
        if (sev) {
          if (now < sev.until) c = Math.min(c, sev.seg);
          else this.predictedSever.delete(id);
        }
        if (c <= 0) continue;
        const sb = E.segStart[i];
        const sa = j !== undefined ? A.segStart[j] : -1;
        const ca = j !== undefined ? A.segCount[j] : 0;
        for (let s = 0; s < c; s++) {
          const bx = E.segs[sb + s * 2], by = E.segs[sb + s * 2 + 1];
          if (sa >= 0 && s < ca) {
            e.segs[s * 2] = lerp(A.segs[sa + s * 2], bx, t);
            e.segs[s * 2 + 1] = lerp(A.segs[sa + s * 2 + 1], by, t);
          } else {
            e.segs[s * 2] = bx;
            e.segs[s * 2 + 1] = by;
          }
        }
        e.segCount = c;
      }
      e.mark = frame;
    }
    for (const [id, e] of this.replicaEnemies) {
      if (e.mark !== frame || e.id !== id) {
        if (e.id === id) e.alive = false;
        this.replicaEnemies.delete(id);
      }
    }
    // Predictions the host has confirmed never reappear in a snapshot, so they
    // must be swept here or these maps grow for the whole run.
    for (const [id, until] of this.localFlash) if (now > until) this.localFlash.delete(id);
    for (const [id, until] of this.predictedDead) if (now > until) this.predictedDead.delete(id);
    for (const [id, sev] of this.predictedSever) if (now > sev.until) this.predictedSever.delete(id);
    em.pool.compact();
    em.rebuildHash(game);
  }

  _syncGeoms(a, b, t, dt, now) {
    const gm = this.game.geoms;
    const G = b.geoms;
    const A = a.geoms;
    const frame = this.frame;
    for (let i = 0; i < G.n; i++) {
      const id = G.id[i];
      if (this.predictedGeoms.has(id)) continue;
      let g = this.replicaGeoms.get(id);
      if (!g || !g.alive || g.id !== id) {
        g = gm.pool.spawn();
        g.id = id;
        g.x = G.x[i]; g.y = G.y[i];
        g.vx = 0; g.vy = 0;
        g.rot = id * 0.7;
        g.rotSpeed = (((id * 37) % 14) - 7) * 0.5;
        g.seed = id % 100;
        g.local = false;
        g.captured = -1;
        g.capT = 0;
        g.pull = 0;
        this.replicaGeoms.set(id, g);
      }
      if (!g.local) {
        const j = a === b ? undefined : A.index.get(id);
        const px = g.x, py = g.y;
        g.x = j !== undefined ? lerp(A.x[j], G.x[i], t) : G.x[i];
        g.y = j !== undefined ? lerp(A.y[j], G.y[i], t) : G.y[i];
        if (dt > 0) { g.vx = (g.x - px) / dt; g.vy = (g.y - py) / dt; }
        g.captured = G.cap[i];
        g.pull = g.captured >= 0 ? 0.8 : 0;
      }
      g.life = G.life[i];
      g.mark = frame;
    }
    for (const [id, g] of this.replicaGeoms) {
      if (g.mark !== frame || g.id !== id) {
        if (g.id === id) g.alive = false;
        this.replicaGeoms.delete(id);
      }
    }
    for (const [id, until] of this.predictedGeoms) if (now > until) this.predictedGeoms.delete(id);
    gm.pool.compact();
  }

  _dispatchEvents() {
    const q = this.eventQueue;
    let n = 0;
    while (n < q.length && q[n].at <= this.clock) {
      this._guestEvent(q[n].ev);
      n++;
    }
    if (n) q.splice(0, n);
  }

  _guestEvent(ev) {
    const game = this.game;
    switch (ev.kind) {
      case EV.KILL: {
        let predicted;
        if (ev.type === SNAKE) {
          const s = this.predictedSever.get(ev.id);
          predicted = !!s && ev.seg >= s.seg;
        } else {
          predicted = this.predictedDead.has(ev.id);
        }
        game.fxKill(ev.type, ev.x, ev.y, ev.vx, ev.vy, ev.gained, ev.cause, !predicted);
        break;
      }
      case EV.DAMAGE:
        if (!this.localFlash.has(ev.id)) game.fxDamage(ev.type, ev.x, ev.y);
        break;
      case EV.ABSORB: game.fxAbsorb(ev.type, ev.x, ev.y); break;
      case EV.BH_BURST: game.fxBlackHoleBurst(ev.x, ev.y); break;
      case EV.ROCKET: game.fxRocketLaunch(ev.x, ev.y, ev.rot); break;
      case EV.NEST: game.fxNestSpawn(ev.x, ev.y); break;
      case EV.SHOT: game.remoteVolley(ev.player, ev.x, ev.y, ev.angle); break;
      case EV.COLLECT:
        if (!this.predictedGeoms.has(ev.id)) game.fxGeomCollect(ev.player, ev.progress, ev.x, ev.y);
        break;
      case EV.MULT: game.fxMultUp(ev.mult, ev.player); break;
      case EV.EXTRA_LIFE: game.fxExtraLife(); break;
      case EV.RING: game.spawnRing(ev.x, ev.y, ev.max, ev.color, ev.lethal, ev.speed); break;
      case EV.DEATH: {
        const p = game.players[ev.player];
        // A ship we fly already showed its own death the instant it happened.
        if (p && !p.localMove) {
          p.alive = false;
          game.fxPlayerDeath(ev.player, ev.x, ev.y);
        }
        break;
      }
      case EV.RESPAWN: {
        const p = game.players[ev.player];
        if (!p) break;
        p.reset(ev.x, ev.y);
        p.gen = ev.gen;
        p.invuln = PLAYER.spawnInvuln;
        break;
      }
      case EV.BOMB: game.fxBomb(ev.player, ev.x, ev.y); break;
      case EV.GAMEOVER: game.endGameFromHost(ev); break;
      default: break;
    }
  }

  // ---- things the guest does locally and reports

  /** Our bullet hit a replicated enemy: report it and predict the outcome. */
  reportHit(e, seg, dx, dy) {
    const game = this.game;
    const now = performance.now();
    this.pendingHits.push({ id: e.id, seg: e.type === SNAKE ? seg : 255, dx, dy });
    if (e.type === SNAKE) {
      const s = Math.min(seg, e.segCount - 1);
      const prev = this.predictedSever.get(e.id);
      if (!prev || s < prev.seg || now > prev.until) {
        for (let i = s; i < e.segCount; i++) {
          game.fxKill(SNAKE, e.segs[i * 2], e.segs[i * 2 + 1], e.vx, e.vy, 0, 'shot', true);
        }
        this.predictedSever.set(e.id, { seg: s, until: now + PREDICT_WINDOW });
        e.segCount = s;
        if (s <= 0) e.alive = false;
      }
      return;
    }
    if (e.hp <= 1.001) {
      this.predictedDead.set(e.id, now + PREDICT_WINDOW);
      e.alive = false;
      game.fxKill(e.type, e.x, e.y, e.vx, e.vy, 0, 'shot', true);
    } else {
      this.localFlash.set(e.id, now + 110);
      e.hitFlash = 1;
      game.fxDamage(e.type, e.x, e.y);
    }
  }

  reportDeath(p) { this.pendingDeath = { x: p.x, y: p.y }; }
  reportShot(x, y, angle) { this.pendingShots.push({ x, y, angle }); }
  requestBomb() { this.pendingBomb = true; }

  predictCollect(g) {
    this.predictedGeoms.set(g.id, performance.now() + 4000);
    this.game.fxGeomPredicted(g);
  }

  guestSend(dt) {
    if (!this.relay || !this.relay.open) return;
    this.guestTimer += dt;
    const urgent = this.pendingHits.length || this.pendingShots.length || this.pendingDeath || this.pendingBomb;
    if (this.guestTimer < 1 / GUEST_HZ && !urgent) return;
    this.guestTimer = 0;
    const p = this.game.players[this.guestShip];
    if (!p) return;
    const rep = {
      seq: this.guestSeq,
      ship: this.guestShip,
      gen: p.gen,
      bomb: this.pendingBomb,
      died: this.pendingDeath,
      shots: this.pendingShots,
      hits: this.pendingHits,
    };
    if (p.localMove) rep.move = { x: p.x, y: p.y, vx: p.vx, vy: p.vy, thrust: p.thrust, invuln: p.invuln };
    if (p.localGun) rep.gun = { aim: p.aim, aimActive: p.aimActive, firing: p.firing };
    this.relay.sendBinary(encodeGuest(this.gwriter, rep));
    this.guestSeq = (this.guestSeq + 1) & 0xffff;
    this.pendingShots = [];
    this.pendingHits = [];
    this.pendingBomb = false;
    this.pendingDeath = null;
  }
}
