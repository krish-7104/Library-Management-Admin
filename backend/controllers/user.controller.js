const ApiResponse = require("../utils/ApiResponse.js")
const User = require("../models/user.model.js")
const jwt = require("jsonwebtoken")

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

module.exports = {
    getUserHandler,
    searchUserHandler,
    addUserHandler,
    getCountHandler,
    loginUserHandler, getAllUserHandler
}