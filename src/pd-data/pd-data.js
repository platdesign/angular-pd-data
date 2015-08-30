'use strict';

/**
 * Angular-Module: pd.data
 * [Description]
 */
var mod = module.exports = angular.module('pd.data', []);

// Providers
mod.provider('Data', require('./providers/data'));

mod.directive('pdDataAutosave', function() {
	return {
		restrict: 'A',
		scope: false,
		require: 'ngModel',
		link: function(scope, el, attr, modelCtrl) {

			modelCtrl.$viewChangeListeners.push(function() {
				scope[attr.pdDataAutosave].triggerAutosave();
			});
		},
		controller: ['$scope', function($scope) {

		}]
	}
});
