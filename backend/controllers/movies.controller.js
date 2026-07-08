const { User } = require('../models/user');
const { getMovieDetails, getMovieCredits, getImdbId, getTrailerVideo } = require("../services/metadata.service");
const { buildMagnetLink } = require("../services/torrent.service");
const WatchHistory = require("../models/watchHistory");
const Rating = require("../models/Rating");
const Movie = require("../models/movie");
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

const getOrCreateMovieByImdbId = async (imdb_code) => {
	let movie = await Movie.findOne({ imdbId: imdb_code });
	if (!movie) {
		const findResponse = await axios.get(
			`${TMDB_BASE_URL}/find/${imdb_code}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
		);
		if(!findResponse.data || !findResponse.data.movie_results || findResponse.data.movie_results.length === 0) {
			return null; // Movie not found on TMDb
		}
		const tmdbMovie = findResponse.data.movie_results[0];
		let newMovieData = {};
		if (tmdbMovie) {
			// --- CASE A: Found on TMDb ---
			const tmdb_Id = tmdbMovie.id;
			const [details, credits] = await Promise.all([
				getMovieDetails(tmdb_Id),
				getMovieCredits(tmdb_Id)
			]);
			const movieMagnetLinks = await buildMagnetLink(imdb_code);
			if(!movieMagnetLinks)
				movieMagnetLinks = [];
			newMovieData = {
				tmdbId: details.id,
				imdbId: imdb_code,
				movieName: details.title,
				releaseDate: details.release_date,
				posterPath: details.poster_path,
				backdropPath: details.backdrop_path,
				overview: details.overview,
				duration: details.runtime,
				voteAverage: details.vote_average,
				language: details.original_language,
				popularity: details.popularity,
				genres: details.genres ? details.genres.map(g => g.name) : [],
				production_companies: details.production_companies ? details.production_companies.map(c => ({
					logo_path: c.logo_path,
					name: c.name
				})) : [],
				director: credits.director,
				producer: credits.producer,
				cast: credits.cast,
				magnetLinks: movieMagnetLinks
			};
		
		} else {
			// --- CASE B: Fallback to OMDb (IMDb data source) ---
			const omdbResponse = await axios.get(`http://www.omdbapi.com/?i=${imdb_code}&apikey=${OMDB_API_KEY}`);
			if (omdbResponse.data.Response === "False") {
				return null;
			}
			const omdbData = omdbResponse.data;
			const parsedDuration = omdbData.Runtime && omdbData.Runtime !== "N/A"
				? parseInt(omdbData.Runtime.split(' ')[0], 10)
				: 0;
			const parsedPopularity = omdbData.imdbVotes && omdbData.imdbVotes !== "N/A"
				? parseInt(omdbData.imdbVotes.replace(/,/g, ''), 10)
				: 0;
			const movieMagnetLinks = await buildMagnetLink(imdb_code);
			if(!movieMagnetLinks)
				movieMagnetLinks = [];
			newMovieData = {
				tmdbId: 0,
				imdbId: imdb_code,
				movieName: omdbData.Title,
				releaseDate: omdbData.Released,
				posterPath: omdbData.Poster,
				backdropPath: null,
				overview: omdbData.Plot,
				duration: parsedDuration,
				voteAverage: omdbData.imdbRating ,
				language: omdbData.Language,
				popularity: parsedPopularity,
				genres: omdbData.Genre,
				production_companies: omdbData.Production,
				director: omdbData.Director,
				producer: omdbData.Writer,
				cast: omdbData.Actors !== "N/A" ? omdbData.Actors.split(',').map(a => ({ name: a.trim() })) : [],
				magnetLinks: movieMagnetLinks
			};
		}
		// Save whatever dataset we collected (TMDb or OMDb)
		const newMovie = new Movie(newMovieData);
		movie = await newMovie.save();
	}
	return movie;
};

const getMovieById = async (req, res) => {
	try {
		const imdb_code = req.params.id;
		const movie = await getOrCreateMovieByImdbId(imdb_code);

		if (!movie) {
			return res.status(404).json({
				success: false,
				message: "Movie not found on TMDb or OMDb."
			});
		}

		const ratingDoc = await Rating.findOne({ userId: req.user.id, movieId: movie._id });
		const userRating = ratingDoc ? ratingDoc.rating : 0;
		res.status(200).json({ success: true, data: movie, userRating });

	} catch (error) {
		console.error("Error in getMovieById:", error);
		res.status(500).json({ success: false, message: "Something went wrong.", error: error.message });
	}
};


const getMovieTrailer = async (req, res) => {
	try {
		const imdb_code = req.params.id;
		const movie = await Movie.findOne({ imdbId: imdb_code });
		if (!movie)
			return res.status(404).json({ success: false, message: "No movie found." });
		let trailer = movie.trailer_url;
		if (!trailer) {

			trailer = await getTrailerVideo(imdb_code)
			if (!trailer)
				res.status(404).json({ success: false, message: "No trailer found." })
			await Movie.findOneAndUpdate({ trailer_url: trailer })
		}
		res.status(200).json({ success: true, data: trailer })
	} catch (error) {
		res.status(500).json({ success: false, message: "Something went wrong." });
	}
}

/****************** WishList ********************/

const addToWishlist = async (req, res) => {
	try {
		const imdbCode = req.params.id;
		const movie = await getOrCreateMovieByImdbId(imdbCode);
		if (!movie)
			return res.status(404).json({ success: false, message: "Movie not found." });
		await User.findByIdAndUpdate(req.user.id, {
			$addToSet: { wishlist: movie._id }
		});
		res.status(200).json({ success: true, message: "Movie added to wishlist." });
	} catch (error) {
		console.error("Error in addToWishlist:", error);
		res.status(500).json({ success: false, message: "Something went wrong." });
	}
}

const removeFromWishlist = async (req, res) => {
	try {
		const imdbCode = req.params.id;
		const movie = await Movie.findOne({ imdbId: imdbCode });
		if (movie) {
			await User.findByIdAndUpdate(req.user.id, {
				$pull: { wishlist: movie._id }
			});
		}
		res.status(200).json({ success: true, message: "Movie removed from wishlist." });
	} catch (error) {
		console.error("Error in removeFromWishlist:", error);
		res.status(500).json({ success: false, message: "Something went wrong." });
	}
}

const getWishlist = async (req, res) => {
	try {
		// const user = await User.findById(req.user.id).populate('wishlist');
		const {userId} = req.params;
		const user = await User.findById(userId).populate({
			path: 'wishlist',
			select: 'movieName imdbId releaseDate voteAverage posterPath genres overview duration'
		});
		if (!user)
			return res.status(404).json({ success: false, message: "User not found." });
		const cleanWishlist = user.wishlist.map(movie => ({
			title: movie.movieName,
			imdb_code: movie.imdbId,
			year: movie.releaseDate,
			rating: movie.voteAverage,
			poster: movie.posterPath,
			genres: movie.genres,
			summary: movie.overview,
			runtime: movie.duration
		}));
		res.status(200).json({ success: true, data: cleanWishlist });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Something went wrong." });
	}
}

module.exports = {
	getMovieById,
	addToWishlist,
	removeFromWishlist,
	getWishlist,
	getMovieTrailer
};