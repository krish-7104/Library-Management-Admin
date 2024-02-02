import express from "express"
import dotenv from "dotenv"
import cron from "node-cron"
import morgan from "morgan"
import cors from "cors"
import { connectToMongo } from "./database/connectDb.js"
import bookRoutes from "./routes/book.route.js"
import categoryRoutes from "./routes/category.route.js"
import bookAllotmentRoutes from "./routes/bookallotment.route.js"
import userRoutes from "./routes/user.route.js"
import adminRoutes from "./routes/admin.route.js"
import { returnBookReminder } from "./Cron Jobs/ReturnReminder.js"
import { AutoFeeIncrement } from "./Cron Jobs/AutoFeeIncrement.js"
import communicationRoutes from "./routes/communication.route.js"
import finesRoute from "./routes/fines.route.js"

dotenv.config()
connectToMongo()

const port = process.env.PORT || 5000
export const app = express()

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.use(morgan(':method :url :status :response-time ms'));
}

app.use(express.json())
app.use(cors({ credentials: true, origin: process.env.FRONTEND_LINK }));

app.use("/api/book", bookRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/book-allotment", bookAllotmentRoutes)
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/communication", communicationRoutes)
app.use("/api/fines", finesRoute)

cron.schedule('0 9 * * *', () => {
    returnBookReminder()
    AutoFeeIncrement()
});


app.listen(port, () => {
    console.log(`Server Started on Port:${port}`.bold)
})