const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");

const { User } = require("../models/user");
const { validateUpdatePassword } = require("../validations/users.validation");
const { sendVerificationEmail } = require("../utils/mailer");
const { generateOtp } = require("../utils/otp");

exports.updateUser = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });

    const updates = {};
    const currentUser = await User.findById(req.user.id);
    if (!currentUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (req.body.username) {
      const existing = await User.findOne({
        username: req.body.username,
        _id: { $ne: req.user.id },
      });
      if (existing)
        return res
          .status(400)
          .json({ success: false, message: "Username already in use" });
      if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(req.body.username)) {
        return res.status(400).json({
          success: false,
          message:
            "Username must start with a letter and contain only letters, numbers, and underscores.",
        });
      }
      if (req.body.username.length < 2 || req.body.username.length > 15)
        return res.status(400).json({
          success: false,
          message: "Username must be between 2 and 15 characters long",
        });
      if (req.body.username === currentUser.username) {
        return res.status(400).json({
          success: false,
          message: "New username cannot be the same as the current username",
        });
      }
      updates.username = req.body.username;
    }
    let emailOtp = null;
    if (req.body.email) {
      const normalizedEmail = req.body.email.toLowerCase();
      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user.id },
      });
      if (existing)
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      if (normalizedEmail.length > 255)
        return res.status(400).json({
          success: false,
          message: "Email must not be more than 255 characters long",
        });
      if (normalizedEmail === currentUser.email) {
        return res.status(400).json({
          success: false,
          message: "New email cannot be the same as the current email",
        });
      }

      if (!validator.isEmail(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      if (currentUser.oauthProvider)
        return res
          .status(400)
          .json({ success: false, message: "OAuth users cannot change email" });
      if (!req.body.currentPassword)
        return res.status(400).json({
          success: false,
          message: "currentPassword required to change email",
        });
      const match = await bcrypt.compare(
        req.body.currentPassword,
        currentUser.password,
      );
      if (!match)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect password" });

      updates.email = normalizedEmail;
      updates.isVerified = false;
      const { otp, hashedOtp } = generateOtp();
      emailOtp = otp;
      updates.verifyOtp = hashedOtp;
      updates.verifyOtpExpires = Date.now() + 10 * 60 * 1000;
    }
    if (req.body.firstName) {
      if (req.body.firstName.length < 2 || req.body.firstName.length > 15)
        return res.status(400).json({
          success: false,
          message: "First name must be between 2 and 15 characters long",
        });
      if (/^[A-Za-z]+$/.test(req.body.firstName) === false) {
        return res.status(400).json({
          success: false,
          message: "First name must contain only letters",
        });
      }
      if (req.body.firstName === currentUser.firstName) {
        return res.status(400).json({
          success: false,
          message:
            "New first name cannot be the same as the current first name",
        });
      }
      updates.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      if (req.body.lastName.length < 2 || req.body.lastName.length > 15)
        return res.status(400).json({
          success: false,
          message: "Last name must be between 2 and 15 characters long",
        });
      if (/^[A-Za-z]+$/.test(req.body.lastName) === false) {
        return res.status(400).json({
          success: false,
          message: "Last name must contain only letters",
        });
      }
      if (req.body.lastName === currentUser.lastName) {
        return res.status(400).json({
          success: false,
          message: "New last name cannot be the same as the current last name",
        });
      }
      updates.lastName = req.body.lastName;
    }

    if (req.file) {
      updates.avatar = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;
    } else if (req.body.avatar === "delete") {
      updates.avatar = null;
    } else if (req.body.avatar) {
      updates.avatar = req.body.avatar;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }


    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    ).select("username firstName lastName email avatar");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    if (updates.email) {
      await sendVerificationEmail(updates.email, emailOtp);
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    const { error } = validateUpdatePassword(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    if (user.oauthProvider)
      return res.status(400).json({
        success: false,
        message: "OAuth users cannot update password.",
      });
    const { oldPassword, newPassword } = req.body;
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    if (oldPassword === newPassword)
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the current password",
      });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCoverPicture = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });

    const coverPicturePreference = req.body.coverPicture;

    if (!coverPicturePreference)
      return res.status(400).json({
        success: false,
        message: "coverPicturePreference is required",
      });

    const allowedPreferences = [
      "default",
      "cyber",
      "cinema",
      "marquee",
      "cosmic",
    ];
    if (!allowedPreferences.includes(coverPicturePreference))
      return res.status(400).json({
        success: false,
        message: "Invalid cover picture preference",
      });

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (coverPicturePreference === user.coverPicturePreference) {
      return res.status(400).json({
        success: false,
        message:
          "New cover picture preference cannot be the same as the current one",
      });
    }

    user.coverPicturePreference = coverPicturePreference;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cover picture updated successfully.",
      coverPicturePreference: user.coverPicturePreference,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id format",
      });
    }
    const user = await User.findById(req.params.id).select(
      "username firstName lastName avatar coverPicturePreference",
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select(
      "username firstName lastName email avatar oauthProvider isVerified qualityPreference subtitlePreference coverPicturePreference",
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "username firstName lastName avatar",
    );
    if (users.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVideoStreaming = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ success: false, message: "Invalid request body" });

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });


    const { quality, subtitle } = req.body;

    if (!quality && !subtitle) {
      return res.status(400).json({
        success: false,
        message: "At least one preference must be provided",
      });
    }

    if (quality) {
      if (quality === user.qualityPreference) {
        return res.status(400).json({
          success: false,
          message:
            "New quality preference cannot be the same as the current one",
        });
      }
      const allowedQualities = ["2160p", "1080p", "720p", "480p"];
      if (!allowedQualities.includes(quality)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid video quality option" });
      }
      user.qualityPreference = quality;
    }

    if (subtitle) {
      if (subtitle === user.subtitlePreference) {
        return res.status(400).json({
          success: false,
          message:
            "New subtitle preference cannot be the same as the current one",
        });
      }
      const allowedSubtitles = [
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
      ];
      if (!allowedSubtitles.includes(subtitle)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subtitle preference option",
        });
      }
      user.subtitlePreference = subtitle;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Video streaming updated successfully.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
