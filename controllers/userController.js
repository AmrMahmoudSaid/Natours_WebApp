const User = require('../models/userModel');
const catchAsync =require ('../utilities/catchAsync');
const appError = require('../utilities/appError');
const factory = require('./handlerFactory');

const filterObj = (obj , ...allowedFiled) =>{
    const nweObject = {};
    Object.keys(obj).forEach(ele=> {
        if(allowedFiled.includes(ele)){
            nweObject[ele] = obj[ele];
        }
    })
    return nweObject;
}

exports.getMe = (req,res,next)=>{
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async(req , res ,next)=>{
    if (req.body.password || req.body.passwordConfirm){
        return next(new appError('This route is not for password updates. please use /changePassword', 400));
    }
    const filterBodyObj = filterObj(req.body , 'name' , 'email');
    const updateUser = await User.findByIdAndUpdate(req.user._id,filterBodyObj,{
        runValidators : true ,
        new : true
    });
    res.status(200).json({
        status : "success",
        user : updateUser
    });
});

exports.deleteMe = catchAsync(async (req , res , next) =>{
   await User.findByIdAndUpdate(req.user._id,{
       active : false
   });
   res.status(204).json({
       status : "success",
       data : null
   });
});
exports.creatUser =(req ,res) =>{
    res.status(500).json({
        status : 'error' ,
        message : 'this ROUTE is not defined , use /singup  '
    })
};

exports.gerAlluser = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.deleteUser = factory.deleteOne(User);

//Dont update password
exports.updateUser = factory.updateOne(User);