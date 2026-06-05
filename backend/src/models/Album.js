const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
{
  title:{
    type:String,
    required:true
  },

  event:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Event",
    required:true
  },

  coverImage:{
    type:String,
    default:""
  }
},
{
  timestamps:true
}
);

module.exports =
mongoose.model("Album",albumSchema);