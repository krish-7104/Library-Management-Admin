import ApiResponse from "../utils/ApiResponse.js"
import User from "../models/user.model.js"

export const getUserHandler = async (req, res) => {
    const { id } = req.params
    try {
        let user;
        if (id) {
            user = await User.findById(id)
        } else {
            user = await User.find().sort({ createdAt: -1 })
        }
        if (!user) {
            return res.status(404).send(new ApiResponse(404, [], "No User Found In Database!"))
        }
        return res.status(200).send(new ApiResponse(200, user, "User Found Successfully!"))
    } catch (error) {
        return res.status(500).send(new ApiResponse(500, [], "Internal Server Error"))

    }
}

export const addUserHandler = async (req, res) => {
    try {
        const user = await User.create(req.body)
        return res.status(200).send(new ApiResponse(200, { id: user._id, name: user.name }, "User Added Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).send(new ApiResponse(500, [], "Internal Server Error"))

    }
}
