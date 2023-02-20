const  mongoose = require('mongoose');
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
reviewSchema.pre(/^find/, function (next){
    this.populate({
        path: 'user' ,
        select : 'name photo'
    }).populate({
        path: 'tour' ,
        select : 'name'
    });
    next();
});
const review = mongoose.model('review' , reviewSchema);

module.exports = review;
