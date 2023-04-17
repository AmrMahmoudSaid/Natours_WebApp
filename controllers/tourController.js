const  Tour = require('../models/tourModel');
// const {error} = require("ndp/tools/logger");
const catchAsync =require ('../utilities/catchAsync');
const appError = require('../utilities/appError');
const factory = require('./handlerFactory');
const multer = require("multer");
const sharp = require('sharp')
const multerStorage = multer.memoryStorage();
const multerFilter = (req ,file ,cb) =>{
    if (file.mimetype.startsWith('image')){
        cb(null,true);
    }else {
        cb(new appError('Not an image , please upload only images.' , 400),false);

    }
}
const upload = multer({
    storage : multerStorage ,
    fileFilter : multerFilter
});
//mix of photo 1 for cover 3 for tour images
exports.uploadTourimages = upload.fields([
    {name : 'imageCover' , maxCount : 1} ,
    {name : 'images' , maxCount : 3}
])
exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();

    // 1) Cover image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    // 2) Images
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
});
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

exports.getDistance = catchAsync(async (req , res , next) =>{
    const { latlng , unit} = req.params;
    const [lat , lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001 ;
    if (!lat||!lng) {
        next(new appError('pleasw provide lat and lng in the format lat,lng.',400));
    }
    const tours = await Tour.aggregate([
        {
            $geoNear : {
                near : {
                    type : 'Point',
                    coordinates : [lng *1 , lat * 1]
                },
                distanceField : 'distance',
                distanceMultiplier : multiplier
            }
        },
        {
            $project : {
                distance : 1,
                name : 1
            }
        }
    ]);
    res.status(200).json({
        status: 'success' ,
        results : tours.length ,
        data : {
            tours
        }
    });


});