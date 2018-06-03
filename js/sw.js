var contentCache = [
  '/',
  '../index.html',
  '../restaurant.html',
  './main.js',
  './restaurant_info.js',
  './dbhelper.js',
  '../favicon.ico',
  '../favicon-16x16.png',
  '../css/styles.css',
  '../css/normalize.css',
  '../data/restaurants.json'
];
var imagesCacheName = 'content-images';

self.addEventListener('install', event => {

  event.waitUntil(
    caches.open('restaurants').then(cache => {
      return cache.addAll(contentCache);
    })
  );
});
// response with cached elements
self.addEventListener('fetch', event => {
  let requestUrl = new URL(event.request.url);
  // if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/img')) {
      event.respondWith(serveImage(event.request));
    }
  // }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

const serveImage = request => {
  let storageUrl = request.url.replace(/\.jpg$/, '');

  return caches.open(imagesCacheName).then(cache => {
    return cache.match(storageUrl).then(response => {
      if (response) return response;

      return fetch(request).then(networkResponse => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
};