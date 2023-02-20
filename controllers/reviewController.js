const Review = require('../models/reviewModel');
const catchAsync =require ('../utilities/catchAsync');
const appError = require('../utilities/appError');

exports.getAllReview = catchAsync(async (req,res,next)=>{
    const reviews = await Review.find();
    res.status(200).json({
        status : 'success',
        length : reviews.length,
        data : {
            reviews
        }
    });
});

exports.creatReview = catchAsync(async (req ,res , next)=>{
    const review = await Review.create({
        review : req.body.review ,
        rating : req.body.rating ,
        user : req.user._id ,
        tour : req.body.tour
    });

    res.status(201).json({
        status:'success',
        data : {
            review
        }
    })
});