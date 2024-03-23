const ApiResponse = require("../utils/ApiResponse.js")
const Category = require("../models/category.model.js")

const getCategoryHandler = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Category.findById(id).populate('books')
        if (!category) {
            return res.status(404).json(new ApiResponse(404, category, "No Category Found In Database!"))
        }
        return res.status(200).json(new ApiResponse(200, category, "Category Found Successfully!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}
const getAllCategoryHandler = async (req, res) => {
    try {
        const { book, search } = req.query;
        let category;
        const searchCondition = search ? { name: { $regex: new RegExp(search, 'i') } } : {};
        if (book) {
            category = await Category.find(searchCondition).populate('books').sort({ createdAt: -1 });
        } else {
            category = await Category.find(searchCondition).sort({ createdAt: -1 });
        }
        if (!category || category.length === 0) {
            return res.status(404).json(new ApiResponse(404, category, "No Category Found In Database!"));
        }
        return res.status(200).json(new ApiResponse(200, category, "All Category Get Successfully!"));
    } catch (error) {
        return res.status(200).json(new ApiResponse(400, error, "Internal Server Error"));
    }
};

const addCategoryHandler = async (req, res) => {
    try {
        const { name } = req.body
        const regex = new RegExp("^" + name + "$", "i");
        const category = await Category.findOne({ name: { $regex: regex } }); if (category) {
            return res.status(409).json(new ApiResponse(409, [], "Category With Name Already Exixts"))
        }
        const newCategory = await Category.create(req.body)
        return res.status(200).json(new ApiResponse(201, newCategory, "Category Added!"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}
const updateCategoryHandler = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByIdAndUpdate(id, req.body)
        return res.status(200).json(new ApiResponse(200, category, "Category Updated!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }

}
const deleteCategoryHandler = async (req, res) => {
    try {
        const { id } = req.params
        await Category.findByIdAndDelete(id)
        return res.status(200).json(new ApiResponse(200, [], "Category Deleted!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

const getCountHandler = async (req, res) => {
    try {
        const category = await Category.countDocuments()
        return res.status(200).json(new ApiResponse(200, category, "Category Count Found!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))

    }
}

module.exports = {
    getCategoryHandler,
    getAllCategoryHandler,
    addCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
    getCountHandler
}