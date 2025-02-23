const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    phonenumber: {
      type: Number,
      required: [true, "Phone Number is Required"],
    },
    email: {
      type: String,
      required: [true, "Email Address is Required"],
      unique: [true, "Email Addresss should be Unique"],
    },
    enrollmentno: {
      type: Number,
      required: [true, "Enrollment No. is Required"],
      unique: [true, "Enrollment No. should be Unique"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    fine: {
      type: Number,
      default: 0,
    },
    bookSlot: {
      type: Number,
      default: 5,
    },
    issuedHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Allotment",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("User", userSchema);
