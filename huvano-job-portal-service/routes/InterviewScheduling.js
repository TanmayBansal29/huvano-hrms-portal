const express = require("express")
const router = express.Router()

const { scheduleInterview, rescheduleInterview, cancelInterview, getAllInterviews, rescheduleRequest } = require("../controllers/InterviewScheduling")
const { auth, isHR } = require("../middlewares/auth")

// Route for HR to schedule the Interview
router.post("/schedule/interview", auth, isHR, scheduleInterview)

// Route for HR to reschedule the Interview
router.patch("/reschedule/interview/:interviewId", auth, isHR, rescheduleInterview)

// Route for HR to cancel the scheduled Interview
router.patch("/cancel/interview/:interviewId", auth, isHR, cancelInterview)

// Route for HR to get all the interviews scheduled
router.get("/show/interviews", auth, isHR, getAllInterviews)

// Route for HR to respond to the reschedule request from Candidate
router.patch("/response/reschedule/interview/:interviewId", auth, isHR, rescheduleRequest)

module.exports = router