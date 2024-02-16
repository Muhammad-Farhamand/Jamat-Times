const Mosque = require('../model/mosqueModel');
const APIFeatures = require('../../utils/APIFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');


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
