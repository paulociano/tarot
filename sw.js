// ARCANA public static resources only. No private data or third-party requests.
const VERSION='v21-silentium';
const SHELL='arcana-shell-'+VERSION, ART='arcana-art-v1', ORIGINAL='arcana-original-v1';
const scope=new URL(self.registration.scope);
const shellPaths=['index.html','style.css','app.js','universe.js','atelier.js','astrarium.js','astronomy-data.js','ancestral.js','ancestral-data.js','silentium.js','silentium-clock.js','vendor/astronomy.js','deck.js','engine.js','runes.js','storage.js','cinematic.js','soundscape.js','knowledge.js','oracle.js','vault.js','narration.js','voice-script.js','voice-worker.js','grimorio.js','journey.js','art-protection.js','reading-art.js','custom-ritual.js','pwa.js','manifest.webmanifest','assets/optimized/manifest.js','assets/icons/icon-192.png','assets/icons/icon-512.png'];
const shellURLs=new Set(shellPaths.map(p=>new URL(p,scope).href));
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(SHELL);await cache.addAll([...shellURLs].map(url=>new Request(url,{cache:'reload'})))} )()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('arcana-shell-')&&key!==SHELL)await caches.delete(key);await self.clients.claim()})()));
function pathOf(url){return url.pathname.slice(scope.pathname.length)}
async function boundedPut(cache,request,response,limit){try{await cache.put(request,response);const keys=await cache.keys();for(const key of keys.slice(0,Math.max(0,keys.length-limit)))await cache.delete(key)}catch{/* Quota or cache unavailable: current response still works. */}}
async function imageResponse(request,url,optimized){
 const cache=await caches.open(optimized?ART:ORIGINAL);const hit=await cache.match(request);if(hit)return hit;
 try{const res=await fetch(request);if(res.ok&&res.type==='basic'&&res.headers.get('content-type')?.startsWith('image/'))await boundedPut(cache,request,res.clone(),optimized?200:20);return res}catch{
  if(optimized&&/-1050\.webp$/.test(url.pathname)){const fallback=new URL(url);fallback.pathname=fallback.pathname.replace(/-1050\.webp$/,'-420.webp');const hit=await cache.match(fallback.href);if(hit)return hit}
  return Response.error()
 }
}
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(req.mode==='navigate'){event.respondWith((async()=>{const cached=await caches.match(new URL('index.html',scope).href,{cacheName:SHELL});return cached||fetch(req)})());return}
 if(shellURLs.has(url.href)){event.respondWith((async()=>{const cached=await caches.match(req,{cacheName:SHELL});return cached||fetch(req)})());return}
 const path=pathOf(url);
 if(/^assets\/optimized\/(?:scenes\/)?[a-z0-9-]+\.webp$/.test(path)){event.respondWith(imageResponse(req,url,true));return}
 if(/^assets\/(?:cards|scenes|runes|instruments)\/[a-z0-9-]+\.(png|webp|jpe?g)$/.test(path))event.respondWith(imageResponse(req,url,false));
});
