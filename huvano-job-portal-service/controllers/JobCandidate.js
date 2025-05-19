const CandidateProfile = require("../models/CandidateProfile.model");
const JobPost = require("../models/JobPost.model")
const cloudinary = require("cloudinary");
const applicationSubmitted = require("../mails/jobApplicationConfirmation")
const { myInformationValidator, myEducationValidator, myExperienceValidator, applicationQuestionsValidator, voluntaryQuestionsValidator } = require("../utils/applicationValidator");
const ApplicationModel = require("../models/Application.model");
const mailSender = require("../utils/mailSender");
const InterviewModel = require("../models/Interview.model");
const { populate } = require("dotenv");
const { interviewAcceptedEmail } = require("../mails/interviewInviteAcceptedEmail");
const { interviewDeclinedEmail } = require("../mails/interviewInviteDeclinedEmail");

// Controller for getting all the Job Posts for Candidate to go through
exports.getJobPosts = async (req, res) => {
    try {
        // Pagination Query
        const {page = 1, limit = 10, status = "Active"} = req.query
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10)

        if(isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1){
            return res.status(400).json({
                success: false,
                message: "Invalid Pagination Parameters"
            })
        }

        const query = {
            status: status
        }

        // Pagination and Sorting Logic
        const skip = (page - 1) * limit
        const jobPosts = await JobPost.find(query).skip(skip).limit(limitNum).sort({createdAt: -1})

        // Total Count of pagination
        const totalPosts = await JobPost.countDocuments(query)

        return res.status(200).json({
            success: true,
            jobPosts,
            totalPosts,
            currentPage: pageNum,
            totalPages: Math.ceil(totalPosts / limitNum),
            message: "Job Posts Retrieved Successfully"
        })
    } catch (error) {
        console.log("Error while fetching the Job Posts", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the job posts. Please try again"
        })
    }
}

// Controller for getting the specific job post with jobID
exports.getJobPostByID = async(req, res) => {
    try {
        // Getting the jobId from req params
        const jobId = req.params.jobId

        // Checking whether job exists or not
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job Post does not exists"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Job Post Fetched Successfully",
            job
        })
    } catch (error) {
        console.log("Error while fetching job post details based on jobID: ", error)
        return res.status(500).json({
            success: false,
            message: "job details cannot be fetched. Please try again"
        })
    }
}

// Controller to save the Jobs shown on the portal
exports.saveJobs = async (req, res) => {
    try {
        const candidateId = req.user?._id
        const jobId = req.params.jobId

        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "No Job Found"
            })
        }

        const candidate = await CandidateProfile.findById(candidateId)
        if(!candidate) {
            return res.status(404).json({
                success: false,
                message: "No Candidate Found"
            })
        }

        if(candidate.savedJobs.includes(jobId)){
            return res.status(400).json({
                success: false,
                message: "Job Already Saved"
            })
        }

        candidate.savedJobs.push(jobId)
        await candidate.save()

        return res.status(200).json({
            success: true,
            message: "Job Saved Successfully"
        })
    } catch (error) {
        console.log("Error while saving the job: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong saving the job, Please try again"
        })
    }
}

// Controller to get all the saved jobs
exports.getSavedJobs = async (req, res) => {
    try {
        const {page = 1, limit = 10} = req.query
        const pageNum = parseInt(page, 10)
        const limitNum = parseInt(limit, 10)

        if(isNaN(pageNum) || isNaN(limitNum || pageNum < 1 || limitNum < 1)){
            return res.status(400).json({
                success: false,
                message: "Invalid Pagination Parameters"
            })
        }
        const skip = (pageNum-1)*limitNum
        const candidateId = req.user?._id
        const candidate = await CandidateProfile.findById(candidateId).lean()
        if(!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate Not Found"
            })
        }

        const totalSaved = candidate.savedJobs?.length || 0
        const paginatedIds = candidate.savedJobs?.slice(skip, skip + limitNum)

        if(!paginatedIds || paginatedIds.length === 0){
            return res.status(404).json({
                success: false,
                message: "No Saved Job Found"
            })
        }

        const savedJobs = await JobPost.find({_id: {$in: paginatedIds}})
        return res.status(200).json({
            success: true,
            message: "Saved Jobs Fetched Successfully",
            savedJobs,
            total: totalSaved,
            page: pageNum,
            limit: limitNum
        })

    } catch (error) {
        console.log("Error while fetching saved jobs", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching saved jobs. Please try again"
        })
    }
}

// Controller to unsave a particular job
exports.unsaveJob = async (req, res) => {
    try {
        const candidateId = req.user?._id
        const jobId = req.params.jobId

        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "No Job Found"
            })
        }

        const candidate = await CandidateProfile.findById(candidateId)
        if(!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate Not Found"
            })
        }

        if(!candidate.savedJobs.includes(jobId)){
            return res.status(404).json({
                success: false,
                message: "Job is not present in saved jobs"
            })
        }

        candidate.savedJobs = candidate.savedJobs.filter(
            (savedJobId) => savedJobId.toString() !== jobId
        );

        await candidate.save();

        return res.status(200).json({
            success: true,
            message: "Job Removed from saved jobs successfully"
        })

    } catch (error) {
        console.log("Error Occured while unsaving the job: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong unsaving the job post. Please try again"
        })
    }
}

// Controller for applying to Job
exports.applytoJob = async (req, res) => {
    try {
        // Getting jobID from req.params
        const jobId = req.params.jobId
        
        // Checking where job exists or not
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job doesn't exists"
            })
        }

        // Getting user from req.user
        const candidateId = req.user._id
        // Checking whether candidate exists or not
        const candidate = await CandidateProfile.findById(candidateId)
        if(!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate Details Not found"
            })
        }

        // Checking whether candidate selected the resume file or not
        if(!req.file){
            return res.status(404).json({
                success: false,
                message: "Resume file is required"
            })
        }

        // Processing the resumeUrl
        const resumeUrl = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: 'resumes',
                    public_id: `${Date.now()}_${req.file.originalname}`
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                }
            ).end(req.file.buffer);
        });

        // Destructuring all the fields in application model
        const {myInformation, myEducation, myExperience, applicationQuestions, voluntaryQuestions} = req.body
       
        const informationErrors = myInformationValidator(myInformation)
        if(informationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation Error in My Information",
                error: informationErrors
            })
        }

        const educationErrors = myEducationValidator(myEducation)
        if(educationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation Error in My Education",
                error: educationErrors
            })
        }

        const experienceErrors = myExperienceValidator(myExperience)
        if(experienceErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation Error in My Experience",
                error: experienceErrors
            })
        }

        const applicationQuestionErrors = applicationQuestionsValidator(applicationQuestions)
        if(applicationQuestionErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation Error in Application Questions",
                error: applicationQuestionErrors
            })
        }

        const voluntaryQuestionsErrors = voluntaryQuestionsValidator(voluntaryQuestions)
        if(voluntaryQuestionsErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation Error in Voluntary Questions",
                error: voluntaryQuestionsErrors
            })
        }

        const {
            country, firstName, lastName, addressLine, city, state, pincode,
            emailAddress, phoneTypeDevice, phoneNumber, hearAboutUs, formerEmployee
        } = myInformation;

        const {
            degree, field, startYear, endYear, university, cgpa
        } = myEducation;

        const {
            jobTitle, company, fromYear, toYear, currentlyWorking, roleDescription,
            noticePeriod, currentSalary
        } = myExperience;

        const {
            visaRequirement, relocation, joinImmediately, priorExperience, skills
        } = applicationQuestions;

        const {
            gender, disability, servedArmy, anyRelativeWorking, governmentOfficial
        } = voluntaryQuestions;

        const alreadyApplied = await ApplicationModel.findOne({emailAddress, jobId})
        if(alreadyApplied){
            return res.status(400).json({
                success: false,
                message: "Already Applied for this Job. You will hear back soon",
                application: alreadyApplied
            })
        }

        const application = await ApplicationModel.create({
            resumeUrl,
            myInformation: {country, firstName, lastName, addressLine, city, state, pincode, emailAddress, phoneTypeDevice, phoneNumber, hearAboutUs, formerEmployee},
            myEducation: {degree, field, startYear, endYear, university, cgpa},
            myExperience: {jobTitle, company, fromYear, toYear, currentlyWorking, roleDescription, noticePeriod, currentSalary},
            applicationQuestions: {visaRequirement, relocation, joinImmediately, priorExperience, skills},
            voluntaryQuestions: {gender, disability, servedArmy, anyRelativeWorking, governmentOfficial}
        })

        try {
            const emailResponse = await mailSender(
                application.myInformation.emailAddress,
                `Application Submitted Successfully`,
                applicationSubmitted(application.myInformation.firstName, job.title, "Huvano HRMS")
            )
            console.log("Email Sent Successfully: ", emailResponse.response)
        } catch (error) {
            console.log("Error While Sending the Mail: ", error)
            return res.status(400).json({
                success: false,
                message: "Something Went Wrong sending the mail"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Application Submitted Successfully",
            application
        })
    } catch (error) {
        console.log("Error while applying to job: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong applying to job. Please try again"
        })
    }
}

// Controller to fetch all the applications on candidate dashboard
exports.getApplications = async (req, res) => {
    try {
        const candidateId = req.user?._id
        const candidate = await CandidateProfile.findById(candidateId)
        if(!candidate) {
            return res.status(400).json({
                success: false,
                message: "Candidate doesn't Exists. Please Register First"
            })
        }

        const applications = await ApplicationModel.find({candidateId}).populate("jobId")
        if(applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Applications for Candidate"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Applications Fetched Successfully",
            applications
        })

    } catch (error) {
        console.log("Error While fetching the applications: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the applications. Please try again"
        })
    }
}

// Controller to fetch a particular application using the application ID
exports.getParticularApplication = async (req, res) => {
    try {
        const applicationId = req.params.applicationId
        const candidateId = req.user?._id

        const candidate = await CandidateProfile.findById(candidateId)
        if(!candidate){
            return res.status(404).json({
                success: false,
                message: "Candidate does not exists"
            })
        }

        const application = await ApplicationModel.findOne({
            _id: applicationId,
            candidateId
        }).populate("jobId")

        if(!application){
            return res.status(404).json({
                success: false,
                message: "You haven't applied for this job. Please apply first"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Application Fetched successfully",
            application
        })

    } catch (error) {
        console.log("Error fetching the application: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the application. Please try again"
        })
    }
}

// Controller to withdraw the application
exports.withdrawApplication = async(req, res) => {
    try {
        const applicationId = req.params.applicationId
        const candidateId = req.user?._id

        const candidate = await CandidateProfile.findById(candidateId)
        if(!candidate){
            return res.status(404).json({
                success: false,
                message: "No Candidate found"
            })
        }

        const application = await ApplicationModel.findOne({
            _id: applicationId,
            candidateId
        })
        if(!application) {
            return res.status(404).json({
                success: false,
                message: "Application Not found"
            })
        }

        application.status = "Withdrawn";
        await application.save();

        return res.status(200).json({
            success: true,
            message: "Application Withdrawn Successfully"
        })

    } catch (error) {
        console.log("Error While Withdrawing the application: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong withdrawing the application. Please try again"
        })
    }
}

// Controller to get the interview details
exports.getInterviewDetails = async (req, res) => {
    try {
        const candidateId = req.user._id
        const candidate = await CandidateProfile.findById(candidateId).select("_id")

        if(!candidate){
            return res.status(404).json({
                success: false,
                message: "Candidate Not Found"
            })
        }

        const jobId = req.params.jobId
        const job = await JobPost.findById(jobId).select("_id")

        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job Not Found"
            })
        }

        const application = await ApplicationModel.findOne({candidateId, jobId})
        if(!application) {
            return res.status(400).json({
                success: false,
                message: "No application found for this job"
            })
        }

        if(application.status === "Withdrawn") {
            return res.status(400).json({
                success: false,
                message: "Already Withdrawn the application"
            })
        }

        const interview = await InterviewModel.findOne({application: application._id})
            .populate({
                path: "application",
                populate: {
                    path: "jobId",
                    select: "title"
                }
            }).lean()
        
        const jobTitle = interview?.application?.jobId?.title

        if(!interview) {
            return res.status(404).json({
                success: false,
                message: "No Interview scheduled for this application"
            })
        }

        const {scheduledAt, mode, linkOrLocation, status} = interview
        return res.status(200).json({
            success: true,
            message: "Interview details fetched successfully",
            data: {
                interviewId: interview._id,
                jobTitle,
                scheduledAt,
                mode,
                linkOrLocation,
                status
            }
        })

    } catch (error) {
        console.log("Error while getting the interview details: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong getting the interview details. Please try again"
        })
    }
}

// controller to accept or decline the interview invite
exports.updateResponse = async (req, res) => {
    try {
        const candidateId = req.user._id
        const candidate = await CandidateProfile.findById(candidateId)

        if(!candidate) {
            return res.status(404).json({
                success: false,
                message: "No Candidate Found"
            })
        }

        const interviewId = req.params.interviewId
        const interview = await InterviewModel.findById(interviewId).populate({
            path: "application",
            populate: {
                path: "jobId",
                select: "title"
            }
        })

        if(!interview) {
            return res.status(404).json({
                success: false,
                message: "No interview scheduled found"
            })
        }

        const {response} = req.body
        const allowedResponse = ["Accept", "Decline"]

        if(!allowedResponse.includes(response)){
            return res.status(400).json({
                success: false,
                message: "Please select a valid value from options"
            })
        }

        if (interview.response === response) {
            return res.status(400).json({
                success: false,
                message: `Interview invite already ${response.toLowerCase()}ed.`,
            });
        }

        if(interview.response === "Accept" || interview.response === "Decline") {
            return res.status(400).json({
                success: false,
                message: `Interview Invite already responded with ${interview.response.toLowerCase()}`
            })
        }

        interview.response = response
        await interview.save()

        const application = interview.application
        const candidateName = application?.myInformation?.firstName || "Candidate";
        const email = application?.myInformation?.emailAddress;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Candidate email not found"
            });
        }
        const jobTitle = application?.jobId?.title || "a role"
        const interviewDateTime = interview.scheduledAt.toLocaleString();
        const interviewMode = interview.mode

        try {
            if(interview.response === "Accept") {
                const emailResponse = await mailSender(
                    email,
                    "Interview Invite - Accepted",
                    interviewAcceptedEmail(
                        candidateName,
                        jobTitle,
                        "Huvano HRMS",
                        interviewDateTime,
                        interviewMode,
                        interview.linkOrLocation
                    )
                )

                console.log("Email Response || Accepting Interview Invite", emailResponse)
            } 

            if(interview.response === "Decline") {
                const emailResponse = await mailSender(
                    email,
                    "Interview Invite - Rejected",
                    interviewDeclinedEmail(
                        candidateName,
                        jobTitle,
                        "Huvano HRMS"
                    )
                )
                console.log("Email Response || Declining Interview Invite", emailResponse)
            }
        } catch (error) {
            console.log("Error while sending the response: ", error)
            return res.status(500).json({
                success: false,
                message: "Something went wrong sending the mail. Please try again"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Response Noted Successfully"
        })

    } catch (error) {
        console.log("Error while updating the status of interview invite: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong updating the status. Please try again"
        })
    }
}

// Controller to request for rescheduling the interview invite
exports.requestReschedule = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error")
    }
}