const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const requireLogin = require('../middleware/requireLogin');

//get another user detail
router.get('/user/:id', requireLogin, (req, res) => {
    console.log("user/id called");
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            // Post.find({ postedBy: req.params.id })
            //     .populate("postedBy", "_id name")
            //     .skip(parseInt(page)*parseInt(limit))
            //     .limit(parseInt(limit))
            //     .exec((err, posts) => {
            //         if (err) {
            // return res.status(422).json({ success: false, error: err })
            //         }
            // let posts=user.posts;
            // res.json({ success: true, user, posts})
            res.json({ success: true, user })
            //     })
        }).catch(err => {
            return res.status(404).json({ success: false, error: "User not found" })
        })
});

router.post('/userpost', requireLogin, (req, res) => {
    const { limit, page, category } = req.query;
    console.log(req.query);
    console.log("body is", req.body);
    Post.find({ postedBy: req.body.uid, type: category })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .then(mypost => {
            res.json(mypost);
            console.log("from server my posts are", mypost);
        })
        .catch(err => {
            console.log(err);
        })
});

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true }).select("-password")
            .then(data => {
                res.json({ success: true, data })
            }).catch(err => {
                return res.status(422).json({ success: false, error: err })
            })
    }
    )
});

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, { new: true }).select("-password").then(data => {
            res.json({ success: true, data })
        }).catch(err => {
            return res.status(422).json({ success: false, error: err })
        })

    })
});

router.post('/search', requireLogin, (req, res) => {
    console.log(req.body);
    let userPattern = new RegExp("^" + req.body.searchquery)
    User.find({ email: { $regex: userPattern } })







        //change to name or content based search

        .select("_id email name")
        .then(accountdata => {
            res.json({ success: true, accountdata })
        }).catch(err => {
            console.log({ success: false, err });
        })
})

module.exports = router;