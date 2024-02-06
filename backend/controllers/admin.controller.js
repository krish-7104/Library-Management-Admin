const jwt = require("jsonwebtoken")
const ApiResponse = require("../utils/ApiResponse.js")
const Admin = require("../models/admin.model.js")

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
            return res.status(401).json(new ApiResponse(404, [], "Invalid Credentials!"))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

const getAdminHandler = async (req, res) => {
    res.status(200).json(new ApiResponse(200, req.admin, "User Details Found!"))
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

const forgetAdminPassword = async (req, res) => {
    // 
}

module.exports = {
    adminLoginHandler, getAdminHandler,
    addAdminHandler,
    updateAdminHandler,
    deleteAdminHandler,
    forgetAdminPassword
}