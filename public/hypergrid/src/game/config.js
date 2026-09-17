/**
 * Central tuning. Every magic number that shapes how the game *feels* lives
 * here so it can be balanced in one place.
 */

import { parseColor } from '../core/math.js';

export const ARENA = {
  halfH: 560,          // world half-height; width derives from the viewport aspect
  minAspect: 1.15,
  maxAspect: 2.15,
  wallPad: 26,
};

const C = parseColor;

export const PALETTE = {
  // The hull is pure white: no enemy or pickup is white, so the ship is the
  // one thing on screen that can never be mistaken for anything else. Each
  // pilot's identity lives in an accent (see PLAYER_STYLES), not the hull.
  player: C('#ffffff'),
  playerCore: C('#ffffff'),
  thrust: C('#ff9b3d'),
  bullet: C('#fff3b0'),
  bulletAlt: C('#9df6ff'),
  grid: C('#2f4bd8'),
  gridHot: C('#7ea2ff'),
  wall: C('#3a5cff'),
  geom: C('#4dff9b'),
  text: C('#dff6ff'),
  warn: C('#ff3b5c'),

  grunt: C('#3f7bff'),
  wanderer: C('#ff49c8'),
  weaver: C('#3dffa8'),
  pinwheel: C('#ffab2e'),
  snake: C('#c6ff3d'),
  blackhole: C('#ff2e5a'),
  blackholeCore: C('#8a1bff'),
  rocket: C('#7de1ff'),
  nest: C('#ffe14d'),
  seeker: C('#ff6bd6'),
  gate: C('#64f0ff'),
  king: C('#3aa0ff'),
};

/** High-contrast alternative for players with colour vision deficiency. */
export const PALETTE_CB = {
  ...PALETTE,
  grunt: C('#4d9bff'),
  wanderer: C('#b8a6ff'),   // not white: white is reserved for ships
  weaver: C('#ffd400'),
  pinwheel: C('#ff7a00'),
  snake: C('#00e0ff'),
  blackhole: C('#ff4d4d'),
  seeker: C('#ffb3ff'),
  geom: C('#00ffc8'),
};

/**
 * Per-pilot accents: shield, wings, engine, bullets, name tag and HUD chip.
 * Chosen away from the geom green and from every enemy hue.
 */
export const PLAYER_STYLES = [
  { accent: C('#ffc53d'), thrust: C('#ff9b3d'), bullet: C('#fff1b8'), bulletAlt: C('#ffe08a'), css: '#ffc53d' },
  { accent: C('#a98bff'), thrust: C('#c77dff'), bullet: C('#ebe3ff'), bulletAlt: C('#cdbdff'), css: '#a98bff' },
];

export const PLAYER = {
  radius: 15,
  accel: 5200,
  maxSpeed: 470,
  friction: 7.5,
  fireRate: 0.076,
  bulletSpeed: 1450,
  bulletLife: 1.15,
  bulletRadius: 6,
  spread: 0.055,
  recoil: 34,
  spawnInvuln: 2.4,
  respawnDelay: 1.15,
};

/**
 * Geom magnetism. Shards inside `captureRadius` lock onto the nearest ship and
 * home on it at a speed that includes the ship's own velocity, so they can
 * neither orbit nor be outrun: a shard you fly near is a shard you collect.
 * Further out, a gentle pull gathers the field toward you.
 */
export const GEOM = {
  lifetime: 11,
  attractRadius: 520,
  attractAccel: 620,
  captureRadius: 285,
  pickupRadius: 42,
  homeSpeed: 1000,
  homeSpeedGain: 3400,
  homeSpeedMax: 2800,
  homeResponse: 18,
};

export const SCORING = {
  // The first extra life arrives at 75k; each one after that costs 55% more,
  // so a long run is rewarded without ever becoming unlosable.
  extraLifeBase: 75000,
  extraLifeGrowth: 1.55,
  maxLives: 9,
  maxBombs: 9,
  maxMultiplier: 25,
  // Geoms needed to advance to the next multiplier step. Rising cost keeps the
  // top of the scale a genuine achievement rather than a formality.
  geomsForMultiplier: (m) => Math.min(70, 5 + Math.floor(m * 2.1)),
};

export const ENEMY_STATS = {
  grunt:     { radius: 17, score: 100,  hp: 1, color: 'grunt' },
  wanderer:  { radius: 18, score: 150,  hp: 1, color: 'wanderer' },
  weaver:    { radius: 17, score: 200,  hp: 1, color: 'weaver' },
  pinwheel:  { radius: 21, score: 300,  hp: 1, color: 'pinwheel' },
  snake:     { radius: 15, score: 250,  hp: 1, color: 'snake' },
  blackhole: { radius: 26, score: 1500, hp: 12, color: 'blackhole' },
  rocket:    { radius: 15, score: 200,  hp: 1, color: 'rocket' },
  nest:      { radius: 24, score: 600,  hp: 5, color: 'nest' },
  seeker:    { radius: 12, score: 75,   hp: 1, color: 'seeker' },
};

export const QUALITY = {
  low:    { renderScale: 0.72, bloomMips: 4, gridSpacing: 62, particleScale: 0.45, streak: 0,    maxParticles: 3500 },
  medium: { renderScale: 0.88, bloomMips: 5, gridSpacing: 50, particleScale: 0.75, streak: 0.10, maxParticles: 7000 },
  high:   { renderScale: 1.0,  bloomMips: 6, gridSpacing: 42, particleScale: 1.0,  streak: 0.16, maxParticles: 12000 },
  ultra:  { renderScale: 1.0,  bloomMips: 7, gridSpacing: 34, particleScale: 1.45, streak: 0.22, maxParticles: 20000 },
};

export const MODES = {
  evolved: {
    id: 'evolved',
    name: 'EVOLVED',
    blurb: 'The full arsenal. Survive as long as you can.',
    lives: 3,
    bombs: 3,
    timeLimit: 0,
    canShoot: true,
    order: 0,
  },
  deadline: {
    id: 'deadline',
    name: 'DEADLINE',
    blurb: 'Three minutes. Infinite lives. Maximum carnage.',
    lives: Infinity,
    bombs: 0,
    timeLimit: 180,
    canShoot: true,
    order: 1,
  },
  pacifism: {
    id: 'pacifism',
    name: 'PACIFISM',
    blurb: 'No guns. Fly through the gates to detonate them.',
    lives: 3,
    bombs: 0,
    timeLimit: 0,
    canShoot: false,
    order: 2,
  },
  waves: {
    id: 'waves',
    name: 'WAVES',
    blurb: 'Endless columns of rockets from every side.',
    lives: 3,
    bombs: 3,
    timeLimit: 0,
    canShoot: true,
    order: 3,
  },
  king: {
    id: 'king',
    name: 'KING',
    blurb: 'You are only safe — and only armed — inside the rings.',
    lives: 3,
    bombs: 2,
    timeLimit: 0,
    canShoot: true,
    order: 4,
  },

  // Online modes run the Evolved ruleset. Their `lives` are *spare* ships held
  // in a shared pool, because more than one ship can be in play at once.
  copilot: {
    id: 'copilot',
    name: 'CO-PILOT',
    blurb: 'One ship, two pilots. One of you flies, the other shoots.',
    lives: 2,
    bombs: 3,
    timeLimit: 0,
    canShoot: true,
    order: 10,
    online: true,
    ships: 1,
    enemyScale: 1.1,
  },
  coop: {
    id: 'coop',
    name: 'CO-OP',
    blurb: 'Two ships in the same arena, one shared score and life pool.',
    lives: 4,
    bombs: 4,
    timeLimit: 0,
    canShoot: true,
    order: 11,
    online: true,
    ships: 2,
    enemyScale: 1.45,
  },
};

export const MODE_LIST = Object.values(MODES).sort((a, b) => a.order - b.order);
export const SOLO_MODES = MODE_LIST.filter((m) => !m.online);
export const ONLINE_MODES = MODE_LIST.filter((m) => m.online);
