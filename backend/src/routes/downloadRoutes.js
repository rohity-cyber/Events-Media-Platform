const express = require("express");

const router = express.Router();

const { downloadMedia } = require("../controllers/downloadController");

const { optionalAuth } = require("../middleware/authMiddleware");

// optionalAuth: logged-in users get their role in the watermark,
// guests get "Public download" — but the route isn't blocked for either
router.get("/:id", optionalAuth, downloadMedia);

module.exports = router;
