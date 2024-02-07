const express = require("express")
const router = express.Router()
const { returnBookReminder } = require("../Cron Jobs/ReturnReminder.js")
const { AutoFeeIncrement } = require("../Cron Jobs/AutoFeeIncrement.js")

router.get("/auto-reminder", returnBookReminder)
router.get("/auto-increment", AutoFeeIncrement)

module.exports = router