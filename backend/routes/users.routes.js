const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
// const upload = require("../middlewares/upload");
const controller = require("../controllers/users.controller");
const { updateLimiter } = require("../middlewares/rateLimiter");
const { uploadAvatar } = require("../middlewares/uploadAvatar");
const { getUserBadges } = require("../controllers/badges.controller");


router.get("/me", auth, controller.getMe);
router.get("/", auth, controller.getAllUsers);
router.patch("/update", auth, updateLimiter, uploadAvatar, controller.updateUser);
router.patch("/updateVideoStreaming", auth, updateLimiter, controller.updateVideoStreaming);
router.patch("/updatePassword", auth, updateLimiter, controller.updatePassword);
router.get("/:id/badges", auth, getUserBadges);
router.get("/:id", auth, controller.getUserById);
router.patch("/cover-picture", auth, updateLimiter, controller.updateCoverPicture);

module.exports = router;
