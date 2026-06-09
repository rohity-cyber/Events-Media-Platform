const Media = require("../models/Media");
const { generateTags } = require("../services/taggingService");

exports.uploadMedia =
async(req, res) => {

  try {

    const uploaded = [];

    for (const file of req.files) {

      // Auto-generate AI tags for images
      let autoTags = [];

      if (
        file.mimetype.startsWith("image") &&
        file.path
      ) {
        try {
          autoTags = await generateTags(file.path);
        } catch (tagErr) {
          console.log("Tagging failed (non-fatal):", tagErr.message);
        }
      }

      // Merge manual tags from body with AI-generated tags
      const manualTags = req.body.tags
        ? req.body.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        : [];

      const allTags = [
        ...new Set([...autoTags, ...manualTags])
      ];

      const media = await Media.create({
        uploader: req.user._id,
        event: req.body.eventId,
        mediaType: file.mimetype.startsWith("image") ? "image" : "video",
        fileName: file.originalname || file.filename,
        filePath: file.path,
        visibility: req.body.visibility || "public",
        tags: allTags
      });

      uploaded.push(media);
    }

    res.status(201).json(uploaded);

  } catch (error) {

    console.log("Upload Error:", error.message);
    res.status(500).json({ message: error.message });

  }

};

exports.getMedia =
async(req, res) => {

  try {

    const role = req.user ? req.user.role : null;

    // Viewers and unauthenticated users only see public media
    // Members, photographers, and admins see everything
    const canSeePrivate =
      role === "admin" ||
      role === "photographer" ||
      role === "member";

    const filter = canSeePrivate ? {} : { visibility: "public" };

    const media = await Media.find(filter)
      .populate("uploader", "name")
      .populate("event", "name");

    res.json(media);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.getMediaById =
async(req, res) => {

  try {

    const media = await Media.findById(req.params.id)
      .populate("uploader", "name")
      .populate("event", "name");

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    const role = req.user ? req.user.role : null;

    const canSeePrivate =
      role === "admin" ||
      role === "photographer" ||
      role === "member";

    if (media.visibility === "private" && !canSeePrivate) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(media);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.deleteMedia =
async(req, res) => {

  try {

    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    const isOwner =
      media.uploader.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this media" });
    }

    await media.deleteOne();
    res.json({ message: "Media deleted" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.updateVisibility =
async(req, res) => {

  try {

    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    const isOwner =
      media.uploader.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this media" });
    }

    media.visibility = req.body.visibility;
    await media.save();
    res.json(media);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};
