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

## `/built` has its own capture script and its own gate

The eleven cards on `/built` are photographs of eleven running apps, and they
are not made by `npm run images`: that script crops a batch of raw captures
that live outside the repo, and these have no raw batch. `npm run built:shots`
_is_ the batch - it drives each app into the one state its card shows (a GO
verdict, a poster made from a real photo, two browsers in one drawing round)
and writes `src/assets/built-<key>.webp` straight out. Six of the eleven are
read off `public/` on a local server, so a card can be reshot before the change
is pushed; the rest are read from the live site. Re-running it changes the
pictures, because live apps are different every time. That is the point, and
the page says so.

Nothing on that page is hand-listed twice. The three lead cards, the grid of
eight, and the block at the foot of the Playground on the index all come off
`src/data/built.ts` - `featured: true` is the whole ranking - and each app's
accent colour with them. `npm run verify:built` is the gate: it proves every
link answers, every capture loads, the index fold opens, and every accent still
clears AA on both the card's ground and its hover ground, which is the one
thing that quietly breaks when a palette moves.

## Verification

`npm run verify` drives the running site in headless Chromium and is the gate before calling visual work done.
It needs a server already up: `npm run dev` for the source, `npm run preview` for the built output.

Preview the output of `npm run build:lab`, not `npm run build`.
The suite drives the design lab to prove each hero variant mounts, and a plain build resolves that component away (see below), so four assertions fail on a correct tree.
`astro preview` also has to be bound with `--host 127.0.0.1`; the suite dials that literal address and the default bind does not answer it.
Its reduced-motion context is a real `prefers-reduced-motion: reduce` browser context, not a stubbed media query.

Reduced motion here is a separate code path, not a shorter duration.
The spring-driven tab indicator is stepped by `requestAnimationFrame` normally and jumps in a single assignment when the query matches, so the assertion that proves it is the absence of intermediate positions - never arrival speed, because React runs the effect after paint and even a jump lands a few frames late.

Nothing drives the compositor in that context, so a screenshot taken straight after a style change can come back with the previous frame still on it.
Await two `requestAnimationFrame`s in the page before capturing, or an element you just hid will still be in the picture.

## Review-only UI has to be gated in three places

The design lab is review furniture and must not reach a visitor.
`Base.astro` decides whether it renders, the panel waits for `?lab` even in a build made with `npm run build:lab`, and `astro.config.mjs` resolves the component to an empty one for any build that did not ask for it.
The third one is not redundant: Astro hoists the `<script>` of every `.astro` file in the module graph and writes it into `_astro`, and neither a dead branch nor a dynamic import takes the file out of that graph.
Its classes are prefixed `dlab`, because the playground cards already own `.lab` and a panel for reviewing the page must not inherit the page.

## Page length is a standing budget

`npm run verify` fails if the document grows past `HEIGHT_BUDGET` in `scripts/verify.mjs` - the script is the authority on the number; a copy of it here has drifted stale once already.
It has been raised deliberately, for the block at the foot of the Playground that carries three of the eleven and folds the rest; the comment beside the constant says what bought it, and the next change to it should do the same or not happen.
The budget exists because length regresses by accretion - a paragraph here, a section pad there - and nobody notices until the page is 17,000px again.
When a change pushes it over, the fix is almost always copy or vertical rhythm, not shrinking someone's work: cut prose, or put the frame beside the title instead of above it.

## Contrast checking sees layers, not ancestors

The WCAG sweep in `scripts/verify.mjs` resolves an element's background by first looking for an absolutely positioned sibling painted underneath it, and only then walking ancestors.
The selected tab is ink on an acid pill drawn by `.fs__ind`, a sibling; an ancestor walk finds the dark card and reports a false failure at 1.2:1.
It also measures `-webkit-text-stroke-color` for text with a transparent fill, because the outlined second name line is drawn entirely by its stroke.

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

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
