const Donation = require('../model/donationsModel');
const APIFeatures = require('../../utils/APIFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');


exports.createDonation = catchAsync(async (req,res) => {
    const newDonation = await Donation.create(req.body);

    res.status(201).json({
        status: "status",
        data: {
            donation: newDonation
        }
    });
});

exports.getAllDonations = catchAsync(async (req,res) => {

    //EXECUTE QUERY
    const features = new APIFeatures(Donations.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    const donations = await features.query;


    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: donations.length,
        data:{
            donations
        }
    });
});