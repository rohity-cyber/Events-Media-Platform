const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:[
            "admin",
            "photographer",
            "member",
            "viewer"
        ],
        default:"viewer"
    },

    profilePic:{
        type:String,
        default:""
    },

    referenceSelfie:{
        type:String,
        default:""
    },

    favourites:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Media"
    }
    ]
},
{
    timestamps:true
}
);

module.exports =
mongoose.model("User",userSchema);