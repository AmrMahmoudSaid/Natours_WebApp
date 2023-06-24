const path = require('path');
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
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorControllrt');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const body_parser = require('body-parser');
const app = express();
app.set('view engine' , 'pug');
//use path because will automatically create a correct path
app.set('views' , path.join(__dirname,'views'))
//implement Cors
app.use(cors());
app.options('*',cors());
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

app.post('/webhook-checkout' ,body_parser({type : 'application/josn'}), bookingController.webhookCheckout )

//Body parser
app.use(express.json({limit : '10kb'}));
//for form
app.use(express.urlencoded({extended :true,limit:'10kb'}));
app.use(cookieParser());
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
app.use(compression());
//server static file
app.use(express.static(`${__dirname}/public`));

//set time
app.use((req,res,next)=>{
    req.requestTime =new Date().toDateString();
    next();
})

app.use('/' , viewRouter);
app.use('/api/v1/tours' , toursRouter);
app.use('/api/v1/users' , usersRouter);
app.use('/api/v1/reviews' , reviewRouter);
app.use('/api/v1/booking' , bookingRouter);

app.all("*",(req , res ,next)=>{
    next(new appError(`cant find ${req.originalUrl} in our server`,404));
})
app.use(globalErrorHandler);
module.exports =app;