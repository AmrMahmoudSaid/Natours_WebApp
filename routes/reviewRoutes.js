const express = require('express');
const  reviewsController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const router = express.Router({mergeParams : true });

router.route('/')
    .get(authController.protect  , reviewsController.getAllReview)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewsController.setTourUserId ,
        reviewsController.creatReview
    );

module.exports = router;

router.route('/:id')
    .get(reviewsController.getReview)
    .patch(reviewsController.updateReview)
    .delete(reviewsController.deleteReview);

