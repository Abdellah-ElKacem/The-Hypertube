const { searchMoviesService, getMovies } = require("../services/library.service")

const getallmovies = async (req, res) => {
	try {
		const page = req.query.page || 1;
		const genre = req.query.genre || null;
		let year = req.query.year || null;
		const rating = req.query.rating || null;
		const sort = req.query.sort || 'download_count';
		const order = req.query.order_by || 'desc'
		const result = await getMovies(page, genre, year, rating, sort, order);
		res.status(200).json({
            success: true,
            data: result.movies,
            currentpage: page,
            totalpages: Math.ceil(result.totalMovies / 20)
        });
	} catch (error) {
		 const statusCode = error.status || 404;
        res.status(statusCode).json({
            success: false, 
            message: `Movies API Error: ${error.message}` 
        });
		// res.status(500).json({ success: false, message: "Something went wrong." });
	}
}

const searchMovies = async (req, res) => {
	try {
		const title = req.query.q;
		const page = req.query.page || 1;
		const result = await searchMoviesService(title, page);
		res.status(200).json({
            success: true,
            data: result.movies,
            currentpage: page,
            totalpages: Math.ceil(result.totalMovies / 20)
        });
	}catch (error) {
		 const statusCode = error.status || 404;
        res.status(statusCode).json({
            success: false, 
            message: `Movies API Error: ${error.message}` 
        });
	}
}

module.exports = { getallmovies, searchMovies };