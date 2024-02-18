const Donation = require('../model/donationsModel');
const APIFeatures = require('../../utils/APIFeatures');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const cloudinary = require('cloudinary').v2;


exports.createDonation = catchAsync(async (req, res) => {
  try {
      const images = [];

      if (req.files && req.files.length > 0) {
          const uploadPromises = req.files.map(async (file) => {
              if (!file.originalname) {
                  console.log("Skipping file without originalname");
                  return null;
              }

              const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
              
              return new Promise((resolve, reject) => {
                  cloudinary.uploader.upload(dataUrl, (error, result) => {
                      if (error) {
                          reject(error);
                      } else {
                          resolve(result.secure_url);
                      }
                  });
              });
          });

          const uploadedImages = await Promise.all(uploadPromises);
          images.push(...uploadedImages.filter((img) => img !== null));

      } else {
          console.log("No files found");
      }

      const newDonation = await Donation.create({
          ...req.body,
          images: images,
      });

      newDonation.email = undefined;

      res.status(201).json({
          status: 'success',
          data: {
              donation: newDonation,
          }
      });
  } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
      });
  }
});

exports.getAllDonations = catchAsync(async (req,res) => {

    //EXECUTE QUERY
    const features = new APIFeatures(Donation.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    const donations = await features.query;

    donations.email = undefined;


    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: donations.length,
        data:{
            donations
        }
    });
});

exports.deleteDonation = catchAsync(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
      return next(new AppError('No Donation found with that ID', 404));
  }

  const publicIds = donation.images.map((imageUrl) => imageUrl.split('/').pop().split('.')[0]);

  await cloudinary.api.delete_resources(publicIds);

  await donation.remove();

  res.status(200).json({
      status: 'success',
      data: null,
  });
});
