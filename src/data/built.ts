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
    key: 'afterhours',
    selected: true,
    categories: ['games', 'sound'],
    name: 'Afterhours',
    kind: 'Party game',
    reach: 'open',
    reachLabel: 'Live',
    href: 'https://afterhours-aj8uppal.fly.dev/',
    cta: 'Host a game',
    what: 'Your friends write the punchlines. The room picks the winner.',
    how: 'One shared screen, three to eight phones, and optional voiced hosts. The server keeps answers anonymous until the reveal and remembers prompts across rematches.',
    k: 'React · TypeScript · Socket.IO · ElevenLabs · Fly.io',
    accent: '#deef65',
    alt: 'Afterhours showing three submitted punchlines, the winning answer and a live scoreboard on the host screen.',
    cap: 'A live room with three browser players and scripted sample answers, after a real vote.',
    story: {
      role: 'The multiplayer game engine, host and phone interfaces, original prompt library, and voice narration.',
      constraint:
        'Everyone must see the same round while answers, authors, votes, and reconnecting seats stay consistent.',
      decision:
        'The server owns timers, phase transitions, scoring, and filtered player views. Phase IDs reject stale actions; room sessions recover seats after a refresh.',
      evidence:
        '900 authored prompts across three packs. Simulated 50 complete games per pack without a prompt repeat, then verified host and phone play over the public service.',
      question: 'A group chat with a scoreboard.',
      details: [
        [
          'Replayability',
          'Each pack has 300 prompts. Room history prevents authored repeats for 50 six-prompt games; player names and a group topic personalize the setups.',
        ],
        [
          'Voice hosts',
          'Alistair, Pierre, and Baz have separate voices and rotating banter. The game host chooses one for the match; narration is optional and credentials stay on the server.',
        ],
        [
          'Hosting',
          'A single Fly machine serves the interface and WebSocket game engine. Rooms live in memory and survive browser reconnects, but end when the server restarts.',
        ],
      ],
    },
  },
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
      constraint: 'The flow needs to update as obstacles are drawn or changed.',
      decision:
        'The GPU updates two-dimensional velocity and pressure fields. Drawn shapes become obstacles in the simulation, which uses a multigrid pressure solve.',
      evidence:
        'The running browser experiment supports drawing, presets, flow visualization and shapes shared through a URL. Its drag readout models pressure only.',
      question: 'Drawing into the simulation.',
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
    key: 'rift-clash',
    categories: ['games', 'systems'],
    name: 'Rift Clash',
    kind: 'Fighting game',
    reach: 'open',
    reachLabel: 'Live',
    href: '/rift-clash/',
    cta: 'Challenge a friend',
    what: 'Launch them, juggle them, then cash the damage in and knock them off the stage.',
    how: 'A platform fighter with Mortal Kombat-style combos. Online play uses rollback: each browser predicts the other’s input and replays the last few frames when a guess was wrong, instead of waiting.',
    k: 'JavaScript · Canvas 2D · WebRTC · Rollback netcode · Node ws · Fly.io',
    accent: '#b9a6ff',
    alt: 'Rift Clash mid-combo: Kael launches Tusk above a floating stage while the hit counter, combo damage and damage scaling read out beside the player cards.',
    cap: 'A local versus match against the game’s CPU, reached through the menus with scripted keyboard input.',
    story: {
      role: 'Game design, the deterministic simulation and combo system, rollback netcode, procedural animation and the lobby service.',
      constraint:
        'Two browsers on different networks must agree on every frame of a fast fighting game without making either player wait.',
      decision:
        'The simulation uses only exactly specified arithmetic and snapshots its whole state every frame, so a wrong input prediction is repaired by replaying up to nine frames. Juggle hits apply a small lift; only an ender turns accumulated damage into knockback.',
      evidence:
        '60 automated tests cover determinism, trades, grabs, counters, frame advantage and desync detection. Two browsers matched every compared frame checksum over a direct connection and over the relay, and simulated links hold full speed up to about 230 ms of ping with 8% packet loss.',
      question: 'Frame-exact fights between two browsers.',
      details: [
        [
          'Combat',
          'Each move’s frame advantage is measured by simulation. No grounded move is minus on hit, nothing is better than +1 on block, and simultaneous hits trade instead of favouring player one.',
        ],
        [
          'Netcode',
          'Players connect directly over WebRTC when their networks allow it and relay through the lobby server when they do not. A hash of the simulation code keeps mismatched builds out of the same room.',
        ],
        [
          'Animation',
          'Attacks are animated from their frame data: a limb winds up during startup and reaches the hitbox on the active frames, so the animation shows exactly where a move hits.',
        ],
      ],
    },
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
    cta: 'Play solo',
    what: 'Fly through 64 generated star systems in a procedural browser galaxy.',
    how: 'Procedural geometry builds every visible asset. A single-file solo build sits alongside a multiplayer service with persistent progression.',
    k: 'Three.js · WebGL 2 · TypeScript · Node ws',
    accent: '#7fd8f0',
    alt: 'The Voidreach cockpit: a station and a moon ahead, contact markers with distances, and shield, hull and power gauges along the bottom.',
    cap: 'Docking approach at Helios Anchorage, Sol Ascendant',
    story: {
      role: 'Flight, procedural worlds, browser rendering and the multiplayer service.',
      constraint:
        'Ships, stations and star systems are generated without a large library of models and textures.',
      decision:
        'Visible geometry is generated procedurally. A standalone solo edition and a separate multiplayer service share this approach.',
      evidence:
        'The solo edition is playable here in a browser, with 64 generated star systems to explore.',
      question: 'Procedural ships and star systems.',
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
    reachLabel: 'Playable prototype',
    local: true,
    href: '/portfolio/work/driftfall/',
    cta: 'Inside the build',
    what: 'A multiplayer space RPG with a six-chapter campaign and persistent pilot progression.',
    how: 'A Node server handles movement, combat and progression. The browser predicts flight and smooths incoming snapshots.',
    k: 'Three.js · JavaScript · Node.js · WebSocket',
    accent: '#99dacb',
    alt: 'Driftfall in Haven Reach: AJ’s ship raises a spherical barrier during a Frontier run, with a blue planet above the asteroid field.',
    cap: 'A Frontier encounter in the local build, with the ship’s barrier active during combat.',
    story: {
      role: 'Flight and combat design, browser rendering, the authoritative server and progression.',
      constraint:
        'The browser needs to respond to flight controls while the server resolves hits, inventory and rewards.',
      decision:
        'The browser predicts flight and reconciles it with server snapshots. Combat and rewards are resolved on the server; extraction banks the rewards from a run.',
      evidence:
        'Playable locally, with flight, combat, extraction and persistent pilot progression. The multiplayer service has not been publicly hosted.',
      question: 'Flight, combat and persistent progress.',
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
        'Scoring depends on where the ball goes and whether both batters reach their creases.',
      decision:
        'The ball, CPU fielders and both runners share a fixed-step simulation. Runs are awarded when both batters reach their creases; run-outs are checked when a wicket is broken.',
      evidence:
        'The public 5.0.1 release includes a guided first run, daily challenges, a club tour, offline solo play and private online matches.',
      question: 'From a shot to a score.',
      frames: [
        {
          image: 'portfolio-boundary-running',
          label: 'Earn the run',
          alt: 'Boundary follows a drive across the outfield as both batters run between the wickets.',
          note: 'The guided first single. The camera widens to keep the ball and both runners in view.',
        },
        {
          image: 'portfolio-boundary-phone',
          label: 'Phone controls',
          alt: 'Boundary’s running view on a 390-pixel phone, with both batters on the pitch and Call another and Turn back controls.',
          note: 'The running view in a phone-sized browser, using the on-screen controls.',
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
    reachLabel: 'Live',
    href: '/bring-something-home/',
    cta: 'Enter the wilds',
    what: 'Cooperative bullet-hell expeditions with shared combat, personal loot and persistent upgrades.',
    how: 'The browser predicts movement while one realm decides every hit, reward and death. SQLite transactions preserve the boundary between carried loot and what you bank.',
    k: 'Three.js · TypeScript · WebSocket · SQLite',
    accent: '#cbb7ee',
    alt: 'Bring Something Home in Cindermeadow: a new Arcanist explores a 3D realm with equipment, loot and progression beside the battlefield.',
    cap: 'The public 1.4.1 realm, driven with keyboard and mouse on a fresh Arcanist account. No prepared gear or progression.',
    story: {
      role: 'Game design, the browser client, the authoritative realm server and persistence.',
      constraint:
        'Dodging must feel immediate while one server decides every hit, reward and death.',
      decision:
        'The browser predicts movement and reconciles it with the realm server. Inventory and death are saved atomically, and each player receives personal loot.',
      evidence:
        'Public version 1.4.1 supports cooperative expeditions. The lead image uses a fresh character; the late-game photographs use a prepared level-20 character.',
      question: 'Shared combat and persistent progress.',
      frames: [
        {
          image: 'built-bring-something-home',
          label: 'The first expedition',
          alt: 'A fresh Arcanist in Cindermeadow, with real projectiles, nearby creatures and the equipment panel.',
          note: 'The public 1.4.1 realm, using ordinary keyboard and mouse inputs on a new account. No prepared gear or progression.',
        },
        {
          image: 'portfolio-bring-home-thalassa',
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
          'Expeditions award personal loot. Carried gold, banked gold and permanent shards are tracked separately.',
        ],
      ],
    },
  },
  {
    key: 'voidborne',
    categories: ['systems', 'games'],
    name: 'Voidborne Online',
    kind: 'Space RPG',
    reach: 'open',
    reachLabel: 'Live alpha',
    href: 'https://voidborne-online.fly.dev/',
    cta: 'Enter the frontier',
    what: 'Space combat across seven connected sectors.',
    how: 'A Node server owns enemies, combat, contracts, rewards and pilot progression while the browser renders flight over WebSocket.',
    k: 'React · TypeScript · Canvas · WebSocket · Node.js',
    accent: '#8eb5df',
    alt: 'A new Voidborne Online pilot at Orion Anchorage, with the ship, tracked contract and flight HUD visible beneath the station.',
    cap: 'A new pilot at Orion Anchorage in the live 2.0 build, with a tracked contract and flight HUD.',
    story: {
      role: 'The browser flight HUD, server-owned combat loop, contracts and persistent pilot progression.',
      constraint:
        'The browser needs responsive flight controls while the server resolves shared enemies, combat, rewards and the pilot record.',
      decision:
        'A Node WebSocket service owns PvE state, missions, purchases and progression. The browser reports movement and renders server snapshots, with sector rooms sharing the active frontier.',
      evidence:
        'The live alpha has seven connected sectors, persistent pilots, contracts, shared PvE encounters and opt-in pilot combat in two lawless sectors.',
      question: 'A persistent frontier in a browser.',
      details: [
        ['World', 'Seven hand-authored sectors connected by server-checked jump lanes.'],
        [
          'Authority',
          'The server owns enemies, projectiles, damage, missions, rewards and pilot progression.',
        ],
        [
          'Multiplayer',
          'Sector rooms share PvE state, chat and nearby pilots; sorties support up to four pilots.',
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
    what: 'Draw on a shared canvas for sixty seconds, then save a replay.',
    how: 'A Python standard-library WebSocket server records the round as events. The browser rebuilds the drawing, replay and share card from one transcript.',
    k: 'Python stdlib · WebSocket · Canvas · Fly.io',
    accent: '#ff7e8c',
    alt: 'The Sixty Seconds canvas mid-round: hills, a sun and two birds drawn in violet and green by two scripted browser sessions, with both cursors labeled.',
    cap: 'Two browsers, one round — the capture script joins twice and draws',
    story: {
      role: 'The real-time server, shared drawing surface, replay and share card.',
      constraint:
        'Strangers need to see the same strokes as they arrive, then keep a faithful record after the round ends.',
      decision:
        'Each round is recorded as events. The live drawing, replay and share card all use that transcript.',
      evidence:
        'A deployed Python WebSocket service connects the browsers. The capture is produced by joining a round from two independent browser contexts.',
      question: 'A round, recorded as events.',
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
    how: 'Saves tabs before closing them. Search the archive, restore an individual tab, or undo a batch within ten minutes.',
    k: 'Chrome MV3 · Canvas · two permissions',
    accent: '#c8b98f',
    alt: 'The Tab Graveyard landing page: a headstone card reading “here lie 61, tabs buried this week”, beside a slider and the epitaph it earns.',
    cap: 'The card the extension draws, running on the page — drag the slider',
    story: {
      role: 'The browser extension, recovery flow, searchable archive and share card.',
      constraint: 'Closed tabs need to remain searchable and recoverable.',
      decision:
        'Each tab is saved before it closes. The archive supports search, individual restoration and a ten-minute undo for a batch.',
      evidence:
        'The landing page runs the real headstone generator. The extension is distributed as an unpacked Chrome MV3 installation.',
      question: 'Saving tabs before closing them.',
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
    how: 'Combines weather, air quality, pollen and daylight against adjustable thresholds. It can also find an upcoming hour that meets those thresholds.',
    k: 'Open-Meteo · vanilla JS · PWA',
    accent: '#3ddc84',
    alt: 'Run or Not showing GO in green, with live wind, air-quality and daylight conditions underneath.',
    cap: 'Sydney, live conditions at the moment of capture',
    story: {
      role: 'The conditions pipeline, threshold model, forecast search and offline-capable interface.',
      constraint: 'Weather, air quality, pollen and daylight all contribute to the recommendation.',
      decision:
        'Adjustable thresholds produce the recommendation. The app shows the contributing conditions and searches the forecast for an hour that meets the settings.',
      evidence:
        'The browser app uses live Open-Meteo conditions and lets the reader inspect or adjust the thresholds that change its answer.',
      question: 'From forecast to recommendation.',
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
    what: 'Log your sleep and see a rolling fourteen-day balance with a projected recovery date.',
    how: 'A rolling fourteen-day ledger distinguishes missing entries from lost sleep. Projections move the window forward instead of accumulating debt forever.',
    k: 'localStorage · no build step · PWA',
    accent: '#f2c14e',
    alt: 'The Sleep Debt Ledger: a balance of minus sixteen hours twenty-eight minutes, a projected date for clearing it, and twelve nightly bars.',
    cap: 'Twelve sample nights and an estimated date for the balance to clear.',
    story: {
      role: 'The rolling ledger, projection model, logging interaction and local persistence.',
      constraint:
        'Missing a log is different from missing sleep, and old entries should leave the accounting window.',
      decision:
        'The ledger uses a fourteen-day window and marks missing entries. Moving that window forward produces an estimated recovery date.',
      evidence:
        'The captured demo uses twelve prepared nights. Entries stay in local browser storage, with no account or server required.',
      question: 'A rolling sleep log.',
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
        'JSON and JSONL exports are parsed in memory. The statistics and cards are rendered in a single HTML document.',
      evidence:
        'The public demo and its built-in sample work without an account or backend. Uploaded conversation history stays in the tab.',
      question: 'Parsing chat exports locally.',
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
      constraint: 'Suggested tracks need to match entries in a music catalog.',
      decision:
        'The full app checks AI suggestions against Apple’s catalog. The browser demo uses twelve fixed songs; its crop, palette and poster respond to the photo.',
      evidence:
        'The hosted demo lets someone crop a photo, extract its palette and make a poster. Its fixed song list is separate from the full AI-backed app.',
      question: 'If a photograph had a soundtrack, what would it be?',
      frames: [
        {
          image: 'portfolio-playlist-interface',
          label: 'From picture to poster',
          alt: 'Playlist From a Photo running in the browser, with the Saltline sunrise poster, save controls and track list.',
          note: 'The demo uses a Saltline sunrise capture to make a playlist poster.',
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
        'IndexedDB stores the records, a service worker serves the app offline, and an undo system reverses changes across its sections.',
      evidence:
        'The running Today view uses the app’s sample data. The local-first application does not require a cloud account.',
      question: 'Offline storage and undo.',
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
    what: 'Scan a room’s colors and turn its palette into a five-note chord.',
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
        'Colors are clustered in OKLab and weighted by persistence. Five stable colors map to distinct notes, played with synthesized sound and generated reverb.',
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
        'Incremental histograms and a polynomial hash track changes to the file. Entropy, repeated bytes and header signatures shape the creature’s anatomy.',
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
    what: 'Daily app ideas with audience filters and build briefs.',
    how: 'Scheduled AI drops are validated before publication. Date-seeded local remixes keep the bench useful when a generation run is missed.',
    k: 'JavaScript · Claude API · GitHub Actions',
    accent: '#aeb9f0',
    alt: 'Shipworthy’s idea bench with audience and format filters beside a ranked collection of app ideas.',
    cap: 'The live daily drop, ranked by the default build profile.',
    story: {
      role: 'The idea bench, generation job, validation, archive and fallback system.',
      constraint:
        'The app needs a fallback when the daily generation request fails or returns invalid ideas.',
      decision:
        'The scheduled job validates ideas before publishing them and includes the archive in its next request. Date-seeded local remixes provide a fallback.',
      evidence:
        'The live single-file app reads its daily drop and can produce local remixes when that drop is unavailable.',
      question: 'Daily ideas and fallback generation.',
      details: [
        ['Publication', 'A scheduled GitHub Actions job validates and writes the daily ideas.'],
        [
          'Continuity',
          'The archive informs the next request, while local date-seeded remixes cover a missed run.',
        ],
      ],
    },
  },
  {
    key: 'orbital',
    selected: true,
    categories: ['games', 'systems'],
    name: 'Orbital',
    kind: 'Daily puzzle',
    reach: 'open',
    reachLabel: 'Live',
    href: '/orbital/',
    cta: 'Take today’s shot',
    what: 'A daily gravity puzzle: one comet, three stars, one wormhole.',
    how: 'Every level is grown from a trajectory the generator has already flown, so a three-star solution is proved to exist before the day ships.',
    k: 'Canvas 2D · Velocity Verlet · WebAudio',
    accent: '#8ed6e4',
    alt: 'Orbital mid-flight: a comet’s glowing trail curves away from its launch pad past two planets, with collected stars marked in the status bar and a wormhole ahead.',
    cap: 'A real flight on the day’s puzzle, caught between the second and third star.',
    story: {
      role: 'The physics, the level generator, rendering and the synthesized audio.',
      constraint:
        'Everyone gets the same puzzle each day, and nobody plays it before it ships. An unsolvable one would reach every player at once.',
      decision:
        'Levels are grown from a flight rather than placed. The generator searches launch angles until an arc survives and curves, drops the wormhole on that arc, re-simulates with the wormhole’s own pull, places the three stars on that verified path, then proves the same shot collects all three.',
      evidence:
        'Across 200 generated days the search failed zero times and every stated solution re-verified at three stars, in under a millisecond per level.',
      question: 'Proving a daily puzzle is solvable.',
      details: [
        [
          'Determinism',
          'One velocity Verlet integrator runs the generator, the aim preview and the live flight, so the preview cannot promise a path the game will not fly.',
        ],
        [
          'Difficulty',
          'Roughly 3-4% of the aim and power space reaches the wormhole, and 0.5-1.5% of it takes all three stars.',
        ],
      ],
    },
  },
];

export const selectedApps = apps.filter((app) => app.featured || app.selected);
export const built = {
  statement: 'Games, tools and instruments.',
  lead: 'Browser games, instruments, simulations and tools, with notes on how I built them.',
  caveat:
    'Every frame is captured in the running app. Camera and microphone experiments include a demo you can try immediately.',
  facts: [
    { k: 'Projects to explore', v: String(apps.length) },
    { k: 'Open in a browser', v: String(apps.filter((app) => app.reach === 'open').length) },
    { k: 'Ways in', v: String(categories.length) },
  ],
} as const;
