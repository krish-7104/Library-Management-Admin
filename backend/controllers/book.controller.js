import ApiResponse from "../utils/ApiResponse.js"
import Book from "../models/book.model.js"
import uploadOnAWS from "../utils/AWSS3Storage.js"

export const getBookHandler = async (req, res) => {
    const { id } = req.params
    try {
        const book = await Book.findById(id)
        if (!book) {
            res.send(new ApiResponse(204, book, "No Book Found In Database!"))
        }
        res.send(new ApiResponse(200, book, "Book Found Successfully!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const getAllBooksHandler = async (req, res) => {
    try {
        const count = await Book.countDocuments()
        const books = await Book.find({})
        if (!books) {
            res.send(new ApiResponse(204, books, "No Books Found In Database!"))
        }
        res.send(new ApiResponse(200, { ...books, count }, "All Books Get Successfully!"))
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
        const uploadedImage = await uploadOnAWS(req.file)
        const newBook = await Book.create({ ...req.body, image: uploadedImage })
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
        const book = await Book.findByIdAndDelete(id)
        res.send(new ApiResponse(200, book, "Book Deleted!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}