// Cache names
const CACHE_NAME = "gorgia-crm-v1"
const DYNAMIC_CACHE_NAME = "gorgia-crm-dynamic-v1"

// Assets to cache immediately - only include essential files
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html' // Make sure this exists in your public folder
]

// URLs that should never be cached
const NEVER_CACHE_URLS = [
  "/api/",
  "/sanctum/",
  "/login",
  "/logout",
  "/register",
]

// Check if a request should be cached
const shouldCache = url => {
  return !NEVER_CACHE_URLS.some(u => url.includes(u))
}

// Custom response handler for auth routes
const handleAuthResponse = async response => {
  if (response.status === 401 || response.status === 419) {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))

    if ("BroadcastChannel" in self) {
      const bc = new BroadcastChannel("auth-channel")
      bc.postMessage({ type: "AUTH_ERROR" })
    }

    return Response.redirect("/login")
  }
  return response
}

// Install event - cache static assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        // Cache each asset individually to handle failures gracefully
        return Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}:`, error)
            })
          )
        )
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(
              cacheName =>
                cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME
            )
            .map(cacheName => caches.delete(cacheName))
        )
      }),
      self.clients.claim(),
    ])
  )
})

// Fetch event - network first with cache fallback strategy
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return

  const url = new URL(event.request.url)

  if (url.origin !== self.location.origin) return

  if (!shouldCache(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then(response => handleAuthResponse(response))
        .catch(() => {
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/offline.html")
              .catch(() => new Response("Offline"))
          }
          return new Response("Offline")
        })
    )
    return
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseToCache = response.clone()

        if (response.ok) {
          caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache)
          })
        }

        return response
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request)

        if (cachedResponse) {
          return cachedResponse
        }

        if (event.request.headers.get("accept")?.includes("text/html")) {
          return caches.match("/offline.html")
            .catch(() => new Response("Offline"))
        }

        return new Response("Offline")
      })
  )
})

// Handle messages from clients
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
}) 