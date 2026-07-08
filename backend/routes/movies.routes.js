const express = require('express');
const router = express.Router();
const { getMovieById, getMovieTrailer } = require("../controllers/movies.controller");
const { getallmovies, searchMovies } = require("../controllers/library.controller");
const {getSimilar, getTopMoviesByGenre, getUserHistory, getlandingMovies, moviesUserMayLike, topMoviesThisWeek} = require("../controllers/recommendation.controller");
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controllers/movies.controller");
// const { getMovieSubtitles } = require("../controllers/subtitle.controller");
const { RateMovie, getPopularMovies, Top3RatedMovies, getTopRatedGenres } = require("../controllers/rating.controller");
const auth = require("../middlewares/auth");


router.get("/movies", auth, getallmovies);
router.get("/search",auth, searchMovies);
router.get("/movies/landing", getlandingMovies)

router.get("/movies/top/:genre", auth, getTopMoviesByGenre);
router.get("/movies/recommendations", auth, moviesUserMayLike);
router.get('/movies/popular', getPopularMovies);
router.get("/movies/topThisWeek", topMoviesThisWeek);
router.get('/movies/top3movies/:userId', auth, Top3RatedMovies);
router.get("/movies/history", auth, getUserHistory)

router.get("/movies/:id",auth, getMovieById);
router.get("/movies/:id/similar", auth, getSimilar);
// router.post("/movies/:id/watch", auth, getMagnetLink);
router.post("/movies/:id/wishlist", auth,  addToWishlist);
router.delete("/movies/:id/wishlist", auth, removeFromWishlist);
router.get("/movies/:id/trailer", auth, getMovieTrailer);


router.post('/movies/rate', auth, RateMovie);
router.get("/genresRating/:userId", auth, getTopRatedGenres)
router.get("/wishlist/:userId", auth, getWishlist);

module.exports = router;