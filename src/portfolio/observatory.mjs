import {
  img,
  esc,
  project,
  caseLink,
  out,
  email,
  contact,
  about,
  roles,
  collectionDoor,
  homeProjectKeys,
} from './shared.mjs';

const scenes = ['murmuration', 'saltline', 'ember'].map(project);
const currentRole = roles.find((role) => role.now);
// Eyeshot already has its own frame in this direction’s discovery gallery.
const selected = homeProjectKeys.filter((key) => key !== 'eyeshot');

function scene(p, index) {
  return `<figure class="ob-scene" id="ob-scene-${p.key}" ${index ? 'hidden' : ''} aria-labelledby="ob-caption-${p.key}"><div class="ob-aperture">${img(p.image, p.alt, index ? 'loading="lazy"' : 'fetchpriority="high"')}</div><figcaption id="ob-caption-${p.key}"><div><span class="ob-label">A view into ${esc(p.kind)}</span><h2>${caseLink(p.key, p.name)}</h2></div><span class="ob-photo-note">From the running project<br><span aria-hidden="true">↗</span> Look a little closer</span></figcaption></figure>`;
}

function card(key, index) {
  const p = project(key);
  const label = p.local ? 'Local build' : p.status === 'live' ? 'Live project' : 'In progress';
  return `<article class="ob-project" id="ob-project-${esc(p.key)}"><div class="ob-project-index"><span class="ob-label">${String(index + 1).padStart(2, '0')}</span><span class="ob-project-rule" aria-hidden="true"></span></div><a class="ob-project-image" href="/portfolio/work/${esc(p.key)}/" aria-label="Explore ${esc(p.name)}">${img(p.image, p.alt, 'loading="lazy"')}<span class="ob-image-arrow" aria-hidden="true">↗</span></a><div class="ob-project-body"><div class="ob-project-meta"><span class="ob-label">${esc(p.kind)}</span><span>${label}</span></div><h3>${esc(p.name)}</h3><p class="ob-question">${esc(p.question)}</p>${index < 3 ? `<p class="ob-summary">${esc(p.summary)}</p>` : ''}<dl>${index < 3 ? `<div><dt>My part</dt><dd>${esc(p.role)}</dd></div>` : ''}<div><dt>The decision</dt><dd>${esc(p.decision)}</dd></div></dl><p class="ob-stack">${esc(p.stack)}</p><div class="ob-links">${caseLink(p.key, 'Inside the build', 'ob-link')}${p.href && !p.local ? out(p.href, 'Open project', 'ob-link ob-link-quiet') : ''}</div></div></article>`;
}

export default function render() {
  const notable = project('notable');
  return `<div class="ob-shell" id="top"><header class="ob-nav"><a class="ob-brand" href="#top" aria-label="AJ Uppal, home"><span class="ob-mark" aria-hidden="true">✳</span><span>AJ UPPAL<span class="ob-brand-sub">ENGINEER & EXPLORER</span></span></a><nav aria-label="Main navigation"><a href="#work">Work</a><a href="/portfolio/collection/">Collection</a><a href="#about">About</a>${email('Say hello')}</nav></header>
<main id="main"><section class="ob-hero" aria-labelledby="ob-title"><div class="ob-intro"><p class="ob-label ob-current"><span aria-hidden="true"></span>${esc(currentRole?.title)} · ${esc(currentRole?.org)}</p><h1 id="ob-title">AJ <em>Uppal.</em></h1><p class="ob-hero-line">Serious about systems.<br>Curious about everything.</p><p class="ob-lede">I build healthcare infrastructure, shared worlds and instruments that listen. The thread through it all: care for how things work.</p><div class="ob-links ob-hero-links"><a class="ob-button" href="#work">Explore my work <span aria-hidden="true">↓</span></a>${out(contact.resume, 'Résumé', 'ob-link')}</div><div class="ob-sky" aria-label="A decorative constellation"><canvas data-ob-sky aria-hidden="true"></canvas><div class="ob-sky-label"><span class="ob-label">Room to wonder</span><button type="button" data-ob-motion hidden>Pause stars</button></div></div></div><div class="ob-window"><div class="ob-window-heading"><span class="ob-label">The observatory / selected views</span><span class="ob-cross" aria-hidden="true">+</span></div><div class="ob-scenes">${scenes.map(scene).join('')}</div><div class="ob-scene-controls" role="group" aria-label="Choose the featured project" hidden>${scenes.map((p, i) => `<button type="button" data-ob-scene="${p.key}" aria-controls="ob-scene-${p.key}" aria-pressed="${i === 0}"><span class="ob-label">0${i + 1}</span>${esc(p.name)}<span class="ob-tab-dot" aria-hidden="true"></span></button>`).join('')}</div></div></section>
<section class="ob-notable" id="work" aria-labelledby="ob-notable-title"><div class="ob-notable-heading"><p class="ob-label">At work / ${esc(currentRole?.when)}</p><h2 id="ob-notable-title">Care, at the<br><em>system level.</em></h2><p>${esc(notable.name)}</p>${caseLink('notable', 'My work at Notable', 'ob-link')}</div><div class="ob-notable-copy"><p class="ob-role">${esc(notable.role)}</p><p>${esc(notable.constraint)}</p><p class="ob-notable-evidence">${esc(notable.evidence)}</p></div></section>
<section class="ob-work" id="projects" aria-labelledby="ob-projects-title"><header class="ob-section-heading"><div><p class="ob-label">Personal work / ${String(selected.length).padStart(2, '0')} selected projects</p><h2 id="ob-projects-title">Questions worth<br><em>building around.</em></h2></div><p>A few places my curiosity has led.<br>Open a project, or follow the decisions that made it work.</p></header><div class="ob-projects">${selected.map(card).join('')}</div></section>
${collectionDoor(['slipstream', 'eyeshot', 'beatlayer'], 'ob-discovery')}
<section class="ob-about" id="about" aria-labelledby="ob-about-title"><div class="ob-about-heading"><span class="ob-orbit" aria-hidden="true"><i></i><b>✳</b></span><p class="ob-label">The person behind the work</p><h2 id="ob-about-title">Always looking<br><em>a little closer.</em></h2></div><div class="ob-about-copy"><p class="ob-about-statement">${esc(about.statement)}</p>${about.prose.map((p) => `<p>${esc(p)}</p>`).join('')}<p>${esc(about.sim[0])}<a href="/portfolio/work/saltline/">${esc(about.sim[1])}</a>${esc(about.sim[2])}</p><dl>${about.notes
    .slice(0, 2)
    .map((n) => `<div><dt>${esc(n.k)}</dt><dd>${esc(n.v)}</dd></div>`)
    .join(
      '',
    )}</dl><div class="ob-links">${out(contact.resume, 'Read my résumé', 'ob-link')}${out(contact.github, 'GitHub', 'ob-link')}</div></div></section>
<section class="ob-contact" aria-labelledby="ob-contact-title"><div><p class="ob-label">An idea, an opportunity, a good question</p><h2 id="ob-contact-title">Let’s see where<br><em>it takes us.</em></h2></div>${email('Start a conversation', 'ob-button')}</section></main><footer class="ob-footer"><a class="ob-footer-name" href="#top">AJ Uppal<span aria-hidden="true">.</span></a><p>Made with curiosity.<br>Built to be explored.</p><div>${out(contact.linkedin, 'LinkedIn')}${out(contact.github, 'GitHub')}${email('Email')}</div><a href="#top" class="ob-top">Back to the sky <span aria-hidden="true">↑</span></a></footer></div>`;
}
