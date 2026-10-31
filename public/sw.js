// Service worker MiniMuscu : l'app et la forêt 3D fonctionnent hors ligne.
// Changer CACHE_VERSION invalide tous les caches au prochain déploiement.
const CACHE_VERSION = "v1";
const APP_SHELL_CACHE = `mini-muscu-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `mini-muscu-assets-${CACHE_VERSION}`;
const RUNTIME_CACHE = `mini-muscu-runtime-${CACHE_VERSION}`;
const CACHE_NAME_LIST = [APP_SHELL_CACHE, ASSET_CACHE, RUNTIME_CACHE];
const MAX_ASSET_ENTRY_COUNT = 80;
const MAX_RUNTIME_ENTRY_COUNT = 60;

const BASE_PATH = new URL(self.registration.scope).pathname;
const APP_SHELL_URL = BASE_PATH;
// Si un de ces fichiers change de nom, mettre la liste à jour : un seul
// fichier manquant fait échouer l'installation du service worker.
const PRECACHE_URL_LIST = [
  APP_SHELL_URL,
  `${BASE_PATH}site-v2.webmanifest`,
  `${BASE_PATH}favicon-96x96-v2.png`,
  `${BASE_PATH}apple-touch-icon-v2.png`,
  `${BASE_PATH}web-app-manifest-192x192-v2.png`,
  `${BASE_PATH}web-app-manifest-512x512-v2.png`,
];
const FONT_HOST_LIST = ["fonts.googleapis.com", "fonts.gstatic.com"];

const isCacheableResponse = (response) =>
  response.ok || response.type === "opaque";

// Les fichiers hachés de Vite s'accumulent à chaque déploiement : on garde
// seulement les plus récents.
const trimCache = async (cacheName, maxEntryCount) => {
  const cache = await caches.open(cacheName);
  const requestList = await cache.keys();

  await Promise.all(
    requestList
      .slice(0, Math.max(0, requestList.length - maxEntryCount))
      .map((request) => cache.delete(request)),
  );
};

const putInCache = async (cacheName, request, response, maxEntryCount) => {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);

  if (maxEntryCount) {
    await trimCache(cacheName, maxEntryCount);
  }
};

const handleNavigation = async (event) => {
  try {
    const response = await fetch(event.request);

    if (response.ok) {
      event.waitUntil(
        putInCache(APP_SHELL_CACHE, APP_SHELL_URL, response.clone()),
      );
    }

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(APP_SHELL_URL);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
};

const handleCacheFirst = async (event, cacheName, maxEntryCount) => {
  const cachedResponse = await caches.match(event.request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(event.request);

  if (isCacheableResponse(response)) {
    event.waitUntil(
      putInCache(cacheName, event.request, response.clone(), maxEntryCount),
    );
  }

  return response;
};

const handleStaleWhileRevalidate = async (event) => {
  const cachedResponse = await caches.match(event.request);
  const networkResponsePromise = fetch(event.request).then((response) => {
    if (isCacheableResponse(response)) {
      event.waitUntil(
        putInCache(
          RUNTIME_CACHE,
          event.request,
          response.clone(),
          MAX_RUNTIME_ENTRY_COUNT,
        ),
      );
    }

    return response;
  });

  if (cachedResponse) {
    event.waitUntil(networkResponsePromise.catch(() => undefined));
    return cachedResponse;
  }

  return networkResponsePromise;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URL_LIST))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNameList) =>
        Promise.all(
          cacheNameList
            .filter(
              (cacheName) =>
                cacheName.startsWith("mini-muscu-") &&
                !CACHE_NAME_LIST.includes(cacheName),
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === "navigate" && url.pathname.startsWith(BASE_PATH)) {
    event.respondWith(handleNavigation(event));
    return;
  }

  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith(`${BASE_PATH}assets/`)) {
      event.respondWith(
        handleCacheFirst(event, ASSET_CACHE, MAX_ASSET_ENTRY_COUNT),
      );
      return;
    }

    if (
      url.pathname.startsWith(`${BASE_PATH}exercises/`) ||
      PRECACHE_URL_LIST.includes(url.pathname)
    ) {
      event.respondWith(handleStaleWhileRevalidate(event));
    }

    return;
  }

  if (FONT_HOST_LIST.includes(url.hostname)) {
    event.respondWith(handleStaleWhileRevalidate(event));
  }
});
