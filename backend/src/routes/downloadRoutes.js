const express =
require("express");

const router =
express.Router();

const {
  downloadMedia
} = require(
  "../controllers/downloadController"
);

router.get(
  "/:id",
  downloadMedia
);

module.exports =
router;