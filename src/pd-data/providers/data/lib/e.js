'use strict';

var _ = require('./_.js');
var e = module.exports = {};
var utils = require('./utils.js');





e.filterBy = _.curry(function(key, val, event){
	return event[key] === val;
});

e.get = _.curry(function(key, event) {
	return event[key];
});





e.filterByMethod 	= e.filterBy('method');
e.filterByResource 	= e.filterBy('resource');


e.filterByFunction	= _.curry(function(method) {
	return _.compose( method, e.getData());
});

e.filterByWhere		= _.curry(function(where) {
	return e.filterByFunction( utils.where2filter(where) );
});




e.getMethod 		= e.get('method');
e.getData 			= e.get('data');
e.getResource 		= e.get('resource');


e.execute = _.curry(function(handler, arg) {
	return handler(arg);
});


e.executeWith = _.curry(function(handler, getter) {
	return _.compose(e.execute(handler), e.get(getter));
});





e.onStreamValueCallMethod = _.curry(function(stream, method, handler) {
	stream
		.filter( e.filterByMethod(method) )
		.assign( handler );
});



e.sendEvent = _.curry(function(stream, resource, method, data){
	stream.push({
		method: method,
		resource: resource,
		data: data
	});
});
