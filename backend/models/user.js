// models/user.js
const mongoose = require("mongoose");
const Joi = require("joi");
const Movie = require("./movie");
const Comment = require("./comment");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
    unique: true, // MongoDB throws an error after insertion attempt.
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  password: {
    type: String,
  }, // null for OAuth users
  refreshToken: {
    type: String,
    default: null,
  },
  // ── Password reset ────────────────────────────────────────────────────────
  resetToken: {
    type: String,
  },
  resetTokenExpires: {
    type: Date,
  },
  // ── Email verification ────────────────────────────────────────────────────
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyOtp: {
    type: String,
  },
  verifyOtpExpires: {
    type: Date,
  },
  // ── OAuth ─────────────────────────────────────────────────────────────────
  oauthProvider: {
    type: String,
  }, // '42', 'google', etc.
  oauthId: {
    type: String,
  },
  // ── User preferences ─────────────────────────────────────────────────────
  qualityPreference: {
    type: String,
    enum: ["2160p", "1080p", "720p", "480p"],
    default: "1080p",
  },
  subtitlePreference: {
    type: String,
    enum: [
      "en",
      "fr",
      "es",
      "ar",
      "de",
      "it",
      "pt",
      "ru",
      "zh",
      "ja",
      "ko",
      "nl",
    ],
    default: "en",
  },
  coverPicturePreference: {
    type: String,
    enum: ["default", "cyber", "cinema", "marquee", "cosmic"],
    default: "default",
  },

  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],

  watchHistory: [
    {
      movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
      },
      progress: {
        type: Number,
        default: 0,
      },
    },
  ],

  likedComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  dislikedComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string()
      .pattern(/^[A-Za-z][A-Za-z0-9_]*$/)
      .min(2)
      .max(15)
      .required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string()
      .min(8)
      .max(255)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
      .message(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      )
      .required(),
    firstName: Joi.string().min(2).max(15).pattern(/^[A-Za-z]+$/).required(),
    lastName: Joi.string().min(2).max(15).pattern(/^[A-Za-z]+$/).required(),
  });

  return schema.validate(user);
}

const User = mongoose.model("user", userSchema);

module.exports.User = User;
module.exports.validateUser = validateUser;
