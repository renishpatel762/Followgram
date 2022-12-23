const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Auth = mongoose.model("Auth");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../config/keys");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { SENDGRID_API, EMAIL } = require("../config/keys");
const { log } = require("console");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  })
);

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res
      .status(422)
      .json({ success: false, error: "please add all fields" }); // we don't want to proceed further so use return
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        // if user already exists then return
        return res
          .status(422)
          .json({
            success: false,
            error: "User already exists with that email",
          });
      }
      bcrypt
        .hash(password, 12) //hashing password
        .then((hashedpassword) => {
          const user = new User({
            email,
            password: hashedpassword,
            name,
            pic,
            isVerified: false,
          });
          user
            .save()
            .then((user) => {
              //sending otp
              crypto.randomBytes(3, (err, buffer) => {
                if (err) {
                  console.log(err);
                }
                const otp = parseInt(buffer.toString("hex"), 16)
                  .toString()
                  .substring(0, 6);
                // console.log(otp);

                transporter.sendMail({
                  to: email,
                  from: "officialfollowgram@gmail.com",
                  subject: "OTP verification",
                  html: `<div>
                        <h2>OTP for verification is</h2>
                        <h1>${otp}</h1>
                        <br />
                        <p>Please do not share with anyone.</p>
                        <p>It will be valid for the next 5 minutes.</p>
                        <br />
                        <h3>Thank you</h3>
                    </div>`,
                });
                const auth = new Auth({
                  email,
                  otp,
                  expireAt:Date.now() + 300000
                });
                auth
                  .save()
                  .then((savedauth) => {
                    // console.log(savedauth);
                  })
                  .catch((err) => console.error(err));
              });
              res.json({ success: true, message: "signup successfully" }); //response not wait for transporter
            })
            .catch((err) => {
              console.error(err);
            });
        });
    })
    .catch((err) => {
      console.error(err);
    });
});
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  // console.log("req.body is", req.body);
  if (!email || !password) {
    res
      .status(422)
      .json({ success: false, error: "please add email and password" });
    return;
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res
        .status(422)
        .json({ success: false, error: "Invaild Email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, posts, followers, following, pic, mediaPost, textPost } = savedUser;
          res.json({
            success: true,
            token,
            user: { _id, name, email, posts, mediaPost, textPost, followers, following, pic },
          }); //token:token key and value both are equal
        } else {
          return res
            .status(422)
            .json({ success: false, error: "Invalid Email or password" });
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  });
});

router.post("/verify", (req, res) => {
  const { email, otp } = req.body;
  // console.log("req.body is", req.body);
  if (!email || !otp) {
    res
      .status(422)
      .json({ success: false, error: "please add email and password" });
    return;
  }

  Auth.findOne({ expireAt: {$gt:Date.now()}, email: email })
    // change this find only by email and if otp is incorrect then ssend invalid otp
    .then((authenticated) => {
      // console.log("authenticated",authenticated);
      if (!authenticated) {
        return res
          .status(422)
          .json({
            success: false,
            error: "Otp expired.",
            isOtpExpired:true
          });
      } else if (authenticated.otp == otp) {
        //setting isVerified true
        User.findOneAndUpdate({ email: email }, { isVerified: true }) //deleting data
          .then((user) => {
            // for sending mail
            transporter.sendMail({
              to: email,
              from: "officialfollowgram@gmail.com",
              subject: "Signup successfully",
              html: `<div>
                      <h1>Thanks for Signin Up</h1>
                      <br />
                      <p>welcome to Followgram, Start Exploring</p>
                      <br />
                   </div>`,
            });
            User.findOne({ email: email })
              .then((savedUser) => {
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                const { _id, name, email, followers, following, mediaPost, textPost, pic } = savedUser;
                res.json({
                  success: true,
                  token,
                  user: { _id, name, email, followers, following, mediaPost, textPost, pic },
                });
              })
              .catch((err) => console.error(err));
            Auth.deleteOne({ email: email })
              .then((suc) => {
                // console.log("Auth removed");
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      } else {
        return res
          .status(422)
          .json({
            success: false,
            error: "Invalid otp try again.",
          });
      }
    })
    .catch((err) => console.error(err));
});

router.post("/resendotp", (req, res) => {
  const { email } = req.body;
  // console.log("req.body is", req.body);
  crypto.randomBytes(3, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const otp = parseInt(buffer.toString("hex"), 16)
      .toString()
      .substring(0, 6);
    // console.log(otp);

    transporter.sendMail({
      to: email,
      from: "officialfollowgram@gmail.com",
      subject: "OTP verification",
      html: `<div>
            <h2>OTP for verification is</h2>
            <h1>${otp}</h1>
            <br />
            <p>Please do not share with anyone.</p>
            <p>It will be valid for the next 5 minutes.</p>
            <br />
            <h3>Thank you</h3>
        </div>`,
    });
    Auth.findOneAndUpdate({email:email},{otp:otp,expireAt:Date.now() + 300000})
    .then(auth=>{
      // console.log(auth);
      res.json({success:true,message:"Otp resend successfull"})
    }).catch(err=>
      console.error(err)
    )
  });
});

module.exports = router;
