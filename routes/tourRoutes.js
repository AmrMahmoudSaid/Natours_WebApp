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
    .get(authController.protect,toursController.getAllTours)
    .post(toursController.creatTour);
router
    .route('/tour-stats')
    .get(toursController.getTourStats);
router
    .route('/top-5-tours')
    .get(toursController.aliasTopTours,toursController.getAllTours);
router
    .route('/:id')
    .get(toursController.getTour)
    .delete(
        authController.protect ,
        authController.restrictTo('admin' , 'lead-guide'),
        toursController.deleteTour
    )
    .patch(toursController.updateTour);

router
    .route('/monthly-plan/:year').get(toursController.getMonthyplan);

router.use('/:tourId/reviews' , reviewRouter);


module.exports =router;