const Review = require('../models/reviewModel');
// const catchAsync =require ('../utilities/catchAsync');
// const appError = require('../utilities/appError');
const factory = require('./handlerFactory');

exports.getAllReview = factory.getAll(Review);

exports.setTourUserId = (req ,res , next) =>{
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
}

exports.getReview = factory.getOne(Review);

exports.creatReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);