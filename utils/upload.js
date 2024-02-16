const path = require('path');
const multer = require('multer');
const uuid = require('uuid');


let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname);
        let uniqueFilename = `${uuid.v4()}${ext}`;
        cb(null, uniqueFilename);
    }
});

let upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback){
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            console.log('Only png, jpg, and jpeg file types are supported');
            callback(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
});

module.exports = upload;