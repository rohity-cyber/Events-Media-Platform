const express =
require("express");

const router =
express.Router();

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

const {
  toggleFavourite
} = require(
  "../controllers/favouriteController"
);

router.post(
  "/:mediaId",
  protect,
  toggleFavourite
);

module.exports =
router;