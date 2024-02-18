const mongoose = require('mongoose');
const validator = require('validator');

const donationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a Valid email']
    },
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