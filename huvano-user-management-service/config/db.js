const mongoose = require("mongoose")
require("dotenv").config()

// Created the function to
const connectDB = async () => {
    mongoose.connect(process.env.MONGODB_URL)
}

module.exports = connectDB