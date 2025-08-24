// sw.js
const CACHE_NAME = "html-mastery-v1";
const PRECACHE = [
  "/HTMLMastery/",
  "/HTMLMastery/index.html",
  "/HTMLMastery/manifest.json",
  "/HTMLMastery/icons/icon-192.png",
  "/HTMLMastery/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Having a fetch handler is required for installability
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(
          () =>
            new Response("You are offline.", {
              headers: { "Content-Type": "text/plain" }
            })
        )
      );
    })
  );
});
