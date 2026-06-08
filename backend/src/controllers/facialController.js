const axios = require("axios");
const User = require("../models/User");
const Media = require("../models/Media");

exports.uploadReferenceSelfie = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.referenceSelfie = req.file.path;
    await user.save();
    res.json({
      message: "Reference selfie uploaded",
      path: req.file.path
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findMatchingPhotos = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.referenceSelfie) {
      return res.status(400).json({ message: "Upload reference selfie first" });
    }

    const media = await Media.find({ mediaType: "image" });
    const matches = [];

    for (const photo of media) {
      try {
        const response = await axios.post(
          `${process.env.FACE_SERVICE_URL}/match`,
          {
            referenceImage: user.referenceSelfie,
            targetImage: photo.filePath,
          },
          { timeout: 60000 }
        );

        if (response.data.match) {
          matches.push(photo);
        }

        await new Promise(r => setTimeout(r, 200));

      } catch (error) {
        console.log("Face Match Error:", photo._id, error.message);
      }
    }

    res.json({ count: matches.length, matches });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};