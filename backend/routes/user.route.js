import express from "express"
import { getUserHandler, getAllUserHandler } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/get/:id", getUserHandler)
router.get("/get", getAllUserHandler)

export default router