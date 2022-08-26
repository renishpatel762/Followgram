const jwt = require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys');
const mongoose=require('mongoose');
const User=mongoose.model('User');

module.exports= (req,res,next)=>{
    
}
