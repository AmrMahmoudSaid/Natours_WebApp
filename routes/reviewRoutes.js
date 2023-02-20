const express = require('express');
const  reviewsController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/')
    .get(authController.protect , authController.restrictTo('admin') , reviewsController.getAllReview)
    .post(authController.protect,authController.restrictTo('user') , reviewsController.creatReview);

module.exports = router;


