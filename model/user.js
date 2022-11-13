const mongoose=require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/djtragbck/image/upload/v1668271876/profile_pics/default_user_jvzpsn_yivfp2.webp"
    },
    // posts:[{type:ObjectId,ref:"Post"}],
    mediaPost:[{type:ObjectId,ref:"Post"}],
    textPost:[{type:ObjectId,ref:"Post"}],
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    isVerified:Boolean
},{timestamp:true});

mongoose.model("User",userSchema);