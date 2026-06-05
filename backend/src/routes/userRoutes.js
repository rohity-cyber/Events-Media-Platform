const express =
require("express");

const router =
express.Router();

const {
  getProfile,
  getFavourites
} = require(
  "../controllers/userController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

router.get(
  "/profile",
  protect,
  getProfile
);

router.get(
  "/favourites",
  protect,
  getFavourites
);

module.exports =
router;