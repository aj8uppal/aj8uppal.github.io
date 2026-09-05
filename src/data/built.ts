/** The collection, its filters and the shortlist share this one catalogue. */
export const categories = [
  { key: 'systems', label: 'Systems & simulation' },
  { key: 'sound', label: 'Sound & music' },
  { key: 'games', label: 'Games & worlds' },
  { key: 'tools', label: 'Everyday tools' },
  { key: 'experiments', label: 'Experiments' },
] as const;
export type Category = (typeof categories)[number]['key'];

/** How you can reach it, which is not the same question as whether it works. */
export type Reach =
  | 'open' /* a URL, and it runs */
  | 'install' /* you have to put it somewhere first */
  | 'read'; /* the work is finished; what is published is the write-up */

export interface Built {
  key: string;
  /** Three frames on the homepage; also included in the collection selection. */
  featured?: true;
  /** Additional picks shown when the collection first opens. */
  selected?: true;
  categories: Category[];
  name: string;
  /** One word for the shelf it belongs on. */
  kind: string;
  reach: Reach;
  reachLabel: string;
  href: string;
  cta: string;
  /** The app in one sentence, in its own voice. */
  what: string;
  /** The thing about it worth knowing that the first sentence had no room for. */
  how: string;
  /** Stack, joined with middots by the page. */
  k: string;
  accent: string;
  /** src/assets/built-<key>.webp, written by scripts/capture-built.mjs. */
  alt: string;
  /** What the capture is a picture of. Every one is a real running state. */
  cap: string;
  /** A complete local build which has not been published to a public host. */
  local?: boolean;
  /** Longer project pages reuse these receipts rather than rewriting the card. */
  story?: {
    role: string;
    constraint: string;
    decision?: string;
    evidence: string;
    question: string;
    frames?: { image: string; label: string; alt: string; note: string }[];
    details?: string[][];
  };
}

export const apps: Built[] = [
  {
    key: 'slipstream',
    selected: true,
    categories: ['systems', 'experiments'],
    name: 'Slipstream',
    kind: 'Simulation',
    reach: 'open',
    reachLabel: 'Live',
    href: '/slipstream/',
    cta: 'Draw in the wind',
    what: 'Draw a shape. Watch a wind tunnel find its way around it.',
    how: 'A WebGL2 fluid solver projects velocity through a multigrid pressure solve. Share any drawn shape as a URL. A two-dimensional, pressure-only model.',
    k: 'WebGL 2 · GLSL · Multigrid solver',
    accent: '#84cfbb',
    alt: 'Slipstream’s wind tunnel with smoke streamlines bending around a car-shaped obstacle, velocity controls and live pressure-drag measurements.',
    cap: 'A car preset in smoke view, running in the browser.',
    story: {
      role: 'The fluid solver, drawing tools, visualization and shareable shape format.',
      constraint:
        'A shape should become a useful experiment immediately, while a browser solves the flow around every edge.',
      decision:
        'Run the two-dimensional velocity and pressure fields on the GPU, with a multigrid pressure solve and drawn obstacles represented inside the simulation.',
      evidence:
        'The running browser experiment supports drawing, presets, flow visualization and shapes shared through a URL. Its drag readout models pressure only.',
      question: 'What does the wind do with a shape you just drew?',
      details: [
        [
          'Simulation',
          'WebGL2 shader passes advance velocity and project the field through a pressure solve.',
        ],
        ['Interaction', 'A sketch becomes an obstacle in the same running wind tunnel.'],
        [
          'Model boundary',
          'A two-dimensional, pressure-only experiment; it does not estimate total aerodynamic drag.',
        ],
      ],
    },
  },

  {
    key: 'eyeshot',
    categories: ['systems', 'games'],
    featured: true,
    name: 'Eyeshot',
    kind: 'Game',
    reach: 'open',
    reachLabel: 'Live',
    href: 'https://eyeshot.app/',
    cta: 'Play today’s five',
    what: 'Five daily tests of your eye. Find a midpoint, match an angle, draw a circle.',
    how: 'The server recomputes scores from raw input using the same rules as the browser. Daily seeds give everyone the same challenge.',
    k: 'Fastify · SQLite · Canvas · Fly.io',
    accent: '#85a9e0',
    alt: 'Eyeshot’s Bisect event: a diagonal line on graph paper, waiting for the player to tap its exact midpoint.',
    cap: 'BISECT — find the exact midpoint of a line.',
  },
  {
    key: 'beatlayer',
    categories: ['sound'],
    featured: true,
    name: 'BeatLayer',
    kind: 'Instrument',
    reach: 'open',
    reachLabel: 'Live',
    href: '/beatlayer/',
    cta: 'Open BeatLayer',
    what: 'A drum machine that finds the tempo in your guitar take and plays along.',
    how: 'Beat tracking aligns the grid to your recording. Browser synthesis generates every drum; export a stem without uploading your audio.',
    k: 'Vite · React · TypeScript · Web Audio',
    accent: '#f2994a',
    alt: 'BeatLayer playing a 40-second synthetic guitar take: a blue waveform aligned to a 96 BPM grid above the active drum sequencer.',
    cap: 'A synthetic guitar recording analysed at 96 BPM, playing with a straight-rock groove.',
  },
  {
    key: 'voidreach',
    categories: ['systems', 'games'],
    featured: true,
    name: 'Voidreach',
    kind: 'Game',
    reach: 'open',
    reachLabel: 'Live',
    href: '/voidreach/',
    cta: 'Fly it',
    what: 'Fly through 64 generated star systems, alone or with other pilots.',
    how: 'Procedural geometry builds every visible asset. A single-file solo build sits alongside a multiplayer service with persistent progression.',
    k: 'Three.js · WebGL 2 · TypeScript · Node ws',
    accent: '#7fd8f0',
    alt: 'The Voidreach cockpit: a station and a moon ahead, contact markers with distances, and shield, hull and power gauges along the bottom.',
    cap: 'Docking approach at Helios Anchorage, Sol Ascendant',
    story: {
      role: 'Flight, procedural worlds, browser rendering and the multiplayer service.',
      constraint:
        'A large space game needs places worth visiting without shipping a large library of models and textures.',
      decision:
        'Generate the visible geometry procedurally, with a standalone solo edition and a separate multiplayer service for persistent progression.',
      evidence:
        'The solo edition is playable here in a browser, with 64 generated star systems to explore.',
      question: 'How much of a galaxy can a browser make for itself?',
      details: [
        ['Worldbuilding', 'Procedural geometry produces the visible ships, stations and worlds.'],
        [
          'Delivery',
          'The public link opens the standalone solo edition. Multiplayer belongs to a separate Node WebSocket service.',
        ],
      ],
    },
  },
  {
    key: 'driftfall',
    categories: ['systems', 'games'],
    name: 'Driftfall',
    kind: 'Space RPG',
    reach: 'open',
    reachLabel: 'Local demo',
    local: true,
    href: 'http://127.0.0.1:5301/',
    cta: 'Play locally',
    what: 'Follow a lost signal through a shared frontier. Survive the run, then decide what to bring back.',
    how: 'A Node server owns movement, combat and progression. The browser predicts flight and smooths snapshots; a six-chapter journey gives the persistent universe a direction.',
    k: 'Three.js · JavaScript · Node.js · WebSocket',
    accent: '#99dacb',
    alt: 'Driftfall in Haven Reach: AJ’s ship raises a spherical barrier during a Frontier run, with a blue planet above the asteroid field.',
    cap: 'A real Frontier encounter in the local build. The barrier, enemy attack and flight state are running together.',
    story: {
      role: 'Flight and combat design, browser rendering, the authoritative server and progression.',
      constraint:
        'Spaceflight must feel immediate while the server remains the authority for hits, inventory, rewards and a persistent pilot.',
      decision:
        'Predict flight in the browser and reconcile it with server snapshots. Keep combat and reward decisions on the server, with an explicit extraction choice at each run break.',
      evidence:
        'The local build passed 239 unit tests and its production build. A separate 64-pilot, 15-second local load smoke completed without disconnects; it is not a production capacity measurement.',
      question: 'A frontier you can return to.',
      frames: [
        {
          image: 'portfolio-driftfall-flight',
          label: 'Haven Reach',
          alt: 'AJ’s ship approaches a ring-shaped station beneath a blue planet in Driftfall.',
          note: 'A fresh pilot approaching the station, using the game’s free-cursor controls.',
        },
        {
          image: 'portfolio-driftfall-run',
          label: 'Into the run',
          alt: 'Driftfall’s chase camera follows a ship at 134 metres per second, with an active hostile patrol and pulse shots across the sky.',
          note: 'The first Frontier encounter, reached through the ordinary game controls.',
        },
      ],
      details: [
        [
          'Flight',
          'Browser prediction and snapshot smoothing sit around the server’s authoritative movement.',
        ],
        [
          'Progression',
          'Run rewards stay unbanked until extraction. Banked credits, ship upgrades and records persist.',
        ],
        [
          'Deployment',
          'A complete local Node build. The multiplayer service needs a server host before it can have a public play link.',
        ],
      ],
    },
  },
  {
    key: 'boundary',
    categories: ['systems', 'games'],
    name: 'Boundary',
    kind: 'Cricket game',
    reach: 'open',
    reachLabel: 'Live',
    href: '/boundary/',
    cta: 'Take your innings',
    what: 'Time the stroke, find a gap, and call the run before the throw reaches the stumps.',
    how: 'A fixed-step simulation keeps the ball, fielders and both runners in one world. Runs follow completed movement; boundaries follow the actual flight of the ball.',
    k: 'TypeScript · Three.js · Fixed-step physics · PWA',
    accent: '#d5e983',
    alt: 'Boundary’s floodlit cricket ground, viewed behind the batter during the guided first delivery. The bat, ball and fielders share the same 3D scene.',
    cap: 'The guided first delivery in Boundary 3.1. The ball waits at the timing cue while you learn the stroke.',
    story: {
      role: 'Game design, the simulation, Three.js rendering and the batting and running controls.',
      constraint:
        'A well-timed stroke creates an opportunity. Scoring still has to follow what actually happens on the field.',
      decision:
        'Keep the ball, CPU fielders and both runners in one fixed-step simulation. Award runs when both batters reach their creases, and judge a run-out when the wicket is broken.',
      evidence:
        'The static 3.1 release builds successfully and passes 72 simulation tests. It supports a guided first run, daily challenges, a club tour and offline play.',
      question: 'Place the shot. Earn the run.',
      frames: [
        {
          image: 'portfolio-boundary-running',
          label: 'Earn the run',
          alt: 'Boundary follows a drive across the outfield as both batters run between the wickets.',
          note: 'The guided first single. The camera widens to keep the ball and both runners in view.',
        },
        {
          image: 'portfolio-boundary-phone',
          label: 'The same innings, in your hand',
          alt: 'Boundary’s running view on a 390-pixel phone, with both batters on the pitch and Call another and Turn back controls.',
          note: 'Real gameplay in a phone-sized browser, using the on-screen controls.',
        },
      ],
      details: [
        [
          'Scoring',
          'Completed runs and actual ball trajectories decide the score. Fielders chase the ball and return it to a threatened wicket.',
        ],
        [
          'Interaction',
          'Set placement and intent before each delivery. Keyboard and touch share the same timing cues and actions.',
        ],
        [
          'Delivery',
          'A static browser game with bundled assets and a service worker. Single-player batting and running, with CPU bowling and fielding.',
        ],
      ],
    },
  },
  {
    key: 'bring-something-home',
    categories: ['systems', 'games'],
    name: 'Bring Something Home',
    kind: 'Cooperative RPG',
    reach: 'open',
    reachLabel: 'Local demo',
    local: true,
    href: 'http://127.0.0.1:5303/',
    cta: 'Play locally',
    what: 'Go out together. Read the storm of projectiles. Bring back something that can outlast this life.',
    how: 'The browser predicts movement while one realm decides every hit, reward and death. SQLite transactions preserve the boundary between carried loot and what you bank.',
    k: 'Three.js · TypeScript · WebSocket · SQLite',
    accent: '#cbb7ee',
    alt: 'Bring Something Home during the Thalassa encounter: orange projectiles, timed floor rings and the player’s cyan shots cross a 3D chamber.',
    cap: 'Thalassa, Elder of Tides. A running 1.4 playtest with a prepared level-20 character.',
    story: {
      role: 'Game design, the browser client, the authoritative realm server and persistence.',
      constraint:
        'Dodging must feel immediate while one server decides every hit, reward and death.',
      decision:
        'Predict movement in the browser, reconcile against the realm, and commit inventory and death atomically. Shared expeditions give each player personal loot and a reason to make it home.',
      evidence:
        'The branded 1.4 release passed the game owner’s production build, 94 unit tests and 28 native browser scenarios. The late-game photograph uses a prepared character; the complete build is playable locally.',
      question: 'Fast combat. Lasting consequences.',
      frames: [
        {
          image: 'built-bring-something-home',
          label: 'Read the storm',
          alt: 'Thalassa’s second phase in the Elder Convergence, with actual 3D projectiles and timed floor attacks.',
          note: 'Late-game playtest in version 1.4, using a prepared level-20 character.',
        },
        {
          image: 'portfolio-bring-home-recap',
          label: 'What comes home',
          alt: 'Bring Something Home’s expedition recap, showing a completed Elder Convergence and permanent shards earned.',
          note: 'The same prepared-character playtest after a completed expedition. Permanent shards and carried gold are recorded separately.',
        },
      ],
      details: [
        [
          'Movement',
          'The realm ticks at 20Hz. The browser replays unacknowledged input after reconciling server state; prediction grants neither damage nor loot.',
        ],
        [
          'Projectiles',
          'Fixed-velocity spawn and removal deltas travel between full baselines. The browser renders their paths in 3D.',
        ],
        [
          'Persistence',
          'Atomic profile and death writes keep inventory outcomes consistent. Gear swaps validate ownership, distance and capacity.',
        ],
        [
          'Expeditions',
          'Readable attack patterns, personal loot and a carried-versus-banked progression boundary give cooperative runs their stakes.',
        ],
      ],
    },
  },
  {
    key: 'sixty-seconds',
    categories: ['systems', 'experiments'],
    name: 'Sixty Seconds',
    kind: 'Multiplayer',
    reach: 'open',
    reachLabel: 'Live',
    href: 'https://sixty-seconds.fly.dev/',
    cta: 'Draw with whoever is there',
    what: 'One shared canvas. Sixty seconds together. A replay to keep.',
    how: 'A Python standard-library WebSocket server records the round as events. The browser rebuilds the drawing, replay and share card from one transcript.',
    k: 'Python stdlib · WebSocket · Canvas · Fly.io',
    accent: '#ff7e8c',
    alt: 'The Sixty Seconds canvas mid-round: hills, a sun and two birds drawn in violet and green by two people, with both cursors labelled.',
    cap: 'Two browsers, one round — the capture script joins twice and draws',
    story: {
      role: 'The real-time server, shared drawing surface, replay and share card.',
      constraint:
        'Strangers need to see the same strokes as they arrive, then keep a faithful record after the round ends.',
      decision:
        'Record each round as events. The live drawing, replay and share card all read from that one transcript.',
      evidence:
        'A deployed Python WebSocket service connects the browsers. The capture is produced by joining a round from two independent browser contexts.',
      question: 'What can two strangers make in one minute?',
      details: [
        [
          'One history',
          'The browser reconstructs both the live canvas and the replay from the recorded round events.',
        ],
        ['Small server', 'The WebSocket service uses the Python standard library.'],
      ],
    },
  },
  {
    key: 'tab-graveyard',
    categories: ['tools'],
    name: 'Tab Graveyard',
    kind: 'Extension',
    reach: 'install',
    reachLabel: 'Unpacked',
    href: '/tab-graveyard/',
    cta: 'See your headstone',
    what: 'Close the tabs you never read. Keep a searchable graveyard and a headstone to share.',
    how: 'Writes every tab to storage before closing it. Search, restore and a ten-minute batch undo make the destructive-looking action reversible.',
    k: 'Chrome MV3 · Canvas · two permissions',
    accent: '#c8b98f',
    alt: 'The Tab Graveyard landing page: a headstone card reading “here lie 61, tabs buried this week”, beside a slider and the epitaph it earns.',
    cap: 'The card the extension draws, running on the page — drag the slider',
    story: {
      role: 'The browser extension, recovery flow, searchable archive and share card.',
      constraint:
        'Closing a crowded browser should feel relieving without losing the pages someone meant to keep.',
      decision:
        'Persist each tab before closing it, with searchable restoration and a ten-minute undo for an entire batch.',
      evidence:
        'The landing page runs the real headstone generator. The extension is distributed as an unpacked Chrome MV3 installation.',
      question: 'Can closing a tab feel like keeping something?',
      details: [
        [
          'Order of operations',
          'Storage precedes closing, so the archive exists before the browser changes.',
        ],
        ['Recovery', 'Restore a page from search or undo the entire recent batch.'],
        ['Permissions', 'The extension asks for two browser permissions.'],
      ],
    },
  },
  {
    key: 'run-or-not',
    categories: ['tools'],
    name: 'Run or Not',
    kind: 'Tool',
    reach: 'open',
    reachLabel: 'Live',
    href: '/run-or-not/',
    cta: 'Ask about right now',
    what: 'Should you run outside right now? One verdict, with the conditions that decided it.',
    how: 'Combines weather, air quality, pollen and daylight against adjustable thresholds. When now is a no, it finds a better hour.',
    k: 'Open-Meteo · vanilla JS · PWA',
    accent: '#3ddc84',
    alt: 'Run or Not showing GO in green, with live wind, air-quality and daylight conditions underneath.',
    cap: 'Sydney, live conditions at the moment of capture',
    story: {
      role: 'The conditions pipeline, threshold model, forecast search and offline-capable interface.',
      constraint:
        'A useful answer has to reconcile weather, air quality, pollen and daylight without making someone interpret a dashboard.',
      decision:
        'Evaluate adjustable thresholds into one verdict, expose the conditions behind it, and search ahead for a better hour when now does not work.',
      evidence:
        'The browser app uses live Open-Meteo conditions and lets the reader inspect or adjust the thresholds that change its answer.',
      question: 'Can a forecast help you make one small decision?',
    },
  },
  {
    key: 'sleep-debt-ledger',
    categories: ['tools'],
    name: 'Sleep Debt Ledger',
    kind: 'Tool',
    reach: 'open',
    reachLabel: 'Live',
    href: '/sleep-debt-ledger/',
    cta: 'Open the ledger',
    what: 'Log a night. See your sleep balance and the date it clears.',
    how: 'A rolling fourteen-day ledger distinguishes missing entries from lost sleep. Projections move the window forward instead of accumulating debt forever.',
    k: 'localStorage · no build step · PWA',
    accent: '#f2c14e',
    alt: 'The Sleep Debt Ledger: a balance of minus sixteen hours twenty-eight minutes, a projected date for clearing it, and twelve nightly bars.',
    cap: 'Twelve nights logged, and the date the balance clears',
    story: {
      role: 'The rolling ledger, projection model, logging interaction and local persistence.',
      constraint:
        'Missing a log is different from missing sleep, and old entries should leave the accounting window.',
      decision:
        'Keep a fourteen-day rolling ledger with explicit missing entries, then move that same window forward to calculate the projection.',
      evidence:
        'The captured demo uses twelve prepared nights. Entries stay in local browser storage, with no account or server required.',
      question: 'What changes when a balance remembers to let go?',
      details: [
        ['Missing data', 'An unlogged night is not silently counted as a sleepless night.'],
        ['Projection', 'Older entries expire as the fourteen-day window advances.'],
      ],
    },
  },
  {
    key: 'ai-wrapped',
    categories: ['tools', 'experiments'],
    name: 'AI Wrapped',
    kind: 'Toy',
    reach: 'open',
    reachLabel: 'Live',
    href: '/ai-wrapped/',
    cta: 'Wrap your year',
    what: 'Your year in prompts, turned into a set of shareable cards.',
    how: 'Combines JSON and JSONL chat exports entirely in memory. One dependency-free HTML file; conversation history stays in the tab.',
    k: 'One file · no dependencies · no server',
    accent: '#eb81d5',
    alt: 'An AI Wrapped card: 627,257 in yellow on a violet-to-pink gradient, over the line “words you wrote to an AI”.',
    cap: 'The opening card, on the built-in sample export',
    story: {
      role: 'Export parsing, the statistics pipeline and the shareable card renderer.',
      constraint:
        'Personal chat exports vary in format and contain data that should not need to leave the reader’s device.',
      decision:
        'Read JSON and JSONL exports into memory and render the entire experience in a dependency-free HTML document.',
      evidence:
        'The public demo and its built-in sample work without an account or backend. Uploaded conversation history stays in the tab.',
      question: 'What can a year of questions tell you?',
      frames: [
        {
          image: 'portfolio-ai-wrapped-card',
          label: 'Made to share',
          alt: 'The full AI Wrapped opening share card, showing 627,257 words from the built-in synthetic export.',
          note: 'The actual share card in the running app, using sample data.',
        },
      ],
    },
  },
  {
    key: 'playlist-from-photo',
    categories: ['tools', 'experiments'],
    name: 'Playlist From a Photo',
    kind: 'Toy',
    reach: 'open',
    reachLabel: 'Demo',
    href: '/playlist-from-photo/',
    cta: 'Make a poster',
    what: 'Turn the mood of a photograph into a playlist poster.',
    how: 'The full app validates AI suggestions against Apple’s catalogue. This browser demo uses twelve fixed songs; crop, palette and poster respond to your photo.',
    k: 'Claude Opus vision · iTunes catalogue · Canvas',
    accent: '#c495e0',
    alt: 'A finished Playlist From a Photo poster: AJ’s Saltline sunrise above the title “Long Drive, No Radio” and twelve numbered tracks.',
    cap: 'The actual poster canvas, given AJ’s Saltline sunrise capture. The demo’s twelve songs are a fixed set.',
    story: {
      role: 'The image-to-music flow, catalogue validation, crop tools and poster renderer.',
      constraint:
        'An evocative music suggestion still needs to resolve to a song someone can actually find.',
      decision:
        'Validate the full app’s AI suggestions against Apple’s catalogue. Keep the browser demo immediately usable with twelve fixed songs and a photo-responsive poster.',
      evidence:
        'The hosted demo lets someone crop a photo, extract its palette and make a poster. Its fixed song list is separate from the full AI-backed app.',
      question: 'If a photograph had a soundtrack, what would it be?',
      frames: [
        {
          image: 'portfolio-playlist-interface',
          label: 'From picture to poster',
          alt: 'Playlist From a Photo running in the browser, with the Saltline sunrise poster, save controls and track list.',
          note: 'A second creation becomes the input: Saltline’s sunrise, in the working browser demo.',
        },
      ],
    },
  },
  {
    key: 'lifetrack',
    categories: ['systems', 'tools'],
    name: 'LifeTrack',
    kind: 'Tool',
    reach: 'open',
    reachLabel: 'Live',
    href: '/lifetrack/',
    cta: 'Open LifeTrack',
    what: 'Tasks, habits, workouts and people, in one place that works offline.',
    how: 'IndexedDB holds the data, a service worker keeps it available offline, and reversible mutations let you undo changes across the app.',
    k: 'ES modules · Preact · IndexedDB · PWA',
    accent: '#a19df7',
    alt: 'LifeTrack’s Today view: a sidebar of sections, four counters across the top, and columns of tasks and habits for the day.',
    cap: 'The Today view, on the app’s own sample data',
    story: {
      role: 'The offline data model, planning interface, service worker and undo system.',
      constraint:
        'Tasks, habits and people should remain available without a connection, and everyday mistakes should be easy to reverse.',
      decision:
        'Keep the records in IndexedDB, serve the app offline with a service worker, and make changes reversible across its sections.',
      evidence:
        'The running Today view uses the app’s sample data. The local-first application does not require a cloud account.',
      question: 'Can a personal tool stay useful when the network leaves?',
    },
  },
  {
    key: 'roomtone',
    selected: true,
    name: 'Roomtone',
    kind: 'Instrument',
    reach: 'open',
    reachLabel: 'Live',
    href: '/roomtone/',
    cta: 'Hear a room',
    what: 'Sweep a room into five colours, then hear those colours bloom into a chord.',
    how: 'Persistence-weighted clustering in OKLab keeps fleeting colours from dominating. The palette becomes five distinct notes, played through browser synthesis and generated reverb.',
    k: 'JavaScript · OKLab · Web Audio',
    accent: '#d9b991',
    alt: 'Roomtone’s demo bedroom resolved into five floating colour orbs, the chord name Ember Eleven and five note labels.',
    cap: 'The procedurally drawn demo bedroom, scanned into the chord Ember Eleven.',
    story: {
      role: 'Camera interaction, perceptual colour clustering, note mapping and browser synthesis.',
      constraint:
        'A camera sees changing light and fleeting objects. A room’s palette should settle before it becomes music.',
      decision:
        'Cluster in OKLab and weight colours by persistence, then map the five stable colours to distinct notes with synthesized sound and generated reverb.',
      evidence:
        'The demo uses a procedurally drawn bedroom, so the complete colour-to-chord flow can be explored without granting camera access.',
      question: 'What would this room sound like?',
      details: [
        [
          'Perception',
          'OKLab gives colour distance a perceptual basis rather than comparing raw RGB channels.',
        ],
        [
          'Continuity',
          'Persistence weighting limits the influence of a colour that flashes past the camera.',
        ],
        ['Sound', 'Web Audio synthesizes the notes and reverb in the browser.'],
      ],
    },
    categories: ['sound', 'experiments'],
  },
  {
    key: 'filefossil',
    name: 'Filefossil',
    kind: 'Experiment',
    reach: 'open',
    reachLabel: 'Live',
    href: '/filefossil/',
    cta: 'Excavate a file',
    what: 'Drop in a file and excavate a skeletal creature from its bytes. Mutate one byte and watch it change.',
    how: 'Entropy, repeated bytes and header signatures determine its anatomy. Incremental histograms and a polynomial hash let mutations reshape the specimen without rereading the file.',
    k: 'JavaScript · File API · Canvas',
    accent: '#dbbd7c',
    alt: 'Filefossil’s parchment specimen plate: a long vertebral skeleton, labelled anatomical traits and byte measurements for the synthetic atlas.zip sample.',
    cap: 'The bundled synthetic atlas.zip bytes, analysed into a specimen.',
    story: {
      role: 'Byte analysis, the procedural anatomy system and the mutation interaction.',
      constraint:
        'A small edit to a large file should visibly change its creature without rereading every byte.',
      decision:
        'Track incremental histograms and a polynomial hash. Entropy, repeated bytes and header signatures then shape the specimen’s anatomy.',
      evidence:
        'The captured specimen comes from the bundled synthetic atlas.zip sample. A reader can mutate bytes and see the anatomy respond.',
      question: 'What kind of creature lives inside a file?',
      details: [
        [
          'Structure',
          'Header signatures, repetition and entropy provide different anatomical signals.',
        ],
        [
          'Responsiveness',
          'Incremental statistics keep one-byte mutations from requiring a full rescan.',
        ],
      ],
    },
    categories: ['experiments'],
    selected: true,
  },
  {
    key: 'shipworthy',
    categories: ['tools'],
    name: 'Shipworthy',
    kind: 'Tool',
    reach: 'open',
    reachLabel: 'Live',
    href: '/shipworthy/',
    cta: 'Find your next build',
    what: 'A daily idea bench: find a small app worth making, then turn it into a build brief.',
    how: 'Scheduled AI drops are validated before publication. Date-seeded local remixes keep the bench useful when a generation run is missed.',
    k: 'JavaScript · Claude API · GitHub Actions',
    accent: '#aeb9f0',
    alt: 'Shipworthy’s idea bench with audience and format filters beside a ranked collection of app ideas.',
    cap: 'The live daily drop, ranked by the default build profile.',
    story: {
      role: 'The idea bench, generation job, validation, archive and fallback system.',
      constraint:
        'A daily generative app should still have something useful to show when an API request is missed or produces unusable results.',
      decision:
        'Validate each scheduled drop before publication, archive previous ideas to avoid repeats, and fall back to date-seeded local remixes.',
      evidence:
        'The live single-file app reads its daily drop and can produce local remixes when that drop is unavailable.',
      question: 'Can an idea generator have a quieter day instead of a broken one?',
      details: [
        ['Publication', 'A scheduled GitHub Actions job validates and writes the daily ideas.'],
        [
          'Continuity',
          'The archive informs the next request, while local date-seeded remixes cover a missed run.',
        ],
      ],
    },
  },
];

export const selectedApps = apps.filter((app) => app.featured || app.selected);
export const built = {
  statement: 'Built from curiosity.',
  lead: 'Instruments, useful little tools and places to get lost. Each began with a question I wanted to answer in code.',
  caveat:
    'Every frame is captured in the running app. Camera and microphone experiments include a demo you can try immediately.',
  facts: [
    { k: 'Projects to explore', v: String(apps.length) },
    { k: 'Open in a browser', v: String(apps.filter((app) => app.reach === 'open').length) },
    { k: 'Ways in', v: String(categories.length) },
  ],
} as const;
