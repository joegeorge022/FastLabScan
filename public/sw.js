if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const u=e=>n(e,i),r={module:{uri:i},exports:c,require:u};s[i]=Promise.all(a.map((e=>r[e]||u(e)))).then((e=>(t(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"9027599b9b5bf44bd0c1f1e52e3afaf8"},{url:"/_next/static/bCshHfWu-QXl_y-duPP6N/_buildManifest.js",revision:"dc48040fadea2c5b8de491046e2924f6"},{url:"/_next/static/bCshHfWu-QXl_y-duPP6N/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/118-df6503951e607e2e.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/181-ae2cda053c187c13.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/196-83d7150ce12c00a3.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/430-e87889db39105ecd.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/4bd1b696-4e7aa5e9fb5876ea.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/517-80684b14e6bc41bb.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/app/_not-found/page-2d2f6a5d21af9765.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/app/history/page-bce10ae96cb5cdb4.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/app/layout-712e014ff3fd5ba2.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/app/page-908f22d7438c9ca4.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/framework-6b27c2b7aa38af2d.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/main-app-f2e383e01d3410ff.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/main-d7391db7cf203f63.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/pages/_app-d23763e3e6c904ff.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/pages/_error-9b7125ad1a1e68fa.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-df70cda71feca323.js",revision:"bCshHfWu-QXl_y-duPP6N"},{url:"/_next/static/css/c5db3622ceac6406.css",revision:"c5db3622ceac6406"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/icon-192x192.png",revision:"6d13bb1eb7a39f1388af2bdfc3626897"},{url:"/icon-512x512.png",revision:"b9aa8845886a0d4abc8b9f7dc198d0a1"},{url:"/manifest.json",revision:"54fef5841809fca006ece2a32d498799"},{url:"/sounds/beep.mp3",revision:"e43e76d7d97456ff8a8ecac5f30a5d28"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));

const CACHE_NAME = 'fastlabscan-v1';

const PRECACHE_ASSETS = [
  '/',
  '/history',
  '/manifest.json',
  '/sounds/beep.mp3',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/_next/static/css/app.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell and assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});


self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              if (event.request.url.includes('/history')) {
                return caches.match('/history');
              }
              
              return caches.match('/');
            });
        })
    );
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            
            if (event.request.url.includes('/_next/data/')) {
              return new Response(JSON.stringify({
                pageProps: {},
                __N_SSG: true
              }), {
                status: 200,
                headers: new Headers({
                  'Content-Type': 'application/json'
                })
              });
            }
            
            return new Response('Offline content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});