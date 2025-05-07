const mongoose = require("mongoose")

const candidateProfileSchema = mongoose.Schema({
    name: {
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
    applications: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    },
    createdAt: {
        type: Date
    }
})

module.exports = mongoose.model("CandidateProfile", candidateProfileSchema)