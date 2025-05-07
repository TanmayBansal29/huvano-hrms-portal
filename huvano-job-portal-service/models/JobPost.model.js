const mongoose = require("mongoose")

const jobPostSchema = mongoose.Schema({
    jobId: {
        type: Number,
        required: true,
        min: 10000,
        max: 99999,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ["Intern","0-2", "1-3", "3-6", "7+"],
        required: true
    },
    positionType: {
        type: String,
        enum: ["Full Time", "Part Time"],
        required: true
    },
    salary: {
        type: Number,
        required: true,
        min: 0
    },
    educationLevel: {
        type: String,
        enum: ["Graduation", "Post Graduation"],
    },
    jobDescription: {
        type: String,
        minLength: 100,
        maxLength: 500
    },
    rolesAndResponsibilities: {
        type: String,
        minLength: 100,
        maxLength: 500
    },
    skillsRequired: {
        type: String,
        minLength: 100,
        maxLength: 500
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
})

module.exports = mongoose.model("JobPost", jobPostSchema)