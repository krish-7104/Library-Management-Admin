import Allotment from "../models/allotment.model.js";
import User from "../models/user.model.js";


export const AutoFeeIncrement = async () => {
    const allotments = await Allotment.find({ returned: true }).populate("user").populate("book")
    let today = new Date();
    for (let allotment of allotments) {
        const returnDate = new Date(allotment.returnDate)
        if (returnDate < today) {
            const user = await User.findByIdAndUpdate(allotment.user._id, { $inc: { fine: allotment.book.price } })
        }
    }
}