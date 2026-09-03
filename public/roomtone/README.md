# roomtone

**Point your camera around your room and discover its secret color chord.**

A five-second sweep samples the space, collapses it into five floating colour orbs,
and plays them back as a chord that is unique to that room — with an invented name
like *Soft Sienna* or *Tobacco Meridian* that is the same every time for the same room.

## Run it

Pure static, no build step, no network. Serve the parent directory over http:

```sh
cd ~/personal && python3 -m http.server 8900
# then open http://localhost:8900/roomtone/
```

`file://` will not work — ES modules need http. Camera capture additionally needs
`https` or `localhost`; anywhere else the app quietly stays in demo mode.

URL flags: `?demo=1` forces demo mode, `?demo=0` asks for the camera on load.

## How it actually works

**Sampling.** During the scan, frames are drawn into a 64×48 offscreen canvas ~48 times.
Every pixel is converted to **OKLab** (`js/color.js`, the real Ottosson matrices — clustering
in sRGB pulls every centroid toward the same grey mud) and dropped into a coarse
12×14×14 OKLab bin. Each bin remembers its pixel count *and how many distinct frames it
appeared in*.

**Clustering.** `js/cluster.js` runs weighted k-means++ over the bins with k=5. A bin's
weight is `pixels × persistence^1.25 × (0.42 + 4·chroma)` — so a colour that survived the
whole sweep beats a colour that flashed past once, and a small vivid accent can hold its
own against an enormous beige wall. Afterwards, any two centroids closer than 0.052 in
OKLab are separated by re-seeding the weaker one at the point furthest from every other
centroid, so you always get five *readable* colours instead of four browns and a fifth brown.

**Chord.** `js/music.js` picks one five-note mode from the palette's mean lightness,
chroma and warmth (Ionian / Aeolian / Dorian / Lydian / Mixolydian / Suspended pentatonic),
and a key from the most *persistent* colour's hue, walked around the circle of fifths so
neighbouring hues give neighbouring keys. Then per colour: hue → scale degree, lightness →
register, chroma → timbre brightness and amplitude. Two guarantees keep it musical —
every voice lands on a different degree of the one mode (a hue collision walks to the
nearest free degree instead of stacking octaves), and the register blends absolute
lightness with lightness *rank*, so even a room of five browns opens into a spread voicing.
Because everything is quantised into one pentatonic mode, the result can be strange but
never sour.

**Sound.** `js/audio.js` is a hand-built FM + additive voice: a sine carrier modulated at
1×/2×/3× with an index driven by chroma, three soft partials, a detuned unison, a lowpass
that closes over the tail, a slow attack and a 6–9 second decay. The chord blooms as a
0.19 s arpeggio. Reverb is a **generated** impulse response (deterministic noise, cubic
decay, two early reflections) through a ConvolverNode — there are no audio files anywhere.
On a phone, `deviceorientation` pans each voice as you turn.

**Name.** `js/naming.js` hashes the quantised palette plus key and mode, then picks from a
curated word table (hue bucket × lightness band, plus qualifiers, numerals and nouns).
Same room, same name.

**Card.** `js/card.js` draws a 1000×1180 @2× PNG in canvas — five bands, the note names,
the hexes, the invented name — and downloads it via `toBlob`.

## Demo mode

Mandatory and genuinely playable. Four rooms are **drawn entirely in code** in
`js/rooms.js` as 1800×700 panoramas — a bedroom at dusk, a fluorescent office, a green
kitchen in the morning, a studio after midnight — and the demo "camera" pans across one
during the scan. They feed the *identical* pipeline: same sampler, same clustering, same
reveal, same synthesis. Nothing about the demo path is faked or pre-baked; the chords are
computed from the pixels every time.

Demo mode is entered automatically whenever the camera is unavailable, not yet permitted,
or blocked by an insecure context, and it is announced with a visible **Demo mode** badge
next to a one-click *Use my camera*.

You can also drop in a local photo — that path works in both modes and is the nicest way
to try it on a laptop.

## Privacy

Nothing leaves the device. There are no network requests at runtime at all: no fonts, no
CDN, no analytics, no uploads. Photos and camera frames are read into a canvas in the page
and discarded.

## Known limitations

- **Live camera results are not deterministic.** Demo rooms and photos sample at fixed
  sweep positions, so the same room always gives the same chord and name. A live camera
  sees whatever you point it at, so rescanning the same room gives a related but not
  identical chord.
- "% of sweep" on the card is each cluster's share of the *weighted* sample mass, not a
  literal fraction of pixels — the weighting is described above.
- The invented chord names are decorative. They are deterministic, not meaningful; there
  is no claim that a room "is" anything.
- Safari needs a tap before audio starts; the scan button is that tap. If a browser refuses
  to start audio at all, the palette and card still work and the app says so.
- `deviceorientation` panning needs a phone; on iOS it asks for motion permission on the
  first scan and silently does without if declined.
- Rooms with a single flat colour (a lit whiteboard, a dark ceiling) produce a palette
  fanned out in lightness rather than five genuinely different hues. That is honest — there
  was nothing else there.

## Files

```
index.html        markup and copy
css/roomtone.css  the whole visual system
js/app.js         state machine, scan loop, wiring
js/stage.js       the canvas: viewfinder, scan overlay, orb reveal
js/color.js       sRGB <-> OKLab
js/cluster.js     persistence-weighted binning + weighted k-means++
js/music.js       palette -> mode, key, voicing
js/naming.js      deterministic chord names
js/audio.js       FM/additive voice + generated convolution reverb
js/rooms.js       four procedurally drawn demo rooms
js/sources.js     demo / photo / camera sources behind one interface
js/card.js        the downloadable PNG
verify.py         headless Playwright check; writes screenshot.png
```

## Verify

```sh
/Users/ajuppal/personal/papertrader/.venv/bin/python verify.py
```

Serves `~/personal`, loads `/roomtone/?demo=1`, fails on any console or page error, drives
the real scan, asserts the reveal canvas is not uniform, checks the five swatches and note
names, downloads the card, checks determinism across a rescan, checks a 390 px viewport for
overflow, exercises the camera-denied path, and writes `screenshot.png`.
