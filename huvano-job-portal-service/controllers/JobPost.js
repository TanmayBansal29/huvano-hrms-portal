const JobPost = require("../models/JobPost.model");
const { validateJobPostInput } = require("../utils/jobPostValidator");

// Controller for creating a Job Post
exports.createJob = async (req, res) => {
    try {
        // Destructing the req body
        const {title, location, experienceLevel, positionType, salary, educationLevel, jobDescription, rolesAndResponsibilities, skillsRequired} = req.body

        // Validating all the fields of Job Post
        const errors = validateJobPostInput(req.body)
        if(errors.length > 0){
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: errors
            })
        }

        // Generating the jobID - 5 digit Job ID
        let jobId;
        let isUnique = false
        while(!isUnique){
            jobId = Math.floor(10000 + Math.random() * 90000);
            const existing = await JobPost.findOne({jobId})
            if(!existing) isUnique = true
        }

        // Creating a new Job and saving into the database
        const newJob = await JobPost.create({
            jobId,
            title,
            location,
            experienceLevel,
            positionType,
            salary,
            educationLevel,
            jobDescription,
            rolesAndResponsibilities,
            skillsRequired,
            postedBy: req.user.id
        })

        return res.status(200).json({
            success: true,
            newJob,
            message: "New Post Created Successfully"
        })

    } catch (error) {
        console.log("Error while Posting Job: ", error)
        res.status(500).json({
            success: false,
            message: "Something went wrong posting the job. Please try again"
        })

    }
}

// Controller for updating a Job Post
exports.updateJobPost = async (req, res) => {
    try {
        // Getting Job Id from params
        const jobId = req.params.jobId
        // Destructing req body
        const {title, location, experienceLevel, positionType, salary, educationLevel, jobDescription, rolesAndResponsibilities, skillsRequired} = req.body

        // validating the fields
        const errors = validateJobPostInput(req.body)
        if(errors.length > 0){
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: errors
            })
        }

        // Checking where the job exists or not
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(400).json({
                success: false,
                message: "Job Post Not Found"
            })
        }

        // Updating all the fields
        if(title) job.title = title
        if(location) job.location = location
        if(experienceLevel) job.experienceLevel = experienceLevel
        if (positionType) job.positionType = positionType;
        if (salary) job.salary = salary;
        if (educationLevel) job.educationLevel = educationLevel;
        if (jobDescription) job.jobDescription = jobDescription;
        if (rolesAndResponsibilities) job.rolesAndResponsibilities = rolesAndResponsibilities;
        if (skillsRequired) job.skillsRequired = skillsRequired;

        // Saving all the changes to the Job post
        await job.save();
        return res.status(400).json({
            success: false,
            message: "Job Post Updated Successfully",
            job
        })

    } catch (error) {
        console.log("Error while updating a Job Post: ", error)
        res.status(500).json({
            success: false,
            message: "Something went Wrong Updating Job Post. Please try again",
            error: error.message,
        })
    }
}

// Controller for Deleting the job post
exports.deletejobPost = async (req, res) => {
    try {
        // Getting the Job Id from params 
        const jobId = req.params.jobId

        // Checking whether job exists or already deleted
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(400).json({
                success: false,
                message: "Job does not exist already"
            })
        }

        // Checking whether User authorized to delete the post
        if(job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this job post"
            })
        }

        // Deleting the job post based on jobId
        await job.deleteOne()
        return res.status(200).json({
            success: true,
            message: "Job Post Deleted Successfully"
        })
    } catch (error) {
        console.log("Error While Deleting Job Post: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong deleting Job Post. Please try again"
        })
    }
}

// Controller for Getting all the Job Posts by HR
exports.getJobPostsByHR = async (req, res) => {
    try {
        // Getting the HR to fetch the Job Posts by them
        const hrId = req.user.id
        // Pagination Query
        const {page = 1, limit = 10, status = "Active"} = req.query;
        const query = {
            postedBy: hrId,
            status: status
        }

        // Pagination and Sorting Logic
        const skip = (page - 1) * limit
        const jobPosts = await JobPost.find(query).skip(skip).limit(limit).sort({createdAt: -1})

        // Total count of pagination
        const totalPosts = await JobPost.countDocuments(query)

        return res.status(200).json({
            success: true,
            jobPosts,
            totalPosts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            message: "Job Posts Retrieved Successfully"
        })

    } catch (error) {
        console.log("Error While fetching all the job posts: ", error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong fetching Job Posts",
            error: error.message
        })
    }
}

// Controller to get the job post by ID
exports.getJobPostById = async (req, res) => {
    try {
        // Getting the jobId from params
        const jobId = req.params.jobId

        // checking whether job exists or not
        const job = await JobPost.findOne({jobId})
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job does not exits"
            })
        }

        return res.status(200).json({
            success: true,
            job,
            message: "Job Post Fetched Successfully"
        })
    } catch (error) {
        console.log("Error While retreiving the job post: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the job post",
            error: error.message
        })
    }
}