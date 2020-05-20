importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("https://pepper-proxy"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "api-cache",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200, 404],
      }),
    ],
  })
);
