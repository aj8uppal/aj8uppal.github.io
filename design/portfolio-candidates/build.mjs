/** Review concepts only. Node 24 reads the project's existing TypeScript data. */
import { writeFile } from 'node:fs/promises';
import { format, resolveConfig } from 'prettier';
import {
  contact,
  about,
  roles,
  saltline,
  saltlineArc,
  murmuration,
  ember,
} from '../../src/data/content.ts';
import { apps } from '../../src/data/built.ts';

const esc = (v) =>
  String(v)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const url = (v) => new URL(v, 'https://aj8uppal.github.io').href;
const asset = (key) => `../../src/assets/${key}.webp`;
const img = (key, alt, attrs = '') => `<img src="${asset(key)}" alt="${esc(alt)}" ${attrs}>`;
const out = (href, label, cls = '') =>
  `<a class="${cls}" href="${esc(url(href))}" target="_blank" rel="noopener">${label}<span aria-hidden="true"> ↗</span></a>`;
const email = (label = 'Get in touch', cls = '') =>
  `<a class="${cls}" href="mailto:${contact.email}">${label}<span aria-hidden="true"> ↗</span></a>`;
const arrow = '<span aria-hidden="true">↗</span>';
const record = apps.find((a) => a.key === 'beatlayer');

const concepts = [
  {
    key: 'editorial',
    n: '01',
    name: 'The Editorial',
    phrase: 'A clear introduction. A few undeniable projects.',
    character: 'Considered · confident · human',
    best: 'A portfolio that works equally well for hiring managers, peers, and potential collaborators.',
    premise:
      'Treat the homepage like the opening spread of a good magazine: a clear point of view, a strong image, and an invitation to read further.',
    structure:
      'Introduction → three selected projects → a concise experience record → contact. The complete archive and individual case studies get their own pages.',
    interaction:
      'Each project has a short explanation of your contribution and one hard engineering decision. The concept includes expandable project notes and experience; in the full site these become dedicated case studies.',
    mobile:
      'The image follows the introduction immediately. Project notes stay optional; the experience record becomes a compact vertical list.',
    tradeoff:
      'The most versatile direction, but less immediately playful. It depends on ruthless project selection and excellent writing.',
    effort:
      'Lowest build complexity. Most of the work is editing and arranging the existing material.',
  },
  {
    key: 'studio',
    n: '02',
    name: 'Open Studio',
    phrase: 'Walk in. Pick something up. Try it.',
    character: 'Direct · colorful · hands-on',
    best: 'People who should remember you as a prolific product builder and come back to see what you make next.',
    premise:
      'Make the site feel like visiting your workbench. One little interaction invites participation, then a shelf of useful and strange things gives people somewhere to go.',
    structure:
      'A tiny playable introduction → a filterable project shelf → a short professional introduction → contact. New releases live in the archive instead of extending the homepage.',
    interaction:
      'The angle exercise is playable with a slider or arrow keys. Project filters switch between games, tools, and sound. Every project has a direct link to the existing app.',
    mobile:
      'The playable exercise follows the headline. The shelf becomes a two-column thumbnail grid; no drag-only desktop metaphors.',
    tradeoff:
      'Easy to explore and share, but a shelf can make substantial systems work look like a weekend toy. A visible professional section and a small number of deep case studies are essential.',
    effort:
      'Medium build complexity. Keep just one lightweight interactive sample on the homepage.',
  },
  {
    key: 'field-notes',
    n: '03',
    name: 'Field Notes',
    phrase: 'The engineer with a physicist’s curiosity.',
    character: 'Observant · precise · quietly unusual',
    best: 'Technical peers and teams who want to understand how you think, not only what you shipped.',
    premise:
      'Organize the work around the questions that made you build it. Computer science and astrophysics become an editorial point of view, expressed through experiments, figures, and concise explanations.',
    structure:
      'One question and an interactive figure → three investigations → the professional record → contact. Each investigation becomes a short, illustrated case study.',
    interaction:
      'Move a clock through six actual saltline captures. The seed and wind settings stay fixed, making the difference in light the subject. This is a sequence of recorded frames, not live simulation.',
    mobile:
      'The figure comes directly after the question; the margin notes move underneath. The native slider supports touch, mouse, and keyboard.',
    tradeoff:
      'The most specific to your background. It requires a few strong technical essays and can feel academic if the playful projects disappear.',
    effort:
      'Medium to high editorial effort. Reuse real captures and existing interactive models; avoid building a custom demo for every article.',
  },
  {
    key: 'worldbuilder',
    n: '04',
    name: 'Worldbuilder',
    phrase: 'A browser tab as a place you can go.',
    character: 'Immersive · atmospheric · ambitious',
    best: 'A memorable creative engineering identity, especially for graphics, simulation, games, and interactive work.',
    premise:
      'Let the worlds you made establish the mood. A single large scene anchors the page, with a small, deliberate selector that moves between an ocean, a realm, and a field of light.',
    structure:
      'A featured world → a three-project selector → the engineering behind it → a short professional introduction → an invitation to collaborate.',
    interaction:
      'The world selector changes the real screenshot, project title, explanation, and launch link. No autoplay or scroll hijacking. A production version could add opt-in motion after the still loads.',
    mobile:
      'One still, one title, and one obvious launch action. The selector stays visible below the scene; the entire site works without WebGL.',
    tradeoff:
      'The strongest first impression, but it foregrounds games and graphics more than your healthcare and infrastructure work. Large media also needs a strict loading budget.',
    effort:
      'Highest art-direction and media effort. Ship the still-image version first and add motion only when it earns its cost.',
  },
];

function frame(key, body, script = '') {
  const c = concepts.find((v) => v.key === key);
  const next = concepts[(concepts.indexOf(c) + 1) % concepts.length];
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${c.name} — AJ Uppal / direction ${c.n}</title>
<meta name="description" content="${esc(c.phrase)} A portfolio design exploration for AJ Uppal.">
<link rel="stylesheet" href="shared.css"><link rel="stylesheet" href="${key}.css">
<script>if(new URLSearchParams(location.search).has('capture'))document.documentElement.dataset.capture='';</script>
</head><body class="${key}"><a class="skip-link" href="#main">Skip to content</a>
<aside class="review-bar" aria-label="Design review navigation"><a href="index.html">← All four directions</a><span>${c.n} / ${c.name}</span><a href="${next.key}.html">${next.n} / ${next.name} →</a></aside>
${body}
<script src="interactions.js" defer></script>${script}</body></html>`;
}

const footer = (extra = '') =>
  `<footer class="site-footer"><a href="#top">AJ Uppal ${extra}</a><span>Software engineer · Bay Area</span><div>${out(contact.github, 'GitHub')}${out(contact.resume, 'Résumé')}${email('Email')}</div></footer>`;

const editorialProjects = [
  {
    data: saltline,
    key: 'saltline-lead-dawn',
    category: 'SIMULATION / MULTIPLAYER',
    title: 'An ocean with rules.',
    body: 'A sailing game where the wind matters. Built from the physics up, all the way to a shared sea.',
    alt: saltline.lead.alt,
  },
  {
    data: murmuration,
    key: 'murmuration-lead-ribbon',
    category: 'AUDIO / WEBGPU',
    title: 'Light that listens.',
    body: 'A music visualizer that finds the key, the rhythm, and the moments where a song stops to breathe.',
    alt: murmuration.lead.alt,
  },
  {
    data: ember,
    key: 'ember-spread-fallowmere-dusk',
    category: 'GAMES / DISTRIBUTED SYSTEMS',
    title: 'One world. Everyone in it.',
    body: 'A browser MMORPG with seven regions and one authoritative realm server holding it together.',
    alt: emberRegionsAlt(),
  },
];
function emberRegionsAlt() {
  return 'Ember Wilds running in Fallowmere at dusk: a voxel world, quest panels, and a level-30 character.';
}

const editorial = frame(
  'editorial',
  `
<div class="ed-shell" id="top">
<header class="ed-nav"><a class="ed-brand" href="#top">AJ Uppal<span class="brand-dot">.</span></a><nav aria-label="Main"><a href="#work">Selected work</a><a href="#about">About</a>${email('Say hello')}</nav></header>
<main id="main">
<section class="ed-hero" aria-labelledby="ed-title"><div class="ed-intro"><p class="eyebrow">SOFTWARE ENGINEER / BAY AREA, CA</p><h1 id="ed-title">Serious systems.<br><em>Curious mind.</em></h1><div class="ed-intro-bottom"><p>I’m AJ. I build healthcare software at Notable and, off the clock, worlds that run in a browser.</p><a class="text-link" href="#work">A few things I’ve made <span aria-hidden="true">↓</span></a></div></div><aside class="ed-margin"><span class="ed-asterisk" aria-hidden="true">✳</span><p>Computer science.<br>Astrophysics.<br>A habit of making things.</p><span class="eyebrow">TWO DEGREES, ONE CURIOSITY</span></aside></section>
<section class="ed-work" id="work" aria-labelledby="ed-work-title"><div class="section-line"><h2 id="ed-work-title">Selected work</h2><span>THREE WAYS I THINK THROUGH CODE</span></div>
${editorialProjects.map((p, i) => `<article class="ed-project" id="ed-${p.data.name.replaceAll(' ', '-')}"><div class="ed-project-copy"><p class="eyebrow">0${i + 1} / ${p.category}</p><h3>${p.title}</h3><p>${p.body}</p><details><summary>Inside ${p.data.name} <span aria-hidden="true">+</span></summary><div class="ed-notes"><strong>What I built</strong><p>${esc(p.data.skim.role)}</p><strong>The hard part</strong><p>${esc(p.data.skim.hard)}</p></div></details>${out(p.data.href, `Open ${p.data.name}`, 'text-link')}</div><figure>${img(p.key, p.alt, i ? 'loading="lazy"' : 'fetchpriority="high"')}<figcaption><span>${p.data.name}</span><span>CAPTURED FROM THE RUNNING PROJECT ${arrow}</span></figcaption></figure></article>`).join('')}
<a class="ed-archive" href="${url('/built/')}" target="_blank" rel="noopener"><span>There’s more on the workbench.</span><span>Explore the app archive ${arrow}</span></a></section>
<section class="ed-about" id="about"><p class="eyebrow">THE PERSON BEHIND THE PROJECTS</p><div><h2>I learn things<br>by building them.</h2><p>${esc(about.prose[0])}</p><p>Off the clock: heirloom tomatoes, bikes, and Pink Floyd, roughly in that order.</p></div><div class="ed-record">${roles
    .slice(0, 3)
    .map(
      (r) =>
        `<details><summary><span>${esc(r.org)}<small>${esc(r.title)}</small></span><span>${esc(r.when)} +</span></summary><p>${esc(r.body)}</p></details>`,
    )
    .join('')}${out(contact.resume, 'The full résumé', 'text-link')}</div></section>
<section class="ed-contact"><p class="eyebrow">SOMETHING INTERESTING IN MIND?</p><h2>Let’s talk it through.</h2>${email(contact.email, 'text-link')}</section>
</main>${footer()}</div>`,
);

const shelfKeys = ['beatlayer', 'eyeshot', 'voidreach', 'run-or-not', 'sixty-seconds', 'lifetrack'];
const categories = {
  beatlayer: 'sound',
  eyeshot: 'games',
  voidreach: 'games',
  'run-or-not': 'tools',
  'sixty-seconds': 'games',
  lifetrack: 'tools',
};
const studio = frame(
  'studio',
  `
<div class="st-shell" id="top"><header class="st-nav"><a class="st-brand" href="#top"><span aria-hidden="true">a<span class="st-brand-j">j</span></span><b>AJ UPPAL<br>OPEN STUDIO</b></a><nav aria-label="Main"><a href="#shelf">The shelf</a><a href="#about">About AJ</a>${email('Say hey')}</nav></header>
<main id="main"><section class="st-hero"><div class="st-intro"><p class="eyebrow"><span class="square-dot" aria-hidden="true"></span> SOFTWARE ENGINEER. SERIAL MAKER.</p><h1>Made to<br>be <span class="st-word">played<svg viewBox="0 0 470 34" aria-hidden="true"><path d="M8 24Q224 1 458 15M23 31Q224 13 400 25"/></svg></span> with.</h1><p>Worlds, instruments, useful little things.<br>I’m AJ. Welcome to the workbench.</p><a class="st-button" href="#shelf">Find something to try <span aria-hidden="true">↘</span></a><span class="st-side-note">Go on. Touch something.</span></div>
<section class="angle-toy" aria-labelledby="toy-title"><div class="toy-header"><span class="eyebrow">A LITTLE WARM-UP</span><span class="toy-badge">INTERACTIVE</span></div><h2 id="toy-title">How’s your eye?</h2><p>Make this angle <strong>115°</strong>.</p><svg class="angle-drawing" viewBox="0 0 420 260" role="img" aria-label="An adjustable angle with a horizontal reference arm"><circle cx="210" cy="190" r="135" fill="none" stroke="currentColor" stroke-opacity=".15" stroke-dasharray="3 7"/><path d="M210 54V220M57 190H361" stroke="currentColor" stroke-opacity=".15"/><path d="M210 190H345" stroke="#253ddd" stroke-width="5" stroke-linecap="round"/><path id="angle-arc" d="M252 190 A42 42 0 0 0 218 149" fill="none" stroke="#f1653e" stroke-width="2"/><g id="angle-arm" transform="rotate(-78 210 190)"><path d="M210 190H345" stroke="#253ddd" stroke-width="5" stroke-linecap="round"/><circle cx="345" cy="190" r="8" fill="#253ddd"/></g><circle cx="210" cy="190" r="6" fill="#253ddd"/></svg><label class="sr-only" for="angle-input">Adjust the angle, then check your guess</label><input id="angle-input" type="range" min="10" max="170" value="78" aria-valuetext="Guess an angle of 115 degrees"><div class="toy-bottom"><span id="angle-result" aria-live="polite">Slide. Trust your eye.</span><button id="angle-check" type="button">Check it ${arrow}</button></div><a class="toy-credit" href="${url('https://eyeshot.app/')}" target="_blank" rel="noopener">A taste of Eyeshot. Play the real thing ↗</a></section></section>
<section class="st-shelf" id="shelf"><div class="st-shelf-head"><h2>Off the workbench<span aria-hidden="true">↙</span></h2><div class="st-filters" role="group" aria-label="Filter projects">${['all', 'games', 'tools', 'sound'].map((f, i) => `<button type="button" data-filter="${f}" aria-pressed="${i === 0}">${f === 'all' ? 'Everything' : f[0].toUpperCase() + f.slice(1)}</button>`).join('')}</div></div><p class="sr-only" id="filter-status" aria-live="polite">6 projects shown</p><div class="st-grid">${shelfKeys
    .map((key, i) => {
      const a = apps.find((v) => v.key === key);
      return `<article class="st-card st-card-${key}" data-category="${categories[key]}"><a href="${url(a.href)}" target="_blank" rel="noopener"><div class="st-card-image">${img(`built-${key}`, a.alt, i > 2 ? 'loading="lazy"' : '')}<span class="st-card-launch" aria-hidden="true">↗</span></div><div class="st-card-text"><span class="eyebrow">${esc(a.kind).toUpperCase()}</span><h3>${esc(a.name)}</h3><p>${esc(a.what)}</p></div></a></article>`;
    })
    .join(
      '',
    )}</div><a class="st-all" href="${url('/built/')}" target="_blank" rel="noopener">The whole shelf, including the odd ones ${arrow}</a></section>
<section class="st-about" id="about"><div><p class="eyebrow">THERE’S A DAY JOB, TOO.</p><h2>Playful work.<br>Serious engineering.</h2></div><div><p>I’m a software engineer at Notable Health, working across voice AI, integrations, and the systems under them.</p><p>Computer science and astrophysics at UMass. Still learning by making things.</p><div class="st-about-links">${out(contact.resume, 'Résumé')}${out(contact.github, 'GitHub')}${email('Let’s talk')}</div></div></section></main>${footer()}</div>`,
);

const firstFrame = saltlineArc[2];
const fieldNotes = frame(
  'field-notes',
  `
<div class="fn-shell" id="top"><header class="fn-nav"><a class="fn-brand" href="#top"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18"/><ellipse cx="24" cy="24" rx="9" ry="23" transform="rotate(35 24 24)"/><path d="M2 24H46M24 2V46"/><circle cx="37" cy="13" r="3" fill="currentColor"/></svg><span>AJ Uppal<span>FIELD NOTES</span></span></a><nav aria-label="Main"><a href="#investigations">Investigations</a><a href="#record">The record</a>${email('Correspondence')}</nav><span class="fn-folio eyebrow">VOL. 01 / AN OPEN NOTEBOOK</span></header>
<main id="main"><section class="fn-intro"><p class="eyebrow">SOFTWARE ENGINEERING × ASTROPHYSICS</p><h1>Follow the question.<br><em>Build the answer.</em></h1><div class="fn-intro-note"><span class="fn-note-star" aria-hidden="true">✳</span><p>I’m AJ. I make software to understand how things work. Sometimes that means a healthcare system. Sometimes, an ocean.</p></div></section>
<section class="fn-feature" id="investigations" aria-labelledby="fn-question"><aside class="fn-margin"><p class="eyebrow">INVESTIGATION 001</p><h2 id="fn-question">What makes an<br>ocean feel alive?</h2><p>Hold the world still.<br>Move the light.</p><dl><div><dt>Project</dt><dd>saltline</dd></div><div><dt>Seed</dt><dd>4193</dd></div><div><dt>Sea state</dt><dd>Moderate</dd></div><div><dt>Wind setting</dt><dd>40°</dd></div></dl><p class="fn-pencil">Same rules.<br>Six different moods.<svg viewBox="0 0 120 60" aria-hidden="true"><path d="M4 4Q50 60 106 32M90 26L108 32L99 47"/></svg></p>${out(saltline.href, 'Sail this ocean', 'text-link')}</aside><figure class="fn-experiment"><div class="fn-photo">${img(`saltline-arc-${firstFrame.key}`, firstFrame.alt, 'id="clock-image" fetchpriority="high"')}<span class="fn-figure-label">FIG. 01 / A CONTROLLED CHANGE</span></div><figcaption><div class="fn-clock-title"><label for="clock-input">Time of day</label><output id="clock-output" for="clock-input">${firstFrame.time} / ${firstFrame.light}</output></div><input id="clock-input" type="range" min="0" max="5" step="1" value="2" aria-valuetext="${firstFrame.time}, ${firstFrame.light}"><div class="fn-clock-ticks" aria-hidden="true">${saltlineArc.map((f) => `<span>${f.time}</span>`).join('')}</div><p>Drag the clock, or use the arrow keys. Six recorded frames from the running game; only the time-of-day setting changed.</p></figcaption></figure></section>
<section class="fn-observation"><p class="eyebrow">THE OBSERVATION</p><h2>The same code can feel<br>like six different places.</h2><div><p>A seeded ocean gives me a controlled starting point. With the sea and wind settings fixed, the clock changes what the water reflects and how far the horizon seems to go.</p><p>The sailing has its own rules, too: point too close to the wind and the boat stops. The renderer and the simulation have to agree on the world.</p>${out(saltline.href, 'Explore saltline', 'text-link')}</div></section>
<section class="fn-other"><div class="section-line"><h2>Further investigations</h2><span>FOLLOW ANOTHER THREAD</span></div><div class="fn-studies"><a href="${url(murmuration.href)}" target="_blank" rel="noopener"><span class="eyebrow">002 / AUDIO & PERCEPTION</span>${img('murmuration-frame-constellation', murmuration.proof.alt, 'loading="lazy"')}<h3>Can a field of light<br>hear a song breathe? ${arrow}</h3><p>murmuration · Audio analysis and WebGPU</p></a><a href="${url(ember.href)}" target="_blank" rel="noopener"><span class="eyebrow">003 / SHARED STATE</span>${img('ember-proof-two-players', 'Two browsers connected to the same realm in Ember Wilds.', 'loading="lazy"')}<h3>What makes a world<br>the same for everyone? ${arrow}</h3><p>Ember Wilds · An authoritative realm server</p></a><a href="${url(record.href)}" target="_blank" rel="noopener"><span class="eyebrow">004 / RHYTHM & SIGNAL</span>${img('built-beatlayer', record.alt, 'loading="lazy"')}<h3>Can the drums follow<br>the player? ${arrow}</h3><p>BeatLayer · Beat detection and synthesis</p></a></div></section>
<section class="fn-record" id="record"><p class="eyebrow">A SHORT PROFESSIONAL RECORD</p><h2>Curiosity, put to work.</h2><div class="fn-record-row"><span>2022 — PRESENT</span><h3>Notable Health</h3><p>Software engineer. Voice AI, healthcare integrations, patient identity, routing, and reliability.</p></div><div class="fn-record-row"><span>EDUCATION</span><h3>UMass Amherst</h3><p>B.S. Computer Science<br>B.S. Astrophysics</p></div>${out(contact.resume, 'Read the full résumé', 'text-link')}</section><section class="fn-contact"><p class="eyebrow">CORRESPONDENCE</p><h2>What are you wondering about?</h2>${email(contact.email, 'text-link')}</section></main>${footer()}</div>`,
  `<script type="application/json" id="clock-data">${JSON.stringify(saltlineArc.map((f) => ({ ...f, src: asset(`saltline-arc-${f.key}`) }))).replaceAll('<', '\\u003c')}</script>`,
);

const worlds = [
  {
    key: 'saltline',
    name: saltline.name,
    kind: '01 / A SIMULATED SEA',
    src: asset('saltline-lead-dawn'),
    alt: saltline.lead.alt,
    description: 'Captain a sloop. Read the wind. Find out what’s beyond the next island.',
    href: saltline.href,
    note: 'The sailing model, the renderer, and a shared sea for up to twenty players.',
  },
  {
    key: 'ember',
    name: ember.name,
    kind: '02 / A SHARED REALM',
    src: asset('ember-spread-fallowmere-dusk'),
    alt: emberRegionsAlt(),
    description: 'Seven regions. One shared world. A browser tab is all it takes to step inside.',
    href: ember.href,
    note: 'A web tier and an authoritative realm service keep one world consistent for everyone in it.',
  },
  {
    key: 'murmuration',
    name: murmuration.name,
    kind: '03 / A FIELD THAT LISTENS',
    src: asset('murmuration-lead-ribbon'),
    alt: murmuration.lead.alt,
    description: 'Give it a song. Watch a field of light find the rhythm, the key, and the breath.',
    href: murmuration.href,
    note: 'Audio analysis and a WebGPU particle renderer, written from the signal to the screen.',
  },
];
const worldbuilder = frame(
  'worldbuilder',
  `
<div id="top"><section class="wb-cover"><img class="wb-scene" id="world-image" src="${worlds[0].src}" alt="${esc(worlds[0].alt)}" fetchpriority="high"><div class="wb-wash" aria-hidden="true"></div><header class="wb-nav"><a class="wb-brand" href="#top">AJ UPPAL<span>SOFTWARE ENGINEER & WORLD MAKER</span></a><nav aria-label="Main"><a href="#worlds">The worlds</a><a href="#about">The engineer</a>${email('Get in touch')}</nav></header><main id="main"><div class="wb-hero"><p class="eyebrow">IMAGINED, ENGINEERED, AND RUNNING IN A TAB.</p><h1>Small tabs.<br><em>Whole worlds.</em></h1><div class="wb-hero-bottom"><div class="wb-featured" aria-live="polite"><p class="eyebrow" id="world-kind">${worlds[0].kind}</p><h2 id="world-name">${worlds[0].name}</h2><p id="world-description">${worlds[0].description}</p></div><a class="wb-enter" id="world-link" href="${worlds[0].href}" target="_blank" rel="noopener"><span id="world-link-label">Enter saltline</span><span aria-hidden="true">↗</span></a></div></div></main><div class="wb-worlds" id="worlds" aria-label="Choose a featured world"><p class="eyebrow">CHOOSE A WORLD<span>Actual captures. Yours to explore.</span></p><div class="wb-selectors" role="group" aria-label="Featured world">${worlds.map((w, i) => `<button type="button" data-world="${i}" aria-pressed="${i === 0}"><img src="${w.src}" alt=""><span><small>0${i + 1}</small>${w.name}</span><span class="wb-select-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></div></section>
<section class="wb-under"><div class="wb-under-head"><p class="eyebrow">BEHIND THE ATMOSPHERE</p><h2>A world only works<br>if the <em>system does.</em></h2></div><div class="wb-engineering">${worlds.map((w, i) => `<article><span class="eyebrow">0${i + 1} / ${w.name.toUpperCase()}</span><p>${esc(w.note)}</p>${out(w.href, `Explore ${w.name}`, 'text-link')}</article>`).join('')}</div></section>
<section class="wb-about" id="about"><div><p class="eyebrow">THE ENGINEER</p><h2>I’m AJ.<br>I like making<br>things <em>work.</em></h2></div><div><p>By day, I build across the stack at Notable Health: healthcare integrations, voice AI, and the systems underneath.</p><p>I studied computer science and astrophysics. I’m still following the same curiosity, from patient conversations to simulated oceans.</p><div class="wb-about-links">${out(contact.resume, 'Résumé')}${out(contact.github, 'GitHub')}${out('/built/', 'The smaller experiments')}</div></div></section><section class="wb-contact"><p class="eyebrow">HAVE A WORLD IN MIND?</p><h2>Let’s make it <em>real.</em></h2>${email(contact.email, 'text-link')}</section>${footer()}</div>`,
  `<script type="application/json" id="world-data">${JSON.stringify(worlds).replaceAll('<', '\\u003c')}</script>`,
);

const comparison = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Four possible portfolios — AJ Uppal</title><link rel="stylesheet" href="shared.css"><link rel="stylesheet" href="index.css"></head><body class="comparison"><a class="skip-link" href="#main">Skip to content</a><div class="cmp-shell"><header class="cmp-nav"><a href="index.html">AJ / POSSIBLE FUTURES</a><span>FOUR PORTFOLIO DIRECTIONS · SEPTEMBER 2026</span></header><main id="main"><section class="cmp-intro"><div><p class="eyebrow">A GROUND-UP RETHINK</p><h1>Four ways to<br>meet your work<span>.</span></h1></div><div><p class="cmp-lead">The same engineer.<br>Four different first impressions.</p><p>Your portfolio can lead with clarity, play, curiosity, or atmosphere. These concepts use your real projects and captures, with distinct layouts and working interactions.</p></div></section><div class="cmp-controls"><p>OPEN A DIRECTION TO TRY IT</p><div role="group" aria-label="Preview size"><button type="button" data-preview="desktop" aria-pressed="true">Desktop</button><button type="button" data-preview="mobile" aria-pressed="false">Mobile</button></div></div><section class="cmp-grid" aria-label="Four design candidates">${concepts.map((c) => `<article class="cmp-card cmp-${c.key}"><a class="cmp-preview" href="${c.key}.html" aria-label="Explore direction ${c.n}, ${c.name}"><img src="previews/${c.key}-desktop.webp" data-preview-image="${c.key}" alt="Desktop homepage concept for ${c.name}" width="1440" height="1000"><span class="cmp-open">Explore ${c.n} ↗</span></a><div class="cmp-card-title"><span class="cmp-number">${c.n}</span><div><p class="eyebrow">${c.character}</p><h2><a href="${c.key}.html">${c.name}</a></h2></div>${c.key === 'field-notes' ? '<span class="cmp-pick">MY PICK</span>' : ''}</div><p class="cmp-phrase">${c.phrase}</p><p>${c.premise}</p><details><summary>The approach & tradeoffs <span aria-hidden="true">+</span></summary><dl><dt>Best for</dt><dd>${c.best}</dd><dt>How the site is organized</dt><dd>${c.structure}</dd><dt>The interaction</dt><dd>${c.interaction}</dd><dt>On a phone</dt><dd>${c.mobile}</dd><dt>The tradeoff</dt><dd>${c.tradeoff}</dd><dt>What it takes</dt><dd>${c.effort}</dd></dl></details><a class="cmp-explore" href="${c.key}.html">Explore ${c.name} ${arrow}</a></article>`).join('')}</section><section class="cmp-recommend"><p class="eyebrow">WHERE I’D START</p><h2>03 for the most “you.”<br>01 for the broadest appeal.</h2><div><p><strong>Field Notes</strong> makes your combination of astrophysics, systems engineering, and playful projects feel intentional. It gives a visitor something specific to remember: you follow a question far enough to build the answer.</p><p><strong>The Editorial</strong> is my choice if the primary job is helping a hiring manager quickly understand your range. It makes the few strongest pieces easy to find and gives your professional work clear weight.</p></div></section><section class="cmp-common"><h2>Whichever direction wins</h2><div><article><span>01</span><h3>Show the work immediately.</h3><p>A real project or a hands-on sample belongs in the first screen. Your name doesn’t need an entire screen to itself.</p></article><article><span>02</span><h3>Give depth its own address.</h3><p>Three selected stories on the homepage. A case-study page for each; one archive for everything else. Aim for roughly three to five desktop screens.</p></article><article><span>03</span><h3>Keep the proof, cut the repeat.</h3><p>Real screenshots, honest status, and direct app links. Fold skills into the work that proves them. Keep legacy demo URLs intact.</p></article></div></section></main><footer class="cmp-footer"><p>Local design studies · Navigation, filters, the angle toy, and scene controls work.</p><p>Case-study routes and the full archive are proposed architecture; project links open the existing apps. Nothing here is a production redesign.</p></footer></div><script src="interactions.js" defer></script></body></html>`;

for (const [key, html] of Object.entries({
  index: comparison,
  editorial,
  studio,
  'field-notes': fieldNotes,
  worldbuilder,
})) {
  const file = new URL(`./${key}.html`, import.meta.url);
  await writeFile(
    file,
    await format(html, { ...(await resolveConfig(file.pathname)), parser: 'html' }),
  );
}
process.stdout.write('Generated four portfolio concepts and their comparison page.\n');
