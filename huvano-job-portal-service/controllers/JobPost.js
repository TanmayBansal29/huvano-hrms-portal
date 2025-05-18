const { interviewInvitationEmail } = require("../mails/interviewInvitation");
const { applicationRejected } = require("../mails/rejectionNotification");
const { applicationShortlisted } = require("../mails/shortlistingNotification");
const { applicationUnderReview } = require("../mails/underReviewNotification");
const ApplicationModel = require("../models/Application.model");
const HRProfile = require("../models/Hr.model");
const InterviewModel = require("../models/Interview.model");
const JobPost = require("../models/JobPost.model");
const { validateJobPostInput } = require("../utils/jobPostValidator");
const mailSender = require("../utils/mailSender");

// Controller for creating a Job Post
exports.createJob = async (req, res) => {
    try {
        // Destructing the req body
        const {title, location, experienceLevel, positionType, salary, educationLevel, jobDescription, rolesAndResponsibilities, skillsRequired} = req.body

        // Validating all the fields of Job Post
        const errors = validateJobPostInput(req.body)
        if(errors.length > 0){
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: errors
            })
        }

        // Generating the jobID - 5 digit Job ID
        let jobId;
        let isUnique = false
        while(!isUnique){
            jobId = Math.floor(10000 + Math.random() * 90000);
            const existing = await JobPost.findOne({jobId})
            if(!existing) isUnique = true
        }

        // Creating a new Job and saving into the database
        const newJob = await JobPost.create({
            jobId,
            title,
            location,
            experienceLevel,
            positionType,
            salary,
            educationLevel,
            jobDescription,
            rolesAndResponsibilities,
            skillsRequired,
            postedBy: req.user.id
        })

        return res.status(200).json({
            success: true,
            newJob,
            message: "New Post Created Successfully"
        })

    } catch (error) {
        console.log("Error while Posting Job: ", error)
        res.status(500).json({
            success: false,
            message: "Something went wrong posting the job. Please try again"
        })

    }
}

// Controller for updating a Job Post
exports.updateJobPost = async (req, res) => {
    try {
        // Getting Job Id from params
        const jobId = req.params.jobId
        // Destructing req body
        const {title, location, experienceLevel, positionType, salary, educationLevel, jobDescription, rolesAndResponsibilities, skillsRequired} = req.body

        // validating the fields
        const errors = validateJobPostInput(req.body)
        if(errors.length > 0){
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: errors
            })
        }

        // Checking where the job exists or not
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(400).json({
                success: false,
                message: "Job Post Not Found"
            })
        }

        // Updating all the fields
        if(title) job.title = title
        if(location) job.location = location
        if(experienceLevel) job.experienceLevel = experienceLevel
        if (positionType) job.positionType = positionType;
        if (salary) job.salary = salary;
        if (educationLevel) job.educationLevel = educationLevel;
        if (jobDescription) job.jobDescription = jobDescription;
        if (rolesAndResponsibilities) job.rolesAndResponsibilities = rolesAndResponsibilities;
        if (skillsRequired) job.skillsRequired = skillsRequired;

        // Saving all the changes to the Job post
        await job.save();
        return res.status(400).json({
            success: false,
            message: "Job Post Updated Successfully",
            job
        })

    } catch (error) {
        console.log("Error while updating a Job Post: ", error)
        res.status(500).json({
            success: false,
            message: "Something went Wrong Updating Job Post. Please try again",
            error: error.message,
        })
    }
}

// Controller for Deleting the job post
exports.deletejobPost = async (req, res) => {
    try {
        // Getting the Job Id from params 
        const jobId = req.params.jobId

        // Checking whether job exists or already deleted
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(400).json({
                success: false,
                message: "Job does not exist already"
            })
        }

        // Checking whether User authorized to delete the post
        if(job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this job post"
            })
        }

        // Deleting the job post based on jobId
        await job.deleteOne()
        return res.status(200).json({
            success: true,
            message: "Job Post Deleted Successfully"
        })
    } catch (error) {
        console.log("Error While Deleting Job Post: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong deleting Job Post. Please try again"
        })
    }
}

// Controller for Getting all the Job Posts by HR
exports.getJobPostsByHR = async (req, res) => {
    try {
        // Getting the HR to fetch the Job Posts by them
        const hrId = req.user.id
        // Pagination Query
        const {page = 1, limit = 10, status = "Active"} = req.query;
        const query = {
            postedBy: hrId,
            status: status
        }

        // Pagination and Sorting Logic
        const skip = (page - 1) * limit
        const jobPosts = await JobPost.find(query).skip(skip).limit(limit).sort({createdAt: -1})

        // Total count of pagination
        const totalPosts = await JobPost.countDocuments(query)

        return res.status(200).json({
            success: true,
            jobPosts,
            totalPosts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            message: "Job Posts Retrieved Successfully"
        })

    } catch (error) {
        console.log("Error While fetching all the job posts: ", error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong fetching Job Posts",
            error: error.message
        })
    }
}

// Controller to get the job post by ID
exports.getJobPostById = async (req, res) => {
    try {
        // Getting the jobId from params
        const jobId = req.params.jobId

        // checking whether job exists or not
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job does not exits"
            })
        }

        return res.status(200).json({
            success: true,
            job,
            message: "Job Post Fetched Successfully"
        })
    } catch (error) {
        console.log("Error While retreiving the job post: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the job post",
            error: error.message
        })
    }
}

// Controller for marking a job post status closed/Archieved
exports.closeJobPost = async (req, res) => {
    try {
        const jobId = req.params.jobId

        // Checking if jobId exists or not
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job Post does not exists"
            })
        }

        const {status} = req.body
        if(!["Active", "Closed", "Archived"].includes(status)){
            return res.status(400).json({
                success: false,
                message: "Status is not valid"
            })
        }

        job.status = status
        await job.save()

        return res.status(200).json({
            success: false,
            message: "Status Changed Successfully",
            updatedStatus: job.status
        })

    } catch (error) {
        console.log("Error while changing the status Job Post: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong changing the status. Please try again"
        })
    }
}

// Controller for showing all the apis to HR for a particular JobID
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

// Controller for scheduling the interview
exports.scheduleInterview = async (req, res) => {
    try {
        const applicationId = req.params.applicationId
        const hrId = req.user._id

        const hr = await HRProfile.findById(hrId)
        if(!hr) {
            return res.status(404).json({
                success: false,
                message: "HR not found"
            })
        }

        const application = await ApplicationModel.findById(applicationId).populate("jobId")
        if(!application){
            return res.status(404).json({
                success: false,
                message: "Application not found"
            })
        }

        if(String(application.jobId.createdBy) !== String(hrId)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to schedule the interview"
            })
        }

        if(!(application.status === 'Shortlisted' || application.status === 'Interviewing')){
            return res.status(400).json({
                success: false,
                message: "Not Shortlisted for the Interview so far"
            })
        }

        const {roundNumber, scheduledAt, mode, linkOrLocation} = req.body

        if(!roundNumber || !scheduledAt || !mode || !linkOrLocation){
            return res.status(400).json({
                success: false,
                message: "Please fill all the details"
            })
        }
        
        const allowedModes = ["Online", "In-Person"]
        if(!allowedModes.includes(mode)) {
            return res.status(400).json({
                success: false,
                message: "Please Enter a valid value from options"
            })
        }

        const formattedDate = new Date(scheduledAt);

        const newInterview = await InterviewModel.create({
            application: application._id,
            roundNumber,
            scheduledAt: formattedDate,
            mode,
            linkOrLocation
        });

        if(application.status === "Shortlisted"){
            application.status = "Interviewing"
        }

        application.interviews.push(newInterview._id)
        await application.save()

        try {
            const emailResponse = await mailSender(
                application.myInformation.emailAddress,
                'Interview Invitation',
                interviewInvitationEmail(
                    application.myInformation.firstName,
                    application.jobId.title,
                    "Huvano HRMS",
                    formattedDate,
                    mode,
                    linkOrLocation
                )
            )
            console.log("Email Response|| Interview Invitation: ", emailResponse)

        } catch (error) {
            console.log("Error while sending invitation mail", error)
            return res.status(400).json({
                success: false,
                message: "Something went wrong sending the mail. Please try again"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Interview Scheduled Successfully",
            interview: newInterview
        })

    } catch (error) {
        console.log("Error while Scheduling Interview: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while scheduling the interview. Please try again"
        })
    }
} 

exports.cancelInterview = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error while cancelling the interview: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong cancelling the interview. Please try again"
        })
    }
}