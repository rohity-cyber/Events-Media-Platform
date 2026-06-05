const express =
require("express");

const router =
express.Router();

const {
  addComment,
  getComments
} = require(
  "../controllers/commentController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/",
  protect,
  addComment
);

router.get(
  "/:mediaId",
  getComments
);

module.exports = router;