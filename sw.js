const CACHE_NAME = 'bible-tracker-cache-v1';
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/icon.png',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_ASSETS))
            .then(self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    const currentCaches = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request).then(networkResponse => {
                    // Don't cache opaque responses (e.g. from CDNs without CORS).
                    if (networkResponse.type !== 'opaque' && event.request.url.startsWith('http')) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => {
                    // Optional: return a fallback page if network fails
                });
            });
        })
    );
});
