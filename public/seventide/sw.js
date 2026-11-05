/* Seventide service worker. Hand-written, dependency-free.
 *
 * Versioning: the page registers this file as /sw.js?b=<entry-chunk-hash> (see src/pwa/register.ts), so every
 * Vite build is a distinct worker URL and the cache name changes with it. No build step touches this file.
 * Policy:
 *   - install: precache the shell (index.html, its hashed /assets/* URLs, plus the CSS/JS they reference).
 *     It does not call skipWaiting; the page asks for activation with {type:'SKIP_WAITING'}.
 *   - /assets/*, icons, manifest: cache-first (hashed, immutable).
 *   - navigations: network-first (4 s budget) with the cached shell as fallback, so offline start works.
 *   - /api/* (including the SSE stream), /__telemetry, non-GET and Range requests: never touched.
 */
const BUILD = new URL(self.location.href).searchParams.get('b') || 'dev';
// Where the game lives: '/' on its own domain, '/seventide/' when it is a folder of a bigger site. Every path below is
// under it, and the worker's scope is this folder only, so it never touches the rest of the site.
const BASE = new URL('./', self.location.href).pathname;
const PREFIX = 'seventide-globe-';
const CACHE = `${PREFIX}${BUILD}`;
const NAV_TIMEOUT_MS = 4000;
const STATIC_EXTRAS = ['manifest.webmanifest', 'icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon-180.png', 'icons/favicon-32.png', ...['wood', 'clay', 'grain', 'wool', 'stone', 'card'].flatMap((n) => ['2x', '3x', '128'].map((t) => `art/resources/${n}-${t}.png`))].map((p) => BASE + p);

function isCacheable(url) {
  if (url.origin !== self.location.origin) return false;
  const p = url.pathname;
  if (!p.startsWith(BASE)) return false;
  if (p.startsWith('/api/') || p === '/api' || p.startsWith('/__')) return false;
  return true;
}

/** Same-origin URLs referenced from a document, stylesheet or script. */
function referencedUrls(text, base) {
  const found = new Set();
  const add = (ref) => {
    try {
      const u = new URL(ref, base);
      if (u.origin === self.location.origin && u.pathname.startsWith(BASE + 'assets/')) found.add(u.pathname);
    } catch {
      /* not a URL */
    }
  };
  for (const m of text.matchAll(/(?:href|src)=["']([^"']+)["']/g)) add(m[1]);
  for (const m of text.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) add(m[1]);
  for (const m of text.matchAll(/["'`](\.\/[\w.\-]+\.(?:js|css|woff2?|png|jpe?g|webp|svg|mp3|ogg|wav|glb|json))["'`]/g)) add(m[1]);
  for (const m of text.matchAll(/["'`](assets\/[\w.\-]+\.(?:js|css|woff2?|png|jpe?g|webp|svg|mp3|ogg|wav|glb|json))["'`]/g)) add(BASE + m[1]);
  return found;
}

async function precache() {
  const cache = await caches.open(CACHE);
  const shell = await fetch(BASE, { cache: 'reload' });
  if (!shell.ok) throw new Error(`shell fetch failed: ${shell.status}`);
  const html = await shell.clone().text();
  await cache.put(BASE, shell);

  const queue = [...referencedUrls(html, self.location.origin + BASE)];
  const seen = new Set(queue);
  const required = new Set(queue); // everything index.html names directly must succeed
  while (queue.length) {
    const path = queue.shift();
    let res;
    try {
      res = await fetch(path, { cache: 'reload' });
      if (!res.ok) throw new Error(String(res.status));
    } catch (err) {
      if (required.has(path)) throw err;
      continue; // a speculative reference that does not exist; harmless
    }
    await cache.put(path, res.clone());
    if (/\.(?:js|css)$/.test(path)) {
      const text = await res.text();
      for (const next of referencedUrls(text, self.location.origin + path)) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
  }
  await Promise.allSettled(STATIC_EXTRAS.map((u) => cache.add(u)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok && res.type === 'basic') cache.put(request, res.clone()).catch(() => {});
  return res;
}

async function navigate(request) {
  const cache = await caches.open(CACHE);
  try {
    const res = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('nav timeout')), NAV_TIMEOUT_MS)),
    ]);
    const p = new URL(request.url).pathname;
    if (res.ok && (p === BASE || p === BASE + 'index.html')) cache.put(BASE, res.clone()).catch(() => {});
    return res;
  } catch {
    const shell = await cache.match(BASE);
    if (shell) return shell;
    return fetch(request);
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (!isCacheable(url)) return;
  if (request.mode === 'navigate') {
    event.respondWith(navigate(request));
    return;
  }
  const p = url.pathname;
  const rel = p.slice(BASE.length);
  if (rel.startsWith('assets/') || rel.startsWith('icons/') || rel.startsWith('art/') || rel === 'icon.svg' || rel === 'manifest.webmanifest') {
    event.respondWith(cacheFirst(request));
  }
});
