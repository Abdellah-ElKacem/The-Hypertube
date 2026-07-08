const Joi = require("joi");

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
    oldPassword: Joi.string().required(),
  }).validate(data);

module.exports = {
  validateUpdatePassword,
};
