'use strict';


// deps
var utils = require('./utils.js');



module.exports = Model;



function Model(raw, config, resource) {
	this.attr = raw;

	Object.defineProperty(this, 'id', {
		get: function() {
			return raw[config.primary];
		},
		set: function(val) {
			raw[config.primary] = val;
		}
	});

	this.endpointPath = function() {
		var path='';
		if(config.parentModel) {
			path = config.parentModel.endpointPath() + '/';
		}

		path += resource.config.path;

		if(this.id) {
			path += '/' + this.id;
		}
		return path;
	}

	this.remove = function() {
		resource.remove(this.attr);
	};

	this.save = function() {

		if(this.id) {
			return resource.update(this.attr, this.endpointPath());
		} else {
			return resource.create(this.attr, this.endpointPath());
		}
	};

	this.destroy = function() {
		return resource.destroy(this.attr, this.endpointPath());
	};

	this._delete = function() {
		console.log('TODO: Tidy up relations on delete');
	}

	utils.registerMethodsOnHost(this, config.methods);


	if(config.relations) {
		var model = this;

		if(config.relations.hasMany) {
			Object.keys(config.relations.hasMany).forEach(function(relationResourceName) {

				var relation = config.relations.hasMany[relationResourceName];

				var Resource = resource.store[relationResourceName];

				if(!Resource) {
					throw new Error('Relation resource not found '+relationResourceName);
				}

				if(!relation.field) {
					throw new Error('Relation needs field attribute '+relationResourceName);
				}

				Object.defineProperty(model, relation.field, {
					get: function() {

						var where = {};
						where[relation.identifier] = model.id;

						var config = {
							where: where,
							parentModel: model
						}

						var coll = Resource.collection(config);
						return coll;
					}
				});

			});
		}

	}


}
