import ApiResponse from "../utils/ApiResponse.js"
import Book from "../models/book.model.js"
import Category from "../models/category.model.js"
import uploadOnCloudinary from "../utils/Cloudinary.js"

export const getBookHandler = async (req, res) => {
    const { id } = req.params
    try {
        const book = await Book.findById(id)
        if (!book) {
            res.send(new ApiResponse(204, [], "No Book Found In Database!"))
        }
        res.send(new ApiResponse(200, book, "Book Found Successfully!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const getAllBooksHandler = async (req, res) => {
    try {
        const books = await Book.find({})
        if (!books) {
            res.send(new ApiResponse(204, [], "No Books Found In Database!"))
        }
        res.send(new ApiResponse(200, books, "All Books Get Successfully!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const addBookHandler = async (req, res) => {
    try {
        const { name } = req.body
        const book = await Book.findOne({ name })
        if (book) {
            res.send(new ApiResponse(200, [], "Book With Name Already Exixts"))
        }
        console.log(req.file)
        const uploadedImage = await uploadOnCloudinary(req.file.path)
        const newBook = await Book.create({ ...req.body, image: uploadedImage.url })
        await Category.findByIdAndUpdate(req.body.category, { $push: { books: newBook._id } }, { new: true });
        res.send(new ApiResponse(201, newBook, "Book Added!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const updateBookHandler = async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findByIdAndUpdate({ id, update: req.body })
        res.send(new ApiResponse(200, book, "Book Updated!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const deleteBookHandler = async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findById(id)
        await Book.findByIdAndDelete(id)
        await Category.findByIdAndUpdate(req.body.category, { $pop: { books: book._id } });
        res.send(new ApiResponse(200, [], "Book Deleted!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}