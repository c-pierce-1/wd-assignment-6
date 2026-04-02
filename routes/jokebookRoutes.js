"use strict";

const express = require('express');
const router = express.Router();
const controller = require('../controllers/jokebookController');

router.get('categories', controller.getCategories);
router.get('/random', controller.getRandomJoke);
router.get('/category/:category', controller.getJokesByCategory);;
router.post('/joke/add', controller.addJoke);

module.exports = router;