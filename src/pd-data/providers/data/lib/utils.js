'use strict';

var _ = require('./_.js');

var utils = module.exports = {};


utils.where2filter = _.curry(function(where, data) {

	if(!where) {
		return true;
	}

	return Object.keys(where).every(function(key) {
		return where[key] === data[key];
	});

});



utils.collection2rawArray = function(collection) {
	return collection.map(function(model) { return model.attr; });
}

utils.indexOfRawInCollection = _.curry(function(collection, raw) {
	var arr = utils.collection2rawArray(collection);
	return arr.indexOf(raw);
});



utils.registerMethodsOnHost = _.curry(function(host, methods) {
	if(methods) {
		Object.keys(methods).forEach(function(name) {
			host[name] = methods[name].bind(host);
		});
	}
});




utils.string2hash = function(string) {
	var hash = 0, i, chr, len;
	if (string.length == 0) return hash;
	for (i = 0, len = string.length; i < len; i++) {
		chr   = string.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return String(hash);
};


utils.collectionNameFromConfig = function(config) {

	return this.string2hash(JSON.stringify(config.where || {}));

};
