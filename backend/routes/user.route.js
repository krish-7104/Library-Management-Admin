const express = require("express")
const { addUserHandler, getUserHandler, searchUserHandler, getCountHandler, loginUserHandler, getAllUserHandler } = require("../controllers/user.controller.js")

const router = express.Router()

router.get("/", getUserHandler)
router.get("/allusers", getAllUserHandler)
router.get("/search", searchUserHandler)
router.get("/count", getCountHandler)
router.get("/:id", getUserHandler)
router.post("/add-user", addUserHandler)
router.post("/login", loginUserHandler)

module.exports = router