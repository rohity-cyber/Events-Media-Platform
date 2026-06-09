const axios = require("axios");
const sharp = require("sharp");
const Media = require("../models/Media");
const { protect } = require("../middleware/authMiddleware");

// Club name shown in the watermark — change this to your club's name
const CLUB_NAME = process.env.CLUB_NAME || "Event Media Platform";

exports.downloadMedia =
async(req, res) => {

  try {

    // Populate event so we can use its name in the watermark
    const media = await Media.findById(req.params.id)
      .populate("event", "name");

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Build dynamic watermark text lines
    const clubLine = media.event?.clubName || CLUB_NAME;
    const eventLine   = media.event?.name ? `Event: ${media.event.name}` : "";
    const roleLine    = req.user?.role
      ? `Downloaded by: ${req.user.role}`
      : "Public download";

    // Build repeated tiled watermark SVG
    // Three passes at different positions so the watermark covers the image
    const makeText = (x, y, line1, line2, line3) => `
      <text x="${x}" y="${y}"        font-size="90" font-weight="700" fill="rgba(200,200,200,0.22)" transform="rotate(-30 ${x} ${y})">${line1}</text>
      <text x="${x}" y="${y + 110}"  font-size="70" font-weight="400" fill="rgba(200,200,200,0.18)" transform="rotate(-30 ${x} ${y + 110})">${line2}</text>
      <text x="${x}" y="${y + 200}"  font-size="60" font-weight="400" fill="rgba(200,200,200,0.15)" transform="rotate(-30 ${x} ${y + 200})">${line3}</text>
    `;

    const watermarkSvg = `
      <svg width="3000" height="2000" xmlns="http://www.w3.org/2000/svg">
        ${makeText(50,  300,  clubLine, eventLine, roleLine)}
        ${makeText(800, 800,  clubLine, eventLine, roleLine)}
        ${makeText(200, 1400, clubLine, eventLine, roleLine)}
        ${makeText(1400, 400, clubLine, eventLine, roleLine)}
        ${makeText(1200, 1600,clubLine, eventLine, roleLine)}
      </svg>
    `;

    const response = await axios.get(
      media.filePath,
      { responseType: "arraybuffer" }
    );

    const buffer = await sharp(response.data)
      .composite([
        {
          input: Buffer.from(watermarkSvg),
          gravity: "center"
        }
      ])
      .jpeg({ quality: 88 })
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${media.fileName}"`
    );
    res.send(buffer);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};
