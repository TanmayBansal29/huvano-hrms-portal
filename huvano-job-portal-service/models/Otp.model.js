const mongoose = require("mongoose")

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
    }
})



module.exports = mongoose.model("OTP", otpSchema)