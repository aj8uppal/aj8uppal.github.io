import { mkdir, writeFile } from 'node:fs/promises';
import { apps } from '../../src/data/built.ts';
import { format, resolveConfig } from 'prettier';
import { esc, out, email, projects, contact, url } from './shared.mjs';

const root = new URL('.', import.meta.url);
const directions = [
  {
    key: 'editorial',
    n: '01',
    name: 'The Editorial',
    phrase: 'Clear writing, deep proof.',
    hypothesis: 'A hiring reader gets the work quickly, then can open the engineering behind it.',
    original: '../portfolio-candidates/editorial.html',
    preview: 'editorial',
  },
  {
    key: 'studio',
    n: '02',
    name: 'Open Studio',
    phrase: 'A portfolio you can touch.',
    hypothesis:
      'One playful control makes AJ’s range memorable while the shelf and cases establish depth.',
    original: '../portfolio-candidates/studio.html',
    preview: 'studio',
  },
  {
    key: 'field-notes',
    n: '03',
    name: 'Field Notes',
    phrase: 'Questions, systems, evidence.',
    hypothesis:
      'A technical reader understands the decisions because each project is organized around a real question.',
    original: '../portfolio-candidates/field-notes.html',
    preview: 'field-notes',
  },
  {
    key: 'worldbuilder',
    n: '04',
    name: 'Worldbuilder',
    phrase: 'Browser worlds, built with intent.',
    hypothesis:
      'Atmosphere can introduce AJ’s creative side when the same page gives equal weight to healthcare systems and technical proof.',
    original: '../portfolio-candidates/worldbuilder.html',
    preview: 'worldbuilder',
  },
];

const pretty = async (value, filepath) =>
  format(value, { ...(await resolveConfig(filepath)), filepath });

const indexHtml = () => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>AJ Uppal / portfolio directions refined</title><link rel="stylesheet" href="index.css"><script>if(new URLSearchParams(location.search).has('capture'))document.documentElement.dataset.capture='';</script></head>
<body><a class="ref-skip" href="#main">Skip to content</a><header class="ref-shell ref-nav"><a class="ref-brand" href="index.html">AJ<span class="ref-brand-mark">.</span> / portfolio lab</a><nav class="ref-nav-links" aria-label="Page"><a href="#directions">Four directions</a><a href="../portfolio-candidates/">Original round ↗</a><a href="mailto:${esc(contact.email)}">Email AJ ↗</a></nav></header>
<main id="main" class="ref-shell"><section class="ref-index-hero"><p class="ref-eyebrow">ROUND TWO / A REFINED SET</p><h1>Four directions.<br><em>More of you.</em></h1><p class="ref-index-dek">The crisp frames, the curiosity, the boat at dawn. Four working refinements that bring AJ’s professional work, personal projects and point of view into focus.</p><div class="ref-index-note"><span>Explore the refinements</span><strong>Four interactive portfolios · Ten deeper case studies</strong></div></section>
<section id="directions" class="ref-directions" aria-labelledby="directions-title"><div class="ref-index-section-head"><h2 id="directions-title">Compare the directions</h2><div class="ref-preview-tools" role="group" aria-label="Preview size"><span class="ref-eyebrow">Preview</span><button type="button" data-preview="desktop" aria-pressed="true">Desktop</button><button type="button" data-preview="mobile" aria-pressed="false">Mobile</button></div></div>${directions.map((d) => `<article class="ref-direction" id="${d.key}"><div class="ref-direction-number">${d.n}</div><div class="ref-direction-copy"><p class="ref-eyebrow">${esc(d.name)}</p><h3>${esc(d.phrase)}</h3><p>${esc(d.hypothesis)}</p><div class="ref-direction-links"><a class="ref-link" href="${d.key}.html">Open refined direction <span aria-hidden="true">→</span></a><a class="ref-link ref-link-muted" href="${d.original}">See original round <span aria-hidden="true">↗</span></a></div></div><figure class="ref-direction-preview"><a href="${d.key}.html" aria-label="Open ${esc(d.name)}"><img data-preview-image="${d.preview}" src="previews/${d.preview}-desktop.webp" alt="${esc(d.name)} refined portfolio direction preview" width="1440" height="1000" loading="lazy"></a><figcaption><span>${esc(d.name)}</span><span>Open to explore ↗</span></figcaption></figure></article>`).join('')}</section>
<section class="ref-index-proof"><div><p class="ref-eyebrow">THE COMMON THREAD</p><h2>A card is an invitation.<br>The case is the proof.</h2></div><p>Every direction keeps project explanations on the page and links to a full, keyboard-friendly case study. The cases name the constraint, the decision, and the evidence, with real captures where they exist.</p><a class="ref-link" href="cases/notable.html" data-case="notable">Open a sample case <span aria-hidden="true">→</span></a></section></main><footer class="ref-shell ref-footer"><span>AJ Uppal · software engineer · Bay Area</span><span class="ref-footer-links"><a href="${esc(contact.github)}">GitHub ↗</a>${email('Email')}<a href="${esc(url(contact.resume))}">Résumé ↗</a></span></footer><script src="shared.js" defer></script><script src="index.js" defer></script></body></html>`;

const caseImage = (p, image, alt) =>
  image
    ? `<img src="../${`../../src/assets/${image}.webp`}" alt="${esc(alt)}" loading="lazy">`
    : `<div class="ref-case-no-image"><span class="ref-eyebrow">NOTABLE TEAM PLATFORM</span><strong>~250,000 patient calls / month</strong><small>Company serves 100+ enterprise customers · AJ sets technical direction on the team</small></div>`;
const caseHtml = (p) => {
  const facts = [
    ['Role', p.role],
    ['Constraint', p.constraint],
    ['Decision', p.decision],
    ['Evidence', p.evidence],
  ];
  const allFrames = [...(p.proofFrames ?? []), ...(p.frames ?? [])];
  const frames = allFrames.length
    ? `<section class="ref-case-frames" aria-labelledby="frames-title"><p class="ref-eyebrow">RECORDED STATES</p><h2 id="frames-title">A few frames from the work</h2><div class="ref-case-frame-grid">${allFrames.map((f) => `<figure class="ref-case-frame${f.proof ? ' ref-case-proof-frame' : ''}">${caseImage(p, f.image, f.alt)}<figcaption><span>${esc(f.label)}</span><span>${esc(f.note)}</span></figcaption></figure>`).join('')}</div></section>`
    : '';
  const selectedProof = p.details?.length
    ? `<section class="ref-case-sections"><div><p class="ref-eyebrow">SELECTED PROOF</p><h2>Details that matter.</h2></div><div class="ref-case-facts">${p.details.map(([label, value]) => `<div class="ref-case-fact"><strong>${esc(label)}</strong><span>${esc(value)}</span></div>`).join('')}</div></section>`
    : '';
  const launch = p.href
    ? out(p.href, `Open ${p.name}`, 'ref-link')
    : `<span class="ref-case-pill">${p.status === 'wip' ? 'Work in progress' : 'No public launch'}</span>`;
  const related = projects
    .filter((v) => v.key !== p.key && ['live', 'wip'].includes(v.status))
    .slice(0, 3)
    .map(
      (v) =>
        `<a class="ref-case-link" href="${v.key}.html" data-case="${v.key}">${esc(v.name)} <span aria-hidden="true">→</span></a>`,
    )
    .join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(p.name)} / AJ Uppal case study</title><link rel="stylesheet" href="../shared.css"><script>if(new URLSearchParams(location.search).has('capture'))document.documentElement.dataset.capture='';</script></head><body><aside class="ref-reviewbar" aria-label="Case study navigation"><a href="../index.html">← Four directions</a><span>Case study / ${esc(p.name)}</span><a href="../../portfolio-candidates/">Original round ↗</a></aside><main class="ref-case-doc"><header class="ref-case-header"><div><p class="ref-eyebrow">CASE / ${esc(p.kind)}</p><h1 id="case-title-${esc(p.key)}">${esc(p.name)}</h1><div class="ref-case-header-meta"><span class="ref-case-pill">${esc(p.status)}</span><span class="ref-case-pill">${esc(p.stack)}</span></div></div><p class="ref-case-summary">${esc(p.summary)}</p></header><section class="ref-case-hero"><figure>${caseImage(p, p.image, p.alt)}${p.image ? `<figcaption><span>${esc(p.name)}</span><span>Real project capture</span></figcaption>` : ''}</figure><aside class="ref-case-hero-aside"><p class="ref-eyebrow">THE QUESTION</p><h2>${esc(p.question)}</h2><div>${launch}</div><dl><div><dt>State</dt><dd>${esc(p.status)}</dd></div><div><dt>Stack</dt><dd>${esc(p.stack)}</dd></div></dl></aside></section><section class="ref-case-sections"><div><p class="ref-eyebrow">HOW IT HOLDS UP</p><h2>Work with a point of view.</h2></div><div class="ref-case-copy"><p>${esc(p.role)}</p><div class="ref-case-copy-block">${facts
    .slice(1)
    .map(
      ([label, value]) =>
        `<article class="ref-case-card"><h3>${esc(label)}</h3><p>${esc(value)}</p></article>`,
    )
    .join(
      '',
    )}</div></div></section>${selectedProof}${frames}<a class="ref-case-back" href="../index.html#directions">Back to the directions ↑</a><section class="ref-case-sections"><div><p class="ref-eyebrow">KEEP READING</p><h2>Another thread.</h2></div><div class="ref-case-copy">${related}</div></section></main><script src="../shared.js" defer></script></body></html>`;
};

await mkdir(new URL('./cases/', root), { recursive: true });
await mkdir(new URL('./previews/', root), { recursive: true });
const modules = await Promise.all(
  directions.map(async (d) => {
    try {
      const imported = await import(`./${d.key}.mjs?build=${Date.now()}`);
      return [
        d.key,
        await imported.default(
          d.key === 'worldbuilder' ? apps.filter((app) => app.selected) : undefined,
        ),
      ];
    } catch (error) {
      if (error.code === 'ERR_MODULE_NOT_FOUND' && error.message.includes(`/${d.key}.mjs`)) {
        console.warn(`Skipping ${d.key}: ${error.message}`);
        return [d.key, null];
      }
      throw error;
    }
  }),
);
const missing = modules.filter(([, html]) => !html).map(([key]) => key);
if (missing.length && process.env.REFINEMENT_DRAFT !== '1') {
  throw new Error(
    `Missing required refinement modules: ${missing.join(', ')}. Use REFINEMENT_DRAFT=1 only for bootstrap builds.`,
  );
}
for (const [key, html] of modules)
  if (html) await writeFile(new URL(`./${key}.html`, root), await pretty(html, `${key}.html`));
await writeFile(new URL('./index.html', root), await pretty(indexHtml(), 'index.html'));
for (const p of projects)
  await writeFile(
    new URL(`./cases/${p.key}.html`, root),
    await pretty(caseHtml(p), `cases/${p.key}.html`),
  );
console.log(
  `Built index, ${modules.filter(([, html]) => html).length}/${directions.length} directions, and ${projects.length} case studies.`,
);
