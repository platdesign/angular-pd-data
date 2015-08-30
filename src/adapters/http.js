'use strict';




var mod = module.exports = angular.module('pd.data.adapter.http', ['pd.data']);



mod.factory('pdDataAdapterHttp', ['$http', function($http){
	return function httpAdapterService(options){

		var transformResult = function(res) {
			return res.data;
		};

		this.getPath = function(path, query) {

			query = $.param(query);

			return $http({
				method: 'GET',
				url: options.baseUrl +'/'+ path + '?' + query
			}).then(transformResult, transformResult);
		};


		this.createPath = function(path, doc) {
			return $http({
				method: 'POST',
				data: doc,
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		};

		this.updatePath = function(path, doc) {
			return $http({
				method: 'PUT',
				data: doc,
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		};

		this.deletePath = function(path, doc) {
			return $http({
				method: 'DELETE',
				data: doc,
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		};









		this.createModel = function(model, path) {
			return $http({
				method: 'POST',
				data: model,
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		};



		this.updateModel = function(model, path) {
			return $http({
				method: 'PUT',
				data: model,
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		};



		this.load = function(path) {
			return $http({
				method: 'GET',
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		};



		this.destroyModel = function(model, path) {
			return $http({
				method: 'DELETE',
				data: model,
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		}

		this.loadModel = function(model, path) {
			return $http({
				method: 'GET',
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		}
	};
}]);
