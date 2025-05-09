const nodemailer = require("nodemailer")
require("dotenv")

// Created a mail Sender Util that takes email, title, body
const mailSender = async (email, title, body) => {
    try {
        // Created a transporter having the attributes host, auth.user, auth.pass
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
        // On the transporter implied the send mail method
        let info = await transporter.sendMail({
            from: 'Huvano || Next Gen HRMS',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        return info
    } catch (error) {
        console.log("Error Occured: ", error)
    }
}

module.exports = mailSender