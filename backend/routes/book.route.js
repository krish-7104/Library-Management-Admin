const express = require("express")
const { getBookHandler, getAllBooksHandler, addBookHandler, updateBookHandler, deleteBookHandler } = require("../controllers/book.controller.js")
const upload = require("../middlewares/multer.middleware.js")

const router = express.Router()

router.get("/get-book/:id", getBookHandler)
router.get("/get-books", getAllBooksHandler)
router.post("/add-book", upload.single("image"), addBookHandler)
router.patch("/update-book/:id", updateBookHandler)
router.delete("/delete-book/:id", deleteBookHandler)

module.exports = router