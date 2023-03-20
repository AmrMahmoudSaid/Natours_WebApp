const express = require(`express`);
const  toursController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');
const router = express.Router();
// router.param('id' , (req, res ,next ,vel)=>{
//     toursController.checkID(req ,res,next,vel);
// })
router
    .route('/')
    .get(toursController.getAllTours)
    .post(authController.protect,authController.restrictTo('admin','lead-guide'),toursController.creatTour);
router
    .route('/tour-stats')
    .get(toursController.getTourStats);
router
    .route('/top-5-tours')
    .get(toursController.aliasTopTours,toursController.getAllTours);
router
    .route('/tours-within/:distance/center/:latlng/:unit')
    .get(toursController.tourWithin);
router
    .route('/distances/:latlng/unit/:unit')
    .get(toursController.getDistance);
router
    .route('/:id')
    .get(toursController.getTour)
    .delete(
        authController.protect ,
        authController.restrictTo('admin' , 'lead-guide'),
        toursController.deleteTour
    )
    .patch(
        authController.protect ,
        authController.restrictTo('admin' , 'lead-guide'),
        toursController.updateTour
    );

router
    .route('/monthly-plan/:year').get(
    authController.protect ,
    authController.restrictTo('admin' , 'lead-guide' , 'guide'),
    toursController.getMonthyplan
);

router.use('/:tourId/reviews' , reviewRouter);


module.exports =router;