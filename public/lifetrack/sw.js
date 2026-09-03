/* LifeTrack service worker: precache the app shell for offline use. */
const VERSION = 'lifetrack-v2';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/styles.css',
  './src/theme-init.js',
  './src/main.js',
  './src/app.js',
  './src/store.js',
  './src/db.js',
  './src/model.js',
  './src/dates.js',
  './src/recurrence.js',
  './src/quickadd.js',
  './src/sample.js',
  './src/focus.js',
  './src/csv.js',
  './src/reminders.js',
  './src/events.js',
  './src/ui/icons.js',
  './src/ui/hooks.js',
  './src/ui/components.js',
  './src/ui/editors.js',
  './src/ui/views/today.js',
  './src/ui/views/tasks.js',
  './src/ui/views/projects.js',
  './src/ui/views/habits.js',
  './src/ui/views/workouts.js',
  './src/ui/views/calendar.js',
  './src/ui/views/people.js',
  './src/ui/views/journal.js',
  './src/ui/views/review.js',
  './src/ui/views/settings.js',
  './vendor/preact-htm.module.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// Network-first for same-origin GETs (so edits show up during development), falling back to cache when offline.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
