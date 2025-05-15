const mongoose = require("mongoose")

const addressSchema = mongoose.Schema({
    houseAddress: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },
    city: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    state: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    country: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    postalCode: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Address", addressSchema)