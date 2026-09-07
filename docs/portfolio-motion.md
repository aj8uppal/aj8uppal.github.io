# Portfolio preview recordings

The six selected project cards use actual app footage. `src/portfolio/motion.ts`
attaches a video source only on hover or explicit Play. A phone uses Play/Pause;
reduced motion and Save-Data disable hover playback. Only one clip plays at a
time. Leaving, scrolling away or hiding the tab restores the still. A clip plays
once, then offers Replay. Case-page photo galleries are independent.

The Saltline picker has all twelve styles from the game's `artStyle.ts`. Each
choice has its own recording and first-frame poster; it is a media preview, not
an embedded game or a CSS filter. Browsing styles downloads no video. Opening the
actual project remains a separate action.

## Reproduce

Use installed Chrome with hardware acceleration and FFmpeg with libx264 and
libvpx-vp9. No capture dependencies are added to the site's lockfile.

```sh
# Start the relevant local app servers separately. Both must serve source via Vite.
# Saltline: client on 5175, offline mode; Blockhold: Vite on 5344.
FFMPEG=/path/to/ffmpeg npm run portfolio:motion:capture
FFMPEG=/path/to/ffmpeg npm run portfolio:motion:prepare
```

Both commands accept project keys. `capture saltline` records all twelve styles;
`prepare saltline-painted` encodes just that recording. `SALTLINE_CAPTURE_URL` and
`BLOCKHOLD_CAPTURE_URL` override those local server addresses.
`PORTFOLIO_MOTION_RAW` overrides the external raw directory, whose default is
`../data/portfolio-videos/2026-09-06` relative to the repository.

The capture script opens disposable browser profiles. It does not modify app
source, personal saves or shared games. Saltline and Blockhold require the source
servers because their capture recipes use the apps' own development handles.
The other four are captured over HTTPS from their public apps.

| Project     | Actual scene and input                                                                                                                                                                                                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Saltline    | Offline seed 4193, fair sea at time of day 0.735, full sail. The same capture view is reset for each of twelve actual visual styles. Physics and water continue during recording.                                                                                                         |
| Murmuration | Built-in track at 55%, ribbon style, zoom 1.15. Audio drives the particles; audio is excluded from the recording.                                                                                                                                                                         |
| Ember Wilds | Fresh Wanderer, tutorial completed and multiplayer presence disabled in disposable local storage. Walk through the Wood's pool into the Hearthvale, use ordinary zoom/tilt controls, then walk through the village.                                                                       |
| Blockhold   | Prepared level-40 account and 2,800 gold in a disposable profile; ten basic towers placed through the real build function. Tidereach's authored wave 27 runs normally. Enemy introductions are marked seen to keep their tutorial dialogs from pausing the battle. No score is submitted. |
| Cubit       | A fresh game played with 49 keyboard moves, then real slides, a mouse orbit and the Space layer fan. No leaderboard submission.                                                                                                                                                           |
| Eyeshot     | Actual Angle playground challenge, seed 4193, with a 64-degree target. Pointer input adjusts the arm, then Enter locks it in. The compositor is recorded because the grid is CSS behind a transparent canvas; frames are cropped to the challenge and retain their capture timestamps.    |

Opaque canvas apps are recorded with `captureStream(60)`. Cubit and Eyeshot use
the browser compositor to retain their CSS backgrounds. Eyeshot's compositor delivered
about 49 changing frames per second, plus held frames. Deliverables are silent
1280 × 720 H.264 MP4 at 60 fps, with metadata at the front for streaming. The
poster is extracted from the **first decoded frame of the final encoded MP4**,
then passed through the site's responsive image pipeline. No invented frames,
color filters or generated gameplay are used.

`scripts/prepare-portfolio-motion.mjs` writes source hashes, sizes and frame
counts to `src/data/portfolio-motion-captures.json`. `--manifest-only` verifies
existing encodes without regenerating them. Raw video stays outside Git; final
clips live in `public/media/previews/` and posters in `src/assets/`.

`npm run verify` includes the media interaction checks in
`scripts/portfolio-motion-checks.mjs`: playback, pause, first-click behavior,
style matching, rapid changes, touch, keyboard, reduced motion, network failures,
no-JavaScript fallbacks and no eager video requests.
