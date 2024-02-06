const { Schema, model } = require("mongoose")

const finesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        required: [true, "Amount is Required"]
    }
}, { timestamps: true })


module.exports = model("fine", finesSchema)