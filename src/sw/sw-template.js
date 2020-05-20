if ('function' === typeof importScripts) {
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
    if (workbox) {
        /* injection point for manifest files.  */
        workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
        
        workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL('/index.html'), {
            blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
        })
        
        workbox.routing.registerRoute(
            /\.(?:png|gif|jpg|jpeg)$/,
            new workbox.strategies.cacheFirst({
                cacheName: 'images',
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: 60,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                    }),
                ],
            })
        );

    } else {
        console.log('Workbox could not be loaded. No Offline support');
    }
}