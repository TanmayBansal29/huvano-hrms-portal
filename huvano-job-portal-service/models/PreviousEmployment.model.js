const mongoose = require("mongoose")

const previousEmployerSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    startMonth: {
        type: String,
        enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        required: true
    },
    startYear: {
        type: Number,
        min: 1970,
        max: new Date().getFullYear(),
        required: true
    },
    endMonth: {
        type: String,
        enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
    endYear: {
        type: Number,
        min: 1970,
        max: new Date().getFullYear(),
    },
    currentlyWorking: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("PreviousEmployment", previousEmployerSchema)