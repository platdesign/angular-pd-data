'use strict';


// deps
var Bacon = require('baconjs');
var e = require('./e.js');
var Resource = require('./Resource.js');
var Adapter = require('./Adapter.js');

module.exports = Store;

function Store() {

	this.down = new Bacon.Bus();
	this.adapters = {};
	this.defaultAdapterName;

	var resources = {};

	this.defineResource = function(config) {

		if(!config.name) {
			throw new Error('Missing name on resource');
		}

		if(!config.path) {
			throw new Error('Missing path on resource '+config.name);
		}

		var defaultConfig = {

		};

		var _config = angular.merge({}, defaultConfig, config);
		var resource = new Resource(_config, this).subscribe(this.down);

		this[config.name] = resource;
		resources[config.name] = resource;
		return resource;
	}



	this.connect = function(name, config) {
		if(this.adapters[name]) {
			throw new Error('Adapter '+name+' already connected.');
		}

		if(!this.defaultAdapterName) {
			this.defaultAdapterName = name;
		}

		var adapter = new Adapter(this, config);
		this.adapters[name] = adapter;
		return adapter;
	}


	this.status = function() {
		var adapterNames = Object.keys(this.adapters);
		var resourcesNames = Object.keys(resources);
		var adapters = this.adapters;

		var status = {
			resources: {
				count: resourcesNames.length,
				status: {}
			},
			adapters: {
				count: adapterNames.length,
				status: {}
			}
		};


		angular.forEach(resources, function(value, key){
			status.resources.status[key] = value.status();
		});

		angular.forEach(adapters, function(value, key){
			status.adapters.status[key] = value.status();
		});




		return status;
	}

}

