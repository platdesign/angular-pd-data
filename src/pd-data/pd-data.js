'use strict';

/**
 * Angular-Module: pd.data
 * [Description]
 */
var mod = module.exports = angular.module('pd.data', []);

// Providers
mod.provider('Data', require('./providers/data'));

