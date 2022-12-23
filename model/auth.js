const mongoose = require('mongoose')

const authSchema=new mongoose.Schema({
    email:String,
    otp:Number,
    expireAt:Date
},{timestamps:true})

mongoose.model("Auth",authSchema);