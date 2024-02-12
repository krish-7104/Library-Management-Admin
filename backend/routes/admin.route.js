const express = require("express")
const { addAdminHandler, adminLoginHandler, deleteAdminHandler, forgetAdminPassword, updateAdminHandler, getAdminHandler, getAllAdminHandler, getUserDetails } = require("../controllers/admin.controller.js")
const { adminAuthMiddleware } = require("../middlewares/adminauth.middleware.js")
const router = express.Router()

router.get("/auth/get-user", adminAuthMiddleware, getUserDetails)
router.post("/auth/login", adminLoginHandler)
router.post("/auth/add-admin", adminAuthMiddleware, addAdminHandler)

router.get("/get-admin/:id", adminAuthMiddleware, getAdminHandler)
router.get("/get-admins", adminAuthMiddleware, getAllAdminHandler)
router.patch("/update-admin/:id", updateAdminHandler)
router.delete("/delete-admin/:id", deleteAdminHandler)
router.post("/forget-password", forgetAdminPassword)

module.exports = router