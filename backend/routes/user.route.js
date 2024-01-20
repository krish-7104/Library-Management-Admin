import express from "express"
import { addUserHandler, getUserHandler } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/", getUserHandler)
router.get("/:id", getUserHandler)
router.post("/add-user", addUserHandler)

export default router