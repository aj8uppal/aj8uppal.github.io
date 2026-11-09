/**
 * The twelve worlds of /v2/ and the belt of smaller builds.
 *
 * Copy here is checkable: numbers for Eyeshot, Blockhold, Voidreach and Cubit
 * are ones src/data/built.ts and src/data/portfolio.ts already state; numbers
 * for the others come from each game's own source and docs, recorded with
 * their file references in data/v2-captures/<slug>/facts.json at capture time.
 *
 * This module is imported by both the Astro pages and the client scene, so it
 * stays plain data: no Node APIs, no asset imports.
 */

export type PlanetKind = 'ocean' | 'textured' | 'voxel' | 'hexglobe' | 'cube' | 'paper';

export interface PlanetSpec {
  kind: PlanetKind;
  /** Texture key in src/orbit/gl/textures.ts, for the textured kinds. */
  map?: string;
  radius: number;
  /** How far the body reaches past `radius` (rings, a protractor, corners). */
  extent?: number;
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
  /** 1 lava, 3 ice veins (see planet.ts). */
  glowMode?: 0 | 1 | 3;
  /** 4 restoration, 5 seasons, 6 lanterns on water, 7 lanterns on land. */
  style?: 0 | 4 | 5 | 6 | 7;
  styleColor?: string;
  nearest?: boolean;
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
  /** Where and how it plays, as short badges. */
  platforms: string[];
  stack: string;
  play: { href: string; label: string };
  /** src/assets/<poster>.webp: the first decoded frame of `video`. */
  poster: string;
  posterAlt: string;
  video: string;
  planet: PlanetSpec;
}

const GOLD = 2.39996;
const ph = (i: number) => (i * GOLD + 0.6) % (Math.PI * 2);

export const worlds: World[] = [
  {
    key: 'seventide',
    name: 'Seventide',
    kind: 'Island strategy',
    accent: '#f0b54a',
    headline: 'One island. Your next rivalry.',
    body: 'Settle a 3D hex island, trade with rivals and race to ten points. Play bots offline or friends online, in the browser or as an iOS app now in TestFlight. The whole world is generated in code: not one model file ships.',
    facts: [
      { value: '19', label: 'land hexes, 9 harbours' },
      { value: '4', label: 'bot levels, Gentle to Expert' },
      { value: '0', label: '3D model files: the island is code' },
    ],
    platforms: ['Desktop', 'Phone', 'iOS TestFlight', 'Online'],
    stack: 'TypeScript · PlayCanvas · Preact · Capacitor · Fly.io',
    play: { href: 'https://7tide.app/', label: 'Raise the island' },
    poster: 'preview-seventide-island',
    posterAlt:
      'A hexagonal 3D island in a turquoise sea: fields, forests, pastures, clay pits and quarries with numbered tokens, coloured hamlets, towns and roads, wooden docks around the shore.',
    video: '/media/previews/seventide-island.mp4',
    planet: {
      kind: 'textured',
      map: 'seventide',
      radius: 2.9,
      orbit: 30,
      phase: ph(0),
      incline: -0.05,
      tilt: 0.25,
      spin: 0.045,
      atmosphere: '#7fe3d8',
      shot: { az: 2.45, el: 0.24, size: 0.62, swing: 0.34 },
    },
  },
  {
    key: 'emberdeep',
    name: 'Merovia',
    kind: 'Action roguelike',
    accent: '#ff5b3a',
    headline: 'Descend. Burn. Rise again.',
    body: 'Hack and dash down seven depths as one of the Ashbound to slay Vorthak, the Cinder King, then swear harsher vows and push into the endless Abyss below his throne. Three armaments, five Ember Arts, 43 boons, 32 relics, a Nemesis that hunts you from run to run, a Daily Rite and daily bounties.',
    facts: [
      { value: '7', label: 'depths, 5 biomes, then the Abyss' },
      { value: '43', label: 'boons, 8 of them fusions' },
      { value: '3', label: 'armaments, each with its own aspects' },
    ],
    platforms: ['Desktop', 'Phone', 'Gamepad', 'Daily'],
    stack: 'three.js · Vite · JavaScript · Web Audio',
    play: { href: '/merovia/', label: 'Descend' },
    poster: 'preview-emberdeep',
    posterAlt:
      'Top-down: the Ember Knight, sword glowing, squaring up to a skeleton warrior while three more close in across lava-veined flagstones.',
    video: '/media/previews/emberdeep.mp4',
    planet: {
      kind: 'textured',
      map: 'emberdeep',
      radius: 2.8,
      orbit: 40,
      phase: ph(1),
      incline: -0.04,
      tilt: 0.2,
      spin: 0.05,
      atmosphere: '#ff8a4a',
      glow: '#ff5a1e',
      glowMode: 1,
      shot: { az: 1.6, el: 0.14, size: 0.62, swing: 0.3 },
    },
  },
  {
    key: 'saltline',
    name: 'Saltline',
    kind: 'Age of sail',
    accent: '#7fd6e8',
    headline: 'A small ship, a short purse, nine captains to strike off the list.',
    body: 'It is 1682 in an Atlantic island chain split by a treaty line. Trade, fight and board your way west, under wind, sea and a night sky that are all simulated.',
    facts: [
      { value: '12', label: 'islands, 10 ports' },
      { value: '838', label: 'voiced lines' },
      { value: '5,080', label: 'real stars in the 1682 sky' },
    ],
    platforms: ['Desktop', 'Gamepad', 'Single player'],
    stack: 'TypeScript · three.js (WebGL 2) · Vite · Web Audio',
    play: { href: 'https://saltline-opus-ajuppal.fly.dev/', label: 'Set sail' },
    poster: 'preview-saltline',
    posterAlt:
      'Evening at sea: the player’s small Dutch jacht, gun smoke on her deck, and beyond her bow a raider pinnace firing a broadside.',
    video: '/media/previews/saltline.mp4',
    planet: {
      kind: 'ocean',
      map: 'saltline',
      radius: 2.7,
      orbit: 50,
      phase: ph(2),
      incline: 0.04,
      tilt: 0.3,
      spin: 0.05,
      atmosphere: '#7fd0ff',

      shot: { az: 2.35, el: 0.18, size: 0.62, swing: 0.32 },
    },
  },
  {
    key: 'lumen-hollow',
    name: 'Lumen Hollow',
    kind: 'Cozy adventure',
    accent: '#c9a7ff',
    headline: 'Wake a sleepy island and send a lost star home.',
    body: 'You are Wren, a young lantern-keeper. Gather glimmers to wake a grey, moonlit island so a fallen star named Pip can get home; every gift of light sends a wave of colour rolling across the meadow.',
    facts: [
      { value: '7', label: 'Snoozlings to wake' },
      { value: '202k', label: 'blades of grass at top quality' },
      { value: '143', label: 'glimmers to gather' },
    ],
    platforms: ['Desktop', 'Phone', 'Single player'],
    stack: 'TypeScript · three.js · postprocessing · Web Audio · Vite',
    play: { href: '/lumen-hollow/', label: 'Wake the island' },
    poster: 'preview-lumen-hollow',
    posterAlt:
      'Wren with a lantern in a grey, moonlit meadow, just before a heartbloom wakes and colour washes over the grass.',
    video: '/media/previews/lumen-hollow.mp4',
    planet: {
      kind: 'textured',
      map: 'lumen',
      radius: 2.7,
      orbit: 60,
      phase: ph(3),
      incline: 0.05,
      tilt: 0.28,
      spin: 0.04,
      atmosphere: '#b9a2ff',
      style: 4,
      styleColor: '#ffc25e',
      shot: { az: 2.2, el: 0.2, size: 0.62, swing: 0.36 },
    },
  },
  {
    key: 'seventide-globe',
    name: 'Seventide Globe',
    kind: 'Strategy on a sphere',
    accent: '#5fe0d0',
    headline: 'The same rivalry, on a little world you turn in your hands.',
    body: 'Settle a continent of hex tiles wrapped around a planet, then pay for a voyage and race to found a hamlet on one of four far isles. Every landing is a boat crossing the sea while the world turns to watch. Solo and pass-and-play, offline, right here.',
    facts: [
      { value: '162', label: 'tiles: 150 hexagons, 12 pentagons' },
      { value: '4', label: 'far isles, reached by voyage' },
      { value: 'Offline', label: 'once loaded, solo or pass & play' },
    ],
    platforms: ['Desktop', 'Phone', 'Pass & play', 'Offline'],
    stack: 'TypeScript · PlayCanvas · Preact · service worker',
    play: { href: '/seventide/', label: 'Spin the globe' },
    poster: 'preview-seventide',
    posterAlt:
      'A small round world: a continent of hexagonal fields, forests, pastures, clay pits and quarries with numbered tokens, coloured hamlets and roads, ringed wellspring tiles, and turquoise sea with lighthouses and sailboats around its curve.',
    video: '/media/previews/seventide.mp4',
    planet: {
      kind: 'hexglobe',
      radius: 2.6,
      extent: 1.08,
      orbit: 70,
      phase: ph(4),
      incline: 0.06,
      tilt: 0.3,
      spin: 0.05,
      atmosphere: '#6ff0e4',
      shot: { az: 2.3, el: 0.3, size: 0.6, swing: 0.4 },
    },
  },
  {
    key: 'blockhold',
    name: 'Blockhold',
    kind: 'Voxel tower defense',
    accent: '#8fe36b',
    headline: 'Hold the road for 249 waves.',
    body: 'Voxel tower defense with ten maps and 249 authored waves. Build branching towers across multiple roads, call in heroes, and try the endless mode and three special boards.',
    facts: [
      { value: '249', label: 'authored waves' },
      { value: '10', label: 'maps, three heroes' },
      { value: 'Endless', label: 'mode and three special boards' },
    ],
    platforms: ['Desktop', 'Phone', 'Installable'],
    stack: 'JavaScript · Web Audio · SVG · fixed-step simulation',
    play: { href: 'https://aj8uppal.github.io/blockhold/', label: 'Defend the road' },
    poster: 'preview-blockhold',
    posterAlt: 'Blockhold: voxel towers defending a road against an incoming wave.',
    video: '/media/previews/blockhold.mp4',
    planet: {
      kind: 'voxel',
      radius: 2.6,
      extent: 1.25,
      orbit: 80,
      phase: ph(5),
      incline: 0.06,
      tilt: 0.35,
      spin: 0.07,
      atmosphere: '#8fd8ff',
      shot: { az: 2.25, el: 0.32, size: 0.6, swing: 0.38 },
    },
  },
  {
    key: 'lanternwake',
    name: 'Lanternwake',
    kind: 'Sailing RPG',
    accent: '#ffd07a',
    headline: 'Fish, trade and relight a dark coast under sail.',
    body: 'Raise sail out of Little Lantern and work the Sundered Reach: fish, trade, chart the coast and rekindle its sleeping beacons. One deterministic sea drives the water you see and the hull you float on.',
    facts: [
      { value: '7', label: 'islands in the Sundered Reach' },
      { value: '21', label: 'hull volumes in the buoyancy model' },
      { value: '5', label: 'fishing grounds, 6 species' },
    ],
    platforms: ['Desktop', 'Phone', 'Solo'],
    stack: 'TypeScript · three.js · Vite · Web Audio',
    play: { href: '/lanternwake/', label: 'Raise sail' },
    poster: 'preview-lanternwake',
    posterAlt:
      'A small cutter under full white sail crosses calm teal water on a hazy afternoon, a stone lighthouse on a rocky island behind it.',
    video: '/media/previews/lanternwake.mp4',
    planet: {
      kind: 'ocean',
      map: 'lanternwake',
      radius: 2.8,
      orbit: 90,
      phase: ph(6),
      incline: -0.05,
      tilt: 0.22,
      spin: 0.04,
      atmosphere: '#6f9cff',
      clouds: true,
      style: 6,
      styleColor: '#ffc46a',
      shot: { az: 2.0, el: 0.2, size: 0.62, swing: 0.32 },
    },
  },
  {
    key: 'voidreach',
    name: 'Voidreach',
    kind: 'Space flight',
    accent: '#a9c1ff',
    headline: 'Fly, hunt pirates, earn a bigger ship.',
    body: 'Fly a procedural galaxy of 64 star systems from the cockpit: trade at stations, take contracts and fight. The solo edition plays here, beside an online galaxy with persistent progression.',
    facts: [
      { value: '64', label: 'generated star systems' },
      { value: 'All', label: 'visible geometry generated' },
      { value: 'Solo', label: 'edition, playable here' },
    ],
    platforms: ['Desktop', 'Phone', 'Single player'],
    stack: 'Three.js · WebGL 2 · TypeScript · Node ws',
    play: { href: '/voidreach/', label: 'Undock' },
    poster: 'preview-voidreach',
    posterAlt: 'The Voidreach cockpit on a docking approach.',
    video: '/media/previews/voidreach.mp4',
    planet: {
      kind: 'textured',
      map: 'ice',
      radius: 2.5,
      extent: 1.35,
      orbit: 100,
      phase: ph(7),
      incline: -0.08,
      tilt: 0.46,
      spin: 0.06,
      atmosphere: '#7fe9ff',
      glow: '#45f0ff',
      glowMode: 3,
      rings: true,
      shot: { az: 0.55, el: 0.3, size: 0.48, swing: 0.36 },
    },
  },
  {
    key: 'harvest-crown',
    name: 'Harvest Crown',
    kind: 'Realm builder',
    accent: '#d9e27a',
    headline: 'Raise a realm on a living island, season by season.',
    body: 'Found hamlets on hex corners, lay roads along their edges and keep your people fed from spring sowing to the winter council, while rival houses, envoys and raids contest three crowns on an island that repaints itself with every season.',
    facts: [
      { value: '3', label: 'crowns: Steward, Iron, Merchant' },
      { value: '4', label: 'seasons, repainting the land' },
      { value: 'Godot', label: 'original, ported to the browser' },
    ],
    platforms: ['Desktop', 'Solo'],
    stack: 'TypeScript · Babylon.js · Preact · Web Workers',
    play: { href: '/harvest-crown/', label: 'Claim the crown' },
    poster: 'preview-harvest-crown',
    posterAlt:
      'Harvest Crown’s home island at harvest under a passing shower: thatched cottages and a stone church among golden wheat fields with sheaves, sheep and a windmill, a rocky islet and grey sea behind.',
    video: '/media/previews/harvest-crown.mp4',
    planet: {
      kind: 'textured',
      map: 'harvest',
      radius: 2.8,
      orbit: 110,
      phase: ph(8),
      incline: -0.06,
      tilt: 0.4,
      spin: 0.04,
      atmosphere: '#9fd4ff',

      style: 5,
      shot: { az: 2.4, el: 0.26, size: 0.62, swing: 0.34 },
    },
  },
  {
    key: 'cubit',
    name: 'Cubit',
    kind: 'Puzzle',
    accent: '#ff69da',
    headline: '2048, cubed.',
    body: 'Slide and merge inside a 3×3×3 cube, across six directions instead of four. Swipes are matched to the projected cube axes, tiles in the way turn translucent, and Space fans the layers apart to show the inside.',
    facts: [
      { value: '27', label: 'cells in a 3×3×3 cube' },
      { value: '6', label: 'slide directions' },
      { value: '1', label: 'HTML file, saves locally' },
    ],
    platforms: ['Desktop', 'Phone'],
    stack: 'Vanilla JS · three.js · Web Audio',
    play: { href: 'https://aj8uppal.github.io/cubit/', label: 'Slide the cube' },
    poster: 'preview-cubit',
    posterAlt: 'Cubit: a 3 by 3 by 3 cube of coloured, numbered tiles.',
    video: '/media/previews/cubit.mp4',
    planet: {
      kind: 'cube',
      radius: 2.3,
      extent: 1.55,
      orbit: 121,
      phase: ph(9),
      incline: 0.05,
      tilt: 0.4,
      spin: 0.09,
      atmosphere: '#ff9be6',
      shot: { az: 2.1, el: 0.28, size: 0.46, swing: 0.4 },
    },
  },
  {
    key: 'lantern-roads',
    name: 'The Lantern Roads',
    kind: 'Pixel-art action RPG',
    accent: '#ff9d5c',
    headline: 'Relight the road lanterns, one rain-soaked street at a time.',
    body: 'Swear the warden’s oath, take Hollis’s lantern and drive the Hollow’s Husks back with blade and Ember Bolt. It was built as an online co-op world on an authoritative server; here that same server runs inside your browser tab.',
    facts: [
      { value: '5', label: 'road lanterns to relight' },
      { value: '37', label: 'enemies in Chapter 1, three of them bosses' },
      { value: '60 Hz', label: 'server simulation, in a Web Worker' },
    ],
    platforms: ['Desktop', 'Gamepad', 'Solo'],
    stack: 'TypeScript · Phaser 4 · Node · Web Worker',
    play: { href: '/lantern-roads/', label: 'Take the lantern' },
    poster: 'preview-lantern-roads',
    posterAlt:
      'Night rain in Lantern Reach: three grey Husks shamble across the cobbled plaza toward the keeper, beside the lamplit Lantern Inn and an arched canal bridge.',
    video: '/media/previews/lantern-roads.mp4',
    planet: {
      kind: 'textured',
      map: 'lanternRoads',
      nearest: true,
      radius: 2.7,
      orbit: 132,
      phase: ph(10),
      incline: 0.05,
      tilt: 0.32,
      spin: 0.045,
      atmosphere: '#8fc0ff',
      style: 7,
      styleColor: '#ffb35a',
      shot: { az: 1.5, el: 0.2, size: 0.62, swing: 0.34 },
    },
  },
  {
    key: 'eyeshot',
    name: 'Eyeshot',
    kind: 'Daily game',
    accent: '#ff7a66',
    headline: 'How good is your eye, really?',
    body: 'Five quick daily tests of judgement by eye: midpoints, angles, circles and more. Everyone gets the same set, and the server rescores every attempt from the raw input with the same rules as the browser.',
    facts: [
      { value: '5', label: 'tests, new every midnight' },
      { value: 'Same', label: 'set for everyone' },
      { value: 'Server', label: 'rescores from raw input' },
    ],
    platforms: ['Desktop', 'Phone', 'Daily'],
    stack: 'Fastify · SQLite · Canvas · Fly.io',
    play: { href: 'https://eyeshot.app/', label: 'Test your eye' },
    poster: 'preview-eyeshot',
    posterAlt: 'Eyeshot’s Angle challenge on graph paper.',
    video: '/media/previews/eyeshot.mp4',
    planet: {
      kind: 'paper',
      radius: 2.2,
      extent: 1.62,
      orbit: 144,
      phase: ph(11),
      incline: -0.04,
      tilt: 0.2,
      spin: 0.035,
      atmosphere: '#ffd9cc',
      shot: { az: 2.5, el: 0.36, size: 0.56, swing: 0.4 },
    },
  },
];

export interface BeltItem {
  key: string;
  image: string;
}

/** The ring of other builds. Names, copy and links come from portfolio.ts. */
export const belt: BeltItem[] = [
  { key: 'murmuration', image: 'trailer-v4-murmuration' },
  { key: 'hypergrid', image: 'built-hypergrid' },
  { key: 'rift-clash', image: 'built-rift-clash' },
  { key: 'boundary', image: 'trailer-v4-boundary' },
  { key: 'ember', image: 'trailer-v4-ember' },
  { key: 'bring-something-home', image: 'trailer-v4-bring-something-home' },
  { key: 'voidborne', image: 'trailer-v4-voidborne' },
  { key: 'orbital', image: 'built-orbital' },
  { key: 'slipstream', image: 'built-slipstream' },
  { key: 'beatlayer', image: 'built-beatlayer' },
  { key: 'afterhours', image: 'built-afterhours' },
  { key: 'ai-wrapped', image: 'built-ai-wrapped' },
];

/** Camera stations the page's sections ask for, in page order. */
export type ShotKey =
  'hero' | 'system' | `world:${string}` | 'belt' | 'earth' | 'origin' | 'contact';
