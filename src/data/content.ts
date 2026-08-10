/**
 * Every fact on the page comes from here, and everything here is verified.
 * Nothing is invented: dates and titles are from the 2026 resume, project
 * detail is from the projects themselves, and the saltline readouts are
 * transcribed off the captures in src/assets.
 */

export type Status = 'live' | 'wip' | 'off';

export interface Role {
  /** Key into `places`: the row's anchor, and what the skills index points at. */
  key: PlaceKey;
  when: string;
  now?: boolean;
  title: string;
  org: string;
  where?: string;
  body?: string;
  bullets?: string[];
  /** Current role only: what the job is right now, under the record of it. */
  status?: string;
  stack?: string;
  /** A key in the evidence map, for what `body` rests on. */
  ev?: string;
  /** The same, for `status`, which is a claim of a different kind. */
  statusEv?: string;
  pending?: { note: string };
}

export interface Frame {
  key: string;
  tab: string;
  alt: string;
  readout: Array<[string, string]>;
  note: string;
}

/**
 * One saltline capture in the time-of-day arc. Every value is transcribed off the
 * HUD and the development panel in that capture, not computed or estimated.
 */
export interface ArcFrame {
  key: string;
  time: string;
  light: string;
  alt: string;
  speed: string;
  rel: string;
  thrust: string;
  vmg: string;
}

export const site = {
  title: 'AJ Uppal',
  tagline: 'Software engineer',
  description:
    'AJ Uppal. Software engineer in the Bay Area. Healthcare data integrations at Notable Health, and four worlds that run in a browser tab.',
  url: 'https://aj8uppal.github.io',
} as const;

export const contact = {
  email: 'aj8uppal@gmail.com',
  github: 'https://github.com/aj8uppal',
  linkedin: 'https://www.linkedin.com/in/aj-uppal/',
  stackoverflow: 'https://stackoverflow.com/users/3113477/a-j-uppal',
  /* The 2026 PDF is the first one safe to serve: the home address is off it.
     The phone number stays, published deliberately. The 2024 file it replaces
     is gone from the repo. */
  resume: '/attachments/resume2026.pdf',
  resumeYear: '2026',
} as const;

/**
 * Six sections, and the nav is generated from this list. Education is not one of
 * them: it sits inside the work log, where a degree and a job are the same kind
 * of fact, and keeps its own `#education` anchor.
 *
 * `id` and `name` disagree for two of them. The ids are the URLs the page has
 * always had and they keep working; the names are what a first-time reader
 * needs, because "Building" next to "Work" reads as two words for the same
 * thing, and if anything "Work" is the one that sounds like the portfolio.
 */
export const sections = [
  { n: '01', id: 'about', name: 'About', desc: 'Two degrees, one habit', count: '4 notes' },
  {
    n: '02',
    id: 'building',
    name: 'Projects',
    desc: 'Four projects, in various states of done',
    count: '4 entries',
  },
  { n: '03', id: 'work', name: 'Experience', desc: 'Eight jobs, reverse order', count: '8 rows' },
  {
    n: '04',
    id: 'playground',
    name: 'Playground',
    desc: 'Three of the oldest, still running',
    count: '3 playable',
  },
  { n: '05', id: 'skills', name: 'Skills', desc: 'Grouped, unrated', count: '5 groups' },
  { n: '06', id: 'contact', name: 'Contact', desc: 'Email is the reliable one', count: '4 links' },
] as const;

/**
 * Every place on this page a skill can be shown to turn up, in page order.
 *
 * `at` is the element's own id, so the skills index lands the reader on the
 * card or the row rather than at the top of the section holding it. The two
 * physics jobs share an employer and a building, so they are told apart by the
 * work rather than by the name over the door.
 */
export const places = {
  saltline: { name: 'saltline', at: 'p-saltline' },
  ember: { name: 'Ember Wilds', at: 'p-ember' },
  hidamari: { name: 'hidamari', at: 'p-hidamari' },
  elderwood: { name: 'Elderwood Vale', at: 'p-elderwood' },
  notable: { name: 'Notable Health', at: 'r-notable' },
  harvest: { name: 'Harvest Fintech', at: 'r-harvest' },
  umassDev: { name: 'UMass Physics, software', at: 'r-umass-software' },
  arena: { name: 'The Arena', at: 'r-arena' },
  umassRes: { name: 'UMass Physics, research', at: 'r-umass-research' },
  gotit: { name: 'Got It.AI', at: 'r-gotit' },
  baaqmd: { name: 'Bay Area AQMD', at: 'r-baaqmd' },
  youweb: { name: 'YouWeb', at: 'r-youweb' },
  autotyper: { name: 'AutoTyper', at: 'd-autotyper' },
  deviation: { name: 'deviation.html', at: 'd-deviation' },
  grinch: { name: 'GrinchJump', at: 'd-grinchjump' },
  pickle: { name: 'PICKLE', at: 'd-pickle' },
  rendezvous: { name: 'Rendezvous', at: 'd-rendezvous' },
  courses: { name: 'Coursework', at: 'education' },
} as const;

export type PlaceKey = keyof typeof places;

/** Page order, so the index reads down the page however the map was written. */
export const placeOrder = Object.keys(places) as PlaceKey[];

export const cover = {
  kicker: ['Bay Area, California', 'Software engineer at Notable Health'],
  /* The hero used to open on the two degrees, which is the same story About
     opens on, told slightly worse. It says what he does now instead, and the
     degrees keep their one telling in `about.prose[0]`. Both lines are drawn
     from what the page already publishes: the Notable role names the platform
     and its production numbers, and the four projects below are the worlds,
     the renderer and the sailing model.

     The second line is the only place on the page that says what the job is
     before the Experience section says it properly. */
  lead: 'I build across the stack: zero-to-one services, AI and voice systems, infrastructure, and, off the clock, worlds that run in a browser.',
  support:
    'At Notable, a healthcare AI company, I work across the stack: integrations, voice AI, the conversation and API layers, frontend to database, and the occasional flight to a customer’s site to make it work in the room.',
  /* This used to name all four projects in a 57-word run-on, immediately above
     four cards that name themselves. What is left is the only thing the cards
     cannot say from inside one card: which half of them you can open. */
  second: 'Two are live today. Two aren’t finished yet.',
  strip: [
    { dt: 'Place', dd: 'Bay Area', sub: 'California' },
    { dt: 'Work', dd: 'Software engineer', sub: 'Notable Health, since Aug 2022' },
    { dt: 'Studied', dd: 'B.S. Computer Science', sub: 'B.S. Astrophysics' },
    { dt: 'Building', dd: 'Four things', sub: 'two live, two not yet' },
  ],
} as const;

export interface AboutNote {
  k: string;
  v: string;
  /**
   * An answer the note invites, offered as a mail draft.
   *
   * Subject only. A canned body would be writing the reader's argument for
   * them, and "will debate" is not an invitation to send a form back.
   */
  reply?: { label: string; subject: string };
}

export const about = {
  statement: 'I learn things by building them.',
  prose: [
    'I did two degrees at once, computer science and astrophysics, because I couldn’t choose between them. Some weeks that meant Algorithms and General Relativity in the same problem-set pile.',
  ],
  /**
   * The second paragraph, split around its one link.
   *
   * A tuple rather than a sentence with markup in it, because the words in the
   * middle are the only claim here a reader can go and check, and the link
   * belongs to the data that makes the claim rather than to the template that
   * happens to print it.
   */
  sim: [
    'In college I simulated CO2 cooling for particle detectors. Now I simulate an ocean for a ',
    'sailing game',
    '.',
  ] as const,
  notes: [
    { k: 'Off the clock', v: 'Heirloom tomatoes, bikes, and Pink Floyd, roughly in that order.' },
    { k: 'Long held', v: 'Wanted to be an astronaut since I was four. Still would.' },
    {
      k: 'Will debate',
      v: 'Python is the best language. I’ve heard the counterarguments.',
      reply: { label: 'File an appeal', subject: 'Python counterargument' },
    },
    {
      k: 'Best class',
      v: 'Cosmology and Consciousness. An independent study, and I had to ask for it.',
    },
  ] as AboutNote[],
} as const;

/* ── Ember Wilds ─────────────────────────────────────────────────────── */

export const emberRegions: Frame[] = [
  {
    key: 'hearthvale',
    tab: 'Hearthvale',
    alt: 'The Hearthvale in Ember Wilds: green voxel meadows split by a river, a level one character on the bank, quest panel at top left.',
    readout: [
      ['Region', 'The Hearthvale'],
      ['Character', 'Level 1'],
    ],
    note: 'Where everyone starts. A river, a goblin headman, and a field note telling you that you can tilt the camera.',
  },
  {
    key: 'fallowmere',
    tab: 'Fallowmere',
    alt: 'Fallowmere in Ember Wilds: a dusty orange plain of voxel trees at dusk, embers drifting, a level thirty character in the centre.',
    readout: [
      ['Region', 'Fallowmere'],
      ['Character', 'Level 30'],
    ],
    note: 'Open country under a dust-orange sky. Direfangs push in from the edges and the quest log starts counting them.',
  },
  {
    key: 'greenmarch',
    tab: 'Greenmarch',
    alt: 'The Greenmarch in Ember Wilds: pale flats under a bleached sky with a white ruin and a chest, lore lines stacked at bottom left.',
    readout: [
      ['Region', 'The Greenmarch'],
      /* Lower-case i, which is how the drop line in the frame spells it. */
      ['Drop', 'Grave-iron Blade'],
    ],
    /* The audit flagged "garlanded in herb and briar" as the page going purple.
       It is not the page: it is the lore panel in this frame, word for word,
       and the caption now says so the way the Black Plateau one does. Quoting
       a game's own writing is transcription; passing it off as mine was the
       problem. */
    note: 'The lore panel’s own words: a fallen colonnade of Emberhold, garlanded in herb and briar, haunted by something in the Ashen Waste’s livery. It left a blade behind.',
  },
  {
    key: 'fenmarch',
    tab: 'Fenmarch',
    alt: 'The Fenmarch in Ember Wilds: a dark, near-monochrome marsh at night lit only by the character’s own glow.',
    readout: [
      ['Region', 'The Fenmarch'],
      ['Light', 'Whatever you brought'],
    ],
    note: 'The darkest region. The only reliable light source in this frame is the character.',
  },
  {
    key: 'ashen',
    tab: 'Ashen Waste',
    alt: 'The Ashen Waste in Ember Wilds: a red-lit waste mid-combat, a white nova ring expanding from the character, damage number 684 above a creature.',
    readout: [
      ['Region', 'The Ashen Waste'],
      ['Hit', '684'],
    ],
    note: 'Nova, mid-detonation. The ring is resolved on the server, and it did 684 damage to the creature it caught.',
  },
  {
    key: 'greywall',
    tab: 'Greywall Peaks',
    alt: 'The Greywall Peaks in Ember Wilds: pale grey stone terraces under flat light, banners, and a cluster of glowing projectiles mid-flight.',
    readout: [
      ['Region', 'The Greywall Peaks'],
      ['Loot', '11 items'],
    ],
    note: 'Bleached stone and banners. Eleven items on the floor is what a fight up here looks like when it goes well.',
  },
  {
    key: 'plateau',
    tab: 'Black Plateau',
    alt: 'The Black Plateau in Ember Wilds: a dark red-violet plateau with the region title card centred and a lore line beneath it.',
    readout: [
      ['Region', 'The Black Plateau'],
      ['Reads', 'There is no more inward'],
    ],
    note: 'The last region. The title card puts it plainly: the Watcher is above you now, and there is no more inward.',
  },
];

export const ember = {
  name: 'Ember Wilds',
  href: 'https://emberwilds-web.fly.dev',
  status: 'live' as Status,
  sub: 'Browser-based voxel MMORPG. Designed, built, and in production.',
  skim: {
    role: 'Designed it, built it, put it in production.',
    hard: 'One world staying consistent for everyone in it. The realm server simulates every player.',
    proof: 'Open a tab, make a character, run into somebody. Sixty-four to a realm.',
  },
  spread: {
    n: 'Plate 02 / Ember Wilds',
    t: 'A voxel MMORPG, shipped',
    s: 'Fallowmere at dusk, level 30, nine thousand fame in. World state, quests and loot all live on the realm server - the browser just renders it.',
  },
  prose: [
    'A voxel MMORPG that runs in a browser tab. I designed it, built it, and put it in production on Fly.io, where a web tier and a separate realm service keep one world consistent for everyone in it.',
  ],
  framesLede: 'Seven regions, one level-30 character.',
  framesCue: 'Choose a region, or use the arrow keys',
  proof: {
    t: 'One realm, up to 64 players',
    body: [
      'This frame is two of us in the same Hearthvale from two browsers, and a realm holds up to 64 at once. Everyone in it is simulated by the same server, which was the hard part.',
    ],
  },
  plate: [
    ['Status', 'Live, no install'],
    ['Shape', 'Web tier plus realm service'],
    ['Realm cap', '64 players in one realm'],
    ['Host', 'Fly.io'],
    ['World', 'Seven regions, harder as you travel outward'],
    ['Classes', 'Unlocked by beast lore and study, not a skill tree'],
    ['Economy', 'Fame, satchel, tiered gear'],
  ] as Array<[string, string]>,
} as const;

/* ── saltline ────────────────────────────────────────────────────────── */

/**
 * Six captures of one seed, in clock order. The panel settings are identical in
 * all six - sea state moderate, wind angle 40 degrees, crest sharpness 0.68,
 * seed 4193 - so the only variable across the set is the time of day.
 */
export const saltlineArc: ArcFrame[] = [
  {
    key: 'night',
    time: '04:36',
    light: 'Moon',
    alt: 'saltline at night: a full moon low over dark water, the sloop under full sail trailing a wide luminous teal wake.',
    speed: '14.4 kn',
    rel: '66°',
    thrust: '89%',
    vmg: '5.8 kn',
  },
  {
    key: 'sunrise',
    time: '06:02',
    light: 'Sunrise',
    alt: 'saltline at sunrise: an orange sky behind a dark island, a line of vessels along the horizon, the sloop running away from the light.',
    speed: '13.6 kn',
    rel: '-145°',
    thrust: '84%',
    vmg: '11.0 kn',
  },
  {
    key: 'dawn',
    time: '06:31',
    light: 'Dawn',
    alt: 'saltline half an hour later: the same island under a blue sky with pink cloud, the water turned blue-grey.',
    speed: '14.0 kn',
    rel: '-143°',
    thrust: '85%',
    vmg: '11.1 kn',
  },
  {
    key: 'daylight',
    time: '16:46',
    light: 'Daylight',
    alt: 'saltline in flat afternoon daylight: three raiders and a merchant in line off the starboard bow, each with its name over it.',
    speed: '14.9 kn',
    rel: '119°',
    thrust: '97%',
    vmg: '8.3 kn',
  },
  {
    key: 'golden',
    time: '17:15',
    light: 'Golden hour',
    alt: 'saltline at golden hour: a low sun laying a bright path across calm water, the sloop close-reaching towards it.',
    speed: '15.0 kn',
    rel: '79°',
    thrust: '96%',
    vmg: '2.3 kn',
  },
  {
    key: 'sunset',
    time: '18:02',
    light: 'Sunset',
    alt: 'saltline at sunset: the sun on the horizon behind a small island, heavy cloud overhead, the sloop silhouetted against orange.',
    speed: '15.8 kn',
    rel: '83°',
    thrust: '97%',
    vmg: '2.1 kn',
  },
];

export const saltline = {
  name: 'saltline',
  href: 'https://saltline.app',
  status: 'live' as Status,
  sub: 'Age of sail in a browser, with a real sailing model under it.',
  skim: {
    role: 'The sailing model, the renderer, the multiplayer, the accounts.',
    hard: 'Thrust comes off the point of sail, so aim too close to the wind and you stop.',
    proof: 'Live at saltline.app with accounts, up to twenty people to a sea.',
  },
  lead: {
    asset: 'saltline-lead-dawn',
    alt: 'saltline at 06:31: an island silhouetted under a blue dawn sky, three named raiders strung along the horizon, a light path on the water, the sloop under full sail. The Ghostgale status panel and the nav chart sit down the right edge.',
    flag: '06:31 · 14.0 kn · seed 4193',
  },
  spread: {
    n: 'Plate 01 / saltline',
    t: 'Sailing, actually simulated',
    s: '06:31, sea state moderate, wind at forty degrees, seed 4193. Sail full, 14 knots, no heel - all of it read straight off the HUD.',
  },
  prose: [
    'An age-of-sail game you play in a browser. You captain a sloop, trade between islands, and get chased by raiders. The part I care about is the sailing itself: the boat isn’t steered like a car.',
    'The ocean is generated from a seed. Drag the clock below - same seed, same wind, and the water reads completely differently at four in the morning than it does at sunset.',
  ],
  framesLede:
    'One seed at six times of day. Sea state moderate, wind at forty degrees, crest sharpness 0.68, seed 4193, identical in all six. Only the clock moved.',
  /* The cue is what turns a figure into a control. Short, imperative, and it
     names the keyboard as well, because the arrow keys work and nothing on the
     page would otherwise say so. */
  framesCue: 'Drag the clock, or use the arrow keys',
  arcNote:
    'At golden hour the sloop is doing 15 knots through the water but only 2.3 toward the mark; at sunrise it’s 13.6 and 11. Picking the angle is the whole game.',
  proof: {
    t: 'The dev panel, uncropped',
    body: [
      'This is the 16:46 frame, uncropped. The panel on the left is the simulation’s actual inputs: time of day, sea state, wind angle, crest sharpness, seed. New seed, new ocean, same rules.',
    ],
  },
  plate: [
    ['Status', 'Live, with accounts'],
    /* The 20 is read off the server, not off the HUD: a room holds 40 boats and
       the NPC fleet is capped at 20, so 20 hulls are left for people. */
    ['Multiplayer', 'Live, sail together, up to 20 players a sea'],
    ['Model', 'Point of sail sets thrust; thrust and heading set VMG'],
    ['Luffing', 'Point too close to the wind and you stop'],
    ['HUD', 'Relative wind, heel angle, thrust percent, VMG in knots'],
    ['Nav chart', 'Merchant, raider, hunter, elite, derelict, flotsam'],
    ['Persists', 'Cargo hold, hull integrity, account progress'],
    ['Renderer', 'Babylon.js on Fly.io'],
    ['Hardening', "CSP script-src 'self', frame-ancestors 'none', full Permissions-Policy"],
  ] as Array<[string, string]>,
} as const;

/* ── hidamari ────────────────────────────────────────────────────────── */

export const hidamari = {
  name: 'hidamari',
  status: 'wip' as Status,
  sub: 'Ambient app. Japanese for a sunny spot, the pool of light you stand in.',
  skim: {
    role: 'The offline bake, the runtime reprojection, the delivery.',
    hard: 'Photoreal light on hardware that cannot path-trace a frame of it. Cycles bakes offline, the browser reprojects.',
    proof: '116 frames per second live.',
  },
  spread: {
    n: 'Plate 03 / hidamari',
    t: 'Photoreal, because it cheats',
    s: 'One autumn path at golden hour. None of it is lit in the browser - that’s the trick.',
  },
  prose: [
    'A calm ambient app: one autumn canopy path at golden hour, still enough to leave open on a second monitor. It holds 116 frames per second on hardware that could not path-trace a single frame of it.',
    'None of the lighting is computed live. The frames are rendered offline in Blender Cycles and reprojected against a depth pass, so the camera gets real parallax through pre-lit plates - the browser is compositing photographs of a place that doesn’t exist. It’s not public yet; I want the audio right first.',
  ],
  plate: [
    ['Status', 'Not public'],
    ['Lighting', 'Baked offline, Blender Cycles'],
    ['Runtime', 'Depth reprojection, 116 fps'],
    ['Delivery', 'PWA, service worker, AVIF with PNG fallback'],
    ['Audio', 'Layered ambience, LUFS calibrated'],
  ] as Array<[string, string]>,
} as const;

/* ── Elderwood Vale ──────────────────────────────────────────────────── */

export const elderwood = {
  name: 'Elderwood Vale',
  status: 'wip' as Status,
  sub: 'Browser-native tower defense. Playable greybox, and an architecture argument.',
  skim: {
    role: 'The sim core, the renderer, the HUD, and the boundary between them.',
    hard: 'Keeping the simulation away from everything that draws it, with the compiler enforcing that rather than me.',
    proof: 'Playable greybox: placement, waves, enough economy to lose.',
  },
  title: 'A sim core that ignores the browser',
  framesLede: 'Three captures of the same board.',
  framesCue: 'Click a tab, or use the arrow keys',
  prose: [
    'A browser-native tower defense. The part that’s done is the part I care about: the simulation is fully separated from everything that draws it.',
    'The sim can’t touch the DOM, import three.js, read the clock, or call Math.random - and that’s enforced by the compiler and the linter, not by me remembering.',
  ],
  plate: [
    ['Status', 'Playable greybox: placement, waves, enough economy to lose'],
    ['Sim', 'Fixed 1/30 s tick, snapshot interpolation'],
    ['Render', 'three.js, free of the tick rate'],
    ['HUD', 'React, subscribed at 10 Hz'],
    ['Boundary', 'DOM lib removed from tsconfig, ESLint restricted paths'],
  ] as Array<[string, string]>,
  figures: [
    { key: 'default', tab: 'Default', cap: 'Greybox geometry, no art pass.' },
    { key: 'coverage', tab: 'Coverage', cap: 'Placement overlay, showing tower reach.' },
    { key: 'stress', tab: 'Stress', cap: 'Stress burst; the tick rate holds.' },
  ],
} as const;

/* ── Work ────────────────────────────────────────────────────────────── */

export const roles: Role[] = [
  {
    key: 'notable',
    when: 'Aug 2022 - Present',
    now: true,
    title: 'Software Engineer',
    org: 'Notable Health',
    where: 'San Mateo, CA',
    /* Outcome first. The rest of the log is one line a job; this one earns the
       room, so it opens with what the thing carries and then how I got it.

       Public-safe by construction: everything here is on the résumé or is the
       generic shape of the work. No customer is named anywhere in this role,
       and none ever gets to be. */
    body: 'I own the voice and conversations platform at a healthcare AI company: the AI-driven patient calls and the whole stack under them, from the conversation services and workflow APIs down to carrier-facing telephony. It handles around 250,000 patient calls a month at 99% uptime.',
    ev: 'notable.scale',
    statusEv: 'notable.lead',
    bullets: [
      'Own secure patient identity end to end: EHR and FHIR lookup, one-time-code authentication, and the auditable hand-off of a verified caller to a health system’s own call center.',
      'Design the telephony integrations down to the protocol - SIP, Twilio, media, caller-ID, transfer orchestration - and wrote the specification health systems build against to connect their phone systems to ours.',
      'Own reliability and incident response for voice: I lead the debriefs and turn failure modes into platform improvements, including fallback routing that keeps a caller connected when an upstream provider goes dark.',
      'Grew the platform past calls into a broader conversations domain - a phased database split, a BigQuery analytics foundation, multilingual support - and contribute to the healthcare-integration core (HL7, FHIR, insurance data) where it overlaps. Across all of it I’m a technical owner: I write the RFCs and integration guides, review across services, and run go-lives.',
    ],
    /* Where the role stands, and nothing about how long it took to get there.
       Tenure is already on the face of the entry in the dates beside it, so
       saying it again here spent the line's second half on the one fact a
       reader had before they got to it. */
    status: 'Tech lead, mentor, and the primary reviewer for a distributed contractor team.',
    stack:
      'Python · TypeScript · Node.js · React · PostgreSQL · BigQuery · SIP · GCP · Kubernetes · Terraform',
  },
  {
    key: 'harvest',
    when: 'Jul 2021 - Jan 2022',
    title: 'Software Architect and Engineer',
    org: 'Harvest Fintech, Inc.',
    where: 'Remote',
    body: 'First significant engineer on the product. Built the backend and database engineering for a mobile application and architected its microservices.',
    stack: 'Flask · React Native · PostgreSQL',
  },
  {
    key: 'umassDev',
    when: 'Jan 2021 - May 2022',
    title: 'Student Software Developer',
    org: 'UMass Amherst, Physics Department',
    /* "More than 100 classes" came off the old site and no record I can find
       backs it. The 2026 resume says 20+ courses and 1000+ students, so that
       is what this says: a smaller number with something behind it. */
    body: 'Built and maintained the software professors used to acquire and share demonstrations across 20+ courses and 1000+ students. Ported a legacy WordPress site with a JSON backend to an Express, React and PostgreSQL application deployed on site.',
    ev: 'umass.reach',
    stack: 'Express · React · PostgreSQL',
  },
  {
    key: 'arena',
    when: 'Apr 2020 - Sep 2020',
    title: 'Software Engineering Intern',
    org: 'The Arena, Inc.',
    body: 'First engineer at an education non-profit. Built a database and a React site helping students from non-traditional backgrounds find careers and programs.',
    stack: 'React · Google Cloud',
  },
  {
    key: 'umassRes',
    when: 'Oct 2019 - Oct 2020',
    title: 'Research Assistant',
    org: 'UMass Amherst, Physics Department',
    body: 'Simulated fluid dynamics for CO2 cooling in particle physics detectors.',
    stack: 'Python (numpy, scipy, pandas, matplotlib) · MATLAB',
  },
  {
    key: 'gotit',
    when: 'Jun 2019 - Aug 2019',
    title: 'Software Engineering and AI Intern',
    org: 'Got It.AI',
    body: 'Built the ExcelChat Chrome extension, and a microservice automating dataflow through Got It Study while holding problem volume steady. Helped serve the QueryChat AI demo.',
    stack: 'Python · JavaScript · Chrome extensions',
  },
  {
    key: 'youweb',
    when: 'Summer 2018',
    title: 'Software Engineering Intern',
    org: 'YouWeb, Inc.',
    body: 'Led a marketing campaign for a YouWeb project and built its campaign website and web application.',
    stack: 'JavaScript · Node.js',
  },
  {
    key: 'baaqmd',
    when: 'Summer 2017',
    title: 'Air Quality Scientist and Data Analytics Intern',
    org: 'Bay Area Air Quality Management District',
    body: 'Built, tested and calibrated low-cost air pollution monitors, and built the cloud networking interface for viewing their data from anywhere. Secured a $3,000 grant for Los Altos High School to bring monitor building into its APES curriculum.',
    stack: 'C · Python · Cloud data pipeline',
  },
];

/**
 * What the job is this month.
 *
 * Two threads of current work, and they are signed off one at a time rather
 * than together. Both characterise things that have not shipped, at a company
 * he still works for, so the wording is not his employer's to be surprised by
 * and not mine to choose. `approved` flips only on an explicit sign-off on
 * that exact sentence, and until it does the page does not render the line at
 * all. Nothing here names a customer, and nothing here ever will.
 */
export const notableLately: { approved: boolean; text: string } = {
  approved: true,
  text: 'Lately I’ve been making those conversations testable, so a builder can trust a flow before it ever takes a real call.',
};

/**
 * The second thread, still held.
 *
 * Same gate, its own boolean, kept next to the first so approving it is one
 * word and no rebuild. The wording has not been signed off, so it stays as
 * written rather than being tidied into something nobody agreed to.
 */
export const notableBrowser: { approved: boolean; text: string } = {
  approved: false,
  text: 'And teaching our software to use the systems that only have a screen instead of an API, with a person stepping in for the moments that need one.',
};

/* ── Playground ──────────────────────────────────────────────────────── */

export const playground = {
  /* The archive count used to be the headline: twenty-five opened, twelve
     kept. It is a true number and it is still on the 404 page, where the
     audit that produced it lives. It is the wrong headline here, because what
     this section is actually for is the length of the habit. The first commit
     in this repository is dated 10 February 2015, so eleven years is a fact
     git will hand back to anyone who asks it. */
  statement: 'Eleven years of this, and the oldest ones still run.',
  prose: ['Here are three of the oldest, running in the page. Go ahead.'],
  items: [
    {
      yr: 'c. 2019',
      name: 'AutoTyper',
      href: '/demos/AutoTyper/index.html',
      status: 'live' as Status,
      statusLabel: 'Runs',
      what: 'Types a block of text into a field, character by character, at a rate you choose.',
      k: 'Vanilla JS',
    },
    {
      yr: 'c. 2015',
      name: 'deviation.html',
      href: '/deviation.html',
      status: 'live' as Status,
      statusLabel: 'Runs',
      what: 'Give it a mean, a spread and a sample size for two distributions and it samples both and overlays the histograms. Homework that turned into a small tool and then stayed.',
      k: 'Vanilla JS · Chart.js 1.0.2',
    },
    {
      yr: 'c. 2015',
      name: 'GrinchJump',
      href: '/grinchjump.html',
      status: 'live' as Status,
      statusLabel: 'Repaired',
      what: 'Doodle Jump in three dimensions, built while I was learning three.js. Its keyboard library vanished along with a CDN, so the dependencies now live in the repo.',
      k: 'three.js r70 · vendored deps',
    },
  ],
} as const;

/**
 * The one thing in this section that was a product rather than an exercise,
 * and the only one with nothing left to open.
 *
 * It gets a block instead of a row in the list below for two reasons. A row
 * cannot show a day and a night of the same screen, and the theme was most of
 * the work. And the five captures are all that is left of it: the host is
 * gone, there is no link, and a list row would be the whole of the record.
 *
 * Every date and time in the copy is read off the captures themselves. The
 * two dashboards were taken in one session, one toggle apart, which is why
 * the clock in both of them says 5:16.
 *
 * The second pair carries a classmate's real name and five real messages.
 * They are published because she said yes, not because they were in the
 * folder. If that ever changes, both frames come out and the caption with
 * them.
 */
export const rendezvous = {
  key: 'rendezvous' as PlaceKey,
  name: 'Rendezvous',
  yr: 'c. 2020',
  what: 'A central place for UMass students to find each other through the classes they were taking. Everyone’s assignments in one calendar, a chat per lecture, and, that year, a Zoom link where the room number used to be.',
  k: 'React · Redux · Flask · PostgreSQL · GCP',
  lead: {
    asset: 'rendezvous-dashboard',
    alt: 'The Rendezvous dashboard in its dark theme: four courses listed down a sidebar, a month of colour-coded assignment bars across a calendar, and a right-hand column of the day’s lectures, each with a Zoom button.',
    cap: 'The dashboard. Term’s classes down the left, every assignment in one calendar, the day’s lectures on the right.',
  },
  /* Named light and dark rather than day and night: the toggle in the corner
     of the capture is a sun and a moon, and the labels should say what the
     control says.

     Two pairs, because they answer different questions. The first is the
     theme, which was most of the work. The second is the thing the whole
     product was for, and it needs both themes for the same reason the first
     one does: a single frame of a chat panel is a screenshot of a chat panel,
     and the pair is the evidence that it was one screen. */
  pairs: [
    {
      cap: 'The same screen at the same second, one toggle apart. Thursday 14 October 2021, 5:16 in the afternoon, both times.',
      shots: [
        {
          asset: 'rendezvous-day',
          label: 'Light',
          alt: 'The same dashboard in its light theme, week view: five courses in the sidebar, a week of assignment bars, and two lectures on the right with their times.',
        },
        {
          asset: 'rendezvous-night',
          label: 'Dark',
          alt: 'The identical view in the dark theme, the same courses and the same two lectures, changed only in colour.',
        },
      ],
    },
    {
      cap: 'One course, with its lecture chat open: the room the class talked in, the two problem sets due out of it, and the seed message every new room opens with. Same screen, one toggle apart, again.',
      shots: [
        {
          asset: 'rendezvous-chat-day',
          label: 'Light',
          alt: 'The Physics 568 course page in its light theme: two problem sets with released and due dates in a table, and a docked Official Lecture Chat panel on the right carrying five messages between two students.',
        },
        {
          asset: 'rendezvous-chat-night',
          label: 'Dark',
          alt: 'The identical course page and the identical chat in the dark theme, the same two problem sets and the same five messages, changed only in colour.',
        },
      ],
    },
  ],
} as const;

export const earlier = [
  {
    key: 'pickle',
    name: 'PICKLE',
    yr: 'High school',
    what: 'Designed, built and calibrated low-cost air pollution monitors to make the problem visible. Hardware, firmware, cloud and data science in one project, with Sonoma Technology, BAAQMD and Manylabs.',
    k: 'C · Python · R · Time-series storage',
  },
] as const;

/* ── Skills ──────────────────────────────────────────────────────────── */

export const skills = [
  { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C'] },
  { group: 'Frontend', items: ['React', 'Redux', 'three.js / WebGL', 'HTML / CSS', 'PWAs'] },
  {
    group: 'Backend',
    items: [
      'Node.js',
      'Flask',
      'Express',
      'PostgreSQL',
      'BigQuery',
      'Socket.io',
      /* Telephony sits with the other real-time transports rather than with the
         hosted platforms: what he owns is the call routing, not the account. */
      'Twilio / SIP',
      'Temporal',
      'Microservices',
    ],
  },
  {
    group: 'Infrastructure',
    items: ['GCP', 'Kubernetes', 'Terraform', 'Fly.io', 'AWS', 'Linux', 'CI/CD'],
  },
  {
    group: 'Data and scientific',
    items: ['numpy', 'scipy', 'pandas', 'matplotlib', 'MATLAB', 'Machine learning'],
  },
] as const;

/**
 * The evidence index: for each skill, the places on this page that show it.
 *
 * One rule decides every entry. A place counts only if the reader can confirm
 * it without taking my word for anything - a stack line under a job, a row in
 * a project's technical notes, or a demo that runs a few sections up. Adjacent
 * is not evidence: Ember Wilds is live multiplayer and names no transport, so
 * Socket.io does not get to claim it.
 *
 * Four skills have nothing that clears that bar. They are on the resume and
 * they stay in the list, with an empty array, and the page says so rather than
 * borrowing something that nearly fits. Every skill needs a key here, so a
 * genuine blank can never be confused with one that was forgotten - the page
 * fails the build if one goes missing.
 */
export const evidence = {
  Python: ['notable', 'umassRes', 'gotit', 'baaqmd', 'pickle'],
  /* Elderwood Vale's technical notes name the tsconfig its boundary is cut
     out of, which is the compiler doing the enforcing the prose describes. */
  TypeScript: ['notable', 'elderwood'],
  JavaScript: ['gotit', 'youweb', 'autotyper', 'deviation'],
  /* Nowhere on the page says "SQL". Four places say PostgreSQL and one says
     BigQuery, which is the same claim in the vocabulary each of them uses. */
  SQL: ['notable', 'harvest', 'umassDev', 'rendezvous'],
  C: ['baaqmd', 'pickle'],

  React: ['elderwood', 'notable', 'harvest', 'umassDev', 'arena', 'rendezvous'],
  Redux: ['rendezvous'],
  /* saltline's renderer is Babylon.js, which is WebGL - a fact about the
     library, not a claim about the work, and the notes name the library. */
  'three.js / WebGL': ['saltline', 'elderwood', 'grinch'],
  /* The three demos are hand-written HTML files still served at their own
     URLs. Every other project is a browser app that never says so. */
  'HTML / CSS': ['autotyper', 'deviation', 'grinch'],
  PWAs: ['hidamari'],

  'Node.js': ['notable', 'youweb'],
  Flask: ['harvest', 'rendezvous'],
  Express: ['umassDev'],
  PostgreSQL: ['notable', 'harvest', 'umassDev', 'rendezvous'],
  BigQuery: ['notable'],
  'Socket.io': [],
  'Twilio / SIP': ['notable'],
  Temporal: [],
  /* Both of these say the word in their own description of the job. */
  Microservices: ['harvest', 'gotit'],

  GCP: ['notable', 'arena', 'rendezvous'],
  Kubernetes: ['notable'],
  Terraform: ['notable'],
  'Fly.io': ['saltline', 'ember'],
  AWS: [],
  Linux: [],
  /* "Deploy tooling", in the first bullet of the current role. */
  'CI/CD': ['notable'],

  numpy: ['umassRes'],
  scipy: ['umassRes'],
  pandas: ['umassRes'],
  matplotlib: ['umassRes'],
  MATLAB: ['umassRes'],
  'Machine learning': ['notable', 'gotit', 'courses'],
} as const satisfies Record<string, readonly PlaceKey[]>;

/* ── Education ───────────────────────────────────────────────────────── */

export interface Course {
  /** Department, shown in the middle column. */
  d: string;
  t: string;
  /** Trailing qualifier, italicised after the title. */
  i?: string;
}

export const courses: Course[] = [
  { d: 'CS', t: 'Machine Learning' },
  { d: 'CS', t: 'Neural Networks' },
  { d: 'CS', t: 'Algorithms' },
  { d: 'CS', t: 'Computer Networking' },
  { d: 'Phys', t: 'General Relativity' },
  { d: 'Phys', t: 'Quantum Mechanics' },
  { d: 'Phys', t: 'Computational Physics' },
  { d: 'Ind.', t: 'Cosmology and Consciousness', i: 'independent study' },
];

export const education = {
  school: 'University of Massachusetts Amherst',
  when: '2018 - 2022',
  degrees: [
    {
      h: 'B.S. Computer Science',
      p: 'Dean’s List. Student software developer for the Physics Department.',
    },
    {
      h: 'B.S. Astrophysics',
      p: 'Dean’s List. Honors thesis. Research assistant in the Physics Department.',
    },
  ],
  note: 'Both degrees at once, in four years.',
} as const;
