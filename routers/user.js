const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const requireLogin = require('../middleware/requireLogin');

//get another user detail
router.get('/user/:id', requireLogin, (req, res) => {
    // console.log("user/id called");
    User.findOne({ _id: req.params.id })
        .populate("following", "_id name pic")
        .populate("followers", "_id name pic")
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


    //





    //

    //or do with array that user have directly
    const { limit, page, category } = req.query;
    // console.log(req.query);
    // console.log("body is", req.body);
    Post.find({ postedBy: req.body.uid, type: category })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .then(mypost => {
            res.json(mypost);
            // console.log("from server my posts are", mypost);
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
        }, { new: true })
            .select("-password")
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
        }, { new: true })
            .select("-password").then(data => {
                res.json({ success: true, data })
            }).catch(err => {
                return res.status(422).json({ success: false, error: err })
            })

    })
});

router.post('/accountsearch', requireLogin, (req, res) => {
    let userPattern = new RegExp(req.body.searchquery)

    User.find({ name: { $regex: userPattern, $options: '/i' } })
        .select("_id email name pic")
        .then(accountdata => {
            // console.log("accountdata", accountdata);
            res.json({ success: true, accountdata })
        }).catch(err => {
            // console.log({ success: false, err });
        })
})
router.post('/mediasearch', requireLogin, (req, res) => {
    // console.log("mediasearch");
    let postPattern = new RegExp(req.body.searchquery)

    Post.find({ type: "Media", body: { $regex: postPattern, $options: '/i' } })

        .select("_id title photo body likes comments postedBy")
        .populate("postedBy")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .then(mediadata => {
            // console.log("mediadata", mediadata);
            res.json({ success: true, mediadata })
        }).catch(err => {
            // console.log({ success: false, err });
        })
})

router.post('/textpostsearch', requireLogin, (req, res) => {
    // console.log("textpostsearch");

    let textPostPattern = new RegExp(req.body.searchquery)
    let category = ['Joke', "Shayari", "Quote"]
    Post.find({ type: { $in: category }, body: { $regex: textPostPattern, $options: '/i' } })
        //change to name or content based search
        .select("_id type body likes comments postedBy")
        .populate("postedBy")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .then(textpostdata => {
            res.json({ success: true, textpostdata })
        }).catch(err => {
            console.log(err);
        })
});


router.put('/updateprofilepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ sucess: false, error: "pic canot set" })
            }
            res.json({ success: true, result });
        })
});
router.get('/getuser', requireLogin, (req, res) => {
    User.findOne({ _id: req.user._id })
        .select("-password")
        .then(user => {
            res.json({ success: true, user })
        }).catch(err => {
            return res.status(404).json({ success: false, error: "User not found" })
        })
});
router.get('/getuserdata', requireLogin, (req, res) => {
    // console.log("user/id called");
    User.findOne({ _id: req.user._id })
        .select("-password")
        .populate("following", "_id name pic")
        .populate("followers", "_id name pic")
        .then(user => {
            res.json({ success: true, user })
        }).catch(err => {
            return res.status(404).json({ success: false, error: "User not found" })
        })
});

module.exports = router;