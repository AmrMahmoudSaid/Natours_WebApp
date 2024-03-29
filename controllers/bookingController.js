const catchAsync =require ('../utilities/catchAsync');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const Email = require("../utilities/email");
const factory = require('./handlerFactory');
const appError = require('../utilities/appError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
exports.getCheckoutSession = catchAsync(async (req , res , next) =>{
    const tour = await Tour.findById(req.params.tourID);
    const session = await stripe.checkout.sessions.create({
        payment_method_types : ['card'] ,
        // success_url: `${req.protocol}://${req.get('host')}/?tour=${
        //     req.params.tourID
        // }&user=${req.user.id}&price=${tour.price}`,
        success_url : `${req.protocol}://${req.get('host')}/my-tours`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email:req.user.email ,
        client_reference_id: req.params.tourID,
        line_items : [{
            // name : `${tour.name} Tour` ,
            // description : tour.summary ,
            // images:[`https://www.natours.dev/img/tours/tour-1-cover.jpg`],
            // currency : 'usd' ,
            price_data: {
                currency: 'usd',
                unit_amount: tour.price*100,
                product_data: {
                    name: `${tour.name} Tour`,
                    description: tour.summary,
                    images:[`https://www.natours.dev/img/tours/tour-1-cover.jpg`]
                },
            },
            quantity : 1
        }],
        mode: 'payment',
    })
    await new Email(req.user , req.originalUrl.split('?')[0]).sendPayment()
    res.status(200).json({
        status : 'success' ,
        session
    })
})

// exports.createBookingCheckout = catchAsync(async (req,res,next) =>{
//     //This is only Temporary
//     const {tour,user,price} = req.query;
//
//     if (!tour && !user && !price) return next();
//     await Booking.create({tour,user,price});
//     res.redirect(req.originalUrl.split('?')[0]);
// });
exports.gettourBookingUser = catchAsync(async (req,res,next) =>{
    const booking = await Booking.find({tour : req.params.tourId});
    const users = booking.map(el=>el.user);
    // const users = await User.find({_id : {$in : {usersIDs}}});
    console.log(users);
    res.status(200).json({
        status : 'success' ,
        users
    })
})
 const createBookingCheckout = async session =>{
    const tour = session.client_reference_id;
    const user = await User.findOne({
        email : session.customer_email
    }).id;
    const price = session.line_items[0].price_data.unit_amount;
     await Booking.create({tour,user,price});
 }
exports.webhookCheckout = (req , res , next ) =>{
    const signature = req.headers['stripe-signature'];
    let event;
    try{
        event = stripe.webhooks.constructEvent(req.body,signature,process.env.STRIPE_WEBHOOK_SECRET );

    }catch (err){
        return res.status(400).send(`webhook error : ${err.message}`);
    }
    if(event.type==='checkout.session.completed'){
        createBookingCheckout(event.data.object);
        res.status(200).json({received : true});
    }

};
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getallBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);