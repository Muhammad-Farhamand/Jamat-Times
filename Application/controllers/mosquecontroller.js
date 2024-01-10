const Mosque = require('../model/mosqueModel');
const APIFeatures = require('../../utils/APIFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.createMosque = catchAsync(async (req,res) => {
    const newMosque = await Mosque.create(req.body);

    res.status(201).json({
        status: "status",
        data: {
            mosque: newMosque
        }
    });
});

exports.getAllMosque = catchAsync(async (req,res) => {

    //EXECUTE QUERY
    const features = new APIFeatures(Mosque.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    const mosques = await features.query;


    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: mosques.length,
        data:{
            mosques
        }
    });
});

exports.getMosque = catchAsync(async (req,res) => {

    const mosque = await Mosque.findById(req.params.id);

    if(!mosque){
        return next(new AppError('No Mosque found with that ID', 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            mosque
        }
    });
});

exports.getTimings = catchAsync(async (req, res) => {

    const mosque = await Mosque.findById(req.params.id, 'timings');

    if(!mosque){
        return res.status(404).json({ error: 'Mosque not found'});
    }

    const formattedTimings = {
        Fajar: mosque.timings[0] || null,
        Zuhr: mosque.timings[1] || null,
        Asar: mosque.timings[2] || null,
        Maghrib: mosque.timings[3] || null,
        Esha: mosque.timings[4] || null,
    };

    res.json(formattedTimings);

});

exports.deleteMosque = catchAsync(async (req,res) => {
    const mosque = await Mosque.findByIdAndDelete(req.params.id)

    if(!mosque){
        return next(new AppError('No Mosque found with that ID', 404))
    }


    res.status(200).json({
        status: "success",
        data: null
    });
});