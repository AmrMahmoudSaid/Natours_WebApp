const User = require('../models/userModel');
const catchAsync =require ('../utilities/catchAsync');
const appError = require('../utilities/appError');

const filterObj = (obj , ...allowedFiled) =>{
    const nweObject = {};
    Object.keys(obj).forEach(ele=> {
        if(allowedFiled.includes(ele)){
            nweObject[ele] = obj[ele];
        }
    })
    return nweObject;
}

exports.gerAlluser = catchAsync(async (req ,res , next) =>{
    const users = await User.find();
    res.status(200).json({
        status :'success' ,
        results : users.length,
        data : {
            users
        }
    });
});

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


exports.creatUser =(req ,res) =>{
    const  newID = users[users.length-1].id+1;
    const newUser = Object.assign({id : newID}, req.body );
    users.push(newUser);
    fs.writeFile(`./dev-data/data/users.json` , JSON.stringify(users), err=>{
        if(err){
            res.status(404).json({
                status : 'fail' ,
                message : 'Invalid'
            })
        }else {
            res.status(201).json({
                status :'success' ,
                data : {
                    newUser
                }
            })
        }
    })
}
exports.getUser = (req ,res)=>{
    const  idd =req.params.id;
    const user = users.find(el =>el._id ===idd);
    if (!user){
        res.status(404).json({
            status : 'fail' ,
            message : 'Invalid ID'
        })
    } else {
        res.status(200).json({
            status :'success' ,
            data : {
                user
            }
        })
    }
};

exports.deleteUser = (req , res) =>{
    const id = req.params.id ;
    const user =users.find(el => el._id === id);
    if(!user){
        res.status(404).json({
            status : 'fail' ,
            message : 'Invalid ID'
        })
    }else {
        res.status(204).json({
            status : 'success' ,
            data : null
        })
    }
};
exports.updateUser = (req , res) =>{
    const id = req.params.id ;
    const user =users.find(el => el._id === id);
    if(!user){
        res.status(404).json({
            status : 'fail' ,
            message : 'Invalid ID'
        })
    }else {
        res.status(200).json({
            status : 'success' ,
            message : '<Updated user hear...>'
        })
    }
};
