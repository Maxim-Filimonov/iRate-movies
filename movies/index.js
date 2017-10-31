'use strict';
const faker = require('faker')
const express = require('express');
const passport = require('passport');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Movie, Review } = require('./models');

const jwtAuth = passport.authenticate('jwt', { session: false });

const items = require('../db/storage')('items');

// Seed the dummy database
// items.addOne({ name: 'aaa' });
// items.addOne({ name: 'bbb' });
// items.addOne({ name: 'ccc' });
// items.addOne({ name: 'ddd' });
// items.addOne({ name: 'eee' });
// items.addOne({ name: 'fff' });

function seedMoviesData() {
  Movie.find()
    .sort({ release_date: -1 })
    .limit(10)
    .then(movies => {
      //console.log(movies);
    movies.map(movie =>
      console.log(movie._id)
        //items.addOne({ name: movie.title, date: movie.release_date })
      );
    });
}

seedMoviesData();


function seedUserData() {
 const User = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: 'dev'
  }
  User.username = User.firstName.toLowerCase()
  console.log(User)
}

seedUserData();

function renderReviews() {
  Review.find().then(reviews => {
    //console.log(movies);
    reviews.map(review =>
      items.addOne({ name: review.content, date: review.created })
    );
  });
}

renderReviews();

router.get('/', (req, res) => {
  const query = req.query;
  // Remember, *never* trust users, *always* validate data
  const list = items.getList(query);
  return res.json(list);
});

// router.get('/:id', (req, res) => {
//   const id = req.params.id;
//   return res.json(items.getOne(id));
// });
//59f77af2ef2de52021d9ef30
router.post('/', jwtAuth, jsonParser, (req, res) => {
  // Remember, *never* trust users, *always* validate data
  const { content, movieId } = req.body;
  const { userId } = req.user;
  Review.create({
    author: userId,
    flick: movieId,
    content
  })
    .then(review => {
      res.status(201).json(review.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

router.get('/:id', (req, res) => {
  return Review.findById(req.params.id)
    .populate('author')
    .populate('flick')
    .then(result => res.json(result.apiRepr()));
});

router.put('/:id', jwtAuth, jsonParser, (req, res) => {
  // Remember, *never* trust users, *always* validate data
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  if (!req.body.content) {
    res.status(400).json({
      error: 'Must have content'
    });
  }
  Review.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(updated => {
      //console.log(updated.id, '===', req.params.id, '===', req.body);
      res.status(201).json(items.modOne(req.body));
      // res.status(201).json(updated);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json(error);
    });
});

router.delete('/:id', jwtAuth, (req, res) => {
  const id = req.params.id;
  Review.findByIdAndRemove(req.params.id).then(() => {
    items.delOne(id);
    res.sendStatus(204);
  });
});

module.exports = { router };
