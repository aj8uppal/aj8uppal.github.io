# Afterimage

**Stare at a ghost for eight seconds, then watch it appear on your real wall.**

A perception bench for negative afterimages. It builds an opponent-colour negative of a picture,
holds it under a fixation dot for 8–12 seconds, then cuts instantly to a flat neutral field —
where the original picture appears to float, drawn entirely by your own visual system.
The screen is blank at that moment. Nothing is being rendered.

## Run it

Pure static, no build step, no network. Serve the parent directory over http:

```sh
cd ~/personal && python3 -m http.server 8900
# then open http://localhost:8900/afterimage/
```

`file://` will not work (ES modules). Any static server will.

- `?demo=1` — auto-plays the 4-second compressed preview and shows the demo badge.
- `?demo=0` — plain landing, no auto-play.

## How it actually works

**The plate** (`js/oklab.js`, `js/process.js`). The adapting image is not a `255 − x` RGB inversion —
that gives a weak, muddy percept. Every pixel goes to **Oklab**, a perceptual space whose `a`/`b` axes
line up with the visual system's red–green and blue–yellow opponent channels. Then:

1. Lightness is percentile-normalised (1.5 / 98.5) so a few specular pixels or a black border
   cannot set the range.
2. A `tanh` S-curve expands midtone contrast while *compressing* the extremes, so nothing crushes
   to black or bleaches to white — a saturated region cannot adapt.
3. Lightness is inverted inside a safe band (roughly 0.19–0.92, never 0 or 1).
4. `a` and `b` are negated and scaled by the strength slider (chroma boost up to ×2.25).
5. Back to sRGB with **hue-preserving gamut compression**: if a colour falls outside the display
   gamut, chroma is bisected down until it fits. Clipping channels instead would shift hue, and the
   afterimage would come back the wrong colour.

**The run** (`js/app.js`). Countdown on the neutral field (so your eyes are already adapted to its
brightness) → adaptation with a hard fixation target and a sub-pixel drift plus ~1% luminance breath
(a perfectly stationary retinal image Troxler-fades; the drift keeps edges alive without giving the
eye anything to follow) → an instant one-frame cut to the flat field → a soft "blink slowly" prompt,
since a blink usually strengthens the percept. During the run there is no chrome on screen at all:
one canvas, the field colour, the plate, the dot.

**The subjects** (`js/subjects.js`) are drawn in code at any resolution — a flat screen-print
portrait, a high-chroma dusk landscape, and a twelve-hue chroma standard. High chroma, hard edges
and big flat areas give the strongest afterimages.

## Demo mode

There is no permission to deny here, so demo mode is a **compressed preview** instead: the whole
pipeline in ~4 seconds, inline in the lab frame, with the three stages labelled and a timeline —
negative plate → cut → neutral field. On the neutral field it draws a faint, explicitly labelled
*simulated percept* so you can see what the pipeline is aiming at without sitting through the stare.
That overlay is a simulation and says so on screen; in the real run nothing is drawn there.
The full experience is one click away.

## Privacy

Zero network requests at runtime. Imported images are decoded in the tab with the File API,
cropped and downscaled on a canvas, and never leave the device. Only four small preferences
(strength, duration, field colour, reduced intensity) are kept in `localStorage`.

## Safety

One high-contrast image and one cut to a bright field — no strobing, no rapid flashing.
There is a photosensitivity note up front and a **reduced intensity** mode (narrow lightness band,
low chroma, soft cross-fade instead of a hard cut). `prefers-reduced-motion` removes the drift.
`Esc` stops a run at any time, and losing tab focus mid-stare aborts rather than pretending.

This is an ordinary property of normal vision. It is not a vision test, it measures nothing,
and it diagnoses nothing.

## Verify

```sh
/Users/ajuppal/personal/papertrader/.venv/bin/python verify.py
```

Serves `~/personal`, loads `/afterimage/?demo=1`, drives the preview and a full 8-second run,
samples canvas pixels for contrast and colour, exercises import / export / mobile layout / the
non-demo path, fails on any console or page error, and writes `screenshot.png`.

## Known limitations

- The strength of the percept depends heavily on your display brightness and the room. A dim
  laptop screen in a bright room gives a weak ghost; that is physics, not a bug.
- Fullscreen is requested on start and silently skipped if the browser refuses; the run surface is
  a fixed overlay either way, so it still fills the window.
- Very large imported images are decoded at full size before being downscaled to 720², which can
  take a moment on a phone. Files over 60 MB are refused.
- On iOS Safari, fullscreen for a non-video element is unavailable; the overlay covers the viewport
  but the browser chrome may remain. It still works.
- The share card renders the *simulated* percept panel, since the real one only exists in your eyes.
