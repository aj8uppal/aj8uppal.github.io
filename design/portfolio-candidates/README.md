# Four portfolio candidates

Local, browsable design studies for AJ Uppal. Open `index.html` to compare all four, or serve the repository root and visit `/design/portfolio-candidates/`.

1. **The Editorial** — a concise introduction, three selected projects, and a professional record. The broadest fit for hiring and collaboration.
2. **Open Studio** — a playable angle exercise and a filterable app shelf. Lead with the pleasure of using things AJ has made.
3. **Field Notes** — questions, experiments, and illustrated observations. The most specific expression of AJ’s engineering and astrophysics background.
4. **Worldbuilder** — a cinematic scene selector for saltline, Ember Wilds, and murmuration. Lead with creative engineering and immersion.

The comparison page explains each direction’s structure, interaction, mobile layout, audience, tradeoffs, and effort. These are proposed designs, not a replacement for the current site. App links open the existing destinations; the full case-study architecture is described rather than implemented.

## Regenerate

From the repository root, with Node 24:

```sh
node design/portfolio-candidates/build.mjs
python3 -m http.server 4334 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4334/design/portfolio-candidates/`.

With that server running, refresh the desktop and phone previews:

```sh
node design/portfolio-candidates/capture.mjs
```

`build.mjs` reads the existing project and experience data in `src/data/`. Images reference the existing captures in `src/assets/`; they are not regenerated or edited. `previews/` contains browser screenshots of the concepts for the comparison page.

Everything lives outside `src/` and `public/`, so Astro does not publish the proposals. No dependencies, production routes, or legacy URLs are changed.

## Validation — September 4, 2026

All five review pages were checked in Chromium at 320, 390, 768, 1024, and 1440 pixels: no horizontal overflow, valid section anchors, and reduced motion respected. Project disclosures, all filters, the angle exercise and reset, all six clock frames, the three world selectors, and desktop/mobile comparison controls passed. Content and contact links remain available with JavaScript disabled. ESLint and Prettier pass for the proposal files.

`npm run build:lab` passes. The required `npm run verify` against that build finishes with one existing failure: `scripts/verify.mjs` expects one `.swipe__row` at 390px, while the current site contains two working swipe rows. The proposals do not alter the production source or that assertion. The rest of the site verification passes.

`previews/four-directions.webp` is the exported comparison sheet; individual desktop and phone screenshots are beside it.
