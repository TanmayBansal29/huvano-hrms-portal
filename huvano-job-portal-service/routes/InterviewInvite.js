const express = require("express")
const { auth, isCandidate } = require("../middlewares/auth")
const { getInterviewDetails, updateResponse, requestReschedule } = require("../controllers/InterviewInvite")
const router = express.Router()


// Route for Candidate to get the details of interview Scheduled
router.get("/get/interview/details/:jobId", auth, isCandidate, getInterviewDetails)

// Route for Candidate to respond to the interview invite
router.patch("/update/response/interview/:interviewId", auth, isCandidate, updateResponse)

// Route for candidate to request for reschedule of interview
router.patch("/request/reschedule/interview/:interviewId", auth, isCandidate, requestReschedule)

module.exports = router