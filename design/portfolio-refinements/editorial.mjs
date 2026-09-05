import {
  frame,
  img,
  esc,
  asset,
  project,
  caseLink,
  out,
  email,
  contact,
  roles,
} from './shared.mjs';

const leadProjects = [
  {
    key: 'saltline',
    title: 'An ocean with rules.',
    intro:
      'I built the sailing model, renderer, multiplayer and accounts. The part I care about: the sea should be something you can learn to read.',
    decision:
      'Thrust follows the point of sail. Wind, heel and velocity made good are visible in the HUD, so the physics becomes a skill, not a hidden rule.',
    result: 'A shared sea for up to 20 players.',
    images: [
      {
        image: 'saltline-lead-dawn',
        label: 'The world',
        alt: project('saltline').alt,
        note: 'Dawn, from the helm of a running game.',
      },
      {
        image: 'saltline-proof-panel',
        label: 'The instruments',
        alt: 'Saltline running with its sailing instruments and developer controls visible.',
        note: 'The instruments expose the sailing model underneath.',
      },
    ],
  },
  {
    key: 'ember',
    title: 'A world we can agree on.',
    intro:
      'I designed, built and deployed a voxel MMORPG: the browser client, the authoritative realm service and the boundary between them.',
    decision:
      'The server owns simulation. Colyseus rooms carry the same quests, loot and combat state to every browser; the client draws the world.',
    result: 'Seven regions. Up to 64 players per realm.',
    images: [
      {
        image: 'ember-spread-fallowmere-dusk',
        label: 'The world',
        alt: project('ember').alt,
        note: 'Fallowmere at dusk. A place made from voxels.',
      },
      {
        image: 'ember-proof-two-players',
        label: 'The shared state',
        alt: 'Two browser windows connected to the same Ember Wilds realm.',
        note: 'Two browsers, connected to the same running realm.',
      },
    ],
  },
];

const shortProjects = [
  {
    key: 'murmuration',
    title: 'Listen, then render.',
    body: 'I built the audio analysis and WebGPU renderer. Chroma, transients and stereo placement give a field of particles more to follow than volume.',
    fact: '620k particles · 8.07ms GPU time',
  },
  {
    key: 'blockhold',
    title: 'Build the rules first.',
    body: 'I made the modeler, simulation and campaign. Colored boxes become models; a fixed 60Hz loop keeps the battle independent of the frame rate.',
    fact: '10 maps · 249 waves · 154 tests',
  },
  {
    key: 'cubit',
    title: 'Make depth feel obvious.',
    body: 'I built the whole single-file game. Swipes follow the projected cube axes, and translucent tiles let you read what is happening inside.',
    fact: 'One 553 KB file · 62 tests',
  },
];

function lead(item, index) {
  const p = project(item.key);
  return `<article class="ed-project" id="ed-${p.key}">
    <div class="ed-project-copy"><p class="ed-label">0${index + 1} / ${esc(p.kind)}</p><h3>${item.title}</h3><p class="ed-project-intro">${item.intro}</p><div class="ed-decision"><span class="ed-label">A decision that matters</span><p>${item.decision}</p></div><p class="ed-result">${item.result}</p><div class="ed-project-links">${caseLink(p.key, 'Inside the build', 'ed-link')}${out(p.href, 'Open ' + p.name, 'ed-link ed-link-quiet')}</div></div>
    <figure class="ed-figure" data-ed-gallery><div class="ed-image-wrap">${img(item.images[0].image, item.images[0].alt, `${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} data-ed-image`)}</div><figcaption><div class="ed-figure-heading"><span>${esc(p.name)}</span><div class="ed-gallery-controls" role="group" aria-label="${esc(p.name)} photographs" hidden>${item.images.map((f, i) => `<button type="button" data-ed-frame="${asset(f.image)}" data-alt="${esc(f.alt)}" data-note="${esc(f.note)}" aria-pressed="${i === 0}">${f.label}</button>`).join('')}</div><span class="ed-live">Live in a browser ↗</span></div><p data-ed-note>${item.images[0].note}</p></figcaption></figure>
  </article>`;
}

export default function render() {
  return frame(
    'editorial',
    `<div class="ed-shell" id="top">
    <header class="ed-nav"><a class="ed-brand" href="#top">AJ Uppal<span>.</span></a><nav aria-label="Main navigation"><a href="#work">Selected work</a><a href="#about">About</a>${email('Say hello')}</nav></header>
    <main id="main">
      <section class="ed-hero" aria-labelledby="ed-title"><div class="ed-intro"><p class="ed-label">Software engineer / Bay Area, California</p><h1 id="ed-title">Serious systems.<br><em>Curious mind.</em></h1><p class="ed-lede">I’m AJ. I build healthcare software at Notable Health and, off the clock, worlds that run in a browser.</p><div class="ed-hero-links"><a class="ed-link" href="#work">Explore my work <span aria-hidden="true">↓</span></a>${out(contact.resume, 'Résumé', 'ed-link ed-link-quiet')}</div></div><aside class="ed-current" aria-label="Current work"><div class="ed-current-top"><span class="ed-label">Currently at Notable Health</span><span class="ed-star" aria-hidden="true">✳</span></div><p>I set technical direction for patient identity, routing, observability and reliability.</p><div class="ed-scale"><strong>~250k</strong><span>patient calls a month<br>on our team’s platform</span></div>${caseLink('notable', 'The work behind the calls', 'ed-link')}</aside></section>
      <section class="ed-work" id="work" aria-labelledby="ed-work-title"><div class="ed-section-line"><h2 id="ed-work-title">Selected work</h2><span class="ed-label">Five projects / a few ways I think</span></div>${leadProjects.map(lead).join('')}
        <div class="ed-studies">${shortProjects
          .map((s, i) => {
            const p = project(s.key);
            return `<article class="ed-study"><figure>${img(p.image, p.alt, 'loading="lazy"')}<figcaption><span>${esc(p.name)}</span><span class="ed-label">0${i + 3}</span></figcaption></figure><h3>${s.title}</h3><p>${s.body}</p><p class="ed-study-fact">${s.fact}</p>${caseLink(p.key, 'Inside the build', 'ed-link')}</article>`;
          })
          .join('')}</div>
        <div class="ed-unfinished"><span class="ed-label">Still on the desk</span><p>Pre-lit forests and deterministic worlds.</p><div>${caseLink('hidamari', 'hidamari · in progress', 'ed-link')}${caseLink('elderwood', 'Elderwood Vale · in progress', 'ed-link')}</div></div>
      </section>
      <section class="ed-about" id="about" aria-labelledby="ed-about-title"><div class="ed-about-copy"><p class="ed-label">A little context</p><h2 id="ed-about-title">Two degrees.<br>One habit.</h2><p>I studied computer science and astrophysics at UMass Amherst. Algorithms and General Relativity landed in the same problem-set pile.</p><p>In college, I simulated CO₂ cooling for particle detectors. Now I simulate an ocean. I learn things by building them.</p><p class="ed-personal">Away from the keyboard: heirloom tomatoes, bikes and Pink Floyd, roughly in that order.</p></div><div class="ed-record"><p class="ed-label">The professional thread</p>${[
        'notable',
        'harvest',
        'umassDev',
      ]
        .map((key) => {
          const r = roles.find((v) => v.key === key);
          return `<details><summary><span><strong>${esc(r.org)}</strong><small>${esc(r.title)}</small></span><span class="ed-record-date">${esc(r.when)}<i aria-hidden="true">+</i></span></summary><div><p>${esc(key === 'notable' ? 'My team owns the voice and conversations platform. I lead technical direction, mentor engineers and turn incidents into platform fixes.' : r.body)}</p>${key === 'notable' ? caseLink('notable', 'Read the professional case', 'ed-link') : ''}</div></details>`;
        })
        .join('')}${out(contact.resume, 'Full résumé', 'ed-link')}</div></section>
      <section class="ed-contact" aria-labelledby="ed-contact-title"><div><p class="ed-label">Correspondence</p><h2 id="ed-contact-title">What are you working on?</h2></div>${email('Let’s compare notes', 'ed-link')}</section>
    </main><footer class="ed-footer"><a class="ed-brand" href="#top">AJ Uppal<span>.</span></a><p>Software engineer. Still curious.</p><div>${out(contact.github, 'GitHub')}${out(contact.linkedin, 'LinkedIn')}${email('Email')}</div></footer>
  </div>`,
    { scripts: ['editorial.js'], title: 'AJ Uppal — Serious systems. Curious mind.' },
  );
}
