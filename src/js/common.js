/** 
 * Register service worker(s)
 */
const registerServiceWorker = () => {
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.register('js/sw.js')
    .then(() => {
      console.log('Service worker is now registered.');
    })
    .catch((error) => {
      console.log(`Service worker did NOT register, because ${error}.`);
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

/**
 * Initialize Google map, called from HTML.
 */
const initMaps = (format) => {
  // On the home page, return a map
  // showing all restaurant locations
  if (format === 'home') {
    return (
      window.initMap = () => {
        let loc = {
          lat: 40.722216,
          lng: -73.987501
        };
        let zoom = 12;
        self.map = new google.maps.Map(document.getElementById('map'), {
          zoom: zoom,
          center: loc,
          scrollwheel: false
        });
        updateRestaurants();
      }
    );
  }
// If not the home page, return a map
// marking the location of a single restaurant
  return (
    window.initMap = () => {
      fetchRestaurantFromURL((error, restaurant) => {
        if (error) { // Got an error!
          console.error(error);
        } else {
          self.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: restaurant.latlng,
            scrollwheel: false
          });
          fillBreadcrumb();
          DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
        }
      });
    }
  );
};
