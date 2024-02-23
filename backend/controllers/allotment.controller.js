const ApiResponse = require("../utils/ApiResponse.js")
const User = require("../models/user.model.js")
const Book = require("../models/book.model.js")
const Allotment = require("../models/allotment.model.js")

const getUserAllotmentHandler = async (req, res) => {
    const { id } = req.params
    try {
        const allotment = await Allotment.find({ user: id })
            .populate('book');
        if (!allotment) {
            return res.status(404).json(new ApiResponse(404, [], "No Allotment Found In Database!"))
        }
        return res.status(200).json(new ApiResponse(200, allotment, "Book Allotment Found Successfully!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}
const getAllAllotmentHandler = async (req, res) => {
    try {
        const { limit, page, returned } = req.query;
        const options = {
            limit: limit || 10,
            skip: (page - 1) * 10 || 0
        };
        let query = Allotment.find({})
        if (returned) {
            const returnedValue = returned.toLowerCase() === 'true';
            query = query.where('returned').equals(returnedValue);
        }
        let allotments;
        if (limit) {
            allotments = await query.limit(options.limit).skip(options.skip).populate("book").populate({
                path: 'user',
                select: '-password'
            }).sort({ createdAt: -1 }).lean()
        }
        else {
            allotments = await query.populate("book").populate({
                path: 'user',
                select: '-password'
            }).sort({ createdAt: -1 })
        }
        if (!allotments) {
            return res.status(404).json(new ApiResponse(404, [], "No Allotment Found In Database!"))
        }
        return res.status(200).json(new ApiResponse(200, allotments, "All Allotments Get Successfully!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}
const issueBookHandler = async (req, res) => {
    try {
        const { user, book } = req.body;
        const newAllotment = await Allotment.create({ user, book })
        await Book.findByIdAndUpdate(book, { $inc: { stock: -1 } });
        await User.findByIdAndUpdate(user, {
            $push: {
                issuedHistory: newAllotment._id
            },
            $inc: {
                bookSlot: -1
            }
        })
        return res.status(201).json(new ApiResponse(201, newAllotment, "Book Issued Successfully!"))
    } catch (error) {
        console.log("Issue Book Error: \n", error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}
const returnBookHandler = async (req, res) => {
    try {
        const { id } = req.params
        const allotment = await Allotment.findOne({ _id: id })
        if (allotment.returned) {
            return res.status(409).json(new ApiResponse(409, [], "Book Already Returned!"))
        }
        await User.findByIdAndUpdate(allotment.user, {
            $inc: {
                bookSlot: 1
            }
        })
        await Book.findByIdAndUpdate(allotment.book, { $inc: { stock: 1 } });
        await Allotment.findByIdAndUpdate(id, { returned: true })
        return res.status(200).json(new ApiResponse(200, [], "Book Returned!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

const deleteIssueHandler = async (req, res) => {
    try {
        const { id } = req.params
        await Allotment.findByIdAndDelete(id)
        return res.status(200).json(new ApiResponse(200, [], "Book Allotment Deleted!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

const getCountHandler = async (req, res) => {
    try {
        const issuedBook = await Allotment.countDocuments({ returned: false })
        const allotments = await Allotment.countDocuments()
        return res.status(200).json(new ApiResponse(200, { issuedBook, allotments }, "Allotment Count Found!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

module.exports = {
    getUserAllotmentHandler,
    getAllAllotmentHandler,
    issueBookHandler,
    returnBookHandler,
    deleteIssueHandler,
    getCountHandler
}