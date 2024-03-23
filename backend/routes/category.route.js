const express = require("express")
const { addCategoryHandler, deleteCategoryHandler, getAllCategoryHandler, getCategoryHandler, updateCategoryHandler, getCountHandler } = require("../controllers/category.controller.js")
const { adminAuthMiddleware } = require("../middlewares/adminauth.middleware.js")

const router = express.Router()

router.get("/get-category/:id", getCategoryHandler)
router.get("/get-category", getAllCategoryHandler)
router.post("/add-category", adminAuthMiddleware, addCategoryHandler)
router.patch("/update-category/:id", updateCategoryHandler)
router.delete("/delete-category/:id", deleteCategoryHandler)
router.get("/count", getCountHandler)

module.exports = router