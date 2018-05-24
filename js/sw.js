// TODO: cache page/app elements
// TODO: work offline
self.addEventListener('fetch', (event) => {
  console.log(`service worker loaded. ${event.request}`);
});