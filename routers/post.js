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
        .skip((parseInt(page) - 1)*parseInt(limit))
        .limit(parseInt(limit))
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/createpost', requireLogin, (req, res) => {
    console.log("createpost called");
    const { title, body,type, pic} = req.body;
    console.log(req.body);
    console.log(pic);
    if (!type) {
        return res.status(422).json({ success: false, error: "Please add all the fields" });
    }
    if(type==="media"){
        if(!pic)
            return res.status(422).json({ success: false, error: "Media must be there" });
    }else{
        if(!body ){
            return res.status(422).json({ success: false, error: "Title and Body be there" });        
        }
    }
    // req.user.password = undefined;
    const post = new Post({
        title,
        body,
        type,
        photo: pic,
        postedBy: req.user._id
    });
    post.save().then(result => {
        res.json({ success: true, post: result });
    })
        .catch(err => {
            console.log(err);
        });
});

//to get loged in user post
router.get('/mypost', requireLogin, (req, res) => {
    const {limit,page,category}=req.query;
    console.log(req.query);
    Post.find({ postedBy: req.user._id, type:category})
        .populate("postedBy", "_id name")
        .sort('-createdAt')
        .skip((parseInt(page) - 1)*parseInt(limit))
        .limit(parseInt(limit))
        .then(mypost => {
            res.json(mypost);
            console.log("from server my posts are" + mypost);
        })
        .catch(err => {
            console.log(err);
        })
});

module.exports = router;