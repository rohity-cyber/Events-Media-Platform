const axios = require("axios");
const User = require("../models/User");
const Media = require("../models/Media");

exports.uploadReferenceSelfie = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.referenceSelfie = req.file.path;
    await user.save();
    res.json({ message: "Reference selfie uploaded", path: req.file.path });
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
    console.log(`Starting face search across ${media.length} photos`);

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

        const { match, score, error } = response.data;
        console.log(`Photo ${photo._id}: score=${score}, match=${match}, error=${error || "none"}`);

        if (match) {
          matches.push(photo);
        }

        await new Promise(r => setTimeout(r, 150));

      } catch (error) {
        console.log("Face Match Error:", photo._id, error.message);
      }
    }

    console.log(`Search done. Found ${matches.length} matches out of ${media.length}`);
    res.json({ count: matches.length, matches });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};