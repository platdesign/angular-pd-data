'use strict';


var _ = require('./_.js');
var e = require('./e.js');
var Model = require('./Model.js');
var utils = require('./utils.js');



function createCollection(config, resource) {

	var collection = [];




	var whereFilter = utils.where2filter(config.where);





	collection.config = config;

	// private
	var indexOfRaw = utils.indexOfRawInCollection(collection);


	function addOrMerge(raw) {
		var index = indexOfRaw(raw);
		index === -1 && collection.push( collection.newModel(raw) );
	}

	function remove(raw) {
		var index = indexOfRaw(raw);
		if(index > -1) {
			var model = collection[index];
			model._delete();
			collection.splice(index, 1);
		}

	}

	function equipOne(raw) {
		if(!whereFilter(raw)) {
			remove(raw);
		} else {
			addOrMerge(raw);
		}
	}


	// public
	collection.subscribe = function(down) {
		this.down = down.filter( e.filterByFunction( whereFilter ) );

		var on;

		on = e.onStreamValueCallMethod( down );
			on('remove', e.executeWith(remove, 'data'));
			on('equipOne', e.executeWith(equipOne, 'data'));


		on = e.onStreamValueCallMethod( this.down );
			on('add', e.executeWith(addOrMerge, 'data'));

		return this;
	};


	collection.add = function(raw) {
		raw = angular.copy(raw);
		angular.merge(raw, config.where);
		resource.add(raw);
	};

	collection.remove = function(model) {
		resource.remove(model.attr);
	};

	collection.create = function(raw) {
		angular.merge(raw, config.where);
		return resource.create(raw);
	};

	collection.newModel = function(raw, config) {
		var defaultConfig = {
			primary: 'id'
		};

		var _config = angular.merge({}, defaultConfig, resource.config.model, config);

		_config.parentModel = collection.config.parentModel;

		var model = new Model(raw, _config, resource);
		return model;
	}

	collection.load = function() {
		return resource.load();
	}

	utils.registerMethodsOnHost(collection, config.methods);


	return collection;
}

module.exports = createCollection;


