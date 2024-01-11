import ApiResponse from "../utils/ApiResponse.js"

export const getBookHandler = async (req, res) => {
    const { id } = req.params
    res.json(new ApiResponse(200, { "Id": id }, "We Get id"))
}
export const getAllBooksHandler = async (req, res) => {

}
export const addBookHandler = async (req, res) => {

}
export const updateBookHandler = async (req, res) => {

}
export const deleteBookHandler = async (req, res) => {

}