const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now, // Set a default value for the field
        index: { expires: '5d' }, // Set TTL index to expire documents after 1 day
    },
    jobLink:{
        type:String,
        required:true
    },
    coverImageURL: {
        type: String,
        // required:false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
}, { timestamps: true });

const Blog = model('Blog', blogSchema,'blogs'); // Define and export the Blog model
module.exports = Blog;
