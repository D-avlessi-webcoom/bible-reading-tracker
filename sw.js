

const CACHE_NAME = 'bible-tracker-cache-v3';
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
    '/components/icons/BellIcon.tsx',
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
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(err => {
                    console.warn(`Fetch failed for: ${event.request.url}`, err);
                });
                return response || fetchPromise;
            });
        })
    );
});

// --- Notification Logic ---
let reminderTimeoutId = null;

self.addEventListener('message', (event) => {
    if (event.data.type === 'SET_REMINDER') {
        clearTimeout(reminderTimeoutId);
        const [hours, minutes] = event.data.time.split(':').map(Number);
        
        const scheduleNotification = () => {
            const now = new Date();
            let nextNotification = new Date();
            nextNotification.setHours(hours, minutes, 0, 0);

            if (now > nextNotification) {
                nextNotification.setDate(nextNotification.getDate() + 1);
            }

            const delay = nextNotification.getTime() - now.getTime();
            console.log(`Scheduling notification in ${delay} ms`);

            reminderTimeoutId = setTimeout(() => {
                self.registration.showNotification('Rappel de lecture biblique', {
                    body: 'Il est temps de lire vos chapitres quotidiens !',
                    icon: '/icon.svg',
                    badge: '/icon.svg',
                    vibrate: [200, 100, 200],
                });
                // Reschedule for the next day
                scheduleNotification();
            }, delay);
        };
        scheduleNotification();
    } else if (event.data.type === 'CLEAR_REMINDER') {
        clearTimeout(reminderTimeoutId);
        reminderTimeoutId = null;
    }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
