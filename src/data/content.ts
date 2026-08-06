/**
 * Every fact on the page comes from here, and everything here is verified.
 * Nothing is invented: dates and titles are from the 2024 resume, project
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
  resume: '/attachments/resume2024.pdf',
} as const;

export const sections = [
  { n: '01', id: 'about', name: 'About', desc: 'Two degrees, one habit', count: '4 notes' },
  {
    n: '02',
    id: 'building',
    name: 'Building',
    desc: 'Four projects, in various states of done',
    count: '4 entries',
  },
  { n: '03', id: 'work', name: 'Work', desc: 'Eight jobs, reverse order', count: '8 rows' },
  {
    n: '04',
    id: 'playground',
    name: 'Playground',
    desc: 'An archive. About half of it stopped running',
    count: '3 playable',
  },
  { n: '05', id: 'skills', name: 'Skills', desc: 'Grouped, unrated', count: '5 groups' },
  {
    n: '06',
    id: 'education',
    name: 'Education',
    desc: 'UMass Amherst, two B.S.',
    count: '8 courses',
  },
  { n: '07', id: 'contact', name: 'Contact', desc: 'Email is the reliable one', count: '4 links' },
] as const;

export const cover = {
  kicker: ['San Mateo, California', 'Software engineer at Notable Health'],
  lead: 'I studied computer science and astrophysics at the same time because I could not pick one, and I have been building things that run in a browser ever since.',
  second:
    'Right now that means four projects: a voxel MMORPG with real multiplayer, a sailing game that runs an actual sailing model, a rendering experiment that fakes sunlight by refusing to compute it, and a tower defense whose simulation core cannot see the DOM. Two of them you can play today. Two are not finished, and this page says so.',
  strip: [
    { dt: 'Place', dd: 'San Mateo', sub: 'California' },
    { dt: 'Work', dd: 'Software engineer', sub: 'Notable Health, since Aug 2022' },
    { dt: 'Studied', dd: 'B.S. Computer Science', sub: 'B.S. Astrophysics' },
    { dt: 'Building', dd: 'Four things', sub: 'two live, two not yet' },
  ],
} as const;

export const about = {
  statement: 'Most of what I know, I learned by building the thing badly first.',
  prose: [
    'I have wanted to be an astronaut since I was four. That has not happened, but it decided what I studied. I took two bachelor’s degrees at UMass Amherst at the same time, computer science and astrophysics, which meant a schedule where Algorithms and General Relativity landed in the same week. The best class I took was an independent study I had to petition for, called Cosmology and Consciousness.',
    'The two halves never really separated. Simulating CO2 cooling for a particle detector and simulating an ocean for a sailing game turn out to be the same problem wearing different clothes: pick a model, pick a timestep, and be honest about what you left out. I am a maker before I am anything else, and the range is the point. I have written firmware in C for low-cost air pollution monitors and shipped a multiplayer voxel MMORPG to production in the same decade.',
  ],
  notes: [
    ['Off the clock', 'Heirloom tomatoes, bikes, and Pink Floyd, roughly in that order.'],
    ['Long held', 'Wanted to be an astronaut since I was four. Still would.'],
    [
      'Will debate',
      'Python is the best language. I have heard the counterarguments and I remain unmoved.',
    ],
    ['Best class', 'Cosmology and Consciousness. An independent study, and I had to ask for it.'],
  ] as Array<[string, string]>,
  method:
    'This page is a static Astro build. Every screenshot is a capture of the actual project, at the resolution it actually runs. Where something is unfinished it says so, and where a link would be dead there is no link.',
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
    note: 'Nova, mid-detonation, 684 damage on the creature it caught. The ring is a real area effect resolved on the realm, not a particle flourish.',
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
    n: 'Plate 01 / Ember Wilds',
    t: 'A voxel MMORPG, shipped',
    s: 'Fallowmere at dusk, level thirty, nine thousand fame in. The world state, the quest chain and the loot all live on a realm service. The browser is only a client.',
  },
  prose: [
    'Ember Wilds is a voxel MMORPG that runs in a browser tab. I designed it, built it, and put it in production on Fly.io, where a web tier and a separate realm service keep one world consistent for everyone in it. There is nothing to install. You open a URL and you are standing in the Hearthvale at level one with no idea what a Web Matron is.',
    'The world is seven named regions that get harder as you travel outward: the Hearthvale, Fallowmere, the Greenmarch, the Fenmarch, the Ashen Waste, the Greywall Peaks and the Black Plateau. Classes unlock through beast lore and study rather than a skill tree, there is a satchel and a fame economy and tiered gear, and the quest chain ends somewhere I am not going to spoil here.',
    'This is the strongest single thing I have built, and the reason is not the rendering. It is that a stranger can open it right now and play it with someone else.',
  ],
  framesLede:
    'Seven regions, all captured on one character at level thirty. Use the tabs, or arrow keys once a tab has focus.',
  proof: {
    t: 'Two clients, one world',
    body: [
      'Two browsers, two accounts, one Hearthvale. The speech bubbles are over the players’ heads and the same lines are in the log at bottom left. Both characters are being simulated by the same realm service, which is the part that was hard.',
      'If I only got to show one frame from four years of side projects, it would be this one.',
    ],
  },
  plate: [
    ['Status', 'Live'],
    ['Host', 'Fly.io'],
    ['Shape', 'Web tier plus realm service'],
    ['Client', 'Browser, no install'],
    ['Regions', 'Seven'],
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
  spread: {
    n: 'Plate 02 / saltline',
    t: 'Sailing, actually simulated',
    s: '04:36, sea state moderate, wind at forty degrees, seed 4193. Sail full, 14.4 knots, no heel. Every number in that sentence is a readout, not set dressing.',
  },
  prose: [
    'saltline is an age-of-sail game you play in a browser. You captain a sloop, you trade, you get chased by raiders, and none of that is the interesting part. The interesting part is that the boat is not steered like a car.',
    'It runs a real sailing model. Your point of sail sets thrust, thrust and heading set velocity made good, and if you point too close to the wind you luff and stop. The HUD tells you the truth about all of it: relative wind, heel angle, thrust as a percentage, and VMG in knots with an arrow for whether you are gaining on the mark or losing to it. There is a live nav chart that classifies contacts as merchant, raider, hunter, elite, derelict or flotsam, a nearby-vessels list with ranges, a cargo hold, hull integrity, and an account that remembers all of it.',
    'The ocean underneath all of that is generated, not painted. The six frames below are one seed at six times of day, which is the fastest way I know to show it: the same water, under light that far apart, does not look like the same water at all.',
  ],
  framesLede:
    'Sea state moderate, wind at forty degrees, crest sharpness 0.68, seed 4193. Identical in all six, and in clock order. Only the time changed.',
  arcNote:
    'The readouts are worth the same look. The two sunrise frames are twenty-nine minutes apart and sailing almost identically: 145 and 143 degrees off the bow, 84 and 85 percent thrust, 11.0 and 11.1 knots made good. At golden hour and sunset I am faster through the water than in either of them, 15.0 and 15.8 knots on 96 and 97 percent thrust, and making 2.3 and 2.1 knots toward the mark. Speed is not progress, and choosing between the two is the game.',
  proof: {
    t: 'The panel is in this frame on purpose',
    body: [
      'That column down the left edge is the development panel, and this is the 16:46 frame again with nothing cropped off it. The panel is gone from the six above because a picture of the ocean should be a picture of the ocean. It is here because it is the argument: time of day, sea state, wind angle, crest sharpness and seed are inputs to a simulation, not a menu of pretty presets. Change the seed and you get a different ocean running the same rules.',
      'It is also where the clock on each frame above comes from. Everything else here is the game: three raiders closing, a chart classifying them, and a rudder fifteen percent to starboard.',
    ],
  },
  plate: [
    ['Status', 'Live'],
    ['Accounts', 'Yes, with saved progress'],
    ['Renderer', 'Babylon.js'],
    ['Host', 'Fly.io'],
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
    t: 'Photoreal by cheating on purpose',
    s: 'One autumn path at golden hour. Nothing in this frame is being lit in your browser, and that is the entire technique.',
  },
  prose: [
    'hidamari is a calm ambient app: one autumn canopy path at golden hour, still enough to leave open on a second monitor and alive enough that you keep noticing it move. It holds 116 frames per second on hardware that could not path-trace a single frame of it.',
    'It gets there by not solving the lighting at all. The plates are rendered offline in Blender Cycles, where a frame is allowed to take as long as it needs, and then reprojected in the browser against a depth pass so the camera can move through them with real parallax. The browser is compositing photographs of a place that does not exist.',
    'The rest is delivery. Frames ship as AVIF with a PNG fallback, the whole thing installs as a PWA behind a service worker, and the ambience is layered and calibrated to LUFS rather than mixed by ear. It is not public yet. I want the audio right first.',
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
    'Elderwood Vale is a browser-native tower defense and it is not finished. What is finished is the part I actually care about: the simulation is held strictly apart from everything that draws it.',
    'Strictly apart means what it says. The sim cannot touch the DOM, cannot import three.js, cannot read the wall clock, and cannot call Math.random. Those are not conventions I try to remember. The tsconfig for that module has the DOM library removed, so document does not typecheck, and ESLint has no-restricted-paths and no-restricted-properties pointed at everything else. The boundary holds because crossing it does not compile.',
    'Inside the boundary it runs fixed ticks of one thirtieth of a second and publishes snapshots. three.js interpolates between them, so the render rate is free of the tick rate. The React HUD subscribes at 10Hz, because a health bar does not need thirty updates a second and React should not be asked for them.',
    'Today it is a playable greybox: placement, waves, and enough economy to lose. The README still describes it as an architectural foundation, which undersells it, and I have not gotten around to fixing that either.',
  ],
  plate: [
    ['Status', 'Playable greybox, not public'],
    ['Sim', 'Fixed 1/30 s tick, snapshot interpolation'],
    ['Render', 'three.js, interpolated'],
    ['HUD', 'React, 10 Hz publication'],
    ['Boundary', 'tsconfig lib restriction plus ESLint restricted paths'],
  ] as Array<[string, string]>,
  figures: [
    { key: 'default', cap: 'Default board. Greybox geometry, no art pass.' },
    { key: 'coverage', cap: 'Placement coverage overlay, showing tower reach.' },
    { key: 'stress', cap: 'Stress burst. The tick rate does not move.' },
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
    body: 'Healthcare AI platform. I work across integrations, which means controlling how data moves in and out of the system. Architected and deployed services managing data flow between the platform and electronic health record systems, and streamlined the EHR integration process.',
    pending: {
      note: 'Four years belongs in more than three lines, and writing it properly is on my list. I would rather leave the slot marked than fill it with something vague about impact.',
    },
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
    text: 'The BAAQMD internship is dated Summer 2017 on my old site and June to August 2019 on my 2024 resume, and the second collides with the Got It.AI internship in the same months. I have not reconciled my own records, so the year is left off rather than guessed.',
  },
] as const;

/* ── Playground ──────────────────────────────────────────────────────── */

export const playground = {
  statement: 'An archive. About half of it stopped running.',
  prose: [
    'There are twenty-five old demos in this repository, written mostly between 2015 and 2019. I opened every one. Ten were broken, and three more only appear to work, which is the worse failure: a sliding puzzle whose solver silently does nothing, a Connect 4 that locks after exactly one move, a planet viewer that labels Mercury as Earth. One more opened an unending chain of prompt dialogs and trapped the tab, and that one is deleted rather than merely unlinked.',
    'The rest of the breakage is boring in an instructive way: plain-HTTP script tags that an HTTPS page now blocks, EC2 backends I stopped paying for, CDN hosts that stopped resolving. Eleven still ran, and GrinchJump made twelve once I vendored the keyboard library its CDN had stopped serving. Most of the twelve are forty-line toys, so three are below: the two worth keeping and the one that needed the repair. They are here because they are true, not because they are good.',
  ],
  items: [
    {
      yr: '2019',
      name: 'AutoTyper',
      href: '/demos/AutoTyper/index.html',
      status: 'live' as Status,
      statusLabel: 'Runs',
      what: 'Types a block of text into a field at a rate you choose, character by character. The most genuinely useful thing on this list.',
      k: 'Vanilla JS',
    },
    {
      yr: '2015',
      name: 'deviation.html',
      href: '/deviation.html',
      status: 'live' as Status,
      statusLabel: 'Runs',
      what: 'Enter a set of points, get the standard deviation plotted. Homework that turned into a small tool and then stayed.',
      k: 'Vanilla JS · Canvas',
    },
    {
      yr: '2015',
      name: 'GrinchJump',
      href: '/grinchjump.html',
      status: 'live' as Status,
      statusLabel: 'Repaired',
      what: 'Doodle Jump in three dimensions, built when I was learning three.js. It died when the CDN hosting its keyboard library stopped resolving; the library is vendored into the repository now, so it cannot die that way again.',
      k: 'three.js r70 · vendored deps',
    },
  ],
  method:
    'Three are deleted outright rather than merely unpublished. The rest are still in the repository and still served at their original URLs; they are just not linked from here, because a dead demo on a portfolio is worse than no demo.',
} as const;

export const earlier = [
  {
    name: 'PICKLE',
    yr: 'High school',
    what: 'Designed, built and calibrated low-cost air pollution monitors to make the problem visible. Particle Photon and Electron microcontrollers in C, Python and R for analysis, TempoDB and AT&T M2X for time series, plot.ly for the charts. Hardware, firmware, cloud and data science in one project, in collaboration with Sonoma Technology, BAAQMD and Manylabs.',
    k: 'C · Python · R · Time-series storage',
  },
  {
    name: 'Rendezvous',
    yr: '2020',
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
    items: ['Node.js', 'Flask', 'Express', 'PostgreSQL', 'BigQuery', 'Socket.io', 'Microservices'],
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
  note: 'Both at once, on one four-year clock. It is the single fact about me that is hardest to fake and easiest to explain.',
  method:
    'This used to be a list of 37 courses, every one of them a link. All 37 links are dead. Eight, unlinked, is more useful than 37 that go nowhere.',
} as const;
