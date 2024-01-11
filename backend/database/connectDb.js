import mongoose from "mongoose"
const DB_NAME = "Library Management System"

export const connectToMongo = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGOURI}/${DB_NAME}`)
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`.blue.underline);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}