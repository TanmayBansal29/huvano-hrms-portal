const CandidateProfile = require("../models/CandidateProfile.model")
const OTP = require("../models/Otp.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const {passwordUpdated} = require("../mails/passwordUpdateConfirmation")
const mailSender = require("../utils/mailSender")
const validator = require("validator")
require("dotenv").config()

// Signup Controller for Registering Candidates
exports.signup = async(req, res) => {
    try{
        // Destruct fields from req body
        const {
            firstName, lastName, emailAddress, password, confirmPassword, otp
        } = req.body

        // Check - 1: Whether user have entered all details or not
        if(!firstName || !lastName || !emailAddress
            || !password || !confirmPassword || !otp) {
                return res.status(403).json({
                    success: false,
                    message: "All fields are Required"
                })
        }

        // Check - 2: Whether password and confirm Password are same
        if(password != confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password are not same. Please try again"
            })
        }

        // Check - 3: Whether User already exists in DB or not
        const existingUser = await CandidateProfile.findOne({emailAddress})
        if(existingUser) {
            res.status(400).json({
                success: false,
                message: "User Already Exists. Please login to continue"
            })
        }

        // Finding the most recent otp sent to the user
        const response = await OTP.findOne({emailAddress}).sort({createdAt: -1}).limit(1)
        console.log("Recent OTP Candidate Controller", response)
        if(response.length === 0) {
            // OTP not found for the Email
            return res.status(400).json({
                success: false,
                message: "OTP is invalid"
            })
        } else if (otp !== response.otp) {
            // OTP is not same
            return res.status(400).json({
                success: false,
                message: "OTP is invalid or Expired"
            })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // creating the user
        const user = await CandidateProfile.create({
            firstName,
            lastName,
            emailAddress,
            password: hashedPassword,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
        return res.status(200).json({
            success: true,
            user,
            message: "Candidate Registered Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "User Cannot be registered. Please try again later"
        })
    }
}

// Login controller for authentication Candidates
exports.login = async(req, res) => {
    try {
        // Get email and password from req body
        const {email, password} = req.body

        // Check - 1 Check if email or password is missing
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the required details"
            })
        }

        // Find the user with provided email
        const user = await CandidateProfile.findOne({email})

        // If user is not found in the database
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Candidate is not registered. Please Register to continue"
            })
        }

        // Generate JWT token and compare password
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign(
                { email: user.email, id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "4h" }
            );

            // Set Cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: process.env.NODE_ENV === "Production",
                sameSite: "strict"
            };
            const {password: _, ...userData} = user.toObject();
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user: userData,
                message: "Login Successful"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }

    } catch (error) {
        console.log("Error Occured Login: ", error)
        return res.status(500).json({
            success: false,
            message: "Login Failure. Please try again"
        })
    }
}

// Logout controller to clear the stored cookie
exports.logout = async (req, res) => {
    // using clearCookie method to clear the cookie and log out
    res.clearCookie("token")
    return res.status(200).json({
        success: true,
        message: "Logged Out Successfully"
    })
}

// Controller for sending OTP for Email Verification
exports.sendotp = async (req, res) => {
    try {
        // Get email from the req body
        const {emailAddress} = req.body

        // Check - 1 Whether email is already registered or not 
        const checkUserPresent = await CandidateProfile.findOne({emailAddress})
        // If we have found candidate in DB
        if(checkUserPresent) {
            // Returning 401 unauhorized status code with error message
            return res.status(401).json({
                success: false,
                message: "User Already Registered"
            })
        }

        // Generating the otp using otpGenerator
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        // Check - 2 Ensure OTP is not already present in DB
        // If OTP is present in DB, regenerate the OTP
        while(await OTP.findOne({otp:otp})) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
        }
        const otpPayload = {emailAddress, otp}
        console.log("OTP Body: ", await OTP.create(otpPayload))
        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully"
        })

    } catch (error) {
        console.log("Error Sending OTP Controller: ", error)
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// Controller for resending the otp after 60 seconds period
exports.resendOtp = async (req, res) => {
    try {
        // Getting the otp from the req body
        const {emailAddress} = req.body
        const existingOTP = await OTP.findOne({ emailAddress })
        
        // Check - 1 If no OTP was ever generated
        if(!existingOTP) {
            return res.status(404).json({
                success: false,
                message: "No OTP Request found for this email. Please request OTP first"
            })
        }

        const now = Date.now();

        // Check - 2 How many times resent request sent
        if(existingOTP.resendCount >= 3){
            return res.status(404).json({
                success: false,
                message: "Maximum OTP resend attemps reached. Please try again later"
            })
        }

        // Check - 3 Time since last sent
        const timeSinceLastSent = (now - existingOTP.lastSentAt.getTime()) / 1000
        if(timeSinceLastSent < 60) {
            return res.status(429).json({
                success: false,
                message: `Please Wait ${60 - Math.floor(timeSinceLastSent)} seconds`
            })
        }

        // Generate new OTP
        let otp;
        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
        } while (await OTP.findOne({otp}))
        
        // Update the existing OTP document
        existingOTP.otp = otp;
        existingOTP.lastSentAt = new Date()
        existingOTP.resendCount += 1;
        await existingOTP.save();

        return res.status(200).json({
            success: true,
            message: "OTP Resent Successfully"
        })
    } catch (error) {
        console.log("Error Resending OTP: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong Resending OTP. Try again later"
        })
    }
}

// Controller for Changing Password on user request
exports.changePassword = async (req, res) => {
    try {
        // Get userdata from req.user
        const userDetails = await CandidateProfile.findById(req.user.id)

        // Get the old password, new password, and confirm new password from req.body
        const {oldPassword, newPassword, confirmNewPassword} = req.body

        // Validating old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )
        
        // Check - 1 If old password match or not
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "The password is incorrect"
            })
        }

        // Check - 2 Password and confirm password are same or not
        if(newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm password are not same"
            })
        }

        // Validating the new password
        const isStrong = validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        })

        if(!isStrong) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 character long and include uppercase, lowercase, number and symbol"
            })
        }

        // Check - 3 Old Password and New Password are not same
        const isSamePassword = await bcrypt.compare(newPassword, userDetails.password)
        if(isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New Password can not be same as old password"
            })
        }

        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails = await CandidateProfile.findByIdAndUpdate(
            req.user.id,
            {password: encryptedPassword},
            {new: true}
        )

        // Send Notification email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                `Password Updated Successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`,
                passwordUpdated(
                    updatedUserDetails.email,
                    updatedUserDetails.firstName
                )
            )
            console.log("Email Sent Successfully: ", emailResponse.response)
        } catch (error) {
            console.log("Error while sending the mail: ", error)
            return res.status(400).json({
                success: false,
                message: "Error While Sending the Email",
                error: error.message
            })
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
        })

    } catch (error) {
        // If there is some error updating the password, log the error and return a 500 (Internal Error) error
        console.log("Error Updating Password: ", error)
        return res.status(500).json({
            success: false,
            message: "Error while updating password",
            error: error.message
        })
    }
}
