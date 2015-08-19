'use strict';

// deps
var Store = require('./lib/Store.js');

/**
 * Provider: Data
 */
module.exports = [function() {



	this.$get = ['$q', function($q) {

		var Data = {};

		Data.createStore = function() {
			var store = new Store();



			return store;
		};

		return Data;

	}];

}];
