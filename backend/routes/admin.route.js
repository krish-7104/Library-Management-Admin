import express from "express"
import { addAdminHandler, adminLoginHandler, deleteAdminHandler, forgetAdminPassword, updateAdminHandler, getAdminHandler } from "../controllers/admin.controller.js"
import { adminAuthMiddleware } from "../middlewares/adminauth.middleware.js"
const router = express.Router()

router.get("/auth/get-admin", adminAuthMiddleware, getAdminHandler)
router.post("/auth/login", adminLoginHandler)
router.post("/auth/add-admin", addAdminHandler)
router.patch("/update-admin/:id", updateAdminHandler)
router.delete("/delete-admin/:id", deleteAdminHandler)
router.post("/forget-password", forgetAdminPassword)

export default router