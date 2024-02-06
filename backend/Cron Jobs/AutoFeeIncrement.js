const Allotment = require("../models/allotment.model.js");
const User = require("../models/user.model.js");


const AutoFeeIncrement = async () => {
    const allotments = await Allotment.find({ returned: true }).populate({
        path: 'user',
        select: '-password'
    }).populate("book")
    let today = new Date();
    for (let allotment of allotments) {
        const returnDate = new Date(allotment.returnDate)
        if (returnDate < today) {
            const user = await User.findByIdAndUpdate(allotment.user._id, { $inc: { fine: allotment.book.price } })
        }
    }
}
module.exports = { AutoFeeIncrement }