const mongoose = require("mongoose");
const validator = require("validator")

const applicationSchema = mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateProfile"
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost"
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
    myInformation: {
        country: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 50
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 50
        },
        addressLine: {
            type: String,
            required: true,
            trim: true,
            minLength: 5,
            maxLength: 100
        },
        city: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 50
        },
        state: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 50
        },
        postalCode: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 50
        },
        emailAddress: {
            type: String,
            lowercase: true,
            trim: true,
            required: true,
            validate(value) {
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email")
                }
            }
        },
        phoneDeviceType: {
            type: String,
            enum: ["Home", "Mobile"],
            required: true
        },
        phoneNumber: {
            type: String,
            required: true,
            validate(value){
                if(!validator.isMobilePhone(value)){
                    throw new Error("Invalid Phone Number")
                }
            }
        },
        hearAboutUs: {
            type: String,
            enum: ["Glassdoor", "Linkedin", "Indeed", "Naukri", "Social Media", "University", "Career Fair", "Careers Page", "Others"],
            required: true
        },
        formerEmployee: {
            type: String,
            enum: ["Yes", "No"],
            required: true
        }
    },
    myEducation: {
        degree: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 50
        },
        fieldOfStudy: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 50
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
            max: 2100,
            required: true
        },
        university: {
            type: String,
            required: true,
            trim: true,
            minLength: 3
        },
        cgpa: {
            type: Number,
            required: true,
            min: 0,
            max: 10
        }
    },
    myExperience: {
        jobTitle: {
            type: String,
            required: true,
            trim: true,
            minLength: 5,
            maxLength: 50
        },
        company: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
        },
        fromYear: {
            type: Number,
            min: 1970,
            max: new Date().getFullYear(),
            required: true
        },
        toYear: {
            type: Number,
            validate:[
            {
                validator: function (v) {
                if(this.currentlyWorking) return true;
                return v != null
                },
                message: "To Year is required if not currently working"
            },
            {
                validator: function (v) {
                    if(this.currentlyWorking) return true;
                    return !this.startYear || v >= this.startYear
                },
                message: "To Year must be greater that or equal to from year"
            }],
            max: 2100,
            required: true
        },
        currentlyWorking: {
            type: Boolean
        },
        roleDescription: {
            type: String,
            trim: true,
            minLength: 50,
            maxLength: 250
        },
        noticePeriod: {
            type: Number,
            validate: {
                validator: function (v) {
                    if(this.currentlyWorking) return v != null;
                    return true
                },
                message: "Notice Period not required if not working"
            }
        },
        currentSalary: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    if(this.currentlyWorking) return v != null;
                    return true
                },
                message: "Current Salary not required if not working"
            }
        }
    },
    applicationQuestions: {
        visaRequirement: {
            type: String,
            enum: ["Yes", "No"],
            required: true
        },
        relocation: {
            type: String,
            enum: ["Yes", "No"],
            required: true
        },
        joinImmediately: {
            type: String,
            enum: ["Yes", "No"],
            required: true
        },
        priorExperience: {
            type: String,
            enum: ["Yes", "No"],
            required: true
        },
        skills: [{
            type: String
        }]
    },
    voluntaryQuestions: {
        gender: {
            type: String,
            enum: ["Male", "Female", "Others"],
            required: true
        },
        disability: {
            type: String,
            enum: ["Yes, I am having a disability", "No, I don't have a disability", "I prefer not to disclose"],
            required: true
        },
        servedArmy: {
            type: String,
            enum: ["Yes", "No"],
            required: true
        },
        anyRelativeWorking: {
            type: String,
            enum: ["Yes", "No"],
            required: true
        },
        governmentOfficial: {
            type: String,
            enum: ["Yes", "No"],
            required: true
        }
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