const axios = require('axios');
const Movie = require('../models/movie');
const Rating = require("../models/Rating.js")

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

const TMDB_GENRE_MAP = {
    28:    "Action",
    12:    "Adventure",
    16:    "Animation",
    35:    "Comedy",
    80:    "Crime",
    99:    "Documentary",
    18:    "Drama",
    10751: "Family",
    14:    "Fantasy",
    36:    "History",
    27:    "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878:   "Science Fiction",
    10770: "TV Movie",
    53:    "Thriller",
    10752: "War",
    37:    "Western"
};

const getSimilarMovies = async (imdbId, limit = 10) => {
    try {
        const findResponse = await axios.get(`${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`);
        const tmdbMovie = findResponse.data?.movie_results?.[0];
        if (!tmdbMovie) {
            console.log(`Movie not found on TMDB for IMDb ID: ${imdbId}`);
            return [];
        }
        const tmdbId = tmdbMovie.id
        const recommendationsResponse = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}/recommendations?api_key=${TMDB_API_KEY}`);
        const suggestedMovies = recommendationsResponse.data?.results || [];
        const limitedSuggestions = suggestedMovies.slice(0, limit);
        const detailedMovies = await Promise.all(
            limitedSuggestions.map(async (movie) => {
                try {
                    const detailRes = await axios.get(
                        `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`
                    );
                    return {
                        ...movie,
                        imdb_code: detailRes.data?.imdb_id || null,
                        runtime: detailRes.data?.runtime,
                        genres: detailRes.data?.genres
                    };
                } catch (err) {
                    return { ...movie, imdb_code: null };
                }
            })
        );
        return detailedMovies.map(movie => ({
            title:     movie.title,
            imdb_code: movie.imdb_code,
            tmdb_id:   movie.id,
            year:      movie.release_date,
            rating:    movie.vote_average,
            poster:    movie.poster_path,
            summary:   movie.overview,
            popularity: movie.popularity,
            runtime:    movie.runtime,
            genres:    (movie.genre_ids || []).map(id => TMDB_GENRE_MAP[id]).filter(Boolean),
        }));

    } catch (error) {
        console.error("TMDB Recommendations Fetch Error:", error);
        throw new Error(`Failed to retrieve similar movies from TMDB: ${error.message}`);
    }
};

const getTopByGenre = async (genre, limit = 10) => {
    try {
        const genreEntry = Object.entries(TMDB_GENRE_MAP).find(
            ([id, name]) => name.toLowerCase() === genre.toLowerCase()
        );
        const genreId = genreEntry ? genreEntry[0] : null;
        const params = {
            api_key: TMDB_API_KEY,
            sort_by: 'vote_average.desc',
            'vote_count.gte': 200, 
            page: 1
        };
        if (genreId) {
            params.with_genres = genreId;
        }
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params });
        const tmdbMovies = (response.data?.results || []).slice(0, limit);
        const detailedMovies = await Promise.all(
            tmdbMovies.map(async (movie) => {
                try {
                    const detailRes = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}`, {
                        params: { 
                            api_key: TMDB_API_KEY,
                            append_to_response: 'external_ids'
                        }
                    });
                    const details = detailRes.data;
                    return {
                        title:     details.title,
                        imdb_code: details.external_ids?.imdb_id || null,
                        year:      details.release_date,
                        rating:    details.vote_average,
                        poster:    details.poster_path,
                        genres:    details.genres ? details.genres.map(g => g.name) : [],
                        summary:   details.overview,
                        runtime:   details.runtime || 0,
                        popularity: details.popularity || 0
                    };
                } catch (error) {
                    console.error(`Failed to fetch details for TMDB ID ${movie.id}:`, error.message);
                    return null;
                }
            })
        );

        return detailedMovies.filter(movie => movie !== null);

    } catch (error) {
        throw new Error(`TMDb API discover error: ${error.message}`);
    }
}


const getTopMoviesThisWeek = async () => {
    try {
        console.log("Fetching top movies this week from TMDb...");
        const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
        params: {
            api_key: TMDB_API_KEY,
            page: 1
         }
    });
    const movies = response.data?.results || [];
    console.log("Movies This Week:", movies.map(m => m.title));
    if (movies.length === 0) return [];
     const detailedMovies = await Promise.all(
            movies.map(async (movie) => {
                try {
                    const detailRes = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}`, {
                        params: { 
                            api_key: TMDB_API_KEY,
                            append_to_response: 'external_ids'
                        }
                    });
                    const details = detailRes.data;
                    return {
                        title:     details.title,
                        imdb_code: details.external_ids?.imdb_id || null,
                        year:      details.release_date,
                        rating:    details.vote_average,
                        poster:    details.poster_path,
                        genres:    details.genres ? details.genres.map(g => g.name) : [],
                        summary:   details.overview,
                        runtime:   details.runtime || 0,
                        popularity: details.popularity || 0
                    };
                    console.log("Detailed Movies This Week:", details.title);
                } catch (error) {
                    console.error(`Failed to fetch details for TMDB ID ${movie.id}:`, error.message);
                    return null;
                }
            })
        );
        return detailedMovies.filter(movie => movie !== null);
    } catch (error) {
        throw new Error(`TMDb API error: ${error.message}`);
    }
}

const getLandingMoviesService = async () => {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
        params: { api_key: TMDB_API_KEY }
    });
    const movies = response.data?.results || [];
    if (movies.length === 0) return [];
    const featuredMovies = movies.slice(0, 10);
    const listMovies = await Promise.all(
        featuredMovies.map(async (movie) => {
            try {
                const detailRes = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}`, {
                    params: {
                        api_key: TMDB_API_KEY,
                        append_to_response: 'credits'
                    }
                });
                const castArray = detailRes.data?.credits?.cast || [];
                return {
                    title:      movie.title,
                    imdb_code:  detailRes.data?.imdb_id || null,
                    tmdb_id:    movie.id,
                    year:       movie.release_date,
                    rating:     movie.vote_average,
                    popularity: movie.popularity,
                    poster:     movie.poster_path,
                    backdrop:   movie.backdrop_path,
                    summary:    movie.overview,
                    runtime:    detailRes.data?.runtime || null,
                    genres:     (movie.genre_ids || []).map(id => TMDB_GENRE_MAP[id]).filter(Boolean),
                    cast:       castArray.slice(0, 10).map(actor => ({
                        name:      actor.name,
                        character: actor.character,
                        picture:   actor.profile_path
                    }))
                };
            } catch (err) {
                 throw new Error(`YTS API error: ${error.message}`);
            }
        })
    );
    return listMovies;
}

module.exports = { getSimilarMovies, getTopByGenre, getLandingMoviesService, getTopMoviesThisWeek };