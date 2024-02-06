const { Schema, model } = require("mongoose")

const allotmentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is Required"]
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
    },
    returnDate: {
        type: Date,
    },
    returned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

allotmentSchema.pre('save', function (next) {
    if (!this.returnDate) {
        const currentDate = new Date();
        const returnDate = new Date(currentDate.getTime() + (15 * 24 * 60 * 60 * 1000));
        returnDate.setHours(9, 0, 0, 0);
        this.returnDate = returnDate;
    }
    next();
});

module.exports = model("Allotment", allotmentSchema)
