const Album =
require("../models/Album");

const Activity =
require("../models/Activity");

exports.createAlbum =
async(req,res)=>{
  try{

    const album =
    await Album.create(
      req.body
    );

    await Activity.create({

      user:
      req.user._id,

      action:
      "Created Album",

      target:
      album.title

    });

    res.status(201)
    .json(album);

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};

exports.getAlbums =
async(req,res)=>{
  try{

    const albums =
    await Album.find()
    .populate(
      "event",
      "name"
    );

    res.json(
      albums
    );

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};