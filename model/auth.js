const mongoose = require('mongoose')

const authSchema=new mongoose.Schema({
    email:String,
    otp:Number,
    // uid:String
    // expiry in 30 minutes
    // again if 30min passed and again try to signup then check for isVerified false so update otp at that time and check for 
},{timestamps:true})

mongoose.model("Auth",authSchema);