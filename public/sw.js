// E-MEP High-Performance Service Worker for Instant Caching & Offline Speed
const CACHE_NAME = 'emep-v3-static';
const DATA_CACHE_NAME = 'emep-v3-data';

const STATIC_ASSETS = [
  '/logo/logo.png',
  '/icon.png',
];

// Install Event: Pre-cache core shell static assets safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(asset).catch(() => null))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== DATA_CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First for Images/CDN & Stale-While-Revalidate for APIs
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Supabase CDN Images & Local Image Assets: Cache-First Strategy
  if (
    url.hostname.includes('supabase.co') ||
    request.destination === 'image' ||
    url.pathname.includes('/assets/') ||
    url.pathname.includes('/Brand logos/')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return cachedResponse;
        }
      })
    );
    return;
  }

  // 2. API Projects Route: Stale-While-Revalidate Strategy
  if (url.pathname.startsWith('/api/projects')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Other Requests: Network-First with Cache Fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
