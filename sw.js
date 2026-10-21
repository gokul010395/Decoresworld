const CACHE='decoresworld-mobile-v1';
const SHELL=['./','./index.html','./commerce.js','./enhancements.js','./mobile-app.js','./manifest.webmanifest','./icons/decoresworld-192.svg','./icons/decoresworld-512.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('decoresworld-mobile-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(resp=>{if(resp.ok){let saved=resp.clone();caches.open(CACHE).then(cache=>cache.put(req,saved)).catch(()=>{});}return resp;}).catch(async()=>await caches.match(req)||await caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(resp=>{if(resp.ok){const saved=resp.clone();caches.open(CACHE).then(cache=>cache.put(req,saved)).catch(()=>{});}return resp;})));
});
