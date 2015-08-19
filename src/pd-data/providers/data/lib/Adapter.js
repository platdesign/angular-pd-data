'use strict';



module.exports = Adapter;



function Adapter(store, config) {

	config.adapter.call(this, config.options);

	this.status = function() {

		return {

		}
	}

}
