const mongoose = require("mongoose")

const candidateProfileSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    image: {
        type: String,
        required: true,
    },
    applications: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }
}, { timestamps: true })

const CandidateProfile = mongoose.model("CandidateProfile", candidateProfileSchema)
module.exports = CandidateProfile