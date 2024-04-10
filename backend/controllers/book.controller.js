const ApiResponse = require("../utils/ApiResponse.js")
const Book = require("../models/book.model.js")
const Category = require("../models/category.model.js")
const uploadOnCloudinary = require("../utils/Cloudinary.js")

const getBookHandler = async (req, res) => {
    const { id } = req.params
    try {
        const book = await Book.findById(id)
        if (!book) {
            return res.status(404).json(new ApiResponse(404, [], "No Book Found In Database!"))
        }
        return res.status(200).json(new ApiResponse(200, book, "Book Found Successfully!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}

const getCountHandler = async (req, res) => {
    try {
        const book = await Book.countDocuments()
        return res.status(200).json(new ApiResponse(200, book, "Book Count Found!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}

const getAllBooksHandler = async (req, res) => {
    try {
        const { limit, page, search } = req.query;
        const options = {
            limit: limit || 10,
            skip: (page - 1) * 10 || 0
        };
        const searchCondition = search ? { name: { $regex: new RegExp(search, 'i') } } : {};
        let books;
        if (limit) {
            books = await Book.find({}).sort({ createdAt: -1 }).find(searchCondition).skip(options.skip).limit(options.limit).lean()
        }
        books = await Book.find({}).sort({ createdAt: -1 }).find(searchCondition).populate("category")
        if (!books) {
            return res.status(404).json(new ApiResponse(404, [], "No Books Found In Database!"))
        }
        return res.status(200).json(new ApiResponse(200, books, "All Books Get Successfully!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}
const addBookHandler = async (req, res) => {
    try {
        const { name } = req.body
        const book = await Book.findOne({ name })
        if (book) {
            return res.status(409).json(new ApiResponse(409, [], "Book With Name Already Exixts"))
        }
        const uploadedImage = await uploadOnCloudinary(req.file.path)
        const newBook = await Book.create({ ...req.body, image: uploadedImage.secure_url })
        await Category.findByIdAndUpdate(req.body.category, { $push: { books: newBook._id } }, { new: true });
        return res.status(201).json(new ApiResponse(201, newBook, "Book Added!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}

const updateBookHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, stock, price, author } = req.body;
        const book = await Book.findByIdAndUpdate(id, { name, category, stock, price, author }, { new: true });
        return res.status(200).json(new ApiResponse(200, book, "Book Updated!"));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"));
    }
}

const deleteBookHandler = async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findById(id)
        await Book.findByIdAndDelete(id)
        await Category.findByIdAndUpdate(req.body.category, { $pop: { books: book._id } });
        return res.status(200).json(new ApiResponse(200, [], "Book Deleted!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}

module.exports = {
    getBookHandler,
    getAllBooksHandler,
    addBookHandler,
    updateBookHandler,
    deleteBookHandler,
    getCountHandler
}