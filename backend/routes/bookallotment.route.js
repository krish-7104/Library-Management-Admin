const express = require("express")
const { issueBookHandler, deleteIssueHandler, getAllAllotmentHandler, getUserAllotmentHandler, returnBookHandler } = require("../controllers/allotment.controller.js")


const router = express.Router()

router.get("/allotment/:id", getUserAllotmentHandler)
router.get("/allotments", getAllAllotmentHandler)
router.post("/issue-book", issueBookHandler)
router.post("/return-book/:id", returnBookHandler)
router.delete("/delete-issue/:id", deleteIssueHandler)

module.exports = router