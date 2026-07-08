const Movie = require('../models/movie');
const { User } = require('../models/user')
const mongoose = require('mongoose');

const {getSimilarMovies, getTopByGenre, getLandingMoviesService, getTopMoviesThisWeek} = require("../services/recommendation.service");


const getSimilar = async (req, res) => {
    try {
        const { id } = req.params;
        const similar = await getSimilarMovies(id);
        res.status(200).json({ success: true, data: similar });
    } catch (error) {
        const statusCode = error.status || 404;
        res.status(statusCode).json({ 
            success: false, 
            message: `TMDb Error: ${error.message}` 
        });
    }
}

const getTopMoviesByGenre = async (req, res) => {
    try {
        const { genre } = req.params;
        const movies = await getTopByGenre(genre);
        res.status(200).json({ success: true, data: movies });
    } catch (error) {
        const statusCode = error.status || 404;
        res.status(statusCode).json({ 
            success: false, 
            message: `TMDb Error: ${error.message}` 
        });
    }
}


const getUserHistory = async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).populate({
            path: "watchHistory.movieId",
    		select: 'movieName imdbId releaseDate voteAverage posterPath genres overview duration'
        });
        if(!user)
            res.status(404).json({ success: false, message: "user not found" });
        const userHistory = user.watchHistory
        .filter(item => item.movieId !== null)
        .map(movie => ({
            title: movie.movieId.movieName,
			imdb_code: movie.movieId.imdbId,
			year: movie.movieId.releaseDate,
            rating: movie.movieId.voteAverage,
            poster: movie.movieId.posterPath,
			genres: movie.movieId.genres,
			summary: movie.movieId.overview,
			runtime: movie.movieId.duration,
            progress: movie.progress
        }));
        res.status(200).json({success: true, data: userHistory})
    } catch (error){
        res.status(500).json({ success: false, message: "Something went wrong." });

    }
}

const topMoviesThisWeek = async (req, res) => {
    try {
        const movies = await getTopMoviesThisWeek();
        res.status(200).json({ success: true, data: movies });
    } catch (error) {
       const statusCode = error.status || 404;
        res.status(statusCode).json({ 
            success: false, 
            message: `TMDb Error: ${error.message}` 
        });
    }
}

const getlandingMovies = async (req, res) =>{
    try {
        const movies = await getLandingMoviesService();
        if (!movies || movies.length === 0) {
            return res.status(404).json({ success: false, message: "No movies found" });
        }
        res.status(200).json({ success: true, data: movies });
    } catch (error){
         const statusCode = error.status || 404;
        res.status(statusCode).json({ 
            success: false, 
            message: `TMDb Error: ${error.message}` 
        });
    }
}

const moviesUserMayLike = async (req, res) =>{
   try{
        const userId = req.user.id;
       const mostWatchedGenreResult = await User.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(userId) }},
            {
                $lookup:{
                    from: 'movies',
                    localField: 'watchHistory.movieId',
                    foreignField: '_id',
                    as: 'movie'
                },
            },
            {$unwind: '$movie'},
            {$unwind: '$movie.genres'},
            {$group:
                {
                    _id:"$movie.genres",
                    watchCount:{$sum: 1}
                }
            },
            {$sort: {watchCount: -1}},
            {$limit: 1}
        ])
        let favoriteGenre = "";
        if (mostWatchedGenreResult && mostWatchedGenreResult.length > 0) {
            favoriteGenre = mostWatchedGenreResult[0]._id;
        }
        const movies = await getTopByGenre(favoriteGenre, 10);
        res.status(200).json({ success: true, data: movies });
    } catch(error){
        const statusCode = error.status || 404;
        res.status(statusCode).json({ 
            success: false, 
            message: `TMDb Error: ${error.message}` 
        });
    }
}

module.exports = {
    getSimilar,
    getTopMoviesByGenre,
    getUserHistory,
    getlandingMovies,
    moviesUserMayLike,
    topMoviesThisWeek
};