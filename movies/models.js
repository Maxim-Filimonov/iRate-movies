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

const ReviewSchema = mongoose.Schema({
	username: {type: String},
	content: { type: String, required: true },
	created: { type: Date, default: Date.now }
});

ReviewSchema.methods.apiRepr = function() {
	return {
	  id: this._id,
	  content: this.content,
	  created: this.created,
	  username: this.username
	};
  };
  
  const Review = mongoose.model('Review', ReviewSchema);

const Movie = mongoose.modelNames.Movie || mongoose.model('Movie', MovieSchema);

module.exports = { Movie, Review };