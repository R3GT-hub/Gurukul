const { Schema, model } = require("mongoose");

const resourceSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    pdf:{
        type:String,
        // required:false
    },
    tag:{
        type:String,
        required:true,
    },
    sheetlink:{
      type:String
    },
    resourceLink:{
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

const Resource = model('Resource', resourceSchema,'resources'); // Define and export the Blog model
module.exports = Resource;
