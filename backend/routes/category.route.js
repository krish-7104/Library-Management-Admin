import express from "express"
import { addCategoryHandler, deleteCategoryHandler, getAllCategoryHandler, getCategoryHandler, updateCategoryHandler } from "../controllers/category.controller.js"

const router = express.Router()

router.get("/getcategory/:id", getCategoryHandler)
router.get("/getcategory", getAllCategoryHandler)
router.post("/addcategory", addCategoryHandler)
router.patch("/updatecategory/:id", updateCategoryHandler)
router.delete("/deletecategory/:id", deleteCategoryHandler)

export default router