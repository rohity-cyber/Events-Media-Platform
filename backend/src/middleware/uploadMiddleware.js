const multer = require("multer");

const {
  CloudinaryStorage
} = require("multer-storage-cloudinary");

const cloudinary =
require("../config/cloudinary");

const storage =
new CloudinaryStorage({

  cloudinary,

  params: async (
    req,
    file
  ) => ({

    folder:
    "event-media-platform",

    resource_type:
    "auto",

    public_id:
    `${Date.now()}-${file.originalname}`

  })

});

const upload =
multer({
  storage
});

module.exports = upload;