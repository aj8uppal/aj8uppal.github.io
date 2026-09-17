/**
 * Offline support for the app shell.
 *
 * Network-first for everything same-origin, falling back to the cache when
 * offline. Cache-first would load faster on a revisit, but online play needs
 * both players on the same build: a stale cached module talking a different
 * protocol version is exactly the bug this avoids.
 */

const CACHE = 'hypergrid-v3';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './assets/icon.svg',
  './assets/fonts/orbitron-variable.woff2',
  './assets/fonts/rajdhani-400.woff2',
  './assets/fonts/rajdhani-600.woff2',
  './assets/fonts/rajdhani-700.woff2',
  './src/main.js',
  './src/core/math.js',
  './src/render/gl.js',
  './src/render/glow.js',
  './src/render/post.js',
  './src/render/camera.js',
  './src/render/font.js',
  './src/audio/audio.js',
  './src/audio/music.js',
  './src/input/input.js',
  './src/game/config.js',
  './src/game/game.js',
  './src/game/player.js',
  './src/game/bullets.js',
  './src/game/geoms.js',
  './src/game/enemies.js',
  './src/game/particles.js',
  './src/game/grid.js',
  './src/game/spatial.js',
  './src/game/shapes.js',
  './src/game/director.js',
  './src/game/modes.js',
  './src/game/save.js',
  './src/net/codec.js',
  './src/net/config.js',
  './src/net/protocol.js',
  './src/net/relay.js',
  './src/net/session.js',
  './src/ui/ui.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: req.mode === 'navigate' })
        .then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
