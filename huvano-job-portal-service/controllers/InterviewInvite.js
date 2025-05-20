const CandidateProfile = require("../models/CandidateProfile.model");
const JobPost = require("../models/JobPost.model")
const ApplicationModel = require("../models/Application.model");
const mailSender = require("../utils/mailSender");
const InterviewModel = require("../models/Interview.model");
const { interviewAcceptedEmail } = require("../mails/interviewInviteAcceptedEmail");
const { interviewDeclinedEmail } = require("../mails/interviewInviteDeclinedEmail");
const { rescheduleRequestEmail } = require("../mails/rescheduleRequestEmail");

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
        const candidateId = req.user._id
        const candidate = await CandidateProfile.findById(candidateId).select("_id")

        if(!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate Not Found"
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
                message: "No Interview Scheduled found"
            })
        }

        if(interview.status === "RescheduleRequested") {
            return res.status(400).json({
                success: false,
                message: "Already Reschedule request sent"
            })
        }

        if(interview.status === "Decline") {
            return res.status(400).json({
                success: false,
                message: "Already Declined the Interview Invite. Cannot Request for Reschedule"
            })
        }

        const {requestedInterviewChanges} = req.body
        const {requestedDate, reason} = requestedInterviewChanges

        if(new Date(interview.scheduledAt) >= new Date(requestedDate)) {
            return res.status(400).json({
                success: false,
                message: "Request Date should be greater than the scheduled date"
            })
        }

        if(!reason || reason.trim().length < 10 || reason.trim().length > 100){
            return res.status(400).json({
                success: false,
                message: "Reason should be between 10 to 100 characters long"
            })
        }
        const rescheduleRequest = "Pending"
        const newRequestedData = {requestedDate, reason, rescheduleRequest}
        interview.requestedInterviewChanges.push(newRequestedData)
        interview.response = "RescheduleRequested"
        await interview.save()

        const latestChange = interview.requestedInterviewChanges[interview.requestedInterviewChanges.length - 1];

        try {
            const emailResponse = await mailSender(
                interview?.application?.myInformation?.emailAddress,
                "Reschedule Request Sent",
                rescheduleRequestEmail(
                    interview?.application?.myInformation?.firstName,
                    interview?.application?.jobId?.title,
                    "Huvano HRMS",
                    latestChange.requestedDate.toLocaleString(),
                    latestChange.reason
                )
            )
            console.log("Email Response || Request Rescheduling: ", emailResponse)
        } catch (error) {
            console.log("Error while sending the request confirmation mail: ", error)
            return res.status(500).json({
                success: false,
                message: "Something went wrong sending the mail. Please try again"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Rescheduling Request Sent Successfully"
        })

    } catch (error) {
        console.log("Error while requesting for rescheduling the interview: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong sending the request for rescheduling the interview. Please try again"
        })
    }
}