const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Enter Title"]
    },
    amount: {
        type: Number,
        required: [true, "Please Enter Amount"]
    },
    mosqueName: {
        type: String,
        required: [true, "Please Enter Name"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Description"]
    },
    images: {
        type: [String],  // Updated to allow an array of strings
    },
});

const Donations = mongoose.model('Donations', donationSchema);

module.exports = Donations;