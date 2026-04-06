const CACHE_NAME = 'sudoku-pwa-cache-v14';
const urlsToCache = [
  './sudoku.html',
  './manifest.json'
];

// 安裝階段：將靜態檔案存入快取
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截請求階段：優先回傳快取，沒有快取再透過網路抓取
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // 命中快取
        }
        return fetch(event.request);
      })
  );
});

// 啟動階段：清除舊版本的快取
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});