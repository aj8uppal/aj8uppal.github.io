# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.

## `public/` is a URL contract, not an attic

Every file under `public/` is served at its literal path, unhashed and unbundled.
That is the only thing keeping the pre-2026 demo URLs (`/grinchjump.html`, `/deviation.html`, `/demos/AutoTyper/index.html`, ...) alive after the Astro rebuild.
Moving or renaming anything in there breaks a link that has worked for a decade.

The contract covers demos that still work and that something links to.
It does not cover every path that ever existed.
Bulk-moving the old site into `public/` preserves deleted files as renames, which silently republishes things that were cut on purpose - `video.html`, the orphaned root `keyboard.js` and `images/pickle.jpg` all came back that way and had to be re-deleted.
After any bulk move, diff what `public/` now serves against what the site served before, and confirm each survivor is still reachable from a page that ships.

## Third-party dependencies

GitHub Pages serves this site over HTTPS, so browsers block any `http://` subresource as
mixed content; a demo that requires it can fail before rendering.
Several standalone demos here were written in 2016 against CDN URLs that have since rotted.
Vendor third-party code under `public/libs/` instead of pointing at a CDN, and record its provenance
in `public/libs/README.md`.

When touching an old demo, load it over HTTPS - not `http://localhost` - or mixed-content
failures will not reproduce.

## Images

The raw captures are 3-9MB PNGs that live outside the repo, in `data/portfolio-assets/`.
`npm run images` crops the letterbox bars and the saltline developer panel off them and writes the intermediates committed under `src/assets/`; Astro's sharp pipeline derives the responsive AVIF/WebP from there.
The crops are measured against the actual capture dimensions and documented at the top of `scripts/prepare-images.mjs`.
Re-run it after changing a crop rather than editing an intermediate by hand.

`<Picture>` emits `width` and `height` attributes, which are definite enough that `aspect-ratio` is ignored.
Any rule that shapes one of these images needs `height: auto` alongside it.

## Verification

`npm run verify` drives the running site in headless Chromium and is the gate before calling visual work done.
It needs a server already up: `npm run dev` for the source, `npm run preview` for the built output.
Its reduced-motion context is a real `prefers-reduced-motion: reduce` browser context, not a stubbed media query.

Reduced motion here is a separate code path, not a shorter duration.
The spring-driven tab indicator is stepped by `requestAnimationFrame` normally and jumps in a single assignment when the query matches, so the assertion that proves it is the absence of intermediate positions - never arrival speed, because React runs the effect after paint and even a jump lands a few frames late.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
