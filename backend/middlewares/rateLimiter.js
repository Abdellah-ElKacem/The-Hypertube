const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// For forgot password / resend OTP
exports.emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests. Try again in 1 hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many accounts created. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many refresh attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// For profile/password updates and 2FA toggling
exports.updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many update attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});