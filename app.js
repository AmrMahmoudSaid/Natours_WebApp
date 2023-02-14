const express = require(`express`);
const morgan = require('morgan');
const appError = require('./utilities/appError');
const  toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorControllrt');
const app = express();
// process.env.NODE_ENV= 'production';
if (process.env.NODE_ENV==='development'){
  app.use(morgan('dev'));
  console.log(process.env.NODE_ENV);
}
app.use(express.json());
// app.use(express.static());
app.use('/api/v1/tours' , toursRouter);
app.use('/api/v1/users' , usersRouter);
app.all("*",(req , res ,next)=>{
    next(new appError(`cant find ${req.originalUrl} in our server`,404));
})
app.use(globalErrorHandler);
module.exports =app;