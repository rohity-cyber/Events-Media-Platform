const axios = require("axios");

const generateTags =
async(imageUrl) => {

  const apiKey = process.env.IMAGGA_API_KEY;
  const apiSecret = process.env.IMAGGA_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.log("Imagga credentials not set — skipping auto-tagging");
    return [];
  }

  const response = await axios.get(
    "https://api.imagga.com/v2/tags",
    {
      params: { image_url: imageUrl },
      auth: {
        username: apiKey,
        password: apiSecret
      },
      timeout: 15000
    }
  );

  const tags = response.data?.result?.tags || [];

  return tags
    .filter(t => t.confidence >= 50)
    .map(t => t.tag.en.toLowerCase())
    .slice(0, 15);

};

module.exports = { generateTags };