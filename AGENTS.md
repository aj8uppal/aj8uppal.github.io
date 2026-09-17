# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.

## `public/` is a URL contract, not an attic

Voidreach's `/voidreach/` release comes from the healthy `voidreach-online` Fly
image, via `scripts/sync-voidreach.mjs`. Every Pages build downloads and checks
that artifact; the deploy workflow also checks for direct Fly releases every
15 minutes. Never hand-edit its bundled HTML. The checked-in copy is a local
preview snapshot; run the sync script to refresh it. Release checks and retry
commands are in `docs/voidreach-release.md`.

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

`src/portfolio/gallery.ts` reserves the tallest caption's height so changing
screenshots does not move the controls. Schedule those size writes in an animation
frame after `ResizeObserver` delivers; writing inside the observer causes Safari
to report a layout loop.

Homepage preview clips have a separate capture/encode workflow documented in
`docs/portfolio-motion.md`. Their stills come from the first decoded frame of the
final MP4; regenerate the pair together. Keep raw footage outside Git and video
sources detached until interaction. Use current element geometry for the first
Play click: IntersectionObserver can still report the frame before scrolling.

## `/built` has its own capture script and its own gate

`npm run built:shots` drives each app into the state its card shows and writes
`src/assets/built-<key>.webp` directly. These captures are independent of
`npm run images`. Recipes live in `scripts/capture-built.mjs` and its imported
capture modules. Local apps use a server rooted at `public/` on port
8099 (`CAPTURE_BASE` overrides it); hosted apps use their live URLs. Set
`CAPTURE_CHANNEL=chrome` to use installed Chrome with native GPU rendering.
Synthetic inputs must pass through the real app and be disclosed in `cap`.

`src/data/built.ts` supplies the collection, categories and homepage strip.
`featured` keeps the homepage shortlist; `selected` adds collection picks.
The collection opens with their union, reveals more on request, and renders
everything without JavaScript. Counts and filter results derive from the data.
Every entry needs a capture recipe, image, accurate reach label and a concrete
engineering fact. `npm run verify:built` checks those rendered entries, links,
captures, filters/search, keyboard focus, no-JS, phone layouts and AA contrast
on both resting and hovered cards.

## Verification

`npm run verify` is the production Worldbuilder gate. Its wrapper is
`scripts/verify.mjs`, which runs `scripts/verify-portfolio.mjs` against the
root page; `npm run verify:portfolio:lab` adds the review directions and their
cases. Run the matching build and keep Astro preview bound to
`--host 127.0.0.1`; the suite dials that literal address.

`npm run verify:legacy` is a separate gate for the archived `/previous/` page
and runs `scripts/verify-legacy.mjs`. Do not use its measurements as the
production page's budget or route check.

Both portfolio verifiers use a real `prefers-reduced-motion: reduce` browser
context. Reduced motion is a separate code path, not a shorter duration. The
legacy tab indicator is stepped by `requestAnimationFrame` normally and jumps
in a single assignment when the query matches, so its assertion checks for no
intermediate positions.

Nothing drives the compositor in that context, so a screenshot taken straight
after a style change can come back with the previous frame still on it. Await
two `requestAnimationFrame`s before capturing.

## Review-only UI has to be gated in three places

The design lab is review furniture and must not reach a visitor.
`Base.astro` decides whether it renders, the panel waits for `?lab` even in a build made with `npm run build:lab`, and `astro.config.mjs` resolves the component to an empty one for any build that did not ask for it.
The third one is not redundant: Astro hoists the `<script>` of every `.astro` file in the module graph and writes it into `_astro`, and neither a dead branch nor a dynamic import takes the file out of that graph.
Its classes are prefixed `dlab`, because the playground cards already own `.lab` and a panel for reviewing the page must not inherit the page.

## Page length is a standing budget

The production and lab homepage limits are `HOME_HEIGHT` in
`scripts/verify-portfolio.mjs`. The archived `/previous/` limits are
`HEIGHT_BUDGET` and `MOBILE_BUDGET` in `scripts/verify-legacy.mjs`; the
constants beside those checks explain their measured content. Keep each page's
authority separate when changing copy or vertical rhythm.

The budgets exist because length regresses by accretion - a paragraph here, a
section pad there - and nobody notices until the page is thousands of pixels
longer.
When a change pushes it over, the fix is almost always copy or vertical rhythm, not shrinking someone's work: cut prose, or put the frame beside the title instead of above it.

## Contrast checking sees layers, not ancestors

The production/lab gate uses `scripts/portfolio-contrast.mjs` through
`scripts/verify-portfolio.mjs` to sweep the Worldbuilder type over all three
hero photographs. The archived `/previous/` WCAG sweep lives in
`scripts/verify-legacy.mjs`; it resolves an element's background by first
looking for an absolutely positioned sibling painted underneath it, and only
then walking ancestors.

That legacy page's selected tab is ink on an acid pill drawn by `.fs__ind`, a
sibling; an ancestor walk finds the dark card and reports a false failure at
1.2:1. The legacy sweep also measures `-webkit-text-stroke-color` for text
with a transparent fill, because the outlined second name line is drawn
entirely by its stroke.

## `src/data/receipts.json` is a transcript, not content

Nothing hand-edits it. `npm run receipts` opens the two public games over HTTPS, waits for the state each one only reaches when it is running, and writes the verdict; `.github/workflows/playable.yml` runs that weekly and commits the result.
A missing run renders as "not yet proved this build", which is the correct output and not a bug to route around.
That workflow runs on `macos-latest` because Ember Wilds refuses to boot on a software renderer by design, and a GitHub-hosted Linux runner has no GPU - a run that cannot reach a verdict is recorded as `blocked` and the page then says nothing at all.

## Grid items have a min-content floor

A grid item's automatic minimum size is its min-content unless `min-width: 0` says otherwise.
`.fs__strip` wraps a `width: max-content` tab list, so at 390 a `1fr` track resolved to 692px and blew the page out horizontally - and only in the switcher with seven tabs, which is what made it look like a content bug rather than a layout one.
Any grid child that contains something horizontally scrollable needs `min-width: 0`.

## Shipworthy is one file, and its ideas are regenerated daily

`public/shipworthy/index.html` is the whole app and the only source: a single HTML document with its CSS and JS inline, served at `/shipworthy/` like the other demos, with no build step.
The same page is also published as a Claude artifact; that copy is the file minus the doctype and head, and it is derived from this one, never the reverse.

`.github/workflows/shipworthy-daily.yml` runs `scripts/shipworthy-daily.mjs` every morning: one request to the Messages API (built-in fetch, no SDK, because the lockfile has to stay untouched) that writes `public/shipworthy/daily.json` and appends to `archive.json`, which is what tomorrow's prompt is told to avoid.
The page reads `daily.json` at load and shows the set as today's drop; without it, or when the ideas fail its own checks, it falls back to remixes seeded by the date, so a missed run is a quieter day and never a broken one.
The job needs the `ANTHROPIC_API_KEY` repository secret and exits clean without it.
A commit made with the workflow token does not trigger the deploy, so the job dispatches `deploy.yml` itself when the drop changed.

## `public/rift-clash/` is a build, and its lobby is on Fly

Rift Clash's source lives in `~/personal/web-brawhalla`; `public/rift-clash/` is its `npm run build:pages` output plus `licenses/`, so change the source and re-copy rather than patching the bundle.
Online play connects to the `rift-clash` Fly app (`wss://rift-clash.fly.dev/signal`), which accepts `https://aj8uppal.github.io`, its own origin and localhost, and relays match packets when players can't connect directly.
It keeps rooms in memory, so it stays one always-on machine (`fly deploy --ha=false`; autostop once stopped it mid-match).
The lobby only pairs players whose build hash matches `release.json`, so redeploy Fly and re-copy the Pages build together. `docs/rift-clash-release.md` has the steps.

## `public/hypergrid/` is a copy, and its relay is on Fly

HYPERGRID's source lives in `~/personal/geometry-wars-claude`; `public/hypergrid/` is copied from it by that project's `scripts/sync-portfolio.sh`, so edit the source and re-sync rather than patching the copy.
Online play connects to the `hypergrid-online` Fly app (`wss://hypergrid-online.fly.dev/ws`), which accepts only the `https://aj8uppal.github.io` origin plus localhost; serving the game anywhere else needs that allowlist changed.
The relay keeps rooms in memory, so it must stay a single machine (`fly deploy --ha=false`).
Both players need the same build: the page's service worker is network-first for that reason, and peers refuse a protocol-version mismatch.

## Portfolio directions share their depth

The Worldbuilder portfolio is the site root `/`; `/portfolio/` redirects there.
The four alternatives, `/directions/`, and `/alternate/` are injected only in
dev mode or `build:lab`/`palettes` output. `/previous/` preserves the archived
portfolio with its noindex treatment. `/built/` is the shared project
collection. Project pages and app records come from `src/data/portfolio.ts`,
with app records derived from `built.ts`; curate those records instead of
deleting public demo files. `homeProjectKeys` and `secondaryProjectKeys` own
the two homepage tiers; the hero’s backdrop order is a separate choice.

`npm run portfolio:images` reproduces reviewed photographs from the external raw
archive; its recipes and provenance manifests are separate from the live
`built:shots` batch. `npm run portfolio:shots` photographs the comparison
directions and should run against a lab build when those routes are needed.
See `docs/portfolio-local-demo.md` for review commands, fixed ports, route
availability, and frozen game snapshots.

## Project-page trailers

`src/data/portfolio-trailers.json` maps ten reviewed films to web derivatives,
first-frame posters, caption tracks and music credits. The capture masters stay
outside Git; `npm run portfolio:trailers:prepare` reproduces the public files
without remixing their audio. See `docs/portfolio-trailers.md` for the archive,
encoding settings and size limits. `npm run verify` exercises these players,
including no eager media requests, retry, no-JS and touch playback. Project-page
screenshots now sit in a native disclosure; open it before driving the gallery.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
