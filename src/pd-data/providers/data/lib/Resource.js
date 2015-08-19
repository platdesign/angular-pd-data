'use strict';

// deps
var e = require('./e.js');
var Collection = require('./Collection.js');
var Bacon = require('baconjs');
var utils = require('./utils.js');


function Resource(config, store) {

	var resource = this;

	var defaultConfig = {
	};

	this.config = angular.merge({}, defaultConfig, config);
	this.store = store;

	this.sendDown = new Bacon.Bus();

	// EventSender
	var sendEvent 	= e.sendEvent(this.sendDown, this.config.name);
	var sendAdd 	= sendEvent('add');
	var sendRemove 	= sendEvent('remove');
	var sendEquip 	= sendEvent('equip');
	var sendEquipOne= sendEvent('equipOne');






	this.subscribe = function(down) {
		this.down = down.filter( e.filterByResource(config.name) ).merge(this.sendDown);

		return this;
	};


	var collectionCache = {};
	var itemStore = [];

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


	this.find = function(where) {
		return this.collection({ where: where });
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
		var adapterName = config.adapter || store.defaultAdapterName;

		if(!store.adapters[adapterName]) {
			throw new Error('Cant find adapter '+adapterName);
		}

		return store.adapters[adapterName];
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
		return getAdapter().load(path || this.config.path)
		.then(function(items) {
			items.forEach(function(item) {
				resource.add(item);
			});
		})
	};

}

module.exports = Resource;
