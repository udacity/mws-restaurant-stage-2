var staticCacheName = 'restaurant-info';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        //cache all static files
        '/',
        'restaurant.html',
        'js/dbhelper.js',
        'js/main.js',
        'js/service_worker.js',
        'manifest.json',
        'favicon.ico',
        'sw.js',
        'img/',
        'js/restaurant_info.js',
        'css/styles.css',
        'http://localhost:1337/restaurants/',
        'https://fonts.googleapis.com/css?family=Ubuntu',
        'https://fonts.googleapis.com/css?family=Fira+Sans',
       // 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={pk.eyJ1IjoibGV0ZSIsImEiOiJjamtmZmdlbmYwNml0M2tvNmRuNjAxb2ZwIn0.hS92_IFDLZxJJAuo6V8G3Q}'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === './restaurant.html') {
      event.respondWith(caches.match('./restaurant.html'));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});