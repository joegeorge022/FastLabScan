const CACHE_NAME = 'lab-scanner-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/index.html',
  '/_next/static/', // Next.js static files
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch new
        return response || fetch(event.request);
      })
  );
}); 