import express from "express"
import dotenv from "dotenv"
import { connectToMongo } from "./database/connectDb.js"
import colors from "colors"
import bookRoutes from "./routes/book.route.js"
import categoryRoutes from "./routes/category.route.js"
import bookAllotmentRoutes from "./routes/bookallotment.route.js"
import userRoutes from "./routes/user.route.js"

dotenv.config()
connectToMongo()

const port = process.env.PORT || 5000
const app = express()
app.use(express.json())

app.use("/api/book", bookRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/book-allotment", bookAllotmentRoutes)
app.use("/api/user", userRoutes)

app.listen(port, () => {
    console.log(`Server Started on Port:${port}`.bold)
})