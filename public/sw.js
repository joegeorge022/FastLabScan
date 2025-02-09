// This is the service worker with the Cache-first network

const CACHE = "lab-scanner-v1";

// Add list of files to cache here.
const precacheResources = [
  '/',
  '/manifest.json',
  '/sounds/beep.mp3',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(precacheResources))
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
}); 