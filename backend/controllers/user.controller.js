import ApiResponse from "../utils/ApiResponse.js"
import User from "../models/user.model.js"

export const getUserHandler = async (req, res) => {
    const { id } = req.params
    try {
        let user;
        if (id) {
            user = await User.findById(id).populate("issuedHistory").select("-password")
        } else {
            user = await User.find().populate("issuedHistory").select("-password").sort({ createdAt: -1 })
        }
        if (!user) {
            return res.status(404).json(new ApiResponse(404, [], "No User Found In Database!"))
        }
        return res.status(200).json(new ApiResponse(200, user, "User Found Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}

export const searchUserHandler = async (req, res) => {
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

export const addUserHandler = async (req, res) => {
    try {
        const user = await User.create(req.body)
        return res.status(200).json(new ApiResponse(200, { id: user._id, name: user.name }, "User Added Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}
