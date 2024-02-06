const express = require("express")
const { sendMessageHandler } = require("../controllers/communication.controller.js")
const router = express.Router()

router.post("/send-message", sendMessageHandler)

module.exports = router