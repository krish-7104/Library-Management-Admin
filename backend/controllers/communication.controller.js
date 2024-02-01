import ApiResponse from "../utils/ApiResponse.js"
import { sendMailHandler } from "../utils/mailTransporter.js"


const reminderTemplate = (name, subject, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Response</title> 
        <style>
            table {
                border-collapse: collapse;
                width: 100%;
            }
    
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
    
            th {
                background-color: #f2f2f2;
            }
    
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <h2>Message From GCET Library</h2>
        <table>
        <table>
        <tr>
            <th>Name</th>
            <td>${name}</td>
        </tr>
        <tr>
            <th>Subject</th>
            <td>${subject}</td>
        </tr>
        <tr>
            <th>Message</th>
            <td>${message}</td>
        </tr>
        </table>
    </body>
    </html>
`
}

export const sendMessageHandler = async (req, res) => {
    try {
        const { email, name, subject, message } = req.body
        sendMailHandler(email, subject, reminderTemplate(name, subject, message))
        return res.status(200).json(new ApiResponse(200, [], "Message Send Successfully!"))
    } catch (error) {
        console.log("🚀 ~ sendMessageHandler ~ ̥:", error)
        return res.status(500).json(new ApiResponse(500, [], "Internal Server Error"))
    }
}