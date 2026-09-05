import { frame, img, esc, project, caseLink, out, email, contact } from './shared.mjs';

const lenses = [
  {
    key: 'systems',
    label: 'Systems',
    kicker: '01 / At work',
    title: 'Make it dependable.',
    copy: 'I set technical direction for identity, routing, observability and reliability at Notable. A patient call crosses a lot of systems; I work on the seams.',
    fact: '~250k',
    unit: 'patient calls a month<br>on our team’s platform',
    tags: ['Patient identity', 'Routing', 'Reliability'],
    proof: 'notable',
    link: 'Inside my work at Notable',
  },
  {
    key: 'worlds',
    label: 'Worlds',
    kicker: '02 / After hours',
    title: 'Build the whole world.',
    copy: 'I like carrying an idea all the way through: a sailing model, the world around it, the multiplayer service and the accounts that remember you.',
    fact: '20',
    unit: 'players sharing a sea<br>in saltline',
    image: 'saltline-lead-dawn',
    alt: project('saltline').alt,
    proof: 'saltline',
    link: 'From physics to a shared sea',
  },
  {
    key: 'sound',
    label: 'Sound',
    kicker: '03 / A different frequency',
    title: 'Listen a little closer.',
    copy: 'In murmuration, I turn key, rhythm and stereo placement into motion. Quiet is part of the signal, too. Pink Floyd makes a good test track.',
    fact: '620k',
    unit: 'particles in 8.07ms<br>of GPU time',
    note: 'Measured at 1800 × 3043. Hardware unspecified in the capture record.',
    image: 'murmuration-frame-constellation',
    alt: project('murmuration').alt,
    proof: 'murmuration',
    link: 'How the particles listen',
  },
  {
    key: 'life',
    label: 'Off the clock',
    kicker: '04 / A little more AJ',
    title: 'Curiosity spills over.',
    copy: 'I studied computer science and astrophysics because I couldn’t choose. Away from the keyboard: heirloom tomatoes, bikes and Pink Floyd, roughly in that order.',
    fact: '2',
    unit: 'B.S. degrees<br>one very curious person',
    tags: ['Computer science', 'Astrophysics'],
    link: 'More about me',
    href: '#about',
  },
];

const shelf = [
  {
    key: 'saltline',
    hook: 'Make the wind something you can learn.',
    role: 'Sailing physics, rendering, multiplayer, accounts.',
    decision:
      'I expose wind, heel and velocity made good so the simulation teaches you how to sail.',
    fact: 'Up to 20 players / Babylon.js + Colyseus',
  },
  {
    key: 'ember',
    hook: 'One realm. The same world for everyone.',
    role: 'Browser client, realm service, production deployment.',
    decision:
      'An authoritative server owns quests, loot and combat; the browser stays a responsive renderer.',
    fact: '7 regions / Realms for up to 64 players',
  },
  {
    key: 'murmuration',
    hook: 'A renderer with an ear for the music.',
    role: 'Audio analysis, compute shaders, interaction.',
    decision:
      'I use chroma, rhythm, transients and stereo placement to give particles something richer to follow.',
    fact: 'WebGPU / 620k particles / 8.07ms GPU time at 1800 × 3043',
  },
  {
    key: 'blockhold',
    hook: 'A whole campaign, described in code.',
    role: 'Voxel modeler, simulation, maps, waves, balance.',
    decision:
      'A fixed 60Hz simulation separates the battle from the frame rate. Boxes, synthesis and SVG supply the art.',
    fact: '10 maps / 249 waves / 154 tests',
  },
  {
    key: 'cubit',
    hook: 'Teach your thumb a third dimension.',
    role: 'The complete engine, renderer, input and sound.',
    decision:
      'I score swipes against projected axes and make blocked tiles translucent, so the hidden layers stay legible.',
    fact: 'One 553 KB HTML file / 62 tests',
  },
];

function lens(item) {
  return `<section class="st-lens-panel st-lens-${item.key}" id="st-lens-${item.key}" data-st-panel="${item.key}" aria-labelledby="st-lens-title-${item.key}"><p class="st-label">${item.kicker}</p><h2 id="st-lens-title-${item.key}">${item.title}</h2><p class="st-lens-copy">${item.copy}</p><div class="st-proof ${item.image ? 'st-proof-photo' : ''}">${item.image ? img(item.image, item.alt, 'loading="lazy"') : ''}<div class="st-proof-figure"><strong>${item.fact}</strong><span>${item.unit}</span></div>${item.tags ? `<ul class="st-proof-tags" aria-label="${item.key === 'systems' ? 'Areas of technical focus' : 'Degrees'}">${item.tags.map((tag) => `<li>${esc(tag)}</li>`).join('')}</ul>` : ''}</div>${item.note ? `<p class="st-proof-note">${esc(item.note)}</p>` : ''}${item.proof ? caseLink(item.proof, item.link, 'st-link') : `<a class="st-link" href="${item.href}">${item.link} <span aria-hidden="true">↓</span></a>`}</section>`;
}

function card(item, index) {
  const p = project(item.key);
  return `<article class="st-card st-card-${p.key} ${index < 2 ? 'st-card-featured' : ''}" id="st-${p.key}"><figure><a href="cases/${p.key}.html" data-case="${p.key}" aria-label="Read how AJ built ${esc(p.name)}">${img(p.image, p.alt, index < 2 ? '' : 'loading="lazy"')}<span class="st-image-label">${esc(p.name)} <span aria-hidden="true">↗</span></span></a></figure><div class="st-card-body"><div class="st-card-meta"><p class="st-label">0${index + 1} / ${esc(p.kind)}</p><span class="st-status">Live</span></div><h3>${item.hook}</h3><p class="st-role"><strong>I built</strong> ${item.role}</p><p class="st-decision">${item.decision}</p><p class="st-card-fact">${item.fact}</p><div class="st-card-links">${caseLink(p.key, 'The decisions', 'st-link')}${out(p.href, 'Try it', 'st-link st-link-quiet')}</div></div></article>`;
}

export default function render() {
  return frame(
    'studio',
    `<div class="st-shell" id="top"><header class="st-nav"><a class="st-brand" href="#top" aria-label="AJ Uppal, Open Studio"><span aria-hidden="true">a<span>j</span></span><b>AJ UPPAL<br>OPEN STUDIO</b></a><nav aria-label="Main navigation"><a href="#work">My work</a><a href="#about">About AJ</a>${email('Say hey')}</nav></header>
  <main id="main"><section class="st-hero" aria-labelledby="st-title"><div class="st-intro"><p class="st-label"><span class="st-square" aria-hidden="true"></span> Software engineer at Notable Health</p><h1 id="st-title">Hi, I’m AJ.<br>I learn by<br><span class="st-word">building.<svg viewBox="0 0 420 22" preserveAspectRatio="none" aria-hidden="true"><path d="M3 13Q210 -1 413 12M21 19Q220 10 381 20"/></svg></span></h1><p class="st-lede">Healthcare systems by day.<br>Worlds, instruments and curious little experiments in the hours around them.</p><div class="st-intro-links"><a href="#work" class="st-button">Explore my work <span aria-hidden="true">↘</span></a>${out(contact.resume, 'Résumé', 'st-link')}</div><p class="st-handwritten">A few sides of the same person. <span aria-hidden="true">⤷</span></p></div><aside class="st-profile" aria-label="Explore a few sides of AJ"><div class="st-profile-top"><span class="st-label">The person at the workbench</span><span class="st-profile-mark" aria-hidden="true">✳</span></div><div class="st-lenses" role="group" aria-label="Explore AJ’s interests" hidden>${lenses.map((l, i) => `<button type="button" data-st-lens="${l.key}" aria-pressed="${i === 0}" aria-controls="st-lens-${l.key}">${l.label}</button>`).join('')}</div><div class="st-lens-pages">${lenses.map(lens).join('')}</div><p class="st-visually-hidden" data-st-status aria-live="polite"></p></aside></section>
  <section class="st-work" id="work" aria-labelledby="st-work-title"><div class="st-section-heading"><div><p class="st-label">The things I learn by making</p><h2 id="st-work-title">Off the workbench</h2></div><p>Five finished projects.<br>The engineering behind the play.</p></div><div class="st-grid">${shelf.map(card).join('')}</div><div class="st-in-progress"><span class="st-label">Also on the desk</span><p>Two experiments still finding their shape.</p><div>${caseLink('hidamari', 'hidamari · in progress', 'st-link')}${caseLink('elderwood', 'Elderwood Vale · in progress', 'st-link')}</div></div></section>
  <section class="st-bottom" id="about" aria-labelledby="st-about-title"><div class="st-about"><p class="st-label">Same person, different problem sets</p><h2 id="st-about-title">A little physics.<br>A lot of making.</h2><p>I did B.S. degrees in computer science and astrophysics at UMass Amherst. Some weeks that meant Algorithms and General Relativity in the same pile.</p><p>I’ve built a fintech backend, software for physics teaching, and simulations of CO₂ cooling in particle detectors. At Notable, I now help make patient conversations dependable.</p><p class="st-off-clock"><strong>Off the clock</strong> Heirloom tomatoes. Bikes. Pink Floyd. I’ve wanted to be an astronaut since I was four.</p><div class="st-about-links">${out(contact.resume, 'The full résumé', 'st-link')}${out(contact.github, 'GitHub', 'st-link')}</div></div>
  <section class="st-toy" aria-labelledby="st-toy-title"><div class="st-toy-top"><span class="st-label">One small experiment</span><span class="st-toy-stamp">Try me</span></div><h2 id="st-toy-title">How’s your eye?</h2><p>Set the angle to <strong>115°</strong>. No protractor.</p><svg class="st-angle-svg" viewBox="0 0 400 225" role="img" aria-label="An angle with one fixed horizontal arm and one adjustable arm"><circle cx="175" cy="162" r="119" fill="none" stroke="currentColor" stroke-opacity=".16" stroke-dasharray="2 6"/><path d="M175 25V190M32 162H321" fill="none" stroke="currentColor" stroke-opacity=".13"/><path d="M175 162H294" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path data-st-angle-arc d="M213 162A38 38 0 0 0 182.9 124.8" fill="none" stroke="#ba4829" stroke-width="2"/><g data-st-angle-arm transform="rotate(-78 175 162)"><path d="M175 162H294" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="294" cy="162" r="7" fill="currentColor"/></g><circle cx="175" cy="162" r="5" fill="currentColor"/></svg><div class="st-toy-controls" hidden><label class="st-visually-hidden" for="st-angle-input">Adjust your guess for a 115 degree angle</label><input id="st-angle-input" type="range" min="10" max="170" value="78" aria-valuetext="Adjustable angle, aim for 115 degrees"><div class="st-toy-result"><p data-st-angle-result aria-live="polite">Slide. Trust your eye.</p><button type="button" data-st-angle-check>Check it <span aria-hidden="true">↗</span></button></div></div><noscript><p class="st-toy-noscript">The little angle exercise needs JavaScript. Eyeshot has the full set of daily tests.</p></noscript>${out('https://eyeshot.app/', 'A taste of Eyeshot. Play the full set.', 'st-toy-credit')}</section></section>
  <section class="st-contact" aria-labelledby="st-contact-title"><div><p class="st-label">Have something in mind?</p><h2 id="st-contact-title">Let’s make it work.</h2></div>${email('Say hello', 'st-button')}</section></main><footer class="st-footer"><p>AJ Uppal <span> / Software engineer, serial maker.</span></p><div>${out(contact.github, 'GitHub')}${out(contact.linkedin, 'LinkedIn')}${email('Email')}</div><a href="#top">Back to top ↑</a></footer></div>`,
    { scripts: ['studio.js'], title: 'AJ Uppal — Open Studio' },
  );
}
