const express =
require("express");

const router =
express.Router();

const {
  shareMedia
} = require(
  "../controllers/shareController"
);

router.get(
  "/:id",
  shareMedia
);

module.exports =
router;