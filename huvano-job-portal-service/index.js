const mongoose = require("mongoose")
const express = require("express")
const candidateRoutes = require("./routes/Candidate")
const HRRoutes = require("./routes/HR")
const JobPostRoutes = require("./routes/JobPost")
const CandidateJobPostsRoutes = require("./routes/JobCandidate")
const InterviewScheduleRoutes = require("./routes/InterviewScheduling")
const InterviewInviteRoutes = require("./routes/InterviewInvite")
const ApplicationCandidateRoutes = require("./routes/ApplicationCandidate")
const ApplicationHRRoutes = require("./routes/ApplicationHR")
require("dotenv").config()
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("./cronJobs/autoDeclineInterviews")

const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: "http://localhost:4000",
        credentials: true
    })
)

// Routes
app.use("/api/v1/auth", candidateRoutes)
app.use("/api/v1/auth/HR", HRRoutes)
app.use("/api/v1/job", JobPostRoutes)
app.use("/api/v1/jobPosts", CandidateJobPostsRoutes)
app.use("/api/v1", InterviewScheduleRoutes)
app.use("/api/v1/check", InterviewInviteRoutes)
app.use("/api/v1/send", ApplicationCandidateRoutes)
app.use("/api/v1/retreive", ApplicationHRRoutes )

// Connection to Database and Starting the server
connectDB().then(() => {
    console.log("Database Connection Established")
    app.listen(process.env.PORT, () => {
        console.log(`Server Started at PORT ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("Failed to Connect to Database", err)
})

// Default Route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Server is up and running...."
    })
})