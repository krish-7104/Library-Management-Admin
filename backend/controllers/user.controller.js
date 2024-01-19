import ApiResponse from "../utils/ApiResponse.js"
import User from "../models/user.model.js"

export const getUserHandler = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)
        if (!user) {
            res.send(new ApiResponse(204, [], "No User Found In Database!"))
        }
        res.send(new ApiResponse(200, user, "User Found Successfully!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const getAllUserHandler = async (req, res) => {
    try {
        const user = await User.find()
        if (!user) {
            res.send(new ApiResponse(204, [], "No User Found In Database!"))
        }
        res.send(new ApiResponse(200, user, "All User Get Successfully!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
