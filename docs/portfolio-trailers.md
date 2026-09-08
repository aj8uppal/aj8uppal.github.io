# Trailers on project pages

The ten featured films appear above the screenshots on their
`/portfolio/work/<key>/` pages. Screenshots remain in a native disclosure with
the existing gallery and lightbox. Other project pages keep their original layout.

The player starts from the first decoded frame and downloads no video until
Play. It uses native playback, seeking, volume, fullscreen and caption controls;
JavaScript adds a larger initial Play button, replay and network-error recovery.
Sound starts only after an explicit click, tap or keyboard action. Native video
controls and screenshots still work without JavaScript. Music/source attribution
stays next to the player and is also embedded in the downloaded MP4.

## Media

`src/data/portfolio-trailers.json` maps the approved films to web files, first-frame
posters, text tracks and artist credits. It records both master and export hashes.
The source is the reviewed v4 `final-manifest.json` in the external
`../data/portfolio-trailers/2026-09-07/cinematic-v4` archive. The full 4K masters
and the earlier trailer-review page remain unchanged there.

Run `npm run portfolio:trailers:prepare` to reproduce the web files. Set `FFMPEG`
and `PORTFOLIO_TRAILER_ARCHIVE` to override local paths. It requires FFmpeg with
libx264 and the existing Sharp dependency. No new npm dependency is needed.

Web versions are 1920×1080 H.264, slow encoding, Rec.709, square pixels and the
original 30fps picture timing. The approved AAC packets are copied, not remixed
or encoded again. Two-second keyframes and front-loaded metadata support seeking.
CRF is 18 except for Murmuration's unusually dense particle field, which uses 24.
No export may exceed 95 MiB. Source masters stay out of `public/`; the reproducible
web derivatives live at `/media/trailers/v4/`.

The set is about 305 MiB. Keeping the files below the individual Git limit and
the built site below the [GitHub Pages size limit](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
allows the existing deployment workflow to publish them without an external
video account. H.264/AAC provides [broad browser support](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs).

## Verify

Build with `npm run build`, run Astro preview bound to `127.0.0.1`, and run
`npm run verify -- <preview-url>`. The gate includes
`scripts/portfolio-trailer-checks.mjs`: ten correct films, no eager video
requests, keyboard/touch playback with sound, native controls and focus, seeking,
replay, captions, credits, downloads/ranges, phone layouts, reduced motion,
network failure/retry and no-JavaScript playback. The gallery checks now open
the screenshot disclosure before exercising the unchanged gallery controls.

The integration's external `web-delivery/proof/` folder retains full media
decode checks, source/export audio packet hashes and visual comparisons.
Audio packet identity proves that the approved soundtrack is preserved; it
does not constitute a listening review.
