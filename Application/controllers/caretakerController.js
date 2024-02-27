const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const CareTaker = require('../model/caretakerModel');
const Mosque = require('../model/mosqueModel');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (caretaker, mosque, statusCode, res, redirectTo) => {
    const token = signToken(caretaker._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    caretaker.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            caretaker,
            mosque
        }
    });

};

exports.caretakerLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
    }

    const user = await CareTaker.findOne({ email }).select('+password');

    if(!user || !await user.correctPassword(password, user.password)){
        return res.status(401).json({ status: 'error', message: 'Incorrect email or password' });
    }

    const mosque = await Mosque.findOne({ mosqueName: user.mosqueName });

    createSendToken(user, mosque, 200, res)


});

exports.caretakerSignup = catchAsync(async (req, res, next) => {
    try{
        const newCaretaker = await CareTaker.create({ 
            name: req.body.name,
            mosqueName: req.body.mosqueName,
            email: req.body.email,
            password: req.body.password,
        });

        const { name, email, password, ...filteredBody} = req.body
    
        createSendToken(newCaretaker, filteredBody, 201, res);

    }catch (err) {
        if (err.code === 11000) {
            if (err.keyPattern && err.keyPattern.email === 1) {
                return res.status(400).json({ status: 'error', message: 'Email is already in use' });

            }
        }else if (err.name === 'ValidationError') {
            return res.status(400).json({ status: 'error', message: err.message });

        } else {
            return res.status(500).json({ status: 'error', message: 'An error occurred' });
            
        }
    }
    next();
});

exports.createMosque = catchAsync(async (req,res) => {

    const newMosque = await Mosque.create({
        mosqueName: req.body.mosqueName,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        Fajar: req.body.Fajar,
        Zuhr: req.body.Zuhr,
        Asar: req.body.Asar,
        Maghrib: req.body.Maghrib,
        Esha: req.body.Esha,
        Jummah: req.body.Jummah
    });
});

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
