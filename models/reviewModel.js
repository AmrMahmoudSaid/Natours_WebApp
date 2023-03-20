const  mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema =new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : [true , 'review must belong to a user']
    } ,
    tour : {
        type: mongoose.Schema.ObjectId,
        ref : 'Tour',
        required : [true , 'review must belong to a tour']
    } ,
    review : {
        type : String ,
        required : [true , 'Review can not be empty']
    } ,
    rating : {
        type : Number ,
        default : 4.5,
        min : 1,
        max : 5
    } ,
    createdAt : {
        type : Date ,
        default: Date.now()
    }
},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

reviewSchema.index({tour : 1 , user : 1} , {unique : true});
reviewSchema.pre(/^find/, function (next){
    this.populate({
        path: 'user' ,
        select : 'name photo'
    })
    //     .populate({
    //     path: 'tour' ,
    //     select : 'name'
    // });
    next();
}  );

reviewSchema.statics.calcAverageRating = async function (tourID) {

    const stats = await this.aggregate([
    {
        $match : {tour : tourID}
    },
    {
        $group :{
            _id : `$tour`,
            nRating : {$sum : 1},
            aveRating : {$avg : '$rating'}
        }
    }
    ]);
    if (stats.length>0){
        await Tour.findByIdAndUpdate(tourID , {
            ratingAverage :stats[0].aveRating ,
            ratingQuantity : stats[0].nRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourID , {
            ratingAverage :0 ,
            ratingQuantity : 4.5
        });
    }

};

reviewSchema.post('save' ,function () {
    this.constructor.calcAverageRating(this.tour);
});
reviewSchema.pre(/^findOneAnd/,async function (next){
    this.x= await this.findOne();
    console.log(this.x);
    next();
});
reviewSchema.post(/^findOneAnd/,async function (){
    await this.x.constructor.calcAverageRating(this.x.tour);
});
const review = mongoose.model('Review' , reviewSchema);

module.exports = review;
