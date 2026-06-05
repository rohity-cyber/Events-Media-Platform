const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
{
  name:{
    type:String,
    required:true
  },

  description:{
    type:String
  },

  category:{
    type:String
  },

  eventDate:{
    type:Date
  },

  visibility:{
    type:String,
    enum:["public","private"],
    default:"public"
  },

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
},
{
  timestamps:true
}
);

module.exports =
mongoose.model("Event", eventSchema);