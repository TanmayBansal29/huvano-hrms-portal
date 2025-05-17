const CandidateProfile = require("../models/CandidateProfile.model");
const JobPost = require("../models/JobPost.model")


// Controller for getting all the Job Posts for Candidate to go through
exports.getJobPosts = async (req, res) => {
    try {
        // Pagination Query
        const {page = 1, limit = 10, status = "Active"} = req.query
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10)

        if(isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1){
            return res.status(400).json({
                success: false,
                message: "Invalid Pagination Parameters"
            })
        }

        const query = {
            status: status
        }

        // Pagination and Sorting Logic
        const skip = (page - 1) * limit
        const jobPosts = await JobPost.find(query).skip(skip).limit(limitNum).sort({createdAt: -1})

        // Total Count of pagination
        const totalPosts = await JobPost.countDocuments(query)

        return res.status(200).json({
            success: true,
            jobPosts,
            totalPosts,
            currentPage: pageNum,
            totalPages: Math.ceil(totalPosts / limitNum),
            message: "Job Posts Retrieved Successfully"
        })
    } catch (error) {
        console.log("Error while fetching the Job Posts", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the job posts. Please try again"
        })
    }
}

// Controller for getting the specific job post with jobID
exports.getJobPostByID = async(req, res) => {
    try {
        // Getting the jobId from req params
        const jobId = req.params.jobId

        // Checking whether job exists or not
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job Post does not exists"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Job Post Fetched Successfully",
            job
        })
    } catch (error) {
        console.log("Error while fetching job post details based on jobID: ", error)
        return res.status(500).json({
            success: false,
            message: "job details cannot be fetched. Please try again"
        })
    }
}

// Controller for applying to Job
exports.applytoJob = async (req, res) => {
    try {
        // Getting jobID from req.params
        const jobId = req.params.jobId
        
        // Checking where job exists or not
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job doesn't exists"
            })
        }

        // Getting user from req.user
        const candidateId = req.user._id
        // Checking whether candidate exists or not
        const candidate = await CandidateProfile.findById(candidateId)
        if(!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate Details Not found"
            })
        }

        
        const {myInformation, myEducation, myExperience, applicationQuestions, voluntaryQuestions} = req.body


    } catch (error) {
        console.log("Error while applying to job: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong applying to job. Please try again"
        })
    }
}