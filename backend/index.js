const express = require("express")
const dotenv = require("dotenv")
const cron = require("node-cron")
const morgan = require("morgan")
const cors = require("cors")
const { connectToMongo } = require("./database/connectDb.js")
const bookRoutes = require("./routes/book.route.js")
const categoryRoutes = require("./routes/category.route.js")
const bookAllotmentRoutes = require("./routes/bookallotment.route.js")
const userRoutes = require("./routes/user.route.js")
const adminRoutes = require("./routes/admin.route.js")
const { returnBookReminder } = require("./Cron Jobs/ReturnReminder.js")
const { AutoFeeIncrement } = require("./Cron Jobs/AutoFeeIncrement.js")
const communicationRoutes = require("./routes/communication.route.js")
const finesRoute = require("./routes/fines.route.js")
const cronRoute = require("./routes/cronjob.route.js")
const path = require('path');

dotenv.config()
connectToMongo()

const port = process.env.PORT || 5000
const app = express()

const staticPath = path.join(__dirname, 'reset-password');

app.use('/user/reset-password', express.static(staticPath));


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
app.use("/api/cron", cronRoute)

cron.schedule('0 9 * * *', () => {
    returnBookReminder()
    AutoFeeIncrement()
});


app.listen(port, () => {
    console.log(`Server Started on Port:${port}`)
})

