const { string } = require('joi');
const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    tmdbId:{
        type: Number,
        required: false,
        // unique: true
    },
    imdbId:{
        type: String,
        required: true,
        unique: true
    },
    movieName:{
        type: String,
        required: true
    },
    releaseDate:{
        type: Date
    },
    posterPath:{
        type: String
    },
    backdropPath:{
        type: String
    },
    overview:{
        type: String
    },
    duration:{
        type: Number
    },
    voteAverage:{
        type: Number
    },
    language:{
        type: String
    },
    popularity:{
        type: Number
    },
    genres:{
        type: [String]
    },
    director:{
        name: String,
        picture: String
    },
    producer:{
        name: String,
        picture: String
    },
    cast: [{
        name: String,
        picture: String
    }],
    production_companies:[{
        logo_path: String,
        name: String
    }],

    trailer_url:{
        type: String
    },
    magnetLinks: [{
        quality:    String,
        size:       String,
        seeds:      Number,
        magnetLink: String,
        magType: String,
		video_codec: String,
    }],
    filePath:{
        type: String
    },
    fileSize:{
        type: Number
    },
    isDownloaded:{
        type: Boolean,
        default: false
    },
    lastWatchedAt:{
        type: Date
    },

    // Subtitles
    subtitles: [{
        language: String,
        // filePath: String,
        downloadLink: String,
        fileId: Number
    }],

    globalRating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },

}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;