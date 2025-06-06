const mongoose = require("mongoose")


const interviewSchema = mongoose.Schema({
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApplicationModel",
        required: true
    },
    roundNumber: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    scheduledAt: {
        type: Date,
        required: true
    },
    mode: {
        type: String,
        enum: ["Online", "In-Person"],
        required: true
    },
    linkOrLocation: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Scheduled", "Completed", "Rescheduled", "Cancelled"],
        default: "Scheduled"
    },
    feedback: {
        type: String,
        minLength: 50,
        maxLength: 200
    },
    result: {
        type: String,
        enum: ["Pending", "Selected", "Rejected", "Shortlisted"],
        default: "Pending"
    },
    hrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HRProfile"
    },
    response: {
        type: String,
        enum: ["Pending" ,"Accept", "Decline", "RescheduleRequested"],
        default: "Pending"
    },
    
    requestedInterviewChanges: [{
        requestedDate: {
            type: Date
        },
        reason: {
            type: String,
            minLength: 20,
            maxLength: 100
        },
        rescheduleRequest: {
            type: String,
            enum: ["Accepted", "Declined", "Pending"]
        },
    }],

    reminder12Sent: {
        type: Boolean,
        default: false,
    },
    reminder30Sent: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true})

const InterviewModel = mongoose.model("Interview", interviewSchema)
module.exports = InterviewModel