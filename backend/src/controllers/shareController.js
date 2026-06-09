const Media = require("../models/Media");

exports.shareMedia =
async(req, res) => {

  try {

    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    const shareLink = `${process.env.FRONTEND_URL}/media/${media._id}`;

    res.json({ shareLink });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};