const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res, redirectTo) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });

    console.log(token);

};


exports.signup = catchAsync(async (req, res, next) => {
    try{
        const newUser = await User.create({ 
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        });
    
        createSendToken(newUser, 201, res);
    }catch (err) {
        if (err.code === 11000) {
            if (err.keyPattern && err.keyPattern.email === 1) {
                return res.status(400).json({ status: 'error', message: 'Email is already in use' });

            } else if (err.keyPattern && err.keyPattern.username === 1) {
                return res.status(400).json({ status: 'error', message: 'Username is already taken' });

            }
        }else if (err.name === 'ValidationError') {
            return res.status(400).json({ status: 'error', message: err.message });

        } else {
            return res.status(500).json({ status: 'error', message: 'An error occurred' });
            
        }
    }
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user || !await user.correctPassword(password, user.password)){
        return res.status(401).json({ status: 'error', message: 'Incorrect email or password' });
    }

    createSendToken(user, 200, res)

    console.log(user);
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.jwt){
        token = req.cookies.jwt
    }
    
    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belonging to this token does no longer exist', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again', 401));
    }

    req.user = currentUser;
    next();
});

exports.pushDonation = catchAsync(async (req, res, next) => {

    const push = await User.findOneAndUpdate({ username: req.params.username },
    {
        $push: {
            donations: {
                mosqueName: req.body.mosqueName,
                title: req.body.title,
                amount: req.body.amount,
                description: req.body.description
            }
        }
    },
    { new: true }
    );

    res.status(201).json({
        status: 'success',
        data: {
            push
        }
    });
});

exports.viewDonations = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            donations: user.donations
        }
    });
});