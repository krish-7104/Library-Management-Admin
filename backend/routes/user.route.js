import express from "express"
import { addUserHandler, getUserHandler, searchUserHandler } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/", getUserHandler)
router.get("/search", searchUserHandler)
router.get("/:id", getUserHandler)
router.post("/add-user", addUserHandler)

export default router