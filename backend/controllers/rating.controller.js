const mongoose = require('mongoose');
const Rating = require("../models/Rating.js")
const { User } = require("../models/user.js")
const { getMovies } = require("../services/library.service.js")

const Movie = require("../models/movie.js")

const RateMovie = async (req, res) => {
	try {
		const { movieId, ratingValue } = req.body;
		const userId = req.user.id;
		console.log(movieId, ratingValue);
	if (ratingValue < 0 || ratingValue > 10)
      return res.status(400).json({ success: false, message: "Rating must be between 0 and 10." });
	console.log("hello")
	await Rating.findOneAndUpdate(
		{ userId, movieId },
		{ rating: ratingValue },
		{ upsert: true, returnDocument: 'after' }
	);
	const stats = await Rating.aggregate([
		{ $match: { movieId: new mongoose.Types.ObjectId(movieId)}},
		{
			$group: {
				_id: '$movieId',
				averageRating: { $avg: '$rating' },
				totalRatings: { $sum: 1 }
			}
		}
	]);
	const avgRating = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : Number(ratingValue);
	const totalReviews = stats.length > 0 ? stats[0].totalRatings : 0;
	await Movie.findByIdAndUpdate(movieId, {
		globalRating: avgRating,
		ratingCount: totalReviews
	});
	res.status(200).json({ success: true, message: "Rating saved successfully!", averageRating: avgRating, totalRatings: totalReviews });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Could not found movie." });	
	}
}

const getPopularMovies = async (req, res) => {
	try {
		const popularMovies = await User.aggregate([
			{ $match: { 'watchHistory.0': { $exists: true } } },
			{ $unwind: '$watchHistory' },
			{
				$group: {
					_id: '$watchHistory.movieId',
					watchCount: { $sum: 1 }
				}
			},
			{
				$lookup: {
					from: 'movies',
					localField: '_id',
					foreignField: '_id',
					as: 'movieDetails'
				}
			},
			{ $unwind: '$movieDetails' },
			{
				$sort: {
					watchCount: -1,
					'movieDetails.globalRating': -1
				}
			},
			{ $limit: 10 },
			{
				$project: {
					_id: '$_id',
					title: '$movieDetails.movieName',
					imdb_code: '$movieDetails.imdbId',
					year: '$movieDetails.releaseDate',
					rating: '$movieDetails.globalRating',
					poster: '$movieDetails.posterPath',
					genres: '$movieDetails.genres',
					summary: '$movieDetails.overview',
					runtime: '$movieDetails.duration',
				}
			}
		]);
		if (!popularMovies || popularMovies.length === 0) {
			const defaultPopularMovies = await getMovies(1, null, null, null, 'download_count', 'desc', 10);
			return res.status(200).json({ success: true, data: defaultPopularMovies });
		}
		res.status(200).json({ success: true, data: popularMovies });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Could not fetch popular movies." });
	}
};

const Top3RatedMovies = async (req, res) => {
	try{
		const {userId} = req.params;
		console.log(`this is the userId: ${userId}`);
		if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ success: false, message: "Invalid User ID format." });
		const topMovies = await Rating.aggregate([
			{$match: {userId : new mongoose.Types.ObjectId(userId)}},
			{$sort: { rating: -1 }},
			{$limit: 3 },
			{
				$lookup:{
					from: 'movies',
					localField: 'movieId',
					foreignField: '_id',
					as: 'movieDetails'
				},
			},
			{$unwind: '$movieDetails'}, 
			{
				$project:{
					_id: '$_id',
					title: '$movieDetails.movieName',
					imdb_code: '$movieDetails.imdbId',
					year: '$movieDetails.releaseDate',
					rating: '$movieDetails.globalRating',
					poster: '$movieDetails.posterPath',
					genres: '$movieDetails.genres',
					summary: '$movieDetails.overview',
					runtime: '$movieDetails.duration',
				}
			}
		])
		console.log(`this is the 3 movies: ${topMovies}`);
		res.status(200).json({ success: true, data:topMovies, message: "top rated movies geted successfuly" });
	} catch (error){
		console.error(error.message);
		res.status(500).json({ success: false, message: "Could not fetch top movies." });
	}
}

const getTopRatedGenres = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid User ID format." });
        }
        const staticGenres = [
            "Action", "Adventure", "Animation", "Comedy", "Crime", 
            "Documentary", "Drama", "Family", "Fantasy", "History", 
            "Horror", "Music", "Mystery", "Romance", "Sci-Fi", 
            "Thriller", "War", "Western"
        ];
        const genreMap = {};
        staticGenres.forEach(genre => {
            genreMap[genre] = {
                genre: genre,
                averageRating: 0,
                movieCount: 0
            };
        });

        const aggregatedGenres = await Rating.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'movies',
                    localField: 'movieId',
                    foreignField: '_id',
                    as: 'movie'
                },
            },
            { $unwind: '$movie' },
            { $unwind: '$movie.genres' },
            {
                $group: {
                    _id: "$movie.genres",
                    averageRating: { $avg: "$rating" },
                    movieCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    genre: '$_id',
                    averageRating: { $round: ['$averageRating', 1] },
                    movieCount: '$movieCount'
                }
            }
        ]);
        aggregatedGenres.forEach(item => {
            if (genreMap[item.genre]) {
                genreMap[item.genre].averageRating = item.averageRating;
                genreMap[item.genre].movieCount = item.movieCount;
            }
        });
        const finalGenresList = Object.values(genreMap).sort((a, b) => b.averageRating - a.averageRating);
        return res.status(200).json({ success: true, data: finalGenresList });
    } catch (error) {
        console.error("Error in getTopRatedGenres:", error.message);
        return res.status(500).json({ success: false, message: "Could not fetch top rated genres." });
    }
};

module.exports = { RateMovie, getPopularMovies, Top3RatedMovies, getTopRatedGenres};