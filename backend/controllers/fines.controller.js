const Fine = require("../models/fines.model.js")
const User = require("../models/user.model.js")
const ApiResponse = require("../utils/ApiResponse.js")
const { sendMailHandler } = require("../utils/mailTransporter.js")

const GetAllFinesHandler = async (req, res) => {
    try {
        const fines = await Fine.find().populate({
            path: 'user',
            select: '-password'
        }).sort({ createdAt: -1 })
        return res.status(200).json(new ApiResponse(200, fines, "All Fines Get Successfully!"))
    } catch (error) {
        console.log("GetAllFinesHandler: ", error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

const finePaidHandler = async (req, res) => {
    try {
        const { user, amount } = req.body
        const userData = await User.findByIdAndUpdate(user, {
            $inc: {
                fine: -amount
            }
        })
        const fine = await Fine.create({ user, amount })
        const subject = `Payment Confirmation: Fine Settlement`
        sendMailHandler(userData.email, subject, reminderTemplate(amount, dateFormatter(fine.createdAt), userData.name))
        return res.status(201).json(new ApiResponse(201, [], "Fine Paid Record Added!"))
    } catch (error) {
        console.log("finePaidHandler: ", error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

const deleteFineHandler = async (req, res) => {
    try {
        const { id } = req.params
        await Fine.findByIdAndDelete(id)
        return res.status(201).json(new ApiResponse(201, [], "Fine Record Deleted!"))
    } catch (error) {
        console.log("deleteFineHandler: ", error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}


const reminderTemplate = (amount, date, name) => {
    return `
    Dear <b>${name}</b>,
    <br><br>
    We are pleased to inform you that the fine of <b>₹${amount}</b> has been successfully settled by you on <b>${date}</b>. Your prompt action is greatly appreciated.
    <br><br>
    Should you have any further inquiries or require assistance, please do not hesitate to contact us.
    <br><br>
    Thank you for your cooperation.
    <br><br>
    Best regards,<br>
    GCET Library
`
}


const dateFormatter = (date) => {
    const tempDate = new Date(date)
    const newDate = `${tempDate.getDate()}-${tempDate.getMonth() + 1}-${tempDate.getFullYear()}`
    return newDate
}

const GetCountHandler = async (req, res) => {
    try {
        const data = await Fine.countDocuments()
        return res.status(200).json(new ApiResponse(200, data, "Fines Count Found!"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}

module.exports = {
    GetAllFinesHandler,
    finePaidHandler,
    deleteFineHandler,
    dateFormatter,
    GetCountHandler
}