const express = require('express');
const path = require('path');
// const AppError = require('./utils/appError');

const user = require('./Application/routes/userRoute');
const mosque = require('./Application/routes/mosqueRoute');

const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const app = express()

// Security headers
app.use(helmet());

// limits the amount of request on the server
// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: 'too many request from this IP, please try again later'
// });
// app.use('/api', limiter);

// data sanitization
app.use(mongoSanitize());
app.use(xss());

// Parser
app.use(express.urlencoded({extended: false }));
app.use(express.json());
app.use(cookieParser());

// // Serve static files from the 'Presentation' folder
// app.use(express.static(path.join(__dirname, 'Presentation')));


// // Catch-all route to serve the HTML file
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'Presentation', 'to-do.html'));
// });

// ROUTES
app.use('/api/users', user);
app.use('/api/mosques', mosque);


module.exports = app;
