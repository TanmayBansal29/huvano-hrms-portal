const { applicationRejected } = require("../mails/rejectionNotification");
const { applicationShortlisted } = require("../mails/shortlistingNotification");
const { applicationUnderReview } = require("../mails/underReviewNotification");
const ApplicationModel = require("../models/Application.model");
const HRProfile = require("../models/Hr.model");
const JobPost = require("../models/JobPost.model");
const mailSender = require("../utils/mailSender");

// Controller for showing all the applications to HR for a particular JobID
exports.getAllApplications = async (req, res) => {
    try {
        const jobId = req.params.jobId
        const hrId = req.user._id
        const {page = 1, limit = 10} = req.query
        const pageNum = parseInt(page, 10)
        const limitNum = parseInt(limit, 10)

        if(isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid Pagination Credentials"
            })
        }

        const skip = (pageNum - 1) * limitNum

        const hr = await HRProfile.findById(hrId)
        if(!hr) {
            return res.status(404).json({
                success: false,
                message: "No HR Found"
            })
        }

        if(String(job.hrId) !== String(hrId)) {
            return res.status(403).json({
                success: false,
                message:"You are not authorized to access applications for this job"
            })
        }
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "No Job Found"
            })
        }

        const applications = await ApplicationModel.find({jobId}).skip(skip).limit(limitNum)
        if(applications.length === 0){
            return res.status(404).json({
                success: false,
                message: "No Application found for JobId: " + jobId
            })
        }

        const totalApplications = await ApplicationModel.countDocuments({jobId})
        return res.status(200).json({
            success: true,
            message: "Applications Fetched Successfully",
            currentPage: pageNum,
            totalApplications,
            totalPages: Math.ceil(totalApplications/limitNum),
            applications
        })

    } catch (error) {
        console.log("Error Fetching all the applications: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong Fetching the applications. Please try again"
        })
    }
}


// Controller for getting a particular application
exports.getApplicationById = async (req, res) => {
    try {
        const applicationId = req.params.applicationId
        const hrId = req.user?._id

        const hr = await HRProfile.findById(hrId)
        if(!hr){
            return res.status(404).json({
                success: false,
                message: "HR default not found"
            })
        }

        const application = await ApplicationModel.findById(applicationId).populate("jobId")
        if(!application){
            return res.status(404).json({
                success: false,
                message: "No Application Found"
            })
        }

        if(String(application.jobId.createdBy) !== String(hrId)){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this application"
            })
        }

        if(application.status === 'Withdrawn'){
            return res.status(400).json({
                success: false,
                message: "The application was withdrawn by the candidate and is no longer active"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Application fetched successfully",
            application
        })

    } catch (error) {
        console.log("Error while fetching particular Application: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the application. Please try again"
        })
    }
}

// Controller to update the status of the application
exports.updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.applicationId
        const hrId = req.user?._id
        const hr = await HRProfile.findById(hrId)
        if(!hr){
            return res.status(404).json({
                success: false,
                message: "HR not found"
            })
        }

        const application = await ApplicationModel.findById(applicationId).populate("jobId")
        if(!application) {
            return res.status(404).json({
                success: false,
                message: "Application Not Found"
            })
        }

        if(String(application.jobId.createdBy) !== String(hrId)){
            return res.status(403).json({
                success: false,
                message: "Unauthorized to change the status"
            })
        }

        if(application.status === 'Withdrawn'){
            return res.status(400).json({
                success: false,
                message: "The application was withdrawn by the candidate and is no longer active"
            })
        }

        const allowedStatus = ["Shortlisted", "Rejected", "Under Review"]
        const newStatus = req.body.status
        if(!allowedStatus.includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid status from options"
            })
        }

        application.status = newStatus
        await application.save()

        try {
            if(newStatus === 'Shortlisted'){
                const emailResponse = await mailSender(
                    application.myInformation.emailAddress,
                    "Update on your Application",
                    applicationShortlisted(
                        application.myInformation.firstName,
                        application.jobId.title,
                        "Huvano HRMS"
                    )
                )
                console.log("Shortlisted Email Response: ", emailResponse)
            }

            if(newStatus === 'Rejected'){
                const emailResponse = await mailSender(
                    application.myInformation.emailAddress,
                    "Update on your Application",
                    applicationRejected(
                        application.myInformation.firstName,
                        application.jobId.title,
                        "Huvano HRMS"
                    )
                )
                console.log("Rejected Email Response: ", emailResponse)
            }

            if(newStatus === 'Under Review'){
                const emailResponse = await mailSender(
                    application.myInformation.emailAddress,
                    "Update on your Application",
                    applicationUnderReview(
                        application.myInformation.firstName,
                        application.jobId.title,
                        "Huvano HRMS"
                    )
                )
                console.log("Under Review Email Response: ", emailResponse)
            }
        } catch (error) {
            console.log("Error Sending Update Status Email: ", error)
            return res.status(500).json({
                success: false,
                message: "Something went wrong sending the mail",
                error: error.message
            })
        }

        return res.status(200).json({
            success: true,
            message: "Status Updated Successfully"
        })

    } catch (error) {
        console.log("Error while updating the status: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the status. Please try again"
        })
    }
}