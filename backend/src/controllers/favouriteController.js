const User =
require("../models/User");

exports.toggleFavourite =
async(req,res)=>{
  try{

    const user =
      await User.findById(
        req.user._id
      );

    const mediaId =
      req.params.mediaId;

    const exists =
      user.favourites.includes(
        mediaId
      );

    if(exists){

      user.favourites =
        user.favourites.filter(
          id =>
          id.toString() !== mediaId
        );

    }else{

      user.favourites.push(
        mediaId
      );
    }

    await user.save();

    res.json(
      user.favourites
    );

  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};