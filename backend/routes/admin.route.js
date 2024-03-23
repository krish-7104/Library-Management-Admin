const express = require("express")
const { addAdminHandler, adminLoginHandler, deleteAdminHandler, forgetPasswordHandler, updateAdminHandler, getAdminHandler, getAllAdminHandler, getUserDetails, updatePasswordHandler, getCountHandler } = require("../controllers/admin.controller.js")
const { adminAuthMiddleware } = require("../middlewares/adminauth.middleware.js")
const router = express.Router()

router.get("/auth/get-user", adminAuthMiddleware, getUserDetails)
router.post("/auth/login", adminLoginHandler)
router.post("/auth/add-admin", adminAuthMiddleware, addAdminHandler)

router.get("/get-admin/:id", adminAuthMiddleware, getAdminHandler)
router.get("/get-admins", adminAuthMiddleware, getAllAdminHandler)
router.patch("/update-admin/:id", updateAdminHandler)
router.delete("/delete-admin/:id", deleteAdminHandler)
router.post("/forget-password", forgetPasswordHandler)
router.post("/update-password", updatePasswordHandler)
router.get("/count", getCountHandler)

module.exports = router