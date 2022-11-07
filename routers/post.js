const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const User=mongoose.model("User");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require('../middleware/requireLogin');

//all post
router.get('/allpost', requireLogin, (req, res) => {
    console.log(req.query);
    const { limit, page,category } = req.query;
    Post.find({type:category})
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')//sort in descending order
        .skip((parseInt(page) - 1) * parseInt(limit))
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
    const { title, body, type, pic } = req.body;
    console.log(req.body);
    console.log(pic);
    if (!type) {
        return res.status(422).json({ success: false, error: "Please add all the fields" });
    }
    if (type === "media") {
        if (!pic)
            return res.status(422).json({ success: false, error: "Media must be there" });
    } else {
        if (!body) {
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
        console.log("result is",result);
        User.findByIdAndUpdate(req.user._id, {
            $push: { posts: result._id }
        }, {
            new: true
        }).then(user => {
            const { _id, name, email, posts, followers, following, pic } = user;
            console.log("ussssser is",user);
            res.json({ success: true, user:{ _id, name, email, posts, followers, following, pic },post:result });
        }).catch(err => {
            console.error(err);
            res.json({ success: false,error:"Something went wrong try again..." });
        })
    })
        .catch(err => {
            console.log(err);
        });
});

//to get loged in user post
router.get('/mypost', requireLogin, (req, res) => {
    const { limit, page, category } = req.query;
    console.log(req.query);
    Post.find({ postedBy: req.user._id, type: category })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .then(mypost => {
            res.json(mypost);
            console.log("from server my posts are" + mypost);
        })
        .catch(err => {
            console.log(err);
        })
});

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({success: false, error: err })
        } else {
            console.log(res);
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({success: false, error: err })
        } else {
            console.log(res);
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req, res) => {
    // console.log(req.body);
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name pic")
        .populate("postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
});


module.exports = router;