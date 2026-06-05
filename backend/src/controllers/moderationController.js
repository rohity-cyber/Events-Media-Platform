const Media =
require("../models/Media");

exports.getAllMedia =
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

    res.json(
      media
    );

  }catch(error){

    res.status(500)
    .json({
      message:error.message
    });

  }

};

exports.hideMedia =
async(req,res)=>{

  try{

    const media =
    await Media.findByIdAndUpdate(

      req.params.id,

      {
        visibility:
        "private"
      },

      {
        new:true
      }

    );

    res.json(
      media
    );

  }catch(error){

    res.status(500)
    .json({
      message:error.message
    });

  }

};

exports.publishMedia =
async(req,res)=>{

  try{

    const media =
    await Media.findByIdAndUpdate(

      req.params.id,

      {
        visibility:
        "public"
      },

      {
        new:true
      }

    );

    res.json(
      media
    );

  }catch(error){

    res.status(500)
    .json({
      message:error.message
    });

  }

};

exports.deleteMediaAdmin =
async(req,res)=>{

  try{

    await Media.findByIdAndDelete(
      req.params.id
    );

    res.json({

      message:
      "Media deleted"

    });

  }catch(error){

    res.status(500)
    .json({
      message:error.message
    });

  }

};