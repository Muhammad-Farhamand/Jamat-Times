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

// exports.getTimings = catchAsync(async (req, res) => {

//     const mosque = await Mosque.findById(req.params.id, 'timings');

//     if(!mosque){
//         return res.status(404).json({ error: 'Mosque not found'});
//     }

//     const formattedTimings = {
//         Fajar: mosque.timings[0] || null,
//         Zuhr: mosque.timings[1] || null,
//         Asar: mosque.timings[2] || null,
//         Maghrib: mosque.timings[3] || null,
//         Esha: mosque.timings[4] || null,
//     };

//     res.json(formattedTimings);

// });

// exports.updateMosqueTimings = catchAsync(async (req, res, next) => {
//     const { timings } = req.body;

//     if (!timings || timings.length !== 5) {
//         return next(new AppError('Invalid timings data. Provide an array of 5 elements.', 400));
//     }

//     const mosque = await Mosque.findByIdAndUpdate(req.params.id,{ timings },
//         {
//             new: true,
//             runValidators: true,
//         }
//     );

//     if (!mosque) {
//         return next(new AppError('No mosque found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             mosque,
//         },
//     });
// });


exports.updateMosqueTimings = catchAsync(async (req,res) => {
    const mosque = await Mosque.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

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