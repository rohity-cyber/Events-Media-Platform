const User = require("../models/User");

exports.getProfile =
async(req,res)=>{
  try{

    const user =
    await User.findById(
      req.user._id
    )
    .select("-password");

    res.json(user);

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};

exports.getFavourites =
async(req,res)=>{
  try{

    const user =
    await User.findById(
      req.user._id
    )
    .populate({
      path:"favourites",
      populate:[
        {
          path:"uploader",
          select:"name"
        },
        {
          path:"event",
          select:"name"
        }
      ]
    });

    res.json(
      user.favourites
    );

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};