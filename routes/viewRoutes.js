const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const router = express.Router();


router.get('/' ,authController.isLoggedIn,viewController.getOverview);
router.get('/tour/:slug',authController.protect ,viewController.getTour);
router.get('/login',authController.isLoggedIn,viewController.getLoginForm);
router.get('/signup',viewController.getSingupForm);
router.get('/me',authController.protect ,viewController.getAccount);
router.post('/submit-user-data',authController.protect,viewController.updataUserData)
module.exports = router;