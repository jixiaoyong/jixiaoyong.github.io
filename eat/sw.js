// =================================================================================================
// sw.js - Service Worker 离线缓存脚本 (Stale-While-Revalidate with Error Recovery)
// =================================================================================================

const CACHE_NAME = 'what-to-eat-cache-v2.2'; // 升级版本，强制重载缓存

// 静态核心资产列表 (移除了目录根路径 './'，避免本地 http-server 目录列表禁用产生的 403/404 错误)
const STATIC_ASSETS = [
  'index.html',
  'manifest.json',
  'styles/main.css',
  'styles/layout.css',
  'styles/input-panel.css',
  'styles/roulette.css',
  'styles/drawer.css',
  'styles/toasts.css',
  'javascript/app.js',
  'javascript/store.js',
  'javascript/trie.js',
  'javascript/input-panel.js',
  'javascript/drawer.js',
  'javascript/utils.js',
  'javascript/roulette.js',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

/**
 * 安装事件：稳健的单体式缓存加载，防单点故障
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: 开始稳健预缓存...');
      
      // 遍历列表单个添加，即使个别次要资产获取失败，也打印出日志并跳过，不致使整个 Service Worker 注册崩溃
      const cachePromises = STATIC_ASSETS.map((asset) => {
        return cache.add(asset)
          .then(() => {
            console.log(`[SW Cache Success] -> Loaded: ${asset}`);
          })
          .catch((err) => {
            console.error(`[SW Cache Failed] -> Error loading asset: ${asset}`, err);
          });
      });
      
      return Promise.all(cachePromises);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

/**
 * 激活事件：清理过往缓存
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: 正在清理陈旧缓存...', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

/**
 * 拦截提取请求 (Stale-While-Revalidate)
 */
self.addEventListener('fetch', (event) => {
  const isHttp = event.request.url.startsWith('http');
  if (!isHttp) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((err) => {
          console.warn('Service Worker: 离线读取缓存模式', err);
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
