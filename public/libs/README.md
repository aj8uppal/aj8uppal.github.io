# Vendored libraries

Third-party code listed below is committed here rather than loaded from a CDN.
Several demos on this site broke because the CDNs they pointed at rotted: the host stopped
resolving, or the URL was plain HTTP and GitHub Pages serves the site over HTTPS, so the
browser blocked it as mixed content.
Repository-relative dependencies avoid both failure modes.

These files are served: this directory sits under `public/`, so `three/three.r70.min.js` is
reachable at `/libs/three/three.r70.min.js`, which is the path the demos reference.

Keep these files pristine - do not edit vendored source in place.
To upgrade, replace the file wholesale and update its row below.

| Path | Version | Origin | Notes |
| --- | --- | --- | --- |
| `chartjs/Chart.1.0.2.js` | 1.0.2 | `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.js` | [MIT](chartjs/LICENSE), by Nick Downie. SHA-256 `73bc4c1c86acf2d58cefba2a64d68798ddb3ec9cfdd6e342fb0f02601743b6a8`. Unmodified, including its own banner, which reads `Version: 1.0.1` even though the release is 1.0.2; the path is what pins it. Pinned because deviation.html uses the `new Chart(ctx).Bar(data)` constructor that 2.x dropped. |
| `three/three.r70.min.js` | r70 | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r70/three.min.js` | [MIT](three/LICENSE). SHA-256 `6debaa9e3149db9f8dab77ec13c43a98b266755de9472d9c4bc6656a41f6294d`. Pinned because GrinchJump uses the pre-r71 API. |
| `threex/THREEx.KeyboardState.js` | unversioned | `http://learningthreejs.com/data/THREEx/THREEx.KeyboardState.js` | [MIT](threex/LICENSE), by Jerome Etienne. Moved from the former root-level `keyboard.js`; SHA-256 `a58271b809c79240ceee6898b8ff5cf4fa1cb9ab81679e6cb61ac3d2aba9d0ba`. The origin is offline; this copy matches its [2013-09-09 Internet Archive snapshot](https://web.archive.org/web/20130909212811id_/http://learningthreejs.com/data/THREEx/THREEx.KeyboardState.js) apart from comment whitespace. |
| `font-awesome/` | 4.6.3 | `https://github.com/FortAwesome/Font-Awesome/tree/v4.6.3` | SIL OFL 1.1 (fonts) / MIT (code). |
