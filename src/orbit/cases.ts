/**
 * The longer telling behind each /v2/ world page.
 *
 * Eyeshot, Blockhold, Voidreach and Cubit restate src/data/portfolio.ts and
 * src/data/built.ts. The other eight come from their games' own source, with
 * the file references for every number kept in data/v2-captures/<slug>/
 * facts.json when the footage was captured. Nothing here is a new claim.
 */
import type { Fact } from './worlds';

export interface Case {
  intro: string;
  howToPlay: string;
  controls?: { desktop?: string; touch?: string };
  /** Replaces the homepage facts on the world page when it has more to say. */
  numbers?: Fact[];
  question?: string;
  engineering: { title: string; body: string }[];
  /** src/assets/<image>.webp, real frames from the running game. */
  stills?: { image: string; alt: string; caption: string }[];
  /** The test suite, said once under "Built with" rather than as a headline. */
  tests?: string;
  /** Only public repositories. */
  repo?: string;
  /** A key in src/data/portfolio-trailers.json. */
  trailer?: string;
}

export const cases: Record<string, Case> = {
  blockhold: {
    intro:
      'Voxel tower defense with ten maps, 249 authored waves and three special boards. Branching towers, multiple roads, heroes and an endless mode, all small enough to load quickly.',
    howToPlay:
      'Place towers on the plots beside the road, upgrade them between waves, and hold the line. Each map adds roads, and the special boards change the rules: Sunderfall has four roads at four heights, and Tidereach reroutes when its causeways close.',
    question: 'Models, sound and simulation.',
    engineering: [
      {
        title: 'No model or sound files',
        body: 'Models use coloured boxes, sounds are synthesized in Web Audio, and icons are drawn as SVG, so the whole campaign stays small enough to load.',
      },
      {
        title: 'Waves that replay exactly',
        body: 'The simulation steps at a fixed 60 Hz apart from rendering, so a wave plays out the same way on any display and can be tested frame by frame.',
      },
      {
        title: 'A campaign with branches',
        body: 'Four tower families, three tiers, two elite branches and two crowns, across ten maps and three heroes.',
      },
    ],
    stills: [
      {
        image: 'blockhold-frame-greenhollow',
        alt: 'Greenhollow, the first board, with one road and thirteen tower plots.',
        caption: 'Greenhollow, the first board: one road and thirteen tower plots.',
      },
      {
        image: 'blockhold-frame-veiltide',
        alt: 'Frostmere Pass under a surge: empowered waves, violet sky, both frozen roads engaged.',
        caption: 'Frostmere Pass under a surge, both frozen roads engaged.',
      },
      {
        image: 'blockhold-frame-cinderwake',
        alt: 'Cinderwake Caldera, with three roads through dark terrain and nearby lava.',
        caption: 'Cinderwake Caldera: three roads through dark terrain.',
      },
      {
        image: 'blockhold-frame-tidereach',
        alt: 'Tidereach Causeway, the widest board in the game: five roads, and a tide that closes them.',
        caption: 'Tidereach Causeway: five roads, and a tide that closes them.',
      },
    ],
    repo: 'https://github.com/aj8uppal/blockhold',
    trailer: 'blockhold',
  },
  cubit: {
    intro:
      '2048, cubed: slide and merge inside a 3×3×3 cube, across six directions instead of four. A single HTML file with local saves, keyboard controls and touch input.',
    howToPlay:
      'Every move slides every tile in one of six directions; equal tiles that meet merge. Space spreads the layers apart so you can see the inside of the board.',
    controls: {
      desktop:
        'W A S D or the arrows slide across, E and Q slide up and down, Space peeks inside, and dragging turns the cube.',
      touch: 'Swipe along an axis of the cube to slide.',
    },
    question: 'Six directions on a flat screen.',
    engineering: [
      {
        title: 'Swipes follow the projection',
        body: 'Swipes are matched to the on-screen projection of each lattice axis, so a gesture means the direction it looks like it means from any angle.',
      },
      {
        title: 'Seeing inside a cube',
        body: 'Tiles that hide others turn translucent, and Space spreads the layers. An opt-in gyro view is capped at 12°.',
      },
      {
        title: 'One file',
        body: 'The engine, renderer, input and synthesized sound ship as a single HTML file that saves locally.',
      },
    ],
    stills: [
      {
        image: 'cubit-inset-board',
        alt: 'Cubit with the layers spread apart.',
        caption: 'Space reveals the inside of the board.',
      },
    ],
    repo: 'https://github.com/aj8uppal/cubit',
    trailer: 'cubit',
  },
  eyeshot: {
    intro:
      'Five daily tests of your eye: find a midpoint, match an angle, draw a circle and more. A new set arrives at midnight, and everyone gets the same one.',
    howToPlay:
      'Each test runs against a short clock. Drag, tap or draw your answer, then lock it in.',
    question: 'Daily challenges and shared scoring.',
    engineering: [
      {
        title: 'One seed for everyone',
        body: 'A daily seed generates the challenges, so every player gets the same five tests.',
      },
      {
        title: 'The server rescores',
        body: 'Scores are recomputed on the server from raw input, using the same rules as the browser, so a leaderboard entry is never just a number the client sent.',
      },
    ],
    stills: [
      {
        image: 'portfolio-eyeshot-practice',
        alt: 'Eyeshot’s full practice interface: header, five tests, Angle prompt, graph, timer and Lock in button.',
        caption: 'The complete practice shot, captured at eyeshot.app.',
      },
    ],
    trailer: 'eyeshot',
  },
  voidreach: {
    intro:
      'Fly through 64 generated star systems in a procedural browser galaxy. The public link opens the standalone solo edition; multiplayer belongs to a separate Node WebSocket service.',
    howToPlay:
      'Undock, throttle up and fly. Dock at stations to trade and take contracts, travel between systems and fight the pirates you meet.',
    controls: {
      touch:
        'Slide the throttle up (it stays set) and drag to steer; the game’s first lessons walk you through it.',
    },
    question: 'Procedural ships and star systems.',
    engineering: [
      {
        title: 'Ships and systems from code',
        body: 'Ships, stations and star systems are produced by procedural geometry rather than a library of models and textures.',
      },
      {
        title: 'Two editions, one approach',
        body: 'A standalone solo edition and a separate multiplayer service with persistent progression share the same generation.',
      },
    ],
    trailer: 'voidreach',
  },
  saltline: {
    intro:
      'You start in 1682 with a small jacht and a short purse, in an island chain split by a treaty line. Trade, fight and board your way west to strike nine captains off a list. Single player, with saves kept in the browser.',
    howToPlay:
      'Cast off from Port Hallam, make sail and steer by the compass mark. The first lessons teach the helm as you go; a first leg across the Roads takes five to ten minutes. Dock to trade, and when a raider alters toward you, turn her so a battery bears.',
    controls: {
      desktop:
        'W and S set more or less sail, A and D the helm (Shift for fine). R takes the offered action: cast off, dock, heave to. Q and E fire the left or right battery; click the picture to look with the mouse, and the left button fires the battery that bears. M opens the chart. A game pad works too.',
      touch: 'None: Saltline is sailed with a keyboard and mouse or a game pad.',
    },
    numbers: [
      { value: '30 × 22 km', label: 'of sea, at true scale' },
      { value: '12', label: 'islands and 10 ports' },
      { value: '838', label: 'voiced lines, 1,283 takes' },
      { value: '5,080', label: 'catalogue stars in its 1682 sky' },
    ],
    question: 'A ship that sits in the water you see.',
    tests: '1,970 automated tests (fast suite: 1,969 pass, 1 expected failure).',
    engineering: [
      {
        title: 'One wave spectrum, evaluated twice',
        body: 'The GPU draws the sea as four FFT cascades, and the physics samples the same wave amplitudes on the CPU. The surface the hull rides is within 4 mm of the waves on screen.',
      },
      {
        title: 'The real sky of 1682',
        body: 'Sun and moon come from Meeus series checked against JPL Horizons, the stars are 5,080 from the Yale Bright Star Catalogue, and Halley’s comet is computed from its 1682 orbit.',
      },
      {
        title: 'A title screen with nothing to fetch',
        body: 'The title stands over a live sea and sky in 0.7 s. The helm waits only for what a first morning needs, with hull textures at half size swapped for full size behind play; the rest loads in idle time.',
      },
      {
        title: 'Levelled to one gun',
        body: 'One gun at arm’s length is full scale and everything else sits at its catalogue gain. A limiter takes a rolling broadside instead of anything being turned down, and every voiced line has two takes.',
      },
    ],
    stills: [
      {
        image: 'v2-saltline-1',
        alt: 'The jacht leaving the Port Hallam quay at morning, with the first lesson card and the compass.',
        caption:
          'Port Hallam at 07:46, with the first lesson: make sail and stand out of the harbour.',
      },
      {
        image: 'v2-saltline-2',
        alt: 'The jacht under full press of sail at 8¼ knots, islands on the horizon.',
        caption: 'Full press in the Roads at 8¼ knots, on the way to the first of the Nine.',
      },
      {
        image: 'v2-saltline-3',
        alt: 'A period-style chart of the Salinas with soundings, a compass rose and the treaty line.',
        caption:
          'A Chart of the Salinas, with the banks and soundings and the treaty line to the west.',
      },
      {
        image: 'v2-saltline-4',
        alt: 'The jacht with gun smoke on deck, a raider closing, and the battery card showing guns ready.',
        caption:
          'Hands to the guns at 18:35: the lookout calls a raider, and the battery card shows what bears.',
      },
    ],
  },
  emberdeep: {
    intro:
      'A dark-fantasy 3D action roguelike. As one of the Ashbound you fight through sealed dungeon chambers, chaining combos, dashing through glowing attack warnings and setting off a Cinder Nova when the room fills up. Seven depths down waits Vorthak, the Cinder King; beyond him, the endless Abyss.',
    howToPlay:
      'Clear sealed chambers, choosing your route by the reward each doorway shows, take boons, and find the way down. After your first win, Pyre Vows raise the Heat for bigger rewards, and every day brings a Daily Rite with the same seed for everyone.',
    controls: {
      desktop:
        'WASD or arrows move and the mouse aims. Left click strikes (hold to chain the combo), Space, Shift or right click dashes, Q fires the Cinder Nova, E interacts, F drinks a potion, R rerolls a boon offer. A game pad works too.',
    },
    numbers: [
      { value: '38', label: 'boons: 25 general, 6 aspects, 7 fusions' },
      { value: '11', label: 'Pyre Vows, up to Heat 20' },
      { value: '40', label: 'deeds and 14 chronicle pages' },
      { value: '12', label: 'permanent Sanctum rites' },
    ],
    question: 'Thirty torches, ten lights.',
    engineering: [
      {
        title: 'One flow field for every enemy',
        body: 'Enemies path with a single breadth-first flow field over the 72×72 tile grid, rebuilt only when the player steps onto a new tile. Each enemy steps to its lowest-cost neighbour, and diagonal moves that would cut a wall corner are refused.',
      },
      {
        title: 'A pool of ten lights',
        body: 'Torches, braziers, crystals and lava give 30 to 77 light sources per floor, but only ten point lights are ever drawn (six on Low). Each frame the pool moves to the nearest sources and fades by distance, so the swaps never show and the shaders never recompile.',
      },
      {
        title: 'Root motion, tamed',
        body: 'The auto-rigged animation clips put root motion on different axes depending on the exporter. The loader finds the up axis from the hip tracks and freezes the other two, so runs and attacks stay in place but keep their bob.',
      },
      {
        title: 'Hit feel, in numbers',
        body: '45 ms of hit-stop on a normal hit and 85 ms on the finisher, screen shake on trauma squared, and aim assist that snaps a swing to the best target within 0.75 radians.',
      },
    ],
    stills: [
      {
        image: 'v2-emberdeep-2',
        alt: 'Vorthak, the Cinder King, in a ring of embers on the throne floor, his health bar across the top.',
        caption: 'Floor VII, the Cinder Throne: Vorthak in a ring of embers.',
      },
      {
        image: 'v2-emberdeep-3',
        alt: 'A combo finisher and purple wraith bolts over a lava pool in the Molten Depths.',
        caption: 'The Molten Depths: a combo finisher while wraith bolts close in over the lava.',
      },
      {
        image: 'v2-emberdeep-4',
        alt: 'A Cinder Nova erupting in a ring of fire runes in a blue-lit crystal hall.',
        caption: 'A Cinder Nova in the Glimmering Hollows.',
      },
      {
        image: 'v2-emberdeep-1',
        alt: 'The boon choice: three cards, Soul Siphon (epic), Gilded Touch (common) and Bloodthirst (rare).',
        caption: 'A cleared room offers a choice of three boons.',
      },
    ],
  },
  'lumen-hollow': {
    intro:
      'A cozy, story-driven 3D adventure. You play Wren, a young lantern-keeper, gathering scattered glimmers to wake a grey, sleeping island so a fallen star named Pip can get home. The story runs through four chapters to the Moonwhale rising from the clouds.',
    howToPlay:
      'The opening story runs about a minute; skip each line with a click, Enter or a tap. Then gather glimmers, carry them to the sleeping heartblooms and offer them, and watch the colour come back. Wake the Snoozlings and you learn to glide.',
    controls: {
      desktop:
        'WASD or arrows move, Shift runs, Space jumps (hold in the air to glide once you have learned it), E interacts, Q plays Pip’s Song from chapter 3. Drag to look, wheel to zoom, Esc pauses, P hides the interface for photos.',
      touch:
        'Thumb on the left of the screen is a floating joystick; drag on the right to look. On-screen buttons jump (hold to glide), interact and play Pip’s Song.',
    },
    numbers: [
      { value: '143', label: 'glimmers on the island' },
      { value: '7', label: 'Snoozlings and 12 star shards' },
      { value: '202,134', label: 'grass blades at top quality' },
      { value: '24', label: 'light sources every material samples' },
    ],
    question: 'One radius repaints the world.',
    engineering: [
      {
        title: 'A restoration field',
        body: 'Every material is patched to sample up to 24 growing sources. Outside them colour is remapped to a desaturated moonlit blue; inside it is full colour with a golden ring at each growing edge, so one radius repaints terrain, grass, foliage and props at once.',
      },
      {
        title: 'Grass in chunks',
        body: '202,134 wind-swept blades at the top quality, instanced in 74 spatial chunks. Each chunk scales its instance count by camera distance and a global level of detail.',
      },
      {
        title: 'A frame-rate governor',
        body: 'Every two seconds the game checks its frame rate. After two windows under 45 fps it lowers the pixel ratio, then turns off shadows, then thins the grass, so a phone keeps playing smoothly.',
      },
      {
        title: 'Music that opens up',
        body: 'Audio is mixed live in Web Audio: music ducks under narration and its low-pass filter opens as the island is restored. Glimmer pickups play pentatonic chimes that climb with each combo, and Pip’s babble is synthesized.',
      },
    ],
    stills: [
      {
        image: 'v2-lumen-hollow-1',
        alt: 'A heartbloom waking: golden rings rise from it and a wave of green colour spreads through the grey meadow.',
        caption: 'A heartbloom wakes, and the restoration wave rolls colour across the meadow.',
      },
      {
        image: 'v2-lumen-hollow-2',
        alt: 'Hearthroot, a great tree in pink blossom, over a restored green island under the aurora.',
        caption: 'Hearthroot in bloom once the island is restored.',
      },
      {
        image: 'v2-lumen-hollow-3',
        alt: 'The glowing Moonwhale rising out of a sea of cloud past the island’s edge, lanterns drifting around it.',
        caption: 'The finale: the Moonwhale rises from the clouds.',
      },
      {
        image: 'v2-lumen-hollow-4',
        alt: 'Wren in the grey meadow with the glimmer count and the chapter objective on screen.',
        caption: 'The Sleeping Meadow, before any light: bring glimmers to the three heartblooms.',
      },
    ],
  },
  lanternwake: {
    intro:
      'A maritime RPG under sail. Out of Little Lantern lie seven islands, five fishing grounds and a chain of sleeping beacons; fish, trade, take charters, refit your boat and light the coast back up. This copy sails solo; shared voyages run on the game’s own server.',
    howToPlay:
      'Raise sail, steer with the wind, and make for Emberwatch to kindle the first beacon. Dock to trade and refit, keep an eye on your draft as cargo and fish load you down, and mind the shallows.',
    controls: {
      desktop:
        'W and S raise and furl sail, A and D steer, E docks or goes ashore, Space fires a broadside, Shift calls a gust, M opens the chart.',
      touch: 'On-screen helm and sail buttons; drag to turn the camera; tap to go ashore.',
    },
    numbers: [
      { value: '7', label: 'islands' },
      { value: '6', label: 'species across 5 fishing grounds' },
      { value: '21', label: 'hull volumes in the buoyancy model' },
      { value: '6.9 MB', label: 'to download before you sail' },
    ],
    question: 'One sea for the eye and the hull.',
    tests: '250 automated tests passing.',
    engineering: [
      {
        title: 'One sea, generated once',
        body: 'A single deterministic analytic sea drives the water shader, the hull buoyancy, the foam and the sailing. The GLSL is generated from the same TypeScript coefficients, so what you see is what the hull floats on.',
      },
      {
        title: 'Curved-hull buoyancy',
        body: 'Seven curved hull sections split into three lateral volumes, 21 in all. Cargo, fish and sealed manifests change draft and trim, and the same calculation floats captains, corsairs and coastal traffic.',
      },
      {
        title: 'Playable before it has finished loading',
        body: 'The sea, sky and ship load first; buildings, rocks and foliage stream in behind them, each with a timeout and a flat-colour fallback, so scenery that fails never stops the voyage.',
      },
      {
        title: 'Shared voyages, server-authoritative',
        body: 'Online, the sea is authoritative on a WebSocket server and the client predicts only its own helm. The server checks the page’s origin, which is why this copy sails alone.',
      },
    ],
    stills: [
      {
        image: 'v2-lanternwake-1',
        alt: 'The cutter leaving harbour under full sail, a lighthouse island to port.',
        caption: 'Leaving Little Lantern under full sail.',
      },
      {
        image: 'v2-lanternwake-2',
        alt: 'The cutter on open water with the voyage HUD: objective, wind rose and speed.',
        caption: 'Open water, with the voyage HUD: the next beacon, the wind and your speed.',
      },
      {
        image: 'v2-lanternwake-3',
        alt: 'The harbour screen at Little Lantern beside the moored cutter.',
        caption: 'In port at Little Lantern: trade, refit and the next leg of the voyage.',
      },
      {
        image: 'v2-lanternwake-4',
        alt: 'The cutter running before the wind across a sunlit sea.',
        caption: 'Running before the wind on a sunlit sea.',
      },
    ],
  },
  'lantern-roads': {
    intro:
      'An isometric pixel-art action RPG, built as a cooperative online world. Chapter 1, The Drowned Mill, takes you from the Lantern Inn up the mill road after Hollis, whose lights went out behind him. This copy is solo: the game’s own authoritative server runs in a Web Worker in your tab, and saves stay in your browser.',
    howToPlay:
      'Speak with Mara at the inn counter to swear the oath and take the Warden’s Lantern, then step out into the rain. Strike up close, dodge the marked ground, keep your distance and cast Ember Bolt, and relight each road lantern you reach.',
    controls: {
      desktop:
        'WASD or arrows move, Shift runs, E talks and opens doors, J or click strikes, K dodges, L or right-click casts Ember Bolt, M opens the map. Gamepads work, and keys can be rebound.',
      touch: 'None yet: phones without a keyboard or gamepad get a note instead of the game.',
    },
    numbers: [
      { value: '5', label: 'road lanterns' },
      { value: '12', label: 'Chapter 1 objective steps' },
      { value: '60 / 20 Hz', label: 'simulation / snapshot rate' },
      { value: '37', label: 'enemies in Chapter 1, 3 of them bosses' },
    ],
    question: 'An MMO server, in your tab.',
    tests: '1,581 automated tests passing, in 96 files.',
    engineering: [
      {
        title: 'The real server, in a Web Worker',
        body: 'The authoritative World server runs unchanged in a worker. The page swaps the WebSocket for an in-page transport with the same open, message and close semantics, and the ws server and the worker share one connection handler, so validation and rate limits are the same code. Web Locks stop a second tab overwriting your save.',
      },
      {
        title: 'Prediction against snapshots',
        body: 'The client predicts its own character with the same shared simulation the server runs at 60 Hz, and reconciles against 20 Hz authoritative snapshots.',
      },
      {
        title: 'Pixel-exact scaling',
        body: 'The view is locked to a 640×360 stage at an integer device-pixel scale, with a one-pixel margin so the camera can move in sub-pixel steps without resampling the art.',
      },
      {
        title: 'Depth sorting, fixed at the root',
        body: 'Isometric sorting was rebuilt and its violations went from about 7,700 to 27; a test replays the client’s sort over every valid cell of every zone.',
      },
    ],
    stills: [
      {
        image: 'v2-lantern-roads-1',
        alt: 'Night rain in Lantern Reach: Husks advancing on the keeper outside the lamplit inn.',
        caption: 'Husks in the rain outside the Lantern Inn.',
      },
      {
        image: 'v2-lantern-roads-2',
        alt: 'A relit road lantern flares in rings of light beside the canal bridge.',
        caption: 'The first road lantern, relit.',
      },
      {
        image: 'v2-lantern-roads-3',
        alt: 'Inside the Lantern Inn: Mara at the counter as the keeper takes the oath.',
        caption: 'Mara’s oath, and the Warden’s Lantern.',
      },
      {
        image: 'v2-lantern-roads-4',
        alt: 'North Quay at dusk: a canal, timber houses and a crowd of Husks on the grass.',
        caption: 'North Quay, and the Husks waiting on it.',
      },
    ],
  },
  seventide: {
    intro:
      'A trading-and-building race in the Catan family on a living miniature island. Roll the dice, collect wood, clay, grain, wool and stone from the tiles your hamlets touch, then trade and build roads, hamlets and towns to reach ten points first while rival bots bargain, block and race you for the best corners.',
    howToPlay:
      'Start a Solo match against bots, or open an online room with friends. Place two hamlets and their roads, then roll each turn, trade at the harbours or with rivals, and spend what you collect. A regular match aims for 25 to 40 minutes; Riptide plays a whole match in about ten.',
    controls: {
      desktop:
        'Click a highlighted corner or edge, then Confirm. Drag to orbit, right-drag to pan, scroll to zoom. R rolls, E ends the turn.',
      touch: 'Tap a spot, then Confirm. One finger pans; two twist, tilt and pinch to zoom.',
    },
    numbers: [
      { value: '19', label: 'land hexes' },
      { value: '3–4', label: 'players a match' },
      { value: '25', label: 'charter cards in the deck' },
      { value: '4', label: 'bot levels, Gentle to Expert' },
    ],
    question: 'A board game with nothing to hide behind.',
    tests: '459 unit and rules tests and 85 browser tests.',
    engineering: [
      {
        title: 'The whole world is code',
        body: 'No model files ship. Every tile, with its plateau, inset border and cliff skirt sinking under the sea, plus its trees, sheep, wheat and rocks, is generated at load and merged into one vertex-coloured mesh per terrain, rendered with the standalone PlayCanvas engine.',
      },
      {
        title: 'Hidden information, enforced by the server',
        body: 'Every seat gets its own redacted copy of the authoritative state: rivals’ hands become a card count, and the dice RNG state and seed are blanked, so a modified client cannot see hands or predict rolls.',
      },
      {
        title: 'Ranked bots, pinned to their evidence',
        body: 'Bot ratings come from 8,192 training, 1,024 validation and 1,024 test games per mode, and the server refuses the catalogue if the SHA-256 of any of its 29 policy source files has changed.',
      },
      {
        title: 'Sharp on a throttled iPhone',
        body: 'Render density steps along a fixed ladder and only drops when per-frame CPU work, not just the frame interval, shows real overload, so a throttled iPhone keeps native sharpness.',
      },
    ],
    stills: [
      {
        image: 'v2-seventide-island-1',
        alt: 'Setup: placing a second hamlet, with the panel showing that corner produces grain.',
        caption: 'Setup shows what each corner will produce before you commit.',
      },
      {
        image: 'v2-seventide-island-2',
        alt: 'The Build panel open over the island: road, hamlet, town and charter with their costs.',
        caption: 'The Build panel, with what each piece costs and what you still need.',
      },
      {
        image: 'v2-seventide-island-3',
        alt: 'A bot named Rook offers a trade: one clay for one stone.',
        caption: 'Rivals bargain with you turn by turn.',
      },
      {
        image: 'v2-seventide-island-4',
        alt: 'A close view of wheat fields, forests, towns and hamlets on the island.',
        caption: 'Up close, every tile is generated geometry.',
      },
    ],
  },
  'seventide-globe': {
    intro:
      'Seventide’s trading race on a little planet: a Goldberg globe of 162 tiles with a continent, four far isles and lighthouse islets. The flat game’s rules engine runs on the sphere unchanged; voyages carry a hamlet to the isles.',
    howToPlay:
      'Settle the continent as you would the island, then build a Voyage (two wood, a clay, a grain and two wool) to found a hamlet on a far isle. Each isle is its own race. Solo against bots or pass-and-play on one device; it works offline once loaded.',
    controls: {
      desktop:
        'Click a highlighted corner or edge, then Confirm. Drag to turn the world (a flick keeps it spinning), scroll to zoom, double-click to glide home.',
      touch: 'Tap, then Confirm. One finger turns the world; two pinch and twist.',
    },
    numbers: [
      { value: '162', label: 'tiles, 12 of them pentagons' },
      { value: '27', label: 'continent tiles' },
      { value: '4 × 5', label: 'far isles, five tiles each' },
      { value: '3–4', label: 'players, solo or pass & play' },
    ],
    question: 'Hexagons on a sphere.',
    tests: '489 unit and rules tests passing.',
    engineering: [
      {
        title: 'A Goldberg polyhedron',
        body: 'The board has three tiles at every corner, exactly like the flat island, so hamlets on corners, roads on edges, spacing and Longest Road all run on the sphere unchanged. Only the graph changes, and each tile is bent onto the sphere between its centre and corner unit vectors.',
      },
      {
        title: 'Every world from a seed',
        body: 'The 27-tile continent grows with no lakes, no tile hanging by one edge and every tile within 52° of its middle so it faces the camera. Numbers are dealt by a seeded search so no two 6s and 8s touch, and the isles grow from the sea pentagons farthest apart.',
      },
      {
        title: 'Voyages sail real boats',
        body: 'A voyage leaves from your port with the fewest land crossings and eases along a great-circle slerp; the new hamlet waits for landfall, and moored boats are derived from game state so they survive a reload.',
      },
      {
        title: 'A static, offline folder',
        body: 'One build flag greys out Online and Ranked and drops every server call. The service worker derives its base from its own URL, so the whole app caches and runs under /seventide/ with no server.',
      },
    ],
    stills: [
      {
        image: 'v2-seventide-1',
        alt: 'Setup on the globe: placing a hamlet beside a wellspring, which pays what you lack.',
        caption: 'Setup on a sphere: three tiles meet at every corner, as on the island.',
      },
      {
        image: 'v2-seventide-2',
        alt: 'The settled continent seen close, its hex tiles curving away over the globe.',
        caption: 'The continent, curving away over the world.',
      },
      {
        image: 'v2-seventide-3',
        alt: 'The globe turned to a far isle across the sea, with a trade offer open.',
        caption: 'A far isle, across the sea from the continent.',
      },
      {
        image: 'v2-seventide-4',
        alt: 'The Build panel with Voyage listed beside road, hamlet, town and charter.',
        caption: 'Voyage: a hamlet on a far isle, for two wood, a clay, a grain and two wool.',
      },
    ],
  },
  'harvest-crown': {
    intro:
      'A real-time realm builder on Catan’s grammar, paced by the seasons. Hamlets sit on hex corners and roads run along their edges; rival houses, envoys and raids contest the Steward’s, Iron and Merchant crowns. This is the browser edition, a TypeScript and Babylon.js port of the Godot original that keeps its rules and its words.',
    howToPlay:
      'Start a guided realm and the Steward’s counsel walks you through its first beats: build a road, found a hamlet, feed your people and answer to the council each season. Pause with Space and set the pace with 1 to 4.',
    controls: {
      desktop:
        'WASD, arrows or the screen edge pan; the wheel zooms from the map to eye level; Q and E turn. Left-click selects, right-click orders. B builds, R lays roads, Space pauses.',
      touch:
        'Drag pans, pinch zooms, twist turns, tap selects and a long press gives the order. Best on a tablet or a phone held sideways.',
    },
    numbers: [
      { value: '3', label: 'crowns to win' },
      { value: '4', label: 'seasons, sowing to winter council' },
      { value: '3', label: 'rival difficulties, Gentle to Hard' },
      { value: '8', label: 'beats of guided counsel' },
    ],
    question: 'Threads without SharedArrayBuffer.',
    tests: '1,053 automated tests passing; 88,520 lines of TypeScript.',
    engineering: [
      {
        title: 'A worker pool by message passing',
        body: 'Terrain chunks are meshed by two to six module Web Workers sharing the world’s height data, and the land is dressed by two to four more, all by message passing. It stays multi-threaded with no SharedArrayBuffer, so it needs none of the COOP/COEP headers a static host cannot send.',
      },
      {
        title: 'Seasons that repaint everything at once',
        body: 'The shown season trails the clock by a three-second fade that hands every layer four season weights plus a lying-snow weight, so fields, trees and roofs turn together.',
      },
      {
        title: 'No CDN, no hung decodes',
        body: 'The meshopt decoder is bundled rather than fetched, and Babylon’s decoder-worker switch is replaced with a no-op, because it killed decodes still in flight and hung Firefox loading the building kit.',
      },
      {
        title: 'Quality that finds its level',
        body: 'A first run starts on the high tier and steps down one tier at a time while the median frame is over 22 ms.',
      },
    ],
    stills: [
      {
        image: 'v2-harvest-crown-1',
        alt: 'The home island at harvest: thatched cottages, wheat sheaves, sheep and a windmill.',
        caption: 'Harvest on the home island.',
      },
      {
        image: 'v2-harvest-crown-2',
        alt: 'Winter with the full HUD: the Steward’s Crown goals, the counsel panel and the island under snow.',
        caption: 'Winter, with the Steward’s counsel and your crown’s goals.',
      },
      {
        image: 'v2-harvest-crown-3',
        alt: 'The whole island under snow, its hamlets labelled, seen from the map view.',
        caption: 'The map view, from high above the winter island.',
      },
      {
        image: 'v2-harvest-crown-4',
        alt: 'A snowed-in village of timber houses and haystacks beside a white cliff.',
        caption: 'The same village, snowed in.',
      },
    ],
  },
};
