const  Tour = require('../models/tourModel');
const APIfeatures = require('../utilities/apiFeatures');
// const {error} = require("ndp/tools/logger");
const catchAsync =require ('../utilities/catchAsync');
const appError = require('../utilities/appError');
exports.aliasTopTours = (req ,res , next)=>{
    console.log(req.query);
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields= 'name,price,ratingAverage,summery,difficulty';
    console.log(req.query);
    next();
}

exports.getAllTours = catchAsync(async (req ,res)=>{
    //EXECUTE Query
    const  featuers = new APIfeatures(Tour.find(),req.query)
        .filter()
        .sorting()
        .fieldss()
        .pagination();
    const tours = await featuers.query;
    res.status(200).json({
        status: 'succes',
        results: tours.length,
        data: {
            tours
        }
    })
});

exports.getTour =catchAsync(async (req ,res ,next)=>{
    const tour = await Tour.findById(req.params.id);
    if(!tour) {
        return next(new appError('No tour found with that ID' ,404));
    }
    res.status(200).json({
        status: 'succes' ,
        data : {
            tour : tour
        }
    })
});

exports.creatTour = catchAsync (async (req , res ) =>{
    const newTour = await Tour.create(req.body).catch();
    res.status(201).json({
        status: 'sucess',
        data: {
            tour: newTour
        }
    });
});

exports.updateTour =catchAsync( async (req , res) =>{
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
    })
    if(!tour) {
        return next(new appError('No tour found with that ID' ,404));
    }
    res.status(200).json({
        status : 'success' ,
        data : {
            tour
        }
    })
});

exports.deleteTour =catchAsync( async (req , res) =>{
    console.log(req.params.id);
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour) {
        return next(new appError('No tour found with that ID' ,404));
    }
    res.status(200).json({
        status : 'success' ,
        data : null
    })
});
exports.getTourStats = catchAsync(async (req ,res)=>{
    const stats = await Tour.aggregate([
        {
            $match: {ratingAverage: {$gte: 4.5}}
        },
        {
            $group: {
                _id: { $toUpper :'$difficulty'},
                tours :{$push: '$name'},
                numTours: {$sum: 1},
                numRating: {$sum: '$ratingsQuantity'},
                avgrating: {$avg: '$ratingAverage'},
                avgPrice: {$avg: '$price'},
                maxPrice: {$max: '$price'},
                minPrice: {$min: '$price'},
                minrating: {$min : '$ratingAverage'}
            }
        },
        {
            $sort : {avgPrice :1}
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: stats
    });
});
exports.getMonthyplan = catchAsync(async (req ,res)=>{
    const year = req.params.year * 1 ;
    const monthPlan = await Tour.aggregate([
        {
            $unwind : '$startDates'
        },
        {
            $match : {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group : {
                _id: {$month :'$startDates'},
                countOfTours : {$sum: 1},
                tours : {$push :'$name'},

            }
        },
        {
            $sort : {countOfTours : -1}
        },
        {
            $addFields :{month : '$_id'}
        },
        {
            $project: {
                _id :0
            }
        },
        {
            $limit : 1
        }

    ])
    res.status(200).json({
        status: 'success',
        data: monthPlan
    });
});