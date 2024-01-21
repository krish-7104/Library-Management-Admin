import Allotment from "../models/allotment.model.js";
import { sendMailHandler } from "../utils/mailTransporter.js";

export const returnBookReminder = async () => {
    try {
        const allotments = await Allotment.find({ returned: false }).populate("user")
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1)
        for (let allotment of allotments) {
            let returnDate = new Date(allotment.returnDate);
            if ((returnDate.getFullYear() === tomorrow.getFullYear()) && (returnDate.getMonth() === tomorrow.getMonth()) && (returnDate.getDate() === tomorrow.getDate())) {
                sendMailHandler(allotment.user.email, "REMINDER To Return Library Book 📕", reminderTemplate(allotment.user.name))
            }
        }
    } catch (error) {
        console.log("Error Reminder Mail: \n", error);
    }
};


const reminderTemplate = (name) => {
    return `
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
    
        <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; text-transform: capitalize;">Return Book Reminder</h2>
            
            <p style="text-transform: capitalize;">Hello ${name},</p>
            
            <p style="text-transform: capitalize;">This is a friendly reminder to return the books that you borrowed from our library.</p>
            
            <p style="text-transform: capitalize;">The <b> return date is tomorrow</b>. Please make sure to return the book on time to avoid any late fees.</p>
            
            <p style="text-transform: capitalize;">Best regards,<br>Library Team, GCET</p>
        </div>
    </body>
`
}