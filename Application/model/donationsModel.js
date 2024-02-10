const mongoose = require('mongoose');

const doantionSchema = new mongoose.Schema({

    title:{
        type:String,
        required: [true, "Please Enter Title"]
    },

    amount:{
        type:Number,
        required: [true, "Please Enter Amount"]
    },

    masjidName:{
        type:String,
        required: [true, "Please Enter Name"]
    },

    description:{
        type:String,
        required: [true, "Please Enter Description"]
    },

    imageLinks: {
        type: [String],
        required: true,
        validate: {
          validator: (value) => value.length > 0,
          message: 'Image links array must not be empty.',
        },
    },

});

const Donations = mongoose.model('Donations', doantionSchema);

module.exports = Donations;