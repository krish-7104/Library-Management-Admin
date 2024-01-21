import ApiResponse from "../utils/ApiResponse.js"
import Book from "../models/book.model.js"
import Category from "../models/category.model.js"
import uploadOnCloudinary from "../utils/Cloudinary.js"

export const getBookHandler = async (req, res) => {
    const { id } = req.params
    try {
        const book = await Book.findById(id)
        if (!book) {
            return res.send(new ApiResponse(204, [], "No Book Found In Database!"))
        }
        return res.send(new ApiResponse(200, book, "Book Found Successfully!"))
    } catch (error) {
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const getAllBooksHandler = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const options = {
            limit: limit || 10,
            skip: (page - 1) * 10 || 0
        };
        const books = await Book.find({}).sort({ createdAt: -1 }).skip(options.skip).limit(options.limit).lean()
        if (!books) {
            return res.send(new ApiResponse(204, [], "No Books Found In Database!"))
        }
        return res.send(new ApiResponse(200, books, "All Books Get Successfully!"))
    } catch (error) {
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const addBookHandler = async (req, res) => {
    try {
        const { name } = req.body
        const book = await Book.findOne({ name })
        if (book) {
            return res.send(new ApiResponse(200, [], "Book With Name Already Exixts"))
        }
        const uploadedImage = await uploadOnCloudinary(req.file.path)
        const newBook = await Book.create({ ...req.body, image: uploadedImage.url })
        await Category.findByIdAndUpdate(req.body.category, { $push: { books: newBook._id } }, { new: true });
        return res.send(new ApiResponse(201, newBook, "Book Added!"))
    } catch (error) {
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const updateBookHandler = async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findByIdAndUpdate({ id, update: req.body })
        return res.send(new ApiResponse(200, book, "Book Updated!"))
    } catch (error) {
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const deleteBookHandler = async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findById(id)
        await Book.findByIdAndDelete(id)
        await Category.findByIdAndUpdate(req.body.category, { $pop: { books: book._id } });
        return res.send(new ApiResponse(200, [], "Book Deleted!"))
    } catch (error) {
        return res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}