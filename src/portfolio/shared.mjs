import { contact, about, roles } from '../data/content.ts';
import { projects, project, particleMeasurement, homeProjectKeys } from '../data/portfolio.ts';

export { contact, about, roles, projects, project, particleMeasurement, homeProjectKeys };
export const esc = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

// These tokens are resolved by PortfolioMarkup.astro through Astro's image
// service. The same resolver handles the photographs in interactive controls.
export const asset = (key) => `/__portfolio-image__/${key}.webp`;
export const img = (key, alt, attrs = '') =>
  key ? `<img src="${asset(key)}" alt="${esc(alt)}" ${attrs}>` : '';
export const url = (href) => href;
export const out = (href, label, cls = '') =>
  href
    ? `<a class="${esc(cls)}" href="${esc(href)}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(label)} <span aria-hidden="true">↗</span></a>`
    : '';
export const email = (label = 'Email', cls = '') =>
  `<a class="${esc(cls)}" href="mailto:${esc(contact.email)}">${esc(label)} <span aria-hidden="true">↗</span></a>`;
export const caseLink = (key, label = 'Inside the build', cls = '') =>
  `<a class="${esc(cls)} ref-case-link" href="/portfolio/work/${esc(key)}/">${esc(label)} <span aria-hidden="true">→</span></a>`;
export const frame = (_key, body) => body;

export function collectionDoor(keys, cls = '') {
  return `<section class="portfolio-discovery ${esc(cls)}" aria-labelledby="discovery-title"><header><div><p class="ref-eyebrow">A few more things I’ve made</p><h2 id="discovery-title">Follow your curiosity.</h2></div><p>Instruments, simulations, games and useful little tools. There’s an engineering story behind every one.</p></header><div class="portfolio-discovery-grid">${keys
    .map((key) => {
      const p = project(key);
      return `<article><a class="portfolio-discovery-image" href="/portfolio/work/${esc(key)}/" aria-label="Explore ${esc(p.name)}">${img(p.image, p.alt, 'loading="lazy"')}<span aria-hidden="true">↗</span></a><p class="ref-eyebrow">${esc(p.kind)}</p><h3>${caseLink(key, p.name)}</h3><p>${esc(p.summary)}</p></article>`;
    })
    .join(
      '',
    )}</div><a class="portfolio-collection-link" href="/portfolio/collection/">Explore all ${projects.filter((p) => p.key !== 'notable').length} projects <span aria-hidden="true">→</span></a></section>`;
}
