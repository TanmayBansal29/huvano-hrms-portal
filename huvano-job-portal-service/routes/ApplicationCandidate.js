const express = require("express")
const { auth, isCandidate } = require("../middlewares/auth")
const { applytoJob, getApplications, getParticularApplication, withdrawApplication } = require("../controllers/ApplicationsCandidate")
const router = express.Router()


// Router for Candidate to apply for a particular job
router.post("/apply/job/:jobId", auth, isCandidate, applytoJob)

// Router for Candidate to get all the applications
router.get("/job/applications", auth, isCandidate, getApplications)

// Router for Candidate to fetch a particular application
router.get("/job/application/:applicationId", auth, isCandidate, getParticularApplication)

// Router for Candidate to withdraw the application
router.patch("/job/application/withdraw/:applicationId", auth, isCandidate, withdrawApplication)

module.exports = router