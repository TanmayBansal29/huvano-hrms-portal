const express = require("express")
const router = express.Router()

// Importing important controllers and middlewares to create the jobpost routes
const {createJobPost, updateJobPost, deletejobPost, getJobPostsByHR, getJobPostById, closeJobPost} =  require("../controllers/JobPost")
const { auth, isHR } = require("../middlewares/auth")


// Route for creating the job
router.post("/create/jobPost", auth, isHR, createJobPost)

// Route for updating the job post
router.patch("/update/jobPost/:jobId", auth, isHR, updateJobPost)

// Route for deleting the job post
router.delete("/delete/jobPost/:jobId", auth, isHR, deletejobPost)

// Router for getting all the job posts from HR
router.get("/hr/jobs", auth, isHR, getJobPostsByHR)

// Router for getting the job post by jobId
router.get("/job/:jobId", auth, isHR, getJobPostById)

// Router for changing the status of the job post
router.patch("/job/changeStatus/:jobId", auth, isHR, closeJobPost)

module.exports = router