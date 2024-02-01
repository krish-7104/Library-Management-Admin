import express from "express"
import { sendMessageHandler } from "../controllers/communication.controller.js"
const router = express.Router()

router.post("/send-message", sendMessageHandler)

export default router