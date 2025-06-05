// Service Worker for Hydraulic Platform Website
// Version 1.0 - Offline Support & Performance

const CACHE_NAME = 'hydraulic-platform-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap',
  'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvalIhTp2mxdt0UX8gfTkFrWD_6Ni22JhKq3vH.woff2'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Caching static files');
        return cache.addAll(STATIC_FILES.map(url => new Request(url, {
          credentials: 'same-origin'
        })));
      }),
      caches.open(DYNAMIC_CACHE)
    ]).then(() => {
      console.log('SW: Installation complete');
      return self.skipWaiting();
    }).catch(error => {
      console.error('SW: Installation failed', error);
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip admin panel
  if (url.pathname.startsWith('/admin')) return;

  // Skip external APIs (except fonts)
  if (url.origin !== location.origin && !url.hostname.includes('googleapis.com') && !url.hostname.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('SW: Serving from cache:', request.url);
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request).then(networkResponse => {
        // Check if valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone response for caching
        const responseToCache = networkResponse.clone();

        // Decide which cache to use
        const cacheToUse = STATIC_FILES.some(staticFile => 
          request.url.includes(staticFile.replace('/', ''))
        ) ? STATIC_CACHE : DYNAMIC_CACHE;

        caches.open(cacheToUse).then(cache => {
          console.log('SW: Caching new resource:', request.url);
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Network failed, try to serve offline page for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
          return caches.match('/').then(response => {
            return response || new Response(
              '<html><body style="font-family: Cairo, sans-serif; direction: rtl; text-align: center; padding: 50px; background: linear-gradient(135deg, #1e293b, #1e40af);"><h1 style="color: white;">غير متصل بالإنترنت</h1><p style="color: #ccc;">يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة</p></body></html>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            );
          });
        }
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync triggered');
  
  if (event.tag === 'contact-sync') {
    event.waitUntil(
      // Handle any offline contact attempts
      console.log('SW: Syncing contact data')
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('SW: Push notification received');
  
  const options = {
    body: 'رسالة جديدة من سطحة هيدروليك',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    dir: 'rtl',
    lang: 'ar'
  };

  event.waitUntil(
    self.registration.showNotification('سطحة هيدروليك', options)
  );
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('SW: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('SW: Error occurred:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('SW: Unhandled promise rejection:', event.reason);
});

console.log('SW: Service Worker script loaded');