const CandidateProfile = require("../models/CandidateProfile.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const mailSender = require("../utils/mailSender")
const validator = require("validator")
const { resetPasswordTemplate } = require("../mails/resetPasswordEmail")
require("dotenv").config()

// Controller for sending the reset email when candidate forgots the password
exports.forgotPassword = async (req, res) => {
    try {
        // Getting the email from req.body
        const {emailAddress} = req.body
        
        const user = await CandidateProfile.findOne({emailAddress})

        // Check - 1 If user exists with this mail or not
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "No Account found with this email"
            })
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString("hex")
        // const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

        // Set Reset Token and expiry (15 minutes)
        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000
        await user.save()

        // Send Reset email
        const resetUrl = `https://localhost:3000/reset-password/${resetToken}`
        await mailSender(
            emailAddress,
            "Password Reset Request",
            resetPasswordTemplate(user.firstName, resetUrl)
        )

        return res.status(200).json({
            success: true,
            message: "Password Reset Email Sent"
        })

    } catch (error) {
        console.log("Forgot Password Error: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong sending reset email"
        })
    }
}

// Controller for resetting the password
exports.resetPassword = async(req, res) => {
    try {
        // Getting token, new Password and confirm password from req.body
        const { token, newPassword, confirmNewPassword} = req.body

        // Finding the user from the Database
        const user = await CandidateProfile.findOne({resetPasswordToken: token})

        // Check - 1 If token is invalid or expired
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            })
        }

        // Check - 2 If password and confirm password are same or not
        if(newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm password are not same"
            })
        }

        // Check - 3 If Reset Token expired or not
        if(!(user.resetPasswordExpires > Date.now())) {
            return res.status(400).json({
                success: false,
                message: "Reset Link Expired, Please regenerate reset link"
            })
        }

        // validating the new password
        const isStrong = validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        })

        if(!isStrong) {
            return res.status(404).json({
                success: false,
                message: "Password must be at least 8 character long and include uppercase, lowercase, number and symbol"
            })
        }

        // Updating the password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        })

    } catch (error) {
        console.log("Error Resetting password: ", error)
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong while reseting password"
        })
    }
}