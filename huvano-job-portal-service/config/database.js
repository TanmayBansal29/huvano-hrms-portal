const mongoose = require("mongoose")
require("dotenv").config()

// Created a function that help in connecting to Database
const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
}

module.exports = connectDB