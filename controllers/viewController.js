const AppError = require('../utilities/appError');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking  = require('../models/bookingModel');
const catchAsync = require('../utilities/catchAsync');

exports.getOverview =catchAsync( async (req , res )=>{
    const tours = await Tour.find();
    res.status(200).render('overview' , {
        title : 'All Tours' ,
        tours
    });
});
exports.getTour = catchAsync(async (req ,res ,next  ) => {
    const tour = await Tour.findOne({slug : req.params.slug}).populate(
        {
            path : 'reviews' ,
            fields : 'review rating user'
        }
    );
    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }
    res

        .set(
            'Content-Security-Policy',
            "default-src 'self' https://*.mapbox.com https://js.stripe.com/v3/;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://js.stripe.com/v3/ https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
        )
        .render('tour',{
        title : `${tour.name} Tour`,
        tour
    });
});

exports.getLoginForm = catchAsync(async (req , res , next)=>{
    res.status(200).render('login' , {
        title : 'Log into your Account'
    })
});

exports.getSingupForm = catchAsync(async (req , res , next)=>{
    res.status(200).render('singup' , {
        title : 'Sign up'
    })
});

exports.getAccount = catchAsync(async (req , res )=>{
    res.status(200).render('account' , {
        title : 'Your account'
    })
});

exports.updataUserData=catchAsync(async (req , res , next)=>{
    const updatedUser = await User.findByIdAndUpdate(req.user.id,{
        name: req.body.name,
        email: req.body.email
    },{
        new : true ,
        runValidators : true
    });
    res.status(200).render('account' , {
        title : 'Your account',
        user : updatedUser
    })
});

exports.getMyTours = catchAsync(async (req ,res , next) =>{
    const booking = await Booking.find({user : req.user.id});
    //to get array of tours id by map
    const tourIDs = booking.map(el=>el.tour);
    const tours = await Tour.find({_id : { $in: tourIDs }});
    res.status(200).render('overview' , {
        title : 'My Tours' ,
        tours
    });
})