var cacheName = 'hello-pwa';
var filesToCache = [
  'https://lab.robertvanderelst.nl/index.html',
  'https://lab.robertvanderelst.nl/css/style.css',
  'https://lab.robertvanderelst.nl/js/main.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
