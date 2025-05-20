const express = require("express")
const { auth, isHR } = require("../middlewares/auth")
const { getAllApplications, getApplicationById, updateApplicationStatus } = require("../controllers/ApplicationsHR")
const router = express.Router()


// Router for HR to get all the applications for the job
router.get("/job/applications/:jobId", auth, isHR, getAllApplications)

// Router for HR to get a particular application
router.get("/job/application/:applicationId", auth, isHR, getApplicationById)

// Router for HR to update the application status
router.patch("/job/application/updateStatus/:applicationId", auth, isHR, updateApplicationStatus)

module.exports = router
