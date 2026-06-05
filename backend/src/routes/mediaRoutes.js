const express = require("express");

const router =
express.Router();

const upload =
require("../middleware/uploadMiddleware");

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

const {
  uploadMedia,
  getMedia,
  getMediaById,
  deleteMedia,
  updateVisibility
} = require(
  "../controllers/mediaController"
);

router.get(
  "/",
  getMedia
);

router.get(
  "/:id",
  getMediaById
);

router.post(
  "/upload",
  protect,
  upload.array(
    "media",
    20
  ),
  uploadMedia
);

router.delete(
  "/:id",
  protect,
  deleteMedia
);

router.patch(
  "/:id/visibility",
  protect,
  updateVisibility
);

module.exports =
router;