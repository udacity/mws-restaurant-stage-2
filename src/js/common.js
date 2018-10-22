/** 
 * Register service worker(s)
 */
const registerServiceWorker = () => {
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.register('../sw.js')
    .then(() => {
      console.log('Service worker is now registered.');
    })
    .catch((error) => {
      console.error(`Service worker did NOT register, because ${error}.`);
    });
};

/** 
 * Create restaurant image(s).
 */
const createRestaurantImages = (restaurant, format) => {
  /* default image; the largest */
  const image = document.createElement('img');
  const picture = document.createElement('picture');
  image.className = 'restaurant-img lazy';
  /* load placeholder image first; add real image source only
     when in view */
  image.src = 'placeholder.png';
  /* add attributes placeholder for lazy-loading script to
     access */
  image.setAttribute('data-src', DBHelper.imageUrlForRestaurant(restaurant));
  image.setAttribute('alt', restaurant.name);

  if (format === 'home') {
    /* When the viewport permits a grid of several items 
      placed horizontally, use the *smaller* image
    */
    picture.innerHTML = `
   <source class="lazy" srcset="${image.src}" media="(min-width: 585px)" data-src="img/${restaurant.id}-thumb.jpg">
   <source class="lazy" srcset="${image.src}" media="(max-width: 584px") data-src="img/${restaurant.id}-small.jpg">
 `;
  } else {
    picture.innerHTML = `
    <source media="(max-width: 500px)" srcset="${image.src}" data-src="img/${restaurant.id}-thumb.jpg">
    <source media="(min-width: 501px) and (max-width: 600px") srcset="${image.src}" data-src="img/${restaurant.id}-small.jpg">
  `;
  }
  picture.append(image);
  return picture;
};
/** 
 * Show live Google Maps upon user preference (click)
 */
const toggleMap = (format) => {
  let staticMap = document.getElementById('static');
  let map = document.getElementById('map');

  if (map.className === 'hidden') {
    staticMap.className = 'hidden';
    map.className = 'visible';
  }
  else {
    map.className = 'hidden';
  }
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

/* Lazy load restaurant images using `IntersectionObserver`.
 * see: https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
 */
const lazyLoadImages = () => {
  let lazyImages = [].slice.call(document.querySelectorAll('.lazy'));
  if ('IntersectionObserver' in window) {
    // No version of Safari or IE currently supports. See: https://caniuse.com/#search=IntersectionObserver
    let lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          if (lazyImage.srcset) {
            lazyImage.srcset = lazyImage.dataset.src;
          } else {
            lazyImage.src = lazyImage.dataset.src;
          }
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    lazyImages.forEach(lazyImage => {
      lazyImageObserver.observe(lazyImage);
    });
  }
  // fallback? It'd go here.
  else {
    console.log(`no IntersectionObserver object in this browser.`);
  }
};
