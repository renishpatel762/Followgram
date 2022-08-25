const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const User=mongoose.model("User");
const Post=mongoose.model("Post");

//all post
router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name ")
        .sort('-createdAt')//osr in descending order
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports=router;