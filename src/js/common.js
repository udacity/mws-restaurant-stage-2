/** 
 * Register service worker(s)
 */
const registerServiceWorker = () => {
  if (!navigator.serviceWorker) return;
    navigator.serviceWorker.register('/js/sw.js')
    .then(() => {
      console.log('Service worker registered.');
    })
    .catch(() => {
      console.log('Service worker did NOT register.');
    });
};

