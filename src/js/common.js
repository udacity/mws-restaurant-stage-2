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

/** 
 * Create restaurant image(s).
 */
const createRestaurantImages = (restaurant, format) => {
  /* default image; the largest */
  const image = document.createElement('img');
  const picture = document.createElement('picture');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.setAttribute('alt', restaurant.name);
  if (format === 'home') {
 /* When the viewport permits a grid of several items 
   placed horizontally, use the *smaller* image
 */
 picture.innerHTML = `
   <source media="(min-width: 585px)" srcset="img/${restaurant.id}-thumb.jpg">
   <source media="(max-width: 584px") srcset="img/${restaurant.id}-small.jpg">
 `;
  } else {
    picture.innerHTML = `
    <source media="(max-width: 500px)" srcset="img/${restaurant.id}-thumb.jpg">
    <source media="(min-width: 501px) and (max-width: 600px") srcset="img/${restaurant.id}-small.jpg">
  `;
  }
 picture.append(image);
 return picture;
};