// Service Worker for FreeToolHub PWA
// Version 1.0.0

const CACHE_NAME = 'freetoolhub-v1.0.0';
const STATIC_CACHE_NAME = 'freetoolhub-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'freetoolhub-dynamic-v1.0.0';

// Essential files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-384x384.png',
  '/icons/icon-152x152.png',
  '/icons/icon-144x144.png',
  '/icons/icon-128x128.png',
  '/icons/icon-96x96.png',
  '/icons/icon-72x72.png',
  '/icons/icon-32x32.png',
  '/icons/icon-16x16.png',
  '/privacy-policy.html',
  '/terms-of-service.html',
  '/cookie-policy.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })))
          .catch((err) => {
            console.log('[Service Worker] Some assets failed to cache:', err);
            // Continue even if some assets fail
          });
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('freetoolhub-')) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy: Cache First for static assets, Network First for HTML pages
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If offline and request is for a page, return the index.html
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLIENTS_CLAIM') {
    self.clients.claim();
  }
});

// Background sync (if needed in future)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
});

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'FreeToolHub';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: data.tag || 'default',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});


