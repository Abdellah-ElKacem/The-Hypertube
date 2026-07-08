const axios = require('axios');
const Movie = require('../models/movie');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

const getMovieDetails = async (tmdbId) => {
	try {
		const responce = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}`);
		return responce.data
	}
	catch (error) {
		throw new Error(`TMDb API error: ${error.message}`);
	}
}

const getMovieCredits = async (tmdbId) => {
	try {
		const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}`);
		const director = response.data.crew.find(person => person.job === 'Director');
		const producer = response.data.crew.find(person => person.job === 'Producer');
		const cast = response.data.cast.slice(0, 10);
		return {
			director: director ? { name: director.name, picture: director.profile_path } : null,
			producer: producer ? { name: producer.name, picture: producer.profile_path } : null,
			cast: cast.map(actor => ({
				name: actor.name,
				picture: actor.profile_path
		}))
}
	}
	catch (error) {
		console.error(error);
		throw new Error(`TMDb API error: ${error.message}`);
	}
}

const getTrailerVideo = async (imdbId) => {
    try {
        const findResponse = await axios.get(
            `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
        );
        const movieResults = findResponse.data.movie_results[0];
        if (!movieResults || movieResults.length === 0)
            return null;
        const tmdbId = movieResults.id;
        const videoResponse = await axios.get(
            `${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`
        );
        const trailer = videoResponse.data.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (!trailer)
            return null;
        const watchUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        return watchUrl;

    } catch (error) {
        console.error("Error fetching trailer:", error.message);
        throw new Error(`TMDb API error: ${error.message}`);
    }
};

const getImdbId = async (tmdb_Id) => {
	try {
		let movie = await Movie.findOne({ tmdbId: tmdb_Id })
		if (movie)
			return movie.imdbId;
		movie = await getMovieDetails(tmdb_Id);
		return movie.imdb_id;
	} catch (error) {
		throw new Error(`Could not get IMDb ID: ${error.message}`);
	}
}


module.exports = { getMovieDetails, getMovieCredits, getImdbId, getTrailerVideo};