// Service Worker for Hydraulic Platform Website
// Version 2.0 - Enhanced for Netlify

const CACHE_NAME = 'hydraulic-platform-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/data.js',
  '/manifest.json',
  '/favicon.svg',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap',
  'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvalIhTp2mxdt0UX8gfTkFrWD_6Ni22JhKq3vH.woff2'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('SW: Installing Service Worker v2.0...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Caching static files');
        return cache.addAll(STATIC_FILES.map(url => new Request(url, {
          credentials: 'same-origin'
        })).catch(error => {
          console.warn('SW: Failed to cache some files:', error);
          return cache.addAll(STATIC_FILES.slice(0, 5)); // Cache essential files only
        }));
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
  console.log('SW: Activating Service Worker...');
  
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

// Fetch event - enhanced caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip admin panel and Netlify functions
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/.netlify')) return;

  // Skip external APIs (except fonts and essential CDNs)
  if (url.origin !== location.origin && 
      !url.hostname.includes('googleapis.com') && 
      !url.hostname.includes('gstatic.com') &&
      !url.hostname.includes('unpkg.com')) {
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('SW: Serving from cache:', request.url);
        
        // If it's a static file, also try to update it in background
        if (STATIC_FILES.some(staticFile => request.url.includes(staticFile))) {
          fetch(request).then(response => {
            if (response.status === 200) {
              caches.open(STATIC_CACHE).then(cache => {
                cache.put(request, response.clone());
              });
            }
          }).catch(() => {
            // Network failed, but we have cache
            console.log('SW: Network failed, serving cached version');
          });
        }
        
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
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/').then(response => {
            return response || new Response(
              `<!DOCTYPE html>
              <html lang="ar" dir="rtl">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>غير متصل - سطحة هيدروليك</title>
                <style>
                  body {
                    font-family: 'Cairo', sans-serif;
                    direction: rtl;
                    text-align: center;
                    padding: 50px 20px;
                    background: linear-gradient(135deg, #1e40af, #1e293b);
                    color: white;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                  }
                  .offline-container {
                    max-width: 400px;
                    background: rgba(255,255,255,0.1);
                    padding: 2rem;
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                  }
                  .icon { font-size: 4rem; margin-bottom: 1rem; }
                  .retry-btn {
                    background: #f59e0b;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-top: 1rem;
                    font-family: inherit;
                  }
                  .retry-btn:hover { background: #d97706; }
                </style>
              </head>
              <body>
                <div class="offline-container">
                  <div class="icon">📱</div>
                  <h1>غير متصل بالإنترنت</h1>
                  <p>يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة</p>
                  <p><strong>للطوارئ:</strong><br>
                  📞 +966501234567<br>
                  💬 واتساب متاح دائماً</p>
                  <button class="retry-btn" onclick="window.location.reload()">
                    إعادة المحاولة
                  </button>
                </div>
              </body>
              </html>`,
              { 
                headers: { 
                  'Content-Type': 'text/html; charset=utf-8',
                  'Cache-Control': 'no-cache'
                } 
              }
            );
          });
        }
        
        // For other requests, return a simple error response
        return new Response('خدمة غير متاحة حالياً', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'contact-sync') {
    event.waitUntil(
      // Handle any offline contact attempts
      handleOfflineContacts()
    );
  }
});

// Handle offline contact attempts
async function handleOfflineContacts() {
  try {
    // Get stored offline actions
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      if (action.type === 'contact') {
        // Try to process the contact action
        console.log('SW: Processing offline contact:', action);
        // Here you could send analytics or queue messages
      }
    }
    
    // Clear processed actions
    await clearOfflineActions();
  } catch (error) {
    console.error('SW: Error handling offline contacts:', error);
  }
}

// Helper functions for offline actions
async function getOfflineActions() {
  // In a real app, this would read from IndexedDB
  return JSON.parse(localStorage.getItem('offlineActions') || '[]');
}

async function clearOfflineActions() {
  localStorage.removeItem('offlineActions');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('SW: Push notification received');
  
  const options = {
    body: 'رسالة جديدة من سطحة هيدروليك',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    dir: 'rtl',
    lang: 'ar',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'فتح الموقع'
      },
      {
        action: 'call',
        title: 'اتصال'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('سطحة هيدروليك', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'call') {
    event.waitUntil(
      clients.openWindow('tel:+966501234567')
    );
  } else {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('SW: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'cleanup-cache') {
      event.waitUntil(cleanupOldCache());
    }
  });
}

async function cleanupOldCache() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();
  
  // Remove old entries (older than 7 days)
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  for (const request of requests) {
    const response = await cache.match(request);
    const dateHeader = response.headers.get('date');
    if (dateHeader && new Date(dateHeader).getTime() < sevenDaysAgo) {
      await cache.delete(request);
    }
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('SW: Error occurred:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('SW: Unhandled promise rejection:', event.reason);
});

console.log('SW: Service Worker script loaded - Version 2.0');