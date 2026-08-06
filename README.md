# aj8uppal.github.io

My personal site.
Astro and TypeScript, built static, six React islands.

## Running it

```sh
npm install
npm run dev        # http://127.0.0.1:4321/
```

| Command           | What it does                                                               |
| ----------------- | -------------------------------------------------------------------------- |
| `npm run dev`     | Dev server with HMR at `http://127.0.0.1:4321/`                            |
| `npm run build`   | `astro check` then a static build into `dist/`                             |
| `npm run preview` | Serve the built `dist/` exactly as it will be served in production         |
| `npm run images`  | Re-derive the cropped intermediates in `src/assets/` from the raw captures |
| `npm run lint`    | ESLint plus a Prettier check                                               |
| `npm run format`  | Prettier write                                                             |
| `npm run verify`  | Drive the running site in headless Chromium (see below)                    |

`npm run verify` expects a server already running and defaults to the dev server:

```sh
npm run verify                                   # against http://127.0.0.1:4321/
npm run verify -- http://127.0.0.1:4322/ ./shots # against a preview build, shots elsewhere
```

## Legacy demo URLs

Every demo that predates this rebuild is still served at the URL it always had.
`/grinchjump.html`, `/deviation.html`, `/demos/AutoTyper/index.html` and the rest resolve exactly as before.

The mechanism is `public/`.
Astro copies that directory into `dist/` verbatim, without hashing, rewriting or bundling anything in it, so the old files keep their paths.
The rebuild moved them from the repository root into `public/` and changed nothing else about them.
Breaking a working link in order to tidy up a repository is not tidying up.

That preservation covers demos that still work and that something links to.
It is not a promise to republish every path that ever existed, and these are gone on purpose:

- `photonmap.html` and `pickle.html` hardcoded a live third-party credential in their source.
  Deleting them removes the credential from the served site but **not** from git history, so the credential itself still needs rotating independently of this repository.
- `infinite.html` opened an unending chain of `prompt()` dialogs and trapped the tab.
- `video.html` was an empty Facebook embed whose only real effect was loading the Facebook SDK, so a site that otherwise ships almost no third-party script pulled in tracking on a page with nothing on it.
- `keyboard.js` at the root was a byte-identical orphan copy of `libs/threex/THREEx.KeyboardState.js`, which is vendored and still served, and `images/pickle.jpg` belonged to a card that no longer exists.

Watch for these coming back.
A bulk move into `public/` preserves a deleted file as a rename, which republishes it without anyone deciding to.

## One committed look

The site is dark only.
There is no light theme and no toggle, and that is a decision rather than an omission.

Every screenshot on the page is a capture of a game running at dusk, at night, or under a rendered sun.
A light shell around those images fights them: the page becomes a bright frame with seven dark holes punched in it, and the full-bleed plates stop reading as plates and start reading as embeds.
Committing to one look also means the type contrast, the rule weights and the scrim over every full-bleed caption were tuned once against one background and verified against that background, instead of being approximately right in two.

`color-scheme` and `theme-color` are declared, so browser UI and form controls follow rather than fight it.

## Accessibility

Not decorative, and checked rather than assumed.
`npm run verify` drives three headless contexts and fails the run if any of it regresses:

- 1440 and 390, asserting no horizontal overflow, the spine collapsing cleanly, and the layout landing where it should.
- A third context launched with `reducedMotion: 'reduce'`, asserting that transitions are clamped, that nothing is left mid-reveal, and that the spring-driven tab indicator **jumps** instead of travelling.
  Reduced motion is a separate code path, not a shorter duration: the indicator's spring is stepped by `requestAnimationFrame` normally and skipped entirely when the query matches.

It also sweeps every text node on the page for WCAG AA contrast against the palette, resolving each element's real background rather than the nearest ancestor that declares one - the selected tab is ink on an acid pill painted by an absolutely positioned sibling, and an ancestor walk reports that as ink on ink.

Verified by hand alongside that: full keyboard traversal in DOM order with a visible cyan focus ring, the skip link first, the tablist answering arrow keys plus Home and End with focus following selection, and the hero canvas taking focus so the flow field can be steered with the arrow keys.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages.

**It is `workflow_dispatch` only.**
There is no `push` trigger.
Nothing publishes until someone runs it deliberately from the Actions tab.

## A note on the résumé

The Contact section draws a résumé download button and the button is disabled.

The only PDF on file is from 2024 and it carries a home street address and a personal phone number.
That is fine on an application and not fine on a public page, so there is nothing safe to point the button at yet.
The affordance is built and marked pending; it turns on when a sanitized replacement exists.

`attachments/resume2024.pdf` is still present in `public/` and therefore still reachable at its original URL by anyone who knows it.
Nothing on the site links to it.
Removing it entirely is a separate decision from unlinking it.

## Layout notes

Six sections, each opening on one line of display type and then handing off to something you can move.
The rule the page is held to is that prose earns its place by being short: a section that needs three paragraphs to explain a demo should be showing the demo instead.

The two flagship cards open two-up, frame beside title, rather than with a full-bleed band across the top.
A band cost roughly 250px a card, and cropping saltline's dawn frame down to one would have eaten the corner its status panel lives in - and that panel is the evidence, not decoration.
`npm run verify` fails the run if the page grows past an 11,000px budget at 1440, because length is the thing that quietly comes back.

The hero is a live RK2-integrated flow field on a canvas, spring-driven from the pointer, touch, scroll velocity and the arrow keys.
It caps device pixel ratio, pauses when scrolled offscreen or when the tab is hidden, and under reduced motion draws exactly one still frame and stops.

Three of the Playground demos run inline as React islands rather than as screenshots.
GrinchJump is the real 2015 three.js build in an iframe, and it boots on a press rather than on sight: it grabs the arrow keys and runs a render loop for as long as it is open.
