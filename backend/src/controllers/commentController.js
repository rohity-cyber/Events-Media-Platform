const Comment =
require("../models/Comment");

const Media =
require("../models/Media");

const Notification =
require("../models/Notification");

const Activity =
require("../models/Activity");

exports.addComment =
async(req,res)=>{

  try{

    const comment =
    await Comment.create({

      media:
      req.body.mediaId,

      user:
      req.user._id,

      text:
      req.body.text

    });

    const media =
    await Media.findById(
      req.body.mediaId
    );

    await Activity.create({

      user:
      req.user._id,

      action:
      "Commented",

      target:
      media?.fileName ||
      "Media"

    });

    if(
      media &&
      media.uploader.toString()
      !==
      req.user._id.toString()
    ){

      await Notification.create({

        receiver:
        media.uploader,

        sender:
        req.user._id,

        type:
        "comment",

        message:
        "Someone commented on your photo"

      });

    }

    res.status(201)
    .json(comment);

  }catch(error){

    res.status(500)
    .json({
      message:error.message
    });

  }

};

exports.getComments =
async(req,res)=>{

  try{

    const comments =
    await Comment.find({

      media:
      req.params.mediaId

    })
    .populate(
      "user",
      "name"
    );

    res.json(
      comments
    );

  }catch(error){

    res.status(500)
    .json({
      message:error.message
    });

  }

};