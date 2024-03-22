const { Schema, model } = require("mongoose")

const resetSchema = new Schema({
    token: {
        type: String,
        required: [true, "Token is Required"]
    },
    type: {
        type: String,
        required: [true, "Type is Required"]
    },
}, { timestamps: true })



module.exports = model("Reset Token", resetSchema)
