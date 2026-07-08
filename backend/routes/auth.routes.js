const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const oauthCallbackHandler = require("../middlewares/oauthCallbackHandler");
const passport = require("../config/passport");
const controller = require("../controllers/auth.controller");
const {
  loginLimiter,
  emailLimiter,
  registerLimiter,
  refreshLimiter,
} = require("../middlewares/rateLimiter");

router.post("/register", registerLimiter, controller.register);
router.post("/login", loginLimiter, controller.login);
router.post("/logout", auth, controller.logout);
router.post("/refresh", refreshLimiter, controller.refreshToken);
router.get("/42", passport.authenticate("42"));
router.get("/42/callback", oauthCallbackHandler("42"), controller.oauthCallback);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", oauthCallbackHandler("google"), controller.oauthCallback);
router.post("/forgot-password", emailLimiter, controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);

router.post("/verify-email", loginLimiter, controller.verifyEmail);
router.post("/resend-otp", emailLimiter, controller.resendOtp);

module.exports = router;
