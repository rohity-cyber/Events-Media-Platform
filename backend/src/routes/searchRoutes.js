const express =
require("express");

const router =
express.Router();

const {
  searchEvents,
  searchMediaByTags,
  searchMediaByDate,
  searchMediaByUser
} = require(
  "../controllers/searchController"
);

router.get(
  "/events",
  searchEvents
);

router.get(
  "/tags",
  searchMediaByTags
);

router.get(
  "/date",
  searchMediaByDate
);

router.get(
  "/user",
  searchMediaByUser
);

module.exports =
router;