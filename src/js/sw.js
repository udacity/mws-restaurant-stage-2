var contentCache = [
  '/',
  '../index.html',
  '../restaurant.html',
  './main.js',
  './restaurant_info.js',
  './common.js',
  './dbhelper.js',
  '../favicon.ico',
  '../favicon-16x16.png',
  '../css/styles.css',
  '../css/normalize.css',
  './all.min.js',
  '../css/all.min.css'
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
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(contentCache);
    })
    .catch(error => {
      console.error(`Opening cache failed: ${error}`);
    })
  );
});

// Filtering for the appropriate caches,
// checking whether they're already extant
self.addEventListener('activate', event => {
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
});

// response with cached elements. Image 
// and database requests are intercepted and handled differently.
self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/img/')) {
      event.respondWith(serveImage(event.request));
      return;
    } else if (requestUrl.port === '1337') {
      console.log('data request!@');
      event.respondWith(serveData(event.request));
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

  return caches.open(imagesCacheName).then(cache => {
    return cache.match(storageUrl).then(response => {
      let networkFetch = fetch(request).then(networkResponse => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
      return response || networkFetch;
    });
  });
};

// Use IndexedDb to respond to certain Ajax requests.
// If the Ajax data is stored, return it
// from IndexedDb.
// If not, request the data from the
// network, then store in the database.
const serveData = request => {
  let idb = indexedDB.open(DBHelper.REST_DB, DBHelper.DATABASE_VERSION);

  idb.onerror = error => {
    console.error(`ERROR (${error}) when trying to open database.`);
  };

  idb.onupgradeneeded = () => {
    let db = idb.result;
    let store = db.createObjectStore(DBHelper.REST_STORE, {
      keyPath: 'id'
    });
    let index = store.createIndex('byId', 'id');
  };

  idb.onsuccess = () => {
    let db = idb.result;
    let tx = db.transaction(DBHelper.REST_STORE, 'readwrite');
    let store = tx.objectStore(DBHelper.REST_STORE);
    let index = store.index('byId');

    // return all data
    let data = store.getAll();
    data.onsuccess = () => {
      console.log('fetched all')
      return data.result;
    };

    // fetch data and place into store
    return fetch(request).then(restaurants => {
      restaurants.forEach(restaurant => {
        store.put(restaurant);
      });
    });
  }
}
