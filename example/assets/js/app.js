'use strict';



var app = angular.module('app', [
	require('../../../').name,
	require('../../../src/adapters/http.js').name
]);


app.run(['Data', '$rootScope', 'pdDataAdapterHttp', function(Data, $rootScope, $httpAdapter) {

	var backend = Data.createStore({

	});


	backend.connect('api', {
		adapter: $httpAdapter,
		options: {
			baseUrl: 'http://localhost:4000'
		}
	});



	var Video = backend.defineResource({
		name: 'Video',
		path: 'videos',

		model: {
			primary: 'id',

			relations: {
				hasMany: {
					Cue: {
						field: 'cues',
						identifier: 'videoId'
					}
				}
			},

			methods: {
				start: function() {
					console.log(this);
				}
			}
		},

		collection: {
			methods: {
				huhu: function() {
					console.log(this)
				}
			}
		}
	});

	var Cue = backend.defineResource({
		name: 'Cue',
		path: 'cues',

		model: {
			primary: 'id'
		}
	});




	function VideoStatus(res) {
		console.log(Video.status());
		return res;
	}


	Video.load()
	.then(VideoStatus)
	.then(function(coll) {
		return coll[0].load()
	})
	.then(VideoStatus)

	.then(function() {
		return Video.create({ title:'Testvideo' });
	})


	.then(VideoStatus)
	.then(function(model) {
		return Video.loadById(model.id);
	})
	.then(VideoStatus)
	.then(function(model) {
		model.attr.title = 'Neuer Titel';
		return model.save();
	})
	.then(VideoStatus)
	.then(function(model) {
		return model.destroy();
	})
	.then(VideoStatus);


/*
	Video.loadById(1)
	.then(function(model) {
		console.log(model);
	})
*/

}]);
