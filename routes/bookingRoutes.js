const express = require(`express`);
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const router = express.Router({mergeParams : true });
router.use(authController.protect);
router.get('/checkout-session/:tourID' , bookingController.getCheckoutSession);
router.use(authController.restrictTo('admin' , 'lead-guide'));
router
    .route('/')
    .get(bookingController.getallBooking)
    .post(bookingController.createBooking);
router.get('/tourBooking' , bookingController.gettourBookingUser);
router
    .route('/:id')
    .get(bookingController.getBooking)
    .post(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;