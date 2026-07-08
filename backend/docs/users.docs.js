/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the currently authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665f1a2b3c4d5e6f7a8b9c0d
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     avatar:
 *                       type: string
 *                       example: http://localhost:3000/uploads/avatars/photo.jpg
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users (username, firstName, lastName, avatar)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   avatar:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No users found
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by their ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *         example: 665f1a2b3c4d5e6f7a8b9c0d
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/update:
 *   patch:
 *     summary: Update the authenticated user's profile (username, name, email, avatar)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newusername
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               currentPassword:
 *                 type: string
 *                 description: Required only when changing email
 *                 example: Secret123!
 *               avatar:
 *                 description: Avatar URL, "delete" to remove, or binary file upload
 *                 oneOf:
 *                  - type: string
 *                    example: https://example.com/avatar.png
 *                  - type: string
 *                    format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       400:
 *         description: Validation error, username/email taken, or incorrect password
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/cover-picture:
 *   patch:
 *     summary: Update the authenticated user's cover picture preference
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coverPicture
 *             properties:
 *               coverPicture:
 *                 type: string
 *                 enum: [default, cyber, cinema, marquee, cosmic]
 *                 example: cyber
 *     responses:
 *       200:
 *         description: Cover picture updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/updatePassword:
 *   patch:
 *     summary: Change the authenticated user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: Secret123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewSecret456!
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password updated successfully.
 *       400:
 *         description: Validation error, incorrect current password, or OAuth user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /users/{id}/badges:
 *   get:
 *     summary: Get user badges based on activity
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User badges and stats
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /users/updateVideoStreaming:
 *   patch:
 *     summary: Update the authenticated user's video streaming preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quality:
 *                 type: string
 *                 enum: [2160p, 1080p, 720p, 480p]
 *                 example: 1080p
 *               subtitle:
 *                 type: string
 *                 enum: [en, fr, es, ar, de, it, pt, ru, zh, ja, ko, nl]
 *                 example: en
 *           examples:
 *             qualityOnly:
 *               summary: Update only video quality
 *               value:
 *                 quality: 720p
 *             subtitleOnly:
 *               summary: Update only subtitle language
 *               value:
 *                 subtitle: fr
 *             both:
 *               summary: Update both preferences
 *               value:
 *                 quality: 1080p
 *                 subtitle: en
 *     responses:
 *       200:
 *         description: Video streaming preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Video streaming updated successfully.
 *       400:
 *         description: Invalid request body, missing preferences, or invalid preference values
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
