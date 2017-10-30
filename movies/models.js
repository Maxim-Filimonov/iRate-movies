'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const MovieSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	release_date: {
		type: String
	}
});

MovieSchema.methods.apiRepr = function() {
	return {title: this.title};
};

const Movie = mongoose.modelNames.Movie || mongoose.model('Movie', MovieSchema);

module.exports = { Movie };