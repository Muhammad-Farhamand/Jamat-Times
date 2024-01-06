const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');


// mongoose.connect(process.env.DATABASE_LOCAL, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// }).then( () => console.log('DB connection Successful'))
// .catch( () => console.log('DB connection Failed'));

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB , {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then( () => console.log('DB connection Successful'))
.catch( () => console.log('DB connection Failed'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});