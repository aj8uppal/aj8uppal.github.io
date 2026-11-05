# aj8uppal.github.io

My personal site: a flight through a system of worlds.
Astro and TypeScript, built static. The homepage runs one WebGL 2 scene (three.js) behind ordinary HTML.

## Running it

```sh
npm install
npm run dev        # http://127.0.0.1:4321/
```

| Command                  | What it does                                                               |
| ------------------------ | -------------------------------------------------------------------------- |
| `npm run dev`            | Dev server with HMR at `http://127.0.0.1:4321/`                            |
| `npm run build`          | `astro check` then a static build into `dist/`                             |
| `npm run preview`        | Serve the built `dist/` exactly as it will be served in production         |
| `npm run images`         | Re-derive the cropped intermediates in `src/assets/` from the raw captures |
| `npm run lint`           | ESLint plus a Prettier check                                               |
| `npm run format`         | Prettier write                                                             |
| `npm run verify`         | Drive the running site in installed Chrome, GPU on (see below)             |
| `npm run orbit:textures` | Re-derive the scene's textures from the raw art in `data/orbit-art/`       |
| `npm run orbit:stills`   | Re-photograph the share card and the no-WebGL backdrop from the scene      |

`npm run verify` expects a server already running and defaults to the dev server:

```sh
npm run verify                                   # against http://127.0.0.1:4321/
npm run verify -- http://127.0.0.1:4322/         # against a preview build
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
`npm run verify` (`scripts/verify-orbit.mjs`) fails the run if any of this regresses:

- 1440 and 390: no script errors, no horizontal overflow at any station, one `h1`, every station labelled by its heading, the skip link first in tab order.
- Every world's play link and case study, every belt card and contact link resolving.
- Preview clips stay detached until their world is on screen, then play; the camera follows the scroll and the HUD names the station.
- A `reducedMotion: 'reduce'` context: native scroll, no autoplay, the belt laid flat, and the camera **cutting** to each station instead of flying.
  Reduced motion is a separate code path, not a shorter duration.
- A no-JavaScript context: every heading visible, no loader left over the page, and a real frame of the scene standing in for it.

The scene is decoration with a job, never a container for content: every word, number and link is HTML in reading order, and the canvas is `aria-hidden`.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages.

**It is `workflow_dispatch` only.**
There is no `push` trigger.
Nothing publishes until someone runs it deliberately from the Actions tab.

## A note on the résumé

Contact links `attachments/resume2026.pdf`, the first version safe to serve: the home street address is off it.
The 2024 file it replaced is gone from the repository.

## Layout notes

The homepage is fourteen stations: the black hole, the system, eight worlds, the belt of smaller builds, Earth for the day job, an Earthrise for the origin story, and the hole again to say hello.
Each station's sticky stage holds the camera while you read; the scroll between stations is the flight.

The hero is a Schwarzschild black hole raymarched in a fragment shader at reduced resolution: photon paths bend by `a = -1.5 h² r / |r|⁵`, the disk is Doppler-beamed and gravitationally redshifted, and rays that never come close take the weak-field deflection analytically.
Keplerian shear winds any disk texture into hairlines over time, so two layers on staggered clocks cross-fade.
Quality steps down a tier whenever the frame rate stays under 42 fps for two seconds; the canvas pauses with the tab.

Planet surfaces are generated illustrations (prompts in `src/orbit/textures/manifest.json`), Earth is NASA Blue Marble and Black Marble, and Blockhold, Hypergrid, murmuration and Boundary are built in code: a voxel planet, a cube-mapped neon grid, particle ribbons on a beat, and a cricket ball whose seam is kept toward you.
Every screenshot and clip beside them is captured from the running app.
