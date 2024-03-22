const ApiResponse = require("../utils/ApiResponse.js")
const User = require("../models/user.model.js")
const Reset = require("../models/reset.model.js")
const jwt = require("jsonwebtoken")
const { sendMailHandler } = require("../utils/mailTransporter.js")

const getUserHandler = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json(new ApiResponse(401, [], "Authorization header missing"));
        }
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWTSECRETKEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json(new ApiResponse(401, [], "Invalid token"));
            }
            const userId = decoded._id;
            const user = await User.findById(userId).select("-password").populate("issuedHistory").populate({
                path: 'issuedHistory',
                populate: {
                    path: 'book',
                }
            }).sort({ createdAt: -1 });;
            if (!user) {
                return res.status(404).json(new ApiResponse(404, [], "User not found"));
            }
            return res.status(200).json(new ApiResponse(200, user, "User data fetched successfully"));
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"));
    }
};

const getAllUserHandler = async (req, res) => {
    try {
        const users = await User.find().select("-password").populate("issuedHistory")
        return res.status(200).json(new ApiResponse(200, users, "User data fetched successfully"));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"));
    }
}

const loginUserHandler = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json(new ApiResponse(404, [], "User Not Found!"))
        }
        const isPassword = await user.isPasswordCorrect(password)
        if (isPassword) {
            const token = jwt.sign(JSON.stringify({ _id: user._id }), process.env.JWTSECRETKEY)
            return res.json(new ApiResponse(200, { token }, "Login Successful"));
        }
        else {
            return res.status(401).json(new ApiResponse(401, [], "Invalid Credentials!"))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}


const searchUserHandler = async (req, res) => {
    try {
        const { eno } = req.query
        const user = await User.findOne({ enrollmentno: parseInt(eno) }).select("-password")
        if (!user) {
            return res.status(404).json(new ApiResponse(404, [], "User Not Found!"))
        }
        return res.status(200).json(new ApiResponse(200, user, "User Found Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}

const addUserHandler = async (req, res) => {
    try {
        const user = await User.create(req.body)
        return res.status(200).json(new ApiResponse(200, { id: user._id, name: user.name }, "User Added Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}

const getCountHandler = async (req, res) => {
    try {
        const book = await User.countDocuments()
        return res.status(200).json(new ApiResponse(200, book, "Student Count Found!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}

const forgetPasswordHandler = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json(new ApiResponse(404, [], "Student Not Found!"))
        }
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWTSECRETKEY, { expiresIn: '1h' });
        const reset = await Reset.create({
            token: resetToken, type: "Student"
        })
        await sendMailHandler(email, "Reset Password - Library Management", resetPasswordHTML(reset._id, user.name))
        return res.status(200).json(new ApiResponse(200, [], "Reset Link Send To Your Mail!"))

    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}


module.exports = {
    getUserHandler,
    searchUserHandler,
    addUserHandler,
    getCountHandler,
    loginUserHandler,
    getAllUserHandler,
    forgetPasswordHandler,
}

const resetPasswordHTML = (token, name) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
    </head>
    <body>
        <p>Hello ${name}</p>
        <p>You recently requested to reset your password. Click on the link below to reset your password:</p>
        <p><a href="https://library-management-system-admin.vercel.app/user/reset-password?token=${token}">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,<br>Team GCET Library</p>
    </body>
    </html>
    `
}