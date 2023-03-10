const express = require(`express`);
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const appError = require('./utilities/appError');
const  toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorControllrt');

const app = express();
// process.env.NODE_ENV= 'production';

//Global middlewares

//http security
app.use(helmet());
 // limit req for the same IP
const limiter = rateLimit.rateLimit({
    max :100,
    windowMs : 60*60*1000,
    message : 'Too many requests from this IP , try again in an hour'
});
app.use('/api' , limiter);

// develoment logging
if (process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
    console.log(process.env.NODE_ENV);
}
//Body parser
app.use(express.json({limit : '10kb'}));

//Data sanitization against NoSQL query
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//HTTP parameter  pollution
app.use(hpp({
    whitelist : [
        'duration','ratingQuantity','ratingAverage',
        'maxGroupSize', 'difficulty','price'
    ]
}));

//server static file
app.use(express.static(`${__dirname}/public`));

//set time
app.use((req,res,next)=>{
    req.requestTime =new Date().toDateString();
    next();
})

app.use('/api/v1/tours' , toursRouter);
app.use('/api/v1/users' , usersRouter);
app.use('/api/v1/reviews' , reviewRouter);
app.all("*",(req , res ,next)=>{
    next(new appError(`cant find ${req.originalUrl} in our server`,404));
})
app.use(globalErrorHandler);
module.exports =app;