import {
  img,
  esc,
  project,
  projects,
  caseLink,
  out,
  email,
  contact,
  particleMeasurement,
  homeProjectKeys,
} from './shared.mjs';

const chapters = [
  {
    key: 'murmuration',
    title: 'First, learn to listen.',
    body: 'A song has a key, a pulse, a voice and a little room to breathe. I wanted a field of light that could hear all of it.',
    decision:
      'Audio analysis becomes motion in a WebGPU compute shader. The particles follow chroma, transients and stereo placement.',
    fact: particleMeasurement.line,
    note: particleMeasurement.note,
    image: 'murmuration-lead-ribbon',
  },
  {
    key: 'saltline',
    title: 'Then, follow the wind.',
    body: 'An ocean is more interesting when you can learn its rules. I built a sailing model that makes reading the wind part of the pleasure.',
    decision:
      'Point of sail drives thrust. The instruments expose wind, heel and velocity made good; multiplayer keeps the sea shared.',
    fact: 'Sailing physics · persistent cargo · up to 20 players',
    note: 'Sunrise in the running game. Captured by AJ with the HUD hidden.',
    image: 'portfolio-saltline-sunrise',
  },
  {
    key: 'ember',
    title: 'Leave a world for someone else.',
    body: 'I built Ember Wilds from the browser client through the realm service. The landscape is an invitation; agreeing on what happens is the engineering.',
    decision:
      'An authoritative server owns combat, quests and loot. Colyseus distributes that state to every browser in the realm.',
    fact: 'Seven regions · up to 64 players per realm',
    note: 'Fallowmere at dusk, from the deployed game.',
    image: 'ember-spread-fallowmere-dusk',
  },
];

export default function render() {
  return `<div class="fn-shell" id="top">
    <header class="fn-nav"><a class="fn-monogram" href="#top" aria-label="AJ Uppal, top of page">AJ<span aria-hidden="true">/</span></a><span class="fn-nav-note">Notes from a curious engineer</span><nav aria-label="Main navigation"><a href="#work">Work</a><a href="/portfolio/collection/">Collection</a><a href="#about">About</a>${email('Hello')}</nav></header>
    <main id="main">
      <section class="fn-cover" aria-labelledby="fn-title"><div class="fn-cover-seam" aria-hidden="true"></div><div class="fn-cover-copy"><p class="fn-label">Software engineer · Bay Area, California</p><h1 id="fn-title">AJ<br><em>Uppal.</em></h1><p class="fn-cover-line">Serious about the systems.<br>Curious about everything else.</p><p class="fn-cover-intro">I build healthcare software at Notable Health. After hours, I make instruments, simulations and worlds you can step into.</p><div class="fn-cover-links"><a href="#work">Read the field notes <span aria-hidden="true">↓</span></a>${out(contact.resume, 'Résumé')}</div></div><figure class="fn-cover-photo">${img('murmuration-lead-ribbon', project('murmuration').alt, 'fetchpriority="high"')}<figcaption><span>01 / murmuration</span><span>A field of light, listening.</span></figcaption></figure><div class="fn-cover-foot"><span>Systems / Simulation / Play</span><span>Built in a browser. Open to explore.</span></div></section>
      <section class="fn-practice" aria-labelledby="fn-practice-title"><div><p class="fn-label">The professional practice</p><h2 id="fn-practice-title">Dependable, even at<br><em>the seams.</em></h2></div><div class="fn-practice-body"><p>I set technical direction for patient identity, routing, observability and reliability at Notable Health. My work connects systems that weren’t built together.</p><dl><div><dt>~250k</dt><dd>patient calls a month on our team’s platform</dd></div><div><dt>$1M+</dt><dd>ARR driven by the telephony integration specification</dd></div></dl>${caseLink('notable', 'Inside the professional work', 'fn-link')}</div></section>
      <section class="fn-work" id="work" aria-labelledby="fn-work-title"><div class="fn-work-heading"><div><p class="fn-label">From the notebook</p><h2 id="fn-work-title">A few things<br><em>I learned by making.</em></h2></div><details class="fn-index"><summary>Unfold the index <span aria-hidden="true">+</span></summary><div>${chapters.map((c, i) => `<a href="#fn-${c.key}"><span>0${i + 1}</span>${esc(project(c.key).name)}<span aria-hidden="true">↗</span></a>`).join('')}<a href="/portfolio/collection/"><span>↳</span>All ${projects.filter((p) => p.key !== 'notable').length} projects<span aria-hidden="true">↗</span></a></div></details></div>
        <div class="fn-notebook"><nav class="fn-margin" aria-label="Field note chapters">${chapters.map((c, i) => `<a href="#fn-${c.key}" data-fn-marker="${c.key}"><span>0${i + 1}</span><span>${esc(project(c.key).name)}</span></a>`).join('')}<span class="fn-margin-line" aria-hidden="true"></span><span class="fn-margin-label">A question → a working thing</span></nav><div class="fn-leaves">${chapters
          .map((c, i) => {
            const p = project(c.key);
            return `<article class="fn-leaf" id="fn-${c.key}" data-fn-chapter="${c.key}"><header><p class="fn-label">Observation 0${i + 1} / ${esc(p.kind)}</p><h3>${esc(c.title)}</h3></header><figure><a href="/portfolio/work/${esc(c.key)}/" aria-label="Explore ${esc(p.name)}">${img(c.image, p.alt, 'loading="lazy"')}<span class="fn-photo-corner" aria-hidden="true">↗</span></a><figcaption><strong>${esc(p.name)}</strong><span>${esc(c.note)}</span></figcaption></figure><div class="fn-leaf-copy"><p>${esc(c.body)}</p><div><span class="fn-label">The engineering</span><p>${esc(c.decision)}</p></div></div><footer><p>${esc(c.fact)}</p>${caseLink(c.key, 'Open the build', 'fn-link')}</footer></article>`;
          })
          .join('')}</div></div>
      </section>
      <section class="fn-desk" aria-labelledby="fn-desk-title"><div><p class="fn-label">Also on the desk</p><h2 id="fn-desk-title">The habit continues.</h2></div><div class="fn-desk-grid">${homeProjectKeys
        .slice(3)
        .map((key) => {
          const p = project(key);
          return `<article><a class="fn-desk-photo" href="/portfolio/work/${esc(key)}/" aria-label="Explore ${esc(p.name)}">${img(p.image, p.alt, 'loading="lazy"')}</a><p class="fn-label">${esc(p.kind)}</p><h3>${caseLink(key, p.name)}</h3><p>${esc(p.summary)}</p></article>`;
        })
        .join(
          '',
        )}</div><a class="fn-collection-link" href="/portfolio/collection/"><span>Turn another page.</span><span>Explore all ${projects.filter((p) => p.key !== 'notable').length} projects <span aria-hidden="true">→</span></span></a></section>
      <section class="fn-about" id="about" aria-labelledby="fn-about-title"><div class="fn-about-tab" aria-hidden="true">A small personal note</div><div><p class="fn-label">Away from the build</p><h2 id="fn-about-title">Two subjects.<br><em>One curiosity.</em></h2></div><div class="fn-about-copy"><p>I studied computer science and astrophysics at UMass Amherst. I’ve gone from simulating CO₂ cooling for particle detectors to making an ocean you can sail.</p><p>There’s a similar thread outside the screen: heirloom tomatoes, bikes, Pink Floyd. I like things that reward paying attention.</p><p class="fn-signature">AJ</p>${out(contact.resume, 'The full résumé', 'fn-link')}</div></section>
      <section class="fn-correspondence"><p class="fn-label">An open page</p><h2>Let’s make<br><em>something matter.</em></h2>${email('Write to me', 'fn-link')}</section>
    </main><footer class="fn-footer"><a class="fn-monogram" href="#top" aria-label="AJ Uppal, back to top">AJ<span aria-hidden="true">/</span></a><p>Software engineer. Still taking notes.</p><div>${out(contact.github, 'GitHub')}${out(contact.linkedin, 'LinkedIn')}${email('Email')}</div></footer>
  </div>`;
}
