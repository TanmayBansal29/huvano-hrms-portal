const Employee = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Login Controller - Logging in the employee into the portal
exports.login = async (req, res) => {
    try {
        // Destructuring the req body
        const {empId, password} = req.body
        
        // Finding the employee present in database
        const user = await Employee.findOne({empId})

        // Checking whether user is present or not
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "Employee not registered. Please Contact Administrator"
            })
        }

        // Checking the Password 
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch) {
            // Creating a token - to be stored as cookie
            const token = jwt.sign(
                {email: user.email, empID: user.empID, id:user._id, role: user.role},
                process.env.JWT_SECRET,
                {expiresIn: '4h'}
            )

            // Creating options to be added to cookie
            const options = {
                expires: new Date(Date.now) + 3 * 24 * 60 * 60 * 1000,
                httpOnly: true
            }

            // Password to be removed from shoeing to user
            const {password: _, ...userData} = user
            // Returning the cookie - named Token along with values and options
            res.cookie('token', token, options).status(200).json({
                success: true,
                message: "Logged In Successfully",
                token,
                data: userData,
            })
            // Marking Password as Incorrect
        } else {
            return res.status(400).json({
                success: false,
                message: "Password Incorrect. Please try again"
            })
        }
    }
    catch (error) {
        console.log("Error while login the Employee", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong logging the user. Please try again"
        })
    }
}

// Logout Controller - Logging out the Employee from employee portal
exports.logout = async(req, res) => {
    // Clearing the cookie stored
    res.clearCookie("Token")
    return res.status(200).json({
        success: false,
        message: "User Logged out successfully"
    })
}