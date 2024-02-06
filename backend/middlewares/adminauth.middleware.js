const Admin = require("../models/admin.model.js")
const ApiResponse = require("../utils/ApiResponse.js")
const jwt = require("jsonwebtoken")

const adminAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json(new ApiResponse(401, [], "Unauthorized - Token Missing"))
        }
        const decodedToken = jwt.verify(token, process.env.JWTSECRETKEY);
        const admin = await Admin.findById(decodedToken._id).select("-password")

        if (!admin) {
            return res.status(401).json(new ApiResponse(401, [], "Unauthorized - Invalid Token"))
        }
        req.admin = admin;
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

module.exports = { adminAuthMiddleware }