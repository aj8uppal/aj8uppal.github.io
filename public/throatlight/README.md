# throatlight

**Hum one note and watch your voice open a cathedral made of light.**

A held note becomes a rose window: the pitch you sing sets the rotational symmetry, the
harmonic content of your timbre picks the glass colours, loudness drives the bloom, and your
vibrato bends the arches. Stop singing and the window doesn't collapse — it frosts over and
settles, waiting.

Everything happens inside the browser tab. No network calls, no uploads, no recording.

## Run it

It is a static page with no build step:

```
cd ~/personal
python3 -m http.server 8900
# open http://localhost:8900/throatlight/
```

- `?demo=1` — skip onboarding and go straight to the built-in voice.
- `?demo=0` — skip onboarding and ask for the microphone immediately.

Keyboard: **space / F** freeze, **S** save PNG, **M** mute, **C** calm mode, **R** reset,
**D** switch between the microphone and the demo voice.

## How it actually works

**`js/pitch.js` — pitch.** An `AnalyserNode` gives a 2048-sample time-domain window; that goes
through the McLeod Pitch Method: a normalised square difference function (NSDF) over lags from
~75 Hz to ~1150 Hz, then "first key maximum above `k · tallest maximum`" peak picking, then
parabolic interpolation for sub-sample precision. Plain autocorrelation octave-flips constantly
on a sung vowel because the second harmonic produces a nearly equal peak at half the lag; MPM's
normalisation is what makes the lock stable enough to drive geometry. The NSDF value at the
chosen peak is the clarity, and it gates everything: below ~0.78 clarity or ~0.009 RMS the app
treats the input as silence rather than inventing a note. The NSDF runs at 30 Hz (a voice does
not change pitch meaningfully in 16 ms); loudness is measured every frame.

**Timbre.** `getFloatFrequencyData` is sampled at the first ten harmonics of the detected
fundamental; their amplitude-weighted centroid is the "brightness" that moves the palette. With
no fundamental it falls back to a plain spectral centroid so the colour still breathes.

**`js/rose.js` — the window.** Canvas 2D, drawn like real glazing: a near-black stone disc,
mullions, then rings of lights (a rim of oculi, gothic lancets, lozenges, trefoils) and the
oculus at the centre. Colours come from a cyclic seven-stop glass ramp interpolated in HSL, so
in-between colours stay saturated pot-metal glass instead of sliding through mud; each ring
steps a little further along the ramp. The "lit from behind" look is a cheap bloom — downscale
the drawn window to a fifth, blur it, composite it back additively over just the window's
neighbourhood. No `shadowBlur` anywhere, which is what keeps it fast.

**Mapping.** Pitch class → 9…20-fold rotational symmetry (rising with the note). Register →
3…5 orders of tracery. Timbre → position on the glass ramp. Loudness → bloom, ray strength and
rotation speed. Vibrato (peak-to-peak excursion over the last half second) → how much the
arches bend. Cents off the nearest semitone → a shear between the rings. Silence → a settle
value that stops the rotation, flattens the deformation and frosts the glass.

**`js/engine.js` — the two sources.** The microphone (requested with echo cancellation, noise
suppression and auto gain **off**, all three of which wreck pitch fidelity) and the demo voice
feed the *same* gain bus → highpass → analyser. The analysis code cannot tell them apart.

## What demo mode simulates

A synthetic voice, not a recording: a sawtooth glottal source through three bandpass formants,
a pink-noise breath layer, a 5.2 Hz vibrato and a slow drift on `detune`, and two slow LFOs
sweeping the brightness filter and the second formant so the timbre — and therefore the colour
— evolves across the phrase. A lookahead scheduler walks it through a fourteen-step modal line
with two rests in it, so you see the window re-key, and you see it crystallise. It is audible
by default (mute with **Sound off**), and it is routed through the identical analysis path, so
the live note readout is genuinely tracking it, not faking it.

Demo mode is entered automatically if the microphone is denied, missing, or unavailable
(including on plain http, where browsers refuse `getUserMedia` outright).

## Known limitations

- Pitch, not polyphony. One voice at a time; a chord or a backing track will make the detector
  pick whichever partial wins, and the clarity gate will often just call it silence.
- The `?demo=1` page needs one click or keypress before a browser will let audio start, unless
  the page was opened with an autoplay exception. Until then you get the dormant, crystallised
  window and a prompt.
- Very quiet or very breathy humming sits under the clarity gate on purpose. That is a design
  choice: garbage pitch produces garbage geometry, so silence is the honest answer.
- Frequency and cents are a real measurement of the signal, but they are not a tuner. Room
  noise, a laptop microphone's response, and the browser's own audio pipeline all move the
  reading by a few cents.
- Reduced motion is respected automatically, and **Calm** slows the rotation and softens the
  bloom further. There is no strobing or flashing anywhere in the app.

## Files

```
index.html              markup and the onboarding gate
css/throatlight.css     art direction, the bottom dock, responsive layout
js/pitch.js             MPM pitch detection + note maths
js/engine.js            audio graph, microphone, demo voice, analysis
js/rose.js              the renderer
js/card.js              the PNG plate
js/main.js              state, frame loop, UI wiring
verify.py               headless Playwright check (exits non-zero on failure)
screenshot.png          produced by verify.py at the payoff moment
```
