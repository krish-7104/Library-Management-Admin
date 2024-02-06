const { Schema, model } = require("mongoose")

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

module.exports = model("Category", categorySchema)
