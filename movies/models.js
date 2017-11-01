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
  flick: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

ReviewSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    flick: this.flick.title,
    content: this.content,
    author: this.author.username,
    created: this.created
  };
  
};

const Review = mongoose.model('Review', ReviewSchema);

const Movie = mongoose.modelNames.Movie || mongoose.model('Movie', MovieSchema);

module.exports = { Movie, Review };
