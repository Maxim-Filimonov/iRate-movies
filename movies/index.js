'use strict';
const faker = require('faker');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Movie, Review } = require('./models');
const { User } = require('../users/models');
const jwtAuth = passport.authenticate('jwt', { session: false });

const items = require('../db/storage')('items');


function seedLandingPageMoviesData() {
	Movie.find()
		.sort({ release_date: -1 })
		.limit(10)
		.then(movies => movies.map(movie => {
			movie = movie.apiRepr();
			//console.log(movie);
			items.addOne({id: movie.id, name: movie.title, date: movie.releaseDate, tagline: movie.tagline});
		})
		);
}

seedLandingPageMoviesData();


// function seedUserData() {
//   const firstName = faker.name.firstName();
//   User
//   // .find()
//   // .then(results => )
  
//   .create({
//     firstName: firstName,
//     lastName: faker.name.lastName(),
//     // use 'dev' for password when logging in.
//     password: '$2a$10$7FyFDShU8Gt99Feu4Ip74.1J3AvmACWUGh7l.tfK80U05P2Ng87wq',
//     username: firstName.toLowerCase()
//   })
// };

// seedUserData();

// function renderReviews() {
//   Review.find().then(reviews => {
//     reviews.map(review =>
//       items.addOne({ name: review.content, date: review.created })
//     );
//   });
// }

// renderReviews();


router.get('/', (req, res) => {
	const query = req.query;
	// Remember, *never* trust users, *always* validate data
	const list = items.getList(query);
	return res.json(list);
});

router.get('/reviews', (req, res) => {
	console.log('hello1');
	return Review.find()
		.populate('author', ['username'])
		.populate('flick', ['title'])
		.then(result => {
			console.log(result);
			res.json(result);
		});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	return res.json(items.getOne(id));
});
//59f77af2ef2de52021d9ef30
router.post('/', jwtAuth, jsonParser, (req, res) => {
	const requiredFields = ['id', 'content'];
	requiredFields.forEach(field => {
		if (!(field in req.body)) {
			const message = `You are missing required field: ${field}`;
			console.log(message);
			return res.status(400).send(message);
		}
	});
	// Remember, *never* trust users, *always* validate data
	const { content, id } = req.body;
	const { userId } = req.user;
  
	Review.create({
		author: userId,
		flick: id,
		content
	})
		.then(review => {
			console.log(review);
			res.status(201).json(review.apiRepr());
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({ error: 'Something went wrong!!!' });
		});
});

// router.get('/foobar', (req, res, next) => {
//   console.log('next');
//   next();
// }, (req, res) => {
//   console.log('hello1');
//   // return Review.find()
//   //   .populate('author')
//   //   .populate('flick')
//   //   .then(result => {
//   //     console.log(result);
//   //     res.json(result.apiRepr());
//   //   });
// });

router.get('/reviews/:id', (req, res) => {
	console.log('hello2');
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

router.delete('/reviews/:id', jwtAuth, (req, res) => {
	const id = req.params.id;
	Review.findByIdAndRemove(req.params.id).then(() => {
		items.delOne(id);
		res.sendStatus(204);
	});
});

module.exports = { router };
