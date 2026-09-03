# samebreath

**Two people hold the same screen and try to make one creature breathe.**

One phone, two humans, no network. Each person takes one side. Press when you breathe in,
let go when you breathe out. The left half of a translucent creature is fed by the left
person, the right half by the right person — it only becomes whole and symmetric as the two
rhythms drift into the same speed and the same moment. Hold it together for about three
breaths and it hatches into a shower of paired shapes, leaving a paired glyph behind.

## Run it

Pure static, no build step, no dependencies, works offline.

```
cd ~/personal && python3 -m http.server 8900
# then open http://localhost:8900/samebreath/
```

All asset paths are relative, so it works from any subdirectory of the server root. It does
need to be *served* rather than double-clicked: browsers refuse to load ES modules from a
`file://` address. Open it that way and you get a panel explaining exactly that, rather than
a dead page. There is still no network traffic of any kind once it loads.

- `?demo=1` — force the self-playing attract mode
- `?demo=0` — force live mode (no attract, waits for two people)

## Controls

- **Touch:** two people hold opposite edges of the phone, a thumb each. Two simultaneous
  pointers are tracked and assigned to a side by which half of the screen they land on.
- **Keyboard:** left person holds **F**, right person holds **J** (arrow keys also work).
  One keyboard, two people, elbows touching — this is the fun way on a laptop.

## How it actually works

- **Input** — pointer events with `touch-action: none` and pointer capture, so a thumb that
  slides off its half still reports its release. Each side owns a set of hold tokens fed by
  *both* thumbs and keys, so a side stays inflated while any of its inputs is down — mixing a
  thumb and the F key on one side cannot fake a release mid-breath. Key auto-repeat is
  filtered; `blur` and `visibilitychange` release everything.
- **Rhythm** (`js/breath.js`) — press = inhale, release = exhale. Each side keeps a rolling
  window of the last five press-to-press intervals and takes the *median* as its period, so
  one fumbled tap doesn't wreck the estimate. Lung fullness is a first-order follower whose
  time constant scales with that person's own tempo, which is why the curve is a breath and
  not a square wave.
- **Alignment** — amplitude agreement (works from the very first press), phase difference
  wrapped to ±half a cycle, and period similarity, blended and smoothed. Simply holding both
  keys down is capped below the tolerance: until each side shows a *repeating* rhythm the
  meter can glow but cannot complete.
- **Locking** — while alignment sits above a deliberately forgiving tolerance (0.64), a lock
  timer accumulates; below it, it decays at less than half that rate. The bar is three of the
  pair's average breaths long. Reaching it hatches the creature.
- **Creature** (`js/creature.js`) — 72 membrane points, fixed-step spring integration with
  velocity damping plus two passes of neighbour-averaging for membrane tension, so it behaves
  identically on 60Hz and 120Hz screens. Each point's rest radius is a smooth blend of the two
  people's lung fullness by its angle, with a lopsidedness term that vanishes as they converge.
  Rendered in additive canvas 2D: per-side glow, a translucent gradient membrane, a bright
  inner wall band, a rim light, a specular sweep, cilia, and a nucleus.
- **Sound** (`js/audio.js`) — two detuned voices whose pitch is a function of each side's
  measured period, so they audibly beat against each other and slide into unison as the two
  tempos converge; a shared sub pad only appears when you are close. Synthesised live, no files.
- **Keepsake** (`js/glyph.js`) — a mirrored sigil seeded deterministically from the session's
  two periods and time-together, and a 1080×1080 PNG share card drawn on a canvas and saved
  through a `toDataURL` download.

## Demo mode

`?demo=1` (and, by default, ~1s after an idle load) runs the attract mode: two *simulated*
breathers start at different tempos and out of phase, then drift together and hatch the
creature with no interaction at all — the whole payoff is visible in about 13 seconds. It
drives the exact same `Breather` objects real fingers do, so what you see is the real system,
not a canned animation. A "Demo mode — playing itself" badge is shown with a **take over**
button, and any real press or keypress hands control to the humans immediately.

## Privacy

There is no microphone, no camera, no sensor, no network request, no storage. The only inputs
are the timestamps of presses on this device, and they live in memory until you reload.

## Honesty

The score is a toy measure of how two people tapped one screen. It is not a measurement of
lungs, health, compatibility or a relationship, and the app says so on the result screen.
There is no failure state and no negative label — if the creature hasn't hatched yet the copy
says "not yet — try slower, and start together" and it keeps breathing with you.

## Accessibility / boring cases

- `prefers-reduced-motion` turns on **calm** mode automatically; it is also a visible toggle.
  Calm reaches the canvas, not just the CSS: the membrane's idle fidget, the drifting motes,
  the rotating inner rings and the hatch bloom are all damped or stopped. No strobing anywhere.
- Help and result panels are real `role="dialog"` modals: the rest of the page goes `inert`,
  Escape closes, and focus returns where it came from. Opening help freezes the simulation so
  the demo cannot finish behind your back.
- Panels scroll on short screens even though the rest of the page disables touch gestures, and
  pinch zoom is not blocked.
- Every control is a real focusable button with a visible focus ring; Escape closes help.
- State changes are announced through an `aria-live` region.
- Resize, orientation change, and a backgrounded tab are all handled (physics uses a clamped,
  fixed timestep, so a tab that was hidden for a minute does not explode on return; drifting
  motes are wrapped into the new viewport on rotate).
- The render loop stops repainting once there is genuinely nothing left to animate — behind
  the help panel, and on a result screen left open after the burst has settled.

## Known limitations

- It genuinely needs two people, or two fingers, or two keys. One person can hold F and J and
  it will hatch — that is a feature for solo demos, not a bug.
- Period estimation needs two presses per side before phase can be used, so the first few
  seconds are driven by amplitude agreement alone.
- Sound requires one gesture before the browser will let audio start; the first press does it.
- Multi-touch behaviour depends on the browser honouring `touch-action: none`. On iOS Safari,
  a hard two-thumb hold near the very edge can still trigger a system gesture.

## Verify

```
/Users/ajuppal/personal/papertrader/.venv/bin/python verify.py
```

Serves `~/personal` on a free port, drives demo mode to the hatch, drives the real two-key
interaction to a second hatch, checks a 390px phone layout and a hard resize, fails on any
console or page error, and writes `screenshot.png`.
