import ApiResponse from "../utils/ApiResponse.js"
import User from "../models/user.model.js"
import Allotment from "../models/allotment.model.js"

export const getUserAllotmentHandler = async (req, res) => {
    const { id } = req.params
    try {
        const allotment = await Allotment.find({ user: id })
            .populate('books');
        if (!allotment) {
            res.send(new ApiResponse(204, [], "No Allotment Found In Database!"))
        }
        res.send(new ApiResponse(200, allotment, "Book Allotment Found Successfully!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const getAllAllotmentHandler = async (req, res) => {
    try {
        const allotments = await Allotment.find({}).populate("books").populate("user")
        if (!allotments) {
            res.send(new ApiResponse(204, [], "No Allotment Found In Database!"))
        }
        res.send(new ApiResponse(200, allotments, "All Allotments Get Successfully!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const addAllotmentHandler = async (req, res) => {
    try {
        const { user, books } = req.body;
        const isValidUser = await User.findById(user);
        const newAllotment = await Allotment.create({ user, books })
        res.send(new ApiResponse(201, newAllotment, "Book Allotment Created!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const updateAllotmentHandler = async (req, res) => {
    try {
        const { id } = req.params
        const book = await Allotment.findByIdAndUpdate({ id, update: req.body })
        res.send(new ApiResponse(200, book, "Book Allotment Updated!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const deleteAllotmentHandler = async (req, res) => {
    try {
        const { id } = req.params
        await Allotment.findByIdAndDelete(id)
        res.send(new ApiResponse(200, [], "Book Allotment Deleted!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}