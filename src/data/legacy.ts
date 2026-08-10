/**
 * Every URL this site served before the 2026 rebuild, and what happens at it
 * today.
 *
 * `public/` is a URL contract: whatever is in it is served at its literal path,
 * so every one of these still resolves. Resolving and working are different
 * questions, and this file answers the second one from measurement rather than
 * memory. Audited 2026-08-07 by opening all twenty-five over the dev server in
 * headless Chromium and recording, per page: the requests it made off this
 * origin, its console and page errors, whether its canvases held any ink after
 * two seconds, and how much text it rendered.
 *
 * The test is stricter than the Playground's "twelve that still run", and both
 * are true. That line counts a demo as running if it runs on a working network,
 * which is the reader's situation. `runs` here means it needs nothing off this
 * origin at all, which is the only promise a 404 page has any business making
 * to somebody who already followed one dead link.
 *
 * Re-run the audit before editing a state. A page moves from `opens` to
 * `stopped` the day a host it depends on gives up, and nothing here will
 * notice on its own.
 */

export type LegacyState =
  /** Self-contained. Needs nothing off this origin and does what it was for. */
  | 'runs'
  /** Served and still draws, but part of it lived elsewhere and elsewhere left. */
  | 'opens'
  /** Served, and nothing happens. */
  | 'stopped';

export interface LegacyPath {
  /** The URL, exactly as it is served. */
  path: string;
  /** What it was. */
  name: string;
  state: LegacyState;
  /** For anything short of `runs`: what is missing. One clause, no period. */
  why?: string;
}

export const legacy: LegacyPath[] = [
  { path: '/circle.html', name: 'Circle', state: 'runs' },
  { path: '/deviation.html', name: 'deviation.html', state: 'runs' },
  { path: '/eat.html', name: 'Eat or Be Eaten', state: 'runs' },
  { path: '/grinchjump.html', name: 'GrinchJump', state: 'runs' },
  { path: '/survival.html', name: 'Survival', state: 'runs' },
  { path: '/universe/public/index.html', name: 'Universe', state: 'runs' },
  { path: '/demos/AutoTyper/index.html', name: 'AutoTyper', state: 'runs' },
  {
    path: '/volts.html',
    name: 'Volts',
    state: 'runs',
    why: 'the lessons render; one local font file is missing and the browser falls back',
  },
  {
    path: '/alg2hfinal.html',
    name: 'Bounce',
    state: 'opens',
    why: 'its diagrams were hosted on imgur and its scripts on two CDNs',
  },
  {
    path: '/game1.html',
    name: 'Snake',
    state: 'opens',
    why: 'its one sound effect is fetched from mediacollege.com',
  },
  {
    path: '/jump.html',
    name: 'JumpCC',
    state: 'opens',
    why: 'it throws on load and wants Google Fonts',
  },
  {
    path: '/lahyc.html',
    name: 'LAHYC',
    state: 'opens',
    why: 'every image was on websimages.com, which no longer resolves',
  },
  {
    path: '/luke.html',
    name: 'Luke',
    state: 'opens',
    why: 'the writing is all here; the typeface and jQuery are not',
  },
  {
    path: '/mobilejump.html',
    name: 'Jump, for a phone',
    state: 'opens',
    why: 'it wants Google Fonts and jQuery',
  },
  {
    path: '/demos/Carousel/index.html',
    name: 'Carousel',
    state: 'opens',
    why: 'it reads its slides out of a Google Sheet',
  },
  {
    path: '/demos/PrismRunner/index.html',
    name: 'PrismRunner',
    state: 'opens',
    why: 'its audio is on another origin and no browser will autoplay it now',
  },
  {
    path: '/bar.html',
    name: 'CubeRunner',
    state: 'stopped',
    why: 'its keyboard library was on learningthreejs.com, which is gone',
  },
  { path: '/game2.html', name: 'Example', state: 'stopped', why: 'it draws nothing' },
  { path: '/gitgud.html', name: 'gitgud', state: 'stopped', why: 'the file is empty' },
  {
    path: '/ajAccount/index.html',
    name: 'PICKLE account',
    state: 'stopped',
    why: 'it signs in against an ngrok tunnel that closed in 2017',
  },
  {
    path: '/socket-canvas/public/index.html',
    name: 'GraceFace',
    state: 'stopped',
    why: 'the drawing was shared through an ngrok tunnel that closed in 2017',
  },
  {
    path: '/connect4/public/index.html',
    name: 'Connect4',
    state: 'stopped',
    why: 'its opponent lived on an EC2 box that is shut down',
  },
  {
    path: '/dart/public/index.html',
    name: 'Dart',
    state: 'stopped',
    why: 'it draws the board and nothing else; the rest was on the server',
  },
  {
    path: '/slider/public/index.html',
    name: 'Slider',
    state: 'stopped',
    why: 'its state lived on an EC2 box that is shut down',
  },
  {
    path: '/pewpew/public/index.html',
    name: 'PewPew',
    state: 'stopped',
    why: 'its opponent lived on an EC2 box that is shut down',
  },
];

/** What the 404 offers a reader who asked for something with no near match. */
export const buoy = {
  path: '/#playground',
  name: 'the playground',
} as const;
