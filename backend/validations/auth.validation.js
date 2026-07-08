const Joi = require("joi");

const validateLogin = (data) =>
  Joi.object({
    username: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  }).validate(data);

const validateForgotPassword = (data) =>
  Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  }).validate(data);

const validateResetPassword = (data) =>
  Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .max(255)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .message(
        "Password must contain uppercase, lowercase, number, and special character (@$!%*?&)",
      )
      .required(),
  }).validate(data);

const validateUpdatePassword = (data) =>
  Joi.object({
    newPassword: Joi.string()
      .min(8)
      .max(255)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .message(
        "Password must contain uppercase, lowercase, number, and special character (@$!%*?&)",
      )
      .required(),
  }).validate(data);

const validateVerifyOtp = (data) =>
  Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
      "string.length": "OTP must be 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
    }),
  }).validate(data);

const validateResendOtp = (data) =>
  Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  }).validate(data);

// const validateRefreshToken = (data) =>
//   Joi.object({
//     refreshToken: Joi.string().required(),
//   }).validate(data);

module.exports = {
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyOtp,
  validateResendOtp,
  validateUpdatePassword,
};
