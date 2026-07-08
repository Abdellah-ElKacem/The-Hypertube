const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    movieId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    parentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: []
    }],
    dislikes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: []
    }],
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;