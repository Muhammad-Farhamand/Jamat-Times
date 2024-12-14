const express = require('express');
const path = require('path');

const user = require('./Application/routes/userRoute');
const mosque = require('./Application/routes/mosqueRoute');
const donation = require('./Application/routes/donationRoute');
const caretaker = require('./Application/routes/caretakerRoute');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const app = express()

// Security headers
app.use(helmet());

// limits the amount of request on the server
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many request from this IP, please try again later'
});
app.use('/api', limiter);

// data sanitization
app.use(mongoSanitize());
app.use(xss());

// Parser
app.use(express.urlencoded({extended: false }));
app.use(express.json());
app.use(cookieParser());

// uploads
app.use('/uploads', express.static('uploads'))

// ROUTES
app.use('/api/users', user);
app.use('/api/mosques', mosque);
app.use('/api/donation', donation);
app.use('/api/caretaker', caretaker);


module.exports = app;
