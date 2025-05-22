const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {signupHR, loginHR, logoutHR} = require("../controllers/AuthHR")

// Route for HR Signup
router.post("/signupHR", signupHR)

// Route for HR Login
router.post("/loginHR", loginHR)

// Route for HR logout
router.post("/logoutHR", logoutHR)


module.exports = router