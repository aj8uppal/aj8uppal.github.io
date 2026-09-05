/** Shared contract for the four round-two directions.
 *
 * Keep this file deliberately boring: candidate modules can depend on these
 * records without each inventing another version of AJ's story or URL rules.
 */
import {
  contact,
  about,
  roles,
  saltline,
  saltlineArc,
  murmuration,
  ember,
  emberRegions,
  hidamari,
  elderwood,
  blockhold,
  cubit,
} from '../../src/data/content.ts';
import { apps } from '../../src/data/built.ts';

export { contact, about, roles };

export const esc = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const url = (href) => new URL(href, 'https://aj8uppal.github.io').href;
export const asset = (key) => `../../src/assets/${key}.webp`;
export const img = (key, alt, attrs = '') =>
  key ? `<img src="${asset(key)}" alt="${esc(alt)}" ${attrs}>` : '';
export const out = (href, label, cls = '') =>
  href
    ? `<a class="${esc(cls)}" href="${esc(url(href))}" target="_blank" rel="noopener">${esc(label)} <span aria-hidden="true">↗</span></a>`
    : '';
export const email = (label = 'Email', cls = '') =>
  `<a class="${esc(cls)}" href="mailto:${esc(contact.email)}">${esc(label)} <span aria-hidden="true">↗</span></a>`;

const projectRecords = [
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
      'The platform runs at 99% uptime; the integration specification has driven more than $1M in ARR and verification spans 5+ health systems.',
    href: null,
    stack:
      'Python · TypeScript · Node.js · React · PostgreSQL · BigQuery · SIP · GCP · Kubernetes · Terraform',
    question:
      'How do you make a patient conversation dependable across systems you do not control?',
    frames: [],
  },
  {
    key: 'saltline',
    name: saltline.name,
    status: saltline.status,
    kind: 'Simulation / multiplayer',
    image: saltline.lead.asset,
    alt: saltline.lead.alt,
    summary: saltline.sub,
    role: 'The sailing model, renderer, multiplayer and account persistence.',
    constraint:
      'Thrust depends on point of sail: the boat must feel like a boat, while a shared sea keeps each player’s state consistent.',
    decision:
      'Use point-of-sail thrust and heading to derive VMG, then expose relative wind, heel, thrust and VMG in the HUD so the rule can be learned rather than guessed.',
    evidence:
      'Live at saltline.app with accounts and up to 20 players per sea; six recorded frames hold seed 4193 and wind settings constant.',
    href: saltline.href,
    stack: 'Babylon.js · Colyseus · WebSocket · Fly.io',
    question: 'What makes an ocean feel alive?',
    proofFrames: [
      {
        image: 'saltline-proof-panel',
        label: 'The development panel',
        alt: saltline.proof.body[0],
        note: saltline.proof.body[0],
        proof: true,
      },
    ],
    frames: saltlineArc.map((f) => ({
      image: `saltline-arc-${f.key}`,
      label: `${f.time} · ${f.light}`,
      alt: f.alt,
      note: `${f.speed} through the water · ${f.vmg} VMG`,
    })),
  },
  {
    key: 'ember',
    name: ember.name,
    status: ember.status,
    kind: 'Voxel MMORPG',
    image: 'ember-spread-fallowmere-dusk',
    alt: 'Ember Wilds in Fallowmere at dusk: a level-30 character in a voxel landscape.',
    summary: ember.sub,
    role: 'Designed, built and put the web tier and authoritative realm service into production.',
    constraint:
      'Every player needs the same world state, including quests, loot and combat, while the browser remains a responsive renderer.',
    decision:
      'Keep simulation in a separate realm service and use Colyseus rooms over WebSocket to distribute authoritative state to the three.js client.',
    evidence: 'Live without install: seven regions and realms that hold up to 64 players.',
    href: ember.href,
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
      'hearthvale',
      'fallowmere',
      'greenmarch',
      'fenmarch',
      'ashen',
      'greywall',
      'plateau',
    ].map((key) => {
      const f = emberRegions.find((v) => v.key === key);
      return {
        image: `ember-region-${key === 'ashen' ? 'ashen-waste' : key === 'plateau' ? 'black-plateau' : key === 'greywall' ? 'greywall-peaks' : key}`,
        label: f?.tab ?? key,
        alt: f?.alt ?? `Ember Wilds region ${key}.`,
        note: f?.note ?? '',
      };
    }),
  },
  {
    key: 'murmuration',
    name: murmuration.name,
    status: murmuration.status,
    kind: 'Audio / WebGPU',
    image: murmuration.lead.asset,
    alt: murmuration.lead.alt,
    summary: murmuration.sub,
    role: 'The audio analysis, WebGPU compute renderer and interaction model.',
    constraint:
      'Frequency alone cannot tell a voice from a piano; the field also needs to respond to key, tempo, transients, stereo placement and quiet.',
    decision:
      'Combine chroma, autocorrelated spectral flux, per-band attack and centre-versus-sides analysis, then drive velocity-stretched particles in a compute shader.',
    evidence:
      'Live, including in a phone browser. Measured GPU time at 1800×3043: 620k particles in 8.07ms; 1.2M in 11.85ms.',
    href: murmuration.href,
    stack: 'WebGPU · compute shaders · Canvas · audio analysis',
    question: 'Can a field of light hear a song breathe?',
    proofFrames: [
      {
        image: 'murmuration-proof-interface',
        label: 'The live interface',
        alt: murmuration.proof.alt,
        note: murmuration.proof.body[0],
        proof: true,
      },
    ],
    frames: [
      'murmuration-frame-ribbon',
      'murmuration-frame-constellation',
      'murmuration-frame-lull',
    ].map((image, i) => ({
      image,
      label: ['Ribbon', 'Constellation', 'Quiet passage'][i],
      alt:
        i === 2
          ? 'murmuration during a quiet passage.'
          : `${murmuration.name}, ${['ribbon', 'constellation'][i]} style.`,
      note: murmuration.framesLede,
    })),
  },
  {
    key: 'blockhold',
    name: blockhold.name,
    status: blockhold.status,
    kind: 'Voxel tower defense',
    image: 'blockhold-lead-battle',
    alt: 'Blockhold in a live battle: voxel towers defend a road against an incoming wave.',
    summary: blockhold.sub,
    role: 'The voxel modeler, fixed-step sim, ten maps, authored waves and balance.',
    constraint:
      'A campaign with branching towers, multiple roads, heroes and endless mode must stay small enough to load while remaining deterministic and testable.',
    decision:
      'Generate 3D models from colored boxes, synthesize sound in WebAudio, draw icons as SVG, and keep a fixed 60Hz accumulator behind the render loop.',
    evidence:
      'Live and installable: ten maps, 249 authored waves, three heroes, endless mode and 154 tests.',
    href: blockhold.href,
    stack: 'JavaScript · WebAudio · SVG · fixed-step simulation',
    question: 'How much game can code describe?',
    frames: blockhold.figures.map((f) => ({
      image: `blockhold-frame-${f.key}`,
      label: f.tab,
      alt: f.cap,
      note: f.cap,
    })),
  },
  {
    key: 'cubit',
    name: cubit.name,
    status: cubit.status,
    kind: 'Game / interaction',
    image: 'cubit-lead-peek',
    alt: 'Cubit: a 3 by 3 by 3 cube of colored tiles, opened to reveal its layers.',
    summary: cubit.sub,
    role: 'The complete single-file engine, renderer, input and synthesized sound.',
    constraint:
      'Six directions must feel obvious on a flat phone screen, including the hidden axis and the cost of losing sight of interior tiles.',
    decision:
      'Score swipes against screen-space projections of the lattice axes, make blocked tiles translucent, and reserve Space plus capped gyro tilt for peeking.',
    evidence: 'Live as one self-contained 553 KB HTML file with 62 tests; saves locally.',
    href: cubit.href,
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
  },
  {
    key: 'hidamari',
    name: hidamari.name,
    status: hidamari.status,
    kind: 'Rendering / ambient',
    image: 'hidamari-spread-canopy',
    alt: 'Hidamari: an autumn canopy path rendered as layered depth plates.',
    summary: hidamari.sub,
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
    frames: [0, 1, 2, 3].map((i) => ({
      image: `hidamari-depth-${i}-${['sky', 'trees', 'arch', 'canopy'][i]}`,
      label: `Depth ${i}`,
      alt: `Hidamari depth layer ${i}.`,
      note: 'Baked plate used by the runtime reprojection.',
    })),
  },
  {
    key: 'elderwood',
    name: elderwood.name,
    status: elderwood.status,
    kind: 'Simulation / tower defense',
    image: 'elderwood-default',
    alt: 'Elderwood Vale greybox tower defense board with towers and a route.',
    summary: elderwood.sub,
    role: 'The simulation core, renderer, HUD and the boundary between them.',
    constraint:
      'The simulation must remain deterministic and testable without knowing about DOM, rendering, clocks or random globals.',
    decision:
      'Enforce the boundary with TypeScript configuration and restricted ESLint paths, then interpolate fixed 1/30s snapshots for a separate three.js renderer.',
    evidence: 'Playable greybox: placement, waves and enough economy to lose.',
    href: null,
    stack: 'TypeScript · three.js · React · fixed tick',
    question: 'What can a game prove when its simulation ignores the browser?',
    frames: elderwood.figures.map((f) => ({
      image: `elderwood-${f.key}`,
      label: f.tab,
      alt: f.cap,
      note: f.cap,
    })),
  },
  {
    key: 'beatlayer',
    name: 'BeatLayer',
    status: 'live',
    kind: 'Audio / instrument',
    image: 'built-beatlayer',
    alt: apps.find((a) => a.key === 'beatlayer')?.alt ?? 'BeatLayer step sequencer.',
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
  },
  {
    key: 'eyeshot',
    name: 'Eyeshot',
    status: 'live',
    kind: 'Game / daily tests',
    image: 'built-eyeshot',
    alt: apps.find((a) => a.key === 'eyeshot')?.alt ?? 'Eyeshot daily visual tests.',
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
  },
];

export const projects = projectRecords;
const details = {
  notable: [
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
  saltline: [
    ['Controlled input', 'Sea state moderate · wind 40° · crest sharpness 0.68 · seed 4193'],
    ['Readout', 'At golden hour: 15 kn through water, 2.3 kn toward the mark'],
    ['Hardening', "CSP script-src 'self' · frame-ancestors 'none' · full Permissions-Policy"],
  ],
  ember: [
    ['Realm', 'Web tier plus separate authoritative realm service'],
    ['Progression', 'Fame, satchel and tiered gear across seven regions'],
    ['World rule', 'Classes unlock through beast lore and study, not a skill tree'],
  ],
  murmuration: [
    ['Signal', 'Chroma key detection · autocorrelated spectral flux for tempo'],
    ['Separation', 'Centre-versus-sides analysis gives 3.5× separation on the bundled track'],
    ['Styles', 'Nebula · ink · constellation · ribbon · etching'],
  ],
  blockhold: [
    ['Campaign', 'Four tower families · three tiers · two elite branches · two crowns'],
    [
      'Special boards',
      'Sunderfall has four roads at four heights; Tidereach reroutes when causeways close',
    ],
    ['Review', '154 Vitest tests · six adversarial code rounds · three design rounds'],
  ],
  cubit: [
    ['Board', '27 cells · 3×3×3 · six slide directions'],
    ['Input', 'Swipes match the on-screen projection of each lattice axis'],
    ['Peek', 'Space spreads layers; opt-in gyro view is capped at 12°'],
  ],
  hidamari: [
    ['Offline', 'Blender Cycles bakes the light into plates'],
    ['Runtime', 'Depth reprojection adds parallax while the browser composites'],
    ['Delivery', 'PWA · service worker · AVIF with PNG fallback'],
  ],
  elderwood: [
    ['Tick', 'Fixed 1/30 s simulation with snapshot interpolation'],
    ['Renderer', 'three.js is free of the tick rate; React HUD subscribes at 10 Hz'],
    ['Boundary', 'DOM library removed from tsconfig; restricted paths in ESLint'],
  ],
  beatlayer: [],
  eyeshot: [],
};
projectRecords.forEach((record) => {
  record.details = details[record.key] ?? [];
});
export const project = (key) => projects.find((p) => p.key === key);

export const caseLink = (key, label = 'Read how I built it', cls = '') =>
  `<a class="${esc(cls)} ref-case-link" href="cases/${esc(key)}.html" data-case="${esc(key)}">${esc(label)} <span aria-hidden="true">→</span></a>`;

export const frame = (key, body, { scripts = [], title = '' } = {}) => {
  const p = project(key);
  const scriptTags = scripts.map((src) => `<script src="${esc(src)}" defer></script>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title || p?.name || 'AJ Uppal')}</title><link rel="stylesheet" href="shared.css"><link rel="stylesheet" href="${esc(key)}.css"><script>if(new URLSearchParams(location.search).has('capture'))document.documentElement.dataset.capture='';</script></head><body class="ref-page ref-${esc(key)}"><a class="ref-skip" href="#main">Skip to content</a><aside class="ref-reviewbar" aria-label="Design review navigation"><a href="index.html">← Four directions</a><span>${esc(p?.name || key)} / refined</span><a href="../portfolio-candidates/${esc(key)}.html">Original round ↗</a></aside>${body}<script src="shared.js" defer></script>${scriptTags}</body></html>`;
};

export { saltline, saltlineArc, murmuration, ember, hidamari, elderwood, blockhold, cubit };
