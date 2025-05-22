const mongoose = require("mongoose")

const OfferLetterSchema = mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateProfile",
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost",
        required: true
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Sent", "Accepted", "Declined", "Revoked"],
        default: "Pending"
    },
    content: {
        type: String,
        required: true,
        minLength: 200,
        maxLength: 600
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HRProfile"
    },
    issuedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})

const OfferLetter = mongoose.model("OfferLetter", OfferLetterSchema)
module.exports = OfferLetter