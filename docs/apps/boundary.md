# Boundary

[Play Boundary](/boundary/) — a fullscreen 3D cricket batting and running game.

This portfolio mount is the preserved static Boundary 3.1.0 release, extracted byte-for-byte from `../data/portfolio-builds/2026-09-05/boundary-production.zip`. The archive SHA-256 is:

`c0ed2462055ddf750139e1216379c68f8f1412f0f689d66bf239a6b20b62e523`

The release has no backend or account requirement. It uses the real-time ball, bat, fielders, two running batters, crease decisions, guided first run, club tour, daily challenge, quick chase, free nets, local progress, and offline service-worker cache included in that archive. `THIRD_PARTY_LICENSES.txt` is retained at `/boundary/THIRD_PARTY_LICENSES.txt`.

Verification for this exact extracted artifact:

- Six production browser checks passed on an isolated server at `http://127.0.0.1:5315/`: real-clock six-ball innings, guided phone touch flow, offline reload, WebGL recovery, and real-clock sixes using Space and touch.
- The mounted `/boundary/` path served every requested JavaScript, CSS, font, icon, manifest, and service-worker asset with HTTP 200 on the local public server.
- Offline reload succeeded after cache installation; the service-worker scope was `/boundary/` and the playable canvas remained visible.
- A fresh 1920×1200 gameplay frame was captured from the exact staged archive after contact, while the coach read “Now call Run.”
