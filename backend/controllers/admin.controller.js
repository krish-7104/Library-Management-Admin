const jwt = require("jsonwebtoken")
const ApiResponse = require("../utils/ApiResponse.js")
const Admin = require("../models/admin.model.js")
const Reset = require("../models/reset.model.js")
const User = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const { sendMailHandler } = require("../utils/mailTransporter.js")


const adminLoginHandler = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(404).json(new ApiResponse(404, [], "Admin Not Found!"))
        }
        const isPassword = await admin.isPasswordCorrect(password)
        if (isPassword) {
            const token = jwt.sign(JSON.stringify({ _id: admin._id }), process.env.JWTSECRETKEY)
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

const getAllAdminHandler = async (req, res) => {
    try {
        const admin = await Admin.find().select("-password")
        return res.status(200).json(new ApiResponse(200, admin, "Admins Found!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

const getUserDetails = async (req, res) => {
    res.status(200).json(new ApiResponse(200, req.admin, "User Details Found!"))
}

const getAdminHandler = async (req, res) => {
    try {
        const { id } = req.params
        const admin = await Admin.findById(id).select("-password")
        if (!admin) {
            return res.status(404).json(new ApiResponse(404, [], "Admin Not Found!"))
        }
        return res.status(200).json(new ApiResponse(200, admin, "Admin Found!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

const addAdminHandler = async (req, res) => {
    try {
        const admin = await Admin.create(req.body)
        return res.status(200).json(new ApiResponse(200, { id: admin._id, name: admin.name, role: admin.role }, "Admin Added Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}
const updateAdminHandler = async (req, res) => {
    try {
        const { id } = req.params
        const admin = await Admin.findByIdAndUpdate(id, req.body)
        return res.status(200).json(new ApiResponse(200, { id: admin._id, name: admin.name, role: admin.role }, "Admin Updated Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}
const deleteAdminHandler = async (req, res) => {
    try {
        const { id } = req.params
        await Admin.findByIdAndDelete(id)
        return res.status(200).json(new ApiResponse(200, [], "Admin Deleted Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

const forgetPasswordHandler = async (req, res) => {
    try {
        const { email } = req.body
        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(404).json(new ApiResponse(404, [], "Admin Not Found!"))
        }
        const resetToken = jwt.sign({ userId: admin._id }, process.env.JWTSECRETKEY, { expiresIn: '1h' });
        const reset = await Reset.create({
            token: resetToken, type: "Admin"
        })
        await sendMailHandler(email, "Reset Password - Library Management", resetPasswordHTML(reset._id, admin.name))
        return res.status(200).json(new ApiResponse(200, [], "Reset Link Send To Your Mail!"))

    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}

const updatePasswordHandler = async (req, res) => {
    const { token, password } = req.body;
    try {
        if (!token) {
            return res.status(404).json(new ApiResponse(404, [], "Token Not Found!"))
        }
        const resetTokenData = await Reset.findById(token)
        if (!resetTokenData) {
            return res.status(404).json(new ApiResponse(404, [], "Token Not Found!"))
        }
        try {
            const tokenData = jwt.verify(resetTokenData.token, process.env.JWTSECRETKEY);

            const hashedPassword = await bcrypt.hash(password, 10);

            if (resetTokenData.type === "Admin")
                await Admin.findByIdAndUpdate(tokenData.userId, { password: hashedPassword });
            else if (resetTokenData.type === "Student")
                await User.findByIdAndUpdate(tokenData.userId, { password: hashedPassword });
            await Reset.findByIdAndDelete(token);
            return res.status(200).json(new ApiResponse(200, [], "Password updated successfully!"))
        } catch (error) {
            console.error('Error verifying JWT:', error);
            return res.status(401).json(new ApiResponse(401, [], "Invalid Token!"))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
};

const getCountHandler = async (req, res) => {
    try {
        const admin = await Admin.countDocuments()
        return res.status(200).json(new ApiResponse(200, admin, "Admins Count Found!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}


module.exports = {
    adminLoginHandler, getAdminHandler,
    addAdminHandler,
    updateAdminHandler,
    deleteAdminHandler,
    forgetPasswordHandler,
    updatePasswordHandler,
    getAllAdminHandler,
    getUserDetails,
    getCountHandler
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