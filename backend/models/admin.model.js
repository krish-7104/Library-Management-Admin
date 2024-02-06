const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")

const adminSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is Required"]
    },
    password: {
        type: String,
        required: [true, "Password is Required"]
    },
    phonenumber: {
        type: Number,
        required: [true, "Phone Number is Required"]
    },
    email: {
        type: String,
        required: [true, "Email Address is Required"],
        unique: [true, "Email Addresss should be Unique"]
    },
    role: {
        type: String,
        enum: ["Super", "Normal"],
        default: "Normal"
    }
}, { timestamps: true })

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = model("Admin", adminSchema)
