const express = require("express")
const { addCategoryHandler, deleteCategoryHandler, getAllCategoryHandler, getCategoryHandler, updateCategoryHandler } = require("../controllers/category.controller.js")

const router = express.Router()

router.get("/get-category/:id", getCategoryHandler)
router.get("/get-category", getAllCategoryHandler)
router.post("/add-category", addCategoryHandler)
router.patch("/update-category/:id", updateCategoryHandler)
router.delete("/delete-category/:id", deleteCategoryHandler)

module.exports = router