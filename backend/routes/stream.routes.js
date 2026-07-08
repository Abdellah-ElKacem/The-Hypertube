const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Movie = require('../models/movie');
const { streamMovie } = require('../controllers/stream.controller');
const auth = require('../middlewares/auth');


router.get('/:movieId', auth, streamMovie);

module.exports = router;