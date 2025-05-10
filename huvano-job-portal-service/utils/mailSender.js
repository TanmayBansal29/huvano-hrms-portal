const nodemailer = require("nodemailer")
require("dotenv").config()

// Created a mail Sender Util that takes email, title, body
const mailSender = async (email, title, body) => {
    try {
        // Created a transporter having the attributes host, auth.user, auth.pass
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
        // On the transporter implied the send mail method
        let info = await transporter.sendMail({
            from: 'Huvano || Next Gen HRMS <no-reply@huvano.com>',
            to: email,
            subject: title,
            html: body
        })
        return info
    } catch (error) {
        console.log("Error Occurred: ", error)
        return {
            success: false,
            message: error.message
        }
    }
}

module.exports = mailSender