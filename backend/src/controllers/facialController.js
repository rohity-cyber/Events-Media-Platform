const axios = require("axios");
const FormData = require("form-data");
const User = require("../models/User");
const Media = require("../models/Media");

const FACEPP_API_KEY = process.env.FACEPP_API_KEY;
const FACEPP_API_SECRET = process.env.FACEPP_API_SECRET;
const FACEPP_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare";

exports.uploadReferenceSelfie = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.referenceSelfie = req.file.path; // still a Cloudinary URL
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
        const form = new FormData();
        form.append("api_key", FACEPP_API_KEY);
        form.append("api_secret", FACEPP_API_SECRET);
        form.append("image_url1", user.referenceSelfie);
        form.append("image_url2", photo.filePath);

        const response = await axios.post(FACEPP_COMPARE_URL, form, {
          headers: form.getHeaders(),
          timeout: 15000,
        });

        const confidence = response.data.confidence ?? 0;
        const match = confidence >= 75; // Face++ uses 0-100 scale; 75 is a safe threshold

        console.log(`Photo ${photo._id}: confidence=${confidence}, match=${match}`);

        if (match) matches.push(photo);

        await new Promise((r) => setTimeout(r, 300)); // stay within rate limits

      } catch (err) {
        // Face++ returns 400 if no face detected — not a crash, just skip
        console.log(`Face++ skip ${photo._id}:`, err.response?.data?.error_message || err.message);
      }
    }

    console.log(`Search done. Found ${matches.length} matches out of ${media.length}`);
    res.json({ count: matches.length, matches });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};