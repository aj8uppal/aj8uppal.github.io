/**
 * The homepage's eight worlds and the belt of smaller builds.
 *
 * Copy here is a shorter telling of what src/data/built.ts and
 * src/data/portfolio.ts already establish; every number is one those records
 * state, with the same caveats. Nothing here is a new claim.
 *
 * This module is imported by both the Astro page and the client scene, so it
 * stays plain data: no Node APIs, no asset imports.
 */

export type PlanetKind = 'ocean' | 'swarm' | 'textured' | 'grid' | 'voxel' | 'ball' | 'rift';

export interface PlanetSpec {
  kind: PlanetKind;
  /** Texture key in src/orbit/gl/textures.ts, for the textured kinds. */
  map?: string;
  radius: number;
  /** Orbit around the black hole, in Schwarzschild radii. */
  orbit: number;
  /** Starting angle on that orbit, radians. */
  phase: number;
  /** Inclination of the orbit, radians. */
  incline: number;
  /** Axial tilt and spin rate (rad/s). */
  tilt: number;
  spin: number;
  atmosphere: string;
  glow?: string;
  rings?: boolean;
  clouds?: boolean;
  /** Camera framing for this world's chapter. Azimuth is measured from the
   * outward direction (0 shows the night side, PI the full day side). */
  shot: { az: number; el: number; size: number; swing: number };
}

export interface Fact {
  value: string;
  label: string;
}

export interface World {
  key: string;
  name: string;
  kind: string;
  accent: string;
  headline: string;
  body: string;
  facts: Fact[];
  note?: string;
  stack: string;
  play: { href: string; label: string };
  /** src/assets/<poster>.webp; the first frame of `video` when there is one. */
  poster: string;
  posterAlt: string;
  video?: string;
  planet: PlanetSpec;
}

export const worlds: World[] = [
  {
    key: 'saltline',
    name: 'saltline',
    kind: 'Multiplayer sailing',
    accent: '#7fd6e8',
    headline: 'An ocean you can actually sail.',
    body: 'Age of sail in a browser, with a real sailing model under it. Thrust comes off your point of sail, so steer too close to the wind and you stop. Accounts, persistent cargo, and other captains in the same sea.',
    facts: [
      { value: '20', label: 'players to a sea' },
      { value: 'Wind', label: 'angle sets your thrust' },
      { value: 'Live', label: 'at saltline.app' },
    ],
    stack: 'Babylon.js · Colyseus · WebSocket · Fly.io',
    play: { href: 'https://saltline.app', label: 'Set sail' },
    poster: 'preview-saltline-classic',
    posterAlt: 'A sloop under full sail on saltline’s procedural ocean.',
    video: '/media/previews/saltline-classic.mp4',
    planet: {
      kind: 'ocean',
      map: 'saltline',
      radius: 2.7,
      orbit: 34,
      phase: 0.6,
      incline: 0.04,
      tilt: 0.38,
      spin: 0.05,
      atmosphere: '#62c9ff',
      clouds: true,
      shot: { az: 2.35, el: 0.18, size: 0.62, swing: 0.32 },
    },
  },
  {
    key: 'murmuration',
    name: 'murmuration',
    kind: 'Audio · WebGPU',
    accent: '#c3a1ff',
    headline: 'Music, rendered as a flock of light.',
    body: 'A visualizer that listens to pitch, tempo, transients and stereo movement as separate signals, then hands each one to a WebGPU compute shader that moves and stretches the particles.',
    facts: [
      { value: '620k', label: 'particles in 8.07 ms of GPU time' },
      { value: '1.2M', label: 'particles in 11.85 ms' },
      { value: '5', label: 'render styles' },
    ],
    note: 'A recorded run at 1800 × 3043. Hardware was not recorded.',
    stack: 'WebGPU · compute shaders · audio analysis',
    play: { href: 'https://aj8uppal.github.io/murmuration/', label: 'Open murmuration' },
    poster: 'preview-murmuration',
    posterAlt: 'murmuration: violet and white particle ribbons reacting to music.',
    video: '/media/previews/murmuration.mp4',
    planet: {
      kind: 'swarm',
      radius: 3.0,
      orbit: 50,
      phase: 2.9,
      incline: -0.06,
      tilt: 0.2,
      spin: 0.12,
      atmosphere: '#a77bff',
      shot: { az: 1.9, el: 0.22, size: 0.6, swing: 0.4 },
    },
  },
  {
    key: 'ember',
    name: 'Ember Wilds',
    kind: 'Voxel MMORPG',
    accent: '#ffad5c',
    headline: 'Seven regions. One shared world.',
    body: 'A voxel MMORPG in a browser tab. A separate realm service simulates every player, quest, loot drop and fight, and streams the shared state to a three.js client.',
    facts: [
      { value: '7', label: 'regions, harder further out' },
      { value: '64', label: 'players to a realm' },
      { value: '0', label: 'installs' },
    ],
    stack: 'three.js · Colyseus · WebSocket · Fly.io',
    play: { href: 'https://emberwilds-web.fly.dev', label: 'Enter the realm' },
    poster: 'preview-ember',
    posterAlt: 'Ember Wilds: a voxel character crossing the Hearthvale.',
    video: '/media/previews/ember.mp4',
    planet: {
      kind: 'textured',
      map: 'ember',
      radius: 3.1,
      orbit: 66,
      phase: 5.1,
      incline: 0.05,
      tilt: 0.3,
      spin: 0.045,
      atmosphere: '#ff9a4a',
      glow: '#ff6a1a',
      shot: { az: 2.55, el: 0.12, size: 0.64, swing: 0.3 },
    },
  },
  {
    key: 'voidreach',
    name: 'Voidreach',
    kind: 'Space flight',
    accent: '#8fe3ff',
    headline: 'Sixty-four star systems, generated.',
    body: 'Fly a procedural galaxy in the browser. Ships, stations and worlds are built from code rather than a library of models, and the solo edition sits beside a multiplayer service with persistent progression.',
    facts: [
      { value: '64', label: 'generated star systems' },
      { value: 'All', label: 'visible geometry generated' },
      { value: 'Solo', label: 'edition, playable here' },
    ],
    stack: 'Three.js · WebGL 2 · TypeScript · Node ws',
    play: { href: '/voidreach/', label: 'Play solo' },
    poster: 'preview-voidreach',
    posterAlt: 'The Voidreach cockpit on a docking approach.',
    video: '/media/previews/voidreach.mp4',
    planet: {
      kind: 'textured',
      map: 'ice',
      radius: 2.5,
      orbit: 84,
      phase: 1.4,
      incline: -0.08,
      tilt: 0.46,
      spin: 0.06,
      atmosphere: '#7fe9ff',
      glow: '#45f0ff',
      rings: true,
      shot: { az: 0.55, el: 0.3, size: 0.48, swing: 0.36 },
    },
  },
  {
    key: 'hypergrid',
    name: 'Hypergrid',
    kind: 'Arcade shooter · co-op',
    accent: '#7ff0b0',
    headline: 'One flies. One shoots. Same ship.',
    body: 'A neon arena that ripples under every explosion. Play online with a friend, or share a single ship: one of you steers while the other aims. Nothing you do waits on the network.',
    facts: [
      { value: '260', label: 'enemies at 60 fps' },
      { value: '20k', label: 'particles in one instanced batch' },
      { value: '30 Hz', label: 'host snapshots, interpolated' },
    ],
    note: 'Measured on an M3 Max.',
    stack: 'WebGL 2 · Web Audio · Node ws · Fly.io',
    play: { href: '/hypergrid/', label: 'Play with a friend' },
    poster: 'built-hypergrid',
    posterAlt:
      'Hypergrid in online co-op: two ships fire into snakes and diamond swarms on a glowing blue grid.',
    planet: {
      kind: 'grid',
      radius: 2.7,
      orbit: 100,
      phase: 3.8,
      incline: 0.07,
      tilt: 0.1,
      spin: 0.09,
      atmosphere: '#4d8dff',
      shot: { az: 2.1, el: 0.2, size: 0.6, swing: 0.45 },
    },
  },
  {
    key: 'rift-clash',
    name: 'Rift Clash',
    kind: 'Platform fighter',
    accent: '#d59bff',
    headline: 'Frame-exact fights between two browsers.',
    body: 'Launch them, juggle them, then cash the damage in. Online play uses rollback: each browser predicts the other’s input and replays the last few frames when it guessed wrong, instead of making anyone wait.',
    facts: [
      { value: '9', label: 'frames of rollback' },
      { value: '230 ms', label: 'ping at full speed, 8% loss' },
      { value: '60', label: 'automated tests' },
    ],
    note: 'Ping and loss from simulated links.',
    stack: 'Canvas 2D · WebRTC · rollback netcode · Fly.io',
    play: { href: '/rift-clash/', label: 'Challenge a friend' },
    poster: 'built-rift-clash',
    posterAlt: 'Rift Clash mid-combo: Kael launches Tusk above a floating stage.',
    planet: {
      kind: 'rift',
      map: 'rift',
      radius: 2.8,
      orbit: 116,
      phase: 0.2,
      incline: -0.05,
      tilt: 0.25,
      spin: 0.04,
      atmosphere: '#c86bff',
      glow: '#ff3df2',
      shot: { az: 0.9, el: 0.16, size: 0.56, swing: 0.3 },
    },
  },
  {
    key: 'blockhold',
    name: 'Blockhold',
    kind: 'Voxel tower defense',
    accent: '#9be36b',
    headline: 'Every tower, a stack of boxes.',
    body: 'Voxel tower defense with ten maps and 249 authored waves. Models are coloured boxes, sounds are synthesized in Web Audio, icons are SVG, and a fixed 60 Hz simulation runs independently of the renderer.',
    facts: [
      { value: '249', label: 'authored waves' },
      { value: '10', label: 'maps, three heroes' },
      { value: '60 Hz', label: 'fixed-step simulation' },
    ],
    stack: 'JavaScript · Web Audio · SVG · fixed-step simulation',
    play: { href: 'https://aj8uppal.github.io/blockhold/', label: 'Defend the road' },
    poster: 'preview-blockhold',
    posterAlt: 'Blockhold: voxel towers defending a road against an incoming wave.',
    video: '/media/previews/blockhold.mp4',
    planet: {
      kind: 'voxel',
      radius: 2.6,
      orbit: 132,
      phase: 2.2,
      incline: 0.06,
      tilt: 0.35,
      spin: 0.07,
      atmosphere: '#8fd8ff',
      shot: { az: 2.25, el: 0.32, size: 0.6, swing: 0.38 },
    },
  },
  {
    key: 'boundary',
    name: 'Boundary',
    kind: 'Cricket',
    accent: '#d5e983',
    headline: 'Time it. Find the gap. Run.',
    body: 'Time the stroke, find a gap and call the run before the throw reaches the stumps. Ball, fielders and both runners share one fixed-step world: runs follow completed movement, boundaries follow the actual flight of the ball.',
    facts: [
      { value: '1', label: 'world for ball, fielders and runners' },
      { value: 'Daily', label: 'challenges and a club tour' },
      { value: 'Offline', label: 'solo play, installable' },
    ],
    stack: 'TypeScript · Three.js · fixed-step physics · PWA',
    play: { href: '/boundary/', label: 'Take your innings' },
    poster: 'preview-boundary',
    posterAlt: 'Boundary’s floodlit cricket ground from behind the batter.',
    video: '/media/previews/boundary.mp4',
    planet: {
      kind: 'ball',
      radius: 1.7,
      orbit: 146,
      phase: 4.6,
      incline: -0.04,
      tilt: 0.9,
      spin: 0.35,
      atmosphere: '#ffd9a8',
      shot: { az: 2.0, el: 0.25, size: 0.5, swing: 0.5 },
    },
  },
];

export interface BeltItem {
  key: string;
  image: string;
}

/** The ring of smaller builds. Names, copy and links come from built.ts. */
export const belt: BeltItem[] = [
  { key: 'bring-something-home', image: 'trailer-v4-bring-something-home' },
  { key: 'voidborne', image: 'trailer-v4-voidborne' },
  { key: 'cubit', image: 'trailer-v4-cubit' },
  { key: 'eyeshot', image: 'trailer-v4-eyeshot' },
  { key: 'orbital', image: 'built-orbital' },
  { key: 'slipstream', image: 'built-slipstream' },
  { key: 'beatlayer', image: 'built-beatlayer' },
  { key: 'afterhours', image: 'built-afterhours' },
  { key: 'roomtone', image: 'built-roomtone' },
  { key: 'filefossil', image: 'built-filefossil' },
  { key: 'sixty-seconds', image: 'built-sixty-seconds' },
  { key: 'ai-wrapped', image: 'built-ai-wrapped' },
];

/** Camera stations the page's sections ask for, in page order. */
export type ShotKey =
  'hero' | 'system' | `world:${string}` | 'belt' | 'earth' | 'origin' | 'contact';
