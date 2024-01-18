import { Schema, model } from "mongoose"

const bookSchema = new Schema({
    name: {
        type: String,
        required: [true, "Book Name is Required"]
    },
    image: {
        type: String,
        required: [true, "Book Image is Required"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Book Category is Required"]
    },
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "Book Price is Required"]
    },
    author: {
        type: String
    }
}, { timestamps: true })

export default model("Book", bookSchema)
