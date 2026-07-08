const bcrypt = require("bcryptjs");
const _ = require("lodash");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { User, validateUser } = require("../models/user");
const { generateTokens } = require("../utils/token");
const { sendResetEmail, sendVerificationEmail } = require("../utils/mailer");
const {
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../validations/auth.validation");
const { generateOtp } = require("../utils/otp");
const {
  validateVerifyOtp,
  validateResendOtp,
} = require("../validations/auth.validation");

// ── Register ──────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const existing = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Username or email already exists" });

    const user = new User(
      _.pick(req.body, [
        "username",
        "email",
        "password",
        "firstName",
        "lastName",
      ]),
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const { otp, hashedOtp } = generateOtp();
    user.verifyOtp = hashedOtp;
    user.verifyOtpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();
    await sendVerificationEmail(user.email, otp);

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Enter the 6-digit code sent to your email.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// ── Verify Email ──────────────────────────────────────────
exports.verifyEmail = async (req, res) => {
  try {
    const { error, value } = validateVerifyOtp(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const hashedOtp = crypto
      .createHash("sha256")
      .update(value.otp)
      .digest("hex");

    const user = await User.findOne({
      email: value.email,
      verifyOtp: hashedOtp,
      verifyOtpExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });

    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ── Resend Verification Email ─────────────────────────────
exports.resendOtp = async (req, res) => {
  try {
    const { error, value } = validateResendOtp(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const user = await User.findOne({ email: value.email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res
        .status(400)
        .json({ success: false, message: "This email is already verified." });
    if (user.verifyOtpExpires > Date.now())
      return res.status(400).json({
        success: false,
        message:
          "Your current code hasn't expired yet. Please wait before requesting a new one.",
      });

    const { otp, hashedOtp } = generateOtp();
    user.verifyOtp = hashedOtp;
    user.verifyOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user.email, otp);

    res
      .status(200)
      .json({ success: true, message: "A new code has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// ── Login ──────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const user = await User.findOne({ username: req.body.username });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password." });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password." });

    if (!user.isVerified)
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });

    const { accessToken, refreshToken } = generateTokens(user);
    await User.findByIdAndUpdate(user._id, { refreshToken });

    res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// ── Logout ──────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// ── refreshToken ──────────────────────────────────────────
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, message: "Refresh token required" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken)
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });

    const tokens = generateTokens(user);
    await User.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
    });

    res.status(200).json({ success: true, ...tokens });
  } catch (err) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// ── OAuth Callback ──────────────────────────────────────────
exports.oauthCallback = async (req, res) => {
  try {
    if (!req.user)
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);

    const { accessToken, refreshToken } = generateTokens(req.user);
    await User.findByIdAndUpdate(req.user._id, { refreshToken });

    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(`${frontendUrl}?token=${accessToken}&refreshToken=${refreshToken}`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
};

// ── Forgot Password ──────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { error } = validateForgotPassword(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User with given email doesn't exist",
      });
    if (user.oauthProvider)
      return res
        .status(400)
        .json({ success: false, message: "OAuth users cannot reset password" });
    const plainToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${plainToken}`;
    await sendResetEmail(user.email, user.username, resetUrl);

    res
      .status(200)
      .json({ success: true, message: "Reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// ── Reset Password ──────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { error, value } = validateResetPassword({
      token: req.params.token,
      newPassword: req.body.newPassword,
    });
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const hashedToken = crypto
      .createHash("sha256")
      .update(value.token)
      .digest("hex");
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(value.newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
