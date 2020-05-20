importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

workbox.routing.registerNavigationRoute("/index.html", {
  blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
});

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg)$/,
  new workbox.strategies.cacheFirst({
    cacheName: "static-images",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// non precache
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "static-resources",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);
