const express = require("express")
const app = express()
require("dotenv").config()
const connectDb = require("./config/db")
const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/admin")
const hrRoutes = require("./routes/hr")
const PORT = process.env.PORT || 4001

// Middlewares
app.use(express.json())
app.use("/api/v1", authRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/hr", hrRoutes)

// Connection to Database
connectDb().then(() => {
    console.log("Database Connection Successful")
    app.listen(PORT, () => {
        console.log(`Server running on Port: ${PORT}`)
    })
}).catch(() => {
    console.log("Database Connection Failed")
})

// Default Route to check the server working or not
app.get("/", async(req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Server Started Properly"
        })
    } catch (error) {
        console.log("Error while starting the server: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong, starting the server"
        })
    }
})
