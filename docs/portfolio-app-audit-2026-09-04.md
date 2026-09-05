# Portfolio application audit — 4 September 2026

Reviewed the 40 immediate project directories under `~/personal`, their release paths and any configured Git upstreams. Source readiness, publication status and suitability for a hiring portfolio are separate decisions. Existing live products did not need redeployment merely to acquire a card.

## Release set

The collection at `/built/` now has 27 entries. Six open by default: Slipstream, Eyeshot, BeatLayer, Voidreach, Throatlight and Filefossil. Categories, search and progressive disclosure expose the rest. Each card pairs a real running capture with a short purpose and a specific engineering decision. The existing homepage keeps its three-card shortlist; the proposed Worldbuilder homepage remains a design review artifact.

Four new static releases are hosted alongside the existing apps:

| App                     | Source directory    | Public path      | Release evidence                                                                                                                                                                         |
| ----------------------- | ------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slipstream              | `slipstream`        | `/slipstream/`   | Single-file build; four render modes, obstacle drawing/undo, URL round trip, PNG export and phone interaction checked. A 2D pressure-only simulation, not a validated 3D drag tool.      |
| Dustbound               | `3d-red-dead-codex` | `/dustbound/`    | Build and full three-chapter browser smoke passed, including combat, horseback travel and restart. Desktop keyboard and mouse are required.                                              |
| Realm of the Voxel Gods | `3d-rotmg-codex`    | `/voxel-gods/`   | Build, five unit tests and nested-path browser journey passed: class → realm → dungeon → victory → permadeath → new hero. Hero, vault and graveyard are browser-local. Desktop controls. |
| Ash & Iron              | `red-dead-codex`    | `/ash-and-iron/` | Build and real desktop/phone start-and-fire checks passed. Relative asset paths and locally vendored fonts make the static release independent of a font CDN.                            |

Only the built runtime files were copied. The Three.js MIT notices and the complete Rye and Source Serif 4 OFL notices ship with their bundles. No account database, development server or research workspace was included.

AI Wrapped (`ai-wrapped`)'s latest source adds multi-file and JSONL import; synthetic single-file and multipart exports passed on desktop and phone, including card navigation and PNG export. Only the tested HTML was copied to the existing public route. The other existing app bundles were compared with their local source/release artifacts to distinguish current releases from intentional browser demos.

## Existing projects

| Source directories                                                                                                                              | Decision and evidence                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterimage`, `apologyengine`, `cursorweather`, `dontblink`, `filefossil`, `gravitylies`, `pulseprint`, `roomtone`, `samebreath`, `throatlight` | Ten existing public experiments, newly given collection cards. All 77 runtime files matched local source and live publication. Their verification scripts and fresh desktop/phone browser captures passed. Sensor-free demos use the apps' real processing paths; captions identify synthetic inputs. |
| `beatlayer`, `voidreach`, `lifetrack`, `sleep-debt-ledger`                                                                                      | Existing collection entries retained. Local release files match the published bundles; no unrelated runtime changes required. BeatLayer's refreshed capture feeds a synthetic guitar recording through its real beat tracker.                                                                         |
| `eyeshot`                                                                                                                                       | Existing live product and card retained. The image and caption now both identify the BISECT challenge.                                                                                                                                                                                                |
| `run-or-not`, `sixty-seconds`                                                                                                                   | Existing live services retained. Weather and multiplayer captures describe an actual moment, not fixed results.                                                                                                                                                                                       |
| `playlist-from-photo`                                                                                                                           | Retained with an explicit Demo label: the public browser demo uses twelve fixed songs, while the full app has an API-backed recommendation path.                                                                                                                                                      |
| `tab-graveyard`                                                                                                                                 | Retained with an Unpacked label. The public page demonstrates the card; the extension requires installation.                                                                                                                                                                                          |
| `papertrader`                                                                                                                                   | Public research memo retained. The trading app, account data and private research inputs are not part of the release.                                                                                                                                                                                 |
| `voidborne`                                                                                                                                     | Added a card for the already deployed Fly service. Deployed smoke passed HTTP/CSP/assets and two-pilot WebSocket checks. Server rooms and opt-in PvP are distinguished from local PvE/progression. Git main was clean and synchronized.                                                               |
| `emberwilds`                                                                                                                                    | Existing featured world retained. Git main was clean and synchronized; no unpushed release work.                                                                                                                                                                                                      |
| `blockhold`                                                                                                                                     | Existing work-in-progress presentation retained. The `long-tail` branch was clean and synchronized; it was not silently merged into main.                                                                                                                                                             |
| `saltline`                                                                                                                                      | Existing featured world retained. Pending progression work was reviewed, fixed and pushed to an isolated review branch. See below.                                                                                                                                                                    |

Shipworthy lives inside this portfolio repository, rather than in a separate top-level directory. Its existing daily idea bench also receives a collection card.

## Saltline source push

[Draft PR #113](https://github.com/aj8uppal/saltline/pull/113) contains the first-fitting guidance and settled voyage accounting work, plus three defects caught during review: cargo loss accounting on sink, partial versus closed voyage settlement, and uncosted peer-to-peer cargo being counted as realized profit.

The regressions drive the actual room settlement path. Two isolated mutations that restore the faulty behavior fail the tests. `pnpm gate` passed with the real PostgreSQL and Redis test services. Commit `ba86e7ee` is pushed on `review/portfolio-progression-2026-09-04`; the original working checkout remains intact. Production was not redeployed: the progression pacing still needs its documented playtest.

## Held or intentionally omitted

| Source directory           | Reason                                                                                                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cricket`                  | Current source build fails with missing/mismatched game exports and APIs; 18 tests fail. An older archived bundle runs, but was not presented as a current release.           |
| `driftfall`                | 167 tests pass, but the current build cannot resolve `src/journey.css`. It also requires a persistent Node service.                                                           |
| `astro-emberwilds`         | Separate from the existing Ember Wilds. Tests and types pass, but the current build cannot resolve `src/hud.css`; its account/SQLite server requires a deliberate deployment. |
| `space-codex`              | Early space-interface prototype with hard-coded player/latency displays and placeholder actions. The working Voidborne release represents this direction more accurately.     |
| `eyeball`                  | Earlier geometry-game prototype; the current Eyeshot release is the stronger representative.                                                                                  |
| `3d-rotmg`                 | Earlier game iteration; the tested original Voxel Gods release provides the complete playable loop selected for the collection.                                               |
| `viralnight`               | An index of the same ten experiments now individually represented, not an additional product.                                                                                 |
| `codex-html`               | A large collection of standalone interface studies rather than one released app. Kept out of the main engineering collection to avoid duplication and volume.                 |
| `astra-app`, `venture-lab` | Research and validation workspaces, not verified shipped applications. Their source material was not bulk-published.                                                          |
| `aj8uppal.github.io`       | This portfolio, rather than another card within itself.                                                                                                                       |

## Visual direction and release checks

Worldbuilder opens on Murmuration, then offers Saltline and Ember Wilds in that order. The introduction identifies AJ's engineering work before the personal worlds. Its new discovery door draws three picks from the same catalogue and becomes a horizontal row on phones. The original four candidate files remain unchanged.

- `npm run build:lab` and `npm run lint` passed. The full running-preview `npm run verify` passed with no failures; `npm run verify:built` passed 133 checks. The production build continues to exclude the review-only design lab.
- The collection gate checks every catalogue URL and capture, six-item initial selection, filters/search/URL restoration, keyboard focus, no-JavaScript output, reduced motion, narrow layouts and resting/hovered contrast.
- The four refinement prototypes and their case pages passed 201 checks across 45 page/viewport combinations. Expanded Worldbuilder passed 118 behavior, fallback and rendered-contrast checks, including all three hero backgrounds. No horizontal overflow or broken images were found at the tested widths.
- Claude Fable 5.1 reviewed the final desktop/phone screenshots and found no remaining visual blockers; Codex implemented and verified the corrections. Screenshots are regenerated through the checked-in capture recipes, not painted into the apps.

The authoritative catalogue and recipes are `src/data/built.ts`, `scripts/capture-built.mjs`, `scripts/capture-experiments.mjs` `scripts/capture-games.mjs` and `scripts/capture-audio.mjs`. This report records the audit decision; live conditions and availability can change.
