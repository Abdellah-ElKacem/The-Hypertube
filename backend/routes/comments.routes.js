const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const commentLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many comments, slow down!" }
});

const { 
    addComment,
    getMovieComments,
    getSingelComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment
} = require("../controllers/comments.controller");

const auth = require("../middlewares/auth");

router.post("/comments", auth, commentLimiter, addComment);
router.get("/comments", auth, getMovieComments);
router.get("/comments/:id", auth, getSingelComment);
router.patch("/comments/:id", auth, updateComment);
router.delete("/comments/:id", auth, deleteComment);
router.post("/comments/:id/like", auth, likeComment);
router.post("/comments/:id/dislike", auth, dislikeComment);

module.exports = router;