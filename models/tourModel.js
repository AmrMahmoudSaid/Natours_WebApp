const  mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [ true , 'A tour must have a name'] ,
        unique : true,
        trim : true
    },
    slug : String,
    duration :{
        type : Number ,
        required : [true , 'A tour must have a duration']
    },
    maxGroupSize:{
      type : Number ,
      required :[true , 'A tour must have a group size']
    },
    difficulty:{
        type : String ,
        required: [true, 'A tour must have a difficulty'],
        enum : [{
            values : ['easy','medium','difficult'],
            message :'Difficulty is either : easy , medium, difficult'
        }]
    },
    ratingAverage : {
        type : Number,
        default : 4.5,
        min : [1,'Rating must be above 1.0'],
        max : [5, 'Rating must be below 5.0'],
        set : val => Math.round(val * 10) /10
    },
    ratingQuantity:{
        type : Number,
        default : 0
    },
    price : {
        type : Number ,
        required : [ true , 'A tour must have a name']
    },
    priceDiscount : Number,
    summary :{
        type:String,
        trim : true, //delete space in start and end
        required : [true ,'A tour must have a summery']
    },
    description :{
        type : String ,
        trim : true
    },
    imageCover:{
        type : String ,
        required : [true , 'A tour must have a cover image']
    } ,
    images : [String],
    createsAt :{
        type :Date,
        default : Date.now()
    },
    startDates : [Date],
    secretTour : {
        type : Boolean ,
        default : false
    } ,
    startLocation : {
        type:{
            type : String,
            default : 'Point',
            enum : ['Point']
        },
        coordinates : [Number],
        address : String,
        description : String
    },
    locations:[{
        type:{
            type : String,
            default : 'Point',
            enum : ['Point']
        },
        coordinates : [Number],
        address : String,
        description : String,
        day : Number
    }],
    guides : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'User'
        }
    ]
},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

tourSchema.index({price : 1 ,ratingAverage : -1});
tourSchema.index({slug : 1});
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration/7;
});
tourSchema.virtual('reviews',{
    ref : 'Review' ,
    foreignField : 'tour' ,
    localField : '_id'
})
//Document Midddelware run before save or creat 
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name , {lower : true});
    next();
});
tourSchema.pre(/^find/, function (next){
    this.find({secretTour : { $ne : true}});
    next();
});
tourSchema.pre(/^find/, function (next){
    this.populate({
        path: 'guides' ,
        select : '-__v -passwordChangedAt'

    });
    next();
});

// tourSchema.pre('findOne', function (next){
//     this.find({secretTour : { $ne : true}});
//     next();
// });
const  Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
