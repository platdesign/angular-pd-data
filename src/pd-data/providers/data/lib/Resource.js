'use strict';

// deps
var e = require('./e.js');
var Collection = require('./Collection.js');
var Bacon = require('baconjs');
var utils = require('./utils.js');
var _ = require('./_.js');

function Resource(config, store) {

	var resource = this;

	var defaultConfig = {};


	this.config = angular.merge({}, defaultConfig, config);
	this.store = store;


	this.sendDown = new Bacon.Bus();


	this.adapter = store.getAdapter(config.adapter);



	// EventSender
	var sendEvent 	= e.sendEvent(this.sendDown, this.config.name);
	var sendAdd 		= sendEvent('add');
	var sendRemove 	= sendEvent('remove');
	var sendEquip 	= sendEvent('equip');
	var sendEquipOne= sendEvent('equipOne');

	var idFromRaw = utils.idFromRaw(config.model);


	this.subscribe = function(down) {
		this.down = down.filter( e.filterByResource(config.name) ).merge(this.sendDown);

		return this;
	};





	var collectionCache = {};
	var itemStore = [];
	var resourceCollection;


	itemStore.getById = function(id) {
		return this.filter(function(item) {
			return item[config.model.primary] === id;
		})[0];
	};
	itemStore.removeItem = function(item) {
		var index = this.indexOf(item)
		this.splice(index, 1);
	};

	itemStore.merge = function(item) {
		var id = idFromRaw(item);
		var existing = this.getById(id);
		if(existing) {
			angular.merge(existing, item);
			return existing;
		} else {
			this.push(item);
			return item;
		}
	};

	this.itemStore = itemStore;




	this.collection = function(config) {
		config = config || {};

		var name = utils.collectionNameFromConfig(config);

		if(collectionCache[name]) {
			return collectionCache[name];
		} else {
			var defaultConfig = {

			};

			var _config = angular.merge({}, defaultConfig, this.config.collection, config);

			if(config.parentModel) {
				_config.parentModel = config.parentModel;
			}

			var collection = Collection(_config, this).subscribe(this.down);

			collectionCache[name] = collection;
			return collection;
		}
	}




	this.status = function() {
		return {
			collections: Object.keys(collectionCache).length,
			items: itemStore.length
		}
	};






	this.find = function(where){
		return this.collection({ where:where });
	};

	this.findById = function(id){
		return this.find().findById(id);
	};

	this.load = function(where){
		return this.find(where).load();
	};

	this.loadLazy = function(where) {
		return this.find(where).loadLazy();
	};

	/**
	 * Merge an item with item Store and notify all collections
	 * @param  {Object} raw raw model attributes
	 * @return {Object} raw|existingRaw
	 */
	this.merge = function(raw) {
		raw = itemStore.merge(raw);
		sendEquipOne(raw);
		return raw;
	}

	/**
	 * Adds a new raw object to itemStore and notifies all collections
	 * @param {Object} raw raw object attributes
	 */
	this.add = function(raw){
		itemStore.push(raw);
		sendAdd(raw);
	};


	/**
	 * Removes a raw object from itemStore and notifies all collections
	 * @param  {Object} raw Raw model attributes
	 */
	this.remove = function(raw){
		itemStore.removeItem(raw);
		sendRemove(raw);
	};


	/**
	 * Create a new model on main collection
	 * @param  {Object} attr Raw model attributes
	 * @return {Promise}      Promise resolves with model instance
	 */
	this.create = function(attr) {
		return this.find().create(attr);
	};


	/**
	 * Load a model by id
	 * @param  {String|Int} id Id to load
	 * @return {Promise}    Promise resolves with model instance
	 */
	this.loadById = function(id){
		return this.find().loadById(id);
	};



/*

	this.find = function(where) {
		return this.collection({ where: where });
	}


	this.loadById = function(id) {
		return this.find().loadById(id);
	}



	this.add = function(raw) {
		itemStore.push(raw);
		sendAdd(raw);
	}

	this.remove = function(raw) {
		var index = itemStore.indexOf(raw);
		index > -1 && itemStore.splice(index, 1);
		sendRemove(raw);
	}


	var getAdapter = function() {
		return store.getAdapter(config.adapter);
	};


	this.create = function(raw, path) {
		return getAdapter().createModel(raw, path || this.config.path)
		.then(function(res) {
			angular.merge(raw, res);
			itemStore.push(raw);
			sendAdd(raw);
		});
	};

	this.update = function(raw, path) {
		return getAdapter().updateModel(raw, path)
		.then(function() {
			sendEquipOne(raw);
		})
	};

	this.destroy = function(raw, path) {
		return getAdapter().destroyModel(raw, path)
		.then(function() {
			resource.remove(raw);
		});
	};

	this.load = function(path, query) {
		query = query || {};

		return getAdapter().load(path || this.config.path)
		.then(function(items) {
			items.forEach(function(item) {
				resource.add(item);
				sendEquipOne(item);
			});
		}.bind(this))
	};

	this.loadOne = function(raw, path) {
		return getAdapter().loadModel(raw, path || this.config.path)
		.then(function(res) {
			angular.merge(raw, res);
			itemStore.push(raw);
			sendEquipOne(raw);
		});
	}
*/


}

module.exports = Resource;











