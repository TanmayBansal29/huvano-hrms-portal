const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {signup, login, logout, sendotp, resendOtp, changePassword} = require("../controllers/Auth")
const {forgotPassword, resetPassword} = require("../controllers/ForgotPassword")

const {auth} = require("../middlewares/auth")

// Route for user signup
router.post("/signup", signup)

// Route for user login
router.post("/login", login)

// Route for user logout
router.post("/logout", logout)

// Route for sending OTP to user's email
router.post("/send-otp", sendotp)

// Route for Resending OTP to user's email after 60 seconds
router.post("/resend-otp", resendOtp)

// Route for Changing the password
router.post("/change-password", auth, changePassword)

// Route for forgot password - Generating Reset Password Token
router.post("/forgot-password", forgotPassword)

// Route for resseting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in main purpose
module.exports = router