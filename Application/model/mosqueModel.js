const mongoose = require('mongoose');
const AppError = require('./../../utils/appError')

const mosqueSchema = new mongoose.Schema({

    mosqueName: {
        type: String,
        required: [true, "Please enter Mosque name"]
    },

    latitude: {
        type: Number,
        required: true,
    },

    longitude: {
        type: Number,
        required: true,
    },

    timings: {
        type:[String],
        required: true,
        validate: {
            validator: function(value){
                return value.length === 5;
            },
            message: "Timing array must have 5 elements only!"
        }
    }
});

mosqueSchema.pre('save', async function(next){
    try {
        const existingLocation = await mongoose.model('Mosque').findOne({
            latitude: this.latitude,
            longitude: this.longitude,
        });

        if (existingLocation){
            throw new AppError('Location Already exist', 409);
        }

        next();
    }
    catch(error){
        next(error);
    }
});

const Mosque = mongoose.model('Mosque', mosqueSchema);

module.exports = Mosque;