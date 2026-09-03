# Pulseprint

**Put a finger over your camera; your heartbeat paints a living signature no one else can make.**

A single page that reads your pulse out of the red glow of a covered camera lens and grows one
luminous mark per beat into a fingerprint-like bloom, stamped with the live BPM. Freeze it and
save a PNG.

**This is a visual toy, not a medical device.** No diagnosis, no health scores, no wellness claims.
The BPM is a rough estimate produced for the drawing, and it is labelled as such in the UI.

## Run it

Static files, no build step, no network at runtime. Serve the parent directory over http:

```
cd ~/personal && python3 -m http.server 8900
# then open http://localhost:8900/pulseprint/
```

`file://` will not work — ES modules and `getUserMedia` both need an origin. All asset paths are
relative, so the app works from any sub-path.

- `?demo=1` forces the simulated pulse.
- `?demo=0` forces an attempt at the real camera.
- Keys: `1` `2` `3` switch style, `F` freeze / unfreeze, `M` toggles calm motion, `Esc` closes the card.

## How it actually works

1. **Sampling.** Each video frame is drawn into a 48×36 offscreen canvas and the middle 60% is
   averaged. A fingertip on the lens turns the whole frame into one slowly-throbbing red field, so
   the mean red level *is* the plethysmogram. The green/blue channels only feed the "is something
   actually on the lens" confidence.
2. **Band-pass.** Two cascaded first-order high-passes (τ = 0.5 s) remove lighting drift and
   breathing wander, then a τ = 55 ms low-pass removes sensor grain. The signal is inverted, because
   more blood means more absorbed light means a *dip* in red.
   *The obvious approach — subtract a 1-second boxcar moving average — is a trap: its first sinc
   null sits at 1 Hz, right on top of a resting heart rate, and it quietly cancels the pulse. That
   bug cost an hour; hence the comment in `js/signal.js`.*
3. **Peak detection.** Adaptive threshold at 34% of the 3.5 s peak-to-peak amplitude, a refractory
   period of 0.55 × the running median interval (clamped to 0.28–0.68 s) so the dicrotic notch
   cannot double-trigger, and parabolic interpolation of each apex for stable intervals.
   Against the simulator's ground truth this finds 100% of beats with no false positives.
4. **Quality, and refusing to lie.** A 0–1 blend of perfusion amplitude and interval consistency,
   *gated* by lens-coverage confidence and decayed toward zero if no beat arrives for 2.5 s.
   The gate matters: a room-facing webcam sees plenty of regular flicker, and without it the app
   would happily report "Locked — 66 BPM" from a ceiling light. Coverage is judged on red dominance,
   not brightness, and below 0.32 no beat is accepted at all.
5. **Drawing.** Beat interval, beat-to-beat variation, amplitude and quality feed a deterministic
   seeded generator that stamps one mark per beat into a fixed 1400×1400 "ink" canvas — fixed, so
   resizing the window rescales the artwork instead of destroying it. Three seeds:
   **Corolla** (golden-angle phyllotaxis with a connective spiral thread), **Filament** (a coiling
   thread with a tick per beat), **Ripple** (contour rings whose harmonics come from beat variation).

Nothing is uploaded. There are no network requests at runtime at all; the app works with the
machine offline.

## Demo mode

If there is no camera, permission is denied, or the page is on an insecure origin, the app falls
back to a simulated photoplethysmogram and every part of the experience keeps working — lock,
detection, BPM, art, export. The simulation is a two-lobe pulse waveform (systolic peak + dicrotic
notch + tail) at ~68 bpm with respiratory sinus arrhythmia on a 4.3 s cycle, an Ornstein–Uhlenbeck
rate drift, three-component baseline wander and Gaussian grain. It runs through the exact same
signal chain as the camera — nothing is faked downstream. Demo mode pre-rolls 20 s of simulated
pulse before the first frame, so it opens on a locked signal and a bloom already in progress.

The "Demo mode" chip is always visible, and one click on **Use my camera** switches to the real thing.

## Known limitations

- Real PPG needs a torch. On phones the app turns it on when the track exposes the `torch`
  capability (Android Chrome does; iOS Safari does not). Without it you need bright ambient light
  behind your fingertip, and the signal is weak.
- Desktop webcams have no lens contact and no torch, so the live path there will sit at
  "No signal" until something red covers the lens. That is deliberate — see the coverage gate
  above — not a bug. Use demo mode.
- Switching cameras mid-print keeps the artwork; only the source changes.
- Movement wrecks the signal. The quality meter is the tell; wait for "Locked".
- The BPM is a toy estimate from ~8 intervals. It is not a heart-rate monitor.
- Long sessions gently fade the oldest ink every 140 beats so the print does not silt up.

## Files

```
index.html        markup and the two overlays
css/pulseprint.css
js/signal.js      band-pass + adaptive peak detection + quality scoring
js/source.js      CameraSource (getUserMedia, torch, device list) and DemoSource (simulated PPG)
js/art.js         the ink canvas, three styles, live compositing, share card
js/app.js         glue, chrome, main loop
verify.py         headless Playwright check; exits non-zero on failure
screenshot.png    produced by verify.py at the payoff moment
```

## Verify

```
/Users/ajuppal/personal/papertrader/.venv/bin/python verify.py
```

Serves `~/personal`, loads `/pulseprint/?demo=1`, drives Begin → lock → bloom, asserts the canvas is
not a uniform frame, exercises style switching, the share card, keyboard access, resize, a phone
viewport, and the permission-denied live path, and fails on any console or page error.
