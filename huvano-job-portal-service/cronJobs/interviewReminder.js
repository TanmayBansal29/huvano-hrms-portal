const cron = require("node-cron");
const InterviewModel = require("../models/Interview.model");
const mailSender = require("../utils/mailSender");
const { interviewReminderEmail } = require("../mails/interviewReminderEmail");


const sendInterviewReminders = async () => {
    try {
        console.log("Cron Job Started: Send Interview Reminders");
        const now = new Date();

        const reminderWindows = [
            {min: 705, max: 735, label: "12-hour", flag: "reminder12Sent"},
            {min: 23, max: 37, label: "30-minute", flag: "reminder30Sent"}
        ]

        for(const window of reminderWindows) {
            const from = new Date(now.getTime() + window.min * 60 * 1000);
            const to = new Date(now.getTime() + window.max * 60 * 1000)

            const interviews = await InterviewModel.find({
            scheduledAt: {$gte: from, $lte: to},
            [window.flag]: {$ne: true}
            }).populate({
                path: "application",
                populate: {
                    path: "jobId",
                    select: "title"
                }
            })

            for (const interview of interviews) {
                const candidateName = interview?.application?.myInformation?.firstName || "Candidate"
                const email = interview?.application?.myInformation?.emailAddress;
                const jobTitle = interview?.application?.jobId?.title
                const scheduledTime = interview?.scheduledAt

                if(email && scheduledTime) {
                    await mailSender(
                        email,
                        "Interview Reminder - Best of Luck",
                        interviewReminderEmail(candidateName,
                            jobTitle,
                            scheduledTime,
                            window.label
                        )
                    )

                    interview[window.flag] = true
                    await interview.save()
                }
            }
        }

    } catch (error) {
        console.log("Error in Interview Reminder Cron:", error);
    }
}

cron.schedule("*/15 * * * *", sendInterviewReminders)