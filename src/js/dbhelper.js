/**
 * Common database helper functions.
 */
class DBHelper {
  /*
   * Constants
   */
  static get REST_DB() {
    return 'RestaurantDB';
  }
  static get REST_STORE() {
    return 'RestaurantStore';
  }
  static get DATABASE_URL() {
    const port = 1337; // Stage 2 server port
    return `http://localhost:${port}/restaurants`;
  }
  static get DATABASE_VERSION() {
    return 1;
  }

  static fetchError(err, asset) {
    console.error(`ERROR (${err}) when attempting to fetch ${asset}`);
  }
  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    // Try to fetch from server first.
    // If the data are there, add to the database. 
    // If the server fails, use the stored data 
    fetch(DBHelper.DATABASE_URL, {
      method: 'GET'
    }).then(response => response.json())
      .then(data => {
        // take fresh network data and store in local DB
        DBHelper.createDb(data);
        callback(null, data);
      }).catch(() => {
        let idb = indexedDB.open(DBHelper.REST_DB, DBHelper.DATABASE_VERSION);
        idb.onsuccess = e => {
          let db = e.target.result;
          let tx = db.transaction(DBHelper.REST_STORE);
          let store = tx.objectStore(DBHelper.REST_STORE);
          let request = store.getAll();
          request.onsuccess = () => {
            callback(null, request.result);
          }
        }
      });
  }
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    let img = restaurant.photograph || restaurant.id;
    return (`/img/${img}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }

  /**
   * Create local database, save restaurant
   * data as store.
   */
  static createDb(restaurants) {
    let idb = indexedDB.open(DBHelper.REST_DB, DBHelper.DATABASE_VERSION);

    idb.onerror = error => {
      console.error(`ERROR (${error}) when trying to create database.`);
    };

    idb.onupgradeneeded = evt => {
      let db = evt.target.result;
      let store = db.createObjectStore(DBHelper.REST_STORE, {
        keyPath: 'id'
      });
      store.createIndex('byId', 'id');
      store.transaction.oncomplete = () => {
        let reviewStore = db.transaction([DBHelper.REST_STORE], 'readwrite').objectStore(DBHelper.REST_STORE);
        // take data and place into store
        for (let i = 0; i < restaurants.length; i++) {
          reviewStore.put(restaurants[i]);
        }
      };
    };
  }
}
