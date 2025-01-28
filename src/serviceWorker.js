// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

const CACHE_NAME = "gorgia-crm-v1"
const DYNAMIC_CACHE_NAME = "gorgia-crm-dynamic-v1"
const SESSION_CHANNEL = "session-channel"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/static/js/main.bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
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
  // Don't cache API calls or auth routes
  return !NEVER_CACHE_URLS.some(u => url.includes(u))
}

// Custom response handler for auth routes
const handleAuthResponse = async response => {
  // Check if the response indicates auth issues
  if (response.status === 401 || response.status === 419) {
    // Clear all caches to prevent stale auth data
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))

    // Broadcast auth error to all tabs
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel("auth-channel")
      bc.postMessage({ type: "AUTH_ERROR" })
    }

    // Redirect to login
    return Response.redirect("/login")
  }
  return response
}

// Install event - cache static assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
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
      // Claim all clients to ensure the new service worker takes over immediately
      self.clients.claim(),
    ])
  )
})

// Fetch event - network first with cache fallback strategy
self.addEventListener("fetch", event => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  const url = new URL(event.request.url)

  // Handle same-origin requests only
  if (url.origin !== self.location.origin) return

  // Don't cache auth-related URLs
  if (!shouldCache(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then(response => handleAuthResponse(response))
        .catch(() => {
          // If offline and it's an HTML request, return offline page
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/offline.html")
          }
          return new Response("Offline")
        })
    )
    return
  }

  // Network first strategy with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response before caching
        const responseToCache = response.clone()

        // Cache successful responses
        if (response.ok) {
          caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache)
          })
        }

        return response
      })
      .catch(async () => {
        // Try to get from cache
        const cachedResponse = await caches.match(event.request)

        if (cachedResponse) {
          return cachedResponse
        }

        // If it's an HTML request, return offline page
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/offline.html")
        }

        // Otherwise, return a basic offline response
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

// Export registration function
export function register(config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

      registerValidSW(swUrl, config)

      // Set up session management
      if ("BroadcastChannel" in window) {
        const sessionChannel = new BroadcastChannel(SESSION_CHANNEL)
        const authChannel = new BroadcastChannel("auth-channel")

        // Generate a unique session ID
        const sessionId = Date.now().toString()
        localStorage.setItem("sessionId", sessionId)

        // Broadcast new session
        sessionChannel.postMessage({
          type: "NEW_SESSION",
          sessionId,
          timestamp: Date.now(),
        })

        // Listen for other sessions
        sessionChannel.onmessage = event => {
          const currentSessionId = localStorage.getItem("sessionId")
          if (
            event.data.type === "NEW_SESSION" &&
            event.data.sessionId !== currentSessionId
          ) {
            // If another session is detected and it's newer, log out this session
            if (event.data.timestamp > parseInt(currentSessionId)) {
              localStorage.clear()
              sessionStorage.clear()
              window.location.href = "/login?reason=multiple_sessions"
            }
          }
        }

        // Handle auth errors
        authChannel.onmessage = event => {
          if (event.data.type === "AUTH_ERROR") {
            localStorage.clear()
            sessionStorage.clear()
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login?reason=auth_error"
            }
          }
        }

        // Clean up on page unload
        window.addEventListener("unload", () => {
          sessionChannel.close()
          authChannel.close()
        })
      }
    })
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      // Check for updates on page load
      registration.update()

      // Set up periodic updates
      setInterval(() => {
        registration.update()
      }, 1000 * 60 * 60) // Check for updates every hour

      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }

        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // New content available
              if (config && config.onUpdate) {
                config.onUpdate(registration)
              }
            } else {
              // Content cached for offline use
              if (config && config.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        }
      }
    })
    .catch(error => {
      console.error("Error during service worker registration:", error)
    })
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister()
      })
      .catch(error => {
        console.error(error.message)
      })
  }
}
