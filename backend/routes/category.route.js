import express from "express"
import { addCategoryHandler, deleteCategoryHandler, getAllCategoryHandler, getCategoryHandler, updateCategoryHandler } from "../controllers/category.controller.js"

const router = express.Router()

router.get("/get-category/:id", getCategoryHandler)
router.get("/get-category", getAllCategoryHandler)
router.post("/add-category", addCategoryHandler)
router.patch("/update-category/:id", updateCategoryHandler)
router.delete("/delete-category/:id", deleteCategoryHandler)

export default router