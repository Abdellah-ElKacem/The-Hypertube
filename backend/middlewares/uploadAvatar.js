const multer = require("multer");
const { upload } = require("./upload"); // <-- same folder, so "./upload" not "../upload"

const uploadAvatar = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      let message = "File upload error";
      if (err.code === "LIMIT_FILE_SIZE") message = "Image must be 2MB or smaller";
      return res.status(400).json({ success: false, message });
    }
    if (err) {
      return res.status(err.status || 400).json({
        success: false,
        message: err.message || "Invalid file",
      });
    }
    next();
  });
};

module.exports = { uploadAvatar };