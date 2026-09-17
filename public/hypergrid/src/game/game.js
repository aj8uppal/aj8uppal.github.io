/**
 * Game core: state machine, simulation, collision, scoring and presentation.
 *
 * The update order matters and is deliberate:
 *   director -> ships -> bullets -> enemies -> mode objects -> collisions
 *   -> pickups -> particles -> grid -> camera/effects
 * Collisions run after everything has moved, against a hash rebuilt at the end
 * of the enemy update, so nothing is ever tested against stale positions.
 *
 * Online, the same class runs on both machines. The host takes the
 * authoritative path; the guest takes `updateGuest`, which applies the host's
 * replicated world and simulates only what the guest itself controls. To make
 * that work every gameplay event is split in two: the *logic* (score, drops,
 * lives — host only) and the *effect* (`fx*`: particles, sound, shake — both
 * machines). The host broadcasts each effect as a compact event and the guest
 * replays it through the very same `fx*` method.
 */

import { clamp, clamp01, lerp, damp, TAU, commafy, Pool } from '../core/math.js';
import {
  ARENA, PALETTE, PALETTE_CB, PLAYER, PLAYER_STYLES, SCORING, MODES, QUALITY, ENEMY_STATS,
} from './config.js';
import { Player } from './player.js';
import { Bullets } from './bullets.js';
import { Geoms } from './geoms.js';
import { Particles } from './particles.js';
import { Grid } from './grid.js';
import { EnemyManager, T, TYPE_KEYS } from './enemies.js';
import { Director } from './director.js';
import { Gates, Zones } from './modes.js';
import { save } from './save.js';
import { CROSSHAIR } from './shapes.js';
import { EV, RING_COLORS, CAUSES } from '../net/protocol.js';

export const STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  DYING: 'dying',
  GAMEOVER: 'gameover',
};

const GEOM_DROPS = {
  [T.GRUNT]: 1, [T.WANDERER]: 2, [T.WEAVER]: 2, [T.PINWHEEL]: 3,
  [T.SNAKE]: 1, [T.BLACKHOLE]: 22, [T.ROCKET]: 2, [T.NEST]: 6, [T.SEEKER]: 1,
};

function makePopup() {
  return { alive: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, text: '', size: 18, color: null, glow: 1 };
}
function makeWave() {
  return {
    alive: false, x: 0, y: 0, r: 0, prev: 0, max: 0, speed: 0, color: null,
    lethal: false, kills: false, life: 0, width: 4, cause: 'bomb',
  };
}

export class Game {
  constructor(audio, music, input, camera) {
    this.audio = audio;
    this.music = music;
    this.input = input;
    this.camera = camera;

    this.state = STATE.MENU;
    this.pal = PALETTE;

    this.ships = [new Player(0), new Player(1)];
    this.players = [this.ships[0]];
    this.net = null;

    this.bullets = new Bullets();
    this.geoms = new Geoms();
    this.particles = new Particles(QUALITY.high.maxParticles);
    this.grid = new Grid();
    this.enemies = new EnemyManager();
    this.director = new Director();
    this.gates = new Gates();
    this.zones = new Zones();

    this.popups = new Pool(makePopup, 128);
    this.waves = new Pool(makeWave, 24);

    this.arena = { minX: -800, maxX: 800, minY: -500, maxY: 500, width: 1600, height: 1000, halfW: 800, halfH: 500, centerX: 0, centerY: 0 };
    this.wallFlash = [0, 0, 0, 0];

    this.mode = MODES.evolved;
    this.score = 0;
    this.displayScore = 0;
    this.multiplier = 1;
    this.peakMultiplier = 1;
    this.geomProgress = 0;
    this.lives = 3;
    this.bombs = 3;
    this.kills = 0;
    this.killsBy = [0, 0];
    this.time = 0;
    this.runTime = 0;
    this.difficulty = 0;
    this.nextExtraLife = SCORING.extraLifeBase;
    this.extraLifeStep = SCORING.extraLifeBase;

    this.timeScale = 1;
    this.hitstop = 0;
    this.slowmo = 0;
    this.gameOverTimer = 0;
    this.announceText = '';
    this.announceTime = 0;
    this.announceMax = 1;
    this.announceSub = '';

    this.fireRateMul = 1;
    this.playerSpeedMul = 1;
    this.magnetMul = 1;

    this.flash = 0;
    this.flashColor = [1, 1, 1];
    this.shockAmp = 0;
    this.shockPos = [0.5, 0.5, 0];
    this.shockT = 0;
    this.shockDur = 0.6;

    this.intensity = 0;
    this.cssWidth = 1280;
    this.cssHeight = 720;
    this.showTitle = false;
    this.settings = save.settings;
    this.reducedFlash = false;
    this.lastRank = 0;
    this.newRecord = false;
    this.onGameOver = null;
    this.gateChainBest = 0;
    this.shotsHit = 0;
    this.shotsFired = 0;
  }

  get player() { return this.players[0]; }
  get online() { return this.net !== null; }
  get isGuest() { return this.net !== null && !this.net.isHost; }
  get isAuthority() { return !this.isGuest; }

  /** True if this machine flies or shoots with ship `idx`. */
  isLocalShip(idx) {
    const p = this.players[idx];
    return !!p && (p.localMove || p.localGun);
  }

  /** The ship this machine bombs from and aims with. */
  localShip() {
    for (const p of this.players) if (p.localGun) return p;
    for (const p of this.players) if (p.localMove) return p;
    return this.players[0];
  }

  // ------------------------------------------------------------------ setup

  applySettings(s) {
    this.settings = s;
    this.pal = s.colorblind ? PALETTE_CB : PALETTE;
    const q = QUALITY[s.quality] || QUALITY.high;
    this.quality = q;
    this.particles.setCapacity(q.maxParticles);
    this.particles.densityScale = q.particleScale;
    this.camera.shakeAmount = s.screenShake;
    this.grid.warpScale = s.gridWarp;
    this.grid.enabled = s.gridWarp > 0.01;
    this.reducedFlash = s.reducedFlash;
    this.input.invertAim = s.invertAim;
    this.input.autoFire = s.autoFire;
    this.input.vibration = s.vibration;
    this.input.deadzone = s.deadzone;
    this.resize(this.camera.pixelWidth, this.camera.pixelHeight, true);
  }

  resize(pixelWidth, pixelHeight, force = false) {
    const canvasAspect = pixelWidth / Math.max(1, pixelHeight);
    // Online, both screens must agree on the arena, so it is fixed at 16:9
    // rather than following each player's window.
    const aspect = this.online ? 16 / 9 : clamp(canvasAspect, ARENA.minAspect, ARENA.maxAspect);
    const halfH = ARENA.halfH;
    const halfW = halfH * aspect;

    const a = this.arena;
    const changed = force || Math.abs(a.halfW - halfW) > 0.5;
    a.halfW = halfW; a.halfH = halfH;
    a.minX = -halfW; a.maxX = halfW;
    a.minY = -halfH; a.maxY = halfH;
    a.width = halfW * 2; a.height = halfH * 2;
    a.centerX = 0; a.centerY = 0;

    // Frame the whole arena with a little breathing room.
    const pad = 1.1;
    const fitH = canvasAspect >= halfW / halfH ? halfH : halfW / canvasAspect;
    this.camera.setViewport(pixelWidth, pixelHeight, fitH * pad);

    if (changed) {
      const sp = (this.quality || QUALITY.high).gridSpacing;
      this.grid.build(a.minX - sp, a.minY - sp, a.maxX + sp, a.maxY + sp, sp);
    }
  }

  /** The canvas size in CSS pixels, which is what a thumb and an eye measure. */
  setCssViewport(width, height) {
    this.cssWidth = Math.max(1, width);
    this.cssHeight = Math.max(1, height);
  }

  /**
   * How far to zoom in during play. Fitting the whole arena on a phone makes a
   * ship about five pixels across, so small screens zoom until a ship is
   * comfortably visible and the camera follows it instead. Desktop and tablet
   * screens already clear the bar and keep the classic whole-arena view.
   */
  playZoom() {
    const SHIP_RADIUS_CSS = 8;
    const worldPerCss = (this.camera.baseHalfH * 2) / this.cssHeight;
    const shipCss = PLAYER.radius / worldPerCss;
    return clamp(SHIP_RADIUS_CSS / shipCss, 1, 2.2);
  }

  // ------------------------------------------------------------------ flow

  start(modeId, net = null) {
    this.mode = MODES[modeId] || MODES.evolved;
    const wasOnline = this.online;
    this.net = net;
    if (wasOnline !== this.online) this.resize(this.camera.pixelWidth, this.camera.pixelHeight, true);

    this.state = STATE.PLAYING;
    this.score = 0;
    this.displayScore = 0;
    this.multiplier = 1;
    this.peakMultiplier = 1;
    this.geomProgress = 0;
    this.lives = this.mode.lives;
    this.bombs = this.mode.bombs;
    this.kills = 0;
    this.killsBy = [0, 0];
    this.time = 0;
    this.runTime = 0;
    this.difficulty = 0;
    this.nextExtraLife = SCORING.extraLifeBase;
    this.extraLifeStep = SCORING.extraLifeBase;
    this.timeScale = 1;
    this.hitstop = 0;
    this.slowmo = 0;
    this.gameOverTimer = 0;
    this.flash = 0;
    this.shockAmp = 0;
    this.lastRank = 0;
    this.newRecord = false;
    this.gateChainBest = 0;
    this.shotsHit = 0;
    this.shotsFired = 0;

    this.fireRateMul = 1;
    this.playerSpeedMul = 1;
    this.magnetMul = 1;
    if (this.mode.id === 'pacifism') this.playerSpeedMul = 1.14;

    const count = this.mode.ships || 1;
    this.players = this.ships.slice(0, count);
    for (const p of this.players) {
      p.gen = 0;
      p.deathTimer = 0;
      p.pendingRespawn = false;
      p.disconnected = false;
    }
    if (count === 2) {
      this.players[0].reset(-150, 0);
      this.players[1].reset(150, 0);
      this.players[1].heading = Math.PI;
      this.players[1].aim = Math.PI;
    } else {
      this.players[0].reset(0, 0);
    }
    for (const p of this.players) { p.prevX = p.x; p.prevY = p.y; }
    this._assignControl();

    this.bullets.clear();
    this.geoms.clear();
    this.particles.clear();
    this.enemies.clear();
    this.gates.clear();
    this.zones.clear();
    this.popups.clear();
    this.waves.clear();
    this.grid.reset();
    this.director.reset(this.mode.id);
    this.camera.reset(0, 0);

    if (this.mode.id === 'king') {
      for (let i = 0; i < 4; i++) this.zones.spawn(this, 0);
    }

    this.announce(this.mode.name, 1.4, this.mode.blurb);
    this.music.setMode('game');
    this.music.setIntensity(0.25);
    this.music.start('game');
    this.audio.ui('start');
  }

  /** Decide which halves of which ships this machine drives. */
  _assignControl() {
    const net = this.net;
    for (const p of this.players) {
      p.localMove = true;
      p.localGun = true;
      p.name = '';
      p.role = '';
      p.net.has = false;
    }
    if (!net) return;
    const seat = net.localSeat;
    if (this.mode.id === 'copilot') {
      const p = this.players[0];
      p.localMove = net.pilot === seat;
      p.localGun = !p.localMove;
    } else {
      this.players.forEach((p, i) => {
        p.localMove = i === seat;
        p.localGun = i === seat;
        p.name = (net.names[i] || `PILOT ${i + 1}`).toUpperCase();
      });
    }
  }

  pause() {
    if (this.online) return;
    if (this.state !== STATE.PLAYING && this.state !== STATE.DYING) return;
    this.state = STATE.PAUSED;
    this.music.duck(999);
    this.audio.ui('back');
  }

  resume() {
    if (this.state !== STATE.PAUSED) return;
    this.state = STATE.PLAYING;
    this.music.ducking = 0;
    this.audio.ui('select');
  }

  quitToMenu() {
    const wasOnline = this.online;
    this.state = STATE.MENU;
    this.net = null;
    this.players = [this.ships[0]];
    this.players[0].localMove = true;
    this.players[0].localGun = true;
    if (wasOnline) this.resize(this.camera.pixelWidth, this.camera.pixelHeight, true);
    this.music.setMode('menu');
    this.music.setIntensity(0);
    this.music.ducking = 0;
    this.enemies.clear();
    this.bullets.clear();
    this.geoms.clear();
    this.gates.clear();
    this.zones.clear();
    this.particles.clear();
    this.waves.clear();
    this.popups.clear();
    this.grid.reset();
    this.camera.reset(0, 0);
  }

  endGame() {
    if (this.state === STATE.GAMEOVER) return;
    this.state = STATE.GAMEOVER;
    this.gameOverTimer = 0;
    for (const p of this.players) p.alive = false;
    this._emit(EV.GAMEOVER, [this.score, this.peakMultiplier, this.runTime, this.killsBy[0], this.killsBy[1]]);
    this._recordResult({
      score: this.score,
      mult: this.peakMultiplier,
      time: this.runTime,
      kills: this.kills,
      wave: this.director.wave,
    });
  }

  /** Guest: the host declared the run over. */
  endGameFromHost(ev) {
    if (this.state === STATE.GAMEOVER) return;
    this.state = STATE.GAMEOVER;
    this.gameOverTimer = 0;
    this.score = ev.score;
    this.displayScore = ev.score;
    this.peakMultiplier = ev.mult;
    this.runTime = ev.time;
    this.killsBy = ev.kills.slice();
    this.kills = ev.kills[0] + ev.kills[1];
    for (const p of this.players) p.alive = false;
    this._recordResult({ score: ev.score, mult: ev.mult, time: ev.time, kills: this.kills, wave: 0 });
  }

  _recordResult(entry) {
    this.music.setIntensity(0);
    this.music.duck(3);
    const prevBest = save.highScore(this.mode.id);
    this.lastRank = save.submit(this.mode.id, entry);
    this.newRecord = entry.score > prevBest && entry.score > 0;
    save.addStats({ deaths: 1 });
    save.flush();
    if (this.onGameOver) this.onGameOver(entry, this.lastRank, this.newRecord);
  }

  onPartnerLost() {
    if (this.state === STATE.MENU || this.state === STATE.GAMEOVER) return;
    if (this.mode.id === 'copilot') {
      // Nobody is on the other half of the controls: take them both.
      const p = this.players[0];
      p.localMove = true;
      p.localGun = true;
      p.net.has = false;
      this.announce('PARTNER DISCONNECTED', 2.4, 'you have both controls until they rejoin');
    } else {
      const p = this.players[1];
      if (p) {
        p.alive = false;
        p.out = true;
        p.disconnected = true;
      }
      this.announce('PARTNER DISCONNECTED', 2.4, 'they can rejoin with the same code');
    }
  }

  onPartnerRejoined() {
    this._assignControl();
    const p = this.players[1];
    if (p && p.disconnected) {
      p.disconnected = false;
      p.out = false;
      this.respawn(p);
    }
    this.announce('PARTNER RECONNECTED', 1.4);
  }

  // ----------------------------------------------------------------- update

  update(rawDt) {
    this.time += rawDt;

    if (this.state === STATE.MENU) {
      this.updateMenuScene(rawDt);
      return;
    }
    if (this.state === STATE.PAUSED) {
      this.camera.update(rawDt * 0.15);
      this.camera.build();
      return;
    }
    if (this.isGuest) {
      this.updateGuest(rawDt);
      return;
    }

    // Hit-stop and slow motion bend time for one player; online they would
    // desynchronise two screens, so they are single-player only.
    let dt = rawDt;
    if (!this.online) {
      if (this.hitstop > 0) {
        this.hitstop -= rawDt;
        dt = 0;
      }
      if (this.slowmo > 0) {
        this.slowmo -= rawDt;
        this.timeScale = damp(this.timeScale, 0.3, 8, rawDt);
      } else {
        this.timeScale = damp(this.timeScale, 1, 4, rawDt);
      }
      dt *= this.timeScale;
    }
    dt = Math.min(dt, 1 / 24);

    const active = this.state === STATE.PLAYING || this.state === STATE.DYING;
    if (this.state === STATE.PLAYING || (this.online && active)) this.runTime += rawDt;

    // Mode timer.
    if (this.state === STATE.PLAYING && this.mode.timeLimit > 0 && this.runTime >= this.mode.timeLimit) {
      this.announce('TIME UP', 2.0);
      this.endGame();
    }

    if (active) this.director.update(dt, this);
    if (this.net) this.net.hostBeforeUpdate();

    for (const p of this.players) {
      p.prevX = p.x;
      p.prevY = p.y;
      p.update(dt, this, this.input);
    }
    this.bullets.update(dt, this);
    this.enemies.update(dt, this);
    if (this.mode.id === 'pacifism') this.gates.update(dt, this);

    this.updateCollisions();
    this.geoms.update(dt, this);
    this.particles.update(dt, this.arena, this.enemies.wells, this.enemies.wellCount);
    this.updateWaves(dt);
    this.grid.update(dt);
    this.updatePopups(dt);
    this.updateDeaths(rawDt);
    if (this.state === STATE.GAMEOVER) this.gameOverTimer += rawDt;

    this.updateScoreDisplay(rawDt);
    this.updateEffects(rawDt);
    this.updateAudioState(rawDt);

    if (this.state === STATE.PLAYING && this.input.pressed('bomb')) this.useBomb(this.localShip());
    if (this.net) this.net.hostAfterUpdate(rawDt);
  }

  /** Online guest frame: replicate the host's world, simulate our own half. */
  updateGuest(rawDt) {
    const dt = Math.min(rawDt, 1 / 24);
    const net = this.net;
    const synced = net.guestUpdate(dt);

    for (const p of this.players) {
      p.prevX = p.x;
      p.prevY = p.y;
      p.update(dt, this, this.input);
    }
    this.bullets.update(dt, this);
    this.enemies.replicaAmbient(dt, this);
    if (synced) this.updateGuestCollisions();
    this.geoms.updateGuest(dt, this, net.guestShip, (g) => net.predictCollect(g));
    this.particles.update(dt, this.arena, this.enemies.wells, this.enemies.wellCount);
    this.updateWaves(dt);
    this.grid.update(dt);
    this.updatePopups(dt);
    if (this.state === STATE.GAMEOVER) this.gameOverTimer += rawDt;

    this.updateScoreDisplay(rawDt);
    this.updateEffects(rawDt);
    this.updateAudioState(rawDt);

    if (this.state === STATE.PLAYING && this.input.pressed('bomb')) net.requestBomb();
    net.guestSend(rawDt);
  }

  updateMenuScene(dt) {
    // A calm attract-mode field of drifting wanderers behind the menus.
    this.director.difficulty = 0.25;
    this.difficulty = 0.25;
    if (this.enemies.count < 14 && Math.random() < dt * 2.2) {
      const a = this.arena;
      const type = Math.random() < 0.55 ? T.WANDERER : T.PINWHEEL;
      this.enemies.spawn(type, a.minX + Math.random() * a.width, a.minY + Math.random() * a.height, { instant: true });
    }
    for (const p of this.players) p.alive = false;
    this.enemies.update(dt, this);
    this.particles.update(dt, this.arena, this.enemies.wells, this.enemies.wellCount);
    this.grid.update(dt);
    this.updateWaves(dt);
    this.updatePopups(dt);
    this.updateEffects(dt);
    this.camera.targetX = Math.sin(this.time * 0.13) * this.arena.halfW * 0.035;
    this.camera.targetY = Math.cos(this.time * 0.11) * this.arena.halfH * 0.035;
    this.camera.targetZoom = 1;
    this.camera.update(dt);
    this.camera.build();
    this.music.setIntensity(0);
    this.music.update(dt);
  }

  updateAudioState(dt) {
    // Music intensity: how much trouble is on screen right now.
    const threat = clamp01(this.enemies.threatCount() / 46);
    const diff = clamp01(this.difficulty);
    const mult = clamp01(this.multiplier / 25);
    const target = this.state === STATE.GAMEOVER ? 0 : clamp01(threat * 0.5 + diff * 0.35 + mult * 0.25);
    this.music.setIntensity(target);
    this.music.update(dt);
    this.audio.setDrone(clamp01(this.enemies.blackHoleCount * 0.5));
    this.intensity = target;
  }

  updateScoreDisplay(dt) {
    // Rolling counter — the score visibly chases the real value.
    const diff = this.score - this.displayScore;
    if (Math.abs(diff) < 1) this.displayScore = this.score;
    else this.displayScore += diff * clamp01(dt * 9) + Math.sign(diff) * Math.min(Math.abs(diff), dt * 900);
  }

  updateEffects(dt) {
    this.flash = Math.max(0, this.flash - dt * (this.reducedFlash ? 6 : 3.4));
    for (let i = 0; i < 4; i++) this.wallFlash[i] = Math.max(0, this.wallFlash[i] - dt * 5.5);

    if (this.shockT > 0) {
      this.shockT -= dt;
      const t = 1 - clamp01(this.shockT / this.shockDur);
      // The ring must start with a non-zero radius and ramp its amplitude in
      // and out: a ripple centred at radius 0 tears a hole in the middle of
      // the frame, right where the player is standing.
      this.shockPos[2] = 0.05 + t * 0.72;
      this.shockAmp = Math.sin(t * Math.PI) * 0.0062 * (this.reducedFlash ? 0.35 : 1);
      if (this.shockT <= 0) this.shockAmp = 0;
    }

    if (this.state !== STATE.MENU) {
      const cam = this.camera;
      const zoom = this.playZoom();
      cam.targetZoom = zoom;
      if (zoom > 1.01) {
        // Follow this player's own ship (or whoever is still alive), leading a
        // little along its velocity, and stop at the walls rather than
        // showing empty space past them.
        const own = this.localShip();
        const ship = own.alive ? own : this.players.find((p) => p.alive);
        if (ship) {
          const viewHalfH = cam.baseHalfH / zoom;
          const viewHalfW = viewHalfH * cam.aspect;
          const limX = Math.max(0, this.arena.halfW + 36 - viewHalfW);
          const limY = Math.max(0, this.arena.halfH + 36 - viewHalfH);
          cam.targetX = clamp(ship.x + ship.vx * 0.12, -limX, limX);
          cam.targetY = clamp(ship.y + ship.vy * 0.12, -limY, limY);
        }
      } else {
        // Frame the ships: with two, the camera eases toward their midpoint.
        let sx = 0, sy = 0, n = 0;
        for (const p of this.players) {
          if (!p.alive) continue;
          sx += p.x; sy += p.y; n++;
        }
        if (n > 0) {
          cam.targetX = clamp((sx / n) * 0.07, -this.arena.halfW * 0.09, this.arena.halfW * 0.09);
          cam.targetY = clamp((sy / n) * 0.07, -this.arena.halfH * 0.09, this.arena.halfH * 0.09);
        }
      }
      cam.update(dt);
      cam.build();
    }

    if (this.announceTime > 0) this.announceTime -= dt;
  }

  updateWaves(dt) {
    const items = this.waves.items;
    for (let i = 0; i < this.waves.count; i++) {
      const w = items[i];
      w.prev = w.r;
      w.r += w.speed * dt;
      w.life -= dt;
      if (w.kills && this.enemies.count) {
        // Kill only what the ring front sweeps through this frame.
        const em = this.enemies;
        for (let e = 0; e < em.count; e++) {
          const en = em.items[e];
          if (!en.alive || en.spawning) continue;
          const d = Math.hypot(en.x - w.x, en.y - w.y);
          if (d <= w.r && d > w.prev - en.radius) {
            const cause = w.cause || 'bomb';
            if (en.type === T.SNAKE) {
              for (let s = 0; s < en.segCount; s++) {
                this.onKill(en, en.segs[s * 2], en.segs[s * 2 + 1], cause, s === 0 ? 1 : 0.5, w.by, s);
              }
              en.alive = false;
            } else {
              en.alive = false;
              this.onKill(en, en.x, en.y, cause, 1, w.by);
              if (en.type === T.BLACKHOLE) em.onBlackHoleDeath(en, this);
            }
          }
        }
        // Blow enemies outward ahead of the front.
        for (let e = 0; e < em.count; e++) {
          const en = em.items[e];
          if (!en.alive) continue;
          const dx = en.x - w.x, dy = en.y - w.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < w.max * 1.4) {
            const f = (1 - clamp01(d / (w.max * 1.4))) * 900 * dt;
            en.vx += (dx / d) * f;
            en.vy += (dy / d) * f;
          }
        }
      }
      if (w.r >= w.max || w.life <= 0) w.alive = false;
    }
    this.waves.compact();
  }

  updatePopups(dt) {
    const items = this.popups.items;
    for (let i = 0; i < this.popups.count; i++) {
      const p = items[i];
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy = damp(p.vy, 30, 2.4, dt);
      p.vx = damp(p.vx, 0, 2.4, dt);
    }
    this.popups.compact();
  }

  /**
   * Respawns and game over. Single player keeps the classic rule (a life is
   * spent on death, the run ends when none are left). Online, lives are a
   * shared pool of spare ships: a ship that dies with none left is out, and
   * the run ends when every ship is out.
   */
  updateDeaths(dt) {
    if (this.state === STATE.GAMEOVER) return;
    let alive = 0;
    let waiting = 0;
    for (const p of this.players) {
      if (p.alive) { alive++; continue; }
      if (p.out) continue;
      p.deathTimer -= dt;
      if (p.deathTimer > 0) { waiting++; continue; }
      if (!this.online) {
        if (this.lives > 0 || this.mode.lives === Infinity) {
          this.respawn(p);
          alive++;
        } else {
          this.endGame();
          return;
        }
      } else if (p.pendingRespawn) {
        this.respawn(p);
        alive++;
      } else {
        p.out = true;
      }
    }
    if (this.online && alive === 0 && waiting === 0) {
      this.endGame();
      return;
    }
    this.state = alive > 0 ? STATE.PLAYING : STATE.DYING;
  }

  // ------------------------------------------------------------- collisions

  updateCollisions() {
    const hash = this.enemies.hash;

    // --- bullets vs enemies
    const bullets = this.bullets.items;
    for (let i = 0; i < this.bullets.count; i++) {
      const b = bullets[i];
      if (!b.alive) continue;
      let consumed = false;
      hash.query(b.x, b.y, PLAYER.bulletRadius, (e, seg) => {
        if (consumed || !e.alive || e.spawning) return;
        consumed = true;
        b.alive = false;
        if (b.authority === 'damage') {
          const inv = 1 / (b.speed || 1);
          const died = this.enemies.damage(e, seg, 1, b.vx * inv, b.vy * inv, this, 0);
          this.shotsHit++;
          if (!died) this.audio.hit(this.panOf(b.x));
        }
        this.particles.burst(b.x, b.y, 4, PLAYER_STYLES[b.owner].bullet, 220, 0.18, { size: 2.4, drag: 6 });
        return true;
      });
    }
    this.bullets.pool.compact();

    // --- ships vs world: each ship is judged by whoever flies it
    if (this.state === STATE.GAMEOVER) return;
    for (const p of this.players) {
      if (!p.alive || !p.localMove) continue;
      const inZone = this.mode.id === 'king' ? this.zones.contains(p.x, p.y) : null;
      const safe = p.invuln > 0 || (this.mode.id === 'king' && inZone);
      if (!safe && this._touchingEnemy(p)) {
        this.killPlayer(p);
        continue;
      }
      // Pacifism gates use a swept test so you can't tunnel through at speed.
      if (this.mode.id === 'pacifism') {
        const res = this.gates.testPlayer(this, p.prevX, p.prevY, p.x, p.y, p.radius * 0.6);
        if (res) {
          if (res.type === 'hit') this.killPlayer(p);
          else this.gates.detonate(res.gate, this);
        }
      }
    }
  }

  /** Guest collisions: our bullets report hits, our ship reports its death. */
  updateGuestCollisions() {
    const hash = this.enemies.hash;
    const bullets = this.bullets.items;
    for (let i = 0; i < this.bullets.count; i++) {
      const b = bullets[i];
      if (!b.alive) continue;
      let consumed = false;
      hash.query(b.x, b.y, PLAYER.bulletRadius, (e, seg) => {
        if (consumed || !e.alive || e.spawning) return;
        consumed = true;
        b.alive = false;
        if (b.authority === 'report') {
          const inv = 1 / (b.speed || 1);
          this.shotsHit++;
          this.net.reportHit(e, seg, b.vx * inv, b.vy * inv);
        }
        this.particles.burst(b.x, b.y, 4, PLAYER_STYLES[b.owner].bullet, 220, 0.18, { size: 2.4, drag: 6 });
        return true;
      });
    }
    this.bullets.pool.compact();

    if (this.state === STATE.GAMEOVER) return;
    for (const p of this.players) {
      if (!p.alive || !p.localMove || p.invuln > 0) continue;
      if (this._touchingEnemy(p)) {
        // What you see is what kills you: the guest judges its own ship
        // against the enemies on its own screen, then tells the host.
        this.net.reportDeath(p);
        p.alive = false;
        this.fxPlayerDeath(p.index, p.x, p.y);
      }
    }
  }

  _touchingEnemy(p) {
    let hit = false;
    this.enemies.hash.query(p.x, p.y, p.radius * 0.72, (e) => {
      if (!e.alive || e.spawning || hit) return;
      hit = true;
      return true;
    });
    return hit;
  }

  // ------------------------------------------------------------ net helpers

  _emit(kind, args) {
    if (this.net && this.net.isHost) this.net.hostEvent(kind, args);
  }

  bulletAuthority() {
    return this.isGuest ? 'report' : 'damage';
  }

  onLocalShot(p, x, y, angle) {
    this.shotsFired += 2;
    if (!this.net) return;
    if (this.net.isHost) this._emit(EV.SHOT, [p.index, x, y, angle]);
    else this.net.reportShot(x, y, angle);
  }

  /**
   * Someone else fired. Their bullets are drawn here but decided there. If
   * this machine flies the ship, the muzzle is taken from where the ship is
   * *here*, so shots never appear to leave from a stale position.
   */
  remoteVolley(idx, x, y, angle) {
    const p = this.players[idx];
    if (!p || !p.alive || this.state === STATE.GAMEOVER) return;
    let nx = x, ny = y;
    if (p.localMove) {
      [nx, ny] = p.nose(angle, p.barrel);
      p.barrel = -p.barrel;
    }
    p.volley(this, nx, ny, angle, 'cosmetic', 0.75);
  }

  // ---------------------------------------------------------------- events

  panOf(x) {
    return clamp(x / this.arena.halfW, -1, 1);
  }

  colorFor(key) {
    if (Array.isArray(key)) return key;
    if (key === 'white') return [1, 1, 1];
    if (key === 'accent0') return PLAYER_STYLES[0].accent;
    if (key === 'accent1') return PLAYER_STYLES[1].accent;
    return this.pal[key] || [1, 1, 1];
  }

  canShoot(p = this.players[0]) {
    if (!this.mode.canShoot) return false;
    if (this.state === STATE.GAMEOVER || this.state === STATE.MENU || this.state === STATE.PAUSED) return false;
    if (!this.online && this.state !== STATE.PLAYING) return false;
    if (this.mode.id === 'king') return !!this.zones.contains(p.x, p.y);
    return true;
  }

  addScore(amount) {
    const gained = Math.round(amount * this.multiplier);
    this.score += gained;
    if (this.score >= this.nextExtraLife) {
      this.extraLifeStep = Math.round(this.extraLifeStep * SCORING.extraLifeGrowth);
      this.nextExtraLife += this.extraLifeStep;
      if (this.mode.lives !== Infinity && this.lives < SCORING.maxLives) {
        this.lives++;
        this.bombs = Math.min(this.bombs + 1, SCORING.maxBombs);
        this.fxExtraLife();
        this._emit(EV.EXTRA_LIFE, []);
        // Online: a fresh ship goes straight to a partner who was knocked out.
        if (this.online) {
          const out = this.players.find((p) => p.out && !p.disconnected);
          if (out && this.state !== STATE.GAMEOVER) {
            this.lives--;
            out.out = false;
            this.respawn(out);
          }
        }
      }
    }
    return gained;
  }

  onKill(enemy, x, y, cause, valueScale = 1, by = -1, seg = 255) {
    // The blast that clears the arena when you die is a mercy, not a payday:
    // it still detonates everything, but it pays nothing.
    const gained = cause === 'death' ? 0 : this.addScore(enemy.score * valueScale);
    if (cause !== 'death') {
      this.kills++;
      if (by >= 0) this.killsBy[by]++;
    }

    const drops = Math.round((GEOM_DROPS[enemy.type] || 1) * valueScale);
    for (let i = 0; i < drops; i++) {
      const a = Math.random() * TAU;
      const sp = 70 + Math.random() * 160;
      this.geoms.spawn(x, y, Math.cos(a) * sp + enemy.vx * 0.2, Math.sin(a) * sp + enemy.vy * 0.2);
    }

    this.fxKill(enemy.type, x, y, enemy.vx, enemy.vy, gained, cause, true);
    this._emit(EV.KILL, [enemy.id, seg, enemy.type, x, y, enemy.vx, enemy.vy, gained, Math.max(0, CAUSES.indexOf(cause)), by]);
  }

  fxKill(type, x, y, vx, vy, gained, cause, effects = true) {
    const st = ENEMY_STATS[TYPE_KEYS[type]];
    const col = this.pal[st.color];
    const big = type === T.BLACKHOLE || type === T.NEST;
    if (effects) {
      const n = big ? 110 : Math.round(16 + st.radius * 1.1);
      const speed = big ? 700 : 240 + st.radius * 9;
      this.particles.burst(x, y, n, col, speed, big ? 1.1 : 0.55, {
        size: big ? 5 : 3.4,
        drag: big ? 1.4 : 2.6,
        hueJitter: big ? 0.18 : 0.08,
        inheritX: vx * 0.2,
        inheritY: vy * 0.2,
      });
      this.grid.explode(x, y, big ? 1500 : 320, big ? 420 : 150);

      if (big) {
        this.camera.addTrauma(0.62);
        if (!this.online) this.hitstop = Math.max(this.hitstop, 0.055);
        this.flash = Math.max(this.flash, this.reducedFlash ? 0.12 : 0.3);
        this.flashColor = col;
        this.audio.explode(2.0, this.panOf(x), 0.7);
        this.input.rumble(0.7, 0.5, 220);
      } else {
        this.camera.addTrauma(cause === 'bomb' ? 0.04 : 0.085);
        if (st.radius > 18) this.audio.explode(0.9, this.panOf(x), 1.1);
        else this.audio.pop(this.panOf(x), 0.9 + Math.random() * 0.3);
      }
    }
    if (gained > 0 && (gained >= 400 || big)) this.popup(x, y, `${commafy(gained)}`, big ? 30 : 20, col);
  }

  onDamaged(e) {
    this.fxDamage(e.type, e.x, e.y);
    this._emit(EV.DAMAGE, [e.id, e.type, e.x, e.y]);
  }

  fxDamage(type, x, y) {
    this.particles.burst(x, y, 5, this.pal[ENEMY_STATS[TYPE_KEYS[type]].color], 260, 0.22, { size: 2.6, drag: 5 });
    this.audio.hit(this.panOf(x));
  }

  onAbsorbed(e) {
    this.fxAbsorb(e.type, e.x, e.y);
    this._emit(EV.ABSORB, [e.type, e.x, e.y]);
  }

  fxAbsorb(type, x, y) {
    this.particles.burst(x, y, 14, this.pal[ENEMY_STATS[TYPE_KEYS[type]].color], 200, 0.5, { size: 3, drag: 1.2 });
    this.audio.pop(this.panOf(x), 0.55);
  }

  onBlackHoleBurst(e) {
    this.fxBlackHoleBurst(e.x, e.y);
    this.spawnRing(e.x, e.y, 260, 'blackholeCore', false, 620);
    this._emit(EV.BH_BURST, [e.x, e.y]);
  }

  fxBlackHoleBurst(x, y) {
    this.camera.addTrauma(0.3);
    this.grid.explode(x, y, 900, 300);
    this.particles.burst(x, y, 60, this.pal.seeker, 520, 0.7, { size: 4, drag: 2, hueJitter: 0.1 });
    this.audio.explode(1.4, this.panOf(x), 1.4);
  }

  onRocketLaunch(e) {
    this.fxRocketLaunch(e.x, e.y, e.rot);
    this._emit(EV.ROCKET, [e.x, e.y, e.rot]);
  }

  fxRocketLaunch(x, y, rot) {
    this.audio.spawn(this.panOf(x), 0.7);
    this.grid.push(x, y, Math.cos(rot) * 8, Math.sin(rot) * 8, 120);
  }

  onNestSpawn(e) {
    this.fxNestSpawn(e.x, e.y);
    this._emit(EV.NEST, [e.x, e.y]);
  }

  fxNestSpawn(x, y) {
    this.audio.spawn(this.panOf(x), 1.6);
    this.particles.burst(x, y, 10, this.pal.nest, 240, 0.35, { size: 3, drag: 4 });
  }

  onBulletWallHit(b) {
    this.particles.burst(b.x, b.y, 4, this.pal.wall, 200, 0.22, {
      size: 2.6, drag: 6, angle: Math.atan2(-b.vy, -b.vx), spread: 1.6,
    });
    const a = this.arena;
    if (b.x <= a.minX) this.wallFlash[0] = 1;
    else if (b.x >= a.maxX) this.wallFlash[1] = 1;
    if (b.y <= a.minY) this.wallFlash[2] = 1;
    else if (b.y >= a.maxY) this.wallFlash[3] = 1;
  }

  wallImpact(p, nx, ny) {
    const speed = Math.hypot(p.vx, p.vy);
    if (speed < 90) return;
    this.particles.burst(p.x, p.y, 6, this.pal.wall, speed * 0.7, 0.28, {
      size: 3, drag: 5, angle: Math.atan2(-ny, -nx), spread: 2.0,
    });
    this.grid.push(p.x, p.y, nx * -3, ny * -3, 120);
    if (nx < 0) this.wallFlash[0] = 1;
    else if (nx > 0) this.wallFlash[1] = 1;
    if (ny < 0) this.wallFlash[2] = 1;
    else if (ny > 0) this.wallFlash[3] = 1;
  }

  onGeomCollected(g, p) {
    this.geomProgress++;
    const need = SCORING.geomsForMultiplier(this.multiplier);
    if (this.isLocalShip(p.index)) save.addStats({ geomsCollected: 1 });
    this.addScore(12);

    let levelled = false;
    if (this.geomProgress >= need && this.multiplier < SCORING.maxMultiplier) {
      this.geomProgress = 0;
      this.multiplier++;
      this.peakMultiplier = Math.max(this.peakMultiplier, this.multiplier);
      levelled = true;
      this.fxMultUp(this.multiplier, p.index);
      this._emit(EV.MULT, [this.multiplier, p.index]);
    }
    this.fxGeomCollect(p.index, levelled ? 0 : this.geomProgress, g.x, g.y);
    this._emit(EV.COLLECT, [g.id, p.index, this.geomProgress, g.x, g.y]);
  }

  /** `progress` 0 means the pickup levelled the multiplier; that has its own sound. */
  fxGeomCollect(idx, progress, x, y) {
    if (progress > 0) this.audio.geom(progress, this.panOf(x));
    this.particles.burst(x, y, 4, this.pal.geom, 140, 0.24, { size: 2.4, drag: 5 });
  }

  /** Guest: a shard reached our ship before the host confirmed it. */
  fxGeomPredicted(g) {
    save.addStats({ geomsCollected: 1 });
    this.fxGeomCollect(0, this.geomProgress + 1, g.x, g.y);
  }

  fxMultUp(mult, idx) {
    const p = this.players[idx] || this.players[0];
    this.audio.multiplierUp(mult);
    this.particles.burst(p.x, p.y, 22, this.pal.geom, 300, 0.5, { size: 3.4, drag: 3 });
    if (mult % 10 === 0 || mult === 5) {
      this.announce(`x${mult}`, 0.9);
      this.camera.addTrauma(0.12);
    }
  }

  fxExtraLife() {
    this.announce('EXTRA LIFE', 1.5);
    this.audio.extraLife();
  }

  onGateDetonate(g, radius, chain) {
    this.gateChainBest = Math.max(this.gateChainBest, chain);
    const bonus = Math.min(chain, 12);
    // A slower front than a bomb: the blast rolls outward and you watch it
    // take the swarm with it, instead of everything vanishing in one frame.
    this.spawnRing(g.x, g.y, radius, 'gate', true, 520, 'bomb');
    this.spawnRing(g.x, g.y, radius * 0.7, 'white', false, 300);
    this.grid.explode(g.x, g.y, 1500, radius * 1.15);
    this.particles.burst(g.x, g.y, 120, this.pal.gate, 380, 1.3, { size: 4.2, drag: 1.1, hueJitter: 0.06 });
    this.particles.burst(g.x, g.y, 40, [0.85, 1, 1], 190, 1.6, { size: 3.2, drag: 0.8 });
    this.camera.addTrauma(0.36);
    this.flash = Math.max(this.flash, this.reducedFlash ? 0.08 : 0.2);
    this.flashColor = this.pal.gate;
    this.audio.gate(this.panOf(g.x), chain);
    const pts = 250 * bonus;
    this.addScore(pts);
    this.popup(g.x, g.y, chain > 1 ? `x${chain} CHAIN` : 'GATE', 24, this.pal.gate);
    this.input.rumble(0.4, 0.3, 140);
  }

  shockwave(x, y, radius, colorKey) {
    this.spawnRing(x, y, radius, colorKey, true, 1200);
  }

  spawnRing(x, y, maxRadius, colorKey, lethal, speed, cause = 'bomb', by = -1) {
    const w = this.waves.spawn();
    w.cause = cause;
    w.by = by;
    w.x = x; w.y = y;
    w.r = 0; w.prev = 0;
    w.max = maxRadius;
    w.speed = speed;
    w.color = this.colorFor(colorKey);
    w.lethal = lethal;
    w.kills = lethal && this.isAuthority;
    w.life = maxRadius / speed + 0.2;
    w.width = lethal ? 6 : 3.5;

    const uv = this.camera.worldToScreenUV(x, y);
    this.shockPos[0] = uv.x;
    this.shockPos[1] = uv.y;
    this.shockDur = clamp(maxRadius / speed * 0.6, 0.5, 1.0);
    this.shockT = this.shockDur;

    if (this.net && this.net.isHost) {
      const idx = RING_COLORS.indexOf(typeof colorKey === 'string' ? colorKey : 'white');
      this._emit(EV.RING, [x, y, Math.round(maxRadius), Math.round(speed), Math.max(0, idx), lethal]);
    }
  }

  popup(x, y, text, size, color) {
    if (this.popups.count > 60) return;

    // Nudge upward past anything already occupying this spot. Two payouts
    // landing on the same pixel render as unreadable overlapping glyphs, and
    // the numbers are the whole point of a score popup.
    const halfW = this.measureWidth(text, size) * 0.5;
    for (let pass = 0; pass < 10; pass++) {
      let clash = false;
      for (let i = 0; i < this.popups.count; i++) {
        const o = this.popups.items[i];
        const gapY = size * 0.95;
        const gapX = halfW + this.measureWidth(o.text, o.size) * 0.5;
        if (Math.abs(o.x - x) < gapX && Math.abs(o.y - y) < gapY) { clash = true; break; }
      }
      if (!clash) break;
      y += size * 1.05;
    }

    const p = this.popups.spawn();
    p.x = x; p.y = y;
    p.vx = (Math.random() - 0.5) * 26;
    p.vy = 105 + Math.random() * 35;
    p.life = p.maxLife = 0.9;
    p.text = text;
    p.size = size;
    p.color = color || this.pal.text;
    return p;
  }

  /** Width of a popup string in world units (matches the stroke font metrics). */
  measureWidth(text, size) {
    return (String(text).length * 5.6 - 1.6) * (size / 6);
  }

  announce(text, duration = 1.4, sub = '') {
    this.announceText = text;
    this.announceSub = sub;
    this.announceTime = duration;
    this.announceMax = duration;
  }

  // ------------------------------------------------------------------ bombs

  useBomb(p = this.localShip()) {
    if (this.bombs <= 0 || !p || !p.alive || this.state === STATE.GAMEOVER) return;
    this.bombs--;
    if (this.isLocalShip(p.index)) save.addStats({ bombsUsed: 1 });
    const seat = this.online && !this.isLocalShip(p.index) ? 1 : 0;
    this.spawnRing(p.x, p.y, Math.hypot(this.arena.width, this.arena.height), 'white', true, 1800, 'bomb', seat);
    this.spawnRing(p.x, p.y, 420, `accent${p.index}`, false, 900);
    this.geoms.vacuum(2.2);
    this.fxBomb(p.index, p.x, p.y);
    this._emit(EV.BOMB, [p.index, p.x, p.y]);
  }

  fxBomb(idx, x, y) {
    const local = this.isLocalShip(idx);
    this.grid.explode(x, y, 4200, 900);
    this.particles.burst(x, y, 220, PLAYER_STYLES[idx].accent, 900, 1.2, { size: 5, drag: 1.6, hueJitter: 0.14 });
    this.camera.addTrauma(local ? 1.0 : 0.7);
    this.flash = this.reducedFlash ? 0.25 : local ? 0.85 : 0.5;
    this.flashColor = [0.95, 0.95, 1];
    if (!this.online) this.hitstop = 0.08;
    this.audio.bomb();
    this.music.duck(0.8);
    if (local) this.input.rumble(1, 0.8, 400);
    this.announce('BOMB', 0.7);
  }

  // ------------------------------------------------------------------ death

  killPlayer(p = this.players[0], opts = {}) {
    if (!p.alive) return;
    if (p.invuln > 0 && !opts.force) return;
    p.alive = false;
    p.deathTimer = this.online ? 2.0 : 1.5;
    if (this.online) {
      if (this.mode.lives === Infinity) p.pendingRespawn = true;
      else if (this.lives > 0) { this.lives--; p.pendingRespawn = true; }
      else p.pendingRespawn = false;
    } else if (this.mode.lives !== Infinity) {
      this.lives--;
    }

    this.spawnRing(p.x, p.y, Math.hypot(this.arena.width, this.arena.height) * 0.7, `accent${p.index}`, true, 1500, 'death');
    this.fxPlayerDeath(p.index, p.x, p.y);
    this._emit(EV.DEATH, [p.index, p.x, p.y]);

    // Reset the run economy — losing a life costs you the multiplier.
    this.multiplier = 1;
    this.geomProgress = 0;
    this.updateDeaths(0);
  }

  fxPlayerDeath(idx, x, y) {
    const style = PLAYER_STYLES[idx];
    const local = this.isLocalShip(idx);
    this.particles.burst(x, y, 260, style.accent, 760, 1.5, { size: 5, drag: 1.1, hueJitter: 0.3 });
    this.particles.burst(x, y, 90, [1, 1, 1], 380, 1.9, { size: 4, drag: 0.9 });
    this.grid.explode(x, y, 3400, 700);
    this.camera.addTrauma(local ? 1.0 : 0.55);
    this.flash = this.reducedFlash ? 0.2 : local ? 0.7 : 0.3;
    this.flashColor = [1, 0.85, 0.85];
    if (!this.online) {
      this.hitstop = 0.12;
      this.slowmo = 1.1;
    }
    this.audio.playerDeath();
    if (local) {
      this.music.duck(1.6);
      this.input.rumble(1, 1, 500);
    }
  }

  respawn(p = this.players[0]) {
    // Respawn at the safest point we can find.
    const spot = this.findSafeSpot();
    p.reset(spot.x, spot.y);
    p.gen = (p.gen + 1) & 0xff;
    p.invuln = PLAYER.spawnInvuln;
    p.pendingRespawn = false;
    p.deathTimer = 0;
    this.geoms.vacuum(1.0);
    if (!this.online) {
      this.slowmo = 0;
      this.timeScale = 1;
    }
    this.state = STATE.PLAYING;
    this._emit(EV.RESPAWN, [p.index, spot.x, spot.y, p.gen]);
  }

  findSafeSpot() {
    const a = this.arena;
    let best = { x: 0, y: 0 };
    let bestD = -1;
    const cands = [{ x: 0, y: 0 }];
    for (let i = 0; i < 24; i++) {
      cands.push({
        x: a.minX + 120 + Math.random() * (a.width - 240),
        y: a.minY + 120 + Math.random() * (a.height - 240),
      });
    }
    for (const c of cands) {
      let d = 1e9;
      for (let i = 0; i < this.enemies.count; i++) {
        const e = this.enemies.items[i];
        d = Math.min(d, Math.hypot(e.x - c.x, e.y - c.y));
      }
      if (this.mode.id === 'king') {
        const z = this.zones.contains(c.x, c.y);
        if (z) d += 300;
      }
      if (d > bestD) { bestD = d; best = c; }
    }
    return best;
  }

  // ------------------------------------------------------------------- draw

  draw(r) {
    const pal = this.pal;
    const time = this.time;

    // Floor.
    this.grid.draw(r, pal.grid, pal.gridHot, 0.34, 1.7);
    this.drawWalls(r, pal, time);

    if (this.mode.id === 'king') this.zones.draw(r, pal, time, this.player);
    if (this.mode.id === 'pacifism') this.gates.draw(r, pal, time);

    if (this.showTitle) this.drawTitleEmblem(r, pal, time);

    this.geoms.draw(r, pal, time);
    this.particles.draw(r);
    this.enemies.draw(r, pal, time);
    this.bullets.draw(r);
    const tags = this.online && this.players.length > 1;
    for (const p of this.players) p.draw(r, pal, time, tags ? p.name : '');
    this.drawWaves(r);
    this.drawPopups(r);

    if (this.state === STATE.PLAYING || this.state === STATE.DYING) {
      this.drawCrosshair(r, time);
    }
    this.drawAnnouncement(r, pal);
  }

  /**
   * Slowly rotating nested polygons behind the title menu. Purely decorative,
   * but it gives the menu a sense of depth and keeps the bloom alive while
   * nothing is happening.
   */
  drawTitleEmblem(r, pal, time) {
    const base = Math.min(this.arena.halfW, this.arena.halfH) * 0.62;
    const rings = [
      { sides: 4, scale: 1.0, speed: 0.10, col: PLAYER_STYLES[0].accent, w: 3.0, a: 0.5 },
      { sides: 4, scale: 0.72, speed: -0.16, col: pal.geom, w: 2.4, a: 0.42 },
      { sides: 8, scale: 0.46, speed: 0.24, col: pal.wanderer, w: 2.0, a: 0.3 },
      { sides: 3, scale: 0.26, speed: -0.34, col: pal.player, w: 2.6, a: 0.45 },
    ];
    for (const ring of rings) {
      const rot = time * ring.speed;
      const rr = base * ring.scale * (1 + Math.sin(time * 0.6 + ring.scale * 4) * 0.02);
      let px = 0, py = 0;
      for (let i = 0; i <= ring.sides; i++) {
        const a = rot + (i / ring.sides) * TAU;
        const x = Math.cos(a) * rr;
        const y = Math.sin(a) * rr;
        if (i > 0) r.seg(px, py, x, y, ring.w, ring.col, ring.a, 3.6);
        px = x; py = y;
      }
    }
    r.dot(0, 0, 8 + Math.sin(time * 2) * 2, pal.player, 0.8, 3.0);
  }

  drawWalls(r, pal, time) {
    const a = this.arena;
    const base = 0.55;
    const pulse = 0.9 + Math.sin(time * 1.6) * 0.1;
    const sides = [
      [a.minX, a.minY, a.minX, a.maxY, 0],
      [a.maxX, a.minY, a.maxX, a.maxY, 1],
      [a.minX, a.minY, a.maxX, a.minY, 2],
      [a.minX, a.maxY, a.maxX, a.maxY, 3],
    ];
    for (const [x0, y0, x1, y1, idx] of sides) {
      const f = this.wallFlash[idx];
      // Flash toward a hot cyan rather than white: a fully white wall reads as
      // a UI error, not as an impact.
      const col = f > 0 ? [lerp(pal.wall[0], 0.65, f), lerp(pal.wall[1], 0.9, f), lerp(pal.wall[2], 1, f)] : pal.wall;
      r.seg(x0, y0, x1, y1, 3.4, col, (base + f * 0.42) * pulse, 4.2);
    }
    // Corner brackets add a bit of arcade framing.
    const L = 46;
    const corners = [
      [a.minX, a.minY, 1, 1], [a.maxX, a.minY, -1, 1],
      [a.minX, a.maxY, 1, -1], [a.maxX, a.maxY, -1, -1],
    ];
    for (const [cx, cy, sx, sy] of corners) {
      r.seg(cx, cy, cx + L * sx, cy, 5.0, pal.wall, 0.9 * pulse, 3.6);
      r.seg(cx, cy, cx, cy + L * sy, 5.0, pal.wall, 0.9 * pulse, 3.6);
    }
  }

  drawWaves(r) {
    const items = this.waves.items;
    for (let i = 0; i < this.waves.count; i++) {
      const w = items[i];
      const t = clamp01(w.r / w.max);
      const fade = (1 - t) * (1 - t);
      const segs = Math.max(24, Math.min(96, Math.round(w.r / 9)));
      r.circle(w.x, w.y, w.r, w.width * (0.4 + fade), w.color, fade * 2.2, segs, 3.8);
      if (w.lethal) r.circle(w.x, w.y, w.r * 0.94, w.width * 0.5, [1, 1, 1], fade * 1.1, segs, 3.2);
    }
  }

  drawPopups(r) {
    const items = this.popups.items;
    for (let i = 0; i < this.popups.count; i++) {
      const p = items[i];
      const t = p.life / p.maxLife;
      const fade = t > 0.75 ? (1 - t) / 0.25 : t / 0.75;
      const size = p.size * (1 + (1 - t) * 0.25);
      r.text(p.text, p.x, p.y, size, p.color, {
        align: 0, baseline: 0, intensity: fade * 1.05, width: 0.1, glow: 3.4,
      });
    }
  }

  drawCrosshair(r, time) {
    const input = this.input;
    if (input.scheme !== 'mouse' || !input.mouseInside) return;
    const ship = this.localShip();
    if (!ship.localGun) return;
    const w = this.camera.screenToWorld(input.mouseX, input.mouseY);
    const s = 16 + Math.sin(time * 4) * 1.5;
    r.shape(CROSSHAIR, w.x, w.y, time * 0.7, s, 2.0, ship.style.accent, 0.9, 3.4);
  }

  drawAnnouncement(r, pal) {
    if (this.announceTime <= 0) return;
    const t = this.announceTime / this.announceMax;
    const fade = t > 0.82 ? (1 - t) / 0.18 : Math.min(1, t / 0.35);
    const y = this.arena.halfH * 0.42;
    const size = 64 * (1 + (1 - t) * 0.08);
    r.text(this.announceText, 0, y, size, pal.text, {
      align: 0, baseline: 0, intensity: fade * 1.15, width: 0.11, tracking: 1.2, glow: 3.8,
    });
    if (this.announceSub) {
      r.text(this.announceSub.toUpperCase(), 0, y - size * 0.95, 20, pal.text, {
        align: 0, baseline: 0, intensity: fade * 0.9, width: 0.1, tracking: 0.6,
      });
    }
  }
}
