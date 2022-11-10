const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const usercollectionSchema = new mongoose.Schema({
    name: String,
    createdBy: {
        type: ObjectId,
        ref: "User"
    },
    imagePost: [
        { type: ObjectId, ref: "Post" }
    ],
    textPost: [
        { type: ObjectId, ref: "Post" }
    ]
}, { timestamps: true })

mongoose.model("Usercollection", usercollectionSchema);