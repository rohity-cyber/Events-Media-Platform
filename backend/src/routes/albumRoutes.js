const express =
require("express");

const router =
express.Router();

const {
  createAlbum,
  getAlbums
} = require(
  "../controllers/albumController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/",
  protect,
  createAlbum
);

router.get(
  "/",
  getAlbums
);

module.exports = router;