#pd-ng-data-reactive

reactive angular data orm


#Install

`npm install --save-dev angular-pd-data`


# Docs

There is a lot to do...

A little snippet from the example app...

```javascript
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




$rootScope.videos = Video.find();
$rootScope.videos2 = Video.find({ title: 'a' });

$rootScope.videos.load();

$rootScope.cues = Cue.find();

$rootScope.cues.load();

```

#Author

Christian Blaschke <mail@platdesign.de>
