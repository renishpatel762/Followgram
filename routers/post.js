const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const User=mongoose.model("User");
const Post = mongoose.model("Post");
const requireLogin = require('../middleware/requireLogin');

//all post
router.get('/allpost', requireLogin, (req, res) => {
    console.log(req.query);
    const {limit,page}=req.query;
    Post.find()
        .populate("postedBy", "_id name pic")
        .sort('-createdAt')//sort in descending order
        .skip(parseInt(page)*parseInt(limit))
        .limit(parseInt(limit))
        .then(posts => {
            res.json({ success: true, posts });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/createpost', requireLogin, (req, res) => {
    console.log("createpost called");
    const { title, body, pic, isOnlyText } = req.body;
    console.log(req.body);
    if (!title || !body || (!isOnlyText && !pic)) {
        if(!isOnlyText)
            return res.status(422).json({ success: false, error: "Upload pic" });
        return res.status(422).json({ success: false, error: "Please add all the fields" });
    }
    // req.user.password = undefined;
    const post = new Post({
        title,
        body,
        isOnlyText,
        photo: pic,
        postedBy: req.user._id
    });
    post.save().then(result => {
        res.json({ post: result });
    })
        .catch(err => {
            console.log(err);
        });
});

//to get loged in user post
router.get('/mypost', requireLogin, (req, res) => {
    const {limit,page}=req.query;
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .skip(parseInt(page)*parseInt(limit))
        .limit(parseInt(limit))
        .then(mypost => {
            res.json({ success: false, mypost });
            console.log("from server my posts are" + mypost);
        })
        .catch(err => {
            console.log(err);
        })
});

module.exports = router;