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

			if(['text'].indexOf(el.attr('type')) > -1) {
				modelCtrl.$options = {
					updateOn: 'blur',
					updateOnDefault: true,
					debounce: {
						'blur': 100,
						'default': 400
					}
				};
			}

			modelCtrl.$viewChangeListeners.push(function() {

				if(modelCtrl.$dirty && modelCtrl.$valid) {
					scope[attr.pdDataAutosave].triggerAutosave();
				}
			});
		},
		controller: ['$scope', function($scope) {

		}]
	}
});
