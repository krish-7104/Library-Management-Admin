import ApiResponse from "../utils/ApiResponse.js"
import Book from "../models/book.model.js"
import User from "../models/user.model.js"
import Allotment from "../models/allotment.model.js"

export const getUserAllotmentHandler = async (req, res) => {
    const { id } = req.params
    try {
        const allotment = await Allotment.find({ user: id })
            .populate('books');
        if (!allotment) {
            return res.send(new ApiResponse(204, [], "No Allotment Found In Database!"))
        }
        return res.send(new ApiResponse(200, allotment, "Book Allotment Found Successfully!"))
    } catch (error) {
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const getAllAllotmentHandler = async (req, res) => {
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
        const allotments = await query.limit(options.limit).skip(options.skip).populate("books").populate("user").sort({ createdAt: -1 }).lean()
        if (!allotments) {
            return res.send(new ApiResponse(204, [], "No Allotment Found In Database!"))
        }
        return res.send(new ApiResponse(200, allotments, "All Allotments Get Successfully!"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const issueBookHandler = async (req, res) => {
    try {
        const { user, books } = req.body;
        const newAllotment = await Allotment.create({ user, books })
        for (const book of books) {
            await Book.findByIdAndUpdate(book, { $inc: { stock: -1 } });
        }
        await User.findByIdAndUpdate(user, {
            $push: {
                issuedHistory: newAllotment._id
            }
        })
        return res.send(new ApiResponse(201, newAllotment, "Book Allotment Created!"))
    } catch (error) {
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const returnBookHandler = async (req, res) => {
    try {
        const { id } = req.params
        const allotment = await Allotment.findOne({ _id: id })
        if (allotment.returned) {
            return res.send(new ApiResponse(204, [], "Book Already Returned!"))
        }
        for (const book of allotment.books) {
            await Book.findByIdAndUpdate(book, { $inc: { stock: 1 } });
        }
        await Allotment.findByIdAndUpdate(id, { returned: true })
        return res.send(new ApiResponse(200, [], "Book Returned!"))
    } catch (error) {
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}

export const deleteIssueHandler = async (req, res) => {
    try {
        const { id } = req.params
        await Allotment.findByIdAndDelete(id)
        return res.send(new ApiResponse(200, [], "Book Allotment Deleted!"))
    } catch (error) {
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}