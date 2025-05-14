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