import ApiResponse from "../utils/ApiResponse.js"
import Admin from "../models/admin.model.js"

export const getAdminHandler = async (req, res) => {
    const { id } = req.params
    try {
        let admin;
        if (id) {
            admin = await Admin.findById(id)
        } else {
            admin = await Admin.find().sort({ createdAt: -1 })
        }
        if (!admin) {
            return res.send(new ApiResponse(204, [], "No Admin Found In Database!"))
        }
        return res.send(new ApiResponse(200, admin, "Admin Found Successfully!"))
    } catch (error) {
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}

export const addAdminHandler = async (req, res) => {
    try {
        const admin = await Admin.create(req.body)
        return res.send(new ApiResponse(200, { id: admin._id, name: admin.name, role: admin.role }, "Admin Added Successfully!"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const updateAdminHandler = async (req, res) => {
    try {
        const { id } = req.params
        const admin = await Admin.findByIdAndUpdate(id, req.body)
        return res.send(new ApiResponse(200, { id: admin._id, name: admin.name, role: admin.role }, "Admin Updated Successfully!"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const deleteAdminHandler = async (req, res) => {
    try {
        const { id } = req.params
        await Admin.findByIdAndDelete(id)
        return res.send(new ApiResponse(200, [], "Admin Deleted Successfully!"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}

export const forgetAdminPassword = async (req, res) => {
    // 
}