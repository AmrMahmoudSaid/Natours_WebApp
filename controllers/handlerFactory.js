const catchAsync = require("../utilities/catchAsync");
const appError = require("../utilities/appError");
const Tour = require("../models/tourModel");
const APIfeatures = require("../utilities/apiFeatures");
exports.deleteOne = Model =>catchAsync( async (req , res ,next) =>{
    console.log(req.params.id);
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc) {
        return next(new appError('No document found with that ID' ,404));
    }
    res.status(204).json({
        status : 'success' ,
        data : null
    })
});

exports.updateOne = Model => catchAsync( async (req , res, next) =>{
    const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
    })
    if(!doc) {
        return next(new appError('No document found with that ID' ,404));
    }
    res.status(200).json({
        status : 'success' ,
        data : {
            data : doc
        }
    })
});

exports.createOne  = Model =>catchAsync (async (req , res ) =>{
    const newTour = await Model.create(req.body);
    res.status(201).json({
        status: 'sucess',
        data: {
            tour: newTour
        }
    });
});

exports.getOne = (Model , popUlateOption) =>catchAsync(async (req ,res ,next)=>{

    let doc =  Model.findById(req.params.id);
    if (popUlateOption){
        doc = doc.populate(popUlateOption);
    }
    doc = await doc;
    if(!doc) {
        return next(new appError('No document found with that ID' ,404));
    }
    res.status(200).json({
        status: 'succes' ,
        data : {
            data : doc
        }
    });
});

exports.getAll = Model =>catchAsync(async (req ,res , next)=>{
    //EXECUTE Query
    let filter ={}
    if (req.params.tourId) filter ={tour : req.params.tourId}; // to get all review for tour
    const  featuers = new APIfeatures(Model.find(filter),req.query)
        .filter()
        .sorting()
        .fieldss()
        .pagination();
    const doc = await featuers.query;
    res.status(200).json({
        status: 'succes',
        results: doc.length,
        data: {
            data : doc
        }
    })
});