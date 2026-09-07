import {
  frame,
  esc,
  asset,
  img,
  out,
  email,
  contact,
  project,
  caseLink,
  particleMeasurement,
  homeProjectKeys,
  secondaryProjectKeys,
} from './shared.mjs';
import { career, education, toolkit } from '../data/career.ts';

const scenes = [
  {
    key: 'murmuration',
    image: 'murmuration-lead-ribbon',
    title: 'A field of light',
    caption: 'murmuration · audio in light',
    alt: 'Violet and white particles form a luminous ribbon in murmuration.',
  },
  {
    key: 'saltline',
    image: 'portfolio-saltline-sunrise',
    title: 'An open sea',
    caption: 'saltline · my open sea',
    alt: 'A sailboat crossing a luminous ocean at dawn in saltline.',
  },
  {
    key: 'ember',
    image: 'ember-spread-fallowmere-dusk',
    title: 'A shared world',
    caption: 'Ember Wilds · a shared world',
    alt: 'Ember Wilds: a character in an amber voxel landscape at dusk.',
  },
];

const cards = [
  {
    key: 'ember',
    note: 'A multiplayer voxel RPG.',
    role: 'Design · client · authoritative realm service',
    decision:
      'The browser renders. A separate realm service owns quests, loot and combat, so everyone inhabits the same world.',
    evidence: 'Seven regions. Up to 64 players in a realm.',
    image: 'ember-spread-fallowmere-dusk',
  },
  {
    key: 'saltline',
    note: 'Sailing with wind, cargo and other players.',
    role: 'Sailing model · renderer · multiplayer',
    decision:
      'Point of sail determines thrust. The HUD shows relative wind, heel and velocity toward the mark.',
    evidence: 'Accounts, persistent cargo, up to 20 players per sea.',
    image: 'portfolio-saltline-moonlight',
  },
  {
    key: 'murmuration',
    note: 'Music mapped to particles.',
    role: 'Audio analysis · WebGPU renderer',
    decision:
      'Pitch, tempo, transients and stereo position shape the particles. Quiet passages thin and slow the field.',
    evidence: particleMeasurement.line,
    image: 'murmuration-lead-ribbon',
  },
  {
    key: 'blockhold',
    note: 'Tower defense across ten maps.',
    role: 'Voxel modeler · fixed-step simulation · balance',
    decision:
      'Ten maps share a fixed 60Hz simulation. Later boards change line of sight, move a firestorm or close the roads you planned around.',
    evidence: '249 authored waves, three heroes and an endless mode.',
    image: 'blockhold-frame-tidereach',
  },
  {
    key: 'cubit',
    note: '2048 in three dimensions.',
    role: 'Engine · renderer · input · sound',
    decision:
      'Swipes follow the cube’s projected axes. Spreading its layers reveals the tiles inside.',
    evidence: 'Six slide directions, local saves and a single HTML file.',
    image: 'cubit-lead-peek',
  },
  {
    key: 'eyeshot',
    note: 'Five daily visual challenges.',
    role: 'Interaction design · scoring · server & leaderboard',
    decision:
      'Everyone gets the same five visual tests. The server rescores the raw input with the same logic as the browser, so the leaderboard compares the same thing.',
    evidence: 'Five daily tests. A shared leaderboard. Live at eyeshot.app.',
    image: 'portfolio-eyeshot-feature',
  },
];

function card(item, index) {
  const p = project(item.key);
  return `<article class="wb-project wb-project-${p.key}" data-primary-project="${p.key}">
    <a class="wb-project-image" href="/portfolio/work/${p.key}/" aria-label="Read the ${esc(p.name)} case study">${img(item.image, p.frames.find((f) => f.image === item.image)?.alt || p.alt, 'loading="lazy"')}<span class="wb-image-label">${String(index + 1).padStart(2, '0')} / ${esc(p.kind)}</span><span class="wb-image-open" aria-hidden="true">↗</span></a>
    <div class="wb-project-copy"><div class="wb-project-title"><h3>${esc(p.name)}</h3><span class="wb-live">${p.local ? 'Prototype' : 'Live'}</span></div><p class="wb-project-note">${esc(item.note)}</p><p class="wb-project-role">My work / ${esc(item.role)}</p><p class="wb-project-decision">${esc(item.decision)}</p><p class="wb-project-evidence">${esc(item.evidence)}</p><div class="wb-project-links">${caseLink(p.key, 'Inside the build')}${out(p.href, p.local ? 'Inside the build' : 'Open project')}</div></div>
  </article>`;
}

const moreNotes = {
  beatlayer: 'Add synthesized drums to a guitar recording, with beat tracking and audio export.',
  boundary: 'A cricket game with batting, running, CPU fielders and keyboard or touch controls.',
  voidreach: 'Fly through 64 generated star systems, with procedural ships and stations.',
  'ai-wrapped':
    'Turn a chat export into statistics and shareable cards. The data stays in the browser.',
  roomtone: 'Scan a room’s colors and turn its palette into a five-note chord.',
  'bring-something-home':
    'Cooperative bullet-hell expeditions with shared combat, personal loot and persistent upgrades.',
  slipstream: 'Draw shapes and explore the flow around them in a 2D browser wind tunnel.',
};

function moreWork() {
  return `<section class="wb-more" id="more-work" aria-labelledby="wb-more-title"><span id="playground" class="wb-anchor" aria-hidden="true"></span><header class="wb-more-heading"><div><p class="wb-kicker">More projects</p><h2 id="wb-more-title">A few more projects.</h2><p>${secondaryProjectKeys.length} more games, tools and experiments.</p></div><div class="wb-gallery-controls" hidden><button type="button" data-gallery-prev aria-label="Previous projects" aria-controls="wb-more-track">←</button><button type="button" data-gallery-next aria-label="Next projects" aria-controls="wb-more-track">→</button></div></header><div class="wb-more-track" id="wb-more-track" tabindex="0" aria-label="More featured projects. Scroll horizontally to explore.">${secondaryProjectKeys
    .map((key) => {
      const p = project(key);
      return `<article class="wb-mini" data-secondary-project="${key}"><a class="wb-mini-image" href="/portfolio/work/${key}/" tabindex="-1" aria-hidden="true">${img(p.image, '', 'loading="lazy"')}<span aria-hidden="true">↗</span></a><p class="wb-mini-meta">${esc(p.kind)}<span>${p.local ? 'Prototype' : 'Live'}</span></p><h3>${caseLink(key, p.name)}</h3><p class="wb-mini-note">${esc(moreNotes[key])}</p></article>`;
    })
    .join(
      '',
    )}</div><a class="portfolio-collection-link" href="/portfolio/collection/">Explore the full collection <span aria-hidden="true">→</span></a></section>`;
}

function careerNotes() {
  return `<section class="wb-career" aria-labelledby="wb-career-title"><div class="wb-shell"><header><p class="wb-kicker">Before Notable</p><h2 id="wb-career-title">Earlier work.</h2><p>Before Notable, I worked on financial software, teaching tools and physics research.</p></header><ol class="wb-career-grid">${career.map((role) => `<li><p class="wb-career-years">${esc(role.years)}</p><h3>${esc(role.company)}</h3><p class="wb-career-role">${esc(role.title)}</p><p>${esc(role.note)}</p></li>`).join('')}</ol></div></section>`;
}

function foldingIndex() {
  return `<details class="wb-index"><summary>Explore<span class="wb-fold-mark" aria-hidden="true">⌄</span></summary><nav class="wb-fold-sheet" aria-label="Page index"><a href="#work"><small>01 / At work</small><strong>Healthcare software.</strong><span aria-hidden="true">↗</span></a><a href="#projects"><small>02 / Selected projects</small><strong>Games and experiments.</strong><span aria-hidden="true">↗</span></a><a href="#more-work"><small>03 / More to explore</small><strong>A few more projects.</strong><span aria-hidden="true">↗</span></a><a href="#about"><small>04 / Meet AJ</small><strong>About me.</strong><span aria-hidden="true">↗</span></a></nav></details>`;
}

export default function render() {
  // Synchronous decoding is deliberate: Chromium can retain blank image tiles
  // after a phone-to-desktop navigation with async decoding, even after decode()
  // resolves. This presentation hint keeps the initial scene and swaps complete.
  const body = `<main id="main">
  <section class="wb-cover" aria-labelledby="wb-name" data-scene="murmuration">
    <div class="wb-scene-wrap">${img(scenes[0].image, scenes[0].alt, 'class="wb-scene" fetchpriority="high" decoding="sync"')}</div><div class="wb-wash" aria-hidden="true"></div>
    <header class="wb-nav wb-shell"><a class="wb-brand" href="#main" aria-label="AJ Uppal, home">AJ<span>Software engineer</span></a><nav aria-label="Main navigation">${foldingIndex()}<a href="/portfolio/collection/">Collection</a><a href="#about">Meet AJ</a>${email('Contact')}</nav></header>
    <div class="wb-hero wb-shell"><p class="wb-occupation">Software engineer at <strong>Notable Health</strong><span>Bay Area, California</span></p><h1 id="wb-name">AJ <em>Uppal.</em></h1><p class="wb-hero-line">Games, instruments<br>and browser experiments.</p><div class="wb-hero-actions"><a class="wb-button" href="#work">Explore my work <span aria-hidden="true">↓</span></a>${out(contact.resume, 'Résumé', 'wb-text-link')}</div></div>
    <p class="wb-scene-caption wb-shell"><span class="wb-caption-plate"><span data-scene-caption>${esc(scenes[0].caption)}</span><small>From the app</small></span></p>
    <div class="wb-scene-selector wb-shell" hidden><p class="wb-caption">A change of scenery <span>Three of my projects.</span></p><div class="wb-scenes" role="group" aria-label="Choose the portfolio backdrop">${scenes.map((s, i) => `<button type="button" data-scene-key="${s.key}" data-scene-image="${asset(s.image)}" data-scene-alt="${esc(s.alt)}" data-scene-caption="${esc(s.caption)}" aria-pressed="${i === 0}">${img(s.image, '', 'loading="lazy"')}<span><small>0${i + 1}</small>${esc(s.title)}</span><b aria-hidden="true">${i === 0 ? '−' : '+'}</b></button>`).join('')}</div></div>
  </section>

  <section id="work" class="wb-professional" aria-labelledby="wb-professional-title"><div class="wb-shell wb-professional-inner"><div class="wb-professional-heading"><p class="wb-kicker">At work / Notable Health</p><h2 id="wb-professional-title">Voice and<br><em>conversations.</em></h2><p>Software Engineer · August 2022–present</p>${caseLink('notable', 'The work at Notable')}</div><div class="wb-professional-story"><p class="wb-professional-intro">I work on Notable’s voice and conversations platform, which handles around <strong>250,000 patient calls a month.</strong></p><p>My work includes caller verification, call routing, transfers and monitoring. I wrote the inbound SIP integration specification used by health systems to connect their phone systems to the platform.</p><div class="wb-system" aria-label="Areas of my work"><span><b>01</b> Caller verification <small>Patient lookup & SMS codes</small></span><span><b>02</b> Call routing <small>Carriers & transfers</small></span><span><b>03</b> Reliability <small>Monitoring & fallback routing</small></span></div></div></div></section>

  ${careerNotes()}

  <section id="projects" class="wb-worlds wb-shell" aria-labelledby="wb-worlds-title"><span id="building" class="wb-anchor" aria-hidden="true"></span><header class="wb-section-heading"><div><p class="wb-kicker">Personal projects</p><h2 id="wb-worlds-title">Games and<br><em>experiments.</em></h2></div><p>Some of my browser projects. Open one to try it, or read about how it works.<span>${homeProjectKeys.length} selected projects</span></p></header><div class="wb-projects">${cards
    .filter((c) => homeProjectKeys.includes(c.key))
    .sort((a, b) => homeProjectKeys.indexOf(a.key) - homeProjectKeys.indexOf(b.key))
    .map(card)
    .join('')}</div>${moreWork()}</section>

  <section id="about" class="wb-about"><div class="wb-shell wb-about-inner"><div><p class="wb-kicker">About me</p><h2>A little<br><em>about me.</em></h2></div><div class="wb-about-copy"><p>I studied computer science and astrophysics at UMass Amherst. My research there focused on simulations of CO₂ cooling for particle detectors.</p><p>Away from the keyboard, I grow heirloom tomatoes, ride bikes and listen to Pink Floyd. I’ve wanted to be an astronaut since I was four.</p><div class="wb-education"><p class="wb-kicker">Education</p><h3>${esc(education.subjects)}</h3><p>${esc(education.institution)}</p><small>${esc(education.note)}</small></div><dl class="wb-toolkit" id="skills">${toolkit.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><div class="wb-about-links">${email('Say hello', 'wb-text-link')}${out(contact.resume, 'Résumé', 'wb-text-link')}${out(contact.github, 'GitHub', 'wb-text-link')}</div></div></div></section>
  <footer class="wb-footer wb-shell" id="contact"><a href="#main" class="wb-signature">AJ Uppal.</a><span>Bay Area, California</span><a href="#main">Back to top ↑</a></footer>
  </main>`;
  return frame('worldbuilder', body, {
    scripts: ['worldbuilder.js'],
    title: 'AJ Uppal — Software engineer',
  });
}
