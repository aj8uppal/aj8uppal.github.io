import { frame, esc, asset, img, out, email, contact, project, caseLink } from './shared.mjs';

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
    image: 'saltline-lead-dawn',
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
    image: 'saltline-arc-golden',
  },
  {
    key: 'murmuration',
    note: 'Light that knows when the music breathes.',
    role: 'Audio analysis · WebGPU renderer',
    decision:
      'A quiet passage thins, dims and slows the whole field. Key, tempo, transients and stereo placement shape the response.',
    evidence: '1.2 million particles in 11.85ms of measured GPU time.',
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
];

function collectionDoor(discoveries) {
  const latest = discoveries.slice(0, 3);
  if (!latest.length) {
    return `<div class="wb-collection-empty"><div><h3>More things I’ve made.</h3><p>Games, instruments, tiny tools and experiments live in the archive.</p></div>${out('/built/', 'Browse the collection', 'wb-text-link')}</div>`;
  }
  return `<div class="wb-collection-grid" tabindex="0" aria-label="Three more projects; scroll to explore">${latest.map((item, index) => `<article class="wb-collection-card"><a href="${esc(item.href?.startsWith('/') ? `https://aj8uppal.github.io${item.href}` : item.href || 'https://aj8uppal.github.io/built/')}"><div class="wb-collection-image">${img(`built-${item.key}`, item.cap || item.name, 'loading="lazy"')}<span>${String(index + 1).padStart(2, '0')} / ${esc(item.kind || 'Project')}</span></div><h3>${esc(item.name)}</h3><p>${esc(item.what || '')}</p><span class="wb-text-link">Open it <span aria-hidden="true">↗</span></span></a></article>`).join('')}</div>`;
}

function card(item, index) {
  const p = project(item.key);
  return `<article class="wb-project wb-project-${p.key}">
    <a class="wb-project-image" href="cases/${p.key}.html" data-case="${p.key}" aria-label="Read the ${esc(p.name)} case study">${img(item.image, p.frames.find((f) => f.image === item.image)?.alt || p.alt, 'loading="lazy"')}<span class="wb-image-label">${String(index + 1).padStart(2, '0')} / ${esc(p.kind)}</span><span class="wb-image-open" aria-hidden="true">↗</span></a>
    <div class="wb-project-copy"><div class="wb-project-title"><h3>${esc(p.name)}</h3><span class="wb-live">Live</span></div><p class="wb-project-note">${esc(item.note)}</p><p class="wb-project-role">My work / ${esc(item.role)}</p><p class="wb-project-decision">${esc(item.decision)}</p><p class="wb-project-evidence">${esc(item.evidence)}</p><div class="wb-project-links">${caseLink(p.key, 'Inside the build')}${out(p.href, 'Open project')}</div></div>
  </article>`;
}

export default function render(discoveries = []) {
  // Synchronous decoding is deliberate: Chromium can retain blank image tiles
  // after a phone-to-desktop navigation with async decoding, even after decode()
  // resolves. This presentation hint keeps the initial scene and swaps complete.
  const body = `<main id="main">
  <section class="wb-cover" aria-labelledby="wb-name" data-scene="murmuration">
    <div class="wb-scene-wrap">${img(scenes[0].image, scenes[0].alt, 'class="wb-scene" fetchpriority="high" decoding="sync"')}</div><div class="wb-wash" aria-hidden="true"></div>
    <header class="wb-nav wb-shell"><a class="wb-brand" href="#main" aria-label="AJ Uppal, home">AJ<span>Engineer & explorer</span></a><nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">Meet AJ</a>${email('Contact')}</nav></header>
    <div class="wb-hero wb-shell"><p class="wb-occupation">Software engineer at <strong>Notable Health</strong><span>Bay Area, California</span></p><h1 id="wb-name">AJ <em>Uppal.</em></h1><p class="wb-hero-line">Systems people trust.<br>Worlds worth getting lost in.</p><p class="wb-scope">I build voice AI infrastructure at Notable, and browser worlds off the clock.</p><div class="wb-hero-actions"><a class="wb-button" href="#work">Explore my work <span aria-hidden="true">↓</span></a>${email('Get in touch', 'wb-text-link')}</div></div>
    <p class="wb-scene-caption wb-shell"><span class="wb-caption-plate"><span data-scene-caption>${esc(scenes[0].caption)}</span><small>Captured in the running app</small></span></p>
    <div class="wb-scene-selector wb-shell" hidden><p class="wb-caption">A change of scenery <span>Same person behind it.</span></p><div class="wb-scenes" role="group" aria-label="Choose the portfolio backdrop">${scenes.map((s, i) => `<button type="button" data-scene-key="${s.key}" data-scene-image="${asset(s.image)}" data-scene-alt="${esc(s.alt)}" data-scene-caption="${esc(s.caption)}" aria-pressed="${i === 0}">${img(s.image, '', 'loading="lazy"')}<span><small>0${i + 1}</small>${esc(s.title)}</span><b aria-hidden="true">${i === 0 ? '−' : '+'}</b></button>`).join('')}</div></div>
  </section>

  <section id="work" class="wb-professional" aria-labelledby="wb-professional-title"><div class="wb-shell wb-professional-inner"><div class="wb-professional-heading"><p class="wb-kicker">At work / Notable Health</p><h2 id="wb-professional-title">A clear voice.<br><em>A dependable system.</em></h2><p>Software Engineer · August 2022–present</p>${caseLink('notable', 'The work at Notable')}</div><div class="wb-professional-story"><p class="wb-professional-intro">My team owns the voice and conversations platform behind around <strong>250,000 patient calls a month.</strong></p><p>I set technical direction for patient identity, routing, observability and reliability: the decisions that keep a conversation moving across healthcare systems, carriers and call centers.</p><p class="wb-professional-proof">I wrote the telephony integration specification that health systems build against. It has driven more than $1M in ARR.</p><div class="wb-system" aria-label="Areas of my technical direction"><span><b>01</b> Know the patient <small>Identity & verification</small></span><span><b>02</b> Find the right path <small>Conversation & carrier routing</small></span><span><b>03</b> Keep the call connected <small>Observability & recovery</small></span></div></div></div></section>

  <section class="wb-worlds wb-shell" aria-labelledby="wb-worlds-title"><header class="wb-section-heading"><div><p class="wb-kicker">Off the clock / Personal projects</p><h2 id="wb-worlds-title">A few worlds<br><em>of my own.</em></h2></div><p>I learn things by building them. Sometimes that means a shared world; sometimes, finding the right way to move one cube.<span>Five live projects. Each has a story behind the frame.</span></p></header><div class="wb-projects">${cards.map(card).join('')}</div><div class="wb-workbench"><p class="wb-kicker">Still taking shape</p><div>${caseLink('hidamari', 'hidamari')}<span>Ambient light · work in progress</span></div><div>${caseLink('elderwood', 'Elderwood Vale')}<span>Deterministic simulation · work in progress</span></div></div><section class="wb-collection-door" aria-labelledby="wb-collection-title"><div class="wb-collection-head"><div><p class="wb-kicker">The wider collection</p><h2 id="wb-collection-title">Keep browsing.</h2></div><p>Draw in a wind tunnel. Hum a window into being. Find a creature in a file. There’s more to explore.</p></div>${collectionDoor(discoveries)}<div class="wb-collection-browse">${out('/built/', 'Browse the whole collection', 'wb-text-link')}</div></section></section>

  <section id="about" class="wb-about"><div class="wb-shell wb-about-inner"><div><p class="wb-kicker">The person behind the systems</p><h2>Curiosity is<br><em>the common thread.</em></h2></div><div class="wb-about-copy"><p>I studied computer science and astrophysics at the same time because I couldn’t choose between them. In college I simulated CO₂ cooling for particle detectors. Now I simulate an ocean.</p><p>Away from the keyboard: heirloom tomatoes, bikes and Pink Floyd, roughly in that order. I’ve wanted to be an astronaut since I was four. Still would.</p><div class="wb-about-links">${email('Say hello', 'wb-text-link')}${out(contact.resume, 'Résumé', 'wb-text-link')}${out(contact.github, 'GitHub', 'wb-text-link')}</div></div></div></section>
  <footer class="wb-footer wb-shell"><a href="#main" class="wb-signature">AJ Uppal.</a><span>Made with curiosity. Built to be explored.</span><a href="#main">Back to the surface ↑</a></footer>
  </main>`;
  return frame('worldbuilder', body, {
    scripts: ['worldbuilder.js'],
    title: 'AJ Uppal — systems & worlds',
  });
}
