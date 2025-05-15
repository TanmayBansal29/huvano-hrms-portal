const mongoose = require("mongoose")

const educationDetailsSchema = mongoose.Schema({
    matriculationEducation: {
        boardName: {
            type: String,
            enum: ["CBSE", "ICSE", "State Board"],
            required: true
        },
        startYear: {
            type: Number,
            min: 1970,
            max: new Date().getFullYear(),
            required: true
        },
        endYear: {
            type: Number,
            validate: {
              validator: function (v) {
                return v >= this.startYear
              },
              message: "End Year must be greater than or equal to start year"  
            },
            max: new Date().getFullYear(),
            required: true
        },
        percentageObtained: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },
        schoolName: {
            type: String,
            required: true,
            trim: true,
            minLength: 3
        }
    },
    higherSecondaryEducation: {
        boardName: {
            type: String,
            enum: ["CBSE", "ICSE", "State Board"],
            required: true
        },
        stream: {
            type: String,
            enum: ["Science", "Commerce", "Arts"]
        },
        startYear: {
            type: Number,
            min: 1970,
            max: new Date().getFullYear(),
            required: true
        },
        endYear: {
            type: Number,
            validate: {
              validator: function (v) {
                return v >= this.startYear
              },
              message: "End Year must be greater than or equal to start year"  
            },
            max: new Date().getFullYear(),
            required: true
        },
        percentageObtained: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },
        schoolName: {
            type: String,
            required: true,
            trim: true,
            minLength: 3
        }
    },
    graduationDetails: {
        degreeName: {
            type: String,
            required: true,
        },
        branchName: {
            type: String,
            required: true
        },
        startYear: {
            type: Number,
            min: 1970,
            max: new Date().getFullYear(),
            required: true
        },
        endYear: {
            type: Number,
            validate: {
              validator: function (v) {
                return v >= this.startYear
              },
              message: "End Year must be greater than or equal to start year"  
            },
            max: new Date().getFullYear(),
            required: true
        },
        cgpaObtained: {
            type: Number,
            min: 0,
            max: 10,
            required: true
        },
        universityName: {
            type: String,
            required: true,
            trim: true,
            minLength: 3
        }
    },
    postGraduationDetails: {
        degreeName: {
            type: String,
        },
        branchName: {
            type: String,
        },
        startYear: {
            type: Number,
            min: 1970,
            max: new Date().getFullYear(),
        },
        endYear: {
            type: Number,
            validate: {
              validator: function (v) {
                return v >= this.startYear
              },
              message: "End Year must be greater than or equal to start year"  
            },
            max: new Date().getFullYear(),
        },
        cgpaObtained: {
            type: Number,
            min: 0,
            max: 10,
        },
        universityName: {
            type: String,
            minLength: 3
        }
    }
}, { timestamps: true })

module.exports = mongoose.model("EducationDetails", educationDetailsSchema)