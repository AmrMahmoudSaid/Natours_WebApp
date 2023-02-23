const express = require('express');
const  reviewsController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const router = express.Router({mergeParams : true });

router.route('/')
    .get(authController.protect  , reviewsController.getAllReview)
    .post(authController.protect,authController.restrictTo('user') , reviewsController.creatReview);

module.exports = router;


