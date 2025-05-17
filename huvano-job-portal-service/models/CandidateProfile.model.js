const mongoose = require("mongoose")
const validator = require("validator")

const candidateProfileSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error ("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })
            },
            message: "Password must be at least 8 character long and include uppercase, lowercase, number and symbol"
        }
    },
    image: {
        type: String,
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost"
    }],
    resetPasswordToken: {
        type: String
    }, 
    resetPasswordExpires: {
        type: Date
    },
    role: {
        type: String,
        default: "Candidate",
        enum: ["Candidate"]
    }
}, { timestamps: true })

const CandidateProfile = mongoose.model("CandidateProfile", candidateProfileSchema)
module.exports = CandidateProfile