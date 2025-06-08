const Employee = require("../models/User")


// Controller for HRs to Register all the employees other than Admins
exports.registerEmployees = async (req, res) => {
    try {
        // Destructuring the request body
        const {firstName, lastName, empId, email, role, level} = req.body

        // Checking whether all the fields are entered or not
        if(!firstName || !lastName || !empId || !email || !role || !level) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        // Checking whether same empID, email exists before or not
        const employeeID = await Employee.findOne({empId})
        const employeeEmail = await Employee.findOne({email})

        if(employeeID || employeeEmail) {
            return res.status(400).json({
                success: false,
                message: "Employee exists already"
            })
        }

        // Validating the employees Roles - to be Added by HR
        const notAllowedRoles = ["Admin"]
        if(notAllowedRoles.includes(role)){
            return res.status(400).json({
                success: false,
                message: "Can be added by Admins only"
            })
        }

        // Validating the levels - 1 to 4
        const allowedLevels = [1,2,3,4]
        if(!allowedLevels.includes(level)){
            return res.status(400).json({
                success: false,
                message: "Please select within the allowed levels"
            })
        }

        // Creating the employee and saving in the database
        const employee = await Employee.findOne({empId})
        return res.status(200).json({
            success: true,
            message: "Employee Registered Successfully",
            data: employee
        })
    } catch (error) {
        console.log("Error while registering the employee", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong registering the user"
        })
    }
}

// Controller for deleting the employee from database
exports.removeEmployees = async (req, res) => {
    try {
        // Getting the empId from req params
        const empId = req.params.empId

        // Checking whether the employee exists or not
        const employee = await Employee.findOneAndDelete({empId})

        if(!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee does not exist. Please check the empId"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Employee Removed from database successfully"
        })

    } catch (error) {
        console.log("Error while deleting the employee from database")
        return res.status(500).json({
            success: false,
            message: "Something went wrong while removing the employee. Please try again"
        })
    }
}