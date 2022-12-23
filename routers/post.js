const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const Usercollection = mongoose.model("Usercollection");
const requireLogin = require('../middleware/requireLogin');

router.get('/followingpost', requireLogin, (req, res) => {
    // console.log(req.query);
    const { limit, page, category, postFilter, date1, date2 } = req.query;
    // console.log("post filter is", postFilter);
    if (postFilter === "all") {
        // console.log("all post called");
        Post.find({ type: category, postedBy: { $in: req.user.following } })
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
    } else if (postFilter === "today") {
        // console.log("today post called");

        var start = new Date();
        start.setHours(0, 0, 0, 0);
        var end = new Date();
        end.setHours(23, 59, 59, 999);

        Post.find({ createdAt: { $gte: start, $lt: end }, type: category, postedBy: { $in: req.user.following } })
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
    } else if (postFilter === "last_week") {
        // console.log("last week post called");

        var start = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
        start.setHours(0, 0, 0, 0);
        // console.log(start);
        var end = new Date();
        end.setHours(23, 59, 59, 999);
        Post.find({ createdAt: { $gte: start, $lt: end }, type: category, postedBy: { $in: req.user.following } })
            .populate("postedBy", "_id name pic")
            .populate("comments.postedBy", "_id name pic")
            .sort('-createdAt')//sort in descending order
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .then(posts => {
                res.json(posts);
            })
            .catch(err => {
                // console.log(err);
            });
    } else if (postFilter === "last_30_days") {
        // console.log("last 30 days post called");

        var start = new Date(new Date() - 30 * 60 * 60 * 24 * 1000);
        start.setHours(0, 0, 0, 0);
        // console.log(start);
        var end = new Date();
        end.setHours(23, 59, 59, 999);
        Post.find({ createdAt: { $gte: start, $lt: end }, type: category, postedBy: { $in: req.user.following } })
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
    } else if (postFilter === "between_two_dates") {
        // console.log("between_two_dates post called");
        // console.log(date1, date2);
        if (date1 !== undefined && date2 !== undefined) {
            var start = new Date(date1);
            start.setHours(0, 0, 0, 0);
            // console.log(start);
            var end = new Date(date2);
            end.setHours(23, 59, 59, 999);
            Post.find({ createdAt: { $gte: start, $lt: end }, type: category, postedBy: { $in: req.user.following } })
                .populate("postedBy", "_id name pic")
                .populate("comments.postedBy", "_id name pic")
                .sort('-createdAt')//sort in descending order
                .then(posts => {
                    res.json(posts);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

});
//all post
router.get('/allpost', requireLogin, (req, res) => {
    // console.log(req.query);
    const { limit, page, category } = req.query;
    Post.find({ type: category })
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

router.post('/getpostdetail', requireLogin, (req, res) => {
    // console.log(req.query);
    Post.findById(req.body.pid)
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .then(postdetail => {
            res.json({ postdetail: postdetail });
        })
        .catch(err => {
            console.log(err);
        });
});
router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, type, pic } = req.body;
    if (!type) {
        return res.status(422).json({ success: false, error: "Please add all the fields" });
    }
    if (type === "Media") {
        if (!pic)
            return res.status(422).json({ success: false, error: "Media must be there" });
    } else {
        if (!body) {
            return res.status(422).json({ success: false, error: "Title and Body be there" });
        }
    }
    // req.user.password = undefined;
    const post = new Post({
        body,
        type,
        photo: pic,
        postedBy: req.user._id
    });
    post.save().then(result => {
        if (type === "Media") {
            User.findByIdAndUpdate(req.user._id, {
                $push: { mediaPost: result._id }
            }, {
                new: true
            }).then(user => {
                const { _id, name, email, posts, followers, following, pic, mediaPost, textPost } = user;
                // console.log("ussssser is", user);
                res.json({ success: true, user: { _id, name, email, posts, followers, following, pic, mediaPost, textPost }, post: result });
            }).catch(err => {
                console.error(err);
                res.json({ success: false, error: "Something went wrong try again..." });
            })
        } else {
            User.findByIdAndUpdate(req.user._id, {
                $push: { textPost: result._id }
            }, {
                new: true
            }).then(user => {
                const { _id, name, email, posts, followers, following, pic, mediaPost, textPost } = user;
                // console.log("ussssser is", user);
                res.json({ success: true, user: { _id, name, email, posts, followers, following, pic, mediaPost, textPost }, post: result });
            }).catch(err => {
                console.error(err);
                res.json({ success: false, error: "Something went wrong try again..." });
            })
        }
    })
        .catch(err => {
            console.log(err);
        });
});

//to get loged in user post
router.get('/mypost', requireLogin, (req, res) => {
    // console.log(req.user._id);
    const { limit, page, category } = req.query;
    // console.log(req.query);
    Post.find({ postedBy: req.user._id, type: category })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .then(mypost => {
            res.json(mypost);
            // console.log("from server my posts are" + mypost);
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
                return res.status(422).json({ success: false, error: err })
            } else {
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
                return res.status(422).json({ success: false, error: err })
            } else {
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
                return res.status(422).json({ success: false, error: err })
            } else {
                res.json(result)
            }
        })
});

router.post('/gettag', requireLogin, (req, res) => {
    // console.log(req.query);
    const { limit, page, category } = req.query;

    let tagname = new RegExp("#" + req.body.tagname)

    Post.find({ type: category, body: { $regex: tagname, $options: '/i' } })
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

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ success: false, error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        // console.log("result is", result);
                        if (result.type === "Media") {

                            User.findByIdAndUpdate(req.user._id, {
                                $pull: { mediaPost: post._id }
                            }, {
                                new: true
                            }).then(user =>
                                res.json({ success: true, user: user, result: result })
                            ).catch(err => console.error(err))

                            User

                        } else {
                            User.findByIdAndUpdate(req.user._id, {
                                $pull: { textPost: post._id }
                            }, {
                                new: true
                            }).then(user =>
                                res.json({ success: true, user: user, result: result })
                            ).catch(err => console.error(err))

                        }

                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
})

module.exports = router;