'use strict';


// deps
var utils = require('./utils.js');



module.exports = Model;



function Model(raw, config, resource) {
	this.attr = raw;
	this.__proto__ = raw;

	var model = this;

	var idFromRaw = utils.idFromRaw(config);


	// Define id property
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







	this._delete = function() {
		console.log('TODO: Tidy up relations on delete');
	}










	/**
	 * Load an existing model from resource
	 * @return {Model} Promise which resolves with model instance
	 */
	this.load = function(query) {
		query = query || {};

		return resource.adapter
			.getPath(this.endpointPath(), query)
			.then(function(raw) {
				resource.merge(raw);
				return this;
			}.bind(this));
	};


	/**
	 * Create or update a model on resource adapter
	 * @return {Model} Promise which resolves with model instance
	 */
	this.save = function() {
		var promise;
		if(this.id) {
			promise = resource.adapter.updatePath(this.endpointPath(), this.attr);
		} else {
			promise = resource.adapter.createPath(this.endpointPath(), this.attr);
		}
		return promise.then(function(raw) {
			resource.merge(raw);
			return this;
		}.bind(this));
	};


	/**
	 * Destroy a model an remove it from resource
	 * @return {NULL}
	 */
	this.destroy = function() {
		console.log('destroy')
		return resource.adapter.deletePath(this.endpointPath(), this.attr)
		.then(function() {
			return this.remove();
		}.bind(this));
	};


	/**
	 * Remove the model from resource
	 * @return {[type]} [description]
	 */
	this.remove = function() {
		resource.remove(this.attr);
	};











	var autosaveTimer;
	this.triggerAutosave = function() {

		clearTimeout(autosaveTimer);
		autosaveTimer = setTimeout(function() {
			this.save();
		}.bind(this), 600);

	};

	model.relations = {};
	this.loadRelations = function() {
		Object.keys(model.relations).forEach(function(key) {
			var relation = model.relations[key];
			relation.load();

		});
	};

	utils.registerMethodsOnHost(this, config.methods);
	utils.registerVirtualsOnHost(this, config.virtuals);

	if(config.relations) {

		// HAS MANY
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
						model.relations[relation.field] = coll;
						return coll;
					}
				});

			});
		}


		// HAS MANY REFS
		if(config.relations.hasManyRefs) {
			Object.keys(config.relations.hasManyRefs)
			.forEach(function(relationResourceName) {

				var relConfig = config.relations.hasManyRefs[relationResourceName];

				var Resource = resource.store[relationResourceName];

				Object.defineProperty(model, relConfig.field, {
					get: function() {

						var collName = 'relation2'+resource.config.name+'.model.'+model.id;

						var config = {
							name: collName,
							parentModel: model,
							relationFilter: function(raw) {

								var id = utils.idFromRaw(Resource.config.model, raw);

								var res = (model.attr[relConfig.field].indexOf(id) > -1);

								return res;
							}
						};

						var coll = Resource.collection(config);
						model.relations[relConfig.field] = coll;

						return coll;
					}
				})

			});
		}

	}






}
