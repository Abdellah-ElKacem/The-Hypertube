/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a comment to a movie
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - movieId
 *             properties:
 *               content:
 *                 type: string
 *                 description: Comment content
 *               movieId:
 *                 type: string
 *                 description: IMDb ID of the movie
 *               parentId:
 *                 type: string
 *                 description: Parent comment ID (for replies)
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       404:
 *         description: Movie not found
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get Movie comments
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: movieId
 *         schema:
 *           type: string
 *         description: Filter comments by movie ID
 *     responses:
 *       200:
 *         description: List of comments with author username, date, content and id
 */

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a single comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment with author username, comment id and date posted
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Edit a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated comment content
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment and its replies
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comments/{id}/like:
 *   post:
 *     summary: like a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: comment liked succeddfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comments/{id}/dislike:
 *   post:
 *     summary: dislike a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: comment disliked succeddfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Comment not found
 */