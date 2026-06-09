const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const { protect, optionalAuth } = require("../middleware/authMiddleware");

const {
  uploadMedia,
  getMedia,
  getMediaById,
  deleteMedia,
  updateVisibility
} = require("../controllers/mediaController");

// optionalAuth: attaches req.user if token is present, but doesn't block if absent
router.get("/", optionalAuth, getMedia);

router.get("/:id", optionalAuth, getMediaById);

router.post(
  "/upload",
  protect,
  upload.array("media", 20),
  uploadMedia
);

router.delete("/:id", protect, deleteMedia);

router.patch("/:id/visibility", protect, updateVisibility);

module.exports = router;
