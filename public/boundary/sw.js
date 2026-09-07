/* Boundary offline cache. Generated during the production build. */
const PREFIX = 'boundary:' + self.registration.scope + ':';
const CACHE = PREFIX + '91605c9c5230';
const ASSETS = ["index.html","favicon.svg","manifest.webmanifest","THIRD_PARTY_LICENSES.txt","icon-192.png","icon-512.png","apple-touch-icon.png","assets/index-DcR2uzOo.js","assets/scene-CjlBLdxs.js","assets/three-DaB0coTg.js","assets/barlow-condensed-latin-500-normal-BgYH2mbd.woff2","assets/barlow-condensed-latin-600-normal-DepVgxBB.woff2","assets/dm-sans-latin-400-normal-CW0RaeGs.woff2","assets/dm-sans-latin-500-normal-B9HHJjqV.woff2","assets/dm-sans-latin-600-normal-Aqo67rzb.woff2","assets/dm-sans-latin-700-normal-DvUfVpUG.woff2","assets/index-seqeFhgw.css"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(path => new URL(path, self.registration.scope).href))));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (new URL(request.url).pathname.startsWith('/api/')) return;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.open(CACHE).then(cache => cache.match(new URL('index.html', self.registration.scope).href))));
    return;
  }
  // Static files are identical for all request headers. Ignoring Vary also
  // supports hosts that add Vary: Origin to module and font responses.
  event.respondWith(caches.open(CACHE).then(cache => cache.match(request, { ignoreVary: true })).then(cached => cached || fetch(request)));
});
