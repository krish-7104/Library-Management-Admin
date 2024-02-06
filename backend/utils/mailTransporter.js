const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    },
});

const sendMailHandler = async (email, subject, html) => {
    const mailOptions = {
        from: `GCET Library ${process.env.NODEMAILER_USER}`,
        to: email,
        subject: subject,
        html: html
    };
    await transporter.sendMail(mailOptions);
}

module.exports = { transporter, sendMailHandler }