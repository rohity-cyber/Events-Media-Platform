const express =
require("express");

const router =
express.Router();

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

const upload =
require(
  "../middleware/uploadMiddleware"
);

const {
  uploadReferenceSelfie,
  findMatchingPhotos
} = require(
  "../controllers/facialController"
);

router.post(
  "/selfie",
  protect,
  upload.single(
    "selfie"
  ),
  uploadReferenceSelfie
);

router.get(
  "/my-photos",
  protect,
  findMatchingPhotos
);

module.exports =
router;