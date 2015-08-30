'use strict';


var _ = require('./_.js');
var e = require('./e.js');
var Model = require('./Model.js');
var utils = require('./utils.js');



function createCollection(config, resource) {

	var collection = [];

	/**
	 * Create filter function from config.where query object
	 */
	var whereFilter = utils.where2filter(config.where);

	config.relationFilter = config.relationFilter || function(){ return true; };


	collection.config = config;

	collection.state = {
		loading: false
	};

	// private
	var indexOfRaw = utils.indexOfRawInCollection(collection);

	var idFromRaw = utils.idFromRaw(resource.config.model);



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
		if(!whereFilter(raw) || !config.relationFilter(raw)) {
			remove(raw);
		} else {
			addOrMerge(raw);
		}
	}


	// public
	collection.subscribe = function(down) {
		this.down = down
			.filter( e.filterByFunction( whereFilter ) )
			.filter( e.filterByFunction( config.relationFilter ));

		var on;

		on = e.onStreamValueCallMethod( down );
			on('remove', e.executeWith(remove, 'data'));
			on('equipOne', e.executeWith(equipOne, 'data'));


		on = e.onStreamValueCallMethod( this.down );
			on('add', e.executeWith(equipOne, 'data'));

		return this;
	};


	collection.add = function(raw) {
		raw = raw || {};
		raw = angular.copy(raw);
		angular.merge(raw, config.where);
		resource.add(raw);
	};

	collection.remove = function(model) {
		resource.remove(model.attr);
	};

	collection.create = function(raw) {
		raw = raw || {};
		angular.merge(raw, config.where);
		return resource.adapter.createPath(endpointPath(), raw)
		.then(function(attr) {
			resource.add(attr);
			return collection.findById(idFromRaw(attr));
		});
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

	function endpointPath() {
		if(collection.config.parentModel) {
			return collection.config.parentModel.endpointPath() + '/' + resource.config.path;
		}
		return resource.config.path;
	}

	collection.load = function(query) {
		this.state.loading = true;

		if(config.where) {
			query = angular.merge({}, { where:config.where }, query);
		}

		return resource.adapter.getPath(endpointPath(), query)
		.then(function(items) {
			items.forEach(function(item){
				resource.merge(item);
			});
			this.state.loading = false;
			return this;
		}.bind(this));
	}

	collection.loadLazy = function() {
		this.load();
		return this;
	}

	collection.findById = function(id) {
		return this.filter(function(model) {
			return String(model.id) === String(id);
		})[0];
	};


	collection.loadById = function(id, query) {
		query = query || {};

		var existing = this.findById(id);
		if(existing) {
			return existing.load();
		} else {
			var path = endpointPath() + '/' + id;
			return resource.adapter.getPath(path, query)
			.then(function(raw) {
				resource.merge(raw);
				return this.findById(id);
			}.bind(this));
		}
	}

	utils.registerMethodsOnHost(collection, config.methods);


	return collection;
}

module.exports = createCollection;


