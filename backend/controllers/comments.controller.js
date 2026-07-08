const Comment = require('../models/comment');
const Movie = require('../models/movie');
const { User } = require('../models/user');

const addComment = async (req, res) => {
    try {
        const movieId = req.body.movieId;
        let  content = req.body.content;
        const userId = req.user.id;
        const allowedCharactersRegex = /^[a-zA-Z0-9\s.,!?''"\-_+@]+$/;
        const parentId = req.body.parentId || null;
        content = req.body.content?.trim().slice(0, 500);
        if (!allowedCharactersRegex.test(content)) {
            return res.status(400).json({ 
                success: false, 
                message: "Comment contains forbidden characters. Only letters, numbers, and basic punctuation are allowed." 
            });
        }
        if (!content)
            return res.status(400).json({ success: false, message: "Comment cannot be empty." });
        if (parentId) {
            const parentComment = await Comment.findById(parentId);
            if (!parentComment) 
                return res.status(404).json({success: false, message: "Parent comment not found."});
        }
        if (!movieId)
            return res.status(404).json({ success: false, message: "Movie ID not found." });
        const movie = await Movie.findOne({ _id: movieId });
        if (!movie)
            return res.status(404).json({ success: false, message: "Movie not found." });
        const comment = new Comment({
            content,
            userId,
            movieId: movie._id,
            parentId
        });
        await comment.save();
        res.status(201).json({ success: true, message: "Comment added successfully.", data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
}

const getMovieComments = async (req, res) => {
    try {
        const { movieId } = req.query; 
        const allComments = await Comment.find({movieId: movieId })
        .populate('userId', 'firstName lastName avatar')
        .sort({ createdAt: -1 });
        const commentMap = {};
        allComments.forEach(comment => {
            commentMap[comment._id] = { ...comment._doc, replies: [] };
        });
        const rootComments = [];
        Object.values(commentMap).forEach(comment => {
            if (comment.parentId) {
                if (commentMap[comment.parentId]) {
                    commentMap[comment.parentId].replies.push(comment);
                }
            } else {
                rootComments.push(comment);
            }
        });
        res.status(200).json({ success: true, data: rootComments });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

const getSingelComment = async(req, res) => {
    try{
        const  commentId  = req.params.id;
        const comment = await Comment.findById(commentId)
                .populate('userId', 'firstName lastName avatar')

        if (!comment)
           return res.status(404).json({success: false, message: "no comment found"});
        res.status(200).json({success: true, data: comment})
    } catch(error){
        console.error(error.message)
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
}

const updateComment = async (req, res) =>{
    try{
        const commentId = req.params.id;
        const NewComment = req.body.content;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId)
        if(!comment)
            return res.status(404).json({success: false, message: "no comment found"});
        if(comment.userId.toString() !== userId)
            return res.status(404).json({success: false, message: "Access denied. You can only edit your own comments."});
        comment.content = NewComment;
        await comment.save();
        res.status(200).json({success: true, message: "comment updated successfully"})
    } catch{
        console.error(error.message)
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
}

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);
        if (!comment)
            return res.status(404).json({ success: false, message: "Comment not found." });
        if (comment.userId.toString() !== userId)
            return res.status(403).json({ success: false, message: "Access denied. You can only delete your own comments." });
        await Comment.deleteMany({ parentId: commentId });
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ success: true, message: "Comment removed successfully."});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

const likeComment = async (req, res) => {
    try{
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);
        if (!comment)
            return res.status(404).json({success: false, message: "comment not found"});

        const isLiked = comment.likes && comment.likes.includes(userId);

        if (isLiked) {
            await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { likedComments: commentId } });
            res.status(200).json({ success: true, message: "Comment unliked successfully."});
        } else {
            await Comment.findByIdAndUpdate(commentId, {
                $addToSet: { likes: userId },
                $pull: { dislikes: userId }
            });
            await User.findByIdAndUpdate(userId, {
                $addToSet: { likedComments: commentId },
                $pull: { dislikedComments: commentId }
            });
            res.status(200).json({ success: true, message: "Comment liked successfully."});
        }
    } catch(error){
         console.error(error.message);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
}

const dislikeComment = async (req, res) => {
    try{
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);
        if (!comment)
            return res.status(404).json({success: false, message: "comment not found"});

        const isDisliked = comment.dislikes && comment.dislikes.includes(userId);

        if (isDisliked) {
            await Comment.findByIdAndUpdate(commentId, { $pull: { dislikes: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { dislikedComments: commentId } });
            res.status(200).json({ success: true, message: "Comment undisliked successfully."});
        } else {
            await Comment.findByIdAndUpdate(commentId, {
                $addToSet: { dislikes: userId },
                $pull: { likes: userId }
            });
            await User.findByIdAndUpdate(userId, {
                $addToSet: { dislikedComments: commentId },
                $pull: { likedComments: commentId }
            });
            res.status(200).json({ success: true, message: "Comment disliked successfully."});
        }
    } catch(error){
         console.error(error.message);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
}

module.exports = {
    addComment,
    getMovieComments,
    getSingelComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment
}
