var contentCache = [
  '/',
  './index.html',
  './restaurant.html',
  'js/main.js',
  'js/restaurant_info.js',
  'js/dbhelper.js',
  'js/common.js',
  './favicon.ico',
  './favicon-16x16.png',
  './manifest.json',
  './icons-192.png',
  './icons-512.png',
  'css/all.min.css',
  './placeholder.png'
];
var staticCacheName = 'stage-2-restaurants';
var imagesCacheName = 'stage-2-content-images';
var allCaches = [
  staticCacheName,
  imagesCacheName
];


// open or create cache for static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(contentCache);
    })
    .then(() => {
      console.log('All static assets have been cached');
      return self.skipWaiting();
    })
  );
});

/**
 * Additional event listeners
 */
self.addEventListener('controllerchange', event => {
  console.log(`A controllerchange event from the service worker: ${event}`);
});

self.addEventListener('statechange', event => {
  console.log(`A statechange event from the service worker: ${event.target.state}`);
});

// Filtering for the appropriate caches,
// checking whether they're already extant
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('stage-2-') &&
            !allCaches.includes(cacheName);
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/**
 * Notify the user when the service worker allows going offline
 */
if (self.state === 'activated') {
  console.log('Service worker is activated, so you can go offline.');
  let status = document.querySelector('.status');
  status.classList.remove('not-visible');
}
// Response with cached elements. Image 
// requests and request for the restaurant pages
// are intercepted and handled differently.
self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);
  // only intercept fetch requests for app,
  // not 3rd party fetch
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.includes('img/')) {
      event.respondWith(serveImage(event.request));
      return;

    } else if (requestUrl.pathname.endsWith('.html')) {
      event.respondWith(DBHelper.fetchRestaurants(null));
      return;
    }
  }


  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Use caching to respond to image requests.
// If the image's pathname is stored, return it
// from cache. Otherwise, request the pathname from the
// network, and store a clone of it in the cache, and 
// proceed with the original request.
const serveImage = request => {
  let storageUrl = request.url.replace(/\.jpg$/, '');
  return caches.match(storageUrl)
    .then(response => {
      if (response) {
        console.log('[no fetch] Retrieving image from service worker cache');
        return response;
      }
      console.log('[fetch] Getting image from the network');
      return (fetch(request));

    });
};
