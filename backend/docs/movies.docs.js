/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *         description: rating
 *       - in: query
 *         name: order_by
 *         schema:
 *           type: string
 *         description: desc or asc
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [rating, year, title]
 *         description: Sort criteria
 *     responses:
 *       200:
 *         description: List of movies
*/

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Movie title to search
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Search results
*/

/**
 * @swagger
 * /movies/top/{genre}:
 *   get:
 *     summary: Get top movies by genre
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre name (e.g. Action, Drama)
 *     responses:
 *       200:
 *         description: Top 10 movies for the genre
 */

/**
 * @swagger
 * /movies/popular:
 *   get:
 *     summary: Get popular movies in leetStream
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trending or most-watched movies in leetStream
 */

/**
 * @swagger
 * /movies/topThisWeek:
 *   get:
 *     summary: Get top movies this week
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top movies this week
 */


/**
 * @swagger
 * /movies/top3movies/{userId}:
 *   get:
 *     summary: Get top 3 movies for a specific user
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique MongoDB ObjectId of the target user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched top 3 rated movies
 *       400:
 *         description: Invalid User ID format
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /movies/history:
 *   get:
 *     summary: Get user History
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of movies the user has previously watched
 */

/**
 * @swagger
 * /movies/landing:
 *   get:
 *     summary: Get landing movies
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of scrolled movies in landing page
 */

/**
 * @swagger
 * /movies/recommendations:
 *   get:
 *     summary: Get movies user may like
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List movies the user may like
 */


/**
 * @swagger
 * /movies/{id}/subtitles:
 *   get:
 *     summary: Get subtitles for a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: IMDb ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subtitles by language
 *       404:
 *         description: No subtitles found
*/

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get movie details
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: IMDb ID (e.g. tt1375666)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
*/


/**
 * @swagger
 * /movies/{id}/similar:
 *   get:
 *     summary: Get similar movies
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: IMDb ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of similar movies
 */

/**
 * @swagger
 * /movies/{id}/watch:
 *   post:
 *     summary: Get magnet links for a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: IMDb ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Magnet links for all qualities
 *       404:
 *         description: No torrents found
 */

/**
 * @swagger
 * /movies/{id}/wishlist:
 *   post:
 *     summary: Add movie to wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: IMDb ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movie added to wishlist
 *   delete:
 *     summary: Remove movie from wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: IMDb ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movie removed from wishlist
 */

/**
 * @swagger
 * /movies/{id}/trailer:
 *   get:
 *     summary: Get trailer for a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: IMDb ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: URL or key for the movie trailer (e.g., YouTube link)
 *       404:
 *         description: Trailer not found
 */


/**
 * @swagger
 * /movies/rate:
 *   post:
 *     summary: Rate a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - ratingValue
 *             properties:
 *               movieId:
 *                 type: string
 *                 description: IMDb ID of the movie
 *               ratingValue:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Rating between 1 and 10
 *     responses:
 *       200:
 *         description: Movie rated successfully
 *       404:
 *         description: Movie not found
 */


/**
 * @swagger
 * /genresRating/{userId}:
 *   get:
 *     summary: Get genres rating
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique MongoDB ObjectId of the target user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: list of genres rating
 *       400:
 *         description: Invalid User ID format
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /wishlist/{userId}:
 *   get:
 *     summary: Get user wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique MongoDB ObjectId of the target user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User wishlist
 */