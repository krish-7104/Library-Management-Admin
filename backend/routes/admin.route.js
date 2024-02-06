const express = require("express")
const { addAdminHandler, adminLoginHandler, deleteAdminHandler, forgetAdminPassword, updateAdminHandler, getAdminHandler } = require("../controllers/admin.controller.js")
const { adminAuthMiddleware } = require("../middlewares/adminauth.middleware.js")
const router = express.Router()

router.get("/auth/get-admin", adminAuthMiddleware, getAdminHandler)
router.post("/auth/login", adminLoginHandler)
router.post("/auth/add-admin", addAdminHandler)
router.patch("/update-admin/:id", updateAdminHandler)
router.delete("/delete-admin/:id", deleteAdminHandler)
router.post("/forget-password", forgetAdminPassword)

module.exports = router