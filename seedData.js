'use strict';

require('dotenv').config();
const faker = require('faker');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Movie, Review } = require('./movies/models');
const { User } = require('./users/models');

const users = [];
const userIds = [];
const movieIds = [];
const reviews = [];

function initializeDb() {
    for (let i = 0; i < 10; i++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const username = firstName.slice(0,1).toLowerCase() + lastName.toLowerCase();

        const user = {
            firstName,
            lastName,
            username,
            password: '$2a$10$7FyFDShU8Gt99Feu4Ip74.1J3AvmACWUGh7l.tfK80U05P2Ng87wq'
        };
        
        users.push(user);
    }
    console.log('generateUsers completed');
    return createUsers(users);
}

function createUsers(users) {
    console.log(users);
    return User
        .insertMany(users)
        .then(user => {
            console.log(user);
            user.map(person => {
                userIds.push(person._id);
            });
            console.log('createUsers completed');
            return pullMovies();
        });
}

function pullMovies() {
    console.log('pullMovies is executing');
    return Movie
        .find()
        // .sort({ release_date: -1 })
        .limit(10)
        .then(movies => {
            movies.map(movie => {
                movieIds.push(movie._id);
            });
            console.log(movieIds);
            return generateReviews(movieIds);
        });
}

function generateReviews(movieIds) {
    console.log('generateReviews is executing');
    for (let i = 0; i < 10; i++) {
        const review = {
            content: 'Dieser Film ist Scheiße!',
            flick: movieIds[i],
            author: userIds[i]
        };
        reviews.push(review);
    }
    console.log(reviews);

    return Review
        .insertMany(reviews)
        .then(results => {
            console.log(results);
        })
        .catch(err => console.log(err));
}

mongoose.connect(process.env.DATABASE_URL, { useMongoClient: true })
    .then(() => mongoose.connection.db.dropCollection('reviews'))
    .then(() => mongoose.connection.db.dropCollection('users'))
    .then(() => initializeDb())
    .then(() => mongoose.disconnect());
