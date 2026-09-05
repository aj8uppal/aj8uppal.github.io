import { frame, esc, img, email, out, contact, project, caseLink } from './shared.mjs';

const studies = [
  {
    key: 'ember',
    topic: 'Shared worlds',
    question: 'What makes a world the same for everyone?',
    initial: 1,
    control: 'Travel between recorded regions',
    observation: 'The landscape changes. The authority does not.',
    decision:
      'I keep world state, quests and loot in a separate realm service. The browser renders the world; it does not decide what happened in it.',
    detail:
      'A beautiful place is only half a multiplayer game. The other half is making sure the creature you hit, the item you pick up and the person beside you agree about the same event.',
    source:
      'Seven region captures from the running game. These are recorded views, not a live connection to a realm.',
    facts: [
      ['World', 'Seven regions'],
      ['Realm', 'Up to 64 players'],
      ['Boundary', 'Client / realm'],
    ],
    evidence: 'The two-browser capture in the case study shows two players in the same Hearthvale.',
    annotation: 'Different views.\nOne shared truth.',
  },
  {
    key: 'saltline',
    topic: 'Light & motion',
    question: 'What makes an ocean feel alive?',
    initial: 2,
    control: 'Move through six recorded times of day',
    observation: 'Hold the rules still. Move the light.',
    decision:
      'I expose the sailing model in the HUD: point of sail sets thrust; thrust and heading set velocity toward the mark. The scenery changes how the same rules feel.',
    detail:
      'At golden hour the boat makes 15 knots through the water, but only 2.3 toward the mark. Speed is not the same thing as progress. The angle you choose is the game.',
    source:
      'Six recorded frames. Sea state moderate, wind 40°, seed 4193. Only the time-of-day setting changed.',
    facts: [
      ['Seed', '4193'],
      ['Sea state', 'Moderate'],
      ['Wind setting', '40°'],
    ],
    evidence: 'Live with accounts, persistent cargo and room for up to 20 players per sea.',
    annotation: 'Same rules.\nSix different moods.',
  },
  {
    key: 'murmuration',
    topic: 'Quiet passages',
    question: 'Can a field of light hear a song breathe?',
    initial: 0,
    control: 'Compare two styles and a quiet passage',
    observation: 'The absence of sound deserves a shape, too.',
    decision:
      'I measure key, tempo, transients and stereo placement alongside volume. Quiet passages thin, dim and slow the particle field instead of simply turning it down.',
    detail:
      'Frequency cannot separate a voice from a piano when they share the same octaves. Centre versus sides gives the analysis another way to listen. The renderer follows that richer signal.',
    source:
      'Two styles and a lull, captured in one session. The style and music changed; these frames do not play audio.',
    facts: [
      ['Renderer', 'WebGPU'],
      ['Input', 'Music or mic'],
      ['Study', 'Style / quiet'],
    ],
    evidence: 'Measured GPU time: 620k particles at 8.07ms; 1.2M particles at 11.85ms.',
    annotation: 'Listen between\nthe loud parts.',
  },
  {
    key: 'blockhold',
    topic: 'Moving rules',
    question: 'What happens when the board changes its mind?',
    initial: 3,
    control: 'Compare four recorded boards',
    observation: 'A good rule can become a useful exception.',
    decision:
      'I gave the later boards their own constraint. Tidereach closes causeways mid-battle: enemies reroute, and the defense you paid for is no longer the one you keep.',
    detail:
      'The rules sit on a fixed 60Hz simulation. Models are colored boxes placed in code; sound is synthesized when it plays. That leaves the complexity budget for the campaign itself.',
    source:
      'Four of ten boards, captured from the running game. Changing the figure shows an authored map, not a simulated battle.',
    facts: [
      ['Campaign', 'Ten maps'],
      ['Waves', '249 authored'],
      ['Simulation', 'Fixed 60Hz'],
    ],
    evidence:
      'Three heroes, three difficulties, endless records and 154 tests. Live and installable.',
    annotation: 'The plan is good.\nUntil the tide turns.',
  },
  {
    key: 'cubit',
    topic: 'A hidden dimension',
    question: 'How do you make a third dimension legible?',
    initial: 0,
    control: 'Compare the recorded views',
    observation: 'The axis you cannot see is the one that gets you.',
    decision:
      'I score swipes against the screen-space projection of the cube’s axes. Hidden tiles become translucent; holding Space spreads the layers apart so you can read the board.',
    detail:
      'Twenty-seven cells and six slide directions make a familiar rule unfamiliar again. On a phone, a small optional gyro tilt lets you peek without changing what a swipe means.',
    source:
      'Two captured views of the game. The figure compares visibility; it does not accept gameplay input.',
    facts: [
      ['Board', '3 × 3 × 3'],
      ['Directions', 'Six'],
      ['Delivery', 'One HTML file'],
    ],
    evidence: 'A self-contained 553KB file, local saves and 62 tests.',
    annotation: 'Make the inside\nreadable.',
  },
];

const orbit = `<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="18"/><ellipse cx="28" cy="28" rx="11" ry="26" transform="rotate(28 28 28)"/><path d="M2 28h52M28 2v52M9 45 46 10"/><circle cx="40" cy="11" r="3" class="fn-orbit-point"/></svg>`;

function framesFor(p) {
  if (p.key === 'cubit')
    return [
      {
        image: p.image,
        label: 'Peek inside',
        alt: p.alt,
        note: 'The layers spread apart to reveal the interior of the cube.',
      },
      ...p.frames,
    ];
  return p.frames;
}

function study(s, index) {
  const p = project(s.key),
    frames = framesFor(p),
    f = frames[s.initial];
  return `<section class="fn-study" id="fn-study-${s.key}" data-study="${s.key}" aria-labelledby="fn-question-${s.key}">
    <aside class="fn-margin"><p class="fn-kicker">Investigation 00${index + 1} / ${esc(p.name)}</p><h2 id="fn-question-${s.key}">${esc(s.question)}</h2><p class="fn-study-premise">${esc(s.observation)}</p><dl>${s.facts.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl><p class="fn-hand-note">${esc(s.annotation).replace('\n', '<br>')}<svg viewBox="0 0 116 37" aria-hidden="true"><path d="M5 4c28 31 62 31 99 9m-17-3 18 3-9 13"/></svg></p><div class="fn-study-source">${caseLink(s.key, 'Open the full case')}${out(p.href, 'Try it yourself')}</div></aside>
    <div class="fn-experiment"><figure><div class="fn-photo">${img(f.image, f.alt, `class="fn-study-image" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}`)}<span class="fn-figure-stamp">Fig. 0${index + 1} / A recorded state</span></div><figcaption><div class="fn-frame-heading"><span class="fn-frame-label">${esc(f.label)}</span><span class="fn-frame-count">${s.initial + 1} / ${frames.length}</span></div><p class="fn-frame-note">${esc(f.note)}</p><div class="fn-frame-controls" hidden><label for="fn-range-${s.key}">${esc(s.control)}</label><input id="fn-range-${s.key}" type="range" min="0" max="${frames.length - 1}" value="${s.initial}" step="1" aria-valuetext="${esc(f.label)}"><div class="fn-frame-ends" aria-hidden="true"><span>${esc(frames[0].label)}</span><span>${esc(frames.at(-1).label)}</span></div></div><p class="fn-capture-source">${esc(s.source)}</p></figcaption></figure><div class="fn-findings"><div><h3>The decision</h3><p>${esc(s.decision)}</p></div><div><h3>Why it matters</h3><p>${esc(s.detail)}</p></div></div><div class="fn-evidence"><span>In the work</span><p>${esc(s.evidence)}</p></div></div>
    <script type="application/json" class="fn-frame-data">${JSON.stringify(frames).replaceAll('<', '\\u003c')}</script>
  </section>`;
}

export default function render() {
  const body = `<div class="fn-shell"><header class="fn-nav"><a class="fn-brand" href="#main">${orbit}<span>AJ Uppal<small>Field notes</small></span></a><nav aria-label="Main navigation"><a href="#investigations">Investigations</a><a href="#record">The record</a>${email('Write to me')}</nav><span class="fn-volume">Vol. 02 / An open notebook</span></header>
  <main id="main"><section class="fn-intro" aria-labelledby="fn-title"><div><p class="fn-kicker">Software engineering × Astrophysics</p><h1 id="fn-title">Follow the question.<br><em>Build the answer.</em></h1><p class="fn-byline">AJ Uppal · Software engineer at <strong>Notable Health</strong></p></div><div class="fn-intro-note"><span aria-hidden="true">✳</span><p>I learn things by building them. Healthcare systems, shared worlds, a field of light that listens. Different questions; the same curiosity.</p><a href="#investigations">Open the notebook <span aria-hidden="true">↓</span></a></div></section>

  <section id="investigations" class="fn-investigations" aria-labelledby="fn-investigations-title"><div class="fn-section-rule"><h2 id="fn-investigations-title">Choose a line of inquiry</h2><span>Five live projects / AJ’s own builds</span></div><div class="fn-choices" role="group" aria-label="Choose an investigation" hidden>${studies
    .map((s, i) => {
      const p = project(s.key);
      return `<button type="button" data-fn-select="${s.key}" aria-pressed="${i === 0}" aria-controls="fn-study-${s.key}">${img(p.image, '', 'loading="lazy"')}<span><small>0${i + 1} / ${esc(s.topic)}</small><strong>${esc(p.name)}</strong></span><b aria-hidden="true">↙</b></button>`;
    })
    .join(
      '',
    )}</div><noscript><p class="fn-noscript">Every investigation is open below. Jump to ${studies.map((s) => `<a href="#fn-study-${s.key}">${esc(project(s.key).name)}</a>`).join(' · ')}.</p></noscript><p class="fn-announcement" role="status" aria-live="polite"></p>${studies.map(study).join('')}</section>

  <section id="record" class="fn-record" aria-labelledby="fn-record-title"><div class="fn-record-margin"><p class="fn-kicker">The professional record</p><h2 id="fn-record-title">A conversation is<br>a systems problem.</h2><p class="fn-record-date">Notable Health<br>Software Engineer · 2022–present</p>${caseLink('notable', 'Read the work behind it')}</div><div class="fn-record-story"><p class="fn-record-scale"><strong>~250,000</strong><span>patient calls a month<br>through my team’s voice platform</span></p><p>I set technical direction for patient identity, routing, observability and reliability. A patient conversation crosses healthcare systems, carriers and call centers; the boundaries are part of the work.</p><div class="fn-record-detail"><span>One decision</span><p>Make fallback routing configurable, so a caller can stay connected when an upstream provider goes dark.</p></div><div class="fn-record-footer"><span>Earlier chapters: Harvest Fintech · UMass Physics</span>${out(contact.resume, 'Read my résumé')}</div></div></section>

  <section class="fn-unfinished" aria-labelledby="fn-unfinished-title"><header class="fn-section-rule"><h2 id="fn-unfinished-title">Pages still in pencil</h2><span>Work in progress / Not yet released</span></header><div class="fn-unfinished-grid"><article>${img('hidamari-spread-canopy', 'An autumn path under a sunlit canopy in hidamari.', 'loading="lazy"')}<div><p class="fn-kicker">Light / hidamari</p><h3>A place made of light.</h3><p>Blender bakes the lighting; the browser reprojects depth. Audio is still being tuned.</p>${caseLink('hidamari', 'See the working notes')}</div></article><article>${img('elderwood-default', 'The Elderwood Vale greybox board: a route and defensive towers.', 'loading="lazy"')}<div><p class="fn-kicker">Boundaries / Elderwood Vale</p><h3>A simulation on its own.</h3><p>A deterministic core that knows nothing of the DOM, the renderer or the clock.</p>${caseLink('elderwood', 'See the working notes')}</div></article></div></section>

  <section id="about" class="fn-about" aria-labelledby="fn-about-title"><div class="fn-about-heading"><p class="fn-kicker">A note from the author</p><h2 id="fn-about-title">Two degrees.<br>One habit.</h2><div class="fn-about-orbit">${orbit}<span>Still curious.</span></div></div><div class="fn-about-copy"><p>I did computer science and astrophysics at the same time because I couldn’t choose between them. Some weeks meant Algorithms and General Relativity in the same problem-set pile.</p><p>Now I’m in the Bay Area. Away from code, it’s heirloom tomatoes, bikes and Pink Floyd, roughly in that order. I’ve wanted to be an astronaut since I was four. Still would.</p><p class="fn-about-invite">Have a question worth following? ${email('Write to me')}</p></div></section>
  </main><footer class="fn-footer"><span>AJ Uppal <em>— the notebook stays open.</em></span><div>${out(contact.github, 'GitHub')}${out('/built/', 'Eleven smaller things')}<a href="#main">Back to the beginning ↑</a></div></footer></div>`;
  return frame('field-notes', body, {
    scripts: ['field-notes.js'],
    title: 'AJ Uppal — Field Notes',
  });
}
