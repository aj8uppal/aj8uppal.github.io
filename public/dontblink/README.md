# DON'T BLINK

**A horror game that only moves when you blink.**

You are looking down a corridor. Nothing in it moves — not the fog, not the lights, not the thing
at the far end — for as long as your eyes are open. Every time you blink, the world takes a step
you didn't see it take. Twelve authored beats later it is close enough that all that fits in the
frame is one eye, and then you have to hold a staring contest with it for twelve seconds.

Front camera optional. Everything runs on your machine.

## Run it

Static files, no build, no dependencies, works offline.

```
cd ~/personal && python3 -m http.server 8900
open http://localhost:8900/dontblink/
```

- `?demo=1` forces demo mode (SPACE / click / tap is your blink).
- `?demo=0` starts on the camera path.
- `SPACE` blinks, `C` toggles calm mode, `Esc` bails out to the menu.

## How it actually works

**Blink detection, no model, no network.** `js/blink.js` reads the camera into a 128×96 offscreen
canvas and does four cheap things:

1. Finds a coarse face box from rg-chromaticity "skin-ish" pixels plus frame-to-frame motion,
   weighted toward the middle of the frame, then takes the first and second moments of the
   column/row histograms. The box is smoothed with an EMA so it tracks a moving head without jitter.
2. Takes the band across the upper third of that box. That is where the eyes are.
3. Reduces that band to one number every frame: the fraction of pixels darker than 70% of the band
   mean, plus its mean edge energy. Open eyes have pupils, lashes and an iris edge; a closed eyelid
   is a smoother, brighter patch. So the number **dips sharply and briefly** on a blink.
4. Compares that number against a slowly-adapting baseline (EMA mean and mean-absolute-deviation)
   so drifting room light doesn't fire it. A dip past the threshold that recovers within 40–520 ms
   is a blink; a dip that doesn't recover within 900 ms is treated as a lighting change and the
   baseline is re-seated.

Calibration is 3.3 s: 1.4 s of "look at the dot, hold still" to find the box and prime the baseline,
then 1.9 s of "now blink twice" to measure how deep your dips actually are. The threshold is set to
55% of the average measured dip, clamped to a sane range. If it catches nothing, it falls back to a
default threshold and tells you so — it never blocks you.

It is tuned to fail toward *missing* a blink rather than inventing one, and a false positive only
advances the story anyway. SPACE stays live in camera mode as a rescue.

**Rendering.** `js/scene.js` draws everything with canvas 2D: a projected corridor of ten receding
doorframes with per-surface lighting, volumetric haze pouring out of the dying light at the far end,
strip lights that go out one by one as the beats escalate, and a creature built from rounded capsules
with a seeded hand-drawn wobble, a backlit rim, and a depth blur. The reveal is one enormous eye with
procedural iris fibres and the corridor you are standing in reflected in its cornea. No images are
loaded, ever. The world geometry is a pure function of the beat index, so it really is frozen between
blinks — only the film grain, the vignette and the tape glitches move.

**Sound.** `js/audio.js` synthesises everything: a brown-noise room tone, a detuned drone under the
floor, a procedural convolution reverb, and dissonant falling clusters through a waveshaper for the
stingers, spatialised with HRTF panners (the "behind you" beat is genuinely behind you on headphones).

**Beats.** `js/beats.js` is the whole script — twelve hand-placed shots, each with its own camera
offset, creature pose, arm length, lighting state and stinger. Nothing about the sequence is random.

## Demo mode

Demo mode is not a degraded fallback — it is the default, and it is the mode the game was tuned in.
SPACE, click or tap is your blink; every beat, sound, counter, ending and score works identically.
The corner inset shows a drawn eye that closes when you blink instead of your camera feed. Demo mode
is also what you get if the camera is denied, missing, or unavailable because the page isn't on
https/localhost — the app says so and keeps playing.

## Privacy

The camera feed is read into a canvas in your browser and thrown away frame by frame. It is never
uploaded, never recorded, and there are no network requests at runtime at all. Your best score lives
in `localStorage` on this device.

## Known limitations

- The blink heuristic is a heuristic. Glasses with strong reflections, a very dark room, a backlit
  window, or a face far off-centre will degrade it. The corner inset shows the eye band it picked and
  a live trace of the signal so you can see what it is doing, and SPACE always works.
- It reads *any* sharp brief drop in eye-region contrast. Looking down quickly can register as a blink.
  That is why a false positive costs you a beat and never a life.
- HRTF panning needs headphones to be convincing; on laptop speakers the "behind you" cue reads as
  "off to the right".
- Verified on desktop Chrome and Chrome's mobile emulation. The camera path needs https or localhost.

## Files

```
index.html      markup and the four screens
css/style.css   the whole look
js/main.js      state machine, run loop, share card
js/beats.js     the twelve authored beats
js/scene.js     canvas 2D renderer: corridor, creature, eye, grain, tape damage
js/audio.js     WebAudio synthesis
js/blink.js     camera blink heuristic + the demo eye
verify.py       headless Playwright check; writes screenshot.png
```

Run `verify.py` with the Playwright venv:
`/Users/ajuppal/personal/papertrader/.venv/bin/python verify.py`
