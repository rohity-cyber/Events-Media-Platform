const Activity =
require("../models/Activity");

exports.getActivities =
async(req,res)=>{

  try{

    const activities =
    await Activity.find()
    .populate(
      "user",
      "name"
    )
    .sort({
      createdAt:-1
    })
    .limit(100);

    res.json(
      activities
    );

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};