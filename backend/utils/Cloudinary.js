const { v2 } = require("cloudinary")
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()

v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await v2.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "Library Management System",
            secure: true
        })
        console.log(response)
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        console.log("Cloudinary Error: ", error)
        fs.unlinkSync(localFilePath)
        return null;
    }
}

module.exports = uploadOnCloudinary