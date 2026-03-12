// Top 10 Prom — Service Worker
// Cache strategy:
//   - Static assets: Cache First (long-lived)
//   - Pages: Stale While Revalidate
//   - API routes: Network First with 5s timeout

const CACHE_NAME = 'top10prom-v1'
const STATIC_CACHE = 'top10prom-static-v1'

const STATIC_ASSETS = [
  '/',
  '/catalog',
  '/fitting-room',
  '/book',
  '/offline',
]

// Install: pre-cache critical pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(() => {})
    )
  )
  self.skipWaiting()
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, cross-origin (except Supabase storage), and extension requests
  if (request.method !== 'GET') return
  if (url.protocol === 'chrome-extension:') return

  // API routes — Network First with 5s timeout
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithTimeout(request, 5000))
    return
  }

  // _next/static — Cache First (immutable hashed assets)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Images (including Supabase storage) — Cache First with 7-day TTL
  if (
    request.destination === 'image' ||
    url.hostname.endsWith('.supabase.co')
  ) {
    event.respondWith(cacheFirst(request, CACHE_NAME))
    return
  }

  // HTML pages — Stale While Revalidate
  if (request.destination === 'document') {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Default — network with cache fallback
  event.respondWith(networkWithCacheFallback(request))
})

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) {
    const cache = await caches.open(cacheName)
    cache.put(request, response.clone())
  }
  return response
}

async function networkFirstWithTimeout(request, timeoutMs) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(request, { signal: controller.signal })
    clearTimeout(timeout)
    return response
  } catch {
    clearTimeout(timeout)
    const cached = await caches.match(request)
    if (cached) return cached
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  const networkFetch = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone())
    return response
  }).catch(() => null)

  return cached ?? (await networkFetch) ?? offlinePage()
}

async function networkWithCacheFallback(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    return cached ?? offlinePage()
  }
}

function offlinePage() {
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Offline — Top 10 Prom</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>body{margin:0;background:#050505;color:#F5F5F5;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100dvh;text-align:center;padding:1rem}h1{color:#D4AF37;font-size:1.5rem}p{color:#C0C0C0;font-size:.875rem}</style>
    </head><body><div><h1>You&rsquo;re offline</h1><p>Check your connection and try again.</p></div></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  )
}
