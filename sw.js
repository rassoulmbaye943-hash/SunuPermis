/* SunuPermis — service worker minimal (mise en cache de la coquille de l'application) */
var CACHE = 'sunupermis-v11';
var CORE = [
  'index.html','permis.html','code-route.html','priorites.html','conduire.html',
  'manoeuvres.html','videotheque.html','quiz.html','examen.html','progression.html',
  'glossaire.html','conseils-examen.html','carte-senegal.html','profil.html','admin.html','offres.html',
  'css/style.css','js/main.js','js/layout.js','js/i18n.js','js/data.js','js/signs.js','js/quiz.js',
  'js/exam.js','js/progress.js','assets/icon-192.svg','assets/icon-512.svg','manifest.json'
];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

/* Stratégie : cache d'abord, puis réseau, avec mise à jour silencieuse du cache */
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if(url.origin !== location.origin) return; // laisser passer les polices Google, etc.
  e.respondWith(
    caches.match(e.request).then(function(cached){
      var network = fetch(e.request).then(function(resp){
        if(resp && resp.status === 200){
          var copy = resp.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
        }
        return resp;
      }).catch(function(){ return cached; });
      return cached || network;
    })
  );
});
