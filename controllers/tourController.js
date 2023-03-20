const  Tour = require('../models/tourModel');
// const {error} = require("ndp/tools/logger");
const catchAsync =require ('../utilities/catchAsync');
const appError = require('../utilities/appError');
const factory = require('./handlerFactory');


exports.aliasTopTours = (req ,res , next)=>{
    console.log(req.query);
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields= 'name,price,ratingAverage,summery,difficulty';
    console.log(req.query);
    next();
}

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour ,{path : 'reviews'});

exports.creatTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

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
//'/tours-within/:distance/center/:latlng/:unit'
exports.tourWithin =catchAsync(async (req, res , next)=>{
    const {distance ,latlng , unit} = req.params;
    const [lat , lng] = latlng.split(',');
    const radius = unit==='mi' ? distance / 3963.2 : distance / 6378.1;
    console.log(lat,lng,distance,unit);
    if (!lat||!lng) {
        next(new appError('pleasw provide lat and lng in the format lat,lng.',400));
    }
    const tours =await Tour.find({
        startLocation : { $geoWithin : {$centerSphere : [[lng,lat],radius]}}
    });
    res.status(200).json({
        status: 'success' ,
        results : tours.length ,
        data : {
            tours
        }
    });
});