# cursorweather

**Your mouse has been leaving weather behind its whole life. Now you can see it.**

Chase rings for five seconds. The pointer then vanishes and the way it moved blooms into a
small climate: hesitation becomes fog, frantic corrections become lightning, smooth fast arcs
become warm jet streams, overshoot-and-return becomes turbulence, and clicks punch thunder
holes through the cloud deck. The recorded track sweeps back across the sky as a weather front.

It is playful data visualisation of motor behaviour. It is **not** a personality test, not a
diagnosis, and it has no opinion about you — it only knows arithmetic on pixel coordinates.

## Run it

Pure static, no build, no network. Serve the parent directory and open the app folder:

```
cd ~/personal && python3 -m http.server 8900
# → http://localhost:8900/cursorweather/
```

`?demo=1` forces the synthetic pointer and auto-runs the whole thing; `?demo=0` forces the
live pointer. Everything is measured and drawn on the device — there is no server to send
anything to.

## How it actually works

**Sampling** (`js/tracker.js`). Pointer position is sampled from `pointerrawupdate` where the
browser has it, otherwise `pointermove` plus `getCoalescedEvents()`. Derivatives are computed
on a fixed ~28 ms time baseline rather than sample-to-sample: pointers report integer pixels,
and a raw per-sample third derivative is almost pure quantisation noise, so a time baseline
keeps a 125 Hz mouse and a 1000 Hz mouse comparable.

Statistics computed over a rolling window:

| statistic | how |
| --- | --- |
| speed, peak | magnitude of the smoothed velocity, mean and 100th percentile |
| curvature | turn angle per pixel, measured on ~14 px chunks of arc length |
| directional entropy | Shannon entropy of a 16-bin heading histogram, distance-weighted |
| micro-tremor | mean second difference of position while under 90 px/s |
| dwell | fraction of time under 26 px/s, and episodes longer than 120 ms |
| corrections | heading reversals past 110° within 520 ms of a committed run (>150 px/s) |
| jerk spikes | jerk over 3.2× its own running average while moving |
| clicks | count and cadence |

**The six mappings** (`drivers()` in `js/tracker.js`). Each drawing knob is a hand-tuned
monotonic curve on one or two of those numbers. The legend names the statistic behind every
mapping and prints its current value, so nothing in the picture is unattributed:

- **fog** — dwell fraction + micro-tremor amplitude
- **jet stream** — sustained speed with low path curvature
- **lightning** — spikes in jerk
- **turbulence** — overshoot-and-return events + directional entropy
- **thunder holes** — click count and cadence
- **clear high pressure** — what is left when entropy, tremor and corrections are all low

**Drawing** (`js/noise.js`, `js/sky.js`, `js/chart.js`). A coarse grid of a 3-octave gradient-noise
scalar potential is rebuilt every frame; particle velocity is the curl of that potential (so the
flow is divergence-free and behaves like air), plus a jet term aligned with your dominant heading.
Turbulence raises the amplitude and frequency of the upper octaves. Particles are advected and
drawn as additive segments onto a slowly fading canvas; fog is a separate quarter-scale buffer of
drifting soft lobes, blurred on the way up, that clicks punch out with `destination-out`; lightning
is midpoint-displacement polylines. The isobar hairlines on the chart layer are marching-squares
contours of a deliberately smooth version of that same potential, and the H/L centres are its local
extrema — so the chart and the wind are genuinely the same field.

**The reveal** replays the recorded track scaled to the frame, drawn with meteorological front
symbols (warm where you moved fast, cold where you crawled). As the front head passes each
recorded event, that event fires: recorded jerk spikes throw bolts, recorded clicks punch holes,
recorded corrections throw gusts.

## Demo mode

`?demo=1`, the "Watch it run itself" button, or the `demo mode` badge. A synthetic pointer traces
a plausible human path: Fitts's-law submovements (MT ≈ 0.115 + 0.12·log₂(2D/W + 1)), an overshoot
of 3–18 %, one or two corrective submovements, ~9 Hz tremor, hesitations mid-flight and a dwell
before each click. Its physics run at 240 Hz but it only *reports* at 125 Hz on integer pixels —
the same rate and quantisation a real mouse gives — so its statistics are comparable to yours.
It is a plausible hand, not a recording of one. Click the badge to take over with your own pointer.

**Keyboard** is a real third input, not a fallback: arrow keys or WASD fly a pointer, space clicks,
Enter starts. It has hard corners, constant top speed and no tremor, so it produces visibly
different weather (little fog, sharp corrections) — which is the point.

## Known limitations

- The mappings are hand-tuned curves chosen because they look good, not calibrated against
  anything. The numbers in the legend are real; the picture is an interpretation.
- Station codes, pressures in hPa and the H/L centres are decoration drawn from the noise field.
  They are not a forecast of any place.
- Trackpad and mouse do read differently (trackpads dwell more and reverse harder), but that is an
  observation, not a claim the app can identify your hardware.
- WebM export needs `MediaRecorder` + `canvas.captureStream`; where those are missing the button
  is hidden and PNG is the only export. Canvas `filter` support only affects how soft the fog is.
- Very short calibrations (barely any movement) honestly produce a near-empty sky, and say so.
- Lightning flashes briefly. `prefers-reduced-motion` turns on calm mode automatically, and the
  calm-mode button is always available.

## Files

```
index.html      markup + copy
css/app.css     the whole look
js/main.js      state machine, sampling, HUD, PNG/WebM export
js/tracker.js   statistics and the six mappings
js/noise.js     gradient noise, curl grid, marching-squares isobars
js/sky.js       particles, fog, lightning, thunder holes
js/chart.js     isobars, stations, targets, replay front
js/synth.js     synthetic pointer + keyboard pointer
verify.py       headless Playwright check (exits non-zero on failure)
```
