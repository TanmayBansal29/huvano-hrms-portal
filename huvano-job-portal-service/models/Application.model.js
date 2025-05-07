const mongoose = require("mongoose")

const applicationSchema = mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateProfile"
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost"
    },
    resumeUrl: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    educationDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EducationDetails"
    },
    previousEmployment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PreviousEmployment"
    }],
    joinImmediately: {
        type: Boolean,
        default: false
    },
    noticePeriod: {
        type: Number,
        min: 0,
        max: 120
    },
    openForRelocation: {
        type: Boolean,
        default: false
    },
    applicationStatus: {
        type: String,
        enum: ["Pending", "Shortlisted", "Rejected", "Interviewing", "Offered", "Hired", "Declined"],
        default: "Pending"
    },
    interviewRounds: [{
        roundNumber: {
            type: Number,
            min: 1,
            max: 10
        },
        scheduledAt: {
            type: Date,
        },
        mode: {
            type: String,
            enum: ["Online", "In-Person"]
        },
        linkOrLocation: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Rescheduled", "Cancelled"],
            default: "Scheduled"
        },
        feedback: {
            type: String,
            minLength: 50,
            maxLength: 200,
            required: false
        },
        result: {
            type: String,
            enum: ["Pending", "Selected", "Rejected"],
            default: "Pending"
        }
    }],
    finalOffer: {
        offerLetterUrl: {
            type: String
        },
        offeredOn: {
            type: Date
        },
        accepted: {
            type: Boolean,
            default: false
        },
        acceptedOn: Date
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
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        }
    }]
}, { timestamps: true })