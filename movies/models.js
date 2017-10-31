'use strict';

const mongoose = require('mongoose');

const { User } = require('../users/models');

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
  return { title: this.title };
};

const ReviewSchema = mongoose.Schema({
  content: { type: String, required: true },
  created: { type: Date, default: Date.now },
  movieId: { type: mongoose.Schema.Types.ObjectID, ref: 'Movie' },
  userId: { type: mongoose.Schema.Types.ObjectID, ref: 'User' }
});

ReviewSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    content: this.content,
    created: this.created,
	userId: this.userId,
	movieId: this.movieId
  };
};

const Review = mongoose.model('Review', ReviewSchema);

const Movie = mongoose.modelNames.Movie || mongoose.model('Movie', MovieSchema);

module.exports = { Movie, Review };
