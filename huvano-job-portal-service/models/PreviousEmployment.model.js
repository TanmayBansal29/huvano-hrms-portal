const mongoose = require("mongoose")

const previousEmployerSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2
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
        validate: {
            validator: function (v) {
                if(this.currentlyWorking) return true;
                return v != null
            },
            message: "End Month is required if not currently working"
        }
    },
    endYear: {
        type: Number,
        validate:[
            {
                validator: function (v) {
                if(this.currentlyWorking) return true;
                return v != null
                },
                message: "End Month is required if not currently working"
            },
            {
                validator: function (v) {
                    if(this.currentlyWorking) return true;
                    return !this.startYear || v >= this.startYear
                },
                message: "End Year must be greater that or equal to start year"
        }],
        max: new Date().getFullYear(),
    },
    currentlyWorking: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("PreviousEmployment", previousEmployerSchema)