const Employee = require("../models/User")


// Adding Core Team/HRs into the system
exports.registeringCore = async(req, res) => {
    try {
        // Destructuring the request body
        const {firstName, lastName, email, empId, role, level} = req.body

        // Checking whether all the fields are entered or not
        if(!firstName || !lastName || !email || !empId || !role || !level) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the fields"
            })
        }

        // Checking whether employee with same empID exixts or not
        const employeeID = await Employee.findOne({empId})
        const employeeEmail = await Employee.findOne({email})
        if(employeeID || employeeEmail) {
            return res.status(400).json({
                success: false,
                message: "Employee already exists with the same emp ID or emp Email"
            })
        }

        // Validating the Employee Role - Admin, HR allowed 
        const allowedRoles = ["Admin", "HR"]
        if(!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Admin and HR are the allowed roles only"
            })
        }

        // Validating the level of the employee - 1,2,3,4
        const allowedLevels = [1,2,3,4]
        if(!allowedLevels.includes(level)) {
            return res.status(400).json({
                success: false,
                message: "Allowed Levels are from 1 to 4"
            })
        }

        // Creating a Employee and saving to the database
        const employee = await Employee.create({
            firstName,
            lastName,
            empId,
            email,
            role,
            level
        })
        
        return res.status(200).json({
            success: true,
            message: "Employee added Successfully",
            data: employee
        })

    } catch (error) {
        console.log("Error Occured while registering the member of core team")
        return res.status(500).json({
            success: false,
            message: "Something went wrong registering the core members"
        })
    }    
}