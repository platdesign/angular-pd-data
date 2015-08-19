(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';




var mod = module.exports = angular.module('pd.data.adapter.http', ['pd.data']);



mod.factory('pdDataAdapterHttp', ['$http', function($http){
	return function httpAdapterService(options){

		var transformResult = function(res) {
			return res.data;
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


	};
}]);

},{}]},{},[1]);
