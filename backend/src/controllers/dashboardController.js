const User =
require("../models/User");

const Event =
require("../models/Event");

const Album =
require("../models/Album");

const Media =
require("../models/Media");

exports.getStats =
async(req,res)=>{

  try{

    const totalUsers =
    await User.countDocuments();

    const totalEvents =
    await Event.countDocuments();

    const totalAlbums =
    await Album.countDocuments();

    const totalMedia =
    await Media.countDocuments();

    const totalImages =
    await Media.countDocuments({
      mediaType:"image"
    });

    const totalVideos =
    await Media.countDocuments({
      mediaType:"video"
    });

    res.json({

      totalUsers,
      totalEvents,
      totalAlbums,
      totalMedia,
      totalImages,
      totalVideos

    });

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};