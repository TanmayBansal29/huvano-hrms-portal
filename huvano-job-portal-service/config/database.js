const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    console.log("MongoDB URL: ", process.env.MONGODB_URL)
    await mongoose.connect(process.env.MONGODB_URL)
}

module.exports = connectDB