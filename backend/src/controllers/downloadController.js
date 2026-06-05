const axios =
require("axios");

const sharp =
require("sharp");

const Media =
require("../models/Media");

exports.downloadMedia =
async(req,res)=>{

  try{

    const media =
    await Media.findById(
      req.params.id
    );

    if(!media){

      return res
      .status(404)
      .json({

        message:
        "Media not found"

      });

    }

    const response =
    await axios.get(

      media.filePath,

      {
        responseType:
        "arraybuffer"
      }

    );

    const watermarkSvg = `
    <svg width="3000" height="1200">

      <text
        x="20%"
        y="25%"
        font-size="180"
        font-weight="900"
        fill="rgba(120,120,120,0.20)"
        transform="rotate(-25)">
        Rohit's Event Media Platform
      </text>

      <text
        x="50%"
        y="50%"
        font-size="180"
        font-weight="900"
        fill="rgba(120,120,120,0.20)"
        transform="rotate(-25)">
        Rohit's Event Media Platform
      </text>

      <text
        x="10%"
        y="80%"
        font-size="180"
        font-weight="900"
        fill="rgba(120,120,120,0.20)"
        transform="rotate(-25)">
        Rohit's Event Media Platform
      </text>

    </svg>
    `;

    const buffer =
    await sharp(
      response.data
    )
    .composite([
      {
        input:
        Buffer.from(
          watermarkSvg
        ),
        gravity:
        "center"
      }
    ])
    .jpeg()
    .toBuffer();

    res.setHeader(
      "Content-Type",
      "image/jpeg"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${media.fileName}"`
    );

    res.send(buffer);

  }catch(error){

    res.status(500)
    .json({

      message:
      error.message

    });

  }

};