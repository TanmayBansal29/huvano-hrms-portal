const mongoose = require("mongoose")
const validator = require("validator")

const hrSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value){
                return validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                    minUppercase: 1,
                })
            },
            message: "Password must be at least 8 characters long and include uppercase, lowercase, number and symbol"
        }
    },
    designation: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    jobPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost"
    }],
    image: {
        type: String,
    },
    resetPasswordToken: {
        type: String
    }, 
    resetPasswordExpires: {
        type: Date
    },
    role: {
        type: String,
        default: "HR",
        enum: ["HR"]
    }
}, {timestamps: true})

const HRProfile = mongoose.model("HR", hrSchema)
module.exports = HRProfile