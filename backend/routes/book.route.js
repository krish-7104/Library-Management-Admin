const express = require("express")
const { getBookHandler, getAllBooksHandler, addBookHandler, updateBookHandler, deleteBookHandler, getCountHandler } = require("../controllers/book.controller.js")
const { adminAuthMiddleware } = require("../middlewares/adminauth.middleware.js")
const upload = require("../middlewares/multer.middleware.js")

const router = express.Router()

router.get("/get-book/:id", getBookHandler)
router.get("/get-books", getAllBooksHandler)
router.get("/count", getCountHandler)
router.post("/add-book", adminAuthMiddleware, upload.single("image"), addBookHandler)
router.patch("/update-book/:id", updateBookHandler)
router.delete("/delete-book/:id", deleteBookHandler)

module.exports = router