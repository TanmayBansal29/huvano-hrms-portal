const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }, 
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    empId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ["Admin", "HR", "Employee", "Intern", "Team_Lead", "Manager", "Senior_Manager", "Associate_Director", "Director"],
        required: true
    },
    level: {
        type: Number,
        enum: [1,2,3,4],
        required: true
    }
})

const Employee = mongoose.model("Employee", userSchema)
module.exports = Employee