import express from "express"
import { getBookHandler, getAllBooksHandler, addBookHandler, updateBookHandler, deleteBookHandler } from "../controllers/book.controller.js"
import upload from "../middlewares/multer.middleware.js"

const router = express.Router()

router.get("/get-books/:id", getBookHandler)
router.get("/get-books", getAllBooksHandler)
router.post("/add-book", upload.single("image"), addBookHandler)
router.patch("/update-book/:id", updateBookHandler)
router.delete("/delete-book/:id", deleteBookHandler)

export default router