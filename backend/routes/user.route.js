const express = require("express")
const { addUserHandler, getUserHandler, searchUserHandler, getCountHandler } = require("../controllers/user.controller.js")

const router = express.Router()

router.get("/", getUserHandler)
router.get("/search", searchUserHandler)
router.get("/count", getCountHandler)
router.get("/:id", getUserHandler)
router.post("/add-user", addUserHandler)

module.exports = router