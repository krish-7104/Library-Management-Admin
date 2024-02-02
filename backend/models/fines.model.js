import { Schema, model } from "mongoose"

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


export default model("fine", finesSchema)