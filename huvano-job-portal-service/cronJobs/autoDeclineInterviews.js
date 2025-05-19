const cron = require("node-cron");
const InterviewModel = require("../models/Interview.model");
const mailSender = require("../utils/mailSender");
const { interviewDeclinedEmail } = require("../mails/interviewAutoDeclinedEmai");

const autoDeclineInterviews = async () => {
    try {
        console.log("Cron Job Started: Auto Decline Interviews")

        const now = new Date();
        const cutOffTime = new Date(now.getTime() - 48 * 60 * 60 * 1000);

        const interviewsToDecline = await InterviewModel.find({
            response: "Pending",
            createdAt: {$lte: cutOffTime}
        }).populate({
            path: "application",
            populate: {
                path: "jobId",
                select: "title"
            }
        })

        for(const interview of interviewsToDecline) {
            interview.response = "Decline";
            await interview.save()

            const candidateName = interview?.application?.myInformation?.firstName || "Candidate"
            const email = interview?.application?.myInformation?.emailAddress;
            const jobTitle = interview?.application?.jobId?.title || "a role";

            if(email) {
                await mailSender (
                    email,
                    "Interview Invite Auto Declined",
                    interviewDeclinedEmail(candidateName,jobTitle, "Huvano HRMS")
                )
            }
        }
    } catch (error) {
        console.log("Error in Auto Decline Interview Cron:", error)
    }
}

cron.schedule("0 1 * * *", autoDeclineInterviews)