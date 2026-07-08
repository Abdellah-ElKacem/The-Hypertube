const crypto = require("crypto");

const generateOtp = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  return { otp, hashedOtp };
};

module.exports = { generateOtp };