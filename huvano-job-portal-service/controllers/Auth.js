const CandidateProfile = require("../models/CandidateProfile.model")
const OTP = require("../models/Otp.model")
const bcrypt = require("bcrypt")

// Signup Controller for Registering Candidates
const signup = async(req, res) => {
    try{

        // Destruct fields from req body
        const {
            firstName, lastName, email, password, confirmPassword, otp
        } = req.body

        // Check - 1: Whether user have entered all details or not
        if(!firstName || !lastName || !email
            || !password || !confirmPassword || otp) {
                return res.status(403).json({
                    success: false,
                    message: "All fields are Required"
                })
        }

        // Check - 2: Whether password and confirm Password are same
        if(password != confirmPassword){
            return res.send(400).json({
                success: false,
                message: "Password and Confirm Password are not same. Please try again"
            })
        }

        // Check - 3: Whether User already exists in DB or not
        const existingUser = await CandidateProfile.findOne({email})
        if(existingUser) {
            res.send(400).json({
                success: false,
                message: "User Already Exists. Please login to continue"
            })
        }

        // Finding the most recent otp sent to the user
        const response = await OTP.findOne({email}).sortBy({createdAt: -1}).limit(1)
        console.log(response)
        if(response.length == 0) {
            // OTP not found for the Email
            return res.send(400).json({
                success: false,
                message: "OTP is invalid"
            })
        } else if (otp != response[0].otp) {
            // OTP is not same
            return res.send(400).json({
                success: false,
                message: "OTP is invalid"
            })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // creating the user
        const user = await CandidateProfile.create({
            firstName,
            lastName,
            email,
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


module.exports = signup