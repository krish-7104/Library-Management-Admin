import ApiResponse from "../utils/ApiResponse.js"
import Category from "../models/category.model.js"

export const getCategoryHandler = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Category.findById(id).populate('books')
        if (!category) {
            res.send(new ApiResponse(204, category, "No Category Found In Database!"))
        }
        res.send(new ApiResponse(200, category, "Category Found Successfully!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const getAllCategoryHandler = async (req, res) => {
    try {
        const category = await Category.find({}).populate('books')
        if (!category) {
            res.send(new ApiResponse(204, category, "No Category Found In Database!"))
        }
        res.send(new ApiResponse(200, category, "All Category Get Successfully!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const addCategoryHandler = async (req, res) => {
    try {
        const { name } = req.body
        const category = await Category.findOne({ name })
        if (category) {
            res.send(new ApiResponse(200, [], "Category With Name Already Exixts"))
        }
        const newCategory = await Category.create(req.body)
        res.send(new ApiResponse(201, newCategory, "Category Added!"))
    } catch (error) {
        console.log(error)
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}
export const updateCategoryHandler = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByIdAndUpdate(id, req.body)
        res.send(new ApiResponse(200, category, "Category Updated!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }

}
export const deleteCategoryHandler = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByIdAndDelete(id)
        res.send(new ApiResponse(200, [], "Category Deleted!"))
    } catch (error) {
        res.send(new ApiResponse(400, error, "Internal Server Error"))
    }
}