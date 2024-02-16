const Donation = require('../model/donationsModel');
const APIFeatures = require('../../utils/APIFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const fs = require('fs').promises;


exports.createDonation = catchAsync(async (req,res) => {
    let images = [];

    if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
            images.push(file.path);
        });
        req.body.images = images;
    } else if (req.file) {
        req.body.images = [req.file.path];
    }

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
    const features = new APIFeatures(Donation.find(), req.query)
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

exports.deleteDonation = catchAsync(async (req,res) => {
    const donation = await Donation.findById(req.params.id);

    if(!donation){
        return next(new AppError('No Donation found with that ID', 404))
    }

    const imagePaths = donation.images;

    for (const imagePath of imagePaths) {
        try {
            await fs.unlink(imagePath);
        } catch (error) {
            console.error(`Error deleting file: ${error.message}`);
        }
    }
    await donation.remove();


    res.status(200).json({
        status: "success",
        data: null
    });
});