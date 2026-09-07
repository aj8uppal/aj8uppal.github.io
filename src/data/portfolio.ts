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
    alt: 'Caller verification, routing and reliability at Notable Health.',
    summary: 'Healthcare voice and conversations infrastructure for patient calls.',
    role: 'I work on caller verification, call routing, transfers and monitoring for the voice and conversations platform.',
    constraint:
      'Notable serves 100+ enterprise customers. Our team’s voice and conversations platform handles around 250,000 patient calls a month across EHR, FHIR, carrier and customer call-center boundaries.',
    decision:
      'I wrote the inbound SIP integration specification, covering TLS, SRTP, caller ID, DTMF and DID routing. My work also includes patient lookup, SMS verification and configurable fallback routing.',
    evidence:
      'Inbound SIP currently accounts for $240k in ARR. Expansion opportunities I unlocked could take it above $1M. Caller verification is used across 5+ health systems.',
    href: null,
    stack:
      'Python · TypeScript · Node.js · React · PostgreSQL · BigQuery · SIP · GCP · Kubernetes · Terraform',
    question: 'Connecting health systems and phone networks.',
    frames: [],
    details: [
      [
        'Incident practice',
        'I lead voice incident debriefs and work on recovery measures, including customer-configurable fallback routing',
      ],
      [
        'Flow testing',
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
    summary: 'A multiplayer sailing game with wind-driven physics and persistent cargo.',
    role: 'The sailing model, renderer, multiplayer and account persistence.',
    constraint:
      'Wind angle affects thrust, while the multiplayer service keeps players in the same sea.',
    decision:
      'Point of sail and heading determine thrust and speed toward a mark. The HUD shows relative wind, heel and velocity while you sail.',
    evidence: 'Live at saltline.app with accounts, persistent cargo and up to 20 players per sea.',
    href: 'https://saltline.app',
    stack: 'Babylon.js · Colyseus · WebSocket · Fly.io',
    question: 'Sailing physics and multiplayer.',
    proofFrames: [
      {
        image: 'saltline-proof-panel',
        label: 'The development panel',
        alt: 'The uncropped 16:46 capture, with controls for time of day, sea state, wind angle, crest sharpness and seed.',
        note: 'The uncropped 16:46 capture, with controls for time of day, sea state, wind angle, crest sharpness and seed.',
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
    summary: 'A multiplayer voxel RPG with seven regions, quests and combat.',
    role: 'World design, the browser client and the realm service.',
    constraint:
      'Every player needs the same world state, including quests, loot and combat, while the browser remains a responsive renderer.',
    decision:
      'A separate realm service runs the simulation. Colyseus rooms send shared state over WebSocket to the three.js client.',
    evidence: 'Live without install: seven regions and realms that hold up to 64 players.',
    href: 'https://emberwilds-web.fly.dev',
    stack: 'three.js · Colyseus · WebSocket · Fly.io',
    question: 'Keeping a shared world in sync.',
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
        note: 'The starting region, with a river, goblins and the first quests.',
      },
      {
        image: 'ember-region-fallowmere',
        label: 'Fallowmere',
        alt: 'Fallowmere in Ember Wilds: a dusty orange plain of voxel trees at dusk, embers drifting, a level thirty character in the centre.',
        note: 'Fallowmere at dusk, with direfangs near the player and an active quest log.',
      },
      {
        image: 'ember-region-greenmarch',
        label: 'Greenmarch',
        alt: 'The Greenmarch in Ember Wilds: pale flats under a bleached sky with a white ruin and a chest, lore lines stacked at bottom left.',
        note: 'Greenmarch, with pale terrain, a ruined colonnade and a chest.',
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
        note: 'A nova attack in the Ashen Waste, with a 684 damage marker.',
      },
      {
        image: 'ember-region-greywall-peaks',
        label: 'Greywall Peaks',
        alt: 'The Greywall Peaks in Ember Wilds: pale grey stone terraces under flat light, banners, and a cluster of glowing projectiles mid-flight.',
        note: 'Greywall Peaks after combat, with banners, dropped items and projectiles still visible.',
      },
      {
        image: 'ember-region-black-plateau',
        label: 'Black Plateau',
        alt: 'The Black Plateau in Ember Wilds: a dark red-violet plateau with the region title card centred and a lore line beneath it.',
        note: 'The title card for Black Plateau, the seventh region.',
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
    summary: 'A music visualizer that maps pitch, rhythm and stereo movement to particles.',
    role: 'The audio analysis, WebGPU compute renderer and interaction model.',
    constraint:
      'The particle field responds to several features of a track: pitch, tempo, transients, stereo position and quiet passages.',
    decision:
      'Chroma, spectral flux, per-band attack and center-versus-sides analysis produce separate signals. A compute shader uses them to move and stretch the particles.',
    evidence:
      'Live in a browser. A recorded run at 1800 × 3043 measured 620k particles in 8.07ms of GPU time; 1.2M in 11.85ms. Hardware was not recorded.',
    href: 'https://aj8uppal.github.io/murmuration/',
    stack: 'WebGPU · compute shaders · Canvas · audio analysis',
    question: 'Audio analysis and particles.',
    proofFrames: [
      {
        image: 'murmuration-proof-interface',
        label: 'The live interface',
        alt: 'The full murmuration window: a sparse violet and white constellation of particles on black, and along the bottom a bar reading Pink Floyd - Shine On You Crazy Dia..., 4:21 of 13:35, a waveform, then PARTICLE, CONSTELLATION, SENS 1.6X, FULL, 106 FPS and the key hints beside them.',
        note: 'The interface shows playback, style, sensitivity, quality and frame rate. B changes the render mode; V changes the style.',
        proof: true,
      },
    ],
    frames: [
      {
        image: 'murmuration-frame-ribbon',
        label: 'Ribbon',
        alt: 'murmuration, ribbon style.',
        note: 'Ribbon style stretches the particles into trails.',
      },
      {
        image: 'murmuration-frame-constellation',
        label: 'Constellation',
        alt: 'murmuration, constellation style.',
        note: 'Constellation style draws the field as separate points.',
      },
      {
        image: 'murmuration-frame-lull',
        label: 'Quiet passage',
        alt: 'murmuration during a quiet passage.',
        note: 'A quieter passage, with a smaller, sparser particle field.',
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
    summary: 'Voxel tower defense with ten maps, 249 authored waves and three special boards.',
    role: 'The voxel modeler, fixed-step simulation, maps, waves and balance.',
    constraint:
      'A campaign with branching towers, multiple roads, heroes and endless mode must stay small enough to load while remaining deterministic and testable.',
    decision:
      'Models use colored boxes, sounds are synthesized in Web Audio, and icons are drawn as SVG. A fixed 60Hz simulation runs independently of rendering.',
    evidence:
      'Live and installable, with ten maps, 249 authored waves, three heroes and an endless mode.',
    href: 'https://aj8uppal.github.io/blockhold/',
    stack: 'JavaScript · WebAudio · SVG · fixed-step simulation',
    question: 'Models, sound and simulation.',
    frames: [
      {
        image: 'blockhold-frame-greenhollow',
        label: 'Greenhollow',
        alt: 'Greenhollow, the first board, with one road and thirteen tower plots.',
        note: 'Greenhollow, the first board, with one road and thirteen tower plots.',
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
        alt: 'Cinderwake Caldera, with three roads through dark terrain and nearby lava.',
        note: 'Cinderwake Caldera, with three roads through dark terrain and nearby lava.',
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
    role: 'The engine, renderer, input controls and synthesized sound.',
    constraint:
      'The cube has six slide directions and interior tiles that can be hidden from view.',
    decision:
      'Swipes are matched to the projected cube axes. Obscuring tiles turn translucent; Space spreads the layers to show the interior.',
    evidence: 'A single HTML file with local saves, keyboard controls and touch input.',
    href: 'https://aj8uppal.github.io/cubit/',
    stack: 'Vanilla JS · three.js · Web Audio · node:test',
    question: 'Six directions on a flat screen.',
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
    summary: 'An interactive autumn forest scene with a sunlit path.',
    role: 'The offline bake, runtime reprojection and PWA delivery.',
    constraint:
      'The scene uses pre-rendered lighting so the browser can animate it without path tracing each frame.',
    decision:
      'Lighting is baked in Blender Cycles. The browser composites the layers and reprojects their depth to add parallax.',
    evidence: 'A playable prototype; audio is still being tuned before public release.',
    href: null,
    stack: 'Blender Cycles · depth reprojection · AVIF · PWA',
    question: 'Lighting and parallax.',
    frames: [
      {
        image: 'hidamari-depth-0-sky',
        label: 'Sky depth map',
        alt: 'Grayscale depth map for Hidamari’s sky.',
        note: 'Grayscale values describe depth in the sky layer.',
      },
      {
        image: 'hidamari-depth-1-trees',
        label: 'Trees depth map',
        alt: 'Grayscale depth map for Hidamari’s trees.',
        note: 'Depth values let the tree layer shift with the view.',
      },
      {
        image: 'hidamari-depth-2-arch',
        label: 'Arch depth map',
        alt: 'Grayscale depth map for Hidamari’s arch.',
        note: 'The arch is reprojected using this depth map.',
      },
      {
        image: 'hidamari-depth-3-canopy',
        label: 'Canopy depth map',
        alt: 'Grayscale depth map for Hidamari’s canopy.',
        note: 'Depth data for the overhead canopy.',
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
    summary: 'A tower-defense prototype with a separate simulation core and browser renderer.',
    role: 'The simulation core, renderer, HUD and the boundary between them.',
    constraint:
      'The simulation must remain deterministic and testable without knowing about DOM, rendering, clocks or random globals.',
    decision:
      'TypeScript and ESLint restrict imports into the simulation. A separate three.js renderer interpolates snapshots from its fixed 1/30s tick.',
    evidence: 'A playable prototype with tower placement, enemy waves and a basic economy.',
    href: null,
    stack: 'TypeScript · three.js · React · fixed tick',
    question: 'Simulation and rendering.',
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
        alt: 'A stress-test scene with a burst of enemies.',
        note: 'A stress-test scene with a burst of enemies.',
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
    constraint: 'The recording can vary in tempo, so the drum grid needs to follow its timing.',
    decision:
      'Beat detection aligns the grid to the recording. Web Audio synthesizes the drums, and stems can be exported without uploading the audio.',
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
    image: 'portfolio-eyeshot-feature',
    alt: 'A close view of Eyeshot’s Angle practice: a 117° target and coral and dark arms on graph paper.',
    summary: 'Five daily visual tests, including midpoints, angles and circles.',
    role: 'The interaction design, scoring loop and server-rescored leaderboard.',
    constraint:
      'Everyone receives the same daily challenges, with the same scoring rules on the server and in the browser.',
    decision:
      'A daily seed generates the challenges. The server recomputes scores from raw input using the same rules as the browser.',
    evidence: 'Live at eyeshot.app with a new set at midnight.',
    href: 'https://eyeshot.app/',
    stack: 'Fastify · SQLite · Canvas · Fly.io',
    question: 'Daily challenges and shared scoring.',
    frames: [
      {
        image: 'portfolio-eyeshot-feature',
        label: 'A test of your eye',
        alt: 'The live Angle practice prompt and graph, with a 117° target.',
        note: 'A detail from a real practice shot. The pointer controls the coral arm; the complete interface is shown below.',
      },
      {
        image: 'portfolio-eyeshot-practice',
        label: 'The complete practice shot',
        alt: 'Eyeshot’s full practice interface: header, five tests, Angle prompt, graph, timer and Lock in button.',
        note: 'Captured at eyeshot.app on September 5, 2026, using the actual Practice flow. No leaderboard score was submitted.',
      },
    ],
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
      href: app.local ? null : app.href,
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
  'saltline',
  'murmuration',
  'ember',
  'blockhold',
  'cubit',
  'eyeshot',
];
export const secondaryProjectKeys = [
  'beatlayer',
  'boundary',
  'voidreach',
  'ai-wrapped',
  'roomtone',
  'bring-something-home',
  'slipstream',
];
export const collection: (Built & { image: string; caseKey: string })[] = projects
  .filter((p) => p.key !== 'notable')
  .sort((a, b) => {
    const order = [...homeProjectKeys, ...secondaryProjectKeys];
    const rank = (key: string) => (order.includes(key) ? order.indexOf(key) : order.length);
    return rank(a.key) - rank(b.key);
  })
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
        ? 'Playable prototype'
        : (app?.reachLabel ?? (p.status === 'wip' ? 'In progress' : 'Live')),
      href: p.href || '/portfolio/work/' + p.key + '/',
      cta: p.local
        ? 'Inside the build'
        : (app?.cta ?? (p.status === 'wip' ? 'Explore the build' : 'Open project')),
      what: p.summary,
      how: p.decision,
      k: p.stack,
      accent: app?.accent ?? '#b5d8c2',
      alt: p.alt,
      cap: p.frames.find((f) => f.image === p.image)?.note ?? app?.cap ?? p.alt,
      image: p.image || '',
      caseKey: p.key,
      selected: homeProjectKeys.includes(p.key) ? true : undefined,
    };
  });
