/**
 * Service Worker for JP N5 App
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'jp-n5-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/reset.css',
  '/assets/css/styles.css',
  '/assets/css/themes.css',
  '/assets/js/app.js',
  '/assets/js/audio.js',
  '/assets/js/quiz.js',
  '/assets/js/router.js',
  '/assets/js/speak.js',
  '/assets/js/store.js',
  '/assets/js/write.js',
  '/assets/js/data/kana.js',
  '/assets/js/data/kanji_n5.js',
  '/assets/js/data/vocab_n5.js',
  '/assets/js/ui/components.js',
  '/assets/js/ui/dialog_page.js',
  '/assets/js/ui/grammar_page.js',
  '/assets/js/ui/kana_dnd_quiz.js',
  '/assets/js/ui/kana_filter.js',
  '/assets/js/ui/kana_flashcards.js',
  '/assets/js/ui/kana_pages_split.js',
  '/assets/js/ui/kana_trainer.js',
  '/assets/js/ui/kanji_page.js',
  '/assets/js/ui/pages.js',
  '/assets/js/ui/speaking_page.js',
  '/assets/js/ui/vocab_page.js',
  '/assets/js/ui/review_page.js',
  '/assets/js/ui/kana_drag_drop.js',
  '/assets/js/ui/speaking_recorder.js'
];

// Install event - cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Only cache http(s) requests
          if (event.request.url.startsWith('http')) {
            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.log('Cache put error:', err);
              });
          }

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// Background sync for progress tracking
self.addEventListener('sync', event => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // In a real app, this would sync progress to a server
  console.log('Syncing progress...');
  return Promise.resolve();
}

// Push notifications (for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Waktu belajar Bahasa Jepang!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('JP N5 Learning', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});