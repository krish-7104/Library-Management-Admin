import express from "express"
import { GetAllFinesHandler, deleteFineHandler, finePaidHandler } from "../controllers/fines.controller.js"
const app = express.Router()

app.get("/", GetAllFinesHandler)
app.post("/add-record", finePaidHandler)
app.delete("/delete-record/:id", deleteFineHandler)

export default app