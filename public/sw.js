const STATIC_CACHE = "au-cgpa-static-v2";
const STATIC_ASSETS = [
  "/offline.html",
  "/manifest.webmanifest",
  "/subjects-data.js",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/maskable-icon-512.png",
];

const CACHEABLE_DESTINATIONS = new Set(["style", "script", "worker", "image", "font", "manifest"]);

function isCacheableResponse(response) {
  return Boolean(response) && response.status === 200 && response.type === "basic";
}

function shouldHandleAssetRequest(request, url) {
  if (url.pathname.startsWith("/api/")) {
    return false;
  }

  if (request.headers.has("authorization")) {
    return false;
  }

  if (CACHEABLE_DESTINATIONS.has(request.destination)) {
    return true;
  }

  return STATIC_ASSETS.includes(url.pathname);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== STATIC_CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html") || Response.error()),
    );
    return;
  }

  if (!shouldHandleAssetRequest(event.request, requestUrl)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (isCacheableResponse(networkResponse)) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, responseClone));
          }

          return networkResponse;
        })
        .catch(() => Response.error());
    }),
  );
});
