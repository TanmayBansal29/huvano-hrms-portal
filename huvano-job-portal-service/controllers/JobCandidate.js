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

// Controller to save the Jobs shown on the portal
exports.saveJobs = async (req, res) => {
    try {
        const candidateId = req.user?._id
        const jobId = req.params.jobId

        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "No Job Found"
            })
        }

        const candidate = await CandidateProfile.findById(candidateId)
        if(!candidate) {
            return res.status(404).json({
                success: false,
                message: "No Candidate Found"
            })
        }

        if(candidate.savedJobs.includes(jobId)){
            return res.status(400).json({
                success: false,
                message: "Job Already Saved"
            })
        }

        candidate.savedJobs.push(jobId)
        await candidate.save()

        return res.status(200).json({
            success: true,
            message: "Job Saved Successfully"
        })
    } catch (error) {
        console.log("Error while saving the job: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong saving the job, Please try again"
        })
    }
}

// Controller to get all the saved jobs
exports.getSavedJobs = async (req, res) => {
    try {
        const {page = 1, limit = 10} = req.query
        const pageNum = parseInt(page, 10)
        const limitNum = parseInt(limit, 10)

        if(isNaN(pageNum) || isNaN(limitNum || pageNum < 1 || limitNum < 1)){
            return res.status(400).json({
                success: false,
                message: "Invalid Pagination Parameters"
            })
        }
        const skip = (pageNum-1)*limitNum
        const candidateId = req.user?._id
        const candidate = await CandidateProfile.findById(candidateId).lean()
        if(!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate Not Found"
            })
        }

        const totalSaved = candidate.savedJobs?.length || 0
        const paginatedIds = candidate.savedJobs?.slice(skip, skip + limitNum)

        if(!paginatedIds || paginatedIds.length === 0){
            return res.status(404).json({
                success: false,
                message: "No Saved Job Found"
            })
        }

        const savedJobs = await JobPost.find({_id: {$in: paginatedIds}})
        return res.status(200).json({
            success: true,
            message: "Saved Jobs Fetched Successfully",
            savedJobs,
            total: totalSaved,
            page: pageNum,
            limit: limitNum
        })

    } catch (error) {
        console.log("Error while fetching saved jobs", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching saved jobs. Please try again"
        })
    }
}

// Controller to unsave a particular job
exports.unsaveJob = async (req, res) => {
    try {
        const candidateId = req.user?._id
        const jobId = req.params.jobId

        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "No Job Found"
            })
        }

        const candidate = await CandidateProfile.findById(candidateId)
        if(!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate Not Found"
            })
        }

        if(!candidate.savedJobs.includes(jobId)){
            return res.status(404).json({
                success: false,
                message: "Job is not present in saved jobs"
            })
        }

        candidate.savedJobs = candidate.savedJobs.filter(
            (savedJobId) => savedJobId.toString() !== jobId
        );

        await candidate.save();

        return res.status(200).json({
            success: true,
            message: "Job Removed from saved jobs successfully"
        })

    } catch (error) {
        console.log("Error Occured while unsaving the job: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong unsaving the job post. Please try again"
        })
    }
}

