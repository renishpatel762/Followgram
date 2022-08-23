const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User=mongoose.model("User");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/keys');


router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all fields" }); // we don't want to proceed further so use return
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                // if user already exists then return
                return res.status(422).json({ error: "User already exists with that email" })
            }
            bcrypt.hash(password, 12) //hashing password
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic
                    });
                    user.save()
                        .then(user => {
                            // for sending mail
                            // transporter.sendMail({
                            //     to: user.email,
                            //     from: "itsmegalaxy007@gmail.com",
                            //     subject: "Signup success",
                            //     html: "<h1>welcome to instaclone</h1>"
                            // })
                            res.json({ message: "signup successfully" });//response not wait for transporter
                        })
                        .catch(err => {
                            console.error(err);
                        })
                });
        })
        .catch(err => {
            console.error(err);
        });
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(422).json({ error: "please add email and password" });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invaild Email or password" });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token, user: { _id, name, email, followers, following, pic } }); //token:token key and value both are equal
                    } else {
                        return res.status(422).json({ error: "Invalid Email or password" })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        });
})


module.exports = router;