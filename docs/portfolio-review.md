# September 2026 portfolio review

Start the complete local review with `npm run portfolio:review`. The published
homepage remains unchanged. These directions are committed on the local
`portfolio/curated-worldbuilder` branch for AJ to choose between.

| Direction        | Local route                                    | Best reason to choose it                                                                                    |
| ---------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Worldbuilder** | <http://127.0.0.1:4340/portfolio/>             | The leading choice: AJ first, atmospheric real work, and professional responsibility immediately afterward. |
| Editorial        | <http://127.0.0.1:4340/portfolio/editorial/>   | The quickest hiring read, with Notable responsibility and scale in the first screen.                        |
| Open Studio      | <http://127.0.0.1:4340/portfolio/studio/>      | A warmer, playful introduction with interest panels and a working angle exercise.                           |
| Field Notes      | <http://127.0.0.1:4340/portfolio/field-notes/> | A clothbound cover, folding index and a chapter margin that follows three engineering stories.              |
| Observatory      | <http://127.0.0.1:4340/portfolio/observatory/> | A clear introduction beside arched project photographs and a quiet, pausable constellation.                 |

The [comparison page](http://127.0.0.1:4340/directions/) contains real captures of
all five. Every direction opens the same curated collection of **24 personal
projects**, each with a complete case page. A separate Notable case describes
AJ's professional scope and attributes platform scale to the team. The primary
page selects five projects; the collection starts with six and supports search,
filters and progressive expansion. Deeper engineering and photo galleries live
inside the cases.

## Selection and photographs

Worldbuilder opens with **Murmuration → Saltline → original Ember Wilds**. Boundary
and Bring Something Home have smaller homepage features; Voidreach and Driftfall
are included in the collection. AJ's excluded projects are absent from the
portfolio records. Existing public demos remain at their original URLs.

The new Saltline moonlight, sunrise and morning frames come from AJ's supplied
HUD-free HEIC captures. Other refreshed pictures are captures of running apps,
with the original app interface retained where it helps explain the interaction.
Playlist From a Photo uses the Saltline sunrise as its real input; its fixed
demo song list is disclosed. Prepared or built-in sample data is identified in
the image provenance. Bring Something Home's strongest encounter frame is
explicitly attributed to the owner's prepared-character playtest.

`npm run portfolio:images` reproduces the selected captures from the external raw
archive. Its two manifests record crops, dimensions, source hashes and capture
provenance. `npm run portfolio:shots` photographs the five directions for their
comparison cards. Hidden lazy images are excluded from its first-screen decode
wait, so an inactive Studio panel cannot stall the batch.

## Review and verification

Claude **Fable 5.1** supplied the plan, a mid-build adversarial review, and the
final visual adjudication using actual desktop and phone screenshots. GPT-6
Astra independently reviewed the five designs and WebKit behavior; GPT-5.6 Luna
handled bounded app capture, release and runtime checks. Root Codex integrated
the shared portfolio and verified the final result.

Fable and the independent reviewer both preferred Worldbuilder to the current
design for AJ's brief. Fable ranked Editorial next for hiring clarity; the
independent reviewer ranked Observatory next for the balance of personality
and professional work. Both are deliberate alternatives. Fable's final two
refinements were applied: the résumé is in Worldbuilder's opening actions, and
Observatory uses one row of navigation on a phone.

Final checks:

- `npm run lint`, `npm run build:lab` and the ordinary production build pass.
- `npm run verify:portfolio`: **619 checks**, **85 page/viewport combinations**,
  zero failures. Includes all five homes from 320px to 1440px, all 25 cases at
  phone and desktop widths, image loading, heading fit, navigation, keyboard
  controls, photo-dialog focus, collection behavior, no-JavaScript fallbacks,
  reduced motion, and actual pixel contrast over the three Worldbuilder scenes.
- `npm run verify:built`: **103 checks**, zero failures, including every app
  destination, image and card accent.
- The existing `npm run verify` regression gate passes against a lab build.
- Independent installed WebKit audit: **97 effective checks**, zero remaining
  failures. Covers seven routes at phone/desktop widths plus post-build rechecks.
  An initial collection request overlapped a local rebuild; those temporary 404
  observations were retained separately and rechecked against stable output.
- All **375 pre-existing public files** and **24 original candidate files** are
  byte-for-byte unchanged.
- Both frozen multiplayer games passed fresh desktop and phone gameplay checks
  through the final launcher: entry, real movement and combat input, saved
  traveler/pilot recovery after reload, and touch controls. No page, console or
  request errors were recorded; both phone layouts fit 390px.

Worldbuilder measures 4,940px at 1440px width and 7,374px at 390px. The existing
homepage measures 15,491px on the phone viewport. The reduced page length comes
from curation and moving depth into case pages, while preserving access to the
full body of work.

## App release boundaries

[Boundary](apps/boundary.md) is the verified static 3.1.0 release, published
independently at <https://aj8uppal.github.io/boundary/> in `d9e5d98`.
Its Pages deployment and live HTTPS/offline checks pass.
[Driftfall](apps/driftfall.md) and
[Bring Something Home](apps/bring-something-home.md) use frozen production
snapshots and disposable state through the local launcher. The canonical new
RPG rebrand is complete; original Ember Wilds remains a separate project.

The redesign is **local review**, not the public homepage replacement. Before
promotion, replace the two loopback play destinations with genuine public hosts
or case-only links, and remove the review-only indexing metadata deliberately.
See [local demo instructions](portfolio-local-demo.md) for ports, snapshot paths
and restart behavior.
