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
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 100
    },
    location: [{
        type: String,
        required: true,
        trim: true,
        enum: ["Bangalore", "Hyderabad", "Chennai", "Gurgaon", "Noida", "Pan India", "Kolkata", "Delhi", "Remote", "Ahmedabad"]
    }],
    experienceLevel: {
        type: String,
        enum: ["Intern","0-2", "3-5", "6-8", "8+"],
        required: true
    },
    positionType: {
        type: String,
        enum: ["Full Time", "Part Time", "Intenship"],
        required: true
    },
    salary: {
        type: Number,
        required: true,
        min: 0
    },
    educationLevel: {
        type: String,
        enum: ["Graduation", "Post Graduation", "Diploma", "PHD", "None"],
    },
    jobDescription: {
        type: String,
        minLength: 100,
        maxLength: 500,
        required: true,
        trim: true
    },
    rolesAndResponsibilities: {
        type: String,
        minLength: 100,
        maxLength: 500,
        required: true,
        trim: true
    },
    skillsRequired: {
        type: String,
        minLength: 100,
        maxLength: 500,
        required: true,
        trim: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HR",
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Closed", "Archieved"],
        default: "Active"
    }
}, { timestamps: true })

const JobPost = mongoose.model("JobPost", jobPostSchema)
module.exports = JobPost