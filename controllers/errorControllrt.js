const appError = require('../utilities/appError');

const handelCastErrorDB = err =>{
    const message = `Invalid ${err.path} : ${err.value}`;
    return new appError (message , 400);
}
const handelDublicateFieldDB = err=>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Dublicate filed value : ${value} please use another value`;
    return new appError(message , 400);
}
const handelValidationErrorDB = err=> {
    //Object.values to loop of all object element
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new appError(message, 400);
}
const handelJsonWebTokenError = () =>{
    const message = `Invalid token. please try to log in again`;
    return new appError(message, 401);
}
const handelJWTexpired = () => new appError('your token is expired. please login again' , 401);
const sendErrorForDev = (err ,req, res) =>{
    //api
    if(req.originalUrl.startsWith('/api')){
        console.log(err);
        res.status(err.statusCode).json({
            status: err.status ,
            error : err ,
            message : err.message,
            stack : err.stack
        })
    }else {
        //frontEnd
        console.error('error  :',err)
        res.status(err.statusCode).render('error',{
            title : 'Something went wrong!' ,
            msg : err.message
        })
    }

}

const sendErrorForProd =(err,req ,res) =>{
    //API
    //trusted error
    if(req.originalUrl.startsWith('/api')){
        if (err.isOperational){
            return res.status(err.statusCode).json({
                status: err.status ,
                message : err.message
            })
        }else {
            //log error
            console.error('error  :',err)
            //unknown error
            return res.status(500).json({
                status:'error' ,
                massage : 'Something went very wrong'
            })
        }
    }
    //frontEnd
    console.error('error  :',err)
    if (err.isOperational){
        res.status(err.statusCode).render('error',{
            title : 'Something went wrong!' ,
            msg : err.message
        })
    }else {
        res.status(err.statusCode).render('error',{
            title : 'Something went wrong!' ,
            msg : 'please try again later'
        });
    }
}

module.exports = (err, req , res , next) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status ||'error';
    if (process.env.NODE_ENV==='development'){
       sendErrorForDev(err,req,res);
    } else if (process.env.NODE_ENV==='production') {
        let error = {...err};
        error.message=err.message;
        //error from database
        //1) invalid data
        if (error.name ==='CastError') error = handelCastErrorDB(error);
        //2) duplicate data
        if (error.code===11000) error =handelDublicateFieldDB(error);
        //3) mongoose validation error
        if (error.name==='validationError') error = handelValidationErrorDB(error);
        //4) token error
        if (error.name==='JsonWebTokenError') error = handelJsonWebTokenError();
        if (error.name ==='TokenExpiredError') error = handelJWTexpired();
        sendErrorForProd(error,req,res);
    }
}