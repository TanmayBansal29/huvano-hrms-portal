const express = require("express")
const router = express.Router()

// Importing important controllers for mapping with routes
const {getJobPosts, getJobPostByID} = require("../controllers/JobCandidate")

// Route for getting all the job Posts
router.get("/jobs/feed", getJobPosts)

// Route for getting job details by jobId
router.get("/job/post/:jobId", getJobPostByID)


module.exports = router