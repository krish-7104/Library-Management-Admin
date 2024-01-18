import { Schema, model } from "mongoose"

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is Required"]
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: "Book"
    }]
}, { timestamps: true })

export default model("Category", categorySchema)
