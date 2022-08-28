const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const User=mongoose.model("User");
const Post = mongoose.model("Post");
const requireLogin = require('../middleware/requireLogin');

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

router.post('/createpost', requireLogin, (req, res) => {
    console.log("createpost called");
    const { title, body, pic, isOnlyText } = req.body;
    if (!title || !body || !isOnlyText) {
        if(!isOnlyText)
            return res.status(422).json({ success: false, error: "Upload pic" });
        return res.status(422).json({ success: false, error: "Please add all the fields" });
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        isOnlyText,
        photo: pic,
        postedBy: req.user
    });
    post.save().then(result => {
        res.json({ post: result });
    })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;