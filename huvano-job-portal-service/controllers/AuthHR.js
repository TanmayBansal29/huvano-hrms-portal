const HRProfile = require("../models/Hr.model")
const OTP = require("../models/Otp.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.signupHR = async(req, res) => {
    try {
        // Destruct fields from req body
        const {
            firstName, lastName, email, password, confirmPassword, otp, designation
        } = req.body

        // Check - 1: Whether user have entered all details or not
        if(!firstName || !lastName || !email
            || !password || !confirmPassword || !otp || !designation) {
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
        const existingUser = await HRProfile.findOne({email})
        if(existingUser) {
            res.status(400).json({
                success: false,
                message: "User Already Exists. Please login to continue"
            })
        }

        // Finding the most recent opt sent to the user
        const response = await OTP.findOne({email}).sort({createdAt: -1}).limit(1)
        console.log("Recent OTP HR Controller: ", response)
        if(response == 0) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "OTP is invalid"
            })
        } else if (otp != response[0].otp){
            // OTP is not same
            return res.status(400).json({
                success: false,
                message: "OTP is invalid or expired"
            })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // creating the User
        const user = await HRProfile.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            designation,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        return res.status(200).json({
            success: true,
            user,
            message: "User Registered Succesfully"
        })

    } catch (error) {
        console.log("Error while Signing up HR: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong registering. Please try again"
        })
    }
}

exports.loginHR = async (req, res) => {
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
        const user = await HRProfile.findOne({email})
        
        // If user is not found in the database
        if(!user) {
             return res.status(400).json({
                success: false,
                message: "User is not registered. Please Register to continue"
            })
        }

        // Generating JWT token and compare password
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign(
                {email: user.email, id: user._id},
                process.env.JWT_SECRET,
                {expiresIn: "4h"}
            );

            // Set Cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: process.env.NODE_ENV === "Production",
                sameSite: "strict"
            }
            const {password: _, ...userData} = user.toObject();
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user: userData,
                message: "Login Succesful"
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }
    } catch (error) {
        console.log("Error while logging in HR: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong registering. Please try again"
        })
    }
}

exports.logoutHR = async (req, res) => {
    // using clearCookie method to clear the cookie and log out
    res.clearCookie("token")
    return res.status(200).json({
        success: true,
        message: "Logged Out Successfully"
    })
}
