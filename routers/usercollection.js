const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Usercollection = mongoose.model("Usercollection");
const requireLogin = require('../middleware/requireLogin');

router.post('/createcollection', requireLogin, (req, res) => {
    console.log(req.user._id);
    const { name } = req.body;

    if (!name) {
        return res.status(422).json({ success: false, error: "Please add all the fields" });
    }
    const usercollection = new Usercollection({
        name,
        createdBy: req.user._id
    });
    usercollection.save().then(result => {
        res.json({ sucess: true, result });
    }).catch(err => {
        console.log(err);
        res.json({ success: false, error: err });
    })
});

router.get('/getcollections', requireLogin, (req, res) => {
    Usercollection.find({ createdBy: req.user._id })
        // .populate("createdBy")    
        .populate("imagePost")
        // .populate("imagePost.postedBy")
        .populate("textPost")
        .sort('-createdAt')
        .then(usercoll => {
            // console.log(mycoll);
            res.json({ usercoll })
        })
        .catch(err => {
            res.json({ sucess: false, error: err })
        })

});

router.post('/addtocollection', requireLogin, (req, res) => {
    const { collid, postid, type } = req.body;

    let addtoName = "";
    if (type === "Media") {
        // addtoName = "imagePost";
        Usercollection.findByIdAndUpdate(collid, { $push: { imagePost: postid } }, {
            new: true
        })
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ success: false, error: err })
                } else {
                    // console.log(result);
                    res.json(result)
                }
            })
    } else {
        // addtoName = "textPost";
        Usercollection.findByIdAndUpdate(collid, { $push: { textPost: postid } }, {
            new: true
        })
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ success: false, error: err })
                } else {
                    // console.log(result);
                    res.json(result)
                }
            })
    }
});

router.post('/removefromcollection', requireLogin, (req, res) => {
    const { collid, postid, type } = req.body;

    let addtoName = "";
    if (type === "Media") {
        // addtoName = "imagePost";
        Usercollection.findByIdAndUpdate(collid, { $pull: { imagePost: postid } }, {
            new: true
        })
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ success: false, error: err })
                } else {
                    // console.log(result);
                    res.json(result)
                }
            })
    } else {
        // addtoName = "textPost";
        Usercollection.findByIdAndUpdate(collid, { $pull: { textPost: postid } }, {
            new: true
        })
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ success: false, error: err })
                } else {
                    // console.log(result);
                    res.json(result)
                }
            })
    }
});

module.exports = router;