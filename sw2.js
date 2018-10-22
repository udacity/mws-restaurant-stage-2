var staticCacheName = 'mws-restaurant-stage-v1';
var CACHED_URL = [
	'/',
	'/restaurant.html',
	'js/main.js',
	'js/restaurant_info.js',
	'js/dbhelper.js',
	'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
	'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
	'css/styles.css',
	'data/restaurants.json',
	'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png',
	'img/1.jpg',
	'img/2.jpg',
	'img/3.jpg',
	'img/4.jpg',
	'img/5.jpg',
	'img/6.jpg',
	'img/7.jpg',
	'img/8.jpg',
	'img/9.jpg',
	'img/10.jpg'
];

self.addEventListener('install', function(event){
	console.log("installed sw")
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache){
			console.log("cached page");
			return cache.addAll(CACHED_URL);
		})
	)
});

self.addEventListener('activate', function(event){
	console.log("activated")
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName){
					if(cacheName !== staticCacheName){
						console.log("removing old cache", cacheName);
						return caches.delete(cacheName);
					}
				})
			)
		})
	)
})

self.addEventListener('fetch', function(event){
	// event.respondWith(
	// 	fetch(event.request).then(function(response){
	// 		console.log("in condition", response.status);
	// 		if(response.status === 404){
	// 			return fetch('/img/1.jpg');
	// 		}
	// 		return response;
	// 	}).catch(function(){
	// 		return new Response("Uh oh, that failed");
	// 	})
	// );
	event.respondWith(
		caches.match(event.request).then(function(response){
			if (response){
				console.log('found request in cache', response)
				return response;
			}else if(event.request.url.includes("restaurant.html")){
				console.log('matches generic restaurant')
				return caches.match('/restaurant.html');
			}
			console.log('fetch original', event.request);
			return fetch(event.request);
		})
	)
});