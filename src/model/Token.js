const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expireAfterSeconds: 600,
    }
});

module.exports = mongoose.model("User Token", tokenSchema);