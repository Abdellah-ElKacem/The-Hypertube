const axios = require('axios');
const { response } = require('express');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const YTS_BASE_API_URL = process.env.YTS_BASE_API_URL;

const getMovies = async (page, genre = null, year = null, rating = null, sort, orderBy, featchLimit = 20) => {
	try {
		const sortOptions = {
			'rating':    'rating',
			'year':      'year',
			'title':     'title'
    	};
		// let featchLimit = 20;
		if (sort === 'title' || sort === 'year')
			featchLimit = 50;
		let url = `https://movies-api.accel.li/api/v2/list_movies.json?`;
		url += `&sort_by=${sortOptions[sort] || 'download_count'}`;
		url += `&order_by=${orderBy}`
		url += `&limit=${featchLimit}&page=${page}`;
		if (genre) url += `&genre=${genre}`;
		if (year) url += `&query_term=${year}`;
		const minRating = rating || (sort === 'rating' ? 2 : null);
        if (minRating) url += `&minimum_rating=${minRating}`;
		const response = await axios.get(url);
		let movies = response.data?.data?.movies || [];
		const totalMovies = response.data?.data?.movie_count;
		movies = movies.filter(movie => movie.title && movie.title.trim() !== '' && movie.year && 
    	movie.year !== 0 && movie.medium_cover_image && movie.medium_cover_image.trim() !== '' );
		movies = movies.slice(0, 20);
		return {
			movies: movies.map(movie => ({
				title: movie.title,
				imdb_code: movie.imdb_code,
				year: movie.year,
				rating: movie.rating,
				poster: movie.medium_cover_image,
				genres: movie.genres,
				summary: movie.summary,
				runtime: movie.runtime,
			})),
			totalMovies: totalMovies || 0
		}
	} catch (error) {
		const customError = new Error(error.response?.data?.status_message || error.message);
        customError.status = error.response?.status || 500;
        throw customError;
	}
}

const searchMoviesService = async (title, page) => {
    try {
        const PAGE_SIZE = 20;
        const PAGES_TO_FETCH = 3;
        const tmdbRequests = [];
        for (let p = 1; p <= PAGES_TO_FETCH; p++) {
            tmdbRequests.push(
                axios.get(`${TMDB_BASE_URL}/search/movie`, {
                    params: { api_key: TMDB_API_KEY, query: title, page: p }
                })
            );
        }
        const tmdbResponses = await Promise.all(tmdbRequests);
        let tmdbRaw = [];
        tmdbResponses.forEach(res => {
            tmdbRaw = [...tmdbRaw, ...(res.data?.results || [])];
        });
        tmdbRaw = tmdbRaw.filter(movie =>
            movie.poster_path !== null &&
            movie.video === false
        );
        const tmdbWithImdbId = await Promise.all(
            tmdbRaw.map(async (movie) => {
                try {
                    const detailsResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}`, {
                        params: { api_key: TMDB_API_KEY, append_to_response: 'external_ids' }
                    });
                    return {
                        ...movie,
                        imdb_id: detailsResponse.data?.external_ids?.imdb_id || null,
                        runtime: detailsResponse.data?.runtime || null
                    };
                } catch {
                    return { ...movie, imdb_id: null, runtime: null };
                }
            })
        );
        const tmdbMapped = tmdbWithImdbId.map(movie => ({
            title:     movie.title,
            imdb_code: movie.imdb_id,
            tmdb_id:   movie.id,
            year:      movie.release_date,
            rating:    movie.vote_average,
            poster:    movie.poster_path,
            summary:   movie.overview,
            runtime:   movie.runtime,
            source:    'tmdb'
        }));
        let ytsMapped = [];
        try {
            const ytsRequests = [];
            for (let p = 1; p <= PAGES_TO_FETCH; p++) {
                ytsRequests.push(
                    axios.get(`${YTS_BASE_API_URL}list_movies.json`, {
                        params: { query_term: title, limit: 20, page: p }
                    })
                );
            }
            const ytsResponses = await Promise.all(ytsRequests);

            let ytsRaw = [];
            ytsResponses.forEach(res => {
                ytsRaw = [...ytsRaw, ...(res.data?.data?.movies || [])];
            });

            ytsMapped = ytsRaw
                .filter(movie => movie.medium_cover_image)
                .map(movie => ({
                    title:     movie.title,
                    imdb_code: movie.imdb_code || null,
                    tmdb_id:   null,
                    year:      movie.year ? `${movie.year}-01-01` : null,
                    rating:    movie.rating,
                    poster:    movie.medium_cover_image,
                    summary:   movie.summary,
                    runtime:   movie.runtime,
                    source:    'yts'
                }));
        } catch (err) {
            console.error(`YTS fetch failed during search: ${err.message}`);
        }
        const combined = [...tmdbMapped, ...ytsMapped];
        const seen = new Map();
        combined.forEach(movie => {
            const key = movie.imdb_code
                ? `imdb:${movie.imdb_code}`
                : `title:${movie.title.trim().toLowerCase()}`;

            if (!seen.has(key)) {
                seen.set(key, movie);
            }
        });
        const dedupedMovies = Array.from(seen.values());
        dedupedMovies.sort((a, b) => a.title.localeCompare(b.title));
        const startIndex = (page - 1) * PAGE_SIZE;
        const paginatedMovies = dedupedMovies.slice(startIndex, startIndex + PAGE_SIZE);
        return {
            movies: paginatedMovies,
            totalMovies: dedupedMovies.length,
            totalPages: Math.ceil(dedupedMovies.length / PAGE_SIZE) || 0
        };
    } catch (error) {
        const customError = new Error(error.response?.data?.status_message || error.message);
        customError.status = error.response?.status || 500;
        throw customError;
    }
}
module.exports = { getMovies, searchMoviesService };