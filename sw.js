// SW v1 — HTML-safe caching (never cache HTML)
const STATIC = 'html6wk-static-v1';
const ASSETS = [
  './manifest.json'
  // (icons or extra assets can be added here)
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(STATIC).then(c=>c.addAll(ASSETS)).catch(()=>null));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k===STATIC?null:caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const req = e.request;
  const url = new URL(req.url);
  // Never cache HTML/navigate
  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.html');
  if (isHTML){ return; }
  // Try cache, then network
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res=>{
      if (res.ok && ['style','script','image','font'].includes(req.destination)) {
        const copy = res.clone(); caches.open(STATIC).then(c=>c.put(req, copy));
      }
      return res;
    }))
  );
});
