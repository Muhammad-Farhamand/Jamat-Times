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

    Fajar: {
        type: String,
        required: true,
    },

    Zuhr: {
        type: String,
        required: true,
    },

    Asar: {
        type: String,
        required: true,
    },

    Maghrib: {
        type: String,
        required: true,
    },

    Esha: {
        type: String,
        required: true,
    },

    Jummah: {
        type: String,
        required: true,
    },
    
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