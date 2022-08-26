const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Auth = mongoose.model("Auth");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/keys');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { SENDGRID_API, EMAIL } = require('../config/keys');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))


// router.get('/getotp', (req, res) => {
//     console.log("get otp called");
//     crypto.randomBytes(3, (err, buffer) => {
//         if (err) {
//             console.log(err);
//         }

//         const otp = parseInt(buffer.toString("hex"), 16)
//             .toString()
//             .substring(0, 6)
//         console.log(otp);
        
//         // res.status(200).json(otp)
//         transporter.sendMail({
//             to: "renishpatel2505@gmail.com",
//             from: "officialfollowgram@gmail.com",
//             subject: "OTP verification",
//             html: `<h1>OTP for verification is ${otp}</h1>`
//         })
//         res.json({ message: "check your mailbox" })
//     })

// });
router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all fields" }); // we don't want to proceed further so use return
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                // if user already exists then return
                return res.status(422).json({success:false,error: "User already exists with that email" })
            }
            bcrypt.hash(password, 12) //hashing password
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic,
                        isVerified:false
                    });
                    user.save()
                        .then(user => {
                            //sending otp
                            crypto.randomBytes(3, (err, buffer) => {
                                if (err) {
                                    console.log(err);
                                }                        
                                const otp = parseInt(buffer.toString("hex"), 16)
                                    .toString()
                                    .substring(0, 6)
                                console.log(otp);                                
                                transporter.sendMail({
                                    to: email,
                                    from: "officialfollowgram@gmail.com",
                                    subject: "OTP verification",
                                    html: `<h1>OTP for verification is ${otp}</h1>`
                                })
                                const auth=new Auth({
                                    email,
                                    otp
                                })
                                auth.save()
                                .then(savedauth=>{
                                    console.log(savedauth);
                                })
                                .catch(err=>console.error(err));
                            })
                            // for sending mail
                            // transporter.sendMail({
                            //     to: user.email,
                            //     from: "officialfollowgram@gmail.com",
                            //     subject: "Signup success",
                            //     html: "<h1>welcome to Followgram</h1>"
                            // })
                            res.json({success:true, message: "signup successfully" });//response not wait for transporter
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
    console.log("req.body is",req.body);
    if (!email || !password) {
        res.status(422).json({success:false, error: "please add email and password" });
        return;
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({success:true, error: "Invaild Email or password" });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({success:true, token, user: { _id, name, email, followers, following, pic } }); //token:token key and value both are equal
                    } else {
                        return res.status(422).json({success:false,  error: "Invalid Email or password" })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        });
})

router.post('/verify', (req, res) => {
    const { email, otp } = req.body;
    console.log("req.body is",req.body);
    if (!email || !otp) {
        res.status(422).json({success:false, error: "please add email and password" });
        return;
    }
    Auth.findOne({email:email,otp:otp})
    // change this find only by email and if otp is incorrect then ssend invalid otp
    .then(authenticated=>{
        if(!authenticated){
            return res.status(422).json({success:false, error: "Invalid Otp or email dono ko alg karna padega" });
        }
        //setting isVerified true
        User.findOneAndUpdate({email:email},{isVerified:true})//deleting data 
       .then(user=>{
            res.status(200).json({success:true, message: "User verified"});
            Auth.deleteOne({email:email})
            .then(suc=>{
                console.log("Auth removed");
            })
            .catch(err=>console.error(err));
        })
        .catch(err=>console.error(err));
    })
    .catch(err=>console.error(err));
})


module.exports = router;