const express = require("express")
const router = express.Router()

// Importing important controllers for mapping with routes
const {getJobPosts} = require("../controllers/JobCandidate")


// Route for getting all the job Posts
router.get("/jobs/feed", getJobPosts)


module.exports = router