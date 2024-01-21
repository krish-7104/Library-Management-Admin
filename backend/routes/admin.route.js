import express from "express"
import { addAdminHandler, deleteAdminHandler, forgetAdminPassword, getAdminHandler, updateAdminHandler } from "../controllers/admin.controller.js"

const router = express.Router()

router.get("/get-admin/:id", getAdminHandler)
router.get("/get-admins", getAdminHandler)
router.post("/add-admin", addAdminHandler)
router.patch("/update-admin/:id", updateAdminHandler)
router.delete("/delete-admin/:id", deleteAdminHandler)
router.post("/forget-password", forgetAdminPassword)

export default router