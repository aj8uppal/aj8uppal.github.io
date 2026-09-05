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
    note: 'One world, even when nobody sees it the same way.',
    role: 'Design · client · authoritative realm service',
    decision:
      'The browser renders. A separate realm service owns quests, loot and combat, so everyone inhabits the same world.',
    evidence: 'Seven regions. Up to 64 players in a realm.',
    image: 'ember-spread-fallowmere-dusk',
  },
  {
    key: 'saltline',
    note: 'An ocean you learn to read.',
    role: 'Sailing model · renderer · multiplayer',
    decision:
      'Point of sail determines thrust. The HUD exposes wind, heel and velocity toward the mark, making the physics something you can learn.',
    evidence: 'Accounts, persistent cargo, up to 20 players per sea.',
    image: 'portfolio-saltline-moonlight',
  },
  {
    key: 'murmuration',
    note: 'Light that knows when the music breathes.',
    role: 'Audio analysis · WebGPU renderer',
    decision:
      'A quiet passage thins, dims and slows the whole field. Key, tempo, transients and stereo placement shape the response.',
    evidence: particleMeasurement.line,
    image: 'murmuration-lead-ribbon',
  },
  {
    key: 'blockhold',
    note: 'Build a defense. Then change the rules.',
    role: 'Voxel modeler · fixed-step simulation · balance',
    decision:
      'Ten maps share a fixed 60Hz simulation. Later boards change line of sight, move a firestorm or close the roads you planned around.',
    evidence: '249 authored waves. Three heroes. 154 tests.',
    image: 'blockhold-frame-tidereach',
  },
  {
    key: 'cubit',
    note: 'One more dimension. A different kind of obvious.',
    role: 'Engine · renderer · input · sound',
    decision:
      'Match each swipe to the screen-space projection of the cube’s axes. Spread the layers to make the hidden board legible.',
    evidence: 'One self-contained HTML file. Six directions. 62 tests.',
    image: 'cubit-lead-peek',
  },
  {
    key: 'eyeshot',
    note: 'Trust your eye. Then test it.',
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
  beatlayer:
    'Give a guitar take a drummer. Audio analysis finds the pulse; synthesis makes the groove.',
  boundary:
    'Place the shot, call the run. A cricket simulation where the score follows what happens on the field.',
  voidreach:
    'A cockpit, a ship and 64 generated star systems. A galaxy built from procedural geometry.',
  'ai-wrapped':
    'A year of conversations, made legible. A local-first parser turns an export into a shareable portrait.',
  roomtone:
    'Turn a room’s colors into a chord. A camera, a little color science and an instrument you can play.',
  'bring-something-home':
    'Cooperative bullet-hell expeditions. Immediate controls, shared combat and progress worth bringing home.',
  slipstream:
    'Draw a shape. See what the air does. An interactive fluid solver in a browser wind tunnel.',
};

function moreWork() {
  return `<section class="wb-more" id="more-work" aria-labelledby="wb-more-title"><span id="playground" class="wb-anchor" aria-hidden="true"></span><header class="wb-more-heading"><div><p class="wb-kicker">More ways I build</p><h2 id="wb-more-title">Follow your curiosity.</h2><p>Instruments, simulations and useful little tools. ${secondaryProjectKeys.length} more places to explore.</p></div><div class="wb-gallery-controls" hidden><button type="button" data-gallery-prev aria-label="Previous projects" aria-controls="wb-more-track">←</button><button type="button" data-gallery-next aria-label="Next projects" aria-controls="wb-more-track">→</button></div></header><div class="wb-more-track" id="wb-more-track" tabindex="0" aria-label="More featured projects. Scroll horizontally to explore.">${secondaryProjectKeys
    .map((key) => {
      const p = project(key);
      return `<article class="wb-mini" data-secondary-project="${key}"><a class="wb-mini-image" href="/portfolio/work/${key}/" tabindex="-1" aria-hidden="true">${img(p.image, '', 'loading="lazy"')}<span aria-hidden="true">↗</span></a><p class="wb-mini-meta">${esc(p.kind)}<span>${p.local ? 'Prototype' : 'Live'}</span></p><h3>${caseLink(key, p.name)}</h3><p class="wb-mini-note">${esc(moreNotes[key])}</p></article>`;
    })
    .join(
      '',
    )}</div><a class="portfolio-collection-link" href="/portfolio/collection/">Explore the full collection <span aria-hidden="true">→</span></a></section>`;
}

function careerNotes() {
  return `<section class="wb-career" aria-labelledby="wb-career-title"><div class="wb-shell"><header><p class="wb-kicker">Before Notable</p><h2 id="wb-career-title">A few chapters.</h2><p>My work has crossed healthcare, finance, education and physics. The thread is the same: understand the system, then make it work better.</p></header><ol class="wb-career-grid">${career.map((role) => `<li><p class="wb-career-years">${esc(role.years)}</p><h3>${esc(role.company)}</h3><p class="wb-career-role">${esc(role.title)}</p><p>${esc(role.note)}</p></li>`).join('')}</ol></div></section>`;
}

function foldingIndex() {
  return `<details class="wb-index"><summary>Explore<span class="wb-fold-mark" aria-hidden="true">⌄</span></summary><nav class="wb-fold-sheet" aria-label="Page index"><a href="#work"><small>01 / At work</small><strong>Systems people trust.</strong><span aria-hidden="true">↗</span></a><a href="#projects"><small>02 / Selected projects</small><strong>A few worlds of my own.</strong><span aria-hidden="true">↗</span></a><a href="#more-work"><small>03 / More to explore</small><strong>Follow your curiosity.</strong><span aria-hidden="true">↗</span></a><a href="#about"><small>04 / Meet AJ</small><strong>The person behind it.</strong><span aria-hidden="true">↗</span></a></nav></details>`;
}

export default function render() {
  // Synchronous decoding is deliberate: Chromium can retain blank image tiles
  // after a phone-to-desktop navigation with async decoding, even after decode()
  // resolves. This presentation hint keeps the initial scene and swaps complete.
  const body = `<main id="main">
  <section class="wb-cover" aria-labelledby="wb-name" data-scene="murmuration">
    <div class="wb-scene-wrap">${img(scenes[0].image, scenes[0].alt, 'class="wb-scene" fetchpriority="high" decoding="sync"')}</div><div class="wb-wash" aria-hidden="true"></div>
    <header class="wb-nav wb-shell"><a class="wb-brand" href="#main" aria-label="AJ Uppal, home">AJ<span>Engineer & explorer</span></a><nav aria-label="Main navigation">${foldingIndex()}<a href="/portfolio/collection/">Collection</a><a href="#about">Meet AJ</a>${email('Contact')}</nav></header>
    <div class="wb-hero wb-shell"><p class="wb-occupation">Software engineer at <strong>Notable Health</strong><span>Bay Area, California</span></p><h1 id="wb-name">AJ <em>Uppal.</em></h1><p class="wb-hero-line">Systems people trust.<br>Worlds worth getting lost in.</p><p class="wb-scope">I build voice AI infrastructure at Notable, and browser worlds off the clock.</p><div class="wb-hero-actions"><a class="wb-button" href="#work">Explore my work <span aria-hidden="true">↓</span></a>${out(contact.resume, 'Résumé', 'wb-text-link')}</div></div>
    <p class="wb-scene-caption wb-shell"><span class="wb-caption-plate"><span data-scene-caption>${esc(scenes[0].caption)}</span><small>Captured in the running app</small></span></p>
    <div class="wb-scene-selector wb-shell" hidden><p class="wb-caption">A change of scenery <span>Same person behind it.</span></p><div class="wb-scenes" role="group" aria-label="Choose the portfolio backdrop">${scenes.map((s, i) => `<button type="button" data-scene-key="${s.key}" data-scene-image="${asset(s.image)}" data-scene-alt="${esc(s.alt)}" data-scene-caption="${esc(s.caption)}" aria-pressed="${i === 0}">${img(s.image, '', 'loading="lazy"')}<span><small>0${i + 1}</small>${esc(s.title)}</span><b aria-hidden="true">${i === 0 ? '−' : '+'}</b></button>`).join('')}</div></div>
  </section>

  <section id="work" class="wb-professional" aria-labelledby="wb-professional-title"><div class="wb-shell wb-professional-inner"><div class="wb-professional-heading"><p class="wb-kicker">At work / Notable Health</p><h2 id="wb-professional-title">A clear voice.<br><em>A dependable system.</em></h2><p>Software Engineer · August 2022–present</p>${caseLink('notable', 'The work at Notable')}</div><div class="wb-professional-story"><p class="wb-professional-intro">My team owns the voice and conversations platform behind around <strong>250,000 patient calls a month.</strong></p><p>I set technical direction for patient identity, routing, observability and reliability: the decisions that keep a conversation moving across healthcare systems, carriers and call centers.</p><p class="wb-professional-proof">I wrote the telephony integration specification that health systems build against. It has driven more than $1M in ARR.</p><div class="wb-system" aria-label="Areas of my technical direction"><span><b>01</b> Know the patient <small>Identity & verification</small></span><span><b>02</b> Find the right path <small>Conversation & carrier routing</small></span><span><b>03</b> Keep the call connected <small>Observability & recovery</small></span></div></div></div></section>

  ${careerNotes()}

  <section id="projects" class="wb-worlds wb-shell" aria-labelledby="wb-worlds-title"><span id="building" class="wb-anchor" aria-hidden="true"></span><header class="wb-section-heading"><div><p class="wb-kicker">Off the clock / Personal projects</p><h2 id="wb-worlds-title">A few worlds<br><em>of my own.</em></h2></div><p>I learn things by building them. These are a few of the worlds, instruments and games I’ve made along the way.<span>${homeProjectKeys.length} places to begin. The decisions behind each one.</span></p></header><div class="wb-projects">${cards
    .filter((c) => homeProjectKeys.includes(c.key))
    .sort((a, b) => homeProjectKeys.indexOf(a.key) - homeProjectKeys.indexOf(b.key))
    .map(card)
    .join('')}</div>${moreWork()}</section>

  <section id="about" class="wb-about"><div class="wb-shell wb-about-inner"><div><p class="wb-kicker">The person behind the systems</p><h2>Curiosity is<br><em>the common thread.</em></h2></div><div class="wb-about-copy"><p>I studied computer science and astrophysics because I couldn’t choose between them. In college I simulated CO₂ cooling for particle detectors. Now I simulate an ocean.</p><p>Away from the keyboard: heirloom tomatoes, bikes and Pink Floyd, roughly in that order. I’ve wanted to be an astronaut since I was four. Still would.</p><div class="wb-education"><p class="wb-kicker">Education</p><h3>${esc(education.subjects)}</h3><p>${esc(education.institution)}</p><small>${esc(education.note)}</small></div><dl class="wb-toolkit" id="skills">${toolkit.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><div class="wb-about-links">${email('Say hello', 'wb-text-link')}${out(contact.resume, 'Résumé', 'wb-text-link')}${out(contact.github, 'GitHub', 'wb-text-link')}</div></div></div></section>
  <footer class="wb-footer wb-shell" id="contact"><a href="#main" class="wb-signature">AJ Uppal.</a><span>Made with curiosity. Built to be explored.</span><a href="#main">Back to the surface ↑</a></footer>
  </main>`;
  return frame('worldbuilder', body, {
    scripts: ['worldbuilder.js'],
    title: 'AJ Uppal — systems & worlds',
  });
}
