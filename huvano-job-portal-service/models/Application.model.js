const mongoose = require("mongoose")

const applicationSchema = mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateProfile",
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost",
        required: true
    },
    resumeUrl: {
        type: String,
        required: true,
        validate:{
            validator: function (v) {
                return /^https?:\/\/.+\.(pdf|docx?|PDF|DOCX?)$/.test(v);
            },
            message: props => `${props.value} is not a valid resume file URL (must end with .pdf, .doc, or .docx)`
        }
    },
    phoneNumber: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return /^\+?[0-9]{10,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    educationDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EducationDetails",
        required: true
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
        max: 120,
        validate: {
            validator : function (v) {
                return this.joinImmediately ? v === 0 : true
            },
            message: "Notice period should be 0 if the candidate can join immediately"
        }
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
            maxLength: 200
        },
        result: {
            type: String,
            enum: ["Pending", "Selected", "Rejected"],
            default: "Pending"
        }
    }],
    finalOffer: {
        offerLetterUrl: {
            type: String,
            validate: {
                validator: function (v) {
                    return !v || /^https?:\/\/.+$/.test(v);
                },
                message: props => `${props.value} is not a valid offer letter URL`
            } 
        },
        offeredOn: {
            type: Date
        },
        accepted: {
            type: Boolean,
            default: false
        },
        acceptedOn: {
            type: Date,
            validate: {
                validator: function (v) {
                    return !this.accepted || !!v;
                },
                message: "Should be shown if accepted is true"
            }
        }
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

const ApplicationModel = mongoose.model("ApplicationModel", applicationSchema)
module.exports = ApplicationModel