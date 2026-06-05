const Media =
require("../models/Media");

exports.uploadMedia =
async(req,res)=>{

  try{

    const uploaded = [];

    for(
      const file
      of req.files
    ){

      const media =
      await Media.create({

        uploader:
        req.user._id,

        event:
        req.body.eventId,

        mediaType:
        file.mimetype.startsWith(
          "image"
        )
        ? "image"
        : "video",

        fileName:
        file.originalname ||
        file.filename,

        filePath:
        file.path,

        visibility:
        req.body.visibility ||
        "public",

        tags:
        req.body.tags
        ? req.body.tags
            .split(",")
            .map(
              tag =>
              tag.trim()
            )
        : []

      });

      uploaded.push(
        media
      );

    }

    res.status(201)
    .json(uploaded);

  }catch(error){

    console.log(
      "Upload Error:",
      error.message
    );

    res.status(500)
    .json({
      message:
      error.message
    });

  }

};

exports.getMedia =
async(req,res)=>{

  try{

    const media =
    await Media.find()
    .populate(
      "uploader",
      "name"
    )
    .populate(
      "event",
      "name"
    );

    res.json(media);

  }catch(error){

    res.status(500)
    .json({
      message:
      error.message
    });

  }

};

exports.getMediaById =
async(req,res)=>{

  try{

    const media =
    await Media.findById(
      req.params.id
    )
    .populate(
      "uploader",
      "name"
    )
    .populate(
      "event",
      "name"
    );

    if(!media){

      return res
      .status(404)
      .json({
        message:
        "Media not found"
      });

    }

    res.json(media);

  }catch(error){

    res.status(500)
    .json({
      message:
      error.message
    });

  }

};

exports.deleteMedia =
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

    const isOwner =
    media.uploader.toString()
    ===
    req.user._id.toString();

    const isAdmin =
    req.user.role ===
    "admin";

    if(
      !isOwner &&
      !isAdmin
    ){

      return res
      .status(403)
      .json({
        message:
        "Not authorized to delete this media"
      });

    }

    await media.deleteOne();

    res.json({

      message:
      "Media deleted"

    });

  }catch(error){

    res.status(500)
    .json({
      message:
      error.message
    });

  }

};

exports.updateVisibility =
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

    const isOwner =
    media.uploader.toString()
    ===
    req.user._id.toString();

    const isAdmin =
    req.user.role ===
    "admin";

    if(
      !isOwner &&
      !isAdmin
    ){

      return res
      .status(403)
      .json({
        message:
        "Not authorized to update this media"
      });

    }

    media.visibility =
    req.body.visibility;

    await media.save();

    res.json(media);

  }catch(error){

    res.status(500)
    .json({
      message:
      error.message
    });

  }

};