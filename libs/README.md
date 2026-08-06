# Vendored libraries

Third-party code is committed here rather than loaded from a CDN.
Several demos on this site broke because the CDNs they pointed at rotted: the host stopped
resolving, or the URL was plain HTTP and GitHub Pages serves the site over HTTPS, so the
browser blocked it as mixed content.
A file in the repo cannot 404 and cannot be mixed content.

Keep these files pristine - do not edit vendored source in place.
To upgrade, replace the file wholesale and update its row below.

| Path | Version | Origin | Notes |
| --- | --- | --- | --- |
| `three/three.r70.min.js` | r70 | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r70/three.min.js` | MIT. sha256 `6debaa9e3149db9f8dab77ec13c43a98b266755de9472d9c4bc6656a41f6294d`. Pinned to r70 because the demos use the pre-r71 API. |
| `threex/THREEx.KeyboardState.js` | - | `http://learningthreejs.com/data/THREEx/THREEx.KeyboardState.js` | MIT, by Jerome Etienne. Origin domain no longer resolves; recovered copy verified against the Internet Archive snapshot. |
| `font-awesome/` | 4.x | Font Awesome | SIL OFL 1.1 (fonts) / MIT (code). |
