
const CACHE_NAME = 'bible-tracker-cache-v2';
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.png',
    '/index.tsx',
    '/App.tsx',
    '/constants.ts',
    '/types.ts',
    '/components/StatCard.tsx',
    '/components/icons/BookOpenIcon.tsx',
    '/components/icons/CalendarIcon.tsx',
    '/components/icons/TargetIcon.tsx',
    'https://cdn.tailwindcss.com',
    // The following URLs are based on the import map in index.html
    'https://aistudiocdn.com/react@^19.2.0',
    'https://aistudiocdn.com/react-dom@^19.2.0/client',
];

// On install, precache the assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_ASSETS))
            .then(self.skipWaiting())
    );
});

// On activate, clean up old caches
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

// Use a stale-while-revalidate strategy for fetching
self.addEventListener('fetch', event => {
    // Ignore non-GET requests
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                // Fetch from network in the background to update the cache
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    // Check if we received a valid response
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(err => {
                    // Network request failed, but that's okay if we have a cached response.
                    // If we don't, the user is offline and the resource is not cached.
                    console.warn(`Fetch failed for: ${event.request.url}`, err);
                });

                // Return the cached response immediately if it exists, otherwise wait for the network response.
                // This ensures the app works offline if everything is precached.
                return response || fetchPromise;
            });
        })
    );
});
