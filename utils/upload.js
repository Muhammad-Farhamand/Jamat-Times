const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      console.log('Only png, jpg, and jpeg file types are supported');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  }
});

module.exports = upload;