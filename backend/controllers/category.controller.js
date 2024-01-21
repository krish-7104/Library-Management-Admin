import ApiResponse from "../utils/ApiResponse.js"
import Category from "../models/category.model.js"

export const getCategoryHandler = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Category.findById(id).populate('books')
        if (!category) {
            return res.status(404).send(new ApiResponse(404, category, "No Category Found In Database!"))
        }
        return res.status(200).send(new ApiResponse(200, category, "Category Found Successfully!"))
    } catch (error) {
        return res.status(500).send(new ApiResponse(500, [], "Internal Server Error"))
    }
}
export const getAllCategoryHandler = async (req, res) => {
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
            return res.status(404).send(new ApiResponse(404, category, "No Category Found In Database!"));
        }
        return res.status(200).send(new ApiResponse(200, category, "All Category Get Successfully!"));
    } catch (error) {
        return res.status(200).send(new ApiResponse(400, error, "Internal Server Error"));
    }
};

export const addCategoryHandler = async (req, res) => {
    try {
        const { name } = req.body
        const category = await Category.findOne({ name })
        if (category) {
            return res.status(204).send(new ApiResponse(204, [], "Category With Name Already Exixts"))
        }
        const newCategory = await Category.create(req.body)
        return res.status(200).send(new ApiResponse(201, newCategory, "Category Added!"))
    } catch (error) {
        console.log(error)
        return res.status(500).send(new ApiResponse(500, [], "Internal Server Error"))
    }
}
export const updateCategoryHandler = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByIdAndUpdate(id, req.body)
        return res.status(200).send(new ApiResponse(200, category, "Category Updated!"))
    } catch (error) {
        return res.status(500).send(new ApiResponse(500, [], "Internal Server Error"))
    }

}
export const deleteCategoryHandler = async (req, res) => {
    try {
        const { id } = req.params
        await Category.findByIdAndDelete(id)
        return res.status(200).send(new ApiResponse(200, [], "Category Deleted!"))
    } catch (error) {
        return res.status(500).send(new ApiResponse(500, [], "Internal Server Error"))
    }
}