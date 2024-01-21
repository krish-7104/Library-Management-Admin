import express from "express"
import { addAdminHandler, adminLoginHandler, deleteAdminHandler, forgetAdminPassword, updateAdminHandler } from "../controllers/admin.controller.js"

const router = express.Router()

router.post("/login", adminLoginHandler)
router.post("/add-admin", addAdminHandler)
router.patch("/update-admin/:id", updateAdminHandler)
router.delete("/delete-admin/:id", deleteAdminHandler)
router.post("/forget-password", forgetAdminPassword)

export default router