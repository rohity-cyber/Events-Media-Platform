const User =
require("../models/User");

exports.getUsers =
async(req,res)=>{

  try{

    const users =
    await User.find()
    .select("-password");

    res.json(
      users
    );

  }catch(error){

    res.status(500)
    .json({
      message:error.message
    });

  }

};

exports.updateRole =
async(req,res)=>{

  try{

    const user =
    await User.findByIdAndUpdate(

      req.params.id,

      {
        role:
        req.body.role
      },

      {
        new:true
      }

    ).select(
      "-password"
    );

    res.json(
      user
    );

  }catch(error){

    res.status(500)
    .json({
      message:error.message
    });

  }

};

exports.deleteUser =
async(req,res)=>{

  try{

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({

      message:
      "User deleted"

    });

  }catch(error){

    res.status(500)
    .json({
      message:error.message
    });

  }

};