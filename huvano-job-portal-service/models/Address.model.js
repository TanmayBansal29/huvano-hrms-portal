const mongoose = require("mongoose")

const addressSchema = mongoose.Schema({
    houseAddress: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Address", addressSchema)