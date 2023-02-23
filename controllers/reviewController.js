const Review = require('../models/reviewModel');
const catchAsync =require ('../utilities/catchAsync');
const appError = require('../utilities/appError');

exports.getAllReview = catchAsync(async (req,res,next)=>{
    let filter ={}
    if (req.params.tourId) filter ={tour : req.params.tourId};
    const reviews = await Review.find(filter);
    res.status(200).json({
        status : 'success',
        length : reviews.length,
        data : {
            reviews
        }
    });
});

exports.creatReview = catchAsync(async (req ,res , next)=>{
    //for nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;

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