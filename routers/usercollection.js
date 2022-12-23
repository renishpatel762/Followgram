const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Usercollection = mongoose.model("Usercollection");
const requireLogin = require('../middleware/requireLogin');

router.post('/createcollection', requireLogin, (req, res) => {
    // console.log(req.user._id);
    const { name } = req.body;

    if (!name) {
        return res.status(422).json({ success: false, error: "Please add all the fields" });
    }
    const usercollection = new Usercollection({
        name,
        createdBy: req.user._id
    });
    usercollection.save().then(newcollection => {
        res.json({ sucess: true, newcollection });
    }).catch(err => {
        console.log(err);
        res.json({ success: false, error: err });
    })
});


router.get('/getcollections', requireLogin, (req, res) => {
    Usercollection.find({ createdBy: req.user._id })
        .populate("imagePost")
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
router.post('/getuserscollections', requireLogin, (req, res) => {
    // console.log("getuserscollections called", req.body);
    Usercollection.find({ createdBy: req.body.uid })
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
router.get('/getcollectionlist', requireLogin, (req, res) => {
    Usercollection.find({ createdBy: req.user._id })
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
                    res.json({ result: result })
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
                    res.json({ result: result })
                }
            })
    }
});

router.post('/removefromcollection', requireLogin, (req, res) => {
    const { collid, postid, type } = req.body;
    if (type === "Media") {
        // addtoName = "imagePost";
        Usercollection.findByIdAndUpdate(collid, { $pull: { imagePost: postid } }, {
            new: true
        })
            .populate("imagePost")
            .populate("textPost")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ success: false, error: err })
                } else {
                    // console.log(result);
                    res.json({ result: result })
                }
            })
    } else {
        // addtoName = "textPost";
        Usercollection.findByIdAndUpdate(collid, { $pull: { textPost: postid } }, {
            new: true
        })
            .populate("imagePost")
            .populate("textPost")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ success: false, error: err })
                } else {
                    // console.log(result);
                    res.json({ result: result })
                }
            })
    }
});

module.exports = router;