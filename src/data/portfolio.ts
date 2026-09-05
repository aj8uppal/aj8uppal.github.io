/** The new portfolio's project records. Professional facts remain in content.ts;
 * app cards are derived from built.ts so curation is applied once. */
import { apps, type Built } from './built.ts';
export interface PortfolioFrame {
  image: string;
  label: string;
  alt: string;
  note: string;
  proof?: boolean;
}
export interface Project {
  key: string;
  name: string;
  status: string;
  kind: string;
  image: string | null;
  alt: string;
  summary: string;
  role: string;
  constraint: string;
  decision: string;
  evidence: string;
  href: string | null;
  stack: string;
  question: string;
  frames: PortfolioFrame[];
  proofFrames?: PortfolioFrame[];
  details?: string[][];
  local?: boolean;
}
const core: Project[] = [
  {
    key: 'notable',
    name: 'Notable Health',
    status: 'live',
    kind: 'Healthcare AI',
    image: null,
    alt: 'Notable Health is represented by a systems card rather than a fabricated product screenshot.',
    summary: 'Healthcare voice and conversations infrastructure for patient calls.',
    role: 'I set technical direction for patient identity, routing, observability and reliability on the team that owns the voice and conversations platform.',
    constraint:
      'Notable serves 100+ enterprise customers. Our team’s voice and conversations platform handles around 250,000 patient calls a month across EHR, FHIR, carrier and customer call-center boundaries.',
    decision:
      'Specify the telephony integration down to SIP, TLS, SRTP, caller ID, DTMF and DID routing, then pair it with auditable one-time-code verification and configurable fallback routing.',
    evidence:
      'The integration specification has driven more than $1M in ARR, and caller verification spans 5+ health systems.',
    href: null,
    stack:
      'Python · TypeScript · Node.js · React · PostgreSQL · BigQuery · SIP · GCP · Kubernetes · Terraform',
    question:
      'How do you make a patient conversation dependable across systems you do not control?',
    frames: [],
    details: [
      [
        'Incident practice',
        'I lead voice incident debriefs and turn failure modes into fixes, including customer-configurable fallback routing',
      ],
      [
        'Flow confidence',
        'I lead AI-powered testing for the flow builder; flow success rates are above 90%',
      ],
      [
        'Launch impact',
        'Multilingual conversations, configurable transfers and builder configuration cut new-customer launch time from weeks to days',
      ],
    ],
  },
  {
    key: 'saltline',
    name: 'saltline',
    status: 'live',
    kind: 'Simulation / multiplayer',
    image: 'portfolio-saltline-sunrise',
    alt: 'A sailboat beneath a rising sun, with a warm path of light across the ocean in Saltline.',
    summary: 'Age of sail in a browser, with a real sailing model under it.',
    role: 'The sailing model, renderer, multiplayer and account persistence.',
    constraint:
      'Thrust depends on point of sail: the boat must feel like a boat, while a shared sea keeps each player’s state consistent.',
    decision:
      'Use point-of-sail thrust and heading to derive VMG, then expose relative wind, heel, thrust and VMG in the HUD so the rule can be learned rather than guessed.',
    evidence: 'Live at saltline.app with accounts, persistent cargo and up to 20 players per sea.',
    href: 'https://saltline.app',
    stack: 'Babylon.js · Colyseus · WebSocket · Fly.io',
    question: 'What makes an ocean feel alive?',
    proofFrames: [
      {
        image: 'saltline-proof-panel',
        label: 'The development panel',
        alt: 'This is the 16:46 frame, uncropped. The panel on the left is the simulation’s actual inputs: time of day, sea state, wind angle, crest sharpness, seed. New seed, new ocean, same rules.',
        note: 'This is the 16:46 frame, uncropped. The panel on the left is the simulation’s actual inputs: time of day, sea state, wind angle, crest sharpness, seed. New seed, new ocean, same rules.',
        proof: true,
      },
    ],
    frames: [
      {
        image: 'portfolio-saltline-moonlight',
        label: 'Moonlight on the water',
        alt: 'A sailboat crosses silver moonlight. Its cyan wake trails through dark water.',
        note: 'Captured in the running game by AJ. The HUD is hidden.',
      },
      {
        image: 'portfolio-saltline-sunrise',
        label: 'First light',
        alt: 'A sailboat beneath a rising sun, with a warm path of light across the ocean in Saltline.',
        note: 'Sunrise, from the same world.',
      },
      {
        image: 'portfolio-saltline-morning',
        label: 'Open water',
        alt: 'A sailboat on a clear blue morning, with bright sunlight scattered across the water.',
        note: 'Morning light on the procedural sea.',
      },
    ],
    details: [
      ['Hardening', "CSP script-src 'self' · frame-ancestors 'none' · full Permissions-Policy"],
    ],
  },
  {
    key: 'ember',
    name: 'Ember Wilds',
    status: 'live',
    kind: 'Voxel MMORPG',
    image: 'ember-spread-fallowmere-dusk',
    alt: 'Ember Wilds in Fallowmere at dusk: a level-30 character in a voxel landscape.',
    summary: 'Browser-based voxel MMORPG. Designed, built, and in production.',
    role: 'Designed, built and put the web tier and authoritative realm service into production.',
    constraint:
      'Every player needs the same world state, including quests, loot and combat, while the browser remains a responsive renderer.',
    decision:
      'Keep simulation in a separate realm service and use Colyseus rooms over WebSocket to distribute authoritative state to the three.js client.',
    evidence: 'Live without install: seven regions and realms that hold up to 64 players.',
    href: 'https://emberwilds-web.fly.dev',
    stack: 'three.js · Colyseus · WebSocket · Fly.io',
    question: 'What makes a world the same for everyone in it?',
    proofFrames: [
      {
        image: 'ember-proof-two-players',
        label: 'Two browsers, one realm',
        alt: 'Two browsers connected to the same realm in Ember Wilds.',
        note: 'The same Hearthvale state rendered in two browsers.',
        proof: true,
      },
    ],
    frames: [
      {
        image: 'ember-region-hearthvale',
        label: 'Hearthvale',
        alt: 'The Hearthvale in Ember Wilds: green voxel meadows split by a river, a level one character on the bank, quest panel at top left.',
        note: 'Where everyone starts. A river, a goblin headman, and a field note telling you that you can tilt the camera.',
      },
      {
        image: 'ember-region-fallowmere',
        label: 'Fallowmere',
        alt: 'Fallowmere in Ember Wilds: a dusty orange plain of voxel trees at dusk, embers drifting, a level thirty character in the centre.',
        note: 'Open country under a dust-orange sky. Direfangs push in from the edges and the quest log starts counting them.',
      },
      {
        image: 'ember-region-greenmarch',
        label: 'Greenmarch',
        alt: 'The Greenmarch in Ember Wilds: pale flats under a bleached sky with a white ruin and a chest, lore lines stacked at bottom left.',
        note: 'The lore panel’s own words: a fallen colonnade of Emberhold, garlanded in herb and briar, haunted by something in the Ashen Waste’s livery. It left a blade behind.',
      },
      {
        image: 'ember-region-fenmarch',
        label: 'Fenmarch',
        alt: 'The Fenmarch in Ember Wilds: a dark, near-monochrome marsh at night lit only by the character’s own glow.',
        note: 'The darkest region. The only reliable light source in this frame is the character.',
      },
      {
        image: 'ember-region-ashen-waste',
        label: 'Ashen Waste',
        alt: 'The Ashen Waste in Ember Wilds: a red-lit waste mid-combat, a white nova ring expanding from the character, damage number 684 above a creature.',
        note: 'Nova, mid-detonation. The ring is resolved on the server, and it did 684 damage to the creature it caught.',
      },
      {
        image: 'ember-region-greywall-peaks',
        label: 'Greywall Peaks',
        alt: 'The Greywall Peaks in Ember Wilds: pale grey stone terraces under flat light, banners, and a cluster of glowing projectiles mid-flight.',
        note: 'Bleached stone and banners. Eleven items on the floor is what a fight up here looks like when it goes well.',
      },
      {
        image: 'ember-region-black-plateau',
        label: 'Black Plateau',
        alt: 'The Black Plateau in Ember Wilds: a dark red-violet plateau with the region title card centred and a lore line beneath it.',
        note: 'The last region. The title card puts it plainly: the Watcher is above you now, and there is no more inward.',
      },
    ],
    details: [
      ['Realm', 'Web tier plus separate authoritative realm service'],
      ['Progression', 'Fame, satchel and tiered gear across seven regions'],
      ['World rule', 'Classes unlock through beast lore and study, not a skill tree'],
    ],
  },
  {
    key: 'murmuration',
    name: 'murmuration',
    status: 'live',
    kind: 'Audio / WebGPU',
    image: 'murmuration-lead-ribbon',
    alt: 'murmuration in ribbon style: a dense violet and white form of drawn-out particle streaks against black, filling most of the frame.',
    summary: 'A music visualiser that works out what the music is doing, not just how loud it is.',
    role: 'The audio analysis, WebGPU compute renderer and interaction model.',
    constraint:
      'Frequency alone cannot tell a voice from a piano; the field also needs to respond to key, tempo, transients, stereo placement and quiet.',
    decision:
      'Combine chroma, autocorrelated spectral flux, per-band attack and centre-versus-sides analysis, then drive velocity-stretched particles in a compute shader.',
    evidence:
      'Live in a browser. A recorded run at 1800 × 3043 measured 620k particles in 8.07ms of GPU time; 1.2M in 11.85ms. Hardware was not recorded.',
    href: 'https://aj8uppal.github.io/murmuration/',
    stack: 'WebGPU · compute shaders · Canvas · audio analysis',
    question: 'Can a field of light hear a song breathe?',
    proofFrames: [
      {
        image: 'murmuration-proof-interface',
        label: 'The live interface',
        alt: 'The full murmuration window: a sparse violet and white constellation of particles on black, and along the bottom a bar reading Pink Floyd - Shine On You Crazy Dia..., 4:21 of 13:35, a waveform, then PARTICLE, CONSTELLATION, SENS 1.6X, FULL, 106 FPS and the key hints beside them.',
        note: 'Mode, style, sensitivity, quality and frame rate along the bottom are live controls, not captions. B cycles the render mode, V the style, and the minus and equals keys scale how hard the music drives the field.',
        proof: true,
      },
    ],
    frames: [
      {
        image: 'murmuration-frame-ribbon',
        label: 'Ribbon',
        alt: 'murmuration, ribbon style.',
        note: 'Two styles and a lull, all from one session. Only the style and the music changed.',
      },
      {
        image: 'murmuration-frame-constellation',
        label: 'Constellation',
        alt: 'murmuration, constellation style.',
        note: 'Two styles and a lull, all from one session. Only the style and the music changed.',
      },
      {
        image: 'murmuration-frame-lull',
        label: 'Quiet passage',
        alt: 'murmuration during a quiet passage.',
        note: 'Two styles and a lull, all from one session. Only the style and the music changed.',
      },
    ],
    details: [
      ['Signal', 'Chroma key detection · autocorrelated spectral flux for tempo'],
      ['Separation', 'Centre-versus-sides analysis gives 3.5× separation on the bundled track'],
      ['Styles', 'Nebula · ink · constellation · ribbon · etching'],
    ],
  },
  {
    key: 'blockhold',
    name: 'Blockhold',
    status: 'live',
    kind: 'Voxel tower defense',
    image: 'blockhold-lead-battle',
    alt: 'Blockhold in a live battle: voxel towers defend a road against an incoming wave.',
    summary:
      'Voxel tower defense. Ten maps, 249 authored waves, and three boards that each break a rule the other nine keep.',
    role: 'The voxel modeler, fixed-step sim, ten maps, authored waves and balance.',
    constraint:
      'A campaign with branching towers, multiple roads, heroes and endless mode must stay small enough to load while remaining deterministic and testable.',
    decision:
      'Generate 3D models from colored boxes, synthesize sound in WebAudio, draw icons as SVG, and keep a fixed 60Hz accumulator behind the render loop.',
    evidence:
      'Live and installable: ten maps, 249 authored waves, three heroes, endless mode and 154 tests.',
    href: 'https://aj8uppal.github.io/blockhold/',
    stack: 'JavaScript · WebAudio · SVG · fixed-step simulation',
    question: 'How much game can code describe?',
    frames: [
      {
        image: 'blockhold-frame-greenhollow',
        label: 'Greenhollow',
        alt: 'The first board entire: one road, thirteen plots, and the meadow you learn the trade on.',
        note: 'The first board entire: one road, thirteen plots, and the meadow you learn the trade on.',
      },
      {
        image: 'blockhold-frame-veiltide',
        label: 'Veiltide surge',
        alt: 'Frostmere Pass under a surge: empowered waves, violet sky, both frozen roads engaged.',
        note: 'Frostmere Pass under a surge: empowered waves, violet sky, both frozen roads engaged.',
      },
      {
        image: 'blockhold-frame-cinderwake',
        label: 'Cinderwake',
        alt: 'Cinderwake Caldera: three roads through the glassfire, lava where a plot could have been.',
        note: 'Cinderwake Caldera: three roads through the glassfire, lava where a plot could have been.',
      },
      {
        image: 'blockhold-frame-tidereach',
        label: 'Tidereach',
        alt: 'Tidereach Causeway, the widest board in the game: five roads, and a tide that closes them.',
        note: 'Tidereach Causeway, the widest board in the game: five roads, and a tide that closes them.',
      },
    ],
    details: [
      ['Campaign', 'Four tower families · three tiers · two elite branches · two crowns'],
      [
        'Special boards',
        'Sunderfall has four roads at four heights; Tidereach reroutes when causeways close',
      ],
      ['Review', '154 Vitest tests · six adversarial code rounds · three design rounds'],
    ],
  },
  {
    key: 'cubit',
    name: 'Cubit',
    status: 'live',
    kind: 'Game / interaction',
    image: 'cubit-lead-peek',
    alt: 'Cubit: a 3 by 3 by 3 cube of colored tiles, opened to reveal its layers.',
    summary:
      '2048, cubed: slide and merge inside a 3×3×3 cube, across six directions instead of four.',
    role: 'The complete single-file engine, renderer, input and synthesized sound.',
    constraint:
      'Six directions must feel obvious on a flat phone screen, including the hidden axis and the cost of losing sight of interior tiles.',
    decision:
      'Score swipes against screen-space projections of the lattice axes, make blocked tiles translucent, and reserve Space plus capped gyro tilt for peeking.',
    evidence: 'Live as one self-contained 553 KB HTML file with 62 tests; saves locally.',
    href: 'https://aj8uppal.github.io/cubit/',
    stack: 'Vanilla JS · three.js · Web Audio · node:test',
    question: 'How do you make a third dimension legible?',
    frames: [
      {
        image: 'cubit-inset-board',
        label: 'Layers apart',
        alt: 'Cubit with the layers spread apart.',
        note: 'Space reveals the inside of the board.',
      },
    ],
    details: [
      ['Board', '27 cells · 3×3×3 · six slide directions'],
      ['Input', 'Swipes match the on-screen projection of each lattice axis'],
      ['Peek', 'Space spreads layers; opt-in gyro view is capped at 12°'],
    ],
  },
  {
    key: 'hidamari',
    name: 'hidamari',
    status: 'wip',
    kind: 'Rendering / ambient',
    image: 'hidamari-spread-canopy',
    alt: 'Hidamari: an autumn canopy path rendered as layered depth plates.',
    summary: 'Ambient app. Japanese for a sunny spot, the pool of light you stand in.',
    role: 'The offline bake, runtime reprojection and PWA delivery.',
    constraint:
      'Photoreal light must run on hardware that cannot path-trace a frame in the browser.',
    decision:
      'Bake lighting in Blender Cycles and reproject depth against pre-lit plates; reserve the runtime for compositing and parallax.',
    evidence:
      'Playable prototype reaches 116fps; audio is still being tuned before public release.',
    href: null,
    stack: 'Blender Cycles · depth reprojection · AVIF · PWA',
    question: 'How can a browser hold onto a place that was never there?',
    frames: [
      {
        image: 'hidamari-depth-0-sky',
        label: 'Depth 0',
        alt: 'Hidamari depth layer 0.',
        note: 'Baked plate used by the runtime reprojection.',
      },
      {
        image: 'hidamari-depth-1-trees',
        label: 'Depth 1',
        alt: 'Hidamari depth layer 1.',
        note: 'Baked plate used by the runtime reprojection.',
      },
      {
        image: 'hidamari-depth-2-arch',
        label: 'Depth 2',
        alt: 'Hidamari depth layer 2.',
        note: 'Baked plate used by the runtime reprojection.',
      },
      {
        image: 'hidamari-depth-3-canopy',
        label: 'Depth 3',
        alt: 'Hidamari depth layer 3.',
        note: 'Baked plate used by the runtime reprojection.',
      },
    ],
    details: [
      ['Offline', 'Blender Cycles bakes the light into plates'],
      ['Runtime', 'Depth reprojection adds parallax while the browser composites'],
      ['Delivery', 'PWA · service worker · AVIF with PNG fallback'],
    ],
  },
  {
    key: 'elderwood',
    name: 'Elderwood Vale',
    status: 'wip',
    kind: 'Simulation / tower defense',
    image: 'elderwood-default',
    alt: 'Elderwood Vale greybox tower defense board with towers and a route.',
    summary: 'Browser-native tower defense. Playable greybox, and an architecture argument.',
    role: 'The simulation core, renderer, HUD and the boundary between them.',
    constraint:
      'The simulation must remain deterministic and testable without knowing about DOM, rendering, clocks or random globals.',
    decision:
      'Enforce the boundary with TypeScript configuration and restricted ESLint paths, then interpolate fixed 1/30s snapshots for a separate three.js renderer.',
    evidence: 'Playable greybox: placement, waves and enough economy to lose.',
    href: null,
    stack: 'TypeScript · three.js · React · fixed tick',
    question: 'What can a game prove when its simulation ignores the browser?',
    frames: [
      {
        image: 'elderwood-default',
        label: 'Default',
        alt: 'Greybox geometry, no art pass.',
        note: 'Greybox geometry, no art pass.',
      },
      {
        image: 'elderwood-coverage',
        label: 'Coverage',
        alt: 'Placement overlay, showing tower reach.',
        note: 'Placement overlay, showing tower reach.',
      },
      {
        image: 'elderwood-stress',
        label: 'Stress',
        alt: 'Stress burst; the tick rate holds.',
        note: 'Stress burst; the tick rate holds.',
      },
    ],
    details: [
      ['Tick', 'Fixed 1/30 s simulation with snapshot interpolation'],
      ['Renderer', 'three.js is free of the tick rate; React HUD subscribes at 10 Hz'],
      ['Boundary', 'DOM library removed from tsconfig; restricted paths in ESLint'],
    ],
  },
  {
    key: 'beatlayer',
    name: 'BeatLayer',
    status: 'live',
    kind: 'Audio / instrument',
    image: 'built-beatlayer',
    alt: 'BeatLayer playing a 40-second synthetic guitar take: a blue waveform aligned to a 96 BPM grid above the active drum sequencer.',
    summary: 'Drop in a guitar take and add synthesized drums in its tempo.',
    role: 'Beat detection, browser synthesis and the playable instrument.',
    constraint: 'The grid must follow the player’s take rather than forcing the take to a click.',
    decision:
      'Find beats in the provided audio, synthesize every drum in Web Audio, and export a stem without uploads.',
    evidence: 'Live browser instrument with a straight-rock groove and local audio processing.',
    href: '/beatlayer/',
    stack: 'Vite · React · TypeScript · Web Audio',
    question: 'Can the drums follow the player?',
    frames: [],
    details: [],
  },
  {
    key: 'eyeshot',
    name: 'Eyeshot',
    status: 'live',
    kind: 'Game / daily tests',
    image: 'built-eyeshot',
    alt: 'Eyeshot’s Bisect event: a diagonal line on graph paper, waiting for the player to tap its exact midpoint.',
    summary: 'Five tests of your eye a day, scored against the same raw inputs.',
    role: 'The interaction design, scoring loop and server-rescored leaderboard.',
    constraint:
      'A score should compare people fairly rather than reward the most creative interpretation of a prompt.',
    decision:
      'Give everyone the same five tests and have the server rescore raw input with the same logic used in the browser.',
    evidence: 'Live at eyeshot.app with a new set at midnight.',
    href: 'https://eyeshot.app/',
    stack: 'Fastify · SQLite · Canvas · Fly.io',
    question: 'Can a quick visual test be fair?',
    frames: [],
    details: [],
  },
];
export const projects: Project[] = [
  ...core,
  ...apps
    .filter((app) => !core.some((p) => p.key === app.key))
    .map((app) => ({
      key: app.key,
      name: app.name,
      status: 'live',
      kind: app.kind,
      image: 'built-' + app.key,
      alt: app.alt,
      summary: app.what,
      role: app.story?.role ?? 'Product, interaction and implementation.',
      constraint: app.story?.constraint ?? app.what,
      decision: app.story?.decision ?? app.how,
      evidence: app.story?.evidence ?? app.cap,
      href: app.href,
      stack: app.k,
      question: app.story?.question ?? 'A closer look at ' + app.name + '.',
      frames: app.story?.frames ?? [],
      details: app.story?.details,
      local: app.local,
    })),
];
export function project(key: string): Project {
  const item = projects.find((p) => p.key === key);
  if (!item) throw new Error('Unknown portfolio project: ' + key);
  return item;
}
export const particleMeasurement = {
  line: '620k particles · 8.07ms GPU time at 1800 × 3043',
  note: 'Recorded run; hardware was not recorded.',
};
// Homepage space is deliberate. An app can join the collection without taking
// a lead slot from a project with stronger evidence and photography.
export const homeProjectKeys = [
  'murmuration',
  'saltline',
  'ember',
  'boundary',
  'bring-something-home',
];
export const collection: (Built & { image: string; caseKey: string })[] = projects
  .filter((p) => p.key !== 'notable')
  .map((p) => {
    const app = apps.find((a) => a.key === p.key);
    return {
      key: p.key,
      name: p.name,
      kind: p.kind,
      categories:
        app?.categories ?? (p.key === 'murmuration' ? ['sound', 'systems'] : ['games', 'systems']),
      reach: app?.reach ?? (p.status === 'wip' ? 'read' : 'open'),
      reachLabel: p.local
        ? 'Local demo'
        : (app?.reachLabel ?? (p.status === 'wip' ? 'In progress' : 'Live')),
      href: p.href || '/portfolio/work/' + p.key + '/',
      cta: p.local
        ? 'Play locally'
        : (app?.cta ?? (p.status === 'wip' ? 'Explore the build' : 'Open project')),
      what: p.summary,
      how: p.decision,
      k: p.stack,
      accent: app?.accent ?? '#b5d8c2',
      alt: p.alt,
      cap:
        app?.cap ??
        p.frames.find((f) => f.image === p.image)?.note ??
        'A frame from the running project.',
      image: p.image || '',
      caseKey: p.key,
      selected: ['saltline', 'murmuration', 'ember', 'slipstream', 'eyeshot', 'beatlayer'].includes(
        p.key,
      )
        ? true
        : undefined,
    };
  });
