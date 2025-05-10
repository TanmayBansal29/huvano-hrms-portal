const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const emailTemplate = require("../mails/emailVerificationEmail")

const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    }, 
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5 // Making document deleted after 5 minutes of creation time
    },
    lastSentAt: {
        type: Date,
        default: Date.now
    },
    resendCount: {
        type: Number,
        default: 0
    }
})

// Define a function to send the emails
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(
            email,
            "Verification Mail",
            emailTemplate(otp)
        );
        console.log("Mail Response", mailResponse.response)
    } catch (error) {
        console.log("Error Occurred Sending Mail: ", error)
        throw error
    }
}

// Defining a post save hook to send email after the document has been saved
otpSchema.post("save", async function(doc, next) {
    console.log("New Document is saved to DB")
    if(doc.isNew){
        try{
            await sendVerificationEmail(doc.email, doc.otp)
        } catch (error) {
            console.log("Sending Verification Mail failed: ", error)
        }
    }
    next();
})

const OTP = mongoose.model("OTP", otpSchema)
module.exports = OTP