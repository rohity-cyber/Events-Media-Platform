const express =
require("express");

const router =
express.Router();

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

const authorize =
require(
  "../middleware/roleMiddleware"
);

const {

  getAllMedia,
  hideMedia,
  publishMedia,
  deleteMediaAdmin

} = require(
  "../controllers/moderationController"
);

router.get(
  "/media",
  protect,
  authorize("admin"),
  getAllMedia
);

router.patch(
  "/media/:id/hide",
  protect,
  authorize("admin"),
  hideMedia
);

router.patch(
  "/media/:id/publish",
  protect,
  authorize("admin"),
  publishMedia
);

router.delete(
  "/media/:id",
  protect,
  authorize("admin"),
  deleteMediaAdmin
);

module.exports =
router;