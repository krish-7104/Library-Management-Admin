import ApiResponse from "../utils/ApiResponse.js"
import Admin from "../models/admin.model.js"
import jwt from "jsonwebtoken"

export const adminLoginHandler = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(404).send(new ApiResponse(404, [], "Admin Not Found!"))
        }
        const isPassword = await admin.isPasswordCorrect(password)
        if (isPassword) {
            const token = jwt.sign(JSON.stringify(admin), process.env.JWTSECRETKEY)
            return res.cookie("token", token).send(new ApiResponse(200, [], "Login Successful"));
        }
        else {
            return res.status(401).send(new ApiResponse(404, [], "Invalid Credentials!"))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send(new ApiResponse(500, [], "Internal Server Error"))
    }
}

export const addAdminHandler = async (req, res) => {
    try {
        const admin = await Admin.create(req.body)
        return res.status(200).send(new ApiResponse(200, { id: admin._id, name: admin.name, role: admin.role }, "Admin Added Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).send(new ApiResponse(500, [], "Internal Server Error"))
    }
}
export const updateAdminHandler = async (req, res) => {
    try {
        const { id } = req.params
        const admin = await Admin.findByIdAndUpdate(id, req.body)
        return res.status(200).send(new ApiResponse(200, { id: admin._id, name: admin.name, role: admin.role }, "Admin Updated Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).send(new ApiResponse(500, [], "Internal Server Error"))
    }
}
export const deleteAdminHandler = async (req, res) => {
    try {
        const { id } = req.params
        await Admin.findByIdAndDelete(id)
        return res.status(200).send(new ApiResponse(200, [], "Admin Deleted Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).send(new ApiResponse(500, [], "Internal Server Error"))
    }
}

export const forgetAdminPassword = async (req, res) => {
    // 
}