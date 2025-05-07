const mongoose = require("mongoose")
const express = require("express")
require("dotenv")
const connectDB = require("./config/database")

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.end("Hello World")
})

connectDB().then(() => {
    console.log("Database Connection Established")
    app.listen(process.env.PORT, () => {
        console.log(`Server Started at PORT ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("Failed to Connect to Database", err)
})