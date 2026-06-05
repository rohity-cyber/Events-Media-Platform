const Media =
require("../models/Media");

const Notification =
require("../models/Notification");

const Activity =
require("../models/Activity");

exports.toggleLike =
async(req,res)=>{

  try{

    const media =
    await Media.findById(
      req.params.mediaId
    );

    const alreadyLiked =
    media.likes.includes(
      req.user._id
    );

    if(alreadyLiked){

      media.likes =
      media.likes.filter(
        id =>
        id.toString()
        !==
        req.user._id.toString()
      );

    }else{

      media.likes.push(
        req.user._id
      );

      await Activity.create({

        user:
        req.user._id,

        action:
        "Liked Media",

        target:
        media.fileName

      });

      if(
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
          "like",

          message:
          "Someone liked your photo"

        });

      }

    }

    await media.save();

    res.json(media);

  }catch(error){

    res.status(500)
    .json({
      message:error.message
    });

  }

};