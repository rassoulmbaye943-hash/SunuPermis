/* SunuPermis — service worker : cache des pages et ressources statiques. */
'use strict';

const CACHE_NAME = 'sunupermis-v13';
const CORE_ASSETS = [
  '/', 'index.html', 'permis.html', 'code-route.html', 'priorites.html',
  'conduire.html', 'manoeuvres.html', 'videotheque.html', 'quiz.html',
  'examen.html', 'progression.html', 'glossaire.html', 'conseils-examen.html',
  'carte-senegal.html', 'profil.html', 'admin.html', 'offres.html',
  'css/style.css', 'js/main.js', 'js/layout.js', 'js/i18n.js', 'js/data.js',
  'js/signs.js', 'js/quiz.js', 'js/exam.js', 'js/progress.js', 'js/api.js',
  'assets/icon-192.svg', 'assets/icon-512.svg', 'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkResponse = fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
      return cachedResponse || networkResponse;
    }).catch(() => caches.match('index.html'))
  );
});
