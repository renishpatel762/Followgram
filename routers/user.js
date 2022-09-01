const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User=mongoose.model("User");
const Post=mongoose.model("Post");
const requireLogin = require('../middleware/requireLogin');

//get another user detail
router.get('/user/:id', requireLogin, (req, res) => {
    const {limit,page}=req.query;
    console.log("user/id called");
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .skip(parseInt(page)*parseInt(limit))
                .limit(parseInt(limit))
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, posts })
                })
        }).catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
});



module.exports=router;