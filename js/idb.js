class IdB {

	static get OBJECT_STORE(){
		return  "restaruantDB";
	}

	static get IDB_PROMISE(){
		return idb.open('restaraunt-db', 1, function(upgradeDb){
			var keyValStore = upgradeDb.createObjectStore(IdB.OBJECT_STORE, {keyPath: 'id'});
		});
	}

	static storeRestaurants(restaurants){
		IdB.IDB_PROMISE
        	.then(db => IdB.setRestaurants(db, restaurants))
        	.then( () => console.log("Added restaurants to IDB"));
	}

	static setRestaurants(db, restaurants){
		let tx = db.transaction(IdB.OBJECT_STORE, 'readwrite');
		let keyValStore = tx.objectStore(IdB.OBJECT_STORE);
		restaurants.forEach( (restaurant) => {
			// console.log(restaurant);
			keyValStore.put(restaurant);
		});
		return tx.complete;
	}

}