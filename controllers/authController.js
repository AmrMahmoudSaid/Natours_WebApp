const jwt  = require('jsonwebtoken');
const crypto = require('crypto');
const {promisify} = require('util'); // to make promises
const User = require('../models/userModel')
const catchAsync =require('../utilities/catchAsync');
const appError = require('../utilities/appError');
const sendEmail = require('../utilities/email');
const signToken = id=> {
    const token = jwt.sign({ id }, process.env.JWT_SECRETKEY,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token;
}
const sendToken = (user,statusCode ,res ) =>{
    const token =signToken(user._id);
    res.status(statusCode).json({
        status : 'success' ,
        token,
        data :{
            user
        }
    })
}
exports.signup = catchAsync(async (req ,res ,next) =>{
    const newUser= await User.create({
        name : req.body.name ,
        email : req.body.email ,
        password : req.body.password ,
        passwordConfirm : req.body.passwordConfirm ,
        passwordChangedAt : req.body.passwordChangedAt
    });
    sendToken(newUser,201,res);
});

exports.login =catchAsync(async (req , res  , next) =>{
    const {email,password} = req.body ;
    if(!email ||!password){
         return next(new appError('please enter email and password ', 404));
    }
    const user = await User.findOne({email}).select('+password');
    if (!user ||!(await user.correctPassword(req.body.password,user.password))){
        return  next(new appError('Incorrect email or password' , 401));
    }

    sendToken(user,200,res);


});

exports.protect = catchAsync(async (req , res , next ) =>{
// get token
    let token;
    if (req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token){
        return next(new appError('You are not logged in' , 401));
    }
    // console.log(token);
    //verification token
    const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRETKEY);
    // console.log(decoded);
    const uuser =await User.findById(decoded.id);
    if (!uuser){
        return next(new appError('the user belonging to this token does no longer exist.',401));
    }
    if (uuser.changePasswordAfter(decoded.iat)){
        return next (new appError('the user belonging to this token has change his password. please log in again' , 401));
    }

    req.user =uuser;
    next();
})

exports.restrictTo = (...roles) =>{
    return (req , res , next) =>{
        if (!roles.includes(req.user.role)){
            return next(new appError('you do not have permission to preform this action' , 403));
        }
        next();
    }
}
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError('There is no user with email address.', 404));
    }
    // 2) Generate the random reset token
    const resetToken = user.creatPasswordRestToken();
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    console.log(resetToken , resetURL);
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        console.log(err)
        // user.passwordResetToken = undefined;
        // user.passwordResetExpires = undefined;
        // await user.save({ validateBeforeSave: false });
        return next(new appError('There was an error sending the email. Try again later!'), 500);
    }
});

exports.restPassword = catchAsync(async (req , res , next) =>{
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordRestToken : hashToken,
        passwordRestExpires : { $gt : Date.now()}
    });
    if (!user){
        return next(new appError('Token is invalid or has expired',400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    // user.passwordRestToken = undefined;
    // user.passwordRestExpires = undefined;
    await user.save();
    sendToken(user,200,res);
});

exports.changePassword = catchAsync(async (req ,res ,next) =>{
    const user = await User.findById(req.user).select('+password');
    if (!user){
        return next(new appError('Token is invalid or has expired',400))
    }

    if (!user.correctPassword(req.body.oldpassword,user.password)){
        return next(new appError('The old password is wrong'));
    }

    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();

    sendToken(user,200,res);
});