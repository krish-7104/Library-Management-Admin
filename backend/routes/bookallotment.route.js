import express from "express"
import { addAllotmentHandler, deleteAllotmentHandler, getAllAllotmentHandler, getUserAllotmentHandler, updateAllotmentHandler } from "../controllers/allotment.controller.js"


const router = express.Router()

router.get("/allotment/:id", getUserAllotmentHandler)
router.get("/allotments", getAllAllotmentHandler)
router.post("/add-allotment", addAllotmentHandler)
router.patch("/update-allotment/:id", updateAllotmentHandler)
router.delete("/delete-allotment/:id", deleteAllotmentHandler)

export default router