const { interviewCancellationEmail } = require("../mails/interviewCancellationEmail");
const { interviewInvitationEmail } = require("../mails/interviewInvitation");
const { interviewRescheduledEmail } = require("../mails/interviewRescheduleNotification");
const { rescheduleRequestAcceptedEmail } = require("../mails/rescheduleRequestAcceptedEmail");
const { rescheduleRequestDeclinedEmail } = require("../mails/rescheduleRequestDeclinedEmail");
const ApplicationModel = require("../models/Application.model");
const HRProfile = require("../models/Hr.model");
const InterviewModel = require("../models/Interview.model");
const mailSender = require("../utils/mailSender");

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
            linkOrLocation,
            hrId: hrId
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

// Controller to cancel the interviews
exports.cancelInterview = async (req, res) => {
    try {
        const interviewId = req.params.interviewId
        const hrId = req.user?.hrId

        const hr = await HRProfile.findById(hrId)
        if(!hr) {
            return res.status(404).json({
                success: false,
                message: "HR Not Found"
            })
        }

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
                message: "Interview Not found"
            })
        }

        if(String(interview.hrId) !== String(hrId)){
            return res.status(403).json({
                success: false,
                message: "Unauthorized to perform this action"
            })
        }

        if(interview.status === "Cancelled"){
            return res.status(400).json({
                success: false,
                message: "Interview Already Cancelled"
            })
        }

        interview.status = "Cancelled"
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
            const emailResponse = await mailSender(
                email,
                "Interview Invivation Update - Cancelled",
                interviewCancellationEmail(
                    candidateName,
                    jobTitle,
                    "Huvano HRMS",
                    interviewDateTime,
                    interviewMode,
                    "unforeseen reasons"
                )
            )

            console.log("Email Response || Interview Cancelled: ", emailResponse)

        } catch (error) {
            console.log("Error while sending Interview Cancellation Mail")
            return res.status(500).json({
                success: false,
                message: "Something went wrong sending interview cancellation mail. Please try again"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Interview Cancelled Successfully"
        })

    } catch (error) {
        console.log("Error while cancelling the interview: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong cancelling the interview. Please try again"
        })
    }
}

// Controller to get all the interview scheduled
exports.getAllInterviews = async (req, res) => {
    try {
        const hrId = req.user._id
        const hr = await HRProfile.findById(hrId)

        const {page=1, limit=10, startDate, endDate} = req.query
        const pageNum = parseInt(page, 10)
        const limitNum = parseInt(limit, 10)

        if(isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid Pagination Values"
            })
        }

        if(!hr){
            return res.status(404).json({
                success: false,
                message: "HR Not Found"
            })
        }
        const skip = (pageNum - 1) * limitNum

        let filter = {hrId}
        if(startDate || endDate) {
            filter.scheduledAt = {};
            if(startDate) filter.scheduledAt.$gte = new Date(startDate)
            if(endDate) filter.scheduledAt.$lte = new Date(endDate)
        }
        
        const interviews = await InterviewModel.find({hrId}).skip(skip).limit(limitNum).sort({scheduledAt: 1})
        const totalInterview = await InterviewModel.countDocuments({hrId})

        return res.status(200).json({
            success: true,
            message: interviews.length === 0 ? "No Interviews Found" : "Interviews Data fetched successfully",
            totalInterview,
            currentPage: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalInterview / limitNum),
            data: interviews
        })

    } catch (error) {
        console.log("Error fetching all the interview: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching interview details. Please try again"
        })
    }
}

// Controller to reschedule the interview
exports.rescheduleInterview = async (req, res) => {
    try {
        const interviewId = req.params.interviewId
        const hrId = req.user._id

        const hr = await HRProfile.findById(hrId)
        if(!hr) {
            return res.status(404).json({
                success: false,
                message: "HR not found"
            })
        }

        const interview = await InterviewModel.findById(interviewId).populate({
            path: "application"
        })

        if(!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            })
        }

        if(String(interview.hrId) !== String(hrId)){
            return res.status(403).json({
                success: false,
                message: "Unauthorized to reschedule the interview"
            })
        }

        if(interview.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Interview already cancelled"
            })
        }

        const {scheduledAt, mode, linkOrLocation} = req.body

        if (!scheduledAt || !mode || !linkOrLocation || 
            typeof scheduledAt !== 'string' || 
            typeof mode !== 'string' || 
            typeof linkOrLocation !== 'string' || 
            !mode.trim() || !linkOrLocation.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill all the required details"
                });
        }
        
        const allowedModes = ["Online", "In-Person"]
        if(!allowedModes.includes(mode)) {
            return res.status(400).json({
                success: false,
                message: "Please Enter a valid value from options"
            })
        }

        const previousDateTime = interview.scheduledAt.toLocaleString();
        const formattedDate = new Date(scheduledAt);
        interview.scheduledAt = formattedDate
        interview.mode = mode
        interview.linkOrLocation = linkOrLocation
        interview.status = "Rescheduled"

        await interview.save();

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
        const interviewLink = interview.linkOrLocation

        try {
            const emailResponse = await mailSender(
                email,
                "Interview Invitation - Rescheduled",
                interviewRescheduledEmail(
                    candidateName,
                    jobTitle,
                    "Huvano HRMS",
                    previousDateTime,
                    interviewDateTime,
                    interviewMode,
                    interviewLink
                )
            )

            console.log("Email Response || Rescheduling Email: ", emailResponse)
        } catch (error) {
            console.log("Error while sending interview rescheduling mail", email)
            return res.status(400).json({
                success: false,
                message: "Something went wrong sending the mail. Please try again"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Interview Rescheduled Successfully",
            data: interview
        })

    } catch (error) {
        console.log("Error in rescheduling the interview: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong rescheduling the interview. Please try again"
        })
    }
}

// Controller for HR to respond to the reschedule request by the candidate
exports.rescheduleRequest = async (req, res) => {
    try {
        const hrId = req.user._id
        const hr = await HRProfile.findById(hrId)

        if(!hr) {
            return res.status(404).json({
                success: false,
                message: "HR Not Found"
            })
        }

        const interviewId = req.params.interviewId
        const interview = await InterviewModel.findById(interviewId)

        if(!interview) {
            return res.status(404).json({
                success: false,
                message: "No Scheduled Interview Found"
            })
        }

        if(String(interview.hrId) !== String(hrId)){
            return res.status(403).json({
                success: false,
                message: "Unauthorized to reschedule the interview"
            })
        }

        const allowedResponse = ["Accepted", "Declined"]
        const latestChange = interview.requestedInterviewChanges[interview.requestedInterviewChanges.length - 1];
        const {rescheduleRequest} = req.body

        if(!allowedResponse.includes(rescheduleRequest)){
            return res.status(400).json({
                success: false,
                message: "Please select a valid option"
            })
        }

        if(rescheduleRequest === "Accepted") {
            const {scheduledAt, mode, linkOrLocation} = req.body

            if (!scheduledAt || !mode || !linkOrLocation || 
                typeof scheduledAt !== 'string' || 
                typeof mode !== 'string' || 
                typeof linkOrLocation !== 'string' || 
                !mode.trim() || !linkOrLocation.trim()) {
                    return res.status(400).json({
                        success: false,
                        message: "Please fill all the required details"
                    });
            }
            
            const allowedModes = ["Online", "In-Person"]
            if(!allowedModes.includes(mode)) {
                return res.status(400).json({
                    success: false,
                    message: "Please Enter a valid value from options"
                })
            }

            const previousDateTime = interview.scheduledAt.toLocaleString();
            const formattedDate = new Date(scheduledAt);
            if (isNaN(formattedDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date format for scheduledAt"
                });
            }
            if (formattedDate <= new Date()) {
                return res.status(400).json({
                    success: false,
                    message: "Scheduled date must be in the future"
                });
            }
            interview.scheduledAt = formattedDate
            interview.mode = mode
            interview.linkOrLocation = linkOrLocation
            interview.status = "Rescheduled"
            latestChange.rescheduleRequest = rescheduleRequest
        }

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
        const interviewLink = interview.linkOrLocation
        const response = latestChange.rescheduleInterview

        try {
            if(response === "Accepted") {
                const emailResponse = await mailSender(
                    email,
                    "Reschedule Request - Accepted || Interview Invite",
                    rescheduleRequestAcceptedEmail(
                        candidateName,
                        jobTitle,
                        "Huvano HRMS",
                        interviewDateTime,
                        interviewMode,
                        interviewLink
                    )
                )
                console.log("Email Response || Accepting the Rescheduling Request: ", emailResponse)
            }

            if(response === "Declined") {
                const emailResponse = await mailSender(
                    email,
                    "Reschedule Request - Declined",
                    rescheduleRequestDeclinedEmail(
                        candidateName,
                        jobTitle,
                        "Huvano HRMS",
                        interviewDateTime,
                        "Interviewer not Available at the Requested Time"
                    )
                )
                console.log("Email Response || Declining the Rescheduling Request: ", emailResponse)
            }
        } catch (error) {
            console.log("Error while sending the mail for responding to reschedule request: ", error)
            return res.status(500).json({
                success: false,
                message: "Something went wrong sending the mail"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Response Submitted Successfully",
            data: interview
        })
    } catch (error) {
        console.error("Error while responding to rescheduling request", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong responding to reschedule request. Please try again"
        })
    }
}