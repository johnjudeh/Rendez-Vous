'use strict';

var staticCacheName = 'rendezvous-static-v1';
var cacheWhiteList = [staticCacheName];

// Event fires when service worker is first discovered
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(staticCacheName).then(function (cache) {
    return cache.addAll(['/', '/maps', '/register', '/login', '/js/maps-2da2ef9aa5.js', '/js/register-046844ae79.js', '/js/sw/index.js', '/css/app-53784cb522.css', '/css/landing-6c9013db50.css', '/avatars/male-b0728b3f24.png', '/avatars/female-2a59da33c7.png', '/avatars/ninja-6879220b2d.png', '/imgs/landing-c995ae9de9.jpg', 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css', 'https://fonts.googleapis.com/css?family=Oleo+Script+Swash+Caps|Roboto:400,400i,500,700,700i', 'https://code.jquery.com/jquery-3.2.1.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.js']);
  }));
});

// Event fires when new sw is intalled and ready to take over page
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return cacheNames.filter(function (cacheName) {
      return !cacheWhiteList.includes(cacheName);
    }).map(function (cacheName) {
      console.log('Deleting:', cacheName);
      return caches.delete(cacheName);
    });
  }));
});

// Handles how a page makes fetch requests
self.addEventListener('fetch', function (event) {
  event.respondWith(caches.open(staticCacheName).then(function (cache) {

    // Searchs for respone in cache
    return cache.match(event.request).then(function (response) {

      // Ensures that no-cache resources are checked with server
      if (response && response.headers.has('cache-control')) {
        if (response.headers.get('cache-control') === 'no-cache') {
          return fetch(event.request).then(function (networkResponse) {

            // Updates cache with fresh response
            cache.put(event.request, networkResponse.clone());
            return networkResponse;

            // In case of errors in Fetch
          }).catch(function () {
            return response;
          });
        }
      }
      // Do not need updating as they are static
      return response || fetch(event.request);
    });
  }));
});

// Awaits message to update service worker
self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});