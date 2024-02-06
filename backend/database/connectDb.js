const mongoose = require("mongoose")
const DB_NAME = "Library-Management-System"

const connectToMongo = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGOURI}/${DB_NAME}`)
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

module.exports = { connectToMongo }