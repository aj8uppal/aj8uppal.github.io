# Gravity Lies

**Tilt your phone to bend a star field — then find out which way *down* really is.**

A four-chapter perception piece dressed as an observatory instrument. A few thousand
stars are integrated against a gravity vector, and the piece changes which gravity
vector that is:

1. **Screen down** — the stars pour toward the bottom edge of the screen no matter how
   you hold the device. One marked star (`REF-1`) quietly refuses and tracks real gravity.
2. **World down** — the stars fall toward measured gravity. The plate stops being a box
   and becomes a window: the sky holds still while the device moves around it.
3. **Two downs** — half the field keeps the screen's story and half keeps the sensor's,
   so the two frames visibly shear apart.
4. **Reveal** — both vectors are drawn on the plate: *what your brain guessed*
   (screen-relative down, always 0°) against *what the sensor measured*, in degrees,
   with the calibration and noise caveats stated plainly.

## Run it

It is pure static files. Serve the parent directory and open the folder:

```
cd ~/personal && python3 -m http.server 8900
open http://localhost:8900/gravitylies/
```

Opening `index.html` straight off disk also works in most browsers, but the ES modules
want an http origin, so the server is the reliable path. There is no build step, no
dependency, no network request at runtime — it works with the machine offline.

* `?demo=1` forces the simulated tilt. `?demo=0` asks for real sensors on load.
* Space / → advance a chapter, ← goes back, or use the chapter rail at bottom-left.

## How it actually works

**Gravity vector** (`js/sensors.js`). `accelerationIncludingGravity` from `devicemotion`
is low-pass filtered (α = 0.88) to strip out hand motion; that gives a stable but laggy
estimate of which way is up. The browser's `deviceorientation` beta/gamma angles give a
fast but drifty estimate, converted to a device-frame gravity vector with
`g = (cosβ·sinγ, −sinβ, −cosβ·cosγ)` — derived from the W3C `Rz(α)Rx(β)Ry(γ)` matrix.
The two are blended in a complementary filter (0.72 accelerometer / 0.28 orientation)
and the result is smoothed with a 120 ms time constant. `screen.orientation.angle` is
rotated out so landscape is handled. iOS's `requestPermission()` gate is called from the
button's own gesture, for `DeviceMotionEvent` and `DeviceOrientationEvent` in parallel.

**Calibration** is a two-second "hold it flat" hold: the residual in-plane reading is
recorded and subtracted afterwards. It can be skipped, and it gives up gracefully after
14 seconds rather than trapping you.

**The plate** (`js/field.js`). Up to 3,400 stars in flat `Float32Array`s — position,
velocity, per-star depth, per-star allegiance — integrated with real acceleration and
linear drag, wrapped toroidally, with zero allocation inside the frame loop. Brightness
tier doubles as depth, so dim stars respond to the same gravity more slowly and the
field has parallax. Each star is stroked as the segment it swept during a 65 ms exposure
window, one path per tier, which is what gives the long-exposure trails at eight draw
calls a frame. Chapter 3 fans a per-star blend factor across the population so half the
field follows each frame.

**The instrument overlay** (`js/reveal.js`) is a second canvas cleared every frame:
hairline vectors, a tick ring, the sector between the two answers, `REF-1` and its
recorded track. The PNG export composites the live plate, both vectors and the readouts
into a 1200×1500 card via `toDataURL` — rendered on-device, downloaded locally.

## Demo mode

Desktop is demo mode by default and it is the intended way to see this on a laptop.
The tilt is simulated: an autopilot flies a scripted sequence of device rotations, and
each chapter jumps the script to a rotation that actually demonstrates that chapter.
Moving the pointer over the field takes the controls — horizontal is roll, vertical is
pitch, top of the window is flat on a table — and the autopilot eases back in after
2.4 seconds of stillness. Pointer activity over the HUD is treated as navigation, not
tilt. A "Demo mode" badge is always visible with a one-click *use my real sensors*
button, and every simulated number is labelled as simulated, including on the PNG card.

If sensors are requested and denied, unavailable, or served over plain http where iOS
refuses them, the badge says exactly why and the simulation carries on. If a live sensor
stream stops (tab backgrounded, permission revoked) it falls back after 3 seconds.

## Known limitations

* The tilt readout is a live estimate, not metrology. Hand tremor, linear motion,
  sensor bias and the coarse flat-calibration put roughly ±3° on it, more while moving.
* `deviceorientation` alpha (compass heading) is ignored — this piece only cares about
  the gravity direction, which alpha does not affect.
* Real motion sensors need a secure context. Over `http://` on a phone, iOS will refuse
  and you get demo mode; use `https` or localhost for the live path.
* `prefers-reduced-motion` cuts the star count, removes the trails and stills the
  autopilot's sway. The piece never flashes or strobes.
* Nothing is uploaded and nothing is stored — no localStorage, no cookies, no network.

## Files

```
index.html      markup and copy
css/app.css     the whole visual system
js/sensors.js   gravity vector: live fusion + simulated autopilot
js/field.js     star field simulation and long-exposure renderer
js/reveal.js    vector instrument overlay and PNG plate export
js/main.js      chapter director, UI wiring, permission flow
verify.py       headless Playwright check (exits non-zero on failure)
```
