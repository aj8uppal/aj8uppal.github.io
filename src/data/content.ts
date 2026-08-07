/**
 * Every fact on the page comes from here, and everything here is verified.
 * Nothing is invented: dates and titles are from the 2026 resume, project
 * detail is from the projects themselves, and the saltline readouts are
 * transcribed off the captures in src/assets.
 */

export type Status = 'live' | 'wip' | 'off';

export interface Role {
  when: string;
  now?: boolean;
  title: string;
  org: string;
  where?: string;
  body?: string;
  bullets?: string[];
  stack?: string;
  pending?: { note: string };
  ref?: string;
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
    desc: 'Twenty-five opened, twelve kept',
    count: '3 playable',
  },
  { n: '05', id: 'skills', name: 'Skills', desc: 'Grouped, unrated', count: '5 groups' },
  { n: '06', id: 'contact', name: 'Contact', desc: 'Email is the reliable one', count: '4 links' },
] as const;

export const cover = {
  kicker: ['Bay Area, California', 'Software engineer at Notable Health'],
  /* The hero used to open on the two degrees, which is the same story About
     opens on, told slightly worse. It says what he does now instead, and the
     degrees keep their one telling in `about.prose[0]`. Both lines are drawn
     from what the page already publishes: the Notable role names the voice
     platform and its production numbers, and the four projects below are the
     worlds, the renderer and the sailing model. */
  lead: 'I build production AI systems, and improbable things that run in a browser.',
  support:
    'At Notable I work on voice infrastructure. Outside work it’s multiplayer worlds, renderers, sailing models, and small things you can open and play with.',
  second:
    'Right now that’s four projects: a sailing game that runs a real sailing model, a voxel MMORPG that holds up to 64 people in a realm, a rendering experiment that fakes sunlight by refusing to compute it, and a tower defense with a deterministic sim core. Two are live today. Two aren’t finished yet.',
  strip: [
    { dt: 'Place', dd: 'Bay Area', sub: 'California' },
    { dt: 'Work', dd: 'Software engineer', sub: 'Notable Health, since Aug 2022' },
    { dt: 'Studied', dd: 'B.S. Computer Science', sub: 'B.S. Astrophysics' },
    { dt: 'Building', dd: 'Four things', sub: 'two live, two not yet' },
  ],
} as const;

export const about = {
  statement: 'I learn things by building them.',
  prose: [
    'I did two degrees at once, computer science and astrophysics, because I couldn’t choose between them. Some weeks that meant Algorithms and General Relativity in the same problem-set pile.',
    'In college I simulated CO2 cooling for particle detectors. Now I simulate oceans for a sailing game. It’s more or less the same job: pick a model, pick a timestep, and know what you’re leaving out.',
  ],
  notes: [
    ['Off the clock', 'Heirloom tomatoes, bikes, and Pink Floyd, roughly in that order.'],
    ['Long held', 'Wanted to be an astronaut since I was four. Still would.'],
    ['Will debate', 'Python is the best language. I’ve heard the counterarguments.'],
    ['Best class', 'Cosmology and Consciousness. An independent study, and I had to ask for it.'],
  ] as Array<[string, string]>,
  method:
    'Every screenshot on this page is a real capture of the project it belongs to. Nothing is mocked up.',
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
      ['Drop', 'Grave-Iron Blade'],
    ],
    note: 'A fallen colonnade of Emberhold, garlanded in herb and briar. Something in the Ashen Waste’s livery haunts it now, and it left a blade behind.',
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
  spread: {
    n: 'Plate 02 / Ember Wilds',
    t: 'A voxel MMORPG, shipped',
    s: 'Fallowmere at dusk, level 30, nine thousand fame in. World state, quests and loot all live on the realm server - the browser just renders it.',
  },
  prose: [
    'A voxel MMORPG that runs in a browser tab. I designed it, built it, and put it in production on Fly.io, where a web tier and a separate realm service keep one world consistent for everyone in it.',
    'It’s the most complete thing I’ve built. A stranger can open a tab right now, make a character, and run into other people.',
  ],
  framesLede: 'Seven regions, one level-30 character. Click the tabs or use the arrow keys.',
  proof: {
    t: 'One realm, up to 64 players',
    body: [
      'This frame is two of us in the same Hearthvale from two browsers, and a realm holds up to 64 at once. Everyone in it is simulated by the same server, which was the hard part.',
      'If I could only show one screenshot from four years of side projects, it’d be this one.',
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
  arcNote:
    'At golden hour the sloop is doing 15 knots through the water but only 2.3 toward the mark; at sunrise it’s 13.6 and 11. Picking the angle is the whole game.',
  proof: {
    t: 'The dev panel, left in on purpose',
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
  title: 'A sim core that ignores the browser',
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
    when: 'Aug 2022 - Present',
    now: true,
    title: 'Software Engineer',
    org: 'Notable Health',
    where: 'San Mateo, CA',
    body: 'Healthcare AI platform with 100+ enterprise customers. I build the integration layer: FHIR, HL7, Epic, Oracle, and the internal APIs that connect dozens of EHR systems for scheduling and patient workflows.',
    bullets: [
      'Led the 0-to-1 platform work for AI voice assistants that now handle 250,000 calls a month in production: agent orchestration, state management, deploy tooling, and the reliability work that took uptime to 99%.',
      'Own inbound voice authentication end to end - call routing, SIP, transfer logic, and HIPAA-compliant caller verification across 5+ health systems.',
      'Built the configuration UIs that turned customer-specific engineering into product configuration; new-customer launches went from weeks to days.',
      'Tech lead on cross-functional projects, and I mentor junior and mid-level engineers.',
    ],
    stack:
      'Python · TypeScript · Node.js · React · PostgreSQL · BigQuery · GCP · Kubernetes · Terraform',
  },
  {
    when: 'Jul 2021 - Jan 2022',
    title: 'Software Architect and Engineer',
    org: 'Harvest Fintech, Inc.',
    where: 'Remote',
    body: 'First significant engineer on the product. Built the backend and database engineering for a mobile application and architected its microservices.',
    stack: 'Flask · React Native · PostgreSQL',
  },
  {
    when: 'Jan 2021 - May 2022',
    title: 'Student Software Developer',
    org: 'UMass Amherst, Physics Department',
    body: 'Built and maintained the software professors used to acquire and share demonstrations across more than 100 classes. Ported a legacy WordPress site with a JSON backend to an Express, React and PostgreSQL application deployed on site.',
    stack: 'Express · React · PostgreSQL',
  },
  {
    when: 'Apr 2020 - Sep 2020',
    title: 'Software Engineering Intern',
    org: 'The Arena, Inc.',
    body: 'First engineer at an education non-profit. Built a database and a React site helping students from non-traditional backgrounds find careers and programs.',
    stack: 'React · Google Cloud',
  },
  {
    when: 'Oct 2019 - Oct 2020',
    title: 'Research Assistant',
    org: 'UMass Amherst, Physics Department',
    body: 'Simulated fluid dynamics for CO2 cooling in particle physics detectors.',
    stack: 'Python (numpy, scipy, pandas, matplotlib) · MATLAB',
  },
  {
    when: 'Jun 2019 - Aug 2019',
    title: 'Software Engineering and AI Intern',
    org: 'Got It.AI',
    body: 'Built the ExcelChat Chrome extension, and a microservice automating dataflow through Got It Study while holding problem volume steady. Helped serve the QueryChat AI demo.',
    stack: 'Python · JavaScript · Chrome extensions',
  },
  {
    when: 'Summer',
    title: 'Air Quality Scientist and Data Analytics Intern',
    org: 'Bay Area Air Quality Management District',
    ref: 'a',
    body: 'Built, tested and calibrated low-cost air pollution monitors, and built the cloud networking interface for viewing their data from anywhere. Secured a $3,000 grant for Los Altos High School to bring monitor building into its APES curriculum.',
    stack: 'C · Python · Cloud data pipeline',
  },
  {
    when: 'Summer 2018',
    title: 'Software Engineering Intern',
    org: 'YouWeb, Inc.',
    body: 'Led a marketing campaign for a YouWeb project and built its campaign website and web application.',
    stack: 'JavaScript · Node.js',
  },
];

export const errata = [
  {
    ref: 'a',
    text: 'My old site dates this internship Summer 2017 and my 2024 resume says June to August 2019, which collides with the Got It internship. Until I dig up the truth, the year stays off.',
  },
] as const;

/* ── Playground ──────────────────────────────────────────────────────── */

export const playground = {
  statement: 'I opened all twenty-five and kept the twelve that still run.',
  prose: ['Three of them run right here. Go ahead.'],
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
  method:
    'Three were deleted outright; the rest still live at their old URLs, just not linked here. Dates marked c. are from git, not memory.',
} as const;

export const earlier = [
  {
    name: 'PICKLE',
    yr: 'High school',
    what: 'Designed, built and calibrated low-cost air pollution monitors to make the problem visible. Hardware, firmware, cloud and data science in one project, with Sonoma Technology, BAAQMD and Manylabs.',
    k: 'C · Python · R · Time-series storage',
  },
  {
    name: 'Rendezvous',
    yr: 'c. 2020',
    what: 'A central place for UMass students to find each other through the classes they were taking. The host is gone, so there is no link.',
    k: 'React · Redux · Flask · PostgreSQL · GCP',
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
  method:
    'The old version of this page listed 37 courses, every one of them a link, and every link had died. These are the eight that mattered.',
} as const;
