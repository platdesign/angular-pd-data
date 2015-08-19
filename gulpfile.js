'use strict';

var gulp = require('gulp');



// Load js generator
var js = require('pd-gulp-js')(gulp);

js.register({
	pdData: {
		src: './src/pd-data/pd-data.js',
		dest: './dist'
	},
	example: {
		src: './example/assets/js/*.js',
		dest: './example/public/js'
	},
	adapters: {
		src: './src/adapters/*.js',
		dest: './dist/adapters'
	}
});



