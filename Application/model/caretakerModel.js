const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const caretakerSchema = mongoose.Schema({

    name:{
        type: String,
        required: [true, 'Please enter name']
    },

    mosqueName: {
        type: String,
        required: [true, 'Please provide Mosque name']
    },

    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a Valid email']
    },

    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8,
        select: false
    },


});

caretakerSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

caretakerSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

const Caretaker = mongoose.model('Caretaker', caretakerSchema);

module.exports = Caretaker;
