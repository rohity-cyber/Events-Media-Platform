const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
{
  uploader:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  event:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Event",
    required:true
  },

  mediaType:{
    type:String,
    enum:["image","video"],
    required:true
  },

  fileName:{
    type:String,
    required:true
  },

  filePath:{
    type:String,
    required:true
  },

  tags:[String],

  likes:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],

  visibility:{
    type:String,
    enum:["public","private"],
    default:"public"
  }
},
{
  timestamps:true
}
);

module.exports =
mongoose.model("Media",mediaSchema);