const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

class UploadError extends Error {
  constructor(message) {
    super(message);
    this.name = "UploadError";
    this.status = 400;
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars/");
  },
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(16).toString("hex");
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const allowed = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (allowed.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new UploadError("Only JPEG, PNG, or WebP images are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = { upload, UploadError };