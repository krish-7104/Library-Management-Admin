const express = require("express")
const { GetAllFinesHandler, deleteFineHandler, finePaidHandler, GetCountHandler } = require("../controllers/fines.controller.js")
const app = express.Router()

app.get("/", GetAllFinesHandler)
app.get("/count", GetCountHandler)
app.post("/add-record", finePaidHandler)
app.delete("/delete-record/:id", deleteFineHandler)

module.exports = app