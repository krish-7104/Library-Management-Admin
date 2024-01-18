import express from "express"
import { getBookHandler, getAllBooksHandler, addBookHandler, updateBookHandler, deleteBookHandler } from "../controllers/book.controller.js"
import upload from "../middlewares/multer.middleware.js"

const router = express.Router()

router.get("/getbooks/:id", getBookHandler)
router.get("/getbooks", getAllBooksHandler)
router.post("/addbook", upload.single("image"), addBookHandler)
router.patch("/updatebook/:id", updateBookHandler)
router.delete("/deletebook/:id", deleteBookHandler)

export default router